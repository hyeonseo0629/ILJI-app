import React, {useMemo} from 'react';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    isSameDay,
    isWithinInterval,
    startOfDay,
    endOfDay,
} from 'date-fns';
import * as CS from '../style/CalendarStyled';
import {Schedule} from '@/components/calendar/scheduleTypes';
import {Tag} from '@/components/tag/TagTypes';
import { ThemeColors } from "@/types/theme";

interface MonthViewProps {
    date: Date;
    schedules?: Schedule[];
    tags?: Tag[];
    onDayPress?: (day: Date) => void;
    colors: ThemeColors;
}

const MonthView: React.FC<MonthViewProps> = ({date, schedules = [], tags = [], onDayPress, colors}) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const weekStartsOn = 0; // 0 for Sunday

        const startDate = startOfWeek(monthStart, {weekStartsOn});
        const endDate = endOfWeek(monthEnd, {weekStartsOn});

        const days = eachDayOfInterval({start: startDate, end: endDate});

        const weeksArray = [];
        for (let i = 0; i < days.length; i += 7) {
            weeksArray.push(days.slice(i, i + 7));
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
            <CS.MonthWeek $isHeader>
                {dayNames.map(name => <CS.MonthDayNameText key={name} $colors={colors}>{name}</CS.MonthDayNameText>)}
            </CS.MonthWeek>

            {weeks.map((week, i) => (
                <CS.MonthWeek key={i}>
                    {week.map((day, j) => {
                        if (!day) return <CS.MonthEmptyDayContainer key={`empty-${j}`}/>;
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);

                        const daySchedules = schedules.filter(schedule =>
                            isWithinInterval(day, {
                                start: startOfDay(schedule.startTime),
                                end: endOfDay(schedule.endTime)
                            })
                        );

                        daySchedules.sort((a, b) => {
                            const aIsMultiDay = !isSameDay(a.startTime, a.endTime);
                            const bIsMultiDay = !isSameDay(b.startTime, b.endTime);

                            if (aIsMultiDay !== bIsMultiDay) {
                                return aIsMultiDay ? -1 : 1;
                            }
                            return a.startTime.getTime() - b.startTime.getTime();
                        });

                        return (
                            <CS.MonthDayContainer
                                key={day.toISOString()}
                                onPress={() => onDayPress?.(day)}
                                $colors={colors}
                            >
                                {isCurrentDay ? ( 
                                    <CS.MonthDayCircle $colors={colors}>
                                        <CS.MonthDayText $isSelected={true} $isToday={true} $colors={colors}>{format(day, 'd')}</CS.MonthDayText>
                                    </CS.MonthDayCircle>
                                ) : ( 
                                    <CS.MonthDayText $isNotInMonth={!isCurrentMonth} $isToday={isCurrentDay} $colors={colors}>{format(day, 'd')}</CS.MonthDayText>
                                )}
                                <CS.MonthSchedulesContainer>
                                    {daySchedules.slice(0, 2).map((schedule, index) => {
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
                                            <CS.EventBar
                                                key={schedule.id}
                                                color={eventColor}
                                                $position={position}
                                                $isCurrentMonth={isCurrentMonth}
                                                $top={topPosition}
                                            >
                                                <CS.EventBarText>
                                                    {position === 'start' || position === 'single' ? schedule.title : ''}
                                                </CS.EventBarText>
                                            </CS.EventBar>
                                        );
                                    })}

                                    {daySchedules.length > 2 && (
                                        daySchedules.length > 3 ? (
                                            <CS.MoreScheduleText $colors={colors}>
                                                + {daySchedules.length - 2} more
                                            </CS.MoreScheduleText>
                                        ) : (
                                            <CS.ScheduleTitleText key={daySchedules[2].id} color={tagColorMap.get(daySchedules[2].tagId) || 'gray'}>
                                                {daySchedules[2].title}
                                            </CS.ScheduleTitleText>
                                        )
                                    )}
                                </CS.MonthSchedulesContainer>
                            </CS.MonthDayContainer>
                        );
                    })}
                </CS.MonthWeek>
            ))}
        </>
    );
};

export default MonthView;