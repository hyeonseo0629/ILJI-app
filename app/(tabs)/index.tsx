// app/(tabs)/index.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Calendar
                // 달력 넘길 때 스와이프 가능
                enableSwipeMonths
                // 빈 칸(이전/다음달의 말일/초일) 숨김
                hideExtraDays
                // 날짜 클릭 핸들러 (필요 없으면 지워도 됨)
                onDayPress={(day) => {
                    console.log('selected day', day);
                }}
                style={styles.calendar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                // 화면 전체 차지
        justifyContent: 'flex-start',
        paddingTop: '30%',
    },
    calendar: {
        // 그림자/라운드 없애고 기본 형태로
        borderWidth: 0,
        elevation: 0,
    },
});