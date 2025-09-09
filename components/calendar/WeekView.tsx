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

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

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
}

const WeekView: React.FC<WeekViewProps> = ({ date, schedules = [], tags = [], onDayPress, onEventPress }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const weekDays = useMemo(() => {
        const weekStartsOn = 0; // 0 for Sunday
        const start = startOfWeek(date, { weekStartsOn });
        const end = endOfWeek(date, { weekStartsOn });
        return eachDayOfInterval({ start, end });
    }, [date]);

    // tags 배열이 변경될 때만 색상 맵을 다시 생성하여 성능을 최적화합니다.
    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        tags.forEach(tag => {
            map.set(tag.id, tag.color);
        });
        return map;
    }, [tags]);

    // date prop이 변경될 때마다, 스크롤을 맨 위로 초기화합니다.
    useEffect(() => {
        // setTimeout을 사용하여 UI 렌더링이 완료된 후 스크롤을 실행합니다.
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
    }, [date]);

    return (
        <View style={{ flex: 1 }}>
            {/* Day Headers */}
            {/* --- 주요 변경사항 --- */}
            {/* MWeek의 flex: 1 스타일을 덮어쓰기 위해 flex: 0을 추가합니다. */}
            <CS.DayOfTheWeek style={{ marginLeft: 50, marginBottom: 0, flex: 0 }}>
                {weekDays.map((day) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <CS.MonthDayContainer
                            key={day.toISOString()}
                            style={{ height: 'auto', padding: 5 }}
                            onPress={() => onDayPress?.(day)}
                        >
                            <CS.DayOfTheWeekText>{format(day, 'EEE')}</CS.DayOfTheWeekText>
                            {isCurrentDay ? (
                                <CS.MonthDayCircle>
                                    <CS.MonthDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</CS.MonthDayText>
                                </CS.MonthDayCircle>
                            ) : (
                                <CS.MonthDayText>{format(day, 'd')}</CS.MonthDayText>
                            )}
                        </CS.MonthDayContainer>
                    );
                })}
            </CS.DayOfTheWeek>

            <CS.TimetableWrapper>
                <ScrollView ref={scrollViewRef}>
                    <CS.TimetableGrid>
                        {/* Time Column */}
                        <CS.TimeColumn>
                            {timeLabels.map(time => (
                                <CS.TimeLabelCell key={time}>
                                    <CS.TimeLabelText>{time}</CS.TimeLabelText>
                                </CS.TimeLabelCell>
                            ))}
                        </CS.TimeColumn>

                        {/* Days Columns */}
                        <CS.TimeTableDaysContainer>
                            {weekDays.map((day) => (
                                <CS.TimeTableDayColumn key={day.toISOString()} $isToday={isToday(day)}>
                                    {timeLabels.map(time => <CS.HourCell key={`${day.toISOString()}-${time}`} />)}

                                    {/* schedules for this day */}
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