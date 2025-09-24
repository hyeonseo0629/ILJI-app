import { useState, useEffect } from 'react';
import api from '../src/lib/api';
import { Schedule } from "../components/calendar/scheduleTypes";

// API 응답에 대한 임시 타입 (날짜가 문자열)
interface RawSchedule {
    id: number;
    userId: number;
    tagId: number;
    title: string;
    location: string;
    description: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    rrule?: string;
    createdAt: string;
    updatedAt: string;
    calendarId: number;
}

// RawSchedule을 Schedule (Date 객체 포함)으로 변환하는 함수
const transformRawSchedule = (raw: RawSchedule): Schedule => ({
    ...raw,
    startTime: new Date(raw.startTime),
    endTime: new Date(raw.endTime),
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
});

export const useFetchSchedules = (tagIds?: number[]) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (tagIds && tagIds.length > 0) {
                    tagIds.forEach(id => params.append('tagIds', id.toString()));
                }

                const response = await api.get<RawSchedule[]>('/schedules', {
                    params: tagIds && tagIds.length > 0 ? { tagIds: tagIds.join(',') } : undefined,
                });

                const processedSchedules: Schedule[] = [];

                response.data.forEach(rawSchedule => {
                    const schedule = transformRawSchedule(rawSchedule);
                    processedSchedules.push(schedule);
                });

                setSchedules(processedSchedules);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e);
                } else {
                    setError(new Error('An unknown error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [tagIds]);

    return {schedules, loading, error};
};
