import React from 'react';
import { Modal } from 'react-native';
import * as S from './ConfirmModalStyled';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, title, message, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <S.ModalBackdrop>
        <S.ModalContainer>
          <S.ModalTitle>{title}</S.ModalTitle>
          <S.ModalMessage>{message}</S.ModalMessage>
          <S.ButtonContainer>
            <S.CancelButton onPress={onClose}>
              <S.CancelButtonText>취소</S.CancelButtonText>
            </S.CancelButton>
            <S.ConfirmButton onPress={onConfirm}>
              <S.ButtonText>확인</S.ButtonText>
            </S.ConfirmButton>
          </S.ButtonContainer>
        </S.ModalContainer>
      </S.ModalBackdrop>
    </Modal>
  );
};

export default ConfirmModal;
