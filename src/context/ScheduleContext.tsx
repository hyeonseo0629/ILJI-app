// C:/LGE/ILJI-app/src/context/ScheduleContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import api from '../lib/api';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import { useSession } from '@/hooks/useAuth';

// --- 타입 정의 (TypeScript의 장점!) ---

// 서버에서 받아오는 이벤트 데이터의 원본 형태
interface RawScheduleEvent {
    id: number;
    title: string;
    startTime: string; // "2024-05-21T09:00:00"
    endTime: string;   // "2024-05-21T10:00:00"
    isAllDay: boolean;
    description: string | null;
    location: string | null;
    tagId: number | null;
    createdAt: string;
    updatedAt: string;
}

// Context가 제공할 값들의 타입
interface ScheduleContextType {
    events: Schedule[];
    tags: Tag[];
    loading: boolean;
    error: Error | null;
    fetchSchedules: () => void;
    updateSchedule: (schedule: Schedule) => Promise<void>;
    createSchedule: (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
    deleteSchedule: (scheduleId: number) => Promise<void>;
    createTag: (tagData: { label: string; color: string }) => Promise<Tag>;
    updateTag: (tagToUpdate: Tag) => Promise<void>;
    deleteTag: (tagId: number) => Promise<void>;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

// --- Context 생성 ---

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useSchedule must be used within a ScheduleProvider");
    }
    return context;
};

// --- Provider 컴포넌트 ---

interface ScheduleProviderProps {
    children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
    const { session } = useSession();
    const userId = session?.user?.id;

    const [events, setEvents] = useState<Schedule[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    console.log("ScheduleProvider rendered. Initial loading state:", loading); // 추가

    const formatRawSchedule = useCallback((rawEvent: RawScheduleEvent): Schedule => {
        if (!userId) {
            throw new Error("User not logged in, cannot format schedule");
        }
        return {
            id: rawEvent.id,
            title: rawEvent.title,
            startTime: new Date(rawEvent.startTime),
            endTime: new Date(rawEvent.endTime),
            isAllDay: rawEvent.isAllDay,
            description: rawEvent.description ?? '',
            location: rawEvent.location ?? '',
            tagId: rawEvent.tagId ?? 0,
            userId: userId,
            rrule: '',
            createdAt: new Date(rawEvent.createdAt),
            updatedAt: new Date(rawEvent.updatedAt),
            calendarId: 1,
        };
    }, [userId]);

    const fetchSchedules = useCallback(async () => {
        console.log("fetchSchedules called for userId:", userId); // 추가
        if (!userId) {
            console.warn("User ID is not available. Cannot fetch schedules.");
            setLoading(false);
            console.log("setLoading(false) due to no userId."); // 추가
            return;
        }

        setLoading(true);
        console.log("setLoading(true) before fetching."); // 추가
        try {
            const schedulesUrl = '/schedules';
            const tagsUrl = '/tags';
            console.log("Requesting schedules from URL:", schedulesUrl);
            console.log("Requesting tags from URL:", tagsUrl);

            const [schedulesResponse, tagsResponse] = await Promise.all([
                api.get<RawScheduleEvent[]>(schedulesUrl),
                api.get<Tag[]>(tagsUrl)
            ]);

            console.log("Schedules API response data:", schedulesResponse.data);
            console.log("Tags API response data:", tagsResponse.data);

            const userTagIds = new Set(tagsResponse.data.map(tag => tag.id));

            const mySchedules = schedulesResponse.data.filter(event =>
                event.tagId === null || userTagIds.has(event.tagId!)
            );

            const formattedEvents = mySchedules.map(formatRawSchedule);
            setEvents(formattedEvents);
            const processedTags = tagsResponse.data.map(tag => ({
                ...tag,
                color: (tag.color && tag.color.trim() !== '') ? tag.color : '#FF6B6B'
            }));
            setTags(processedTags);
            setError(null);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios error during fetchSchedules:", err.message);
                if (err.response) {
                    console.error("Axios error response status:", err.response.status);
                    console.error("Axios error response data:", err.response.data);
                    console.error("Axios error response config URL:", err.response.config.url);
                } else if (err.request) {
                    console.error("Axios error request:", err.request);
                } else {
                    console.error("Axios error config:", err.config);
                }

                if (err.response?.status === 404) {
                    console.warn(`404 Not Found for user ${userId}: 서버에 데이터가 없는 것으로 간주합니다.`, err.response?.config?.url);
                    setEvents([]);
                    setTags([]);
                    setError(null);
                } else {
                    setError(err as Error);
                    Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
                }
            } else {
                console.error("초기 데이터 로딩 실패 (non-Axios error):", err);
                setError(err as Error);
                Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
            }
        } finally {
            setLoading(false);
            console.log("setLoading(false) in finally block."); // 추가
        }
    }, [userId, formatRawSchedule]);

    useEffect(() => {
        console.log("ScheduleProvider useEffect triggered. userId:", userId); // 추가
        if (userId) {
            fetchSchedules();
        } else {
            // 로그아웃 상태일 때 데이터 초기화
            setEvents([]);
            setTags([]);
            setLoading(false);
            console.log("setLoading(false) due to no userId in useEffect."); // 추가
        }
    }, [userId, fetchSchedules]);

