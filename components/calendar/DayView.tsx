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
    TimeTableDayColumn,
    HourCell,
    ScheduleBlock,
    ScheduleBlockText
} from '../style/CalendarStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import { differenceInMinutes, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';
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

interface DayViewProps {
    date: Date;
    schedules: Schedule[];
    tags?: Tag[];
    onEventPress?: (event: Schedule) => void;
    colors: ThemeColors;
}

const DayView: React.FC<DayViewProps> = ({ date, schedules = [], tags = [], onEventPress, colors }) => {
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <DayHeader $colors={colors}>
                <DayHeaderText $colors={colors}>{format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}</DayHeaderText>
            </DayHeader>
            <TimetableWrapper $colors={colors}>
                <ScrollView ref={scrollViewRef}>
                    <TimetableGrid>
                        <TimeColumn>
                            {timeLabels.map(time => (
                                <TimeLabelCell key={time}>
                                    <TimeLabelText $colors={colors}>{time}</TimeLabelText>
                                </TimeLabelCell>
                            ))}
                        </TimeColumn>

                        <TimeTableDayColumn $isToday={isToday(date)} $colors={colors}>
                            {timeLabels.map(time => <HourCell key={time} $colors={colors} />)}

                            {schedules.map(event => {
                                const eventColor = tagColorMap.get(event.tagId) || 'gray';
                                const { top, height } = calculateSchedulePosition(event);
                                return (
                                    <ScheduleBlock key={event.id} top={top} height={height} color={eventColor} onPress={() => onEventPress?.(event)}>
                                        <ScheduleBlockText>{event.title}</ScheduleBlockText>
                                    </ScheduleBlock>
                                );
                            })}
                        </TimeTableDayColumn>
                    </TimetableGrid>
                </ScrollView>
            </TimetableWrapper>
        </View>
    );
};

export default DayView;