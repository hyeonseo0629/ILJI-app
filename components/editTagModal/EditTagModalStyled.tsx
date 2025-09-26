import styled from 'styled-components/native';
import { FlatList, FlatListProps } from 'react-native';
import { Tag } from '@/components/tag/TagTypes';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

export const ModalOverlay = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View<StyledProps>`
    width: 90%;
    max-height: 80%;
    background-color: ${props => props.$colors?.card || 'white'};
    border-radius: 10px;
    padding: 20px;
`;

export const ModalHeader = styled.Text<StyledProps>`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: ${props => props.$colors?.text || '#000'};
`;

export const TagList = styled(
    FlatList as new (props: FlatListProps<Tag>) => FlatList<Tag>
)``;

export const TagItem = styled.TouchableOpacity<StyledProps>`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.$colors?.border || '#eee'};
`;

export const TagInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const TagLabel = styled.Text<StyledProps>`
    font-size: 16px;
    margin-left: 15px;
    color: ${props => props.$colors?.text || '#000'};
`;

export const DeleteButton = styled.TouchableOpacity`
    margin-left: 15px;
    padding: 5px;
`;

export const CloseButton = styled.TouchableOpacity<StyledProps>`
    background-color: ${props => props.$colors?.border || '#f0f0f0'};
    padding: 12px 20px;
    border-radius: 5px;
    align-self: center;
    margin-top: 20px;
`;

export const CloseButtonText = styled.Text<StyledProps>`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.$colors?.text || '#333'};
`;

export const InputLabel = styled.Text<StyledProps>`
    font-size: 16px;
    margin-bottom: 8px;
    color: ${props => props.$colors?.text || '#333'};
`;

export const StyledInput = styled.TextInput.attrs<StyledProps>(props => ({
    placeholderTextColor: props.$colors?.text,
}))<StyledProps>`
    border-width: 1px;
    border-color: ${props => props.$colors?.border || '#ccc'};
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 20px;
    color: ${props => props.$colors?.text || '#000'};
    background-color: ${props => props.$colors?.background || '#fff'};
`;

export const ColorPickerHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const ColorPreview = styled.View<StyledProps & { color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${(props) => props.color};
    border-width: 1px;
    border-color: ${props => props.$colors?.border || '#ddd'};
`;

export const ColorPickerWrapper = styled.View`
    height: 300px;
    margin-bottom: 20px;
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const ActionButton = styled.TouchableOpacity<StyledProps & { primary?: boolean }>`
    flex: 1;
    padding: 12px;
    border-radius: 5px;
    background-color: ${(props) => (props.primary ? (props.$colors?.primary || '#9970FF') : (props.$colors?.card || '#f0f0f0'))};
    align-items: center;
    margin: 0 5px;
`;

export const ButtonText = styled.Text<StyledProps & { primary?: boolean }>`
    font-size: 16px;
    font-weight: bold;
    color: ${(props) => (props.primary ? 'white' : (props.$colors?.text || '#333'))};
`;
