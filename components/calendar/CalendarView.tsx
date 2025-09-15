import React, {useState, useMemo, useRef, useEffect} from 'react';
import {View, Text, FlatList, Dimensions, Alert} from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    format,
    add,
    sub,
    isValid,
    isSameDay,
    set,
    differenceInCalendarDays
} from 'date-fns';
import * as CS from '../style/CalendarStyled';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
    schedules: Schedule[];
    tags: Tag[];
    // [수정] onSchedulesChange는 Context로 대체되었으므로 제거합니다.
    onEventPress?: (event: Schedule) => void; // [추가] 부모로부터 클릭 이벤트를 받을 함수
}

const CalendarView: React.FC<SixWeekCalendarProps> = ({date, onDateChange, schedules, tags, onEventPress}) => {
    // Refs for controlling pagers and lists
    const pagerRef = useRef<PagerView>(null);
    const monthFlatListRef = useRef<FlatList>(null);
    const weekPagerRef = useRef<PagerView>(null);
    const dayPagerRef = useRef<PagerView>(null);

    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [monthContainerHeight, setMonthContainerHeight] = useState(0);

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);

    const [months, setMonths] = useState([sub(date, {months: 1}), date, add(date, {months: 1})]);
    const [weeks, setWeeks] = useState([sub(date, {weeks: 1}), date, add(date, {weeks: 1})]);
    const [days, setDays] = useState([sub(date, {days: 1}), date, add(date, {days: 1})]);

    // WeekView와 DayView에 표시할 '시간 지정' 일정만 필터링합니다.
    // `schedules`가 변경될 때마다 이 목록이 다시 계산되어 삭제/수정이 반영됩니다.
    const timedSchedules = useMemo(() => {
        return schedules.filter(schedule => {
            // 조건 1: '종일' 일정이 아니어야 함
            const isNotAllDay = !schedule.isAllDay;
            // 조건 2: 시작일과 종료일이 같은 날이어야 함 (하루 안에 끝나는 일정)
            const isSingleDay = differenceInCalendarDays(schedule.endTime, schedule.startTime) < 1;
            return isNotAllDay && isSingleDay;
        });
    }, [schedules])

    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isValid(date)) {
            setMonths([sub(date, {months: 1}), date, add(date, {months: 1})]);
            setWeeks([sub(date, {weeks: 1}), date, add(date, {weeks: 1})]);
            setDays([sub(date, {days: 1}), date, add(date, {days: 1})]);

            setTimeout(() => {
                monthFlatListRef.current?.scrollToIndex({index: 1, animated: false});
                weekPagerRef.current?.setPageWithoutAnimation(1);
                dayPagerRef.current?.setPageWithoutAnimation(1);
            }, 0);
        }
    }, [date]);

    if (!isValid(date)) {
        return (
            <CS.MonthLoadingContainer>
                <Text>Loading...</Text>
            </CS.MonthLoadingContainer>
        );
    }

    const handleMonthScrollEnd = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const containerHeight = event.nativeEvent.layoutMeasurement.height;
        const index = Math.round(offsetY / containerHeight);
        if (index === 1) return;
        onDateChange(months[index]);
    };

    const handleDayPress = (day: Date) => {
        onDateChange(day);
        // Pager를 Day View(인덱스 2)로 전환합니다.
        pagerRef.current?.setPage(2);
    };

    const viewModes: ('month' | 'week' | 'day')[] = ['month', 'week', 'day'];
    const handleViewModeButtonPress = (mode: 'month' | 'week' | 'day') => {
        const pageIndex = viewModes.indexOf(mode);
        pagerRef.current?.setPage(pageIndex);
    };

    return (
        <CS.MonthContainer style={{ paddingBottom: insets.bottom }}>
            <CS.MonthHeader>
                <CS.MonthText>{format(date, 'MMMM yyyy')}</CS.MonthText>
                <CS.ViewModeButtonContainer>
                    <CS.ViewMonthButton $isActive={viewMode === 'month'}
                                      onPress={() => handleViewModeButtonPress('month')}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'month'}>M</CS.ViewModeButtonText>
                    </CS.ViewMonthButton>
                    <CS.ViewWeekButton $isActive={viewMode === 'week'}
                                      onPress={() => handleViewModeButtonPress('week')}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'week'}>W</CS.ViewModeButtonText>
                    </CS.ViewWeekButton>
                    <CS.ViewDayButton $isActive={viewMode === 'day'}
                                      onPress={() => handleViewModeButtonPress('day')}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'day'}>D</CS.ViewModeButtonText>
                    </CS.ViewDayButton>
                </CS.ViewModeButtonContainer>
            </CS.MonthHeader>

            <PagerView
                ref={pagerRef}
                style={{flex: 1}}
                initialPage={0}
                orientation="horizontal"
                onPageSelected={(e) => {
                    const newViewMode = viewModes[e.nativeEvent.position];
                    setViewMode(newViewMode);
                }}
            >
                <View
                    key="1"
                    style={{ flex: 1 }}
                    onLayout={(e) => {
                        if (monthContainerHeight === 0) {
                            setMonthContainerHeight(e.nativeEvent.layout.height);
                        }
                    }}
                >
                    {monthContainerHeight > 0 && (
                        <FlatList
                            ref={monthFlatListRef}
                            data={months}
                            renderItem={({item}) => (
                                <View style={{height: monthContainerHeight, margin: 5}}>
                                    <MonthView
                                        date={item}
                                        schedules={schedules} // MonthView는 모든 일정을 그대로 받습니다.
                                        tags={tags}
                                        onDayPress={handleDayPress}
                                    />
                                </View>
                            )}
                            keyExtractor={(item) => item.toISOString()}
                            pagingEnabled
                            showsVerticalScrollIndicator={false}
                            initialScrollIndex={1}
                            onMomentumScrollEnd={handleMonthScrollEnd}
                            getItemLayout={(data, index) => ({length: monthContainerHeight, offset: monthContainerHeight * index, index})}
                        />
                    )}
                </View>

                <View key="2">
                    <PagerView
                        ref={weekPagerRef}
                        style={{flex: 1}}
                        orientation="vertical"
                        initialPage={1}
                        onPageSelected={(e) => {
                            if (e.nativeEvent.position !== 1) {
                                onDateChange(weeks[e.nativeEvent.position]);
                            }
                        }}
                    >
                        {weeks.map((weekDate, index) => (
                            <View key={index}>
                                <WeekView
                                    date={weekDate}
                                    schedules={timedSchedules} // WeekView는 필터링된 일정을 받습니다.
                                    tags={tags}
                                    onDayPress={handleDayPress}
                                    onEventPress={onEventPress}
                                />
                            </View>
                        ))}
                    </PagerView>
                </View>

                <View key="3">
                    <PagerView
                        ref={dayPagerRef}
                        style={{flex: 1}}
                        orientation="vertical"
                        initialPage={1}
                        onPageSelected={(e) => {
                            if (e.nativeEvent.position !== 1) {
                                onDateChange(days[e.nativeEvent.position]);
                            }
                        }}
                    >
                        {days.map((dayDate, index) => (
                            <View key={index}>
                                <DayView
                                    date={dayDate}
                                    schedules={timedSchedules.filter(schedule => isSameDay(schedule.startTime, dayDate))}
                                    tags={tags}
                                    onEventPress={onEventPress}
                                />
                            </View>
                        ))}
                    </PagerView>
                </View>
            </PagerView>
        </CS.MonthContainer>
    );
};

export default CalendarView;