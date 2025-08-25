import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import {
    format,
    add,
    sub,
    isValid,
    isSameDay,
} from 'date-fns';
import * as S from './CalendarStyle';
import MonthView from './MonthView';
import WeekView from './WeekView';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

type ViewMode = 'Month' | 'Week' | 'Day';

const SixWeekCalendar: React.FC<SixWeekCalendarProps> = ({ date, onDateChange }) => {
    const flatListRef = useRef<FlatList>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('Month');
    const { width: screenWidth } = Dimensions.get('window');

    // `date` prop이 변경될 때만 `months` 배열을 새로 계산합니다.
    // useState와 useEffect를 함께 사용하는 것보다 효율적이며, 불필요한 리렌더링을 방지합니다.
    const months = useMemo(() => [sub(date, { months: 1 }), date, add(date, { months: 1 })], [date]);

    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    useEffect(() => {
        // Month 뷰에서 date가 변경될 때만 스크롤 위치를 중앙으로 이동시킵니다.
        if (viewMode === 'Month') {
            setTimeout(() => flatListRef.current?.scrollToIndex({ index: 1, animated: false }), 0);
        }
    }, [date, viewMode]);

    const handleMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (index === 1) return; // 중앙에 그대로 있으면 아무것도 안 함

        const newDate = months[index];
        onDateChange(newDate);
    };


    return (
        <S.MContainer style={viewMode !== 'Month' && styles.flexContainer}>
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
                <WeekView
                    date={date}
                    onDateChange={onDateChange}
                />
            )}

        </S.MContainer>
    );
};

const styles = StyleSheet.create({
    flexContainer: { flex: 1 },
});

export default SixWeekCalendar;