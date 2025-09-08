import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
import {set} from "date-fns";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {Tag} from "@/components/tag/TagTypes";
import {CalendarContainer} from "@/components/style/CalendarStyled";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainTodoCategoryText,
    MainToDoCategoryWarp
} from "@/components/style/MainStyle";
import {BottomSheetContent} from "@/components/common/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import {GestureHandlerRootView} from "react-native-gesture-handler";

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

    useEffect(() => {
        if (params.newSchedule) {
            const newSchedule = JSON.parse(params.newSchedule as string);
            // Date 객체는 JSON.stringify/parse 과정에서 문자열로 변환되므로, 다시 Date 객체로 만들어줍니다.
            newSchedule.startTime = new Date(newSchedule.startTime);
            newSchedule.endTime = new Date(newSchedule.endTime);

            setSchedules(prevSchedules => [...prevSchedules, newSchedule]);

            // 처리가 끝난 파라미터를 URL에서 제거하여, 화면이 다시 로드될 때 일정이 중복 추가되는 것을 방지합니다.
            router.setParams({ newSchedule: '' });
        }
    }, [params.newSchedule]);

    // 1. API 등에서 가져온 원본 일정 데이터를 상태로 관리합니다.
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

    // 1. activeTab의 초기값을 tags 배열의 첫 번째 아이템 라벨로 설정합니다.
    const [activeTab, setActiveTab] = useState(tags[0]?.label || '');

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
                <CalendarContainer>
                    <CalendarView
                        date={currentDate}
                        onDateChange={setCurrentDate}
                        schedules={schedules}
                        tags={tags}
                        onSchedulesChange={setSchedules}
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
