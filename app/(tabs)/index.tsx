// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
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
import {useFetchSchedules} from "@/app/hooks/useFetchSchedules";

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [activeTab, setActiveTab] = useState('To-Do');
    const [sheetIndex, setSheetIndex] = useState(0);
    const tabPressedRef = useRef(false);

    // Fetch schedules from the backend
    const { schedules, loading, error } = useFetchSchedules();

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

    const renderContent = () => {
        if (loading) {
            return <Text>Loading...</Text>;
        }

        if (error) {
            return <Text>Error: {error.message}</Text>;
        }

        // Simple filtering based on title for now.
        // This can be improved with better data from the backend.
        const toDo = schedules.filter(s => s.title.toLowerCase().includes('todo'));
        const routines = schedules.filter(s => s.title.toLowerCase().includes('routine'));
        const goals = schedules.filter(s => s.title.toLowerCase().includes('goal'));


        if (activeTab === 'To-Do') {
            return <ToDoContent data={toDo} />;
        }
        if (activeTab === 'Routine') {
            return <RoutineContent data={routines} />;
        }
        if (activeTab === 'Goal') {
            return <GoalContent data={goals} />;
        }
        return null;
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
                <Header/>
                <CContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
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
                        {renderContent()}
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </GestureHandlerRootView>
    );
}
