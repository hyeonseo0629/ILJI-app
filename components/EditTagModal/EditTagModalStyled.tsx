import styled from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import { Tag } from '@/components/ToDo/types';

export const ModalOverlay = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View`
    width: 90%;
    max-height: 80%;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
`;

export const ModalHeader = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
`;

export const TagList = styled(
    FlatList as new (props: FlatListProps<Tag>) => FlatList<Tag>
)``;

export const TagItem = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
`;

export const TagInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const TagLabel = styled.Text`
    font-size: 16px;
    margin-left: 15px;
`;

export const DeleteButton = styled.TouchableOpacity`
    margin-left: 15px;
    padding: 5px;
`;

export const CloseButton = styled.TouchableOpacity`
    background-color: #f0f0f0;
    padding: 12px 20px;
    border-radius: 5px;
    align-self: center;
    margin-top: 20px;
`;

export const CloseButtonText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;

export const InputLabel = styled.Text`
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
`;

export const StyledInput = styled.TextInput`
    border-width: 1px;
    border-color: #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 20px;
`;

export const ColorPickerHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const ColorPreview = styled.View<{ color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${(props) => props.color};
    border-width: 1px;
    border-color: #ddd;
`;

export const ColorPickerWrapper = styled.View`
    height: 300px;
    margin-bottom: 20px;
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const ActionButton = styled.TouchableOpacity<{ primary?: boolean }>`
    flex: 1;
    padding: 12px;
    border-radius: 5px;
    background-color: ${(props) => (props.primary ? 'mediumslateblue' : '#f0f0f0')};
    align-items: center;
    margin: 0 5px;
`;

export const ButtonText = styled.Text<{ primary?: boolean }>`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => (props.primary ? 'white' : '#333')};
`;