import React, { useMemo } from 'react';
import { WeekCalendar } from 'react-native-calendars';
import { format, isSameDay } from 'date-fns';

interface WeekViewProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ date, onDateChange }) => {
    const handleDayPress = (day: { timestamp: number }) => {
        const newDate = new Date(day.timestamp);
        if (!isSameDay(newDate, date)) {
            onDateChange(newDate);
        }
    };

    // `date`가 변경될 때만 `markedDates` 객체를 새로 생성하여 무한 루프를 방지합니다.
    const { formattedDate, markedDates } = useMemo(() => {
        const fDate = format(date, 'yyyy-MM-dd');
        return {
            formattedDate: fDate,
            markedDates: {
                [fDate]: { selected: true, selectedColor: 'mediumslateblue' },
            },
        };
    }, [date]);

    return (
        <WeekCalendar
            current={formattedDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
        />
    );
};

export default WeekView;
