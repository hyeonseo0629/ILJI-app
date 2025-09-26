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
import { useTheme } from '@react-navigation/native';

interface DetailScheduleProps {
    schedule: Schedule | null;
    visible: boolean;
    onClose: () => void;
}

const DetailSchedule: React.FC<DetailScheduleProps> = ({ schedule, visible, onClose }) => {
    const { colors } = useTheme();
    const [isEditMode, setIsEditMode] = useState(false);
    const { updateSchedule, deleteSchedule, tags } = useSchedule();
    const [formData, setFormData] = useState<Schedule | null>(schedule);
    // Date & Time Picker 상태
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');
    // [추가] 삭제 확인 모달의 표시 상태를 관리합니다.
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

    const selectedTag = useMemo(() => {
        if (!formData) return null;
        return tags.find(tag => tag.id === formData.tagId);
    }, [formData, tags]);

    const sortedTags = useMemo(() => {
        if (!tags) return [];
        const scheduleTag = tags.find(tag => tag.label === '일정');
        const otherTags = tags.filter(tag => tag.label !== '일정');
        if (scheduleTag) {
            return [scheduleTag, ...otherTags];
        }
        return otherTags;
    }, [tags]);

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
            // ID가 문자열인 경우(반복 일정), 숫자 부분만 추출합니다.
            const idToDelete = typeof schedule.id === 'string' ? parseInt(schedule.id.split('-')[0], 10) : schedule.id;
            await deleteSchedule(idToDelete);
            setConfirmModalVisible(false); // 확인 모달 닫기
            onClose(); // 상세 정보 모달 닫기
        }
    };

    const handleUpdatePress = () => {
        if (formData) {
            // ID가 문자열인 경우(반복 일정), 숫자 부분만 추출하여 업데이트합니다.
            const updatedFormData = {
                ...formData,
                id: typeof formData.id === 'string' ? parseInt(formData.id.split('-')[0], 10) : formData.id
            };
            updateSchedule(updatedFormData);
            setIsEditMode(false);
        }
    };

    const handleInputChange = (field: keyof Schedule, value: any) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false); // 항상 피커를 닫도록 수정

        if (event.type === 'set' && selectedDate && formData) { // 날짜가 선택된 경우에만 상태 업데이트
            if (pickerTarget === 'start') {
                const newStartTime = set(formData.startTime, { year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() });

                // 시작 날짜가 변경되면, 종료 날짜도 동일하게 맞춰주되 시간은 유지합니다.
                const newEndTime = set(formData.endTime, {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth(),
                    date: selectedDate.getDate(),
                });

                // 만약 새로 계산된 종료 시간이 시작 시간보다 빠르다면,
                // 종료 시간을 시작 시간 1시간 뒤로 설정합니다.
                if (newEndTime < newStartTime) {
                    setFormData(prev => prev ? { ...prev, startTime: newStartTime, endTime: new Date(newStartTime.getTime() + 60 * 60 * 1000) } : null);
                } else {
                    setFormData(prev => prev ? { ...prev, startTime: newStartTime, endTime: newEndTime } : null);
                }
            } else { // pickerTarget === 'end'
                const newEndTime = set(formData.endTime, { year: selectedDate.getFullYear(), month: selectedDate.getMonth(), date: selectedDate.getDate() });
                // If the new end time is before the start time, don't allow it (or adjust start time). Let's just set it to the start time.
                if (newEndTime < formData.startTime) {
                    setFormData(prev => prev ? { ...prev, endTime: formData.startTime } : null);
                } else {
                    setFormData(prev => prev ? { ...prev, endTime: newEndTime } : null);
                }
            }
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
                                    <DS.Label>Start Date</DS.Label>
                                    <DS.DateTimePickerButton onPress={() => { setPickerTarget('start'); setShowDatePicker(true); }}>
                                        <DS.DateTimePickerButtonText>{format(formData.startTime, 'yyyy. MM. dd')}</DS.DateTimePickerButtonText>
                                    </DS.DateTimePickerButton>

                                    <DS.Label>End Date</DS.Label>
                                    <DS.DateTimePickerButton onPress={() => { setPickerTarget('end'); setShowDatePicker(true); }}>
                                        <DS.DateTimePickerButtonText>{format(formData.endTime, 'yyyy. MM. dd')}</DS.DateTimePickerButtonText>
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
                                        {sortedTags.map(tag => (
                                            <DS.TagSelectorItem
                                                key={tag.id}
                                                color={tag.color}
                                                selected={formData.tagId === tag.id}
                                                onPress={() => handleInputChange('tagId', tag.id)}
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
                                <DS.ActionButton onPress={() => { setIsEditMode(false); setFormData(schedule); }}>
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
                        value={pickerTarget === 'start' ? formData.startTime : formData.endTime}
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
                colors={colors}
            />
        </Modal>
    );
};

export default DetailSchedule