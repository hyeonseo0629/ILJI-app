import styled from 'styled-components/native';

export const ModalBackdrop = styled.View`
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

export const ModalMessage = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin: 0 5px;
`;

export const CancelButton = styled(ModalButton)`
  background-color: #f0f0f0;
`;

export const ConfirmButton = styled(ModalButton)`
  background-color: mediumslateblue;
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  color: white;
`;

export const CancelButtonText = styled(ButtonText)`
  color: #333;
`;
