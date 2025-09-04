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

    // --- 데이터 연결 ---
    // 1. ScheduleContext에서 진짜 데이터(일정, 태그), 로딩 상태, 에러를 가져옵니다.
    const { events: schedules, tags, loading, error } = useSchedule();

    // 2. 로드된 태그 목록의 첫 번째 탭을 기본으로 활성화합니다.
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        // 태그가 로드되고, 아직 활성 탭이 설정되지 않았다면 첫 번째 태그를 활성 탭으로 지정합니다.
        if (tags.length > 0 && !activeTab) {
            setActiveTab(tags[0].label);
        }
    }, [tags, activeTab]);

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

    // 3. 로딩 중일 때 보여줄 화면
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
                {/* 4. Context에서 가져온 진짜 tags 배열을 기반으로 탭을 동적으로 렌더링합니다. */}
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
                        schedules={schedules} // Context에서 가져온 'schedules'를 전달합니다.
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
                    {/* 5. BottomSheetContent에는 activeTab 정보만 넘겨줍니다. */}
                    <MainContentWrap>
                        <BottomSheetContent activeTab={activeTab} />
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
