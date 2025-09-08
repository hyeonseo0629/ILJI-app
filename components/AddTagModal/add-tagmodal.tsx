import React, { useState } from 'react';
import { Modal, Alert } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import * as S from './AddTagModalStyled';

interface CreateTagModalProps {
    visible: boolean;
    onClose: () => void;
    // onSave는 태그 이름과 색상을 받아 비동기 작업을 처리합니다.
    onSave: (name: string, color: string) => Promise<void>;
}

const CreateTagModal: React.FC<CreateTagModalProps> = ({ visible, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#FF6B6B'); // 기본 색상
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('오류', '태그 이름을 입력해주세요.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(name.trim(), selectedColor);
            // 성공적으로 저장되면, 다음 사용을 위해 상태를 초기화합니다.
            setName('');
            setSelectedColor('#FF6B6B');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        // 모달이 닫힐 때도 상태를 초기화합니다.
        setName('');
        setSelectedColor('#FF6B6B');
        onClose();
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <S.ModalOverlay>
                <S.ModalContainer>
                    <S.ModalHeader>새로운 태그 만들기</S.ModalHeader>

                    <S.InputLabel>태그 이름</S.InputLabel>
                    <S.StyledInput
                        value={name}
                        onChangeText={setName}
                        placeholder="예: 업무, 운동, 스터디"
                    />

                    <S.ColorPickerHeader>
                        <S.InputLabel>색상 선택</S.InputLabel>
                        <S.ColorPreview color={selectedColor} />
                    </S.ColorPickerHeader>
                    <S.ColorPickerWrapper>
                        <ColorPicker
                            color={selectedColor}
                            onColorChangeComplete={setSelectedColor}
                        />
                    </S.ColorPickerWrapper>

                    <S.ButtonContainer>
                        <S.ActionButton onPress={handleClose}>
                            <S.ButtonText>취소</S.ButtonText>
                        </S.ActionButton>
                        <S.ActionButton primary onPress={handleSave} disabled={isSaving}>
                            <S.ButtonText primary>{isSaving ? '저장 중...' : '저장'}</S.ButtonText>
                        </S.ActionButton>
                    </S.ButtonContainer>
                </S.ModalContainer>
            </S.ModalOverlay>
        </Modal>
    );
};

export default CreateTagModal;