import { useState, useEffect } from 'react';
import api from '../src/lib/api';
import { Schedule } from "../components/calendar/scheduleTypes";
import { rrulestr } from 'rrule';

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
    rrule: string;
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

                    if (schedule.rrule) {
                        try {
                            const rule = rrulestr(`DTSTART:${schedule.startTime.toISOString().replace(/[-:.]/g, '').split('Z')[0]}Z\n${schedule.rrule}`);

                            const today = new Date();
                            const after = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                            const before = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

                            const dates = rule.between(after, before);

                            dates.forEach(occurrenceDate => {
                                const duration = schedule.endTime.getTime() - schedule.startTime.getTime();
                                let newStartDate = new Date(occurrenceDate);

                                if (schedule.isAllDay) {
                                    newStartDate.setUTCHours(0, 0, 0, 0);
                                    const newEndDate = new Date(newStartDate);
                                    newEndDate.setUTCHours(23, 59, 59, 999);
                                    processedSchedules.push({ ...schedule, id: `${schedule.id}-${occurrenceDate.toISOString()}`, startTime: newStartDate, endTime: newEndDate });
                                } else {
                                    newStartDate.setUTCHours(schedule.startTime.getUTCHours(), schedule.startTime.getUTCMinutes(), schedule.startTime.getUTCSeconds());
                                    const newEndDate = new Date(newStartDate.getTime() + duration);
                                    processedSchedules.push({ ...schedule, id: `${schedule.id}-${occurrenceDate.toISOString()}`, startTime: newStartDate, endTime: newEndDate });
                                }
                            });
                        } catch (e) {
                            console.error("Error parsing rrule for schedule:", schedule, e);
                            processedSchedules.push(schedule);
                        }
                    } else {
                        processedSchedules.push(schedule);
                    }
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
