import styled from 'styled-components/native';

export const ModalBackdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2px;
  };
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TagList = styled.ScrollView`
  width: 100%;
`;

export const TagItem = styled.TouchableOpacity`
  padding: 15px;
  width: 100%;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const TagName = styled.Text`
  font-size: 16px;
`;
