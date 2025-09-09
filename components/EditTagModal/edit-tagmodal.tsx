import React, { useState, useEffect } from 'react';
import { Modal, Alert, ListRenderItem } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { AntDesign } from '@expo/vector-icons';
import * as S from './EditTagModalStyled';
import { Tag } from '@/components/ToDo/types';
import { useSchedule } from '@/src/context/ScheduleContext';

interface EditTagModalProps {
    visible: boolean;
    onClose: () => void;
}

const EditTagModal: React.FC<EditTagModalProps> = ({ visible, onClose }) => {
    const { tags, updateTag, deleteTag } = useSchedule();

    // 'list' 또는 'edit' 모드를 결정합니다. null이면 목록, Tag 객체면 편집 폼.
    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);

    // 편집 폼의 상태
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('#FF6B6B');
    const [isSaving, setIsSaving] = useState(false);

    // 편집할 태그가 선택되면, 폼의 상태를 해당 태그의 정보로 채웁니다.
    useEffect(() => {
        if (tagToEdit) {
            setEditName(tagToEdit.label);
            setEditColor(tagToEdit.color || '#FF6B6B');
        }
    }, [tagToEdit]);

    const handleDelete = (tag: Tag) => {
        Alert.alert(
            "태그 삭제",
            `'${tag.label}' 태그를 정말 삭제하시겠습니까? 이 태그가 적용된 모든 일정이 '태그 없음'으로 변경됩니다.`,
            [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    onPress: async () => {
                        try {
                            await deleteTag(tag.id);
                        } catch (error) {
                            Alert.alert("삭제 실패", "태그를 삭제하는 중 오류가 발생했습니다.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const handleSaveEdit = async () => {
        if (!tagToEdit) return;
        if (!editName.trim()) {
            Alert.alert('오류', '태그 이름을 입력해주세요.');
            return;
        }
        setIsSaving(true);
        try {
            await updateTag({ ...tagToEdit, label: editName.trim(), color: editColor });
            setTagToEdit(null); // 저장 후 목록 보기로 돌아갑니다.
        } finally {
            setIsSaving(false);
        }
    };

    // 모달이 닫힐 때 내부 상태를 초기화합니다.
    const handleCloseModal = () => {
        setTagToEdit(null);
        onClose();
    };

    const renderTagItem: ListRenderItem<Tag> = ({ item }) => (
        <S.TagItem onPress={() => setTagToEdit(item)}>
            <S.TagInfo>
                <S.ColorPreview color={item.color || 'gray'} />
                <S.TagLabel>{item.label}</S.TagLabel>
            </S.TagInfo>
            <S.DeleteButton onPress={(e) => { e.stopPropagation(); handleDelete(item); }}>
                <AntDesign name="delete" size={20} color="#FF6B6B" />
            </S.DeleteButton>
        </S.TagItem>
    );

    // 태그 목록을 렌더링하는 뷰
    const renderListView = () => (
        <>
            <S.ModalHeader>Tag Edit</S.ModalHeader>
            <S.TagList
                data={tags.filter(tag => tag.id !== 0)} // '태그 없음'은 편집/삭제 불가
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTagItem}
            />
            <S.CloseButton onPress={handleCloseModal}>
                <S.CloseButtonText>close</S.CloseButtonText>
            </S.CloseButton>
        </>
    );

    // 특정 태그를 편집하는 폼 뷰
    const renderEditForm = () => (
        <>
            <S.ModalHeader>Tag Edit</S.ModalHeader>
            <S.InputLabel>Tag Name</S.InputLabel>
            <S.StyledInput
                value={editName}
                onChangeText={setEditName}
                placeholder="예: work, exercise, study"
            />
            <S.ColorPickerHeader>
                <S.InputLabel>Tag Color</S.InputLabel>
                <S.ColorPreview color={editColor} />
            </S.ColorPickerHeader>
            <S.ColorPickerWrapper>
                <ColorPicker
                    color={editColor}
                    onColorChangeComplete={setEditColor}
                />
            </S.ColorPickerWrapper>
            <S.ButtonContainer>
                <S.ActionButton onPress={() => setTagToEdit(null)}>
                    <S.ButtonText>Cancel</S.ButtonText>
                </S.ActionButton>
                <S.ActionButton primary onPress={handleSaveEdit} disabled={isSaving}>
                    <S.ButtonText primary>{isSaving ? 'Save...' : 'Edit'}</S.ButtonText>
                </S.ActionButton>
            </S.ButtonContainer>
        </>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleCloseModal}
        >
            <S.ModalOverlay>
                <S.ModalContainer>
                    {tagToEdit ? renderEditForm() : renderListView()}
                </S.ModalContainer>
            </S.ModalOverlay>
        </Modal>
    );
};

export default EditTagModal;