import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Switch, Platform, Text, View,ActivityIndicator} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as S from '@/components/schedule/AddScheduleStyle';
import {Picker} from '@react-native-picker/picker';
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
import TagSelectionModal from "@/components/tag/TagSelectionModal";

// 실제 앱에서는 이 화면으로 이동할 때 tags 목록을 prop으로 전달받거나
// 전역 상태(global state)에서 가져와야 합니다. 여기서는 예시로 사용합니다.

const AddScheduleScreen = () => {
    const theme = useTheme(); // useTheme 훅 사용

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
    const [reminderMinutesBefore, setReminderMinutesBefore] = useState<number | null>(null);

    // DateTimePicker 상태 관리
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    // 태그 생성 모달 상태
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);
    const [isTagSelectionModalVisible, setIsTagSelectionModalVisible] = useState(false);

    // 미리 알림 선택 BottomSheet 상태
    const [isReminderSheetVisible, setIsReminderSheetVisible] = useState(false);
    const reminderSheetRef = useRef<BottomSheet>(null);
    // 미리 알림 옵션
    const reminderOptions = [
        { label: '없음', value: null },
        { label: '정시', value: 0 },
        { label: '1분 전', value: 1 },
        { label: '10분 전', value: 10 },
        { label: '30분 전', value: 30 },
        { label: '1시간 전', value: 60 },
    ];
    const selectedReminderLabel = reminderOptions.find(option => option.value === reminderMinutesBefore)?.label || '없음';
    const reminderSnapPoints = useMemo(() => ['45%'], []);


    const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(false); // Picker를 닫습니다.

        if (selectedDate) { // 날짜가 선택된 경우에만 상태를 업데이트합니다.
            const currentDate = selectedDate;

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
            calendarId: 1, // Assuming a default calendarId
            reminderMinutesBefore: reminderMinutesBefore,
        };

        await createSchedule(newScheduleData as any); // Context의 함수를 호출해 서버에 저장
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
            <S.ASContainer contentContainerStyle={{paddingBottom: 120}} $colors={theme.colors}>
                <ASHeader $colors={theme.colors}>New Schedule</ASHeader>
                <S.ASContentWrap>

                    <S.ASLabel $colors={theme.colors}>Title</S.ASLabel>
                    <S.ASInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목"
                        $colors={theme.colors}
                        placeholderTextColor={theme.colors.text}
                    />

                    <S.ASLabel $colors={theme.colors}>Memo</S.ASLabel>
                    <S.ASInput value={description} onChangeText={setDescription} placeholder="메모" multiline
                               style={{height: 100, textAlignVertical: 'top'}}
                               $colors={theme.colors}
                               placeholderTextColor={theme.colors.text}
                    />

                    <S.ASSwitchRow>
                        <S.ASLabel style={{marginTop: 0, marginBottom: 0}} $colors={theme.colors}>All Day</S.ASLabel>
                        <Switch
                            trackColor={{false: theme.colors.border, true: theme.colors.primary}}
                            thumbColor={theme.colors.primary}
                            ios_backgroundColor={theme.colors.border}
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </S.ASSwitchRow>

                    <S.ASLabel $colors={theme.colors}>Start</S.ASLabel>
                    <S.ASDateTimeRow>
                        <S.ASDateTimeButton onPress={() => showMode('start', 'date')} $colors={theme.colors}>
                            <S.ASDateTimeButtonText $colors={theme.colors}>{format(startTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('start', 'time')} $colors={theme.colors}>
                                <S.ASDateTimeButtonText $colors={theme.colors}>{format(startTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel $colors={theme.colors}>End</S.ASLabel>
                    <S.ASDateTimeRow>
                        <S.ASDateTimeButton onPress={() => showMode('end', 'date')} $colors={theme.colors}>
                            <S.ASDateTimeButtonText $colors={theme.colors}>{format(endTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('end', 'time')} $colors={theme.colors}>
                                <S.ASDateTimeButtonText $colors={theme.colors}>{format(endTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel $colors={theme.colors}>Location</S.ASLabel>
                    <S.ASInput value={location} onChangeText={setLocation} placeholder="장소"
                               $colors={theme.colors}
                               placeholderTextColor={theme.colors.text}
                    />

                    <S.ASLabel $colors={theme.colors}>Notification</S.ASLabel>
                    <S.ASDateTimeButton onPress={() => setIsReminderSheetVisible(true)} style={{ marginBottom: 20 }}>
                        <S.ASDateTimeButtonText $colors={theme.colors}>
                            {selectedReminderLabel}
                        </S.ASDateTimeButtonText>
                    </S.ASDateTimeButton>

                    <S.ASTagHeaderRow>
                        <S.ASLabel $colors={theme.colors}>Tag</S.ASLabel>
                        <S.ASAddButton onPress={() => setIsTagModalVisible(true)} $colors={theme.colors}>
                            <AntDesign name="pluscircleo" size={24} color={theme.colors.primary} />
                        </S.ASAddButton>
                    </S.ASTagHeaderRow>
                    <S.ASDateTimeButton onPress={() => setIsTagSelectionModalVisible(true)}>
                        <S.ASDateTimeButtonText>
                            {selectedTag ? selectedTag.label : '태그 선택'}
                        </S.ASDateTimeButtonText>
                    </S.ASDateTimeButton>


                    {selectedTag && (
                        <S.ASSelectedTagWrap>
                            <S.ASSelectedTag color={selectedTag.color || theme.colors.border} $colors={theme.colors}>
                                <S.ASSelectedTagText $colors={theme.colors}>#{selectedTag.label}</S.ASSelectedTagText>
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
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateTimeChange}
                        textColor={theme.colors.text}
                    />
                )}

                {isReminderSheetVisible && (
                    <BottomSheet
                        ref={reminderSheetRef}
                        index={0}
                        snapPoints={reminderSnapPoints}
                        onClose={() => setIsReminderSheetVisible(false)}
                        backdropComponent={renderBackdrop}
                        backgroundStyle={{ backgroundColor: theme.colors.card, borderTopWidth: 1, borderTopColor: theme.colors.border }}
                        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
                    >
                        <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
                            {reminderOptions.map((option, index) => (
                                <S.ASDateTimeButton
                                    key={index}
                                    onPress={() => {
                                        setReminderMinutesBefore(option.value);
                                        setIsReminderSheetVisible(false);
                                    }}
                                    style={{ width: '90%', marginBottom: 10, backgroundColor: reminderMinutesBefore === option.value ? theme.colors.primary : theme.colors.card }}
                                >
                                    <S.ASDateTimeButtonText $colors={theme.colors} style={{ color: reminderMinutesBefore === option.value ? theme.colors.background : theme.colors.text }}>
                                        {option.label}
                                    </S.ASDateTimeButtonText>
                                </S.ASDateTimeButton>
                            ))}
                        </View>
                    </BottomSheet>
                )}

                <CreateTagModal
                    visible={isTagModalVisible}
                    onClose={() => setIsTagModalVisible(false)}
                    onSave={handleSaveTag}
                    colors={theme.colors}
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
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    borderRadius: 0,
                    backgroundColor: theme.colors.card,
                }}
                handleIndicatorStyle={{
                    backgroundColor: theme.colors.primary,
                    width: 200,
                    height: 5,
                    margin:10,
                }}
            >
                <S.ASContentWrap>
                </S.ASContentWrap>
            </BottomSheet>
            <ASButtonWrap $colors={theme.colors}>
                <S.ASCancelButton onPress={() => router.back()} $colors={theme.colors}>
                    <ASCancelButtonText $colors={theme.colors}>Cancel</ASCancelButtonText>
                </S.ASCancelButton>
                <S.ASSaveButton onPress={handleSave} disabled={loading} $colors={theme.colors}>
                    <S.ASSaveButtonText $colors={theme.colors}>Save</S.ASSaveButtonText>
                </S.ASSaveButton>
            </ASButtonWrap>
        </GestureHandlerRootView>
    );
};

export default AddScheduleScreen;