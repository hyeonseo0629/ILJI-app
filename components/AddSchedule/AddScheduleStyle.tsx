import styled from 'styled-components/native';

export const Container = styled.ScrollView`
    flex: 1;
    background-color: #ffffff;
`;

export const ContentWrap = styled.View`
    padding: 20px;
`;

export const Label = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-top: 20px;
    margin-bottom: 10px;
`;

export const Input = styled.TextInput`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 16px;
    background-color: #f9f9f9;
`;

export const PickerWrap = styled.View`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
    justify-content: center;
`;

export const SaveButton = styled.TouchableOpacity`
    background-color: mediumslateblue;
    padding: 15px;
    border-radius: 8px;
    align-items: center;
    margin-top: 40px;
`;

export const SaveButtonText = styled.Text`
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
`;