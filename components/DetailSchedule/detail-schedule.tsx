import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Pressable, View, Switch, Platform } from 'react-native';
import { format, set } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import * as S from './DetailScheduleStyle';
import { Schedule } from '@/components/calendar/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSchedule } from '@/src/context/ScheduleContext';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'; // [추가] 커스텀 확인 모달 import

interface DetailScheduleProps {
    schedule: Schedule | null;
    visible: boolean;
    onClose: () => void;
}

const DetailSchedule: React.FC<DetailScheduleProps> = ({ schedule, visible, onClose }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { updateSchedule, deleteSchedule, tags } = useSchedule();
    const [formData, setFormData] = useState<Schedule | null>(schedule);
    // Date & Time Picker 상태
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    // [추가] 삭제 확인 모달의 표시 상태를 관리합니다.
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

    const selectedTag = useMemo(() => {
        if (!formData) return null;
        return tags.find(tag => tag.id === formData.tagId);
    }, [formData, tags]);

    useEffect(() => {
        setFormData(schedule);
        if (!visible) {
            setIsEditMode(false);
        }
    }, [schedule, visible]);

    if (!schedule || !formData) {
        return null;
    }

    // [수정] 쓰레기통 아이콘 클릭 시, 커스텀 모달을 띄웁니다.
    const handleDeletePress = () => {
        setConfirmModalVisible(true);
    };

    // [추가] 커스텀 모달에서 '확인'을 눌렀을 때 실행될 함수입니다.
    const handleConfirmDelete = async () => {
        if (schedule) {
            await deleteSchedule(schedule.id);
            setConfirmModalVisible(false); // 확인 모달 닫기
            onClose(); // 상세 정보 모달 닫기
        }
    };

    const handleUpdatePress = () => {
        if (formData) {
            updateSchedule(formData);
            setIsEditMode(false);
        }
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
                <Pressable>
                    <S.DSContainer>
                        {/* ... 기존 렌더링 코드 ... */}
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

                            {isEditMode ? (
                                <>
                                    <S.DSLabel>Tag</S.DSLabel>
                                    <S.TagSelectorContainer>
                                        {tags.map(tag => (
                                            <S.TagSelectorItem
                                                key={tag.id}
                                                color={tag.color}
                                                selected={formData.tagId === tag.id}
                                                onPress={() => handleInputChange('tagId', formData.tagId === tag.id ? 0 : tag.id)}
                                            >
                                                <S.TagSelectorText selected={formData.tagId === tag.id}>
                                                    #{tag.label}
                                                </S.TagSelectorText>
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
                {/* ... DateTimePicker 모달들 ... */}
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
            {/* [추가] 커스텀 확인 모달을 렌더링합니다. */}
            <ConfirmModal
                visible={isConfirmModalVisible}
                title="Delete Schedule"
                message={`'${schedule.title}' 일정을 정말 삭제하시겠습니까?`}
                onClose={() => setConfirmModalVisible(false)}
                onConfirm={handleConfirmDelete}
            />
        </Modal>
    );
};

export default DetailSchedule;
