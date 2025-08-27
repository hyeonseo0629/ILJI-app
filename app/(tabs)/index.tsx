// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {Pressable} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {set} from "date-fns";
import {Schedule} from "@/components/calendar/types";
import {Tag} from "@/components/ToDo/types";
import {CContainer} from "@/components/calendar/CalendarStyle";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainTodoCategoryText,
    MainToDoCategoryWarp
} from "@/components/MainStyle";
import {ToDoContent} from "@/components/bottomSheet/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [activeTab, setActiveTab] = useState('To-Do');
    const [sheetIndex, setSheetIndex] = useState(0);
    const tabPressedRef = useRef(false);

    const [tags, setTags] = useState<Tag[]>([
        { id: 1, color: 'tomato', createdAt: new Date(), label: 'Work', updatedAt: new Date(), userId: 1 },
        { id: 2, color: 'royalblue', createdAt: new Date(), label: 'Personal', updatedAt: new Date(), userId: 1 },
    ]);

    // 1. API 등에서 가져온 원본 일정 데이터를 상태로 관리합니다.
    const [schedules, setSchedules] = useState<Schedule[]>([
        {
            id: 1, userId: 1, tagId: 1, title: '프로젝트 기획 회의',
            location: '회의실 A', description: '1분기 프로젝트 기획 회의',
            startTime: set(new Date("2023-11-25"), {hours: 10, minutes: 0, seconds: 0}),
            endTime: set(new Date("2023-11-25"), {hours: 13, minutes: 30, seconds: 0}),
            isAllDay: false, rrule: '', createdAt: new Date(), updatedAt: new Date(), calendarId: 1,
        },
        {
            id: 2, userId: 1, tagId: 2, title: '치과 예약',
            location: '강남역 튼튼치과', description: '정기 검진',
            startTime: set(new Date("2023-11-27"), {hours: 14, minutes: 0, seconds: 0}),
            endTime: set(new Date("2023-11-27"), {hours: 15, minutes: 0, seconds: 0}),
            isAllDay: false, rrule: '', createdAt: new Date(), updatedAt: new Date(), calendarId: 1,
        },
    ]);

    const handleSheetChanges = useCallback((index: number) => {
        setSheetIndex(index);
    }, []);

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
        if (sheetIndex === 1) {
            bottomSheetRef.current?.collapse();
        } else {
            bottomSheetRef.current?.expand();
        }
    };

    const TabHandle = () => (
        <Pressable onPress={handleSheetToggle}>
            <MainToDoCategoryWarp>
                <MainToDoCategory
                    $isActive={activeTab === 'To-Do'}
                    activeColor="darksalmon"
                    onPress={() => handleTabPress('To-Do')}
                >
                    <MainTodoCategoryText $isActive={activeTab === 'To-Do'}>To-Do</MainTodoCategoryText>
                </MainToDoCategory>

                <MainToDoCategory
                    $isActive={activeTab === 'Routine'}
                    activeColor="khaki"
                    onPress={() => handleTabPress('Routine')}
                >
                    <MainTodoCategoryText $isActive={activeTab === 'Routine'}>Routine</MainTodoCategoryText>
                </MainToDoCategory>

                <MainToDoCategory
                    $isActive={activeTab === 'Goal'}
                    activeColor="lightblue"
                    onPress={() => handleTabPress('Goal')}
                >
                    <MainTodoCategoryText $isActive={activeTab === 'Goal'}>Goal</MainTodoCategoryText>
                </MainToDoCategory>
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
                opacity={0.10} // Adjust the opacity here for a lighter grey
            />
        ),
        []
    );

    return (
        // GestureHandlerRootView는 앱의 최상단에서 전체 화면을 차지해야 합니다.
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
                <Header sheetIndex={sheetIndex} />
                <CContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        schedules={schedules}
                        tags={tags}
                    />
                </CContainer>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    handleComponent={TabHandle}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* 3. 탭 UI가 핸들로 이동했으므로, 여기에는 콘텐츠만 남깁니다. */}
                    <MainContentWrap>
                        {activeTab === 'To-Do' && <ToDoContent/>}
                        {activeTab === 'Routine' && <ToDoContent/>}
                        {activeTab === 'Goal' && <ToDoContent/>}
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </GestureHandlerRootView>
    );
}
