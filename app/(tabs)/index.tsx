// app/(tabs)/index.tsx
import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
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
import {BottomSheetContent} from "@/components/bottomSheet/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { useSchedule } from '@/src/context/ScheduleContext';

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [sheetIndex, setSheetIndex] = useState(0);
    const tabPressedRef = useRef(false);

    const [tags, setTags] = useState<Tag[]>([
        { id: 1, color: '#FFB3A7', createdAt: new Date(), label: 'Work', updatedAt: new Date(), userId: 1 }, // Soft Coral
        { id: 2, color: '#A7D7FF', createdAt: new Date(), label: 'Personal', updatedAt: new Date(), userId: 1 }, // Light Sky Blue
        { id: 3, color: '#A7FFD4', createdAt: new Date(), label: 'Study', updatedAt: new Date(), userId: 1 }, // Mint Green
    ]);

    // --- 데이터 연결 ---
    // 1. ScheduleContext에서 진짜 데이터, 로딩 상태, 에러를 가져옵니다.
    const { events: schedules, loading, error } = useSchedule();

    // 1. activeTab의 초기값을 tags 배열의 첫 번째 아이템 라벨로 설정합니다.
    const [activeTab, setActiveTab] = useState(tags[0]?.label || '');

    // --- 모든 Hook과 핸들러 함수를 조건문 위로 이동 ---
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
                opacity={0.10} // Adjust the opacity here for a lighter grey
            />
        ),
        []
    );

    // 2. 로딩 중일 때 보여줄 화면
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>일정을 불러오는 중...</Text>
            </View>
        );
    }

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
                {/* 2. tags 배열을 기반으로 탭을 동적으로 렌더링합니다. */}
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

    return (
        // GestureHandlerRootView는 앱의 최상단에서 전체 화면을 차지해야 합니다.
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
                <Header sheetIndex={sheetIndex} />
                <CContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        schedules={schedules} // 3. Context에서 가져온 'schedules'를 전달합니다.
                        tags={tags}
                        // CalendarView가 요구하는 onSchedulesChange prop을 임시로 전달합니다.
                        onSchedulesChange={() => {}}
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
                        <BottomSheetContent schedules={schedules} tags={tags} activeTab={activeTab} /> 
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // 배경색 추가
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});
