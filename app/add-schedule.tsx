import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Switch, Platform, Text, ActivityIndicator} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Tag} from '@/components/ToDo/types';
import * as S from '@/components/AddSchedule/AddScheduleStyle';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {ASButtonWrap, ASCancelButtonText, ASHeader, ASTagHeaderRow, ASAddButton} from "@/components/AddSchedule/AddScheduleStyle";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import { useSchedule } from '@/src/context/ScheduleContext';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import CreateTagModal from "@/components/AddTagModal/add-tagmodal";

const AddScheduleScreen = () => {
    const router = useRouter();
    // Context에서 생성 함수, 태그 목록, 로딩 상태를 가져옵니다.
    const { createSchedule, tags, loading, createTag } = useSchedule();

    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number>(0); // '태그 없음'을 기본값으로 설정
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // 기본 1시간 뒤

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
            <S.ASContainer contentContainerStyle={{paddingBottom: 120}}>
                <ASHeader>New Reminder</ASHeader>
                <S.ASContentWrap>

                    <S.ASLabel>Title</S.ASLabel>
                    <S.ASInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목"
                    />

                    <S.ASLabel>Memo</S.ASLabel>
                    <S.ASInput value={description} onChangeText={setDescription} placeholder="메모" multiline
                               style={{height: 100, textAlignVertical: 'top'}}/>

                    <S.ASSwitchRow>
                        <S.ASLabel style={{marginTop: 0, marginBottom: 0}}>All Day</S.ASLabel>
                        <Switch
                            trackColor={{false: "lavender", true: "mediumpurple"}}
                            thumbColor={"mediumslateblue"}
                            ios_backgroundColor="lavender"
                            onValueChange={setIsAllDay}
                            value={isAllDay}
                        />
                    </S.ASSwitchRow>

                    <S.ASLabel>Start</S.ASLabel>
                    <S.ASDateTimeRow>
                        {/* 1. 날짜 선택 버튼 */}
                        <S.ASDateTimeButton onPress={() => showMode('start', 'date')}>
                            <S.ASDateTimeButtonText>{format(startTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {/* 2. '종일'이 아닐 때만 시간 선택 버튼을 보여줍니다. */}
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('start', 'time')}>
                                <S.ASDateTimeButtonText>{format(startTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel>End</S.ASLabel>
                    <S.ASDateTimeRow>
                        <S.ASDateTimeButton onPress={() => showMode('end', 'date')}>
                            <S.ASDateTimeButtonText>{format(endTime, 'yyyy. MM. dd')}</S.ASDateTimeButtonText>
                        </S.ASDateTimeButton>
                        {!isAllDay && (
                            <S.ASDateTimeButton onPress={() => showMode('end', 'time')}>
                                <S.ASDateTimeButtonText>{format(endTime, 'HH:mm')}</S.ASDateTimeButtonText>
                            </S.ASDateTimeButton>
                        )}
                    </S.ASDateTimeRow>

                    <S.ASLabel>Location</S.ASLabel>
                    <S.ASInput value={location} onChangeText={setLocation} placeholder="장소"/>

                    <ASTagHeaderRow>
                        <S.ASLabel>Tag</S.ASLabel>
                        <ASAddButton onPress={() => setIsTagModalVisible(true)}>
                            <AntDesign name="pluscircleo" size={24} color="mediumslateblue" />
                        </ASAddButton>
                    </ASTagHeaderRow>
                    <S.ASPickerWrap>
                        {loading ? (
                            <ActivityIndicator size="small" color="mediumslateblue" />
                        ) : (
                            <Picker selectedValue={tagId}
                                    onValueChange={(itemValue) => setTagId(itemValue)}
                                    style={{ color: 'mediumslateblue' }}
                            >
                                <Picker.Item label="-- No Tag --" value={0} />
                                {tags && tags.map((tag) => (
                                    <Picker.Item key={tag.id} label={tag.label} value={tag.id}/>
                                ))}
                            </Picker>
                        )}
                    </S.ASPickerWrap>

                    {/* 2. 선택된 태그가 있을 경우, 해시태그 스타일로 화면에 표시합니다. */}
                    {selectedTag && (
                        <S.ASSelectedTagWrap>
                            <S.ASSelectedTag color={selectedTag.color || 'gray'}>
                                <S.ASSelectedTagText>#{selectedTag.label}</S.ASSelectedTagText>
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
                    />
                )}

                <CreateTagModal
                    visible={isTagModalVisible}
                    onClose={() => setIsTagModalVisible(false)}
                    onSave={handleSaveTag}
                />

            </S.ASContainer>
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                backgroundStyle={{
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0', // 부드러운 회색 경계선
                    borderRadius: 0
                }}
                handleIndicatorStyle={{
                    backgroundColor: 'mediumpurple', // 1. 핸들 바의 색상을 변경합니다.
                    width: 200,                     // 2. 핸들 바의 너비를 조절합니다.
                    height: 5,
                    margin:10,
                }}
            >
                <Text>ASD</Text>
            </BottomSheet>
            <ASButtonWrap>
                {/* Cancel 버튼은 단순히 이전 화면으로 돌아가도록 router.back()을 사용합니다. */}
                <S.ASCancelButton onPress={() => router.back()}>
                    <ASCancelButtonText>Cancel</ASCancelButtonText>
                </S.ASCancelButton>
                <S.ASSaveButton onPress={handleSave} disabled={loading}>
                    <S.ASSaveButtonText>Save</S.ASSaveButtonText>
                </S.ASSaveButton>
            </ASButtonWrap>
        </GestureHandlerRootView>
    );
};

export default AddScheduleScreen;