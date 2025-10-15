import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import api from '../lib/api';
import { useSession } from '@/hooks/useAuth';
import { ILog, ILogCreateRequestFrontend, ILogUpdateRequest, RawILog } from '@/src/types/ilog';

// --- Context 타입 정의 ---
interface ILogContextType {
    ilogs: ILog[];
    loading: boolean;
    error: Error | null;
    fetchILogs: () => Promise<void>;
    createILog: (data: { request: ILogCreateRequestFrontend; images?: any[] }) => Promise<ILog | null>;
    deleteILog: (logId: number) => Promise<void>;
    getILogByDate: (date: Date) => Promise<ILog | null>;
    getPreviousILog: (date: Date) => Promise<ILog | null>;
    getNextILog: (date: Date) => Promise<ILog | null>;
    updateILog: (logId: number, request: ILogUpdateRequest) => Promise<ILog | null>;
}

const ILogContext = createContext<ILogContextType | undefined>(undefined);

export const useILog = () => {
    const context = useContext(ILogContext);
    if (!context) throw new Error("useILog must be used within an ILogProvider");
    return context;
};

// --- Provider 컴포넌트 ---
interface ILogProviderProps {
    children: ReactNode;
}

export function ILogProvider({ children }: ILogProviderProps) {
    const { session } = useSession();
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
        images: raw.images.map(url => {
            const regex = /\/o\/(.*?)(?:\?|$)/;
            const match = url.match(regex);
            if (match && match[1]) {
                const objectPath = match[1];
                const encodedObjectPath = objectPath.replace(/\//g, '%2F');
                return url.replace(objectPath, encodedObjectPath);
            }
            return url;
        }),
        visibility: Number(raw.visibility),
        friendTags: raw.friendTags,
        likeCount: raw.likeCount,
        commentCount: raw.commentCount,
        createdAt: new Date(raw.createdAt),
    }), []);

    const fetchILogs = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await api.get<RawILog[]>('/mobile/i-log', {
                timeout: 30000 // I-Log 목록 조회에만 30초 타임아웃 적용
            });
            setIlogs(response.data.map(formatRawILog).sort((a, b) => b.logDate.getTime() - a.logDate.getTime()));
            setError(null);
        } catch (err) {
            console.error("i-log 목록 로딩 실패:", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    useEffect(() => {
        if (userId) fetchILogs();
    }, [userId, fetchILogs]);

    const createILog = useCallback(async (data: { request: ILogCreateRequestFrontend; images?: any[] }): Promise<ILog | null> => {
        if (!userId) return null;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('request', JSON.stringify(data.request));
            data.images?.forEach((image, idx) => {
                formData.append('images', {
                    uri: image.path,
                    name: image.filename || `image-${Date.now()}-${idx}.jpg`,
                    type: image.mime || 'image/jpeg',
                } as any);
            });
            const response = await api.post<RawILog>('/mobile/i-log', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newLog = formatRawILog(response.data);
            setIlogs(prev => [newLog, ...prev].sort((a, b) => b.logDate.getTime() - a.logDate.getTime()));
            return newLog;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("--- Axios Error Details ---", err.response.data);
            } else {
                console.error("--- Non-Axios Error ---", err);
            }
            Alert.alert("오류", "일기를 생성하는 데 실패했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    const deleteILog = useCallback(async (logId: number) => {
        if (!userId) return;
        try {
            await api.delete(`/mobile/i-log/${logId}`, {});
            setIlogs(prev => prev.filter(log => log.id !== logId));
        } catch (err) {
            console.error(`i-log (id: ${logId}) 삭제 실패:`, err);
            Alert.alert("오류", "일기를 삭제하는 데 실패했습니다.");
        }
    }, [userId]);

    const getILogByDate = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        const dateStr = date.toISOString().split('T')[0];
        try {
            const response = await api.get<RawILog>(`/mobile/i-log/date/${dateStr}`);
            return formatRawILog(response.data);
        } catch (err) {
            return null;
        }
    }, [userId, formatRawILog]);

    const getPreviousILog = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        const dateStr = date.toISOString().split('T')[0];
        try {
            const response = await api.get<RawILog>(`/mobile/i-log/previous/${dateStr}`);
            return formatRawILog(response.data);
        } catch {
            return null;
        }
    }, [userId, formatRawILog]);

    const getNextILog = useCallback(async (date: Date): Promise<ILog | null> => {
        if (!userId) return null;
        const dateStr = date.toISOString().split('T')[0];
        try {
            const response = await api.get<RawILog>(`/mobile/i-log/next/${dateStr}`);
            return formatRawILog(response.data);
        } catch {
            return null;
        }
    }, [userId, formatRawILog]);

    const updateILog = useCallback(async (logId: number, request: ILogUpdateRequest): Promise<ILog | null> => {
        if (!userId) return null;
        setLoading(true);
        try {
            const formData = new FormData();

            // 1. DTO에 맞게 request JSON을 재구성합니다.
            const requestData = {
                content: request.content,
                visibility: request.visibility,
                existingImageUrls: request.existingImageUrls || []
            };
            formData.append('request', JSON.stringify(requestData));

            // 2. 새로 추가된 파일만 images 파트에 추가합니다.
            request.newImageAssets?.forEach((image, index) => {
                formData.append('images', {
                    uri: image.uri,
                    name: image.fileName || `image-${Date.now()}-${index}.jpg`,
                    type: image.mimeType || 'image/jpeg',
                } as any);
            });

            const response = await api.put<RawILog>(`/mobile/i-log/${logId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updatedLog = formatRawILog(response.data);
            setIlogs(prev => prev.map(log => log.id === logId ? updatedLog : log).sort((a, b) => b.logDate.getTime() - a.logDate.getTime()));
            return updatedLog;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("--- Axios Error Details for Update ---", err.response.data);
            }
            console.error(`i-log (id: ${logId}) 업데이트 실패:`, err);
            Alert.alert("오류", "일기를 업데이트하는 데 실패했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawILog]);

    const value: ILogContextType = {
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