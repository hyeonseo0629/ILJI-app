import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from "@/components/header/Header";
import {Schedule} from "@/components/calendar/scheduleTypes";
import { Tag } from '@/components/tag/TagTypes';
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
import { AnimationContext } from '@/components/common/AnimationContext';
import { useTheme } from '@react-navigation/native';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import DetailSchedule from "@/components/schedule/detail-schedule";
import {useSchedule} from "@/src/context/ScheduleContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);
    const theme = useTheme();
    const [sheetIndex, setSheetIndex] = useState(0);

    // [추가] 상세 모달을 제어하기 위한 상태와 핸들러 함수들
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const handleSchedulePress = useCallback((schedule: Schedule) => { setSelectedSchedule(schedule); }, []);
    const handleCloseModal = useCallback(() => { setSelectedSchedule(null); }, []);

    // --- 데이터 연결 ---
    // 1. ScheduleContext에서 필요한 모든 것을 가져옵니다.
    const { events: schedules, tags, loading, error, setSelectedDate } = useSchedule();

    // [추가] 날짜가 변경될 때 로컬 상태와 전역(Context) 상태를 모두 업데이트하는 함수
    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate); // 캘린더 뷰의 날짜를 업데이트
        setSelectedDate(newDate); // 앱의 전역 선택 날짜를 업데이트
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
            return labelA.localeCompare(labelB, ['ko', 'en'], { sensitivity: 'base' });
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
                opacity={0.10} // Adjust the opacity here for a lighter grey
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
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                {totalPages > 1 && (
                    <TouchableOpacity
                        onPress={() => setTagPage(p => p - 1)}
                        disabled={tagPage === 0}
                        style={{ padding: 8 }}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color={tagPage === 0 ? '#ccc' : 'black'} />
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
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
                {totalPages > 1 && (
                    <TouchableOpacity
                        onPress={() => setTagPage(p => p + 1)}
                        disabled={tagPage === totalPages - 1}
                        style={{ padding: 8 }}
                    >
                        <MaterialCommunityIcons name="chevron-right" size={24} color={tagPage === totalPages - 1 ? '#ccc' : 'black'} />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // 3. 로딩 중일 때 보여줄 화면
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>일정을 불러오는 중...</Text>
            </View>
        );
    }

    return (
        // GestureHandlerRootView는 앱의 최상단에서 전체 화면을 차지해야 합니다.
        <GestureHandlerRootView style={{flex: 1}}>
            <MainContainer>
                <Header sheetIndex={sheetIndex} />
                <CalendarContainer>
                    <CalendarView
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
                    <BottomSheetContent activeTab={activeTab} selectedDate={currentDate} onSchedulePress={handleSchedulePress} />
                </BottomSheet>
            </MainContainer>

            {/* [추가] 상세 모달을 화면에 렌더링하고 상태와 연결합니다. */}
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
        backgroundColor: '#fff', // 배경색 추가
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});
