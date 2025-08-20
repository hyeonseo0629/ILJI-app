// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SixWeekCalendar from '../components/SixWeekCalendar';

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date('2026-02-01'));

    return (
        <View style={styles.container}>
            <SixWeekCalendar
                date={currentDate}
                onDateChange={setCurrentDate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
});
