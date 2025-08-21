import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import {
    format,
    add,
    sub,
    isValid,
} from 'date-fns';
import * as S from './CalendarStyle';
import MonthView from './MonthView';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const SixWeekCalendar: React.FC<SixWeekCalendarProps> = ({ date, onDateChange }) => {
    const flatListRef = useRef<FlatList>(null);
    const [months, setMonths] = useState([sub(date, { months: 1 }), date, add(date, { months: 1 })]);
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


    return (
        <S.MContainer>
            <S.MHeader>
                {/* 이전/다음 버튼은 이제 FlatList 스와이프로 대체됩니다. */}
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
            </S.MHeader>
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
                initialScrollIndex={1} // 항상 중앙(현재 월)에서 시작
                onMomentumScrollEnd={handleMomentumScrollEnd}
                getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                })}
            />
        </S.MContainer>
    );
};

export default SixWeekCalendar;