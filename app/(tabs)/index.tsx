// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import SixWeekCalendar from '@/components/calendar/SixWeekCalendar';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {CContainer} from "@/components/calendar/CalendarStyle";

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ['12.5%', '50%'], []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <Header/>
            <CContainer>
                <SixWeekCalendar
                    date={currentDate}
                    onDateChange={setCurrentDate}
                />
            </CContainer>
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
