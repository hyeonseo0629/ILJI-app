export interface Schedule {
    id: number;
    userId: number,
    tagId: number,
    title: string;
    location: string
    description: string;
    startTime: Date;
    endTime: Date;
    isAllDay: boolean;
    rrule: string;
    createdAt: Date,
    updatedAt: Date,
    calendarId: number,
}