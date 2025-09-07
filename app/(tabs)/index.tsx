// app/(tabs)/index.tsx
import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
import {set} from "date-fns";
import {Schedule} from "@/components/calendar/types";
import {Tag} from "@/components/todo/types";
import {CContainer} from "@/components/calendar/CalendarStyle";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainTodoCategoryText,
    MainToDoCategoryWarp
} from "@/components/MainStyle";
import {BottomSheetContent} from "@/components/bottomSheet/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import { AnimationContext } from '@/components/common/AnimationContext';

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);

    const [tags, setTags] = useState<Tag[]>([
        { id: 1, color: '#FFB3A7', createdAt: new Date(), label: 'Work', updatedAt: new Date(), userId: 1 }, // Soft Coral
        { id: 2, color: '#A7D7FF', createdAt: new Date(), label: 'Personal', updatedAt: new Date(), userId: 1 }, // Light Sky Blue
        { id: 3, color: '#A7FFD4', createdAt: new Date(), label: 'Study', updatedAt: new Date(), userId: 1 }, // Mint Green
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

    const TabHandle = () => (
        <Pressable onPress={handleSheetToggle}>
            <MainToDoCategoryWarp>
                {tags.map(tag => (
                    <MainToDoCategory
                        key={tag.id}
                        $isActive={activeTab === tag.label}
                        activeColor={tag.color}
                        onPress={() => handleTabPress(tag.label)}
                    >
                        <MainTodoCategoryText $isActive={activeTab === tag.label}>{tag.label}</MainTodoCategoryText>
                    </MainToDoCategory>
                ))}
            </MainToDoCategoryWarp>
        </Pressable>
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
        <AnimationContext.Provider value={{ animatedIndex }}>
            <MainContainer>
                <Header />
                <CContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        schedules={schedules}
                        tags={tags}
                        onSchedulesChange={setSchedules}
                    />
                </CContainer>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    handleComponent={TabHandle}
                    animatedIndex={animatedIndex}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <MainContentWrap>
                        <BottomSheetContent schedules={schedules} tags={tags} activeTab={activeTab} />
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </AnimationContext.Provider>
    );
}
