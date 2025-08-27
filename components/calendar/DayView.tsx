import React from 'react';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';
import { differenceInMinutes } from 'date-fns';

// --- 상수 정의 ---
// HOUR_HEIGHT는 타임테이블에서 1시간을 나타내는 픽셀 높이입니다.
const HOUR_HEIGHT = 60;

// --- 헬퍼 함수 ---

/**
 * 이벤트의 시작 시간과 기간을 기반으로 화면에 표시될 위치와 높이를 계산합니다.
 * @param {CalendarEvent} event - 위치를 계산할 이벤트 객체
 * @returns {{top: number, height: number}} - 이벤트 블록의 top과 height 값
 */
const calculateEventPosition = (event: CalendarEvent) => {
    // 이벤트의 시작 시간에서 시(hour)와 분(minute)을 가져옵니다.
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    // `date-fns`를 사용하여 이벤트의 시작과 끝 시간 사이의 총 분(minute)을 계산합니다.
    const durationInMinutes = differenceInMinutes(event.end, event.start);

    // `top` 위치는 시간과 분을 기반으로 계산됩니다. (예: 9시 30분 -> 9.5 * HOUR_HEIGHT)
    const top = (startHour * HOUR_HEIGHT) + (startMinute / 60 * HOUR_HEIGHT);
    // `height`는 이벤트의 총 지속 시간을 분 단위로 계산하여 높이로 변환합니다.
    const height = (durationInMinutes / 60) * HOUR_HEIGHT;

    return { top, height };
};

// --- 컴포넌트 Props 정의 ---

// DayView 컴포넌트에 전달될 props의 타입을 정의합니다.
interface DayViewProps {
    // `events`는 해당 날짜에 표시할 이벤트 객체들의 배열입니다.
    events: CalendarEvent[];
    // `onEventPress`는 이벤트 블록이 눌렸을 때 호출될 선택적 콜백 함수입니다.
    onEventPress?: (event: CalendarEvent) => void;
}

// --- DayView 컴포넌트 ---

// DayView는 특정 날짜의 이벤트를 시간대별로 보여주는 타임테이블 UI를 렌더링합니다.
const DayView: React.FC<DayViewProps> = ({ events = [], onEventPress }) => {
    // 0시부터 23시까지 시간 레이블을 생성합니다. (예: ['00:00', '01:00', ...])
    const timeLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    return (
        // 타임테이블 전체를 감싸는 스크롤 가능한 컨테이너입니다.
        <S.TimetableContainer>
            {/* 시간 열과 이벤트 열을 가로로 배열하는 그리드입니다. */}
            <S.TimetableGrid>
                {/* 왼쪽의 시간 표시 열 */}
                <S.TimeColumn>
                    {/* 생성된 시간 레이블을 순회하며 화면에 표시합니다. */}
                    {timeLabels.map(time => (
                        <S.TimeLabelCell key={time}>
                            <S.TimeLabelText>{time}</S.TimeLabelText>
                        </S.TimeLabelCell>
                    ))}
                </S.TimeColumn>

                {/* 오른쪽의 이벤트 표시 열 */}
                <S.DayColumn>
                    {/* 배경에 시간별 구분선을 그리기 위해 HourCell을 렌더링합니다. */}
                    {timeLabels.map(time => <S.HourCell key={time} />)}

                    {/* props로 받은 이벤트 배열을 순회하며 각 이벤트를 렌더링합니다. */}
                    {events.map(event => {
                        // 각 이벤트의 위치와 높이를 계산합니다.
                        const { top, height } = calculateEventPosition(event);
                        return (
                            // 계산된 위치와 높이를 사용하여 이벤트 블록을 절대 위치에 배치합니다.
                            <S.EventBlock
                                key={event.id}
                                top={top}
                                height={height}
                                color={event.color}
                                onPress={() => onEventPress?.(event)} // 이벤트 블록을 누르면 onEventPress 함수를 호출합니다.
                            >
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