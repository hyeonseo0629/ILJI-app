import React, { useMemo } from 'react';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    add,
    sub,
    isSameMonth,
    isToday,
    isSameDay,
    differenceInDays,
    getDay,
} from 'date-fns';
import { MWeek, MDayNameText, MEmptyDayContainer, MDayContainer, MDayCircle, MDayText, EventDot } from './CalendarStyle';
import { CalendarEvent } from './types';

// --- Component Props Definition ---

interface MonthViewProps {
    date: Date;
    events?: CalendarEvent[];
    onDayPress?: (day: Date) => void;
}

// --- MonthView Component ---

const MonthView: React.FC<MonthViewProps> = ({ date, events = [], onDayPress }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const weekStartsOn = 0; // Sunday

        const naturalGridStart = startOfWeek(monthStart, { weekStartsOn });
        const naturalGridEnd = endOfWeek(monthEnd, { weekStartsOn });

        // Calculate the number of weeks the month naturally spans
        const naturalWeeks = (differenceInDays(naturalGridEnd, naturalGridStart) + 1) / 7;

        let startDate = naturalGridStart;

        if (naturalWeeks === 4) {
            // If the month spans 4 weeks, add one week before and one after.
            // We do this by setting the start date one week before the natural start.
            // The 6-week (42-day) interval will automatically cover one week after.
            startDate = sub(naturalGridStart, { weeks: 1 });
        } else if (naturalWeeks === 5) {
            // If the month spans 5 weeks, add one week to balance the grid.
            // We add the extra week to the side with fewer empty days from adjacent months.
            const blanksAtStart = getDay(monthStart); // Empty days at the beginning of the month grid
            const blanksAtEnd = 6 - getDay(monthEnd);   // Empty days at the end of the month grid

            if (blanksAtStart > blanksAtEnd) {
                // If there are more empty days at the start, add the extra week at the end.
                // The grid starts at the natural start, and the 6th week is added at the end.
                startDate = naturalGridStart;
            } else {
                // If there are fewer or equal empty days at the start, add the extra week at the beginning.
                startDate = sub(naturalGridStart, { weeks: 1 });
            }
        }
        // If naturalWeeks is 6, startDate remains naturalGridStart, and the grid is 6 weeks.

        const days = eachDayOfInterval({ start: startDate, end: add(startDate, { days: 41 }) });

        const weeksArray = [];
        for (let i = 0; i < 6; i++) {
            weeksArray.push(days.slice(i * 7, (i + 1) * 7));
        }
        return weeksArray;
    }, [date]);

    return (
        <>
            {/* Day of the week header (Sun, Mon, Tue...) */}
            <MWeek>
                {dayNames.map(name => <MDayNameText key={name}>{name}</MDayNameText>)}
            </MWeek>

            {/* Render the weeks of the calendar */}
            {weeks.map((week, weekIndex) => (
                <MWeek key={`week-${weekIndex}`}>
                    {/* Render the days of the week */}
                    {week.map((day, dayIndex) => {
                        if (!day) {
                            return <MEmptyDayContainer key={`empty-${weekIndex}-${dayIndex}`} />;
                        }

                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);
                        const dayEvents = events.filter(event => event && event.start && isSameDay(event.start, day));

                        return (
                            <MDayContainer
                                key={`day-${weekIndex}-${dayIndex}`}
                                onPress={() => onDayPress?.(day)}
                            >
                                {isCurrentDay ? ( // Apply a special style (circle) for 'today'.
                                    <MDayCircle>
                                        <MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</MDayText>
                                    </MDayCircle>
                                ) : ( // Display other dates as plain text.
                                    <MDayText $isNotInMonth={!isCurrentMonth}>{format(day, 'd')}</MDayText>
                                )}
                                {dayEvents.length > 0 && <EventDot color={dayEvents[0].color} />}
                            </MDayContainer>
                        );
                    })}
                </MWeek>
            ))}
        </>
    );
};

export default MonthView;
