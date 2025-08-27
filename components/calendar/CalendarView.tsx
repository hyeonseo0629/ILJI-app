import React, {useState, useRef, useEffect} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import {
    format,       // 날짜를 지정된 형식의 문자열로 변환합니다.
    add,          // 날짜에 특정 기간을 더합니다.
    sub,          // 날짜에서 특정 기간을 뺍니다.
    isValid,      // 주어진 날짜가 유효한지 확인합니다.
    isSameDay,    // 두 날짜가 같은 날인지 확인합니다.
    set,          // 날짜의 특정 부분(시간, 분 등)을 설정합니다.
} from 'date-fns';
import * as S from './CalendarStyle';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import {CalendarEvent} from './types';

// --- 컴포넌트 Props 정의 ---

interface CalendarViewProps {
    // `date`는 캘린더의 현재 날짜를 나타냅니다.
    date: Date;
    // `onDateChange`는 날짜가 변경될 때 부모 컴포넌트로 새 날짜를 전달하는 콜백 함수입니다.
    onDateChange: (newDate: Date) => void;
}

// --- CalendarView 컴포넌트 ---

const CalendarView: React.FC<CalendarViewProps> = ({date, onDateChange}) => {
    const flatListRef = useRef<FlatList>(null);
    const [months, setMonths] = useState([sub(date, {months: 1}), date, add(date, {months: 1})]);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(date);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // **수정된 부분:**
    // 화면 전체 너비에서 부모 컨테이너의 좌우 패딩(각각 30px)을 뺀 값을 캘린더의 너비로 명시적으로 계산합니다.
    // 이렇게 하면 동적 측정의 불안정성을 피하고 항상 정확한 너비를 보장할 수 있습니다.
    const screenWidth = Dimensions.get('window').width;
    const calendarWidth = screenWidth - 60; // 30px padding on each side

    if (!isValid(date)) {
        return (
            <S.MLoadingContainer>
                <Text>Loading...</Text>
            </S.MLoadingContainer>
        );
    }

    useEffect(() => {
        setMonths([sub(date, {months: 1}), date, add(date, {months: 1})]);
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({index: 1, animated: false});
            setIsTransitioning(false);
        }, 100);
    }, [date]);

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
        if (isTransitioning) return;

        const index = Math.round(event.nativeEvent.contentOffset.x / calendarWidth);
        if (index === 1) return;

        setIsTransitioning(true);
        const newDate = months[index];
        onDateChange(newDate);
    };

    const handleDayPress = (day: Date) => {
        setSelectedDate(day);
        setViewMode('day');
    };

    return (
        <S.MContainer>
            <S.MHeader>
                <S.MMonthText>{format(date, 'MMMM yyyy')}</S.MMonthText>
                <S.ViewModeContainer>
                    <S.ViewModeButton $isActive={viewMode === 'month'} onPress={() => setViewMode('month')}>
                        <S.ButtonText $isActive={viewMode === 'month'}>월</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'week'} onPress={() => setViewMode('week')}>
                        <S.ButtonText $isActive={viewMode === 'week'}>주</S.ButtonText>
                    </S.ViewModeButton>
                    <S.ViewModeButton $isActive={viewMode === 'day'} onPress={() => setViewMode('day')}>
                        <S.ButtonText $isActive={viewMode === 'day'}>일</S.ButtonText>
                    </S.ViewModeButton>
                </S.ViewModeContainer>
            </S.MHeader>

            {viewMode === 'month' && (
                <FlatList
                    ref={flatListRef}
                    data={months}
                    renderItem={({item}) => (
                        // **수정된 부분:** 각 월별 뷰가 정확히 계산된 너비를 갖도록 설정합니다.
                        <View style={{width: calendarWidth}}>
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
                    initialScrollIndex={1}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    scrollEnabled={!isTransitioning}
                    getItemLayout={(data, index) => ({ // **수정된 부분:** 정확히 계산된 너비를 사용합니다.
                        length: calendarWidth,
                        offset: calendarWidth * index,
                        index,
                    })}
                />
            )}
            {viewMode === 'week' && <WeekView date={date} events={events} onEventPress={(e) => alert(e.title)}/>}

            {viewMode === 'day' && (
                <DayView
                    events={events.filter(e => isSameDay(e.start, selectedDate))}
                    onEventPress={(e) => alert(e.title)}
                />
            )}
        </S.MContainer>
    );
};

export default CalendarView;