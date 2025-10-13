import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Switch, Platform, Text, View,ActivityIndicator} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as S from '@/components/schedule/AddScheduleStyle';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {ASButtonWrap, ASCancelButtonText, ASHeader} from "@/components/schedule/AddScheduleStyle";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import { useSchedule } from '@/src/context/ScheduleContext';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StatusBar} from "expo-status-bar";
import {AntDesign} from "@expo/vector-icons";
import CreateTagModal from "@/components/addTagModal/Add-tagmodal";
import {useTheme} from '@react-navigation/native'; // useTheme import 추가
import { Colors } from '@/constants/Colors'; // 앱 자체 색상 정의 import
import TagSelectionModal from "@/components/tag/TagSelectionModal";

// 실제 앱에서는 이 화면으로 이동할 때 tags 목록을 prop으로 전달받거나
// 전역 상태(global state)에서 가져와야 합니다. 여기서는 예시로 사용합니다.

const AddScheduleScreen = () => {
    const navigationTheme = useTheme(); // 기존 useTheme의 이름을 변경
    const theme = navigationTheme.dark ? Colors.dark : Colors.light; // 우리 앱의 올바른 테마 객체

    const router = useRouter();
    // [추가] 라우터 파라미터에서 initialDate를 가져옵니다.
    const { initialDate } = useLocalSearchParams<{ initialDate: string }>();

    // [수정] 파라미터로 받은 날짜가 있으면 그 날짜를, 없으면 오늘 날짜를 기본값으로 사용합니다.
    const initialDateFromParams = initialDate ? new Date(initialDate) : new Date();

    // Context에서 생성 함수, 태그 목록, 로딩 상태를 가져옵니다.
    const { createSchedule, tags, loading, createTag } = useSchedule();

    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number | null>(null); // 태그 ID 상태 (초기값 null)
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);

    useEffect(() => {
        // 태그가 로드되었고, 아직 기본 태그가 설정되지 않았을 때 '일정' 태그를 기본값으로 설정합니다.
        if (tags && tags.length > 0 && tagId === null) {
            const scheduleTag = tags.find(tag => tag.label === '일정');
            if (scheduleTag) {
                setTagId(scheduleTag.id);
            }
        }
    }, [tags]);

    // [수정] 상태 초기값으로 initialDateFromParams를 사용합니다.
    const [startTime, setStartTime] = useState(initialDateFromParams);
    const [endTime, setEndTime] = useState(new Date(initialDateFromParams.getTime() + 60 * 60 * 1000)); // 기본 1시간 뒤

    // DateTimePicker 상태 관리
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    // 태그 생성 모달 상태
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [isTagSelectionModalVisible, setIsTagSelectionModalVisible] = useState(false);

    const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || (pickerTarget === 'start' ? startTime : endTime);
        setShowPicker(Platform.OS === 'ios'); // iOS에서는 수동으로 닫아야 함

        if (pickerTarget === 'start') {
            setStartTime(currentDate);

            // 시작 날짜가 변경되면, 종료 날짜도 동일하게 맞춰주되 시간은 유지합니다.
            const newEndTime = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                endTime.getHours(),
                endTime.getMinutes(),
                endTime.getSeconds()
            );

            // 만약 새로 계산된 종료 시간이 시작 시간보다 빠르다면,
            // 종료 시간을 시작 시간 1시간 뒤로 설정합니다.
            if (newEndTime < currentDate) {
                setEndTime(new Date(currentDate.getTime() + 60 * 60 * 1000));
            } else {
                setEndTime(newEndTime);
            }
        } else {
            setEndTime(currentDate);
        }
    };

    const showMode = (target: 'start' | 'end', mode: 'date' | 'time') => {
        setPickerTarget(target);
        setPickerMode(mode);
        setShowPicker(true);
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('오류', '제목은 필수 항목입니다.');
            return;
        }
        if (tagId === null) {
            Alert.alert('오류', '태그를 선택해주세요.');
            return;
        }
        if (!isAllDay && startTime >= endTime) {
            Alert.alert('오류', '종료 시간은 시작 시간보다 나중이어야 합니다.');
            return;
        }

        // 서버에 보낼 데이터 객체를 만듭니다. (id, createdAt 등은 제외)
        const newScheduleData = {
            title: title.trim(),
            tagId: tagId,
            location: location.trim(),
            description: description.trim(),
            startTime: startTime,
            endTime: endTime,
            isAllDay: isAllDay,
            calendarId: 1,
        };

        await createSchedule(newScheduleData); // Context의 함수를 호출해 서버에 저장
        router.back(); // 저장이 완료되면 이전 화면으로 돌아갑니다.
    };

    const handleSaveTag = async (name: string, color: string) => {
        try {
            // Context의 createTag 함수를 호출하고, 새로 생성된 태그 객체를 반환받습니다.
            const newTag = await createTag({ label: name, color: color });
            // 새로 생성된 태그를 현재 일정의 태그로 자동 선택합니다.
            setTagId(newTag.id);
            // 모달을 닫습니다.
            setIsTagModalVisible(false);
        } catch (error) {
            console.error("Failed to create tag:", error);
            Alert.alert('태그 생성 실패', '태그를 저장하는 중 오류가 발생했습니다.');
        }
    };

    // 1. 선택된 tagId가 바뀔 때마다, 전체 tags 배열에서 해당 태그 객체를 찾습니다.
    const selectedTag = useMemo(() => {
        return tags.find(tag => tag.id === tagId);
    }, [tagId, tags]);

    const sortedTags = useMemo(() => {
        if (!tags) return [];
        return [...tags].sort((a, b) => {
            if (a.label === '일정') return -1;
            if (b.label === '일정') return 1;
            return 0;
        });
    }, [tags]);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['16%', '90%'], []);

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
        <GestureHandlerRootView>
            <StatusBar style="dark"/>
            <S.ASContainer contentContainerStyle={{paddingBottom: 120}} $colors={theme}>
                <ASHeader $colors={theme}>New Schedule</ASHeader>
                <S.ASContentWrap>

                    <S.ASLabel $colors={theme}>Title</S.ASLabel>
                    <S.ASInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목"
                        $colors={theme}
                        placeholderTextColor={theme.text}
                    />

                    <S.ASLabel $colors={theme}>Memo</S.ASLabel>
                    <S.ASInput value={description} onChangeText={setDescription} placeholder="메모" multiline
                               style={{height: 100, textAlignVertical: 'top'}}
                               $colors={theme}
                               placeholderTextColor={theme.text}
                    />

                    <S.ASSwitchRow>
                        <S.ASLabel style={{marginTop: 0, marginBottom: 0}} $colors={theme}>All Day</S.ASLabel>
                        <Switch
                            trackColor={{false: theme.borderColor, true: navigationTheme.dark ? '#575757' : 'lavender'}}
                            thumbColor={theme.pointColors.purple}
                            ios_backgroundColor={theme.borderColor}
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </S.ASSwitchRow>

                    <S.ASLabel $colors={theme}>Start</S.ASLabel>
                    <S.ASDateTimeRow>
                        <S.ASDateTimeButton onPress={() => showMode('start', 'date')} $colors={theme}>
                            <S.ASDateTimeButtonText $colors={theme}>{format(startTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('start', 'time')} $colors={theme}>
                                <S.ASDateTimeButtonText $colors={theme}>{format(startTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel $colors={theme}>End</S.ASLabel>
                    <S.ASDateTimeRow>
                        <S.ASDateTimeButton onPress={() => showMode('end', 'date')} $colors={theme}>
                            <S.ASDateTimeButtonText $colors={theme}>{format(endTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('end', 'time')} $colors={theme}>
                                <S.ASDateTimeButtonText $colors={theme}>{format(endTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel $colors={theme}>Location</S.ASLabel>
                    <S.ASInput value={location} onChangeText={setLocation} placeholder="장소"
                               $colors={theme}
                               placeholderTextColor={theme.text}
                    />

                    <S.ASTagHeaderRow>
                        <S.ASLabel $colors={theme}>Tag</S.ASLabel>
                        <S.ASAddButton onPress={() => setIsTagModalVisible(true)} $colors={theme}>
                            <AntDesign name="pluscircleo" size={24} color={theme.pointColors.purple} />
                        </S.ASAddButton>
                    </S.ASTagHeaderRow>
                    <S.ASDateTimeButton onPress={() => setIsTagSelectionModalVisible(true)}>
                        <S.ASDateTimeButtonText>
                            {selectedTag ? selectedTag.label : '태그 선택'}
                        </S.ASDateTimeButtonText>
                    </S.ASDateTimeButton>


                    {selectedTag && (
                        <S.ASSelectedTagWrap>
                            <S.ASSelectedTag color={selectedTag.color || theme.borderColor} $colors={theme}>
                                <S.ASSelectedTagText $colors={theme}>#{selectedTag.label}</S.ASSelectedTagText>
                            </S.ASSelectedTag>
                        </S.ASSelectedTagWrap>
                    )}

                </S.ASContentWrap>
                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={pickerTarget === 'start' ? startTime : endTime}
                        mode={pickerMode}
                        is24Hour={true}
                        display="default"
                        onChange={onDateTimeChange}
                        textColor={theme.text}
                    />
                )}

                <CreateTagModal
                    visible={isTagModalVisible}
                    onClose={() => setIsTagModalVisible(false)}
                    onSave={handleSaveTag}
                    colors={theme}
                />

                <TagSelectionModal
                    visible={isTagSelectionModalVisible}
                    tags={sortedTags}
                    onClose={() => setIsTagSelectionModalVisible(false)}
                    onSelect={(tag) => {
                        setTagId(tag.id);
                        setIsTagSelectionModalVisible(false);
                    }}
                />

            </S.ASContainer>
            <ASButtonWrap $colors={theme}>
                <S.ASCancelButton onPress={() => router.back()} $colors={theme}>
                    <ASCancelButtonText $colors={theme}>Cancel</ASCancelButtonText>
                </S.ASCancelButton>
                <S.ASSaveButton onPress={handleSave} disabled={loading} $colors={theme}>
                    <S.ASSaveButtonText $colors={theme}>Save</S.ASSaveButtonText>
                </S.ASSaveButton>
            </ASButtonWrap>
        </GestureHandlerRootView>
    );
};

export default AddScheduleScreen;