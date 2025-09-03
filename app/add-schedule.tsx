import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Alert, Switch, Platform, Text} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Tag} from '@/components/ToDo/types';
import * as S from '@/components/AddSchedule/AddScheduleStyle';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {ASButtonWrap, ASCancelButtonText, ASHeader} from "@/components/AddSchedule/AddScheduleStyle";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import { useSchedule } from '@/src/context/ScheduleContext';
import {GestureHandlerRootView} from "react-native-gesture-handler";

// 실제 앱에서는 이 화면으로 이동할 때 tags 목록을 prop으로 전달받거나
// 전역 상태(global state)에서 가져와야 합니다. 여기서는 예시로 사용합니다.

const AddScheduleScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const tags: Tag[] = params.tags ? JSON.parse(params.tags as string) : [];
    const { createSchedule } = useSchedule(); // Context에서 생성 함수 가져오기


    const [title, setTitle] = useState('');
    // 🚨 '태그 없음'을 명시적으로 처리하기 위해 초기값을 0으로 설정하고, tags가 있을 경우 첫 번째 태그를 기본값으로 합니다.
    const [tagId, setTagId] = useState<number>(tags[0]?.id ?? 0);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // 기본 1시간 뒤

    // DateTimePicker 상태 관리
    const [showPicker, setShowPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

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
            userId: 4, // Context와 동일한 임시 사용자 ID
            startTime: startTime,
            endTime: endTime,
            isAllDay: isAllDay,
            rrule: '', // rrule은 null 대신 빈 문자열을 사용합니다.
            calendarId: 1,
        };

        await createSchedule(newScheduleData); // Context의 함수를 호출해 서버에 저장
        router.back(); // 저장이 완료되면 이전 화면으로 돌아갑니다.
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
            <S.ASContainer contentContainerStyle={{paddingBottom: 40}}>
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

                    <S.ASLabel>Tag</S.ASLabel>
                    <S.ASPickerWrap>
                        <Picker selectedValue={tagId}
                                onValueChange={(itemValue) => setTagId(itemValue)}
                                style={{ color: 'mediumslateblue' }}
                        >
                            {/* 🚨 '태그 없음' 옵션을 명시적으로 추가하고, value를 0으로 설정합니다. */}
                            <Picker.Item label="-- 태그 없음 --" value={0} />
                            {tags.map((tag) => (
                                <Picker.Item key={tag.id} label={tag.label} value={tag.id}/>
                            ))}
                        </Picker>
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
                <S.ASSaveButton onPress={handleSave}>
                    <S.ASSaveButtonText>Save</S.ASSaveButtonText>
                </S.ASSaveButton>
                <S.ASCancelButton onPress={() => router.push({
                    pathname: '/',
                    params: {tags: JSON.stringify(tags)}
                })}>
                    <ASCancelButtonText>Cancel</ASCancelButtonText>
                </S.ASCancelButton>
            </ASButtonWrap>
        </GestureHandlerRootView>
    );
};

export default AddScheduleScreen;