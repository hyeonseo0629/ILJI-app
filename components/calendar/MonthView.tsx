import React, { useMemo } from 'react';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isSameMonth,
    isToday,
    isSameDay,
    isWithinInterval,
    startOfDay,
    endOfDay,
    differenceInCalendarDays,
    max,
    min,
} from 'date-fns';
import * as S from './CalendarStyle';
import { Schedule } from '@/components/calendar/types';
import { Tag } from '@/components/ToDo/types';

interface MonthViewProps {
    date: Date;
    schedules?: Schedule[];
    tags?: Tag[];
    onDayPress?: (day: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ date, schedules = [], tags = [], onDayPress }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const weekStartsOn = 0; // 0 for Sunday
        const startDate = startOfWeek(monthStart, { weekStartsOn });
        const endDate = addDays(startDate, 41);
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weeksArray = [];
        for (let i = 0; i < 6; i++) {
            weeksArray.push(days.slice(i * 7, (i + 1) * 7));
        }
        return weeksArray;
    }, [date]);

    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        if (tags) {
            tags.forEach(tag => {
                map.set(tag.id, tag.color);
            });
        }
        return map;
    }, [tags]);

    return (
        <>
            <S.MWeek style={{height: 20}}>
                {dayNames.map(name => <S.MDayNameText key={name}>{name}</S.MDayNameText>)}
            </S.MWeek>
            {weeks.map((week, i) => (
                <S.MWeek key={i}>
                    {week.map((day, j) => {
                        if (!day) return <S.MEmptyDayContainer key={`empty-${j}`} />;
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);
                        
                        const daySchedules = schedules.filter(schedule => 
                            isWithinInterval(day, {
                                start: startOfDay(schedule.startTime),
                                end: endOfDay(schedule.endTime)
                            })
                        );

                        // [추가] 세로 정렬 문제를 해결하기 위한 정렬 로직
                        daySchedules.sort((a, b) => {
                            const aIsMultiDay = !isSameDay(a.startTime, a.endTime);
                            const bIsMultiDay = !isSameDay(b.startTime, b.endTime);

                            if (aIsMultiDay !== bIsMultiDay) {
                                return aIsMultiDay ? -1 : 1; // 장기 일정을 항상 위로
                            }
                            return a.startTime.getTime() - b.startTime.getTime(); // 그 외에는 시작 시간 순
                        });

                        return (
                            <S.MDayContainer
                                key={day.toISOString()}
                                onPress={() => onDayPress?.(day)}
                            >
                                <S.DayNumberWrapper>
                                    {isCurrentDay ? (
                                        <S.MDayCircle $isCurrentMonth={isCurrentMonth}>
                                            <S.MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</S.MDayText>
                                        </S.MDayCircle>
                                    ) : (
                                        <S.MDayText $isNotInMonth={!isCurrentMonth} $isToday={isCurrentDay}>{format(day, 'd')}</S.MDayText>
                                    )}
                                </S.DayNumberWrapper>
                                <S.MEventsContainer>
                                    {daySchedules.map((schedule, index) => {
                                        const eventColor = tagColorMap.get(schedule.tagId) || 'gray';
                                        
                                        const isMultiDay = !isSameDay(schedule.startTime, schedule.endTime);
                                        const isStart = isSameDay(day, schedule.startTime);
                                        const isEnd = isSameDay(day, schedule.endTime);

                                        let position: 'start' | 'middle' | 'end' | 'single' = 'middle';
                                        if (!isMultiDay) {
                                            position = 'single';
                                        } else if (isStart) {
                                            position = 'start';
                                        } else if (isEnd) {
                                            position = 'end';
                                        }

                                        const topPosition = index * 14;

                                        return (
                                            <S.EventBar 
                                                key={schedule.id} 
                                                color={eventColor} 
                                                $position={position}
                                                $isCurrentMonth={isCurrentMonth}
                                                $top={topPosition}
                                            >
                                                <S.EventBarText>
                                                    {position === 'start' || position === 'single' ? schedule.title : ''}
                                                </S.EventBarText>
                                            </S.EventBar>
                                        );
                                    })}
                                </S.MEventsContainer>
                            </S.MDayContainer>
                        );
                    })}
                </S.MWeek>
            ))}
        </>
    );
};

export default MonthView;