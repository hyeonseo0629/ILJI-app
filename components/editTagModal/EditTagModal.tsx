import React, { useState, useEffect } from 'react';
import { Modal, Alert, ListRenderItem } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { AntDesign } from '@expo/vector-icons';
import * as S from './EditTagModalStyled';
import { Tag } from '@/components/tag/TagTypes';
import { useSchedule } from '@/src/context/ScheduleContext';
import ConfirmModal from '@/components/confirmModal/ConfirmModal';
import { ThemeColors } from "@/types/theme";

interface EditTagModalProps {
    visible: boolean;
    onClose: () => void;
    colors: ThemeColors;
}

const EditTagModal: React.FC<EditTagModalProps> = ({ visible, onClose, colors }) => {
    const { tags, updateTag, deleteTag } = useSchedule();

    const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('#FF6B6B');
    const [isSaving, setIsSaving] = useState(false);

    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    useEffect(() => {
        if (tagToEdit) {
            setEditName(tagToEdit.label);
            if (tagToEdit.color && tagToEdit.color.trim() !== '') {
                setEditColor(tagToEdit.color);
            } else {
                setEditColor('#FF6B6B');
            }
        }
    }, [tagToEdit]);

    const handleDelete = (tag: Tag) => {
        setTagToDelete(tag);
        setConfirmModalVisible(true);
    };

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
        <S.TagItem onPress={() => setTagToEdit(item)} $colors={colors}>
            <S.TagInfo>
                <S.ColorPreview color={item.color || 'gray'} />
                <S.TagLabel $colors={colors}>{item.label}</S.TagLabel>
            </S.TagInfo>
            <S.DeleteButton onPress={(e) => { e.stopPropagation(); handleDelete(item); }}>
                <AntDesign name="delete" size={20} color={colors.notification} />
            </S.DeleteButton>
        </S.TagItem>
    );

    const renderListView = () => (
        <>
            <S.ModalHeader $colors={colors}>Tag Edit</S.ModalHeader>
            <S.TagList
                data={tags.filter(tag => tag.id !== 0)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTagItem}
            />
            <S.CloseButton onPress={handleCloseModal} $colors={colors}>
                <S.CloseButtonText $colors={colors}>close</S.CloseButtonText>
            </S.CloseButton>
        </>
    );

    const renderEditForm = () => (
        <>
            <S.ModalHeader $colors={colors}>Tag Edit</S.ModalHeader>
            <S.InputLabel $colors={colors}>Tag Name</S.InputLabel>
            <S.StyledInput
                value={editName}
                onChangeText={setEditName}
                placeholder="예: work, exercise, study"
                $colors={colors}
                placeholderTextColor={colors.text}
            />
            <S.ColorPickerHeader>
                <S.InputLabel $colors={colors}>Tag Color</S.InputLabel>
                <S.ColorPreview color={editColor} $colors={colors} />
            </S.ColorPickerHeader>
            <S.ColorPickerWrapper>
                <ColorPicker
                    key={tagToEdit?.id}
                    color={editColor}
                    onColorChangeComplete={setEditColor}
                />
            </S.ColorPickerWrapper>
            <S.ButtonContainer>
                <S.ActionButton onPress={() => setTagToEdit(null)} $colors={colors}>
                    <S.ButtonText $colors={colors}>Cancel</S.ButtonText>
                </S.ActionButton>
                <S.ActionButton primary onPress={handleSaveEdit} disabled={isSaving} $colors={colors}>
                    <S.ButtonText primary $colors={colors}>{isSaving ? 'Save...' : 'Edit'}</S.ButtonText>
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
                <S.ModalContainer $colors={colors}>
                    {tagToEdit ? renderEditForm() : renderListView()}
                </S.ModalContainer>
            </S.ModalOverlay>
            <ConfirmModal
                visible={isConfirmModalVisible}
                title="Delete Tag"
                message={tagToDelete ? `'${tagToDelete.label}' 태그를 정말 삭제하시겠습니까? 이 태그가 적용된 모든 일정이 'No Tag'으로 변경됩니다.` : ''}
                onClose={() => {
                    setConfirmModalVisible(false);
                    setTagToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                colors={colors}
            />
        </Modal>
    );
};

export default EditTagModal;