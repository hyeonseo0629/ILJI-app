// app/(tabs)/index.tsx
import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable, View, Text} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
import {set} from "date-fns";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {Tag} from "@/components/tag/TagTypes";
import {CContainer} from "@/components/calendar/CalendarStyled";
import {
    MainContentWrap,
    MainToDoCategory,
    MainToDoCategoryText,
    MainToDoCategoryWarp
} from "@/components/style/MainStyle";
import {BottomSheetContent} from "@/components/common/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import { AnimationContext } from '@/components/common/AnimationContext';
import { useTheme } from '@react-navigation/native';
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);
    const theme = useTheme();
    const [sheetIndex, setSheetIndex] = useState(0);

    const [tags, setTags] = useState<Tag[]>([
        { id: 1, color: '#FFB3A7', createdAt: new Date(), label: 'Work', updatedAt: new Date(), userId: 1 },
        { id: 2, color: '#A7D7FF', createdAt: new Date(), label: 'Personal', updatedAt: new Date(), userId: 1 },
        { id: 3, color: '#A7FFD4', createdAt: new Date(), label: 'Study', updatedAt: new Date(), userId: 1 },
    ]);

    useEffect(() => {
        if (params.newSchedule) {
            const newSchedule = JSON.parse(params.newSchedule as string);
            newSchedule.startTime = new Date(newSchedule.startTime);
            newSchedule.endTime = new Date(newSchedule.endTime);
            setSchedules(prevSchedules => [...prevSchedules, newSchedule]);
            router.setParams({ newSchedule: '' });
        }
    }, [params.newSchedule]);

    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: 1, userId: 1, tagId: 1, title: '프로젝트 기획 회의',
            location: '회의실 A', description: '1분기 프로젝트 기획 회의',
            startTime: set(new Date(), {hours: 10, minutes: 0, seconds: 0}),
            endTime: set(new Date(), {hours: 13, minutes: 30, seconds: 0}),
            isAllDay: false, rrule: '', createdAt: new Date(), updatedAt: new Date(), calendarId: 1,
        },
        {
            id: 2, userId: 1, tagId: 2, title: '치과 예약',
            location: '강남역 튼튼치과', description: '정기 검진',
            startTime: set(new Date(), {hours: 14, minutes: 0, seconds: 0}),
            endTime: set(new Date(), {hours: 15, minutes: 0, seconds: 0}),
            isAllDay: false, rrule: '', createdAt: new Date(), updatedAt: new Date(), calendarId: 1,
        },
        {
            id: 3, userId: 1, tagId: 3, title: '프로젝트 개발 진행',
            location: '솔데스크', description: '파이널 프로젝트 진행 중',
            startTime: set(new Date(), {hours: 17, minutes: 0, seconds: 0}),
            endTime: set(new Date(), {hours: 18, minutes: 0, seconds: 0}),
            isAllDay: false, rrule: '', createdAt: new Date(), updatedAt: new Date(), calendarId: 1,
        }
    ]);

    const [activeTab, setActiveTab] = useState(tags[0]?.label || '');

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

    const handleSheetChange = useCallback((index: number) => {
        setSheetIndex(index);
    }, []);

    const TabHandle = () => (
        <View onTouchEnd={handleSheetToggle}>
            <MainToDoCategoryWarp theme={theme}>
                {tags.map(tag => (
                    <MainToDoCategory
                        key={tag.id}
                        $isActive={activeTab === tag.label}
                        activeColor={tag.color}
                        onPress={() => handleTabPress(tag.label)}
                    >
                        <MainToDoCategoryText $isActive={activeTab === tag.label} theme={theme}>{tag.label}</MainToDoCategoryText>
                    </MainToDoCategory>
                ))}
            </MainToDoCategoryWarp>
        </View>
    );

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

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AnimationContext.Provider value={{ animatedIndex }}>
                <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                    <Header theme={theme} sheetIndex={sheetIndex} />
                    <CContainer theme={theme}>
                        <CalendarView
                            date={currentDate}
                            onDateChange={setCurrentDate}
                            schedules={schedules}
                            tags={tags}
                            onSchedulesChange={setSchedules}
                            theme={theme}
                        />
                    </CContainer>
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={0}
                        snapPoints={snapPoints}
                        handleComponent={TabHandle}
                        animatedIndex={animatedIndex}
                        backgroundStyle={{
                            backgroundColor: 'transparent',
                        }}
                        onChange={handleSheetChange}
                    >
                        <MainContentWrap>
                            <BottomSheetContent schedules={schedules} tags={tags} activeTab={activeTab} />
                        </MainContentWrap>
                    </BottomSheet>
                </View>
            </AnimationContext.Provider>
        </GestureHandlerRootView>
    );
}
