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
    id: number | string;
    title: string;
    startTime: string; // "2024-05-21T09:00:00"
    endTime: string;   // "2024-05-21T10:00:00"
    isAllDay: boolean;
    description: string | null;
    location: string | null;
    tagId: number | null;
    rrule: string;
    createdAt: string;
    updatedAt: string;
    calendarId: number;
    userId: number;
}

// Context가 제공할 값들의 타입
interface ScheduleContextType {
    events: Schedule[];
    tags: Tag[];
    loading: boolean;
    error: Error | null;
    fetchSchedules: (startDate: Date, endDate: Date) => void; // Updated signature
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
    const userId = session?.user?.id; // 로그인한 사용자의 DB ID를 가져옵니다.

    const [events, setEvents] = useState<Schedule[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatRawSchedule = useCallback((rawEvent: RawScheduleEvent): Schedule => {
        return {
            id: rawEvent.id,
            title: rawEvent.title,
            startTime: new Date(rawEvent.startTime),
            endTime: new Date(rawEvent.endTime),
            isAllDay: rawEvent.isAllDay,
            description: rawEvent.description ?? '',
            location: rawEvent.location ?? '',
            tagId: rawEvent.tagId ?? 0,
            userId: rawEvent.userId,
            rrule: rawEvent.rrule,
            createdAt: new Date(rawEvent.createdAt),
            updatedAt: new Date(rawEvent.updatedAt),
            calendarId: rawEvent.calendarId,
        };
    }, []);

    const fetchSchedules = useCallback(async (startDate: Date, endDate: Date) => {
        console.log(`Fetching schedules from /period for userId: ${userId}`);
        if (!userId) {
            console.warn("User ID is not available.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null); // Reset error state

        try {
            const schedulesUrl = '/schedules/period';
            const tagsUrl = '/tags'; // Still need tags for filtering/display
            const params = new URLSearchParams();
            params.append('start', format(startDate, 'yyyy-MM-dd'));
            params.append('end', format(endDate, 'yyyy-MM-dd'));

            const [schedulesResponse, tagsResponse] = await Promise.all([
                api.get<RawScheduleEvent[]>(schedulesUrl, { params }),
                api.get<Tag[]>(tagsUrl)
            ]);

            const formattedEvents = schedulesResponse.data.map(formatRawSchedule);
            setEvents(formattedEvents);

            const processedTags = tagsResponse.data.map(tag => ({
                ...tag,
                color: (tag.color && tag.color.trim() !== '') ? tag.color : '#FF6B6B'
            }));
            setTags(processedTags);

        } catch (err) {
            // Generic error handling, but no fallback.
            console.error("Failed to fetch schedules:", err);
            setError(err as Error);
            Alert.alert("오류", "일정을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [userId, formatRawSchedule]);

    useEffect(() => {
        if (userId) {
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            fetchSchedules(startDate, endDate);
        } else {
            setEvents([]);
            setTags([]);
            setLoading(false);
        }
    }, [userId, fetchSchedules]);

    const updateSchedule = useCallback(async (scheduleToUpdate: Schedule) => {
        if (!userId) return;
        try {
            const payload = {
                ...scheduleToUpdate,
                rrule: scheduleToUpdate.rrule ? scheduleToUpdate.rrule.replace(/(\r\n|\n|\r)/gm, "") : '',
                startTime: format(scheduleToUpdate.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: format(scheduleToUpdate.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
                tagId: scheduleToUpdate.tagId === 0 ? null : scheduleToUpdate.tagId,
            };
            const response = await api.put<RawScheduleEvent>(`/schedules/${scheduleToUpdate.id}`, payload);
            await fetchSchedules(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1), new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
        } catch (err) {
            console.error("일정 업데이트 실패:", err);
            Alert.alert("업데이트 실패", "서버와 통신 중 오류가 발생했습니다.");
        }
    }, [userId, fetchSchedules, selectedDate]);

    const createSchedule = useCallback(async (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        if (!userId) return;
        try {
            const payload = {
                ...newScheduleData,
                rrule: newScheduleData.rrule ? newScheduleData.rrule.replace(/(\r\n|\n|\r)/gm, "") : '',
                startTime: format(newScheduleData.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: format(newScheduleData.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
                tagId: newScheduleData.tagId === 0 ? null : newScheduleData.tagId,
            };
            await api.post<RawScheduleEvent>('/schedules', payload);
            await fetchSchedules(new Date(newScheduleData.startTime.getFullYear(), newScheduleData.startTime.getMonth(), 1), new Date(newScheduleData.startTime.getFullYear(), newScheduleData.startTime.getMonth() + 1, 0));
        } catch (err) {
            console.error("일정 생성 실패:", err);
            Alert.alert("생성 실패", "서버와 통신 중 오류가 발생했습니다.");
        }
    }, [userId, fetchSchedules]);

    const deleteSchedule = useCallback(async (scheduleId: number) => {
        if (!userId) return;
        try {
            await api.delete(`/schedules/${scheduleId}`);
            await fetchSchedules(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1), new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
        } catch (err) {
            console.error("일정 삭제 실패:", err);
            Alert.alert("삭제 실패", "일정을 삭제하는 중 오류가 발생했습니다.");
        }
    }, [userId, fetchSchedules, selectedDate]);

    const createTag = useCallback(async (tagData: { label: string, color: string }): Promise<Tag> => {
        if (!userId) throw new Error("User not logged in");
        try {
            const response = await api.post<Tag>('/tags', tagData);
            const newTag = response.data;
            setTags(prevTags => [...prevTags, newTag]);
            return newTag;
        } catch (err) {
            console.error("태그 생성 실패:", err);
            Alert.alert("생성 실패", "새로운 태그를 만드는 중 오류가 발생했습니다.");
            throw err;
        }
    }, [userId]);

    const updateTag = useCallback(async (tagToUpdate: Tag) => {
        if (!userId) return;
        try {
            const response = await api.put<Tag>(`/tags/${tagToUpdate.id}`, tagToUpdate);
            const updatedTag = response.data;
            setTags(prevTags =>
                prevTags.map(tag => (tag.id === updatedTag.id ? updatedTag : tag))
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
            await api.delete(`/tags/${tagId}`);
            await fetchSchedules(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1), new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
        } catch (err) {
            console.error("태그 삭제 실패:", err);
            Alert.alert("삭제 실패", "태그를 삭제하는 중 오류가 발생했습니다.");
            throw err;
        }
    }, [userId, fetchSchedules, selectedDate]);

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