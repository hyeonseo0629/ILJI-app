import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SixWeekCalendar from "@/components/calendar/SixWeekCalendar";

// 컴포넌트 이름을 DiaryScreen으로 변경하여 명확하게 구분합니다.
export default function DiaryScreen() {
    const [currentDate, setCurrentDate] = useState(new Date('2026-02-01'));
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['12.5%', '50%'], []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <SixWeekCalendar
                    date={currentDate}
                    onDateChange={setCurrentDate}
                />
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    backgroundStyle={styles.bottomSheet}
                >
                    <View style={styles.contentContainer}>
                        {/* 나중에 이 부분을 다이어리 내용으로 채울 수 있습니다. */}
                        <Text>Diary Content Here! 📝</Text>
                    </View>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});