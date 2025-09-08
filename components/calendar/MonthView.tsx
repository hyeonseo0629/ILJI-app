import React, {useMemo} from 'react';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    isSameDay,
} from 'date-fns';
import * as S from './CalendarStyle';
import {Schedule} from '@/components/calendar/types';
import {Tag} from '@/components/ToDo/types';

interface MonthViewProps {
    date: Date;
    schedules?: Schedule[];
    tags?: Tag[];
    onDayPress?: (day: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({date, schedules = [], tags = [], onDayPress}) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = useMemo(() => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const weekStartsOn = 0; // 0 for Sunday

        const startDate = startOfWeek(monthStart, {weekStartsOn});
        const endDate = endOfWeek(monthEnd, {weekStartsOn});

        const days = eachDayOfInterval({start: startDate, end: endDate});

        const weeksArray = [];
        for (let i = 0; i < days.length; i += 7) {
            weeksArray.push(days.slice(i, i + 7));
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
            {/* 요일 이름 행은 flex 분배에서 제외하고 고정 높이를 유지합니다. */}
            <S.MWeek $isHeader>
                {dayNames.map(name => <S.MDayNameText key={name}>{name}</S.MDayNameText>)}
            </S.MWeek>

            {/* 주(week)들을 감싸는 새로운 컨테이너 추가 */}
            {weeks.map((week, i) => (
                <S.MWeek key={i}>
                    {week.map((day, j) => {
                        if (!day) return <S.MEmptyDayContainer key={`empty-${j}`}/>;
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);
                        const daySchedules = schedules.filter(schedule => isSameDay(schedule.startTime, day));

                        return (
                            <S.MDayContainer
                                key={day.toISOString()}
                                onPress={() => onDayPress?.(day)}
                            >
                                {isCurrentDay ? ( // '오늘' 날짜는 파란색 원으로 감쌉니다.
                                    <S.MDayCircle>
                                        {/* 원 안의 텍스트는 MDayText로 감싸고, 선택된 스타일(흰색)을 적용합니다. */}
                                        <S.MDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</S.MDayText>
                                    </S.MDayCircle>
                                ) : ( // 다른 날짜들은 텍스트만 표시합니다.
                                    <S.MDayText $isNotInMonth={!isCurrentMonth}
                                                $isToday={isCurrentDay}>{format(day, 'd')}</S.MDayText>
                                )}
                                <S.MEventsContainer>
                                    {/* 해당 날짜의 모든 일정을 순회하며 표시합니다. */}
                                    {daySchedules.slice(0, 2).map(schedule => {
                                        const eventColor = tagColorMap.get(schedule.tagId) || 'gray';
                                        return (
                                            <S.EventTitleText key={schedule.id} color={eventColor}>
                                                {schedule.title}
                                            </S.EventTitleText>
                                        );
                                    })}


                                    {/* 이벤트 개수가 2개를 초과하는 경우에만 세 번째 아이템을 렌더링합니다. */}
                                    {daySchedules.length > 2 && (
                                        daySchedules.length > 3 ? (
                                            // 4개 이상일 경우: "+n" 텍스트를 보여줍니다.
                                            <S.MoreEventsText>
                                                + {daySchedules.length - 2} more
                                            </S.MoreEventsText>
                                        ) : (
                                            // 정확히 3개일 경우: 세 번째 이벤트를 그대로 보여줍니다.
                                            <S.EventTitleText key={daySchedules[2].id} color={tagColorMap.get(daySchedules[2].tagId) || 'gray'}>
                                                {daySchedules[2].title}
                                            </S.EventTitleText>
                                        )
                                    )}
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