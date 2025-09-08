import React, { useRef, useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import * as CS from '../style/CalendarStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import { differenceInMinutes, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

const calculateSchedulePosition = (event: Schedule) => {
    const startHour = event.startTime.getHours(); // .start -> .startTime
    const startMinute = event.startTime.getMinutes(); // .start -> .startTime
    const durationInMinutes = differenceInMinutes(event.endTime, event.startTime); // .end, .start -> .endTime, .startTime
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

    // date prop이 변경될 때마다, 스크롤을 맨 위로 초기화합니다.
    useEffect(() => {
        // setTimeout을 사용하여 UI 렌더링이 완료된 후 스크롤을 실행합니다.
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
    }, [date]);

    // tags 배열이 변경될 때만 색상 맵을 다시 생성하여 성능을 최적화합니다.
    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        tags.forEach(tag => {
            map.set(tag.id, tag.color);
        });
        return map;
    }, [tags]);

    return (
        <View style={{ flex: 1 }}>
            <CS.DayHeader>
                <CS.DayHeaderText>{format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}</CS.DayHeaderText>
            </CS.DayHeader>
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

                        {/* Single Day Column */}
                        <CS.TimeTableDayColumn $isToday={isToday(date)}>
                            {/* Background grid lines */}
                            {timeLabels.map(time => <CS.HourCell key={time} />)}

                            {/* schedules for this day */}
                            {schedules.map(event => {
                                const eventColor = tagColorMap.get(event.tagId) || 'gray';
                                const { top, height } = calculateSchedulePosition(event);
                                return (
                                    <CS.ScheduleBlock key={event.id} top={top} height={height} color={eventColor} onPress={() => onEventPress?.(event)}>
                                        <CS.ScheduleBlockText>{event.title}</CS.ScheduleBlockText>
                                    </CS.ScheduleBlock>
                                );
                            })}
                        </CS.TimeTableDayColumn>
                    </CS.TimetableGrid>
                </ScrollView>
            </CS.TimetableWrapper>
        </View>
    );
};

export default DayView;