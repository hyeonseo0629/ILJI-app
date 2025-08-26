import React, { useMemo } from 'react';
import { View } from 'react-native';
import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    format,
    isToday,
    isSameDay,
    differenceInMinutes,
} from 'date-fns';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

interface WeekViewProps {
    date: Date;
    events?: CalendarEvent[];
    onEventPress?: (event: CalendarEvent) => void;
}

const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const durationInMinutes = differenceInMinutes(event.end, event.start);

    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;

    return { top, height };
};

const WeekView: React.FC<WeekViewProps> = ({ date, events = [], onEventPress }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const weekDays = useMemo(() => {
        const weekStartsOn = 0; // 0 for Sunday
        const start = startOfWeek(date, { weekStartsOn });
        const end = endOfWeek(date, { weekStartsOn });
        return eachDayOfInterval({ start, end });
    }, [date]);

    return (
        <View style={{ flex: 1 }}>
            {/* Day Headers */}
            <S.MWeek style={{ marginLeft: 50, marginBottom: 0 }}>
                {weekDays.map(day => (
                    <S.MDayContainer key={day.toISOString()} style={{ height: 'auto', padding: 5 }}>
                        <S.MDayNameText>{format(day, 'EEE')}</S.MDayNameText>
                        <S.MDayText $isToday={isToday(day)}>{format(day, 'd')}</S.MDayText>
                    </S.MDayContainer>
                ))}
            </S.MWeek>

            <S.TimetableContainer>
                <S.TimetableGrid>
                    {/* Time Column */}
                    <S.TimeColumn>
                        {timeLabels.map(time => (
                            <S.TimeLabelCell key={time}>
                                <S.TimeLabelText>{time}</S.TimeLabelText>
                            </S.TimeLabelCell>
                        ))}
                    </S.TimeColumn>

                    {/* Days Columns */}
                    <S.DaysContainer>
                        {weekDays.map(day => (
                            <S.DayColumn key={day.toISOString()}>
                                {timeLabels.map(time => <S.HourCell key={`${day.toISOString()}-${time}`} />)}
                                
                                {/* Events for this day */}
                                {events.filter(event => isSameDay(event.start, day)).map(event => {
                                    const { top, height } = calculateEventPosition(event);
                                    return (
                                        <S.EventBlock key={event.id} top={top} height={height} color={event.color} onPress={() => onEventPress?.(event)}>
                                            <S.EventBlockText>{event.title}</S.EventBlockText>
                                        </S.EventBlock>
                                    );
                                })}
                            </S.DayColumn>
                        ))}
                    </S.DaysContainer>
                </S.TimetableGrid>
            </S.TimetableContainer>
        </View>
    );
};

export default WeekView;