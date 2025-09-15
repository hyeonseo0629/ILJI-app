import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Pressable, View, Switch, Platform } from 'react-native';
import { format, set } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import * as DS from '../style/DetailScheduleStyled';
import { Schedule } from '@/components/calendar/scheduleTypes';
import { Tag } from '@/components/tag/TagTypes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSchedule } from '@/src/context/ScheduleContext';
import ConfirmModal from '@/components/confirmModal/ConfirmModal'; // [추가] 커스텀 확인 모달 import

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
            <DS.ModalOverlay onPress={onClose}>
                {/* Pressable로 감싸서 모달 내부 클릭 시 닫히는 것을 방지 */}
                <Pressable>
                    <DS.Container>
                        {isEditMode ? (
                            <DS.HeaderInput value={formData.title} onChangeText={(text) => handleInputChange('title', text)} />
                        ) : (
                            <DS.Header>{formData.title}</DS.Header>
                        )}
                        <DS.ContentWrap>
                            {isEditMode ? (
                                <>
                                    <DS.AllDayRow>
                                        <DS.Label>All Day</DS.Label>
                                        <Switch
                                            trackColor={{ false: "#767577", true: "mediumslateblue" }}
                                            thumbColor={"#f4f3f4"}
                                            onValueChange={(value) => handleInputChange('isAllDay', value)}
                                            value={formData.isAllDay}
                                        />
                                    </DS.AllDayRow>
                                    <DS.DateTimePickerButton onPress={() => setShowDatePicker(true)}>
                                        <DS.DateTimePickerButtonText>{format(formData.startTime, 'yyyy. MM. dd')}</DS.DateTimePickerButtonText>
                                    </DS.DateTimePickerButton>
                                    {!formData.isAllDay && (
                                        <DS.DateTimePickersRow style={{ marginTop: 15 }}>
                                            <DS.DateTimePickerButton onPress={() => setShowStartTimePicker(true)} style={{ marginRight: 10 }}>
                                                <DS.DateTimePickerButtonText>{format(formData.startTime, 'HH:mm')}</DS.DateTimePickerButtonText>
                                            </DS.DateTimePickerButton>
                                            <DS.DateTimePickerButton onPress={() => setShowEndTimePicker(true)}>
                                                <DS.DateTimePickerButtonText>{format(formData.endTime, 'HH:mm')}</DS.DateTimePickerButtonText>
                                            </DS.DateTimePickerButton>
                                        </DS.DateTimePickersRow>
                                    )}
                                </>
                            ) : (
                                <DS.DateTimeInfoRow>
                                    <DS.DateTimeInfo>
                                        <DS.CalendarIcon name="event" size={40} color="#888" />
                                        <DS.DateTimeTexts>
                                            <DS.DateText>{format(formData.startTime, 'yyyy. MM. dd')}</DS.DateText>
                                            {formData.isAllDay ? (
                                                <DS.TimeText>ALL DAY</DS.TimeText>
                                            ) : (
                                                <DS.TimeText>
                                                    {format(formData.startTime, 'HH:mm')} ~ {format(formData.endTime, 'HH:mm')}
                                                </DS.TimeText>
                                            )}
                                        </DS.DateTimeTexts>
                                    </DS.DateTimeInfo>
                                    <DS.DeleteButton onPress={handleDeletePress}>
                                        <Feather name="trash-2" size={30} color="#D25A5A" />
                                    </DS.DeleteButton>
                                </DS.DateTimeInfoRow>
                            )}

                            {isEditMode ? (
                                <>
                                    <DS.Label>Tag</DS.Label>
                                    <DS.TagSelectorContainer>
                                        {tags.map(tag => (
                                            <DS.TagSelectorItem
                                                key={tag.id}
                                                color={tag.color}
                                                selected={formData.tagId === tag.id}
                                                onPress={() => handleInputChange('tagId', formData.tagId === tag.id ? 0 : tag.id)}
                                            >
                                                <DS.TagSelectorText selected={formData.tagId === tag.id}>
                                                    #{tag.label}
                                                </DS.TagSelectorText>
                                            </DS.TagSelectorItem>
                                        ))}
                                    </DS.TagSelectorContainer>
                                </>
                            ) : selectedTag && (
                                <DS.SelectedTagWrap>
                                    <DS.SelectedTag color={selectedTag.color || 'gray'}>
                                        <DS.SelectedTagText>#{selectedTag.label}</DS.SelectedTagText>
                                    </DS.SelectedTag>
                                </DS.SelectedTagWrap>
                            )}

                            <DS.Label>Memo</DS.Label>
                            {isEditMode ? (
                                <DS.ValueInput
                                    value={formData.description || ''}
                                    onChangeText={(text) => handleInputChange('description', text)}
                                    multiline
                                />
                            ) : (
                                <DS.ValueText>{formData.description || '메모 없음'}</DS.ValueText>
                            )}

                            <DS.Label>Location</DS.Label>
                            {isEditMode ? (
                                <DS.ValueInput
                                    value={formData.location || ''}
                                    onChangeText={(text) => handleInputChange('location', text)}
                                />
                            ) : (
                                <DS.ValueText>{formData.location || '장소 없음'}</DS.ValueText>
                            )}

                        </DS.ContentWrap>
                        {isEditMode ? (
                            <DS.ButtonArea>
                                <DS.ActionButton onPress={() => setIsEditMode(false)}>
                                    <DS.ActionButtonText>Cancel</DS.ActionButtonText>
                                </DS.ActionButton>
                                <DS.ButtonSeparator />
                                <DS.ActionButton primary onPress={handleUpdatePress}>
                                    <DS.ActionButtonText primary>Save</DS.ActionButtonText>
                                </DS.ActionButton>
                            </DS.ButtonArea>
                        ) : (
                            <DS.ButtonArea>
                                <DS.ActionButton onPress={onClose}>
                                    <DS.ActionButtonText>Close</DS.ActionButtonText>
                                </DS.ActionButton>
                                <DS.ButtonSeparator />
                                <DS.ActionButton primary onPress={() => setIsEditMode(true)}>
                                    <DS.ActionButtonText primary>Edit</DS.ActionButtonText>
                                </DS.ActionButton>
                            </DS.ButtonArea>
                        )}
                    </DS.Container>
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
            </DS.ModalOverlay>
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

export default DetailSchedule