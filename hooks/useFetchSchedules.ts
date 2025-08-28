import {useState, useEffect} from 'react';

// Matches the backend's ScheduleResponse.java
export interface Schedule {
    id: number;
    userId: number;
    title: string;
    description: string | null;
    startTime: string; // ISO 8601 format
    endTime: string;   // ISO 8601 format
    isAllDay: boolean;
    rrule: string | null;
    createdAt: string;
    updatedAt: string;
    // The following are not in the user's schema but were in the original file
    calendarId?: number;
    location?: string;
    tagId?: number | null;
}

const API_BASE_URL = 'http://10.0.2.2:8080'; // For Android emulator, this is the host machine

export const useFetchSchedules = (tagIds?: number[]) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                // For now, we will not fetch from the network.
                // We will return an empty array to avoid network errors.
                setSchedules([]);
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
    }, [tagIds]); // Refetch when tagIds change

    return {schedules, loading, error};
};
