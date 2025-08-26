import React from 'react';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';
import { differenceInMinutes } from 'date-fns';

const HOUR_HEIGHT = 60; // 1시간에 해당하는 높이 (px)

// 이벤트의 시작 시간과 길이를 기반으로, 화면에 표시될 위치(top)와 높이(height)를 계산합니다.
const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const durationInMinutes = differenceInMinutes(event.end, event.start);

    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;

    return { top, height };
};

interface DayViewProps {
    events: CalendarEvent[];
    onEventPress?: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ events = [], onEventPress }) => {
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    return (
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

                {/* Single Day Column */}
                <S.DayColumn>
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
        </S.TimetableContainer>
    );
};

export default DayView;