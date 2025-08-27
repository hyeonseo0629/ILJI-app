import React, { useMemo } from 'react';
import { View } from 'react-native';
import {
    eachDayOfInterval, // 주어진 기간 내의 모든 날짜를 배열로 반환합니다.
    startOfWeek,       // 주어진 날짜가 속한 주의 시작 날짜를 반환합니다.
    endOfWeek,         // 주어진 날짜가 속한 주의 끝 날짜를 반환합니다.
    format,            // 날짜를 지정된 형식의 문자열로 변환합니다.
    isToday,           // 주어진 날짜가 오늘인지 확인합니다.
    isSameDay,         // 두 날짜가 같은 날인지 확인합니다.
    differenceInMinutes, // 두 날짜 사이의 차이를 분 단위로 계산합니다.
} from 'date-fns';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';

// --- 상수 정의 ---
// HOUR_HEIGHT는 타임테이블에서 1시간을 나타내는 픽셀 높이입니다.
const HOUR_HEIGHT = 60;

// --- 컴포넌트 Props 정의 ---

// WeekView 컴포넌트에 전달될 props의 타입을 정의합니다.
interface WeekViewProps {
    // `date`는 현재 보여줄 주(week)를 결정하는 기준 날짜입니다.
    date: Date;
    // `events`는 캘린더에 표시될 모든 이벤트의 배열입니다.
    events?: CalendarEvent[];
    // `onEventPress`는 이벤트 블록이 눌렸을 때 호출될 선택적 콜백 함수입니다.
    onEventPress?: (event: CalendarEvent) => void;
}

// --- 헬퍼 함수 ---

/**
 * 이벤트의 시작 시간과 기간을 기반으로 화면에 표시될 위치와 높이를 계산합니다.
 * @param {CalendarEvent} event - 위치를 계산할 이벤트 객체
 * @returns {{top: number, height: number}} - 이벤트 블록의 top과 height 값
 */
const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const durationInMinutes = differenceInMinutes(event.end, event.start);

    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;

    return { top, height };
};

// --- WeekView 컴포넌트 ---

// WeekView는 특정 날짜가 포함된 한 주 전체의 이벤트를 타임테이블 형식으로 렌더링합니다.
const WeekView: React.FC<WeekViewProps> = ({ date, events = [], onEventPress }) => {
    // 0시부터 23시까지 시간 레이블을 생성합니다. (예: ['00:00', '01:00', ...])
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    // `useMemo`를 사용하여 `date` prop이 변경될 때만 주(week)의 날짜들을 다시 계산합니다.
    // 이는 성능 최적화에 도움이 됩니다.
    const weekDays = useMemo(() => {
        // 주의 시작을 일요일(0)로 설정합니다.
        const weekStartsOn = 0;
        // 현재 `date`가 속한 주의 시작일과 종료일을 계산합니다.
        const start = startOfWeek(date, { weekStartsOn });
        const end = endOfWeek(date, { weekStartsOn });
        // 시작일부터 종료일까지의 모든 날짜 객체를 배열로 만듭니다.
        return eachDayOfInterval({ start, end });
    }, [date]);

    return (
        <View style={{ flex: 1 }}>
            {/* 상단의 요일 및 날짜 헤더 */}
            <S.MWeek style={{ marginLeft: 50, marginBottom: 0 }}>
                {/* 계산된 주(week)의 날짜들을 순회하며 헤더를 렌더링합니다. */}
                {weekDays.map(day => (
                    <S.MDayContainer key={day.toISOString()} style={{ height: 'auto', padding: 5 }}>
                        {/* 요일 (예: 'Mon') */}
                        <S.MDayNameText>{format(day, 'EEE')}</S.MDayNameText>
                        {/* 날짜 (예: '17'), 오늘 날짜는 굵게 표시됩니다. */}
                        <S.MDayText $isToday={isToday(day)}>{format(day, 'd')}</S.MDayText>
                    </S.MDayContainer>
                ))}
            </S.MWeek>

            {/* 주간 타임테이블 */}
            <S.TimetableContainer>
                <S.TimetableGrid>
                    {/* 왼쪽의 시간 표시 열 */}
                    <S.TimeColumn>
                        {timeLabels.map(time => (
                            <S.TimeLabelCell key={time}>
                                <S.TimeLabelText>{time}</S.TimeLabelText>
                            </S.TimeLabelCell>
                        ))}
                    </S.TimeColumn>

                    {/* 오른쪽의 요일별 이벤트 열 컨테이너 */}
                    <S.DaysContainer>
                        {/* 주(week)의 각 날짜에 대해 열(column)을 생성합니다. */}
                        {weekDays.map(day => (
                            <S.DayColumn key={day.toISOString()}>
                                {/* 배경에 시간별 구분선을 그립니다. */}
                                {timeLabels.map(time => <S.HourCell key={`${day.toISOString()}-${time}`} />)}

                                {/* 해당 날짜의 이벤트만 필터링하여 렌더링합니다. */}
                                {events
                                    .filter(event => isSameDay(event.start, day)) // `isSameDay`로 해당 날짜의 이벤트인지 확인
                                    .map(event => {
                                        // 각 이벤트의 위치와 높이를 계산합니다.
                                        const { top, height } = calculateEventPosition(event);
                                        return (
                                            <S.EventBlock
                                                key={event.id}
                                                top={top}
                                                height={height}
                                                color={event.color}
                                                onPress={() => onEventPress?.(event)}
                                            >
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