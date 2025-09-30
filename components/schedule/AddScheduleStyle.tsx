import styled from 'styled-components/native';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

export const ASContainer = styled.ScrollView<StyledProps>`
    flex: 1;
    background-color: ${props => props.$colors?.background || '#ffffff'};
`;


export const ASHeader = styled.Text<StyledProps>`
    margin: 30px 30px 0;
    font-size: 35px;
    padding-bottom: 10px;
    width: 85%;
    border-bottom-width: 3px;
    border-bottom-color: ${props => props.$colors?.primary || 'lavender'};
    color: ${props => props.$colors?.primary || '#9970FF'};
`

export const ASContentWrap = styled.View`
    padding: 5px 50px 25px;
`;


export const ASLabel = styled.Text<StyledProps>`
    font-size: 25px;
    font-weight: bold;
    color: ${props => props.$colors?.primary || '#9970FF'};
    margin-top: 20px;
    margin-bottom: 10px;
`;

export const ASTagHeaderRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const ASAddButton = styled.TouchableOpacity<StyledProps>`
    padding: 5px; /* 터치 영역 확보 */
    justify-content: center;
    align-items: center;
`;

export const ASInput = styled.TextInput.attrs<StyledProps>(props => ({
    placeholderTextColor: props.$colors?.border,
}))<StyledProps>`
    width: 100%;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 16px;
    background-color: ${props => props.$colors?.card || 'lavender'};
    color: ${props => props.$colors?.text || '#9970FF'};
    margin-bottom: 20px;
`;

export const ASPickerWrap = styled.View<StyledProps>`
    width: 100%;
    border: 1px solid ${props => props.$colors?.border || '#e0e0e0'};
    border-radius: 8px;
    background-color: ${props => props.$colors?.card || 'lavender'};
    justify-content: center;
    margin-bottom: 20px;
`;

export const ASSwitchRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

export const ASDateTimeRow = styled.View`
    flex-direction: row;
    gap: 10px;
    margin-bottom: 20px; /* 버튼 대신 행 전체에 하단 여백을 주어 일관성을 높입니다. */
`;

export const ASDateTimeButton = styled.TouchableOpacity<StyledProps>`
    flex: 1; /* 버튼이 사용 가능한 공간을 모두 차지하도록 하여, 1개일 땐 100%, 2개일 땐 50%씩 나눠 갖게 합니다. */
    border-radius: 8px;
    padding: 10px;
    background-color: ${props => props.theme.dark ? '575757FF' : 'lavender'};
    align-items: center;
`;

export const ASDateTimeButtonText = styled.Text<StyledProps>`
    font-size: 16px;
    color: ${props => props.$colors?.text || "#9f9ff0"};
    font-weight: bold;
`;

export const ASSelectedTagWrap = styled.View`
    flex-direction: row;
    flex-wrap: wrap; /* 태그가 여러 개일 경우 줄바꿈을 허용합니다. */
    margin-top: 10px;
`;

export const ASSelectedTag = styled.View<StyledProps & { color: string }>`
    flex-direction: row;
    align-items: center;
    background-color: ${(props) => props.color || props.$colors?.card || 'gray'};
    border-radius: 30px;
    padding: 10px 25px;
    margin-bottom: 100px;
    margin-top: 20px;
`;

export const ASSelectedTagText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.text || '#ffffff'};
    font-weight: bold;
    font-size: 18px;
`;

export const ASButtonWrap = styled.View<StyledProps>`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    border: 2px solid ${props => props.$colors?.border || '#f0f0f0'};
    background-color: ${props => props.$colors?.background || '#ffffff'};
`

export const ASSaveButton = styled.TouchableOpacity<StyledProps>`
    width: 50%;
    background-color: ${props => props.$colors?.background || '#ffffff'};
    color: ${props => props.$colors?.primary || '#9970FF'};
    padding: 20px;
    align-items: center;
    border-right-width: 2px;
    border-right-color: ${props => props.$colors?.border || '#f0f0f0'};
`;

export const ASCancelButton = styled.TouchableOpacity<StyledProps>`
    width: 50%;
    background-color: ${props => props.$colors?.background || '#ffffff'};
    padding: 20px;
    align-items: center;
`

export const ASCancelButtonText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || '#9970FF'};
    font-size: 25px;
    font-weight: bold
`

export const ASSaveButtonText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || '#9970FF'};
    font-size: 25px;
    font-weight: bold;
`;

export const ModalOverlay = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContainer = styled.View<StyledProps>`
    width: 90%;
    background-color: ${props => props.$colors?.card || 'white'};
    border-radius: 15px;
    padding: 25px;
    align-items: stretch;
`;

export const ModalHeader = styled.Text<StyledProps>`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.$colors?.text || '#333'};
    margin-bottom: 20px;
    text-align: center;
`;

export const InputLabel = styled.Text<StyledProps>`
    font-size: 16px;
    color: ${props => props.$colors?.text || '#555'};
    margin-bottom: 8px;
    margin-top: 10px;
`;

export const StyledInput = styled.TextInput<StyledProps>`
    border: 1px solid ${props => props.$colors?.border || '#ddd'};
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    margin-bottom: 15px;
    background-color: ${props => props.$colors?.card || 'white'};
    color: ${props => props.$colors?.text || 'black'};
`;

export const ColorPalette = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 25px;
`;

export const ColorDot = styled.TouchableOpacity<StyledProps & { color: string; isSelected: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${props => props.color};
    margin: 5px;
    border-width: ${props => (props.isSelected ? '3px' : '0px')};
    border-color: ${props => props.$colors?.primary || '#9970FF'};
`;

export const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
`;

export const ActionButton = styled.TouchableOpacity<StyledProps & { primary?: boolean }>`
    flex: 1;
    padding: 15px;
    align-items: center;
    border-radius: 8px;
    background-color: ${props => (props.primary ? (props.$colors?.primary || '#9970FF') : (props.$colors?.card || '#f0f0f0'))};
    margin: 0 5px;
`;

export const ButtonText = styled.Text<StyledProps & { primary?: boolean }>`
    color: ${props => (props.primary ? (props.$colors?.text || 'white') : (props.$colors?.text || '#333'))};
    font-size: 16px;
    font-weight: bold;
`;