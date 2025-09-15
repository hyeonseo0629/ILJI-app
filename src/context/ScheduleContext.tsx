// C:/LGE/ILJI-app/src/context/ScheduleContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import api from '../lib/api'; // 1단계에서 만든 전화기!
import { Schedule } from '@/components/calendar/scheduleTypes'; // 캘린더 UI가 사용하는 타입 가져오기
import { Tag } from '@/components/tag/TagTypes';
import { useAuth } from './AuthContext'; // 🚨 [추가] 인증 정보를 가져오기 위한 훅

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
    // ... 백엔드 DTO에 있는 다른 필드들
}

// Context가 제공할 값들의 타입
interface ScheduleContextType {
    events: Schedule[]; // 기존 이름 유지
    tags: Tag[]; // [추가] 태그 목록
    loading: boolean; // 기존 이름 유지
    error: Error | null;
    fetchSchedules: () => void; // 기존 함수 유지
    updateSchedule: (schedule: Schedule) => Promise<void>;
    createSchedule: (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
    deleteSchedule: (scheduleId: number) => Promise<void>;
    createTag: (tagData: { label: string; color: string }) => Promise<Tag>;
    updateTag: (tagToUpdate: Tag) => Promise<void>;
    deleteTag: (tagId: number) => Promise<void>;
    selectedDate: Date; // [추가] 사용자가 선택한 날짜
    setSelectedDate: (date: Date) => void; // [추가] 날짜를 변경하는 함수
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
    const { user } = useAuth(); // 🚨 [추가] AuthContext로부터 현재 로그인한 사용자 정보를 가져옵니다.
    const [events, setEvents] = useState<Schedule[]>([]);
    const [tags, setTags] = useState<Tag[]>([]); // [추가] 태그 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // [추가] 선택된 날짜 상태. 기본값은 오늘.

    // 백엔드 데이터를 캘린더 형식으로 변환하는 함수 (useCallback으로 감싸서 안정성 확보)
    const formatRawSchedule = useCallback((rawEvent: RawScheduleEvent): Schedule => {
        return {
            // Schedule 타입에 맞게 필드를 매핑합니다.
            id: rawEvent.id,
            title: rawEvent.title,
            startTime: new Date(rawEvent.startTime), // 🚨 가장 중요! 문자열을 Date 객체로 변환
            endTime: new Date(rawEvent.endTime),     // 🚨 가장 중요! 문자열을 Date 객체로 변환
            isAllDay: rawEvent.isAllDay,
            description: rawEvent.description ?? '', // null 값이 오면 빈 문자열 ''로 대체
            location: rawEvent.location ?? '',       // null 값이 오면 빈 문자열 ''로 대체
            tagId: rawEvent.tagId ?? 0, // null 값이 오면 "태그 없음"을 의미하는 0으로 대체
            // Schedule 타입에 있지만 RawScheduleEvent에 없는 필드는 기본값을 설정합니다.
            userId: user!.id, // 🚨 [수정] 임시 ID 대신, 현재 로그인한 사용자의 ID를 사용합니다.
            rrule: '',
            createdAt: new Date(rawEvent.createdAt), // 🚨 서버에서 받은 생성 시간 사용
            updatedAt: new Date(rawEvent.updatedAt), // 🚨 서버에서 받은 수정 시간 사용
            calendarId: 1,
        };
    }, [user]); // 🚨 [수정] user 정보가 변경되면 이 함수도 새로 생성되어야 하므로 의존성 배열에 추가합니다.

    // [수정] 기존 fetchSchedules 함수가 태그도 함께 불러오도록 기능 강화
    const fetchSchedules = useCallback(async () => {
        // 🚨 [추가] 사용자 정보(user)가 없으면 API를 호출하지 않습니다. (로그아웃 상태 등)
        if (!user) return;

        setLoading(true);
        try {
            // 🚨 [수정] 백엔드가 토큰으로 사용자를 식별하므로, API 경로에 userId를 넣을 필요가 없습니다.
            //    이제 각 엔드포인트는 현재 로그인한 사용자의 데이터만 반환합니다.
            const [schedulesResponse, tagsResponse] = await Promise.all([
                api.get<RawScheduleEvent[]>('/schedules'),
                api.get<Tag[]>('/tags')
            ]);

            // 🚨 [제거] 백엔드에서 이미 사용자별 데이터를 필터링해서 주므로, 클라이언트 필터링 로직은 더 이상 필요 없습니다.
            const formattedEvents = schedulesResponse.data.map(formatRawSchedule);
            setEvents(formattedEvents);

            const processedTags = tagsResponse.data.map(tag => ({
                ...tag,
                color: (tag.color && tag.color.trim() !== '') ? tag.color : '#FF6B6B' // Ensure color is always a valid string
            }));
            setTags(processedTags); // 새로 추가된 태그 상태 업데이트
            setError(null);
        } catch (err) {
            console.error("초기 데이터 로딩 실패:", err);
            setError(err as Error);
            Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [user, formatRawSchedule]); // 🚨 [수정] user가 있어야 fetch가 가능하므로 의존성 배열에 추가합니다.

    useEffect(() => {
        // 🚨 [수정] 사용자 정보가 로드된 후에 스케줄 데이터를 불러오도록 user를 확인하는 조건을 추가합니다.
        if (user) {
            fetchSchedules();
        }
    }, [user, fetchSchedules]);

    const updateSchedule = useCallback(async (scheduleToUpdate: Schedule) => {
        try {
            // 1. 서버에 보내기 전, Date 객체를 문자열로 변환한 payload를 만듭니다.
            const payload = {
                ...scheduleToUpdate,
                // 🚨 isAllDay 값에 따라 날짜 포맷을 다르게 지정합니다.
                // 종일 일정: 'yyyy-MM-dd', 시간 지정 일정: 'yyyy-MM-dd'T'HH:mm:ss'
                startTime: format(scheduleToUpdate.startTime, scheduleToUpdate.isAllDay ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: format(scheduleToUpdate.endTime, scheduleToUpdate.isAllDay ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss"),
                // 🚨 '태그 없음'을 의미하는 0을 서버가 기대하는 null로 변환합니다.
                tagId: scheduleToUpdate.tagId === 0 ? null : scheduleToUpdate.tagId,
            };

            // 2. 백엔드 서버에 수정된 데이터를 전송합니다. (PUT /schedules/{id})
            //    수정 요청 시, 보통 서버는 업데이트된 객체를 다시 반환해줍니다.
            const response = await api.put<RawScheduleEvent>(`/schedules/${scheduleToUpdate.id}`, payload);
            const updatedEvent = formatRawSchedule(response.data);

            // 3. 서버로부터 받은 최신 데이터로 화면 상태를 업데이트하여 데이터 정합성을 보장합니다.
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
    }, [formatRawSchedule]); // 🚨 버그 수정: 의존성 배열에 formatRawSchedule 추가

    const createSchedule = useCallback(async (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        try {
            // 1. 서버에 보내기 전, Date 객체를 서버용 문자열로 변환한 payload를 만듭니다.
            const payload = {
                ...newScheduleData,
                // 🚨 isAllDay 값에 따라 날짜 포맷을 다르게 지정합니다.
                // 종일 일정: 'yyyy-MM-dd', 시간 지정 일정: 'yyyy-MM-dd'T'HH:mm:ss'
                startTime: format(newScheduleData.startTime, newScheduleData.isAllDay ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss"),
                endTime: format(newScheduleData.endTime, newScheduleData.isAllDay ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm:ss"),
                // 🚨 '태그 없음'을 의미하는 0을 서버가 기대하는 null로 변환합니다.
                tagId: newScheduleData.tagId === 0 ? null : newScheduleData.tagId,
            };

            // 2. 변환된 payload를 백엔드 서버에 전송합니다.
            const response = await api.post<RawScheduleEvent>('/schedules', payload);

            // 3. 서버로부터 받은, id가 포함된 완전한 데이터를 캘린더 형식으로 변환합니다.
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
    }, [formatRawSchedule]);

    const deleteSchedule = useCallback(async (scheduleId: number) => {
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
    }, []);

    const createTag = useCallback(async (tagData: { label: string, color: string }): Promise<Tag> => {
        try {
            // 🚨 [수정] 백엔드가 토큰으로 사용자를 식별하므로, 요청 본문에 userId를 담지 않습니다.
            const response = await api.post<Tag>('/tags', tagData);
            const newTag = response.data;

            setTags(prevTags => [...prevTags, newTag]);
            return newTag;
        } catch (err) {
            console.error("태그 생성 실패:", err);
            Alert.alert("생성 실패", "새로운 태그를 만드는 중 오류가 발생했습니다.");
            throw err;
        }
    }, []);

    const updateTag = useCallback(async (tagToUpdate: Tag) => {
        try {
            // 🚨 [수정] 백엔드가 토큰으로 사용자를 식별하므로, 요청 본문에 userId를 담지 않습니다.
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
    }, []);

    const deleteTag = useCallback(async (tagId: number) => {
        try {
            // 🚨 [수정] 백엔드가 토큰으로 사용자를 식별하므로, 요청 시 별도 데이터를 보낼 필요가 없습니다.
            await api.delete(`/tags/${tagId}`);

            // [개선] 태그 삭제 후, 서버의 데이터와 정합성을 맞추기 위해 전체 데이터를 다시 불러옵니다.
            await fetchSchedules();

        } catch (err) {
            console.error("태그 삭제 실패:", err);
            Alert.alert("삭제 실패", "태그를 삭제하는 중 오류가 발생했습니다.");
            throw err;
        }
    }, [fetchSchedules]);

    const value = {
        events,
        tags, // [추가] Context 값에 태그 목록 포함
        loading,
        error,
        fetchSchedules,
        updateSchedule,
        createSchedule,
        deleteSchedule,
        createTag,
        updateTag,
        deleteTag,
        selectedDate, // [추가]
        setSelectedDate, // [추가]
    };

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}
