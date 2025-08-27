import React, { useMemo } from 'react';
import {
    eachDayOfInterval, // 주어진 기간 내의 모든 날짜를 배열로 반환합니다.
    startOfMonth,      // 주어진 날짜가 속한 달의 시작 날짜를 반환합니다.
    startOfWeek,       // 주어진 날짜가 속한 주의 시작 날짜를 반환합니다.
    format,            // 날짜를 지정된 형식의 문자열로 변환합니다.
    add,               // 날짜에 특정 기간을 더합니다.
    isSameMonth,       // 두 날짜가 같은 달에 속하는지 확인합니다.
    isToday,           // 주어진 날짜가 오늘인지 확인합니다.
    isSameDay,         // 두 날짜가 같은 날인지 확인합니다.
} from 'date-fns';
import * as S from './CalendarStyle';
import { CalendarEvent } from './types';

// --- 컴포넌트 Props 정의 ---

interface MonthViewProps {
    // `date`는 현재 보여줄 월(month)을 결정하는 기준 날짜입니다.
    date: Date;
    // `events`는 캘린더에 표시될 이벤트의 배열입니다.
    events?: CalendarEvent[];
    // `onDayPress`는 특정 날짜가 눌렸을 때 호출될 선택적 콜백 함수입니다.
    onDayPress?: (day: Date) => void;
}

// --- MonthView 컴포넌트 ---

const MonthView: React.FC<MonthViewProps> = ({ date, events = [], onDayPress }) => {
    // 요일 헤더에 표시될 이름 배열입니다.
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // `useMemo`를 사용하여 `date` prop이 변경될 때만 캘린더에 표시될 주(week) 배열을 다시 계산합니다.
    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const weekStartsOn = 0; // 주의 시작을 일요일(0)로 설정합니다.
        const startDate = startOfWeek(monthStart, { weekStartsOn });
        const endDate = add(startDate, { days: 41 });
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        const weeksArray = [];
        for (let i = 0; i < 6; i++) {
            weeksArray.push(days.slice(i * 7, (i + 1) * 7));
        }
        return weeksArray;
    }, [date]);

    return (
        <>
            {/* 요일 헤더 (일, 월, 화...) */}
            <S.MWeek>
                {dayNames.map(name => <S.MDayNameText key={name}>{name}</S.MDayNameText>)}
            </S.MWeek>

            {/* 캘린더의 주(week)들을 렌더링합니다. */}
            {weeks.map((week, weekIndex) => (
                // **수정된 부분:**
                // 각 주(week)의 key를 날짜 기반이 아닌 인덱스 기반으로 변경하여 안정성을 높입니다.
                // 이 방법은 리스트가 재정렬되지 않는 경우에 안전하며, 렌더링 오류를 방지합니다.
                <S.MWeek key={`week-${weekIndex}`}>
                    {/* 각 주의 날짜들을 렌더링합니다. */}
                    {week.map((day, dayIndex) => {
                        if (!day) {
                            return <S.MEmptyDayContainer key={`empty-${weekIndex}-${dayIndex}`} />;
                        }

                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);
                        const dayEvents = events.filter(event => event && event.start && isSameDay(event.start, day));

                        return (
                            <S.MDayContainer
                                // **수정된 부분:** 각 날짜의 key도 인덱스 기반으로 변경하여 고유성과 안정성을 보장합니다.
                                key={`day-${weekIndex}-${dayIndex}`}
                                onPress={() => onDayPress?.(day)}
                            >
                                {isCurrentDay ? ( // '오늘' 날짜는 특별한 스타일(원)을 적용합니다.
                                    <S.MDayCircle>
                                        <S.MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</S.MDayText>
                                    </S.MDayCircle>
                                ) : ( // 다른 날짜들은 일반 텍스트로 표시합니다.
                                    <S.MDayText $isNotInMonth={!isCurrentMonth} $isToday={isCurrentDay}>{format(day, 'd')}</S.MDayText>
                                )}
                                {dayEvents.length > 0 && <S.EventDot color={dayEvents[0].color} />}
                            </S.MDayContainer>
                        );
                    })}
                </S.MWeek>
            ))}
        </>
    );
};

export default MonthView;