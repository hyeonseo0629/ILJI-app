import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
    width: 90%;
    background-color: white;
    border-radius: 15px;
    padding: 25px;
    align-items: stretch;
`;

export const ModalHeader = styled.Text`
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
`;

export const InputLabel = styled.Text`
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
    margin-top: 10px;
`;

export const StyledInput = styled.TextInput`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    margin-bottom: 15px;
`;

export const ColorPickerHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const ColorPreview = styled.View<{ color: string }>`
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background-color: ${props => props.color};
    border: 1px solid #ddd;
`;

export const ColorPickerWrapper = styled.View`
    height: 250px; /* 컬러 피커의 높이를 지정해줍니다. */
    margin-bottom: 25px;
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;

export const ActionButton = styled.TouchableOpacity<{ primary?: boolean }>`
    flex: 1;
    padding: 15px;
    align-items: center;
    border-radius: 8px;
    background-color: ${props => (props.primary ? 'mediumslateblue' : '#f0f0f0')};
    margin: 0 5px;
`;

export const ButtonText = styled.Text<{ primary?: boolean }>`
    color: ${props => (props.primary ? 'white' : '#333')};
    font-size: 16px;
    font-weight: bold;
`;