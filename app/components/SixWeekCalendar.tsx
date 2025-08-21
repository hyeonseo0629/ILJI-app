import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    add,
    sub,
    isSameMonth,
    isToday,
    isValid,
    differenceInDays,
} from 'date-fns';

interface SixWeekCalendarProps {
    date: Date;
    onDateChange: (newDate: Date) => void;
}

const SixWeekCalendar: React.FC<SixWeekCalendarProps> = ({ date, onDateChange }) => {
    if (!isValid(date)) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const weekStartsOn = 0; // 0 for Sunday

    // 1. Find the start and end of the weeks the month naturally occupies.
    const naturalStart = startOfWeek(monthStart, { weekStartsOn });
    const naturalEnd = endOfWeek(monthEnd, { weekStartsOn });

    // 2. Calculate the number of days in this natural view.
    const naturalDays = differenceInDays(naturalEnd, naturalStart) + 1;

    // 3. Calculate how many padding days are needed to reach 42.
    const paddingDays = 42 - naturalDays;

    // 4. Distribute the padding as evenly as possible.
    const paddingBefore = Math.round(paddingDays / 2);

    // 5. Determine the final start date of the 42-day grid.
    const startDate = sub(naturalStart, { days: paddingBefore });
    const endDate = add(startDate, { days: 41 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    for (let i = 0; i < 6; i++) {
        weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    const handlePrevMonth = () => {
        onDateChange(sub(date, { months: 1 }));
    };

    const handleNextMonth = () => {
        onDateChange(add(date, { months: 1 }));
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                    <Text style={styles.navButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>{format(date, 'MMMM yyyy')}</Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                    <Text style={styles.navButtonText}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dayNamesContainer}>
                {dayNames.map(name => <Text key={name} style={styles.dayNameText}>{name}</Text>)}
            </View>

            <View style={styles.grid}>
                {weeks.map((week, i) => (
                    <View key={i} style={styles.week}>
                        {week.map((day) => {
                            if (!day) return <View style={styles.dayContainer} />; // Render empty view for safety
                            const isCurrentMonth = isSameMonth(day, date);
                            const isCurrentDay = isToday(day);

                            return (
                                <View key={day.toString()} style={styles.dayContainer}>
                                    <View style={[isCurrentDay && styles.todayCircle]}>
                                        <Text
                                            style={[
                                                styles.dayText,
                                                !isCurrentMonth && styles.dayNotInMonth,
                                                isCurrentDay && styles.todayText,
                                            ]}>
                                            {format(day, 'd')}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        width: '100%',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 420, // Give it a fixed height to avoid layout shifts
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    navButton: {
        padding: 10,
    },
    navButtonText: {
        fontSize: 18,
        color: '#007AFF',
        fontWeight: '500',
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    dayNamesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    dayNameText: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '500',
        width: 40,
        textAlign: 'center',
    },
    grid: {},
    week: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dayContainer: {
        width: 40,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    dayNotInMonth: {
        color: '#D1D1D6',
    },
    todayCircle: {
        width: 32,
        height: 32,
        backgroundColor: '#007AFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todayText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default SixWeekCalendar;
