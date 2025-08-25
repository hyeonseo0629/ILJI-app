import React, {useState, useMemo, useRef, useEffect} from 'react';
import {View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
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
    const flatListRef = useRef<FlatList>(null);
    const [months, setMonths] = useState([sub(date, {months: 1}), date, add(date, {months: 1})]);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(date);
    const {width: screenWidth} = Dimensions.get('window');

    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    // date prop이 변경될 때마다 month 리스트를 재설정합니다.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setMonths([sub(date, {months: 1}), date, add(date, {months: 1})]);
        // 외부에서 날짜가 변경되었을 때 스크롤 위치를 중앙으로 즉시 이동
        setTimeout(() => flatListRef.current?.scrollToIndex({index: 1, animated: false}), 0);
    }, [date]);

    // 샘플 이벤트 데이터. 나중에는 API 호출 등으로 데이터를 가져옵니다.
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
        },]);

    const handleMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (index === 1) return; // 중앙에 그대로 있으면 아무것도 안 함

        const newDate = months[index];
        onDateChange(newDate);
    };

    const handlePrev = () => {
        const newDate = viewMode === 'week' ? sub(date, {weeks: 1}) : sub(date, {days: 1});
        onDateChange(newDate);
    };
    const handleNext = () => {
        const newDate = viewMode === 'week' ? add(date, {weeks: 1}) : add(date, {days: 1});
        onDateChange(newDate);
    };

    // 날짜를 눌렀을 때, 선택된 날짜를 업데이트하고 일별 뷰로 전환합니다.
    const handleDayPress = (day: Date) => {
        setSelectedDate(day);
        setViewMode('day');
    };

    return (
        <S.MContainer>
            <S.MHeader>
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
                <S.ViewModeContainer>
                    <S.ViewModeButton $isActive={viewMode === 'month'}
                                      onPress={() => setViewMode('month')}>
                        <S.ButtonText  $isActive={viewMode === 'month'}>월</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'week'}
                                      onPress={() => setViewMode('week')}>
                        <S.ButtonText  $isActive={viewMode === 'week'}>주</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'day'}
                                      onPress={() => setViewMode('day')}>
                        <S.ButtonText  $isActive={viewMode === 'day'}>일</S.ButtonText>
                    </S.ViewModeButton>
                </S.ViewModeContainer>
            </S.MHeader>

            {viewMode === 'month' && (
                <FlatList
                    ref={flatListRef}
                    data={months}
                    renderItem={({item}) => (
                        <View style={{width: screenWidth, paddingHorizontal: 15}}>
                            <MonthView
                                date={item}
                                events={events}
                                onDayPress={handleDayPress}
                            />
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
            )}
            {viewMode === 'week' && <WeekView date={date} events={events} onEventPress={(e) => alert(e.title)}/>}

            {viewMode === 'day' && (
                <DayView
                    date={selectedDate}
                    events={events.filter(e => isSameDay(e.date, selectedDate))}
                />
            )}
        </S.MContainer>
    );
};

export default CalendarView;