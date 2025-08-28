// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {Pressable, Text} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {CContainer} from "@/components/calendar/CalendarStyle";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainTodoCategoryText,
    MainToDoCategoryWarp
} from "@/components/MainStyle";
import {GoalContent, RoutineContent, ToDoContent} from "@/components/bottom_sheet/ToDoCategory";
import CalendarView from "@/components/calendar/CalendarView";
import { Schedule } from "@/hooks/useFetchSchedules";

// Dummy schedule data matching the correct schema
const dummySchedules: Schedule[] = [
    {
        id: 1,
        userId: 1,
        title: 'Team Meeting',
        description: 'Discuss project progress.',
        startTime: '2024-05-20T10:00:00',
        endTime: '2024-05-20T11:00:00',
        isAllDay: false,
        rrule: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        userId: 1,
        title: 'Project Deadline',
        description: 'Final submission.',
        startTime: '2024-05-25T09:00:00',
        endTime: '2024-05-25T17:00:00',
        isAllDay: false,
        rrule: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [activeTab, setActiveTab] = useState('To-Do');
    const [sheetIndex, setSheetIndex] = useState(0);
    const tabPressedRef = useRef(false);

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

    const snapPoints = useMemo(() => ['16%', '65%'], []);

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
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
                <Header/>
                <CContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        schedules={dummySchedules} // Pass the dummy schedules directly
                    />
                </CContainer>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    handleComponent={TabHandle}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                    backgroundStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <MainContentWrap>
                        {activeTab === 'To-Do' && <ToDoContent />}
                        {activeTab === 'Routine' && <RoutineContent />}
                        {activeTab === 'Goal' && <GoalContent />}
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </GestureHandlerRootView>
    );
}
