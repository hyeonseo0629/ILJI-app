import React, { useState, useEffect, useMemo } from "react";
import { Modal, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { LocaleConfig, DateData, Calendar } from 'react-native-calendars';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local imports
import { MainContainer } from "@/components/style/MainStyled";
import { TabsContainer, TabsButton } from "@/components/style/I-logStyled";
import * as I from "@/components/style/I-logStyled";
import ILogPageView from "@/components/i-log/i-logPageView";
import ILogListView from "@/components/i-log/i-logListView";

// Context and Types imports
import { useILog } from '@/src/context/ILogContext';
import { ILog, ILogCreateRequestFrontend, ILogUpdateRequest } from '@/src/types/ilog';

// Set calendar locale to Korean
LocaleConfig.locales['ko'] = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
    dayNamesShort: ['일','월','화','수','목','금','토'],
    today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

const { height: screenHeight } = Dimensions.get('window');

// --- Internal Modal Components ---

interface PageViewCalendarModalProps {
    isCalendarVisible: boolean;
    setCalendarVisible: (visible: boolean) => void;
    markedDates: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } };
    handleDateSelect: (day: DateData) => void;
    currentCalendarMonth: string;
    setCurrentCalendarMonth: (month: string) => void;
    theme: any; // TODO: Define a proper theme type
}

const PageViewCalendarModal: React.FC<PageViewCalendarModalProps> = ({
    isCalendarVisible,
    setCalendarVisible,
    markedDates,
    handleDateSelect,
    currentCalendarMonth,
    setCurrentCalendarMonth,
    theme,
}) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
    >
        <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setCalendarVisible(false)}
        >
            <View style={{ width: '90%', backgroundColor: theme.colors.card, borderRadius: 10, padding: 10 }} onStartShouldSetResponder={() => true}>
                <Calendar
                    key={isCalendarVisible ? 'page-calendar-open' : 'page-calendar-closed'}
                    markedDates={markedDates}
                    onDayPress={handleDateSelect}
                    current={currentCalendarMonth}
                    onMonthChange={(month) => {
                        setCurrentCalendarMonth(month.dateString);
                    }}
                    theme={{
                        backgroundColor: theme.colors.card,
                        calendarBackground: theme.colors.card,
                        dayTextColor: theme.colors.text,
                        textDisabledColor: theme.colors.border,
                        monthTextColor: theme.colors.text,
                        arrowColor: theme.colors.primary,
                        selectedDayBackgroundColor: theme.colors.primary,
                        selectedDayTextColor: 'white',
                        todayTextColor: theme.colors.primary,
                        dotColor: theme.colors.primary,
                    }}
                />
            </View>
        </TouchableOpacity>
    </Modal>
);

interface DeletionSuccessModalProps {
    isSuccessModalVisible: boolean;
    setSuccessModalVisible: (visible: boolean) => void;
}

const DeletionSuccessModal: React.FC<DeletionSuccessModalProps> = ({
    isSuccessModalVisible,
    setSuccessModalVisible,
}) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isSuccessModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
    >
        <I.DetailModalBackdrop
            activeOpacity={1}
            onPressOut={() => setSuccessModalVisible(false)}
        >
            <I.DetailModalContainer>
                <I.DetailModalTitle>삭제 완료</I.DetailModalTitle>
                <I.DetailModalText>일기가 성공적으로 삭제되었습니다.</I.DetailModalText>
                <I.DetailModalButtonContainer>
                    <I.DetailModalDeleteButton onPress={() => setSuccessModalVisible(false)}>
                        <I.DetailModalButtonText color="white">확인</I.DetailModalButtonText>
                    </I.DetailModalDeleteButton>
                </I.DetailModalButtonContainer>
            </I.DetailModalContainer>
        </I.DetailModalBackdrop>
    </Modal>
);


