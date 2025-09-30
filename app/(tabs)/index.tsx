import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import { ActivityIndicator } from 'react-native';
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
    MainToDoCategoryWarp,
    LoadingContainer,
    LoadingText,
    TabHandleContainer,
    ChevronButton,
    TabPagingContainer,
    StyledSafeAreaView
} from "@/components/style/MainStyled";
import {BottomSheetContent} from "@/components/common/BottomSheet";
import CalendarView from "@/components/calendar/CalendarView";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import DetailSchedule from "@/components/schedule/detail-schedule";
import {useSchedule} from "@/src/context/ScheduleContext";
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function HomeScreen() {
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];

    const [currentDate, setCurrentDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tabPressedRef = useRef(false);
    const animatedIndex = useSharedValue<number>(0);
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

    const [activeTab, setActiveTab] = useState<string>('일정');
    const [tagPage, setTagPage] = useState(0);
    const TAGS_PER_PAGE = 4;

    const getCharTypePriority = (char: string): number => {
        if (!char) return 99;
        const code = char.charCodeAt(0);
        if (!((code >= 48 && code <= 57) ||
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122) ||
            (code >= 0xAC00 && code <= 0xD7A3))) {
            return 0;
        }
        if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
            return 1;
        }
        if (code >= 0xAC00 && code <= 0xD7A3) {
            return 2;
        }
        return 3;
    };

    const customTagSort = (tagA: Tag, tagB: Tag): number => {
        const labelA = tagA.label;
        const labelB = tagB.label;

        if (!labelA && !labelB) return 0;
        if (!labelA) return 1;
        if (!labelB) return -1;

        const charA = labelA.charAt(0);
        const charB = labelB.charAt(0);

        const priorityA = getCharTypePriority(charA);
        const priorityB = getCharTypePriority(charB);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        } else {
            return labelA.localeCompare(labelB, ['ko', 'en'], {sensitivity: 'base'});
        }
    };

    const displayTags = useMemo(() => {
        const scheduleTag = tags.find(tag => tag.label === '일정');
        const otherTags = tags.filter(tag => tag.label !== '일정');

        otherTags.sort(customTagSort);

        if (scheduleTag) {
            return [scheduleTag, ...otherTags];
        }
        return otherTags;
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

    const TabHandle = () => {
        const startIndex = tagPage * TAGS_PER_PAGE;
        const endIndex = startIndex + TAGS_PER_PAGE;
        const paginatedTags = displayTags.slice(startIndex, endIndex);
        const totalPages = Math.ceil(displayTags.length / TAGS_PER_PAGE);

        return (
            <TabHandleContainer>
                {totalPages > 0 && (
                    <ChevronButton
                        onPress={() => setTagPage(p => p - 1)}
                        disabled={tagPage === 0}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={24} color={tagPage === 0 ? theme.borderColor : theme.text}/>
                    </ChevronButton>
                )}
                <TabPagingContainer>
                    <MainToDoCategoryWarp $colors={theme}>
                        {paginatedTags.map(tag => (
                            <MainToDoCategory
                                key={tag.id}
                                $isActive={activeTab === tag.label}
                                activeColor={tag.color}
                                onPress={() => handleTabPress(tag.label)}
                            >
                                <MainToDoCategoryText $isActive={activeTab === tag.label} $colors={theme}>
                                    {tag.label}
                                </MainToDoCategoryText>
                            </MainToDoCategory>
                        ))}
                    </MainToDoCategoryWarp>
                </TabPagingContainer>
                {totalPages > 0 && (
                    <ChevronButton
                        onPress={() => setTagPage(p => p + 1)}
                        disabled={tagPage === totalPages - 1}
                    >
                        <MaterialCommunityIcons name="chevron-right" size={24}
                                                color={tagPage === totalPages - 1 ? theme.borderColor : theme.text}/>
                    </ChevronButton>
                )}
            </TabHandleContainer>
        );
    };

    if (loading) {
        return (
            <LoadingContainer $colors={theme}>
                <ActivityIndicator size="large" color={theme.pointColors.purple}/>
                <LoadingText $colors={theme}>일정을 불러오는 중...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <StyledSafeAreaView $colors={theme}>
            <MainContainer $colors={theme}>
                <Header sheetIndex={sheetIndex} colors={theme}/>
                <CalendarContainer $colors={theme}>
                    <CalendarView colors={theme}
                                  date={currentDate}
                                  onDateChange={handleDateChange}
                                  schedules={schedules}
                                  tags={tags}
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
                                            onSchedulePress={handleSchedulePress} colors={theme}/>
                    </MainContentWrap>
                </BottomSheet>
            </MainContainer>

            <DetailSchedule
                visible={selectedSchedule !== null}
                schedule={selectedSchedule}
                onClose={handleCloseModal}
            />
        </StyledSafeAreaView>
    );
}