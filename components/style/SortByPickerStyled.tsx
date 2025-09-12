import styled from 'styled-components/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const PickerButton = styled.TouchableOpacity`
    height: 35px;
    padding: 0 2px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start; /* 아이콘과 텍스트를 왼쪽부터 정렬합니다. */
`;

export const PickerButtonText = styled.Text`
    font-size: 18px;
    color: #333333;
    font-weight: bold;
    padding: 3px;
`;

export const PickerAntDesign = styled(AntDesign).attrs({
})`
    color: #555;
    margin-right: 3px; /* 아이콘과 텍스트 사이의 간격 */
`;

export const PickerMaterialIcons = styled(MaterialIcons).attrs({
})`
`;

export const ModalBackdrop = styled.TouchableOpacity`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

export const OptionsContainer = styled.View`
    background-color: white;
    border-radius: 10px;
    width: 80%;
    max-height: 50%;
    overflow: hidden;
`;

export const OptionItem = styled.TouchableOpacity`
    padding: 15px 20px;
    border-bottom-width: 1px;
    border-bottom-color: #f0f0f0;
`;

export const OptionText = styled.Text`
    /* 바로 이 부분에서 드롭다운 목록의 글씨 크기를 자유롭게 조절할 수 있습니다. */
    font-size: 18px;
    color: #333;
    text-align: center;
`;