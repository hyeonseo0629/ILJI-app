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
import { ThemeColors } from "@/types/theme";

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
    schedules: Schedule[];
    tags: Tag[];
    onEventPress?: (event: Schedule) => void;
    colors: ThemeColors; // colors prop 추가
}

const CalendarView: React.FC<SixWeekCalendarProps> = ({date, onDateChange, schedules, tags, onEventPress, colors}) => {
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

    const timedSchedules = useMemo(() => {
        return schedules.filter(schedule => {
            const isNotAllDay = !schedule.isAllDay;
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
                <Text style={{ color: colors.text }}>Loading...</Text>
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
        pagerRef.current?.setPage(2);
    };

    const viewModes: ('month' | 'week' | 'day')[] = ['month', 'week', 'day'];
    const handleViewModeButtonPress = (mode: 'month' | 'week' | 'day') => {
        const pageIndex = viewModes.indexOf(mode);
        pagerRef.current?.setPage(pageIndex);
    };

    return (
        <CS.MonthContainer style={{ paddingBottom: insets.bottom }} $colors={colors}>
            <CS.MonthHeader>
                <CS.MonthText $colors={colors}>{format(date, 'MMMM yyyy')}</CS.MonthText>
                <CS.ViewModeButtonContainer $colors={colors}>
                    <CS.ViewMonthButton $isActive={viewMode === 'month'} onPress={() => handleViewModeButtonPress('month')} $colors={colors}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'month'} $colors={colors}>M</CS.ViewModeButtonText>
                    </CS.ViewMonthButton>
                    <CS.ViewWeekButton $isActive={viewMode === 'week'} onPress={() => handleViewModeButtonPress('week')} $colors={colors}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'week'} $colors={colors}>W</CS.ViewModeButtonText>
                    </CS.ViewWeekButton>
                    <CS.ViewDayButton $isActive={viewMode === 'day'} onPress={() => handleViewModeButtonPress('day')} $colors={colors}>
                        <CS.ViewModeButtonText $isActive={viewMode === 'day'} $colors={colors}>D</CS.ViewModeButtonText>
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
                                        schedules={schedules}
                                        tags={tags}
                                        onDayPress={handleDayPress}
                                        colors={colors}
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
                                    schedules={timedSchedules}
                                    tags={tags}
                                    onDayPress={handleDayPress}
                                    onEventPress={onEventPress}
                                    colors={colors}
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
                                    colors={colors}
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