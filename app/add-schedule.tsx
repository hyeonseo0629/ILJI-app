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
    const [tagId, setTagId] = useState<number>(0); // '태그 없음'을 기본값으로 설정
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    // [수정] 상태 초기값으로 initialDateFromParams를 사용합니다.
    const [startTime, setStartTime] = useState(initialDateFromParams);
    const [endTime, setEndTime] = useState(new Date(initialDateFromParams.getTime() + 60 * 60 * 1000)); // 기본 1시간 뒤

    // DateTimePicker 상태 관리
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    // 태그 생성 모달 상태
    const [isTagModalVisible, setIsTagModalVisible] = useState(false);

    const onDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || (pickerTarget === 'start' ? startTime : endTime);
        setShowPicker(Platform.OS === 'ios'); // iOS에서는 수동으로 닫아야 함

        if (pickerTarget === 'start') {
            setStartTime(currentDate);
            // 시작 시간이 종료 시간보다 늦어지면, 종료 시간을 시작 시간 1시간 뒤로 자동 설정
            if (currentDate >= endTime) {
                setEndTime(new Date(currentDate.getTime() + 60 * 60 * 1000));
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
            rrule: '', // rrule은 null 대신 빈 문자열을 사용합니다.
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
                <ASHeader $colors={theme.colors}>New Reminder</ASHeader>
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

                    <S.ASTagHeaderRow>
                        <S.ASLabel $colors={theme.colors}>Tag</S.ASLabel>
                        <S.ASAddButton onPress={() => setIsTagModalVisible(true)} $colors={theme.colors}>
                            <AntDesign name="pluscircleo" size={24} color={theme.colors.primary} />
                        </S.ASAddButton>
                    </S.ASTagHeaderRow>
                    <S.ASPickerWrap $colors={theme.colors}>
                        {loading ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <Picker selectedValue={tagId}
                                    onValueChange={(itemValue) => setTagId(itemValue)}
                                    style={{ color: theme.colors.text }}
                                    dropdownIconColor={theme.colors.text}
                            >
                                <Picker.Item label="-- No Tag --" value={0} />
                                {tags && tags.map((tag) => (
                                    <Picker.Item key={tag.id} label={tag.label} value={tag.id} color={theme.colors.text}/>
                                ))}
                            </Picker>
                        )}
                    </S.ASPickerWrap>

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
                        display="default"
                        onChange={onDateTimeChange}
                        textColor={theme.colors.text}
                    />
                )}

                <CreateTagModal
                    visible={isTagModalVisible}
                    onClose={() => setIsTagModalVisible(false)}
                    onSave={handleSaveTag}
                    colors={theme.colors}
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