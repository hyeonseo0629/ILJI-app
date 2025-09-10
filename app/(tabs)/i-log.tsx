import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainContainer } from "@/components/style/MainStyled";
import ILogPageView from "@/components/i-log/i-logPageView";
import ILogListView from "@/components/i-log/i-logListView";
import React, { useState, useEffect, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TabsContainer, TabsButton, TabsButtonText } from "@/components/style/I-logStyled";
import * as I from "@/components/style/I-logStyled";
import { LocaleConfig, DateData, Calendar } from 'react-native-calendars';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Modal, TouchableOpacity, View } from 'react-native';

// Set calendar locale to Korean
LocaleConfig.locales['ko'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

// 새로운 통합 데이터 타입
export type ILogData = {
    id: number;
    user_profile_id: number;
    title: string;      // 보류 속성
    log_date: Date;
    content: string;
    img_url?: string;
    created_at: Date;
    like_count: number;
    comment_count: number;
    visibility: number;
    friend_tags?: string;
    tags?: string;
}

const initialILogs: ILogData[] = [
    {
        id: 109,
        user_profile_id: 101,
        title: '작은 이야기',
        log_date: new Date('2025-05-10'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/500/400/400',
        created_at: new Date('2025-05-10T14:48:06.000Z'),
        like_count: 27,
        comment_count: 5,
        visibility: 1,
        friend_tags: JSON.stringify([]),
        tags: '#개발 #음악'
    },
    {
        id: 108,
        user_profile_id: 103,
        title: '새로운 시작',
        log_date: new Date('2025-04-29'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘ender 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/972/400/400',
        created_at: new Date('2025-04-29T19:54:06.000Z'),
        like_count: 32,
        comment_count: 1,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#개발 #공부'
    },
    {
        id: 107,
        user_profile_id: 101,
        title: '나의 하루',
        log_date: new Date('2025-04-21'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/769/400/400',
        created_at: new Date('2025-04-21T17:15:06.000Z'),
        like_count: 45,
        comment_count: 10,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {"id": 202, "name": "Charlie"}]),
        tags: '#일상 #기록'
    },
    {
        id: 106,
        user_profile_id: 102,
        title: '추억 한 조각',
        log_date: new Date('2025-03-24'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/563/400/400',
        created_at: new Date('2025-03-24T18:03:06.000Z'),
        like_count: 13,
        comment_count: 6,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#추억 #감성'
    },
    {
        id: 105,
        user_profile_id: 101,
        title: '깊은 고찰',
        log_date: new Date('2025-02-28'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/697/400/400',
        created_at: new Date('2025-02-28T11:29:06.000Z'),
        like_count: 36,
        comment_count: 8,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#생각 #독서'
    },
    {
        id: 104,
        user_profile_id: 103,
        title: '일상의 기록',
        log_date: new Date('2025-02-09'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/490/400/400',
        created_at: new Date('2025-02-09T16:09:06.000Z'),
        like_count: 21,
        comment_count: 3,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {"id": 202, "name": "Charlie"}]),
        tags: '#일상 #기록'
    },
    {
        id: 103,
        user_profile_id: 102,
        title: '새로운 발견',
        log_date: new Date('2025-01-19'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/41/400/400',
        created_at: new Date('2025-01-19T10:40:06.000Z'),
        like_count: 48,
        comment_count: 9,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#생각 #개발'
    },
    {
        id: 102,
        user_profile_id: 101,
        title: '오늘의 생각',
        log_date: new Date('2024-12-29'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/688/400/400',
        created_at: new Date('2024-12-29T15:21:06.000Z'),
        like_count: 19,
        comment_count: 2,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#일상 #생각'
    },
    {
        id: 101,
        user_profile_id: 103,
        title: '특별한 순간',
        log_date: new Date('2024-11-20'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/150/400/400',
        created_at: new Date('2024-11-20T17:07:06.000Z'),
        like_count: 38,
        comment_count: 7,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {"id": 202, "name": "Charlie"}]),
        tags: '#여행 #추억'
    },
    {
        id: 100,
        user_profile_id: 102,
        title: '나의 하루',
        log_date: new Date('2024-10-25'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/891/400/400',
        created_at: new Date('2024-10-25T12:34:06.000Z'),
        like_count: 25,
        comment_count: 4,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#일상 #하루'
    }
].sort((a, b) => b.log_date.getTime() - a.log_date.getTime());

export default function DiaryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [viewMode, setViewMode] = useState('page');
    const [ilogs, setIlogs] = useState<ILogData[]>(initialILogs);

    // --- Calendar State (for Page View) ---
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
    const [currentLogIndex, setCurrentLogIndex] = useState(0); // New state to track current visible log index
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
        if (ilogs.length > 0) {
            return format(ilogs[0].log_date, 'yyyy-MM-01'); // Initialize with the month of the first log
        }
        return format(new Date(), 'yyyy-MM-01'); // Fallback to current month
    });

    // --- Calendar State (for List View) ---
    const [isListCalendarVisible, setListCalendarVisible] = useState(false);
    const [listFilterType, setListFilterType] = useState<'day' | 'month' | 'year' | 'none'>('none'); // 'day', 'month', 'year', 'none'
    const [listFilterValue, setListFilterValue] = useState<string | null>(null); // YYYY-MM-DD, YYYY-MM, YYYY
    const [currentListCalendarMonth, setCurrentListCalendarMonth] = useState(format(new Date(), 'yyyy-MM-01')); // Track current month in list calendar
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false); // New state for month picker modal
    const [isYearPickerVisible, setYearPickerVisible] = useState(false); // New state for year picker modal

    // 1. 모든 로그에서 중복 없는 태그 목록 추출
    const uniqueTags = useMemo(() => {
        const allTags = ilogs
            .flatMap(log => log.tags?.split(' ') || []) // 모든 태그를 하나의 배열로 펼치기
            .filter(tag => tag.startsWith('#')); // #으로 시작하는 태그만 필터링
        return [...new Set(allTags)]; // Set을 사용하여 중복 제거
    }, [ilogs]);

    useEffect(() => {
        // Handle new log creation
        if (params.newLog) {
            const newLogData = JSON.parse(params.newLog as string);
            newLogData.log_date = new Date(newLogData.log_date);
            newLogData.created_at = new Date(newLogData.created_at);
            setIlogs(prevIlogs => [newLogData, ...prevIlogs].sort((a, b) => b.log_date.getTime() - a.log_date.getTime())); // 날짜순 정렬
            setSelectedLogIndex(0); // Scroll to the new log
            router.setParams({ newLog: '' });
        }

        // Handle log deletion
        if (params.deletedLogId) {
            const deletedId = parseInt(params.deletedLogId as string, 10);
            setIlogs(prevIlogs => prevIlogs.filter(log => log.id !== deletedId));
            router.setParams({ deletedLogId: '' });
        }

        // Handle log update
        if (params.updatedLog) {
            const updatedLogData: ILogData = JSON.parse(params.updatedLog as string);
            // Ensure date objects are correctly parsed if they were stringified
            updatedLogData.log_date = new Date(updatedLogData.log_date);
            updatedLogData.created_at = new Date(updatedLogData.created_at);

            setIlogs(prevIlogs => {
                const newIlogs = prevIlogs.map(log => 
                    log.id === updatedLogData.id ? updatedLogData : log
                );
                // Re-sort in case log_date was changed (though not expected in this flow)
                return newIlogs.sort((a, b) => b.log_date.getTime() - a.log_date.getTime());
            });
            router.setParams({ updatedLog: '' });
        }
    }, [params.newLog, params.deletedLogId, params.updatedLog]);

    // Reset scroll index when switching to page view
    useEffect(() => {
        if (viewMode === 'page') {
            setSelectedLogIndex(currentLogIndex); // Set to current log index when switching to page view
        } else {
            setSelectedLogIndex(null);
        }
    }, [viewMode, currentLogIndex]);

    // --- Calendar Logic (for Page View) ---
    const markedDates = useMemo(() => {
        const markings: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } } = {};
        const logsByDate: { [key: string]: ILogData } = ilogs.reduce((acc, log) => {
            acc[format(log.log_date, 'yyyy-MM-dd')] = log;
            return acc;
        }, {} as { [key: string]: ILogData });


        const start = startOfMonth(new Date(currentCalendarMonth));
        const end = endOfMonth(new Date(currentCalendarMonth));
        const daysInMonth = eachDayOfInterval({ start, end });

        daysInMonth.forEach(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            if (logsByDate[dateString]) {
                // Date has a log
                markings[dateString] = { marked: true, dotColor: 'mediumslateblue' };
            } else {
                markings[dateString] = { disabled: true, disableTouchEvent: true };
            }
        });

        return markings;
    }, [ilogs, currentCalendarMonth]);

    const openCalendar = () => {
        // Set currentCalendarMonth to the month of the currently viewed log explicitly
        if (ilogs[currentLogIndex]) {
            setCurrentCalendarMonth(format(ilogs[currentLogIndex].log_date, 'yyyy-MM-01'));
        }
        setCalendarVisible(true);
    };

    const handleDateSelect = (day: DateData) => {
        const index = ilogs.findIndex(log => format(log.log_date, 'yyyy-MM-dd') === day.dateString);

        if (index !== -1) {
            setSelectedLogIndex(null); // Reset to null to force re-render and scroll
            setTimeout(() => {
                setSelectedLogIndex(index);
                setCalendarVisible(false);
            }, 0);
        } else {
            // 일기가 없는 날짜를 클릭한 경우, 아무 작업도 하지 않음. (disableTouchEvent로 클릭 자체가 안됨)
        }
    };

    const handlePageChange = (index: number) => {
        setCurrentLogIndex(index);
    };

    // --- Calendar Logic (for List View) ---
    const markedDatesForListCalendar = useMemo(() => {
        const markings: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } } = {};
        const logsByDate: { [key: string]: ILogData } = ilogs.reduce((acc, log) => {
            acc[format(log.log_date, 'yyyy-MM-dd')] = log;
            return acc;
        }, {} as { [key: string]: ILogData });

        const start = startOfMonth(new Date(currentListCalendarMonth));
        const end = endOfMonth(new Date(currentListCalendarMonth));
        const daysInMonth = eachDayOfInterval({ start, end });

        daysInMonth.forEach(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            if (logsByDate[dateString]) {
                markings[dateString] = { marked: true, dotColor: 'mediumslateblue' };
            } else {
                markings[dateString] = { disabled: true, disableTouchEvent: true };
            }
        });

        return markings;
    }, [ilogs, currentListCalendarMonth]);

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
        // Set currentListCalendarMonth to the month of the currently selected filter date, or current month
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

    // Filter ilogs for List View based on type and value
    const filteredListIlogs = useMemo(() => {
        if (listFilterType === 'none' || !listFilterValue) {
            return ilogs; // If no filter, show all logs
        }

        return ilogs.filter(log => {
            const logDateString = format(log.log_date, 'yyyy-MM-dd');
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

    // 2. add-ilog 화면으로 이동할 때, 추출된 태그 목록을 파라미터로 전달
    const handleAddPress = () => {
        const simplifiedIlogs = ilogs.map(log => ({
            id: log.id,
            log_date: log.log_date.toISOString(), // Convert Date to ISO string for passing
        }));

        router.push({
            pathname: '/add-ilog',
            params: {
                uniqueTags: JSON.stringify(uniqueTags),
                existingLogs: JSON.stringify(simplifiedIlogs),
            },
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MainContainer>
                <TabsContainer>
                    <TabsButton onPress={() => setViewMode('list')} $isActive={viewMode === 'list'}>
                        <TabsButtonText>List View</TabsButtonText>
                    </TabsButton>
                    <TabsButton onPress={() => setViewMode('page')} $isActive={viewMode === 'page'}>
                        <TabsButtonText>Page View</TabsButtonText>
                    </TabsButton>
                </TabsContainer>

                {viewMode === 'list' ? (
                    <ILogListView
                        ilogs={filteredListIlogs} // Pass filtered ilogs
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
                    <ILogPageView
                        ilogs={ilogs}
                        onDatePress={openCalendar}
                        scrollToIndex={selectedLogIndex}
                        onPageChange={handlePageChange} // Pass the new prop
                    />
                )}
            </MainContainer>

            <I.ButtonIconWrap onPress={handleAddPress}>
                <I.ButtonIcon name="square-edit-outline" />
            </I.ButtonIconWrap>

            {/* Page View Calendar Modal (Restored) */}
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
                    <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10 }} onStartShouldSetResponder={() => true}>
                        <Calendar
                            key={isCalendarVisible ? 'page-calendar-open' : 'page-calendar-closed'}
                            markedDates={markedDates}
                            onDayPress={handleDateSelect}
                            current={currentCalendarMonth}
                            onMonthChange={(month) => {
                                setCurrentCalendarMonth(month.dateString);
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </GestureHandlerRootView>
    );
}
