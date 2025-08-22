import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import {
    format,
    add,
    sub,
    isValid,
    isSameDay,
} from 'date-fns';
import * as S from './CalendarStyle';
import MonthView from './MonthView';
import { WeekCalendar } from 'react-native-calendars';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

type ViewMode = 'Month' | 'Week' | 'Day';

const SixWeekCalendar: React.FC<SixWeekCalendarProps> = ({ date, onDateChange }) => {
    const flatListRef = useRef<FlatList>(null);
    const [months, setMonths] = useState([sub(date, { months: 1 }), date, add(date, { months: 1 })]);
    const [viewMode, setViewMode] = useState<ViewMode>('Month');
    const { width: screenWidth } = Dimensions.get('window');

    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    // date prop이 변경될 때마다 month 리스트를 재설정합니다.
    useEffect(() => {
        setMonths([sub(date, { months: 1 }), date, add(date, { months: 1 })]);
        // 외부에서 날짜가 변경되었을 때 스크롤 위치를 중앙으로 즉시 이동
        setTimeout(() => flatListRef.current?.scrollToIndex({ index: 1, animated: false }), 0);
    }, [date]);

    const handleMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (index === 1) return; // 중앙에 그대로 있으면 아무것도 안 함

        const newDate = months[index];
        onDateChange(newDate);
    };

    const handleDayPress = (day: { timestamp: number }) => {
        const newDate = new Date(day.timestamp);
        // 무한 루프를 방지하기 위해, 현재 선택된 날짜와 다른 날짜를 눌렀을 때만 상태를 변경합니다.
        if (!isSameDay(newDate, date)) {
            onDateChange(newDate);
        }
    };


    return (
        <S.MContainer>
            <S.MHeader>
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
                <S.MViewModeContainer>
                    <S.MViewModeButton onPress={() => setViewMode('Day')} isActive={viewMode === 'Day'}>
                        <S.MViewModeButtonText isActive={viewMode === 'Day'}>Day</S.MViewModeButtonText>
                    </S.MViewModeButton>
                    <S.MViewModeButton onPress={() => setViewMode('Week')} isActive={viewMode === 'Week'}>
                        <S.MViewModeButtonText isActive={viewMode === 'Week'}>Week</S.MViewModeButtonText>
                    </S.MViewModeButton>
                    <S.MViewModeButton onPress={() => setViewMode('Month')} isActive={viewMode === 'Month'}>
                        <S.MViewModeButtonText isActive={viewMode === 'Month'}>Month</S.MViewModeButtonText>
                    </S.MViewModeButton>
                </S.MViewModeContainer>
            </S.MHeader>

            {viewMode === 'Month' && (
                <FlatList
                    ref={flatListRef}
                    data={months}
                    renderItem={({ item }) => (
                        <View style={{ width: screenWidth }}>
                            <MonthView date={item} />
                        </View>
                    )}
                    keyExtractor={(item) => item.toISOString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={1}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index,
                    })}
                />
            )}

            {viewMode === 'Week' && (
                <WeekCalendar
                    current={format(date, 'yyyy-MM-dd')}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [format(date, 'yyyy-MM-dd')]: { selected: true, selectedColor: 'mediumslateblue' },
                    }}
                />
            )}
        </S.MContainer>
    );
};

export default SixWeekCalendar;