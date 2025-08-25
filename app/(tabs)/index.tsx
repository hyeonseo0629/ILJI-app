// app/(tabs)/index.tsx
import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SixWeekCalendar from '../components/SixWeekCalendar';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date('2026-02-01'));
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['15%', '50%'], []);

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
                        <Text>Awesome 🎉</Text>
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
