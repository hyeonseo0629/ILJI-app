// C:/LGE/ILJI-app/src/context/ScheduleContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import api from '../lib/api'; // 1단계에서 만든 전화기!
import { Schedule } from '@/components/calendar/types'; // 캘린더 UI가 사용하는 타입 가져오기
import { Tag } from '@/components/ToDo/types';

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
    createSchedule: (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    deleteSchedule: (scheduleId: number) => Promise<void>;
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
    const [events, setEvents] = useState<Schedule[]>([]);
    const [tags, setTags] = useState<Tag[]>([]); // [추가] 태그 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
            userId: 4, // 임시 사용자 ID를 4번으로 변경
            rrule: '',
            createdAt: new Date(rawEvent.createdAt), // 🚨 서버에서 받은 생성 시간 사용
            updatedAt: new Date(rawEvent.updatedAt), // 🚨 서버에서 받은 수정 시간 사용
            calendarId: 1,
        };
    }, []);

    // [수정] 기존 fetchSchedules 함수가 태그도 함께 불러오도록 기능 강화
    const fetchSchedules = useCallback(async () => {
        setLoading(true);
        try {
            // 스케줄과 태그를 동시에 병렬로 가져옵니다.
            const [schedulesResponse, tagsResponse] = await Promise.all([
                // 404 오류 발생: '/schedules/user/4' 경로가 없음. 기존에 작동하던 '/schedules'로 되돌립니다.
                api.get<RawScheduleEvent[]>('/schedules'),
                // 성공적으로 작동했던 사용자별 태그 주소를 사용합니다.
                api.get<Tag[]>(`/tags/user/4`)
            ]);

            const formattedEvents = schedulesResponse.data.map(formatRawSchedule);
            setEvents(formattedEvents); // 'events' 이름 유지
            setTags(tagsResponse.data); // 새로 추가된 태그 상태 업데이트
            setError(null);
        } catch (err) {
            console.error("초기 데이터 로딩 실패:", err);
            setError(err as Error);
            Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [formatRawSchedule]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

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

    const createSchedule = useCallback(async (newScheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
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

    const value = {
        events,
        tags, // [추가] Context 값에 태그 목록 포함
        loading,
        error,
        fetchSchedules,
        updateSchedule,
        createSchedule,
        deleteSchedule,
    };

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}