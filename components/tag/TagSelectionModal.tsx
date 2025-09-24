import React from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import * as S from '../style/TagSelectionModalStyled';
import { Tag } from '../tag/TagTypes';

// Tag 타입 정의 (프로젝트의 다른 곳에 정의되어 있다면 import 해서 사용)

interface TagSelectionModalProps {
  visible: boolean;
  tags: Tag[];
  onClose: () => void;
  onSelect: (tag: Tag) => void;
}

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({ visible, tags, onClose, onSelect }) => {
  const renderItem = ({ item }: { item: Tag }) => (
    <S.TagItem onPress={() => onSelect(item)}>
      <S.TagName>{item.label}</S.TagName>
    </S.TagItem>
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <S.ModalBackdrop onPress={onClose} activeOpacity={1}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <S.ModalContainer>
            <S.ModalTitle>태그 선택</S.ModalTitle>
            <FlatList
              data={tags}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              style={{ width: '100%' }}
            />
          </S.ModalContainer>
        </Pressable>
      </S.ModalBackdrop>
    </Modal>
  );
};

export default TagSelectionModal;
