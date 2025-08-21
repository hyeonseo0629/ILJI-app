import React from 'react';
import { View, Text } from 'react-native';
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
    isValid,
    differenceInDays,
} from 'date-fns';
import * as S from './CalendarStyle';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const SixWeekCalendar: React.FC<SixWeekCalendarProps> = ({ date, onDateChange }) => {
    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const weekStartsOn = 0; // 0 for Sunday

    // 1. Find the start and end of the weeks the month naturally occupies.
    const naturalStart = startOfWeek(monthStart, { weekStartsOn });
    const naturalEnd = endOfWeek(monthEnd, { weekStartsOn });

    // 2. Calculate the number of days in this natural view.
    const naturalDays = differenceInDays(naturalEnd, naturalStart) + 1;

    // 3. Calculate how many padding days are needed to reach 42.
    const paddingDays = 42 - naturalDays;

    // 4. Distribute the padding as evenly as possible.
    const paddingBefore = Math.round(paddingDays / 2);

    // 5. Determine the final start date of the 42-day grid.
    const startDate = sub(naturalStart, { days: paddingBefore });
    const endDate = add(startDate, { days: 41 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    for (let i = 0; i < 6; i++) {
        weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    const handlePrevMonth = () => {
        onDateChange(sub(date, { months: 1 }));
    };

    const handleNextMonth = () => {
        onDateChange(add(date, { months: 1 }));
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <S.MContainer>
            <S.MHeader>
                <S.MNavButton onPress={handlePrevMonth}>
                    <S.MNavButtonText>{'<'}</S.MNavButtonText>
                </S.MNavButton>
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
                <S.MNavButton onPress={handleNextMonth}>
                    <S.MNavButtonText>{'>'}</S.MNavButtonText>
                </S.MNavButton>
            </S.MHeader>

            <S.MDayNamesContainer>
                {dayNames.map(name => <S.MDayNameText key={name}>{name}</S.MDayNameText>)}
            </S.MDayNamesContainer>

            <S.MGrid>
                {weeks.map((week, i) => (
                    <S.MWeek key={i}>
                        {week.map((day, j) => {
                            if (!day) return <S.MEmptyDayContainer key={`empty-${j}`} />;
                            const isCurrentMonth = isSameMonth(day, date);
                            const isCurrentDay = isToday(day);
                            // This component doesn't handle selection state yet.
                            const isSelected = false;

                            return (
                                <S.MDayContainer key={day.toISOString()} $isSelected={isSelected}>
                                    {isCurrentDay ? (
                                        <S.MDayCircle>
                                            <S.MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</S.MDayText>
                                        </S.MDayCircle>
                                    ) : (
                                        <S.MDayText $isNotInMonth={!isCurrentMonth} $isToday={isCurrentDay} $isSelected={isSelected}>
                                            {format(day, 'd')}
                                        </S.MDayText>
                                    )}
                                </S.MDayContainer>
                            );
                        })}
                    </S.MWeek>
                ))}
            </S.MGrid>
        </S.MContainer>
    );
};

export default SixWeekCalendar;