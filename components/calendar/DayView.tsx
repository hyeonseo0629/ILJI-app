// C:/cay/Final-Project-Github/ilji-mobile/components/calendar/DayView.tsx

import React, { useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';
import { differenceInMinutes, isToday, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const durationInMinutes = differenceInMinutes(event.end, event.start);
    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;
    return { top, height };
};

interface DayViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventPress?: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events = [], onEventPress }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    // date prop이 변경될 때마다, 스크롤을 맨 위로 초기화합니다.
    useEffect(() => {
        // setTimeout을 사용하여 UI 렌더링이 완료된 후 스크롤을 실행합니다.
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, 0);
    }, [date]);

    return (
        <View style={{ flex: 1 }}>
            <S.DayViewHeader>
                <S.DayViewHeaderText>{format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })}</S.DayViewHeaderText>
            </S.DayViewHeader>
            <S.TimetableWrapper>
                <ScrollView ref={scrollViewRef}>
                    <S.TimetableGrid>
                        {/* Time Column */}
                        <S.TimeColumn>
                            {timeLabels.map(time => (
                                <S.TimeLabelCell key={time}>
                                    <S.TimeLabelText>{time}</S.TimeLabelText>
                                </S.TimeLabelCell>
                            ))}
                        </S.TimeColumn>

                        {/* Single Day Column */}
                        <S.DayColumn $isToday={isToday(date)}>
                            {/* Background grid lines */}
                            {timeLabels.map(time => <S.HourCell key={time} />)}

                            {/* Events for this day */}
                            {events.map(event => {
                                const { top, height } = calculateEventPosition(event);
                                return (
                                    <S.EventBlock key={event.id} top={top} height={height} color={event.color} onPress={() => onEventPress?.(event)}>
                                        <S.EventBlockText>{event.title}</S.EventBlockText>
                                    </S.EventBlock>
                                );
                            })}
                        </S.DayColumn>
                    </S.TimetableGrid>
                </ScrollView>
            </S.TimetableWrapper>
        </View>
    );
};

export default DayView;