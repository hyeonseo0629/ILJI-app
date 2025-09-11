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
} from 'date-fns';
import {
    MWeek,
    MDayContainer,
    MDayNameText,
    MDayCircle,
    MDayText,
    TimetableWrapper,
    TimetableGrid,
    TimeColumn,
    TimeLabelCell,
    TimeLabelText,
    DaysContainer,
    DayColumn,
    HourCell,
    EventBlock,
    EventBlockText
} from '../style/CalendarStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

const calculateEventPosition = (event: Schedule) => {
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
            <MWeek style={{ marginLeft: 50, marginBottom: 0 }}>
                {weekDays.map((day) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <MDayContainer
                            key={day.toISOString()}
                            style={{ height: 'auto', padding: 5 }}
                            onPress={() => onDayPress?.(day)}
                        >
                            <MDayNameText>{format(day, 'EEE')}</MDayNameText>
                            {isCurrentDay ? (
                                <MDayCircle>
                                    <MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</MDayText>
                                </MDayCircle>
                            ) : (
                                <MDayText>{format(day, 'd')}</MDayText>
                            )}
                        </MDayContainer>
                    );
                })}
            </MWeek>

            <TimetableWrapper>
                <ScrollView ref={scrollViewRef}>
                    <TimetableGrid>
                        {/* Time Column */}
                        <TimeColumn>
                            {timeLabels.map(time => (
                                <TimeLabelCell key={time}>
                                    <TimeLabelText>{time}</TimeLabelText>
                                </TimeLabelCell>
                            ))}
                        </TimeColumn>

                        {/* Days Columns */}
                        <DaysContainer>
                            {weekDays.map((day) => (
                                <DayColumn key={day.toISOString()} $isToday={isToday(day)}>
                                    {timeLabels.map(time => <HourCell key={`${day.toISOString()}-${time}`} />)}

                                    {/* schedules for this day */}
                                    {schedules.filter(event => isSameDay(event.startTime, day)).map(event => {
                                        const eventColor = tagColorMap.get(event.tagId) || 'gray';
                                        const { top, height } = calculateEventPosition(event);
                                        return (
                                            <EventBlock key={event.id} top={top} height={height} color={eventColor} onPress={() => onEventPress?.(event)}>
                                                <EventBlockText>{event.title}</EventBlockText>
                                            </EventBlock>
                                        );
                                    })}
                                </DayColumn>
                            ))}
                        </DaysContainer>
                    </TimetableGrid>
                </ScrollView>
            </TimetableWrapper>
        </View>
    );
};

export default WeekView;