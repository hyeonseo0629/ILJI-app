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
    isWithinInterval,
} from 'date-fns';
import * as CS from '../style/CalendarStyled';
import {Schedule} from '@/components/calendar/scheduleTypes';
import {Tag} from '@/components/tag/TagTypes';

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

    const tagColorMap = useMemo(() => {
        const map = new Map<number, string>();
        if (tags) {
            tags.forEach(tag => {
                map.set(tag.id, tag.color);
            });
        }
        return map;
    }, [tags]);

    // [성능 개선] schedules 배열을 날짜별로 그룹화된 Map으로 미리 가공합니다.
    const schedulesByDate = useMemo(() => {
        const map = new Map<string, Schedule[]>();
        schedules.forEach(schedule => {
            const startDate = new Date(schedule.startTime);
            const endDate = new Date(schedule.endTime);

            // UTC 기준 날짜로 하루씩 순회하며 맵에 추가합니다.
            let current = new Date(startDate);
            current.setUTCHours(0, 0, 0, 0);

            while (current <= endDate) {
                const dateKey = current.toISOString().substring(0, 10); // 'YYYY-MM-DD'
                const existingSchedules = map.get(dateKey) || [];
                map.set(dateKey, [...existingSchedules, schedule]);

                // 다음 날짜로 이동 (UTC 기준)
                current.setUTCDate(current.getUTCDate() + 1);
            }
        });
        return map;
    }, [schedules]);

    return (
        <>
            {/* 요일 이름 행은 flex 분배에서 제외하고 고정 높이를 유지합니다. */}
            <CS.MonthWeek $isHeader>
                {dayNames.map(name => <CS.MonthDayNameText key={name}>{name}</CS.MonthDayNameText>)}
            </CS.MonthWeek>

            {/* 주(week)들을 감싸는 새로운 컨테이너 추가 */}
            {weeks.map((week, i) => (
                <CS.MonthWeek key={i}>
                    {week.map((day, j) => {
                        if (!day) return <CS.MonthEmptyDayContainer key={`empty-${j}`}/>;
                        const isCurrentMonth = isSameMonth(day, date);
                        const isCurrentDay = isToday(day);

                        // [수정] 시간대 문제를 해결하기 위해 UTC 기준으로 날짜 키를 생성합니다.
                        const tempDate = new Date(day);
                        tempDate.setMinutes(tempDate.getMinutes() - tempDate.getTimezoneOffset());
                        const dateKey = tempDate.toISOString().substring(0, 10);
                        const daySchedules = schedulesByDate.get(dateKey) || [];

                        // [추가] 세로 정렬 문제를 해결하기 위한 정렬 로직
                        daySchedules.sort((a, b) => {
                            const aIsMultiDay = !isSameDay(new Date(a.startTime), new Date(a.endTime));
                            const bIsMultiDay = !isSameDay(new Date(b.startTime), new Date(b.endTime));

                            if (aIsMultiDay !== bIsMultiDay) {
                                return aIsMultiDay ? -1 : 1; // 장기 일정을 항상 위로
                            }
                            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime(); // 그 외에는 시작 시간 순
                        });

                        return (
                            <CS.MonthDayContainer
                                key={day.toISOString()}
                                onPress={() => onDayPress?.(day)}
                            >
                                {isCurrentDay ? ( // '오늘' 날짜는 파란색 원으로 감쌉니다.
                                    <CS.MonthDayCircle>
                                        {/* 원 안의 텍스트는 MDayText로 감싸고, 선택된 스타일(흰색)을 적용합니다. */}
                                        <CS.MonthDayText $isSelected={true} $isToday={true}>{format(day, 'd')}</CS.MonthDayText>
                                    </CS.MonthDayCircle>
                                ) : ( // 다른 날짜들은 텍스트만 표시합니다.
                                    <CS.MonthDayText $isNotInMonth={!isCurrentMonth}
                                                     $isToday={isCurrentDay}>{format(day, 'd')}</CS.MonthDayText>
                                )}
                                <CS.MonthSchedulesContainer>
                                    {/* 해당 날짜의 모든 일정을 순회하며 표시합니다. */}
                                    {daySchedules.slice(0, 2).map((schedule, index) => {
                                        const eventColor = tagColorMap.get(schedule.tagId) || 'gray';

                                        const isMultiDay = !isSameDay(new Date(schedule.startTime), new Date(schedule.endTime));
                                        const isStart = isSameDay(day, new Date(schedule.startTime));
                                        const isEnd = isSameDay(day, new Date(schedule.endTime));

                                        let position: 'start' | 'middle' | 'end' | 'single' = 'middle';
                                        if (!isMultiDay) {
                                            position = 'single';
                                        } else if (isStart) {
                                            position = 'start';
                                        } else if (isEnd) {
                                            position = 'end';
                                        }

                                        const topPosition = index * 14;

                                        return (
                                            <CS.EventBar
                                                key={schedule.id}
                                                color={eventColor}
                                                $position={position}
                                                $isCurrentMonth={isCurrentMonth}
                                                $top={topPosition}
                                            >
                                                <CS.EventBarText>
                                                    {position === 'start' || position === 'single' ? schedule.title : ''}
                                                </CS.EventBarText>
                                            </CS.EventBar>
                                        );
                                    })}


                                    {/* 이벤트 개수가 2개를 초과하는 경우에만 세 번째 아이템을 렌더링합니다. */}
                                    {daySchedules.length > 2 && (
                                        daySchedules.length > 3 ? (
                                            // 4개 이상일 경우: "+n" 텍스트를 보여줍니다.
                                            <CS.MoreScheduleText $top={2 * 14}>
                                                + {daySchedules.length - 2} more
                                            </CS.MoreScheduleText>
                                        ) : (
                                            // 정확히 3개일 경우: 세 번째 이벤트를 그대로 보여줍니다.
                                            <CS.ScheduleTitleText key={daySchedules[2].id} color={tagColorMap.get(daySchedules[2].tagId) || 'gray'} $top={2 * 14}>
                                                {daySchedules[2].title}
                                            </CS.ScheduleTitleText>
                                        )
                                    )}
                                </CS.MonthSchedulesContainer>
                            </CS.MonthDayContainer>
                        );
                    })}
                </CS.MonthWeek>
            ))}
        </>
    );
};

export default MonthView;