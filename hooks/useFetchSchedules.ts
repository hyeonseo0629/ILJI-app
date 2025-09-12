import {useState, useEffect} from 'react';

// Based on the backend's ScheduleResponse.java
export interface Schedule {
    id: number;
    userId: number;
    calendarId: number;
    title: string;
    location: string;
    tagId: number | null;
    description: string;
    startTime: string; // Assuming ISO 8601 format
    endTime: string;   // Assuming ISO 8601 format
    isAllDay: boolean;
    rrule: string;
    createdAt: string; // Assuming ISO 8601 format
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
                let url = `${API_BASE_URL}/api/schedules`;
                if (tagIds && tagIds.length > 0) {
                    const params = new URLSearchParams();
                    tagIds.forEach(id => params.append('tagIds', id.toString()));
                    url += `?${params.toString()}`;
                }

                // This assumes you have a way to get the auth token
                // For now, we'll proceed without authentication.
                // In a real app, you would get the token from storage.
                const response = await fetch(url, {
                    headers: {
                        // 'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch schedules');
                }

                const data: Schedule[] = await response.json();
                setSchedules(data);
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
