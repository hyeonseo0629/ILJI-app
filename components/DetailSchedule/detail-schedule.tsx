import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Pressable, View, Alert, Switch, Platform } from 'react-native';
import { format, set } from 'date-fns';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as S from './DetailScheduleStyle';
import { Schedule } from '@/components/calendar/types';
import { Tag } from '@/components/ToDo/types';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DetailScheduleProps {
    schedule: Schedule | null;
    tags: Tag[];
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    onUpdate: (schedule: Schedule) => void;
}

const DetailSchedule: React.FC<DetailScheduleProps> = ({ schedule, tags, visible, onClose, onDelete, onUpdate }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<Schedule | null>(schedule);
    // Date & Time Picker 상태
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const selectedTag = useMemo(() => {
        // 수정 후 바로 반영되도록 formData를 기준으로 태그를 찾습니다.
        if (!formData) return null;
        return tags.find(tag => tag.id === formData.tagId);
    }, [formData, tags]);

    useEffect(() => {
        // 모달이 열리거나 스케줄이 변경될 때 폼 데이터를 초기화하고, 수정 모드를 끕니다.
        setFormData(schedule);
        if (!visible) {
            setIsEditMode(false);
        }
    }, [schedule, visible]);

    if (!schedule || !formData) {
        return null; // 스케줄이 없으면 아무것도 렌더링하지 않음
    }

    const handleDeletePress = () => {
        Alert.alert(
            "일정 삭제",
            `'${schedule.title}' 일정을 정말 삭제하시겠습니까?`,
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: onDelete, // 부모로부터 받은 삭제 함수를 실행
                    style: "destructive",
                }
            ]
        );
    };

    const handleUpdatePress = () => {
        onUpdate(formData);
        setIsEditMode(false); // 수정 후 디테일 뷰로 전환
    };

    const handleInputChange = (field: keyof Schedule, value: any) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const newStartTime = set(formData.startTime, { year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() });
            const newEndTime = set(formData.endTime, { year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() });
            setFormData(prev => prev ? { ...prev, startTime: newStartTime, endTime: newEndTime } : null);
        }
    };

    const onStartTimeChange = (event: any, selectedTime?: Date) => {
        setShowStartTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newStartTime = set(formData.startTime, { hours: selectedTime.getHours(), minutes: selectedTime.getMinutes() });
            // 시작 시간이 종료 시간보다 늦어지지 않도록 보정
            if (newStartTime > formData.endTime) {
                setFormData(prev => prev ? { ...prev, startTime: newStartTime, endTime: newStartTime } : null);
            } else {
                setFormData(prev => prev ? { ...prev, startTime: newStartTime } : null);
            }
        }
    };

    const onEndTimeChange = (event: any, selectedTime?: Date) => {
        setShowEndTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newEndTime = set(formData.endTime, { hours: selectedTime.getHours(), minutes: selectedTime.getMinutes() });
            if (newEndTime < formData.startTime) {
                setFormData(prev => prev ? { ...prev, endTime: formData.startTime } : null);
            } else {
                setFormData(prev => prev ? { ...prev, endTime: newEndTime } : null);
            }
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <S.ModalOverlay onPress={onClose}>
                {/* Pressable로 감싸서 모달 내부 클릭 시 닫히는 것을 방지 */}
                <Pressable>
                    <S.DSContainer>
                        {isEditMode ? (
                            <S.DSHeaderInput value={formData.title} onChangeText={(text) => handleInputChange('title', text)} />
                        ) : (
                            <S.DSHeader>{formData.title}</S.DSHeader>
                        )}
                        <S.DSContentWrap>
                            {isEditMode ? (
                                <>
                                    <S.AllDayRow>
                                        <S.DSLabel>All Day</S.DSLabel>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "mediumslateblue" }}
                                            thumbColor={"#f4f3f4"}
                                            onValueChange={(value) => handleInputChange('isAllDay', value)}
                                            value={formData.isAllDay}
                                        />
                                    </S.AllDayRow>
                                    <S.DateTimePickerButton onPress={() => setShowDatePicker(true)}>
                                        <S.DateTimePickerButtonText>{format(formData.startTime, 'yyyy. MM. dd')}</S.DateTimePickerButtonText>
                                    </S.DateTimePickerButton>
                                    {!formData.isAllDay && (
                                        <S.DateTimePickersRow style={{ marginTop: 15 }}>
                                            <S.DateTimePickerButton onPress={() => setShowStartTimePicker(true)} style={{ marginRight: 10 }}>
                                                <S.DateTimePickerButtonText>{format(formData.startTime, 'HH:mm')}</S.DateTimePickerButtonText>
                                            </S.DateTimePickerButton>
                                            <S.DateTimePickerButton onPress={() => setShowEndTimePicker(true)}>
                                                <S.DateTimePickerButtonText>{format(formData.endTime, 'HH:mm')}</S.DateTimePickerButtonText>
                                            </S.DateTimePickerButton>
                                        </S.DateTimePickersRow>
                                    )}
                                </>
                            ) : (
                                <S.DateTimeInfoRow>
                                    <S.DateTimeInfo>
                                        <S.CalendarIcon name="event" size={40} color="#888" />
                                        <S.DateTimeTexts>
                                            <S.DateText>{format(formData.startTime, 'yyyy. MM. dd')}</S.DateText>
                                            {formData.isAllDay ? (
                                                <S.TimeText>ALL DAY</S.TimeText>
                                            ) : (
                                                <S.TimeText>
                                                    {format(formData.startTime, 'HH:mm')} ~ {format(formData.endTime, 'HH:mm')}
                                                </S.TimeText>
                                            )}
                                        </S.DateTimeTexts>
                                    </S.DateTimeInfo>
                                    <S.DeleteButton onPress={handleDeletePress}>
                                        <Feather name="trash-2" size={30} color="#D25A5A" />
                                    </S.DeleteButton>
                                </S.DateTimeInfoRow>
                            )}

                            {/* Tag 섹션을 이 위치로 이동합니다. */}
                            {isEditMode ? (
                                <>
                                    <S.DSLabel>Tag</S.DSLabel>
                                    <S.TagSelectorContainer>
                                        {tags.map(tag => (
                                            <S.TagSelectorItem
                                                key={tag.id}
                                                color={tag.color}
                                                selected={formData.tagId === tag.id}
                                                onPress={() => handleInputChange('tagId', tag.id)}
                                            >
                                                <S.TagSelectorText selected={formData.tagId === tag.id}>#{tag.label}</S.TagSelectorText>
                                            </S.TagSelectorItem>
                                        ))}
                                    </S.TagSelectorContainer>
                                </>
                            ) : selectedTag && (
                                <S.DSSelectedTagWrap>
                                    <S.DSSelectedTag color={selectedTag.color || 'gray'}>
                                        <S.DSSelectedTagText>#{selectedTag.label}</S.DSSelectedTagText>
                                    </S.DSSelectedTag>
                                </S.DSSelectedTagWrap>
                            )}

                            <S.DSLabel>Memo</S.DSLabel>
                            {isEditMode ? (
                                <S.DSValueInput
                                    value={formData.description || ''}
                                    onChangeText={(text) => handleInputChange('description', text)}
                                    multiline
                                />
                            ) : (
                                <S.DSValueText>{formData.description || '메모 없음'}</S.DSValueText>
                            )}

                            <S.DSLabel>Location</S.DSLabel>
                            {isEditMode ? (
                                <S.DSValueInput
                                    value={formData.location || ''}
                                    onChangeText={(text) => handleInputChange('location', text)}
                                />
                            ) : (
                                <S.DSValueText>{formData.location || '장소 없음'}</S.DSValueText>
                            )}

                        </S.DSContentWrap>
                        {isEditMode ? (
                            <S.DSButtonArea>
                                <S.DSActionButton onPress={() => setIsEditMode(false)}>
                                    <S.DSActionButtonText>Cancel</S.DSActionButtonText>
                                </S.DSActionButton>
                                <S.DSButtonSeparator />
                                <S.DSActionButton primary onPress={handleUpdatePress}>
                                    <S.DSActionButtonText primary>Save</S.DSActionButtonText>
                                </S.DSActionButton>
                            </S.DSButtonArea>
                        ) : (
                            <S.DSButtonArea>
                                <S.DSActionButton onPress={onClose}>
                                    <S.DSActionButtonText>Close</S.DSActionButtonText>
                                </S.DSActionButton>
                                <S.DSButtonSeparator />
                                <S.DSActionButton primary onPress={() => setIsEditMode(true)}>
                                    <S.DSActionButtonText primary>Edit</S.DSActionButtonText>
                                </S.DSActionButton>
                            </S.DSButtonArea>
                        )}
                    </S.DSContainer>
                </Pressable>
                {/* DateTimePicker 모달들 */}
                {showDatePicker && (
                    <DateTimePicker
                        value={formData.startTime}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                    />
                )}
                {showStartTimePicker && (
                    <DateTimePicker
                        value={formData.startTime}
                        mode="time"
                        display="spinner"
                        onChange={onStartTimeChange}
                    />
                )}
                {showEndTimePicker && (
                    <DateTimePicker
                        value={formData.endTime}
                        mode="time"
                        display="spinner"
                        onChange={onEndTimeChange}
                        minimumDate={formData.startTime} // 시작 시간보다 이전은 선택 불가
                    />
                )}
            </S.ModalOverlay>
        </Modal>
    );
};

export default DetailSchedule;