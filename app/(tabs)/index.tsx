// app/(tabs)/index.tsx
import React, {useState, useRef, useMemo} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
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

    // 1. 탭 UI를 렌더링하는 커스텀 핸들 컴포넌트를 정의합니다.
    const TabHandle = () => (
        <MainToDoCategoryWarp>
            <MainToDoCategory
                $isActive={activeTab === 'To-Do'}
                activeColor="darksalmon" // 첫 번째 탭 색상
                onPress={() => setActiveTab('To-Do')}
            >
                <MainTodoCategoryText $isActive={activeTab === 'To-Do'}>To-Do</MainTodoCategoryText>
            </MainToDoCategory>

            <MainToDoCategory
                $isActive={activeTab === 'Routine'}
                activeColor="khaki" // 두 번째 탭: 파스텔 노랑
                onPress={() => setActiveTab('Routine')}
            >
                <MainTodoCategoryText $isActive={activeTab === 'Routine'}>Routine</MainTodoCategoryText>
            </MainToDoCategory>

            <MainToDoCategory
                $isActive={activeTab === 'Goal'}
                activeColor="lightblue" // 세 번째 탭: 파스텔 파랑
                onPress={() => setActiveTab('Goal')}
            >
                <MainTodoCategoryText $isActive={activeTab === 'Goal'}>Goal</MainTodoCategoryText>
            </MainToDoCategory>
        </MainToDoCategoryWarp>
    );


    // variables
    const snapPoints = useMemo(() => ['12%', '65%'], []);

    return (
        <GestureHandlerRootView>
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
                    handleComponent={TabHandle} // 2. 기본 핸들 대신 우리가 만든 탭 핸들을 사용합니다.
                    backgroundStyle={{
                        backgroundColor: 'transparent',
                    }}
                >
                    {/* 3. 탭 UI가 핸들로 이동했으므로, 여기에는 콘텐츠만 남깁니다. */}
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
