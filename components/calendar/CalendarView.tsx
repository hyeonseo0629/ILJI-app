import React, {useState, useMemo, useRef, useEffect} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import PagerView from 'react-native-pager-view';
import {
    format,
    add,
    sub,
    isValid,
    isSameDay,
    set,
} from 'date-fns';
import * as S from './CalendarStyle';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import {CalendarEvent} from './types';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const CalendarView: React.FC<SixWeekCalendarProps> = ({date, onDateChange}) => {
    // Refs for controlling pagers and lists
    const pagerRef = useRef<PagerView>(null);
    const monthFlatListRef = useRef<FlatList>(null);
    const weekPagerRef = useRef<PagerView>(null);
    const dayPagerRef = useRef<PagerView>(null);

    // State for different views and selections
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(date);
    const [monthContainerHeight, setMonthContainerHeight] = useState(0);

    // Data sources for vertical swiping in each view
    const [months, setMonths] = useState([sub(date, {months: 1}), date, add(date, {months: 1})]);
    const [weeks, setWeeks] = useState([sub(date, {weeks: 1}), date, add(date, {weeks: 1})]);
    const [days, setDays] = useState([sub(date, {days: 1}), date, add(date, {days: 1})]);

    // Sample event data
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: '1',
            title: '팀 회의',
            color: 'tomato',
            start: set(new Date(), {hours: 10, minutes: 0, seconds: 0}),
            end: set(new Date(), {hours: 11, minutes: 30, seconds: 0}),
        },
        {
            id: '2',
            title: '디자인 리뷰',
            color: 'royalblue',
            start: set(add(new Date(), {days: 2}), {hours: 14, minutes: 0, seconds: 0}),
            end: set(add(new Date(), {days: 2}), {hours: 15, minutes: 0, seconds: 0}),
        },
    ]);

    // When the central date changes, update all data sources and reset inner pagers
    useEffect(() => {
        if (isValid(date)) {
            setMonths([sub(date, {months: 1}), date, add(date, {months: 1})]);
            setWeeks([sub(date, {weeks: 1}), date, add(date, {weeks: 1})]);
            setDays([sub(date, {days: 1}), date, add(date, {days: 1})]);

            // Use setTimeout to ensure the UI has updated before scrolling
            setTimeout(() => {
                monthFlatListRef.current?.scrollToIndex({index: 1, animated: false});
                weekPagerRef.current?.setPageWithoutAnimation(1);
                dayPagerRef.current?.setPageWithoutAnimation(1);
            }, 0);
        }
    }, [date]);

    // Loading state for invalid dates
    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    // Handlers
    const handleMonthScrollEnd = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const containerHeight = event.nativeEvent.layoutMeasurement.height;
        const index = Math.round(offsetY / containerHeight);
        if (index === 1) return;
        onDateChange(months[index]);
    };

    const handleDayPress = (day: Date) => {
        // Day View로 전환하기 전에, 앱의 중앙 날짜를 클릭된 날짜로 업데이트합니다.
        // 이렇게 해야 Day View가 올바른 날짜의 데이터를 가지고 렌더링될 수 있습니다.
        onDateChange(day);
        // selectedDate 상태도 동기화해줍니다.
        setSelectedDate(day);
        // Pager를 Day View(인덱스 2)로 전환합니다.
        pagerRef.current?.setPage(2);
    };

    const viewModes: ('month' | 'week' | 'day')[] = ['month', 'week', 'day'];
    const handleViewModeButtonPress = (mode: 'month' | 'week' | 'day') => {
        const pageIndex = viewModes.indexOf(mode);
        pagerRef.current?.setPage(pageIndex);
    };

    return (
        <S.MContainer>
            <S.MHeader>
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
                <S.ViewModeContainer>
                    <S.ViewModeButton $isActive={viewMode === 'month'}
                                      onPress={() => handleViewModeButtonPress('month')}>
                        <S.ButtonText $isActive={viewMode === 'month'}>M</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'week'} onPress={() => handleViewModeButtonPress('week')}>
                        <S.ButtonText $isActive={viewMode === 'week'}>W</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'day'} onPress={() => handleViewModeButtonPress('day')}>
                        <S.ButtonText $isActive={viewMode === 'day'}>D</S.ButtonText>
                    </S.ViewModeButton>
                </S.ViewModeContainer>
            </S.MHeader>

            {/* Outer Pager for Month/Week/Day view switching (Horizontal) */}
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
                {/* Page 1: Month View */}
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
                                <View style={{height: monthContainerHeight}}>
                                    <MonthView date={item} events={events} onDayPress={handleDayPress}/>
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

                {/* Page 2: Week View */}
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
                                    events={events}
                                    onDayPress={handleDayPress}
                                />
                            </View>
                        ))}
                    </PagerView>
                </View>

                {/* Page 3: Day View */}
                <View key="3">
                    <PagerView
                        ref={dayPagerRef}
                        style={{flex: 1}}
                        orientation="vertical"
                        initialPage={1}
                        onPageSelected={(e) => {
                            if (e.nativeEvent.position !== 1) {
                                // For day view, swiping changes the main date
                                onDateChange(days[e.nativeEvent.position]);
                                // Also update selectedDate to keep them in sync
                                setSelectedDate(days[e.nativeEvent.position]);
                            }
                        }}
                    >
                        {days.map((dayDate, index) => (
                            <View key={index}>
                                <DayView
                                    date={dayDate}
                                    events={events.filter(event => isSameDay(event.start, dayDate))}
                                />
                            </View>
                        ))}
                    </PagerView>
                </View>
            </PagerView>
        </S.MContainer>
    );
};

export default CalendarView;