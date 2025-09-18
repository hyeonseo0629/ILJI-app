import * as I from "@/components/style/I-logStyled";
import {FlatList, View, Modal, TouchableOpacity, Text, TouchableWithoutFeedback} from "react-native";
import {ILog} from "@/src/types/ilog";
import {format} from 'date-fns';
import {AntDesign, EvilIcons} from '@expo/vector-icons';
import React, {useState} from "react";
import {Calendar, DateData} from 'react-native-calendars';
import {useRouter} from 'expo-router';

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
                style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}
                activeOpacity={1}
                onPressOut={onClose}
            >
                {/* The onStartShouldSetResponder is removed from this View */}
                <View style={{width: '80%', maxHeight: '70%', backgroundColor: 'white', borderRadius: 10, padding: 10}}>
                    <Text
                        style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>{title}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => onSelect(item.value)}
                                style={{padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee'}}
                            >
                                <Text style={{fontSize: 16}}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

// FlatList의 각 아이템을 렌더링하는 컴포넌트
const ListItem = ({item}: { item: ILog }) => {
    const router = useRouter();
    const maxLength = 50; // 내용 글자 수 제한

    const singleLineContent = item.content.replace(/\n/g, ' ');
    const previewText = singleLineContent.substring(0, maxLength);

    const handlePress = () => {
        router.push({pathname: '/i-log/detail-ilog/[id]', params: {id: item.id.toString()}});
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <I.ListWrap>
                {item.images && item.images.length > 0 && (
                    <I.ListThumbnail source={{uri: item.images[0]}}/>
                )}
                <I.ListMainContent>
                    <I.ListHeader>
                        <I.ListDateText>{format(item.logDate, 'yyyy.MM.dd')}</I.ListDateText>
                        <I.ListTimeText>{format(item.createdAt, 'HH:mm:ss')}</I.ListTimeText>
                    </I.ListHeader>

                    <I.ListContent>
                        {previewText}
                        {singleLineContent.length > maxLength ? "..." : ""}
                    </I.ListContent>

                    <I.ListStatsContainer>
                        <I.ListStatItem>
                            <AntDesign name="hearto" size={12} color="#777"/>
                            <I.ListStatText>{item.likeCount}</I.ListStatText>
                        </I.ListStatItem>
                        <I.ListStatItem>
                            <AntDesign name="message1" size={12} color="#777"/>
                            <I.ListStatText>{item.commentCount}</I.ListStatText>
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
    ilogs: ILog[];
    listFilterType: 'day' | 'month' | 'year' | 'none';
    listFilterValue: string | null;
    openListCalendar: () => void;
    isListCalendarVisible: boolean;
    setListCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
    markedDatesForListCalendar: {
        [key: string]: { marked?: boolean, dotColor?: string, disabled?: boolean, disableTouchEvent?: boolean }
    };
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

    const months = Array.from({length: 12}, (_, i) => ({
        label: `${i + 1}월`,
        value: format(new Date(2000, i, 1), 'MM'),
    }));

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 81}, (_, i) => {
        const year = currentYear - i;
        return {label: `${year}년`, value: `${year}`};
    });

    const dropdownOptions = [
        {
            label: '날짜 선택', action: () => {
                setDropdownVisible(false);
                openListCalendar();
            }
        },
        {
            label: '월 선택', action: () => {
                setDropdownVisible(false);
                setMonthPickerVisible(true);
            }
        },
        {
            label: '연도 선택', action: () => {
                setDropdownVisible(false);
                setYearPickerVisible(true);
            }
        },
        {
            label: `${format(new Date(currentListCalendarMonth), 'yyyy년 MM월')}로 검색`, action: () => {
                setDropdownVisible(false);
                handleListMonthFilter();
            }
        },
        {
            label: `${format(new Date(currentListCalendarMonth), 'yyyy년')}으로 검색`, action: () => {
                setDropdownVisible(false);
                handleListYearFilter();
            }
        },
        {
            label: '필터 초기화', action: () => {
                setDropdownVisible(false);
                resetListFilter();
            }
        },
    ];

    return (
        <I.Container>
            <I.ListSearchWrap>
                <I.ListSearchButton
                    onPress={() => setDropdownVisible(!isDropdownVisible)}
                >
                    <I.ListSearchButtonTextWrap>
                        <EvilIcons name="search" size={30} style={{paddingRight: 5}}/>
                        <I.ListSearchButtonText>{getFilterDisplayText()}</I.ListSearchButtonText>
                    </I.ListSearchButtonTextWrap>
                </I.ListSearchButton>

                {isDropdownVisible && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={isDropdownVisible}
                        onRequestClose={() => setDropdownVisible(false)}
                    >
                        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
                            <I.ListDropDownWrap>
                                <View onStartShouldSetResponder={() => true}> {/* Prevents touch from propagating to outer TouchableWithoutFeedback */}
                                    <I.ListDropDownMenuWrap>
                                        {dropdownOptions.map((option, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    option.action();
                                                    setDropdownVisible(false); // Close modal after selection
                                                }}
                                                style={{
                                                    padding: 15,
                                                    borderBottomWidth: index === dropdownOptions.length - 1 ? 0 : 1,
                                                    borderBottomColor: '#eee',
                                                    width: '100%', // Ensure option takes full width of dropdown
                                                    alignItems: 'center', // Center text within option
                                                }}
                                            >
                                                <Text>{option.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </I.ListDropDownMenuWrap>
                                </View>
                            </I.ListDropDownWrap>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}
            </I.ListSearchWrap>

            <FlatList
                data={ilogs}
                renderItem={({item}) => <ListItem item={item}/>}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <I.ListNoSearchResultWrap>
                        <I.ListNoSearchResultText>
                            {listFilterType !== 'none' ? '선택된 조건에 일지가 없습니다.' : '작성된 일지가 없습니다.'}
                        </I.ListNoSearchResultText>
                    </I.ListNoSearchResultWrap>
                }
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={isListCalendarVisible}
                onRequestClose={() => setListCalendarVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={1}
                    onPressOut={() => setListCalendarVisible(false)}
                >
                    <View style={{width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10}}
                          onStartShouldSetResponder={() => true}>
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
