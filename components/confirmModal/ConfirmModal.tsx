import React from 'react';
import { Modal } from 'react-native';
import * as S from './ConfirmModalStyled';
import { ThemeColors } from "@/types/theme";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  colors: ThemeColors;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, title, message, onClose, onConfirm, colors }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <S.ModalBackdrop>
        <S.ModalContainer $colors={colors}>
          <S.ModalTitle $colors={colors}>{title}</S.ModalTitle>
          <S.ModalMessage $colors={colors}>{message}</S.ModalMessage>
          <S.ButtonContainer>
            <S.CancelButton onPress={onClose} $colors={colors}>
              <S.CancelButtonText $colors={colors}>취소</S.CancelButtonText>
            </S.CancelButton>
            <S.ConfirmButton onPress={onConfirm} $colors={colors}>
              <S.ButtonText $colors={colors}>확인</S.ButtonText>
            </S.ConfirmButton>
          </S.ButtonContainer>
        </S.ModalContainer>
      </S.ModalBackdrop>
    </Modal>
  );
};

export default ConfirmModal;
