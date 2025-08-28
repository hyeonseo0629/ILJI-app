import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Alert, Switch, Platform, Text} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Schedule} from '@/components/calendar/types';
import {Tag} from '@/components/ToDo/types';
import * as S from '@/components/AddSchedule/AddScheduleStyle';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import {ASHeader} from "@/components/AddSchedule/AddScheduleStyle";
import BottomSheet, {BottomSheetBackdrop} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";

// 실제 앱에서는 이 화면으로 이동할 때 tags 목록을 prop으로 전달받거나
// 전역 상태(global state)에서 가져와야 합니다. 여기서는 예시로 사용합니다.

const AddScheduleScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const tags: Tag[] = params.tags ? JSON.parse(params.tags as string) : [];


    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number>(tags[0]?.id);
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

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('오류', '제목은 필수 항목입니다.');
            return;
        }
        if (!isAllDay && startTime >= endTime) {
            Alert.alert('오류', '종료 시간은 시작 시간보다 나중이어야 합니다.');
            return;
        }

        // 사용자가 입력한 정보로 새로운 스케줄 객체를 만듭니다.
        const newSchedule: Schedule = {
            id: Date.now(), // 임시 ID
            title: title.trim(),
            tagId: tagId,
            location: location.trim(),
            description: description.trim(),
            userId: 1, // 임시 사용자 ID
            startTime: startTime,
            endTime: endTime,
            isAllDay: isAllDay,
            rrule: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            calendarId: 1,
        };

        // 메인 화면으로 돌아가면서, 새로 생성된 일정을 파라미터로 전달합니다.
        router.replace({pathname: '/', params: {newSchedule: JSON.stringify(newSchedule)}});

    };

    // 1. 선택된 tagId가 바뀔 때마다, 전체 tags 배열에서 해당 태그 객체를 찾습니다.
    const selectedTag = useMemo(() => {
        return tags.find(tag => tag.id === tagId);
    }, [tagId, tags]);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['14.5%', '90%'], []);

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
                            style={{color: 'mediumslateblue'}}
                    >
                        {tags.map(tag => (
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

                <S.ASSaveButton onPress={handleSave}>
                    <S.ASSaveButtonText>일정 저장하기</S.ASSaveButtonText>
                </S.ASSaveButton>
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
            >
                <Text>ASD</Text>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default AddScheduleScreen;