import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {useSharedValue} from 'react-native-reanimated';
import Header from "@/components/header/Header";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {Tag} from '@/components/tag/TagTypes';
import {CalendarContainer} from "@/components/style/CalendarStyled";
import {
    MainContainer,
    MainContentWrap,
    MainToDoCategory,
    MainToDoCategoryText,
    MainToDoCategoryWarp
} from "@/components/style/MainStyled";
import {BottomSheetContent} from "@/components/common/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import {useTheme} from '@react-navigation/native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import DetailSchedule from "@/components/schedule/detail-schedule";
import {useSchedule} from "@/src/context/ScheduleContext";
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);
    const theme = useTheme();
    const [sheetIndex, setSheetIndex] = useState(0);

    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const handleSchedulePress = useCallback((schedule: Schedule) => {
        setSelectedSchedule(schedule);
    }, []);
    const handleCloseModal = useCallback(() => {
        setSelectedSchedule(null);
    }, []);

    const {events: schedules, tags, loading, setSelectedDate} = useSchedule();

    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate);
        setSelectedDate(newDate);
    };

    // [수정] 탭의 label을 상태로 관리하여 로직을 통일하고, 기본값을 '일정'으로 설정합니다.
    const [activeTab, setActiveTab] = useState<string>('일정');
    const [tagPage, setTagPage] = useState(0);
    const TAGS_PER_PAGE = 4;

    // Helper function to get character type priority for sorting
    const getCharTypePriority = (char: string): number => {
        if (!char) return 99; // Handle empty string or undefined char, push to end
        const code = char.charCodeAt(0);
        // Special characters (non-alphanumeric, non-Korean)
        if (!((code >= 48 && code <= 57) || // 0-9
            (code >= 65 && code <= 90) || // A-Z
            (code >= 97 && code <= 122) || // a-z
            (code >= 0xAC00 && code <= 0xD7A3))) { // 가-힣
            return 0; // Special characters (highest priority)
        }
        // English letters
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
            return 1;
        }
        // Korean characters
        if (code >= 0xAC00 && code <= 0xD7A3) {
            return 2;
        }
        // Numbers or other characters, put them last
        return 3;
    };

    // Custom sort function for tags
    const customTagSort = (tagA: Tag, tagB: Tag): number => {
        const labelA = tagA.label;
        const labelB = tagB.label;

        if (!labelA && !labelB) return 0;
        if (!labelA) return 1; // Push null/empty labels to end
        if (!labelB) return -1;

        const charA = labelA.charAt(0);
        const charB = labelB.charAt(0);

        const priorityA = getCharTypePriority(charA);
        const priorityB = getCharTypePriority(charB);

        if (priorityA !== priorityB) {
            return priorityA - priorityB; // Sort by priority
        } else {
            // If same priority, sort lexicographically
            // Use localeCompare for proper string comparison, especially for Korean
            return labelA.localeCompare(labelB, ['ko', 'en'], {sensitivity: 'base'});
        }
    };

    const displayTags = useMemo(() => {
        const scheduleTag = tags.find(tag => tag.label === '일정');
        const otherTags = tags.filter(tag => tag.label !== '일정');

        // Custom sorting for otherTags
        otherTags.sort(customTagSort);

        if (scheduleTag) {
            return [scheduleTag, ...otherTags];
        }
        return otherTags; // '일정' 태그가 없는 경우에도 정렬된 태그 반환
    }, [tags]);

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
                opacity={0.10}
            />
        ),
        []
    );

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

    const TabHandle = () => {
        const startIndex = tagPage * TAGS_PER_PAGE;
        const endIndex = startIndex + TAGS_PER_PAGE;
        const paginatedTags = displayTags.slice(startIndex, endIndex);
        const totalPages = Math.ceil(displayTags.length / TAGS_PER_PAGE);

        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                {totalPages > 0 && (
                    <TouchableOpacity
                        onPress={() => setTagPage(p => p - 1)}
                        disabled={tagPage === 0}
                        style={{padding: 8}}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color={tagPage === 0 ? '#ccc' : 'black'}/>
                    </TouchableOpacity>
                )}
                <View style={{flex: 1}}>
                    <MainToDoCategoryWarp>
                        {paginatedTags.map(tag => (
                            <MainToDoCategory
                                key={tag.id}
                                $isActive={activeTab === tag.label}
                                activeColor={tag.color}
                                onPress={() => handleTabPress(tag.label)}
                            >
                                <MainToDoCategoryText $isActive={activeTab === tag.label}>
                                    {tag.label}
                                </MainToDoCategoryText>
                            </MainToDoCategory>
                        ))}
                    </MainToDoCategoryWarp>
                </View>
                {totalPages > 0 && (
                    <TouchableOpacity
                        onPress={() => setTagPage(p => p + 1)}
                        disabled={tagPage === totalPages - 1}
                        style={{padding: 8}}
                    >
                        <MaterialCommunityIcons name="chevron-right" size={24}
                                                color={tagPage === totalPages - 1 ? '#ccc' : 'black'}/>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.centered, {backgroundColor: theme.colors.background}]}>
                <ActivityIndicator size="large" color={theme.colors.primary}/>
                <Text style={{color: theme.colors.text}}>일정을 불러오는 중...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
                <MainContainer $colors={theme.colors}>
                    <Header sheetIndex={sheetIndex} colors={theme.colors}/>
                    <CalendarContainer $colors={theme.colors}>
                        <CalendarView colors={theme.colors}
                                      date={currentDate}
                                      onDateChange={handleDateChange} // [수정] 새로 만든 핸들러 함수를 전달
                                      schedules={schedules} // Context에서 가져온 'schedules'를 전달합니다.
                                      tags={tags}
                            // [수정] DayView/WeekView의 일정 클릭 시 모달을 열도록 함수를 연결하고, 불필요한 prop은 제거합니다.
                                      onEventPress={handleSchedulePress}
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
                        <MainContentWrap>
                            <BottomSheetContent activeTab={activeTab} selectedDate={currentDate}
                                                onSchedulePress={handleSchedulePress} colors={theme.colors}/>
                        </MainContentWrap>
                    </BottomSheet>
                </MainContainer>
            </SafeAreaView>

            <DetailSchedule
                visible={selectedSchedule !== null}
                schedule={selectedSchedule}
                onClose={handleCloseModal}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});