export default function DiaryScreen({ListHeader}: { ListHeader?: React.ComponentType<any> | React.ReactElement | null | undefined; }) {
    const theme = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();

    // --- State Variables ---
    const [viewMode, setViewMode] = useState<'list' | 'page'>('list');
    const { ilogs, fetchILogs, createILog, updateILog, deleteILog } = useILog();
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

    // Calendar State (for Page View)
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
        if (ilogs.length > 0) {
            return format(ilogs[0].logDate, 'yyyy-MM-01');
        }
        return format(new Date(), 'yyyy-MM-01');
    });

    // Calendar State (for List View)
    const [isListCalendarVisible, setListCalendarVisible] = useState(false);
    const [listFilterType, setListFilterType] = useState<'day' | 'month' | 'year' | 'none'>('none');
    const [listFilterValue, setListFilterValue] = useState<string | null>(null);
    const [currentListCalendarMonth, setCurrentListCalendarMonth] = useState(format(new Date(), 'yyyy-MM-01'));
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);

    // --- Effects ---
    useEffect(() => {
        fetchILogs();
    }, []);

    useEffect(() => {
        const handleParams = async () => {
            if (params.newLog) {
                const newLogData: ILog = JSON.parse(params.newLog as string);
                const visibilityAsNumber = newLogData.visibility;
                const requestData: ILogCreateRequestFrontend = {
                    writerId: newLogData.userId,
                    logDate: format(new Date(newLogData.logDate), 'yyyy-MM-dd'),
                    content: newLogData.content,
                    visibility: visibilityAsNumber,
                    friendTags: newLogData.friendTags,
                };
                await createILog({ request: requestData });
                setSelectedLogIndex(0);
                router.setParams({ newLog: '' });
            }

            if (params.lastAction === 'deleted') {
                setSuccessModalVisible(true);
                router.setParams({ lastAction: '' });
            }

            if (params.updatedLog) {
                const updatedLogData: ILog = JSON.parse(params.updatedLog as string);
                updatedLogData.logDate = new Date(updatedLogData.logDate);
                updatedLogData.createdAt = new Date(updatedLogData.createdAt);
                const visibilityAsNumber = updatedLogData.visibility;
                const updateRequest: ILogUpdateRequest = {
                    content: updatedLogData.content,
                    visibility: visibilityAsNumber,
                    existingImageUrls: updatedLogData.images,
                };
                await updateILog(updatedLogData.id, updateRequest);
                router.setParams({ updatedLog: '' });
            }
        };
        handleParams();
    }, [params.newLog, params.lastAction, params.updatedLog, createILog, updateILog]);

    useEffect(() => {
        if (viewMode === 'page') {
            setSelectedLogIndex(currentLogIndex);
        } else {
            setSelectedLogIndex(null);
        }
    }, [viewMode, currentLogIndex]);

    // --- Memoized Values (Calendar Logic for Page View) ---
    const markedDates = useMemo(() => {
        const markings: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } } = {};
        const logsByDate: { [key: string]: ILog } = ilogs.reduce((acc, log) => {
            acc[format(log.logDate, 'yyyy-MM-dd')] = log;
            return acc;
        }, {} as { [key: string]: ILog });

        const start = startOfMonth(new Date(currentCalendarMonth));
        const end = endOfMonth(new Date(currentCalendarMonth));
        const daysInMonth = eachDayOfInterval({ start, end });

        daysInMonth.forEach(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            if (logsByDate[dateString]) {
                markings[dateString] = { marked: true, dotColor: theme.colors.primary };
            } else {
                markings[dateString] = { disabled: true, disableTouchEvent: true };
            }
        });
        return markings;
    }, [ilogs, currentCalendarMonth, theme.colors.primary]);

    // --- Memoized Values (Calendar Logic for List View) ---
    const markedDatesForListCalendar = useMemo(() => {
        const markings: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } } = {};
        const logsByDate: { [key: string]: ILog } = ilogs.reduce((acc, log) => {
            acc[format(log.logDate, 'yyyy-MM-dd')] = log;
            return acc;
        }, {} as { [key: string]: ILog });

        const start = startOfMonth(new Date(currentListCalendarMonth));
        const end = endOfMonth(new Date(currentListCalendarMonth));
        const daysInMonth = eachDayOfInterval({ start, end });

        daysInMonth.forEach(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            if (logsByDate[dateString]) {
                markings[dateString] = { marked: true, dotColor: theme.colors.primary };
            } else {
                markings[dateString] = { disabled: true, disableTouchEvent: true };
            }
        });
        return markings;
    }, [ilogs, currentListCalendarMonth, theme.colors.primary]);

    // Filter ilogs for List View based on type and value
    const filteredListIlogs = useMemo(() => {
        if (listFilterType === 'none' || !listFilterValue) {
            return ilogs;
        }
        return ilogs.filter(log => {
            const logDateString = format(log.logDate, 'yyyy-MM-dd');
            if (listFilterType === 'day') {
                return logDateString === listFilterValue;
            } else if (listFilterType === 'month') {
                return logDateString.startsWith(listFilterValue);
            } else if (listFilterType === 'year') {
                return logDateString.startsWith(listFilterValue);
            }
            return true;
        });
    }, [ilogs, listFilterType, listFilterValue]);

    // --- Helper Functions ---
    const openCalendar = () => {
        if (ilogs[currentLogIndex]) {
            setCurrentCalendarMonth(format(ilogs[currentLogIndex].logDate, 'yyyy-MM-01'));
        }
        setCalendarVisible(true);
    };

    const handleDateSelect = (day: DateData) => {
        const index = ilogs.findIndex(log => format(log.logDate, 'yyyy-MM-dd') === day.dateString);
        if (index !== -1) {
            setSelectedLogIndex(null);
            setTimeout(() => {
                setSelectedLogIndex(index);
                setCalendarVisible(false);
            }, 0);
        }
    };

    const handlePageChange = (index: number) => {
        setCurrentLogIndex(index);
    };

    const handleListDateSelect = (day: DateData) => {
        setListFilterType('day');
        setListFilterValue(day.dateString);
        setListCalendarVisible(false);
    };

    const handleListMonthFilter = () => {
        setListFilterType('month');
        setListFilterValue(format(new Date(currentListCalendarMonth), 'yyyy-MM'));
        setListCalendarVisible(false);
    };

    const handleListYearFilter = () => {
        setListFilterType('year');
        setListFilterValue(format(new Date(currentListCalendarMonth), 'yyyy'));
        setListCalendarVisible(false);
    };

    const resetListFilter = () => {
        setListFilterType('none');
        setListFilterValue(null);
        setListCalendarVisible(false);
        setCurrentListCalendarMonth(format(new Date(), 'yyyy-MM-01'));
    };

    const openListCalendar = () => {
        if (listFilterValue && listFilterType === 'day') {
            setCurrentListCalendarMonth(format(new Date(listFilterValue), 'yyyy-MM-01'));
        } else if (listFilterValue && listFilterType === 'month') {
            setCurrentListCalendarMonth(format(new Date(listFilterValue + '-01'), 'yyyy-MM-01'));
        } else if (listFilterValue && listFilterType === 'year') {
            setCurrentListCalendarMonth(format(new Date(listFilterValue + '-01-01'), 'yyyy-MM-01'));
        } else {
            setCurrentListCalendarMonth(format(new Date(), 'yyyy-MM-01'));
        }
        setListCalendarVisible(true);
    };

    const handleSelectMonth = (month: string) => {
        const year = format(new Date(currentListCalendarMonth), 'yyyy');
        const newMonthValue = `${year}-${month}`;
        setListFilterType('month');
        setListFilterValue(newMonthValue);
        setCurrentListCalendarMonth(format(new Date(newMonthValue + '-01'), 'yyyy-MM-dd'));
        setMonthPickerVisible(false);
    };

    const handleSelectYear = (year: string) => {
        setListFilterType('year');
        setListFilterValue(year);
        setCurrentListCalendarMonth(`${year}-01-01`);
        setYearPickerVisible(false);
    };

    const CombinedHeader = () => (
        <>
            {ListHeader && (React.isValidElement(ListHeader) ? ListHeader : React.createElement(ListHeader))}
            <TabsContainer $colors={theme.colors}>
                <TabsButton onPress={() => setViewMode('list')} $isActive={viewMode === 'list'} $colors={theme.colors}>
                    <MaterialCommunityIcons name="format-list-bulleted" size={28} color={viewMode === 'list' ? theme.colors.primary : theme.colors.text} />
                </TabsButton>
                <TabsButton onPress={() => setViewMode('page')} $isActive={viewMode === 'page'} $colors={theme.colors}>
                    <MaterialCommunityIcons name="book-open-page-variant-outline" size={28} color={viewMode === 'page' ? theme.colors.primary : theme.colors.text} />
                </TabsButton>
            </TabsContainer>
        </>
    );

    return (
        <>
            {viewMode === 'list' ? (
                <ILogListView
                    ListHeaderComponent={CombinedHeader}
                    ilogs={filteredListIlogs}
                    listFilterType={listFilterType}
                    listFilterValue={listFilterValue}
                    openListCalendar={openListCalendar}
                    isListCalendarVisible={isListCalendarVisible}
                    setListCalendarVisible={setListCalendarVisible}
                    markedDatesForListCalendar={markedDatesForListCalendar}
                    handleListDateSelect={handleListDateSelect}
                    currentListCalendarMonth={currentListCalendarMonth}
                    setCurrentListCalendarMonth={setCurrentListCalendarMonth}
                    handleListMonthFilter={handleListMonthFilter}
                    handleListYearFilter={handleListYearFilter}
                    resetListFilter={resetListFilter}
                    isMonthPickerVisible={isMonthPickerVisible}
                    setMonthPickerVisible={setMonthPickerVisible}
                    isYearPickerVisible={isYearPickerVisible}
                    setYearPickerVisible={setYearPickerVisible}
                    handleSelectMonth={handleSelectMonth}
                    handleSelectYear={handleSelectYear}
                />
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ILogPageView
                        ilogs={ilogs}
                        onDatePress={openCalendar}
                        scrollToIndex={selectedLogIndex}
                        onPageChange={handlePageChange}
                        ListHeaderComponent={CombinedHeader}
                    />
                </ScrollView>
            )}

            <PageViewCalendarModal
                isCalendarVisible={isCalendarVisible}
                setCalendarVisible={setCalendarVisible}
                markedDates={markedDates}
                handleDateSelect={handleDateSelect}
                currentCalendarMonth={currentCalendarMonth}
                setCurrentCalendarMonth={setCurrentCalendarMonth}
                theme={theme}
            />

            <DeletionSuccessModal
                isSuccessModalVisible={isSuccessModalVisible}
                setSuccessModalVisible={setSuccessModalVisible}
            />
        </>
    );
}