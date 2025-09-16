import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ActivityIndicator, SafeAreaView} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {CalendarContainer} from "@/components/style/CalendarStyled";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainToDoCategoryText,
    MainToDoCategoryWarp
} from "@/components/style/MainStyled";
import {BottomSheetContent} from "@/components/common/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import { AnimationContext } from '@/components/common/AnimationContext';
import { useTheme } from '@react-navigation/native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import DetailSchedule from "@/components/schedule/detail-schedule";
import {useSchedule} from "@/src/context/ScheduleContext";

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);
    const theme = useTheme();
    const [sheetIndex, setSheetIndex] = useState(0);

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const handleSchedulePress = useCallback((schedule: Schedule) => { setSelectedSchedule(schedule); }, []);
    const handleCloseModal = useCallback(() => { setSelectedSchedule(null); }, []);

    const { events: schedules, tags, loading, error, setSelectedDate } = useSchedule();

    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate);
        setSelectedDate(newDate);
    };

    const [activeTab, setActiveTab] = useState<string>('All');

    const displayTags = useMemo(() => {
        const allTag = { id: 'all-tab', label: 'All', color: theme.colors.primary };
        return [allTag, ...tags];
    }, [tags, theme.colors.primary]);

    const handleSheetChanges = useCallback((index: number) => {
        setSheetIndex(index);
    }, []);

    const snapPoints = useMemo(() => ['14.5%', '90%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={0}
                appearsOnIndex={1}
                pressBehavior="collapse"
                opacity={0.10}
            />
        ),
        []
    );

    const handleTabPress = (tabName: string) => {
        tabPressedRef.current = true;
        setActiveTab(tabName);
        bottomSheetRef.current?.expand();
    };

    const handleSheetToggle = () => {
        if (tabPressedRef.current) {
            tabPressedRef.current = false;
            return;
        }
        if (animatedIndex.value > 0) {
            bottomSheetRef.current?.collapse();
        } else {
            bottomSheetRef.current?.expand();
        }
    };

    const TabHandle = () => (
        <Pressable onPress={handleSheetToggle}>
            <MainToDoCategoryWarp $colors={theme.colors}>
                {displayTags.map(tag => (
                    <MainToDoCategory
                        key={tag.id}
                        $isActive={activeTab === tag.label}
                        activeColor={tag.color}
                        onPress={() => handleTabPress(tag.label)}
                    >
                        <MainToDoCategoryText $isActive={activeTab === tag.label} $colors={theme.colors}>
                            {tag.label}
                        </MainToDoCategoryText>
                    </MainToDoCategory>
                ))}
            </MainToDoCategoryWarp>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text }}>일정을 불러오는 중...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <MainContainer $colors={theme.colors}>
                    <Header sheetIndex={sheetIndex} colors={theme.colors} />
                    <CalendarContainer $colors={theme.colors}>
                        <CalendarView
                            date={currentDate}
                            onDateChange={handleDateChange}
                            schedules={schedules}
                            tags={tags}
                            onEventPress={handleSchedulePress}
                            colors={theme.colors}
                        />
                    </CalendarContainer>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        handleComponent={TabHandle}
                        onChange={handleSheetChanges}
                        backdropComponent={renderBackdrop}
                        backgroundStyle={{
                            backgroundColor: theme.colors.card,
                        }}
                    >
                        <MainContentWrap>
                            <BottomSheetContent activeTab={activeTab} colors={theme.colors} />
                        </MainContentWrap>
                    </BottomSheet>
                </MainContainer>
            </SafeAreaView>

            <DetailSchedule
                visible={selectedSchedule !== null}
                schedule={selectedSchedule}
                onClose={handleCloseModal}
                colors={theme.colors}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});
