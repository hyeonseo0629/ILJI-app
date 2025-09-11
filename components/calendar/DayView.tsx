import React, { useRef, useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import {
    DayHeader,
    DayHeaderText,
    TimetableWrapper,
    TimetableGrid,
    TimeColumn,
    TimeLabelCell,
    TimeLabelText,
    DayColumn,
    HourCell,
    EventBlock,
    EventBlockText
} from '../style/CalendarStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import { differenceInMinutes, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

const calculateSchedulePosition = (event: Schedule) => {
    const startHour = event.startTime.getHours();
    const startMinute = event.startTime.getMinutes();
    const durationInMinutes = differenceInMinutes(event.endTime, event.startTime);
    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;
    return { top, height };
};

interface DayViewProps {
    date: Date;
    schedules: Schedule[];
    tags?: Tag[];
    onEventPress?: (event: Schedule) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, schedules = [], tags = [], onEventPress }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
    }, [date]);

    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        tags.forEach(tag => {
            map.set(tag.id, tag.color);
        });
        return map;
    }, [tags]);

    return (
        <View style={{ flex: 1 }}>
            <DayHeader>
                <DayHeaderText>{format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}</DayHeaderText>
            </DayHeader>
            <TimetableWrapper>
                <ScrollView ref={scrollViewRef}>
                    <TimetableGrid>
                        <TimeColumn>
                            {timeLabels.map(time => (
                                <TimeLabelCell key={time}>
                                    <TimeLabelText>{time}</TimeLabelText>
                                </TimeLabelCell>
                            ))}
                        </TimeColumn>

                        <DayColumn $isToday={isToday(date)}>
                            {timeLabels.map(time => <HourCell key={time} />)}

                            {schedules.map(event => {
                                const eventColor = tagColorMap.get(event.tagId) || 'gray';
                                const { top, height } = calculateSchedulePosition(event);
                                return (
                                    <EventBlock key={event.id} top={top} height={height} color={eventColor} onPress={() => onEventPress?.(event)}>
                                        <EventBlockText>{event.title}</EventBlockText>
                                    </EventBlock>
                                );
                            })}
                        </DayColumn>
                    </TimetableGrid>
                </ScrollView>
            </TimetableWrapper>
        </View>
    );
};

export default DayView;