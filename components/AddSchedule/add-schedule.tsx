import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Schedule } from '@/components/calendar/types';
import { Tag } from '@/components/ToDo/types';
import * as S from '@/components/AddSchedule/AddScheduleStyle';
import { Picker } from '@react-native-picker/picker';

// 실제 앱에서는 이 화면으로 이동할 때 tags 목록을 prop으로 전달받거나
// 전역 상태(global state)에서 가져와야 합니다. 여기서는 예시로 사용합니다.
const sampleTags: Tag[] = [
    { id: 1, color: '#FFB3A7', createdAt: new Date(), label: 'Work', updatedAt: new Date(), userId: 1 },
    { id: 2, color: '#A7D7FF', createdAt: new Date(), label: 'Personal', updatedAt: new Date(), userId: 1 },
    { id: 3, color: '#A7FFD4', createdAt: new Date(), label: 'Study', updatedAt: new Date(), userId: 1 },
];

const AddScheduleScreen = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [tagId, setTagId] = useState<number>(sampleTags[0]?.id);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    // 참고: 날짜/시간 선택(DateTimePicker) 및 종일(isAllDay) 스위치 구현은
    //       설명이 길어져 생략했지만, 실제 기능 구현 시 필요합니다.

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('오류', '제목은 필수 항목입니다.');
            return;
        }

        // 사용자가 입력한 정보로 새로운 스케줄 객체를 만듭니다.
        const newSchedule: Partial<Schedule> = {
            id: Date.now(), // 임시로 고유 ID 생성
            title: title.trim(),
            tagId: tagId,
            location: location.trim(),
            description: description.trim(),
            userId: 1, // 임시 사용자 ID
            // ... startTime, endTime 등 다른 속성들
        };

        console.log('저장될 새 일정:', newSchedule);

        // 실제 앱에서는 여기서 전역 상태 관리 라이브러리(Zustand, Redux 등)를 호출하여
        // index.tsx에 있는 'schedules' 배열에 이 newSchedule을 추가해야 합니다.
        // 지금은 이전 화면으로 돌아가기만 합니다.
        Alert.alert('성공', '일정이 저장되었습니다 (콘솔에 기록됨).');

        if (router.canGoBack()) {
            router.back();
        }
    };

    return (
        <S.Container contentContainerStyle={{ paddingBottom: 40 }}>
            <S.ContentWrap>
                <S.Label>제목</S.Label>
                <S.Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder="예: 팀 회의"
                />

                <S.Label>태그</S.Label>
                <S.PickerWrap>
                    <Picker selectedValue={tagId} onValueChange={(itemValue) => setTagId(itemValue)}>
                        {sampleTags.map(tag => (
                            <Picker.Item key={tag.id} label={tag.label} value={tag.id} />
                        ))}
                    </Picker>
                </S.PickerWrap>

                <S.Label>위치 (선택)</S.Label>
                <S.Input value={location} onChangeText={setLocation} placeholder="예: 3번 회의실" />

                <S.Label>설명 (선택)</S.Label>
                <S.Input value={description} onChangeText={setDescription} placeholder="예: 4분기 로드맵 논의" multiline style={{ height: 100, textAlignVertical: 'top' }} />

                <S.SaveButton onPress={handleSave}>
                    <S.SaveButtonText>일정 저장하기</S.SaveButtonText>
                </S.SaveButton>
            </S.ContentWrap>
        </S.Container>
    );
};

export default AddScheduleScreen;