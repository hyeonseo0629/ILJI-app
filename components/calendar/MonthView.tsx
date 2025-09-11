import React, { useMemo } from 'react';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isSameMonth,
    isToday,
    isSameDay,
} from 'date-fns';
import * as S from '../style/CalendarStyled';
import {Schedule} from '@/components/calendar/scheduleTypes';
import {Tag} from '@/components/ToDo/types';

interface MonthViewProps {
    date: Date;
    schedules?: Schedule[];
    tags?: Tag[];
    onDayPress?: (day: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ date, schedules = [], tags = [], onDayPress }) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const weekStartsOn = 0; // 0 for Sunday

        // 달력 그리드의 시작일 (해당 월의 첫 날이 포함된 주의 일요일)
        const startDate = startOfWeek(monthStart, { weekStartsOn });

        // 6주(42일) 후의 날짜를 계산합니다. addDays는 새로운 Date 객체를 반환하여 안전합니다.
        const endDate = addDays(startDate, 41);

        // 6주(42일)치 날짜를 생성하여 그리드를 만듭니다.
        const days = eachDayOfInterval({ start: startDate, end: endDate });

        const weeksArray = [];
        for (let i = 0; i < 6; i++) {
            weeksArray.push(days.slice(i * 7, (i + 1) * 7));
        }
        return weeksArray;
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
        <>
            <S.MWeek style={{height: 20}}>
                {dayNames.map(name => <S.MDayNameText key={name}>{name}</S.MDayNameText>)}
            </S.MWeek>
            {weeks.map((week, i) => (
                <S.MWeek key={i}>
                    {week.map((day, j) => {
                        if (!day) return <S.MEmptyDayContainer key={`empty-${j}`} />;
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);
                        const daySchedules = schedules.filter(schedule => isSameDay(schedule.startTime, day));

                        return (
                            <S.MDayContainer
                                key={day.toISOString()}
                                onPress={() => onDayPress?.(day)}
                            >
                                {isCurrentDay ? ( // '오늘' 날짜는 파란색 원으로 감쌉니다.
                                    <S.MDayCircle $isCurrentMonth={isCurrentMonth}>
                                        {/* 원 안의 텍스트는 MDayText로 감싸고, 선택된 스타일(흰색)을 적용합니다. */}
                                        <S.MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</S.MDayText>
                                    </S.MDayCircle>
                                ) : ( // 다른 날짜들은 텍스트만 표시합니다.
                                    <S.MDayText $isNotInMonth={!isCurrentMonth} $isToday={isCurrentDay}>{format(day, 'd')}</S.MDayText>
                                )}
                                <S.MEventsContainer>
                                    {/* 해당 날짜의 모든 일정을 순회하며 표시합니다. */}
                                    {daySchedules.map(schedule => {
                                        const eventColor = tagColorMap.get(schedule.tagId) || 'gray';
                                        return (
                                            <S.EventTitleText key={schedule.id} color={eventColor} $isCurrentMonth={isCurrentMonth}>
                                                {schedule.title}
                                            </S.EventTitleText>
                                        );
                                    })}
                                </S.MEventsContainer>
                            </S.MDayContainer>
                        );
                    })}
                </S.MWeek>
            ))}
        </>
    );
};

export default MonthView;