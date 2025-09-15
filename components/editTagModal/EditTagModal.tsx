import React, { useState, useEffect } from 'react';
import { Modal, Alert, ListRenderItem } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { AntDesign } from '@expo/vector-icons';
import * as S from './EditTagModalStyled';
import { Tag } from '@/components/tag/TagTypes';
import { useSchedule } from '@/src/context/ScheduleContext';
import ConfirmModal from '@/components/confirmModal/ConfirmModal'; // [추가] 커스텀 확인 모달 import

interface EditTagModalProps {
    visible: boolean;
    onClose: () => void;
}

const EditTagModal: React.FC<EditTagModalProps> = ({ visible, onClose }) => {
    const { tags, updateTag, deleteTag } = useSchedule();

    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('#FF6B6B');
    const [isSaving, setIsSaving] = useState(false);

    // [추가] 삭제 확인 모달 관련 상태
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    useEffect(() => {
        if (tagToEdit) {
            setEditName(tagToEdit.label);

            if (tagToEdit.color && tagToEdit.color.trim() !== '') {
                setEditColor(tagToEdit.color);
            } else {
                setEditColor('#FF6B6B'); // Default color if existing color is invalid/empty
            }
        }
    }, [tagToEdit]);

    // [수정] 삭제 버튼 클릭 시, 어떤 태그를 삭제할지 상태에 저장하고 확인 모달을 엽니다.
    const handleDelete = (tag: Tag) => {
        setTagToDelete(tag);
        setConfirmModalVisible(true);
    };

    // [추가] 확인 모달에서 '확인'을 눌렀을 때 실행될 실제 삭제 처리 함수
    const handleConfirmDelete = async () => {
        if (tagToDelete) {
            try {
                await deleteTag(tagToDelete.id);
            } catch (error) {
                Alert.alert("삭제 실패", "태그를 삭제하는 중 오류가 발생했습니다.");
            } finally {
                setConfirmModalVisible(false);
                setTagToDelete(null);
            }
        }
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
            setTagToEdit(null);
        } finally {
            setIsSaving(false);
        }
    };

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

    const renderListView = () => (
        <>
            <S.ModalHeader>Tag Edit</S.ModalHeader>
            <S.TagList
                data={tags.filter(tag => tag.id !== 0)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTagItem}
            />
            <S.CloseButton onPress={handleCloseModal}>
                <S.CloseButtonText>close</S.CloseButtonText>
            </S.CloseButton>
        </>
    );

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
                    key={tagToEdit?.id}
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
            {/* [추가] 커스텀 확인 모달을 렌더링합니다. */}
            <ConfirmModal
                visible={isConfirmModalVisible}
                title="Delete Tag"
                message={tagToDelete ? `'${tagToDelete.label}' 태그를 정말 삭제하시겠습니까? 이 태그가 적용된 모든 일정이 'No Tag'으로 변경됩니다.` : ''}
                onClose={() => {
                    setConfirmModalVisible(false);
                    setTagToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </Modal>
    );
};

export default EditTagModal;