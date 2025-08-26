// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo, useCallback} from 'react';
import {Pressable, StyleSheet, View, Text, Platform} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {CContainer} from "@/components/calendar/CalendarStyle";
import SixWeekCalendar from "@/components/calendar/SixWeekCalendar";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainTodoCategoryText,
    MainToDoCategoryWarp
} from "@/components/MainStyle";
import {GoalContent, RoutineContent, ToDoContent} from "@/components/BottomSheet/ToDoCategory";

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
                opacity={0.10} // Adjust the opacity here for a lighter grey
            />
        ),
        []
    );

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
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
                    handleComponent={TabHandle}
                    onChange={handleSheetChanges}
                    backdropComponent={renderBackdrop}
                    enablePanDownToClose={true}
                    backgroundStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    <MainContentWrap>
                        {activeTab === 'To-Do' && <ToDoContent/>}
                        {activeTab === 'Routine' && <RoutineContent/>}
                        {activeTab === 'Goal' && <GoalContent/>}
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </GestureHandlerRootView>
    );
}