    const updateSchedule = useCallback(async (scheduleToUpdate: Schedule) => {
        if (!userId) return;
        try {
            const payload = {
                ...scheduleToUpdate,
                userId: userId, // 동적 userId 사용
                startTime: scheduleToUpdate.isAllDay
                    ? format(scheduleToUpdate.startTime, "yyyy-MM-dd'T'00:00:00")
                    : format(scheduleToUpdate.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: scheduleToUpdate.isAllDay
                    ? format(scheduleToUpdate.endTime, "yyyy-MM-dd'T'23:59:59")
                    : format(scheduleToUpdate.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
                tagId: scheduleToUpdate.tagId === 0 ? null : scheduleToUpdate.tagId,
            };

            const response = await api.put<RawScheduleEvent>(`/schedules/${scheduleToUpdate.id}`, payload);
            const updatedEvent = formatRawSchedule(response.data);

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios 업데이트 에러:", err.message);
                if (err.config) {
                    const { method, baseURL, url } = err.config;
                    console.error("요청 정보:", method?.toUpperCase(), (baseURL ?? '') + (url ?? ''));
                }
            } else {
                console.error("일정 업데이트 실패:", err);
            }
            Alert.alert("업데이트 실패", "서버와 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
        }
    }, [userId, formatRawSchedule]);

    const createSchedule = useCallback(async (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        if (!userId) return;
        try {
            const payload = {
                ...newScheduleData,
                startTime: newScheduleData.isAllDay
                    ? format(newScheduleData.startTime, "yyyy-MM-dd'T'00:00:00")
                    : format(newScheduleData.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: newScheduleData.isAllDay
                    ? format(newScheduleData.endTime, "yyyy-MM-dd'T'23:59:59")
                    : format(newScheduleData.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
                tagId: newScheduleData.tagId === 0 ? null : newScheduleData.tagId,
            };

            // 2. 변환된 payload를 백엔드 서버에 전송합니다.
            const response = await api.post<RawScheduleEvent>('/schedules', payload);
            const newEvent = formatRawSchedule(response.data);

            // 4. 화면의 상태(State)에 새 일정을 추가하여 즉시 반영합니다.
            setEvents(prevEvents => [...prevEvents, newEvent]);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios 생성 에러:", err.message);
                if (err.config) {
                    const { method, baseURL, url } = err.config;
                    console.error("요청 정보:", method?.toUpperCase(), (baseURL ?? '') + (url ?? ''));
                }
            } else {
                console.error("일정 생성 실패:", err);
            }
            Alert.alert("생성 실패", "서버와 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
        }
    }, [userId, formatRawSchedule]);

    const deleteSchedule = useCallback(async (scheduleId: number) => {
        if (!userId) return;
        try {
            // 1. 서버에 삭제 요청을 보냅니다. (DELETE /schedules/{id})
            await api.delete(`/schedules/${scheduleId}`);

            // 2. 서버에서 성공적으로 삭제되면, 화면(events 상태)에서도 해당 일정을 제거합니다.
            setEvents(prevEvents => prevEvents.filter(event => event.id !== scheduleId));

        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios 삭제 에러:", err.message);
            } else {
                console.error("일정 삭제 실패:", err);
            }
            Alert.alert("삭제 실패", "일정을 삭제하는 중 오류가 발생했습니다.");
        }
    }, [userId]);

    const createTag = useCallback(async (tagData: { label: string, color: string }): Promise<Tag> => {
        if (!userId) throw new Error("User not logged in");
        try {
            const payload = { ...tagData, userId: userId }; // 동적 userId 사용
            const response = await api.post<Tag>('/tags', payload);
            const newTag = response.data;

            // 2. Context의 tags 상태를 업데이트하여 앱 전체에 변경사항을 반영합니다.
            setTags(prevTags => [...prevTags, newTag]);

            // 3. 새로 생성된 태그 객체를 반환하여, 호출한 쪽에서 바로 사용할 수 있게 합니다.
            return newTag;
        } catch (err) {
            console.error("태그 생성 실패:", err);
            Alert.alert("생성 실패", "새로운 태그를 만드는 중 오류가 발생했습니다.");
            // 에러를 다시 던져서 호출한 쪽(handleSaveTag)에서 catch 할 수 있도록 합니다.
            throw err;
        }
    }, [userId]);

    const updateTag = useCallback(async (tagToUpdate: Tag) => {
        if (!userId) return;
        try {
            const payload = { ...tagToUpdate, userId: userId }; // 동적 userId 사용
            const response = await api.put<Tag>(`/tags/${tagToUpdate.id}`, payload);
            const updatedTag = response.data;
            setTags(prevEvents =>
                prevEvents.map(tag => (tag.id === updatedTag.id ? updatedTag : tag))
            );
        } catch (err) {
            console.error("태그 업데이트 실패:", err);
            Alert.alert("업데이트 실패", "태그를 수정하는 중 오류가 발생했습니다.");
            throw err;
        }
    }, [userId]);

    const deleteTag = useCallback(async (tagId: number) => {
        if (!userId) return;
        try {
            await api.delete(`/tags/${tagId}`, { data: { userId: userId } }); // 동적 userId 사용
            await fetchSchedules();
        } catch (err) {
            console.error("태그 삭제 실패:", err);
            Alert.alert("삭제 실패", "태그를 삭제하는 중 오류가 발생했습니다.");
            throw err;
        }
    }, [userId, fetchSchedules]);

    const value = {
        events,
        tags,
        loading,
        error,
        fetchSchedules,
        updateSchedule,
        createSchedule,
        deleteSchedule,
        createTag,
        updateTag,
        deleteTag,
        selectedDate,
        setSelectedDate,
    };

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
