import React, { useMemo, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    format,
    isToday,
    isSameDay,
    differenceInMinutes,
    isSameWeek,
} from 'date-fns';
import * as CS from '../style/CalendarStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import {DayOfTheWeekText} from "../style/CalendarStyled";
import { ThemeColors } from "@/types/theme";

const HOUR_HEIGHT = 40; // 1시간에 해당하는 높이 (px)

const calculateSchedulePosition = (event: Schedule) => {
    const startHour = event.startTime.getHours();
    const startMinute = event.startTime.getMinutes();
    const durationInMinutes = differenceInMinutes(event.endTime, event.startTime);
    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;
    return { top, height };
};

interface WeekViewProps {
    date: Date;
    schedules?: Schedule[];
    tags?: Tag[];
    onDayPress?: (day: Date) => void;
    onEventPress?: (event: Schedule) => void;
    colors: ThemeColors;
}

const WeekView: React.FC<WeekViewProps> = ({ date, schedules = [], tags = [], onDayPress, onEventPress, colors }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const weekDays = useMemo(() => {
        const weekStartsOn = 0; // 0 for Sunday
        const start = startOfWeek(date, { weekStartsOn });
        const end = endOfWeek(date, { weekStartsOn });
        return eachDayOfInterval({ start, end });
    }, [date]);

    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        tags.forEach(tag => {
            map.set(tag.id, tag.color);
        });
        return map;
    }, [tags]);

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
    }, [date]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <CS.DayOfTheWeek style={{ marginLeft: 50, marginBottom: 0, flex: 0 }}>
                {weekDays.map((day) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <CS.MonthDayContainer
                            key={day.toISOString()}
                            style={{ height: 'auto', padding: 5 }}
                            onPress={() => onDayPress?.(day)}
                            $colors={colors}
                        >
                            <CS.DayOfTheWeekText $colors={colors}>{format(day, 'EEE')}</CS.DayOfTheWeekText>
                            {isCurrentDay ? (
                                <CS.MonthDayCircle $colors={colors}>
                                    <CS.MonthDayText $isSelected={true} $isToday={true} $colors={colors}>{format(day, 'd')}</CS.MonthDayText>
                                </CS.MonthDayCircle>
                            ) : (
                                <CS.MonthDayText $colors={colors}>{format(day, 'd')}</CS.MonthDayText>
                            )}
                        </CS.MonthDayContainer>
                    );
                })}
            </CS.DayOfTheWeek>

            <CS.TimetableWrapper $colors={colors}>
                <ScrollView ref={scrollViewRef}>
                    <CS.TimetableGrid>
                        <CS.TimeColumn>
                            {timeLabels.map(time => (
                                <CS.TimeLabelCell key={time}>
                                    <CS.TimeLabelText $colors={colors}>{time}</CS.TimeLabelText>
                                </CS.TimeLabelCell>
                            ))}
                        </CS.TimeColumn>

                        <CS.TimeTableDaysContainer>
                            {weekDays.map((day) => (
                                <CS.TimeTableDayColumn key={day.toISOString()} $isToday={isToday(day)} $colors={colors}>
                                    {timeLabels.map(time => <CS.HourCell key={`${day.toISOString()}-${time}`} $colors={colors} />)}

                                    {schedules.filter(event => isSameDay(event.startTime, day)).map(event => {
                                        const eventColor = tagColorMap.get(event.tagId) || 'gray';
                                        const { top, height } = calculateSchedulePosition(event);
                                        return (
                                            <CS.ScheduleBlock key={event.id} top={top} height={height} color={eventColor} onPress={() => onEventPress?.(event)}>
                                                <CS.ScheduleBlockText>{event.title}</CS.ScheduleBlockText>
                                            </CS.ScheduleBlock>
                                        );
                                    })}
                                </CS.TimeTableDayColumn>
                            ))}
                        </CS.TimeTableDaysContainer>
                    </CS.TimetableGrid>
                </ScrollView>
            </CS.TimetableWrapper>
        </View>
    );
};

export default WeekView;