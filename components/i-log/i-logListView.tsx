import * as I from "@/components/style/I-logStyled";
import {FlatList, View, Modal, TouchableOpacity, Text} from "react-native";
import {ILogData} from "@/app/(tabs)/i-log";
import {format} from 'date-fns';
import {AntDesign} from '@expo/vector-icons';
import React, {useState} from "react";
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';

// Month/Year Picker Modal Component
const MonthYearPickerModal = ({
    isVisible,
    onClose,
    data,
    onSelect,
    title,
}: {
    isVisible: boolean;
    onClose: () => void;
    data: { label: string; value: string }[];
    onSelect: (value: string) => void;
    title: string;
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPressOut={onClose}
            >
                {/* The onStartShouldSetResponder is removed from this View */}
                <View style={{ width: '80%', maxHeight: '70%', backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>{title}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelect(item.value)}
                                style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                            >
                                <Text style={{ fontSize: 16 }}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

// FlatList의 각 아이템을 렌더링하는 컴포넌트
const ListItem = ({item}: { item: ILogData }) => {
    const router = useRouter();
    const maxLength = 50; // 내용 글자 수 제한

    const singleLineContent = item.content.replace(/\n/g, ' ');
    const previewText = singleLineContent.substring(0, maxLength);

    const handlePress = () => {
        router.push({ pathname: '/i-log/[id]', params: { id: item.id.toString() } });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <I.ListWrap>
                {item.img_url && (
                    <I.ListThumbnail source={{uri: item.img_url}}/>
                )}
                <I.ListMainContent>
                    <I.ListHeader>
                        <I.ListDateText>{format(item.log_date, 'yyyy.MM.dd')}</I.ListDateText>
                        <I.ListTimeText>{format(item.created_at, 'HH:mm:ss')}</I.ListTimeText>
                    </I.ListHeader>

                    <I.ListTitle>{item.title}</I.ListTitle>
                    <I.ListContent>
                        {previewText}
                        {singleLineContent.length > maxLength ? "..." : ""}
                    </I.ListContent>

                    <I.ListStatsContainer>
                        <I.ListStatItem>
                            <AntDesign name="hearto" size={12} color="#777"/>
                            <I.ListStatText>{item.like_count}</I.ListStatText>
                        </I.ListStatItem>
                        <I.ListStatItem>
                            <AntDesign name="message1" size={12} color="#777"/>
                            <I.ListStatText>{item.comment_count}</I.ListStatText>
                        </I.ListStatItem>
                    </I.ListStatsContainer>

                    {item.tags && (
                        <I.ListTagsContainer>
                            <I.ListTagsText>{item.tags}</I.ListTagsText>
                        </I.ListTagsContainer>
                    )}
                </I.ListMainContent>
            </I.ListWrap>
        </TouchableOpacity>
    );
};

// ILogListView 메인 컴포넌트
const ILogListView = ({
    ilogs,
    listFilterType,
    listFilterValue,
    openListCalendar,
    isListCalendarVisible,
    setListCalendarVisible,
    markedDatesForListCalendar,
    handleListDateSelect,
    currentListCalendarMonth,
    setCurrentListCalendarMonth,
    handleListMonthFilter,
    handleListYearFilter,
    resetListFilter,
    isMonthPickerVisible,
    setMonthPickerVisible,
    isYearPickerVisible,
    setYearPickerVisible,
    handleSelectMonth,
    handleSelectYear,
}: {
    ilogs: ILogData[];
    listFilterType: 'day' | 'month' | 'year' | 'none';
    listFilterValue: string | null;
    openListCalendar: () => void;
    isListCalendarVisible: boolean;
    setListCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
    markedDatesForListCalendar: { [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean } };
    handleListDateSelect: (day: DateData) => void;
    currentListCalendarMonth: string;
    setCurrentListCalendarMonth: React.Dispatch<React.SetStateAction<string>>;
    handleListMonthFilter: () => void;
    handleListYearFilter: () => void;
    resetListFilter: () => void;
    isMonthPickerVisible: boolean;
    setMonthPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isYearPickerVisible: boolean;
    setYearPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectMonth: (month: string) => void;
    handleSelectYear: (year: string) => void;
}) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const getFilterDisplayText = () => {
        if (listFilterType === 'day' && listFilterValue) {
            return format(new Date(listFilterValue), 'yyyy년 MM월 dd일');
        } else if (listFilterType === 'month' && listFilterValue) {
            return format(new Date(listFilterValue + '-01'), 'yyyy년 MM월');
        } else if (listFilterType === 'year' && listFilterValue) {
            return format(new Date(listFilterValue + '-01-01'), 'yyyy년');
        }
        return '전체 보기';
    };

    const months = Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}월`,
        value: format(new Date(2000, i, 1), 'MM'),
    }));

    const years = Array.from({ length: 81 }, (_, i) => {
        const year = new Date().getFullYear() - 80 + i;
        return { label: `${year}년`, value: `${year}` };
    });

    const dropdownOptions = [
        { label: '날짜 선택', action: () => { setDropdownVisible(false); openListCalendar(); } },
        { label: `${format(new Date(currentListCalendarMonth), 'yyyy년 MM월')}로 검색`, action: () => { setDropdownVisible(false); handleListMonthFilter(); } },
        { label: `${format(new Date(currentListCalendarMonth), 'yyyy년')}으로 검색`, action: () => { setDropdownVisible(false); handleListYearFilter(); } },
        { label: '월 선택', action: () => { setDropdownVisible(false); setMonthPickerVisible(true); } },
        { label: '연도 선택', action: () => { setDropdownVisible(false); setYearPickerVisible(true); } },
        { label: '필터 초기화', action: () => { setDropdownVisible(false); resetListFilter(); } },
    ];

    return (
        <I.Container>
            <View style={{ paddingHorizontal: 10, marginBottom: 10, zIndex: 1 }}>
                <TouchableOpacity
                    onPress={() => setDropdownVisible(!isDropdownVisible)}
                    style={{
                        padding: 10,
                        backgroundColor: '#f0f0f0',
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <I.ListDateText>
                        {getFilterDisplayText()}
                    </I.ListDateText>
                </TouchableOpacity>

                {isDropdownVisible && (
                    <View style={{ position: 'absolute', top: 50, right: 10, width: 200, backgroundColor: 'white', borderRadius: 5, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
                        {dropdownOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={option.action}
                                style={{ padding: 15, borderBottomWidth: index === dropdownOptions.length - 1 ? 0 : 1, borderBottomColor: '#eee' }}
                            >
                                <Text>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <FlatList
                data={ilogs}
                renderItem={({item}) => <ListItem item={item}/>}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <I.PageContent>
                            {listFilterType !== 'none' ? '선택된 조건에 일지가 없습니다.' : '작성된 일지가 없습니다.'}
                        </I.PageContent>
                    </View>
                }
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={isListCalendarVisible}
                onRequestClose={() => setListCalendarVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={1}
                    onPressOut={() => setListCalendarVisible(false)}
                >
                    <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10 }} onStartShouldSetResponder={() => true}>
                        <Calendar
                            key={isListCalendarVisible ? 'list-calendar-open' : 'list-calendar-closed'}
                            markedDates={markedDatesForListCalendar}
                            onDayPress={handleListDateSelect}
                            current={currentListCalendarMonth}
                            onMonthChange={(month) => {
                                setCurrentListCalendarMonth(month.dateString);
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <MonthYearPickerModal
                isVisible={isMonthPickerVisible}
                onClose={() => setMonthPickerVisible(false)}
                data={months}
                onSelect={handleSelectMonth}
                title="월 선택"
            />

            <MonthYearPickerModal
                isVisible={isYearPickerVisible}
                onClose={() => setYearPickerVisible(false)}
                data={years}
                onSelect={handleSelectYear}
                title="연도 선택"
            />
        </I.Container>
    );
};

export default ILogListView;
