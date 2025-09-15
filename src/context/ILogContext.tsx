import React, {createContext, useContext, useState, useEffect, useCallback, ReactNode} from 'react';
import axios from 'axios';
import {Alert} from 'react-native';
import api from '../lib/api';
import {useSession} from '@/hooks/useAuth';
import {ILog, ILogCreateRequestFrontend, ILogUpdateRequest, RawILog} from '@/src/types/ilog';

// --- Context 타입 정의 ---
interface ILogContextType {
    ilogs: ILog[];
    loading: boolean;
    error: Error | null;
    fetchILogs: () => Promise<void>;
    createILog: (data: { request: ILogCreateRequestFrontend; images?: File[] }) => Promise<ILog | null>;
    deleteILog: (logId: number) => Promise<void>;
    getILogByDate: (date: Date) => Promise<ILog | null>;
    getPreviousILog: (date: Date) => Promise<ILog | null>;
    getNextILog: (date: Date) => Promise<ILog | null>;
    updateILog: (logId: number, request: ILogUpdateRequest, newImages?: File[]) => Promise<ILog | null>;
}

const ILogContext = createContext<ILogContextType | undefined>(undefined);

export const useILog = () => {
    const context = useContext(ILogContext);
    if (!context) {
        throw new Error("useILog must be used within an ILogProvider");
    }
    return context;
};

// --- Provider 컴포넌트 ---
interface ILogProviderProps {
    children: ReactNode;
}

export function ILogProvider({children}: ILogProviderProps) {
    const {session} = useSession();
    const userId = session?.user?.id;

    const [ilogs, setIlogs] = useState<ILog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const formatRawILog = useCallback((raw: RawILog): ILog => ({
        id: raw.id,
        userId: raw.userId,
        writerNickname: raw.writerNickname,
        writerProfileImage: raw.writerProfileImage,
        logDate: new Date(raw.logDate),
        content: raw.content,
        images: raw.images,
        visibility: raw.visibility,
        friendTags: raw.friendTags,
        tags: raw.tags,
        likeCount: raw.likeCount,
        commentCount: raw.commentCount,
        createdAt: new Date(raw.createdAt),
    }), []);

    const fetchILogs = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await api.get<RawILog[]>('/i-log');
            const formatted = response.data.map(formatRawILog);
            setIlogs(formatted);
            console.log("Fetched ILogs:", formatted); // Added for debugging
            setError(null);
        } catch (err) {
            console.error("i-log 목록 로딩 실패:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    useEffect(() => {
        if (userId) {
            fetchILogs();
        }
    }, [userId, fetchILogs]);

    const createILog = useCallback(async (data: {
        request: ILogCreateRequestFrontend;
        images?: File[]
    }): Promise<ILog | null> => {
        if (!userId) return null;
        setLoading(true);

        console.log("createILog - request data:", data.request);
        console.log("createILog - images data:", data.images);
        if (data.images) {
            data.images.forEach((image, index) => {
                console.log(`createILog - image[${index}]:`, image); // Log the entire image object
            });
        }

        const formData = new FormData();

        // The request object already has visibility as a string from frontend
        const formattedRequest = {
            ...data.request,
            logDate: data.request.logDate.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
        };
        formData.append('request', new Blob([JSON.stringify(formattedRequest)], { type: "application/json" }));
        if (data.images) {
            data.images.forEach(image => {
                formData.append('images', image);
            });
        }

        // Log FormData content for debugging
        for (let pair of formData.entries()) {
            console.log(`FormData Entry - ${pair[0]}:`, pair[1]);
        }

        try {
            const response = await api.post<RawILog>('/i-log', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newLog = formatRawILog(response.data);
            setIlogs(prev => [newLog, ...prev].sort((a, b) => b.logDate.getTime() - a.logDate.getTime()));
            return newLog;
        } catch (err) {
            console.error("i-log 생성 실패:", err);
            Alert.alert("오류", "일기를 생성하는 데 실패했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    const deleteILog = useCallback(async (logId: number) => {
        if (!userId) return;
        try {
            await api.delete(`/i-log/${logId}`);
            setIlogs(prev => prev.filter(log => log.id !== logId));
        } catch (err) {
            console.error(`i-log (id: ${logId}) 삭제 실패:`, err);
            Alert.alert("오류", "일기를 삭제하는 데 실패했습니다.");
        }
    }, [userId]);

    const getILogByDate = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        try {
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const response = await api.get<RawILog>(`/i-log/date/${dateStr}`);
            return formatRawILog(response.data);
        } catch (err) {
            // 404는 오류가 아닐 수 있으므로 콘솔에만 기록
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                console.log(`No i-log found for date: ${date.toISOString().split('T')[0]}`);
            } else {
                console.error(`i-log (date: ${date.toISOString().split('T')[0]}) 조회 실패:`, err);
            }
            return null;
        }
    }, [userId, formatRawILog]);

    const getPreviousILog = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        try {
            const dateStr = date.toISOString().split('T')[0];
            const response = await api.get<RawILog>(`/i-log/previous/${dateStr}`);
            return formatRawILog(response.data);
        } catch (err) {
            return null; // 단순히 이전/다음 일기가 없는 경우이므로 오류 처리는 하지 않음
        }
    }, [userId, formatRawILog]);

    const getNextILog = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        try {
            const dateStr = date.toISOString().split('T')[0];
            const response = await api.get<RawILog>(`/i-log/next/${dateStr}`);
            return formatRawILog(response.data);
        } catch (err) {
            return null; // 단순히 이전/다음 일기가 없는 경우이므로 오류 처리는 하지 않음
        }
    }, [userId, formatRawILog]);

    const updateILog = useCallback(async (logId: number, request: ILogUpdateRequest, newImages?: File[]): Promise<ILog | null> => {
        if (!userId) return null;
        setLoading(true);

        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], { type: "application/json" }));
        if (newImages) {
            newImages.forEach(image => {
                formData.append('newImages', image);
            });
        }

        try {
            const response = await api.put<RawILog>(`/i-log/${logId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const updatedLog = formatRawILog(response.data);
            setIlogs(prev => prev.map(log => log.id === logId ? updatedLog : log));
            return updatedLog;
        } catch (err) {
            console.error(`i-log (id: ${logId}) 업데이트 실패:`, err);
            Alert.alert("오류", "일기를 업데이트하는 데 실패했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    const value = {
        ilogs,
        loading,
        error,
        fetchILogs,
        createILog,
        deleteILog,
        getILogByDate,
        getPreviousILog,
        getNextILog,
        updateILog,
    };

    return (
        <ILogContext.Provider value={value}>
            {children}
        </ILogContext.Provider>
    );
}


