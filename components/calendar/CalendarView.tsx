import React, {useState, useRef, useEffect} from 'react';
import {View, Text, FlatList, Dimensions} from 'react-native';
import {
    format,
    add,
    sub,
    isValid,
    isSameDay,
    parseISO,
} from 'date-fns';
import { 
    MContainer, 
    MHeader, 
    MMonthText, 
    ViewModeContainer, 
    ViewModeButton, 
    ButtonText, 
    MLoadingContainer 
} from './CalendarStyle';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import {CalendarEvent} from './types';
import { Schedule } from '@/hooks/useFetchSchedules';

interface CalendarViewProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
    schedules: Schedule[];
}

const CalendarView: React.FC<CalendarViewProps> = ({date, onDateChange, schedules}) => {
    const flatListRef = useRef<FlatList>(null);
    const [months, setMonths] = useState([sub(date, {months: 1}), date, add(date, {months: 1})]);
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(date);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const calendarWidth = screenWidth - 60;

    const events: CalendarEvent[] = (schedules || []).map(schedule => ({
        id: schedule.id.toString(),
        title: schedule.title,
        color: 'royalblue',
        start: parseISO(schedule.startTime),
        end: parseISO(schedule.endTime),
    }));

    if (!isValid(date)) {
        return (
            <MLoadingContainer>
                <Text>Loading...</Text>
            </MLoadingContainer>
        );
    }

    useEffect(() => {
        setMonths([sub(date, {months: 1}), date, add(date, {months: 1})]);
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({index: 1, animated: false});
            setIsTransitioning(false);
        }, 100);
    }, [date]);

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
        <MContainer>
            <MHeader>
                <MMonthText>{format(date, 'MMMM yyyy')}</MMonthText>
                <ViewModeContainer>
                    <ViewModeButton $isActive={viewMode === 'month'} onPress={() => setViewMode('month')}>
                        <ButtonText $isActive={viewMode === 'month'}>월</ButtonText>
                    </ViewModeButton>
                    <ViewModeButton $isActive={viewMode === 'week'} onPress={() => setViewMode('week')}>
                        <ButtonText $isActive={viewMode === 'week'}>주</ButtonText>
                    </ViewModeButton>
                    <ViewModeButton $isActive={viewMode === 'day'} onPress={() => setViewMode('day')}>
                        <ButtonText $isActive={viewMode === 'day'}>일</ButtonText>
                    </ViewModeButton>
                </ViewModeContainer>
            </MHeader>

            {viewMode === 'month' && (
                <FlatList
                    ref={flatListRef}
                    data={months}
                    renderItem={({item}) => (
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
                    getItemLayout={(data, index) => ({ 
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
        </MContainer>
    );
};

export default CalendarView;