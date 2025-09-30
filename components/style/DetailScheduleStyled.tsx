import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

export const ModalOverlay = styled.Pressable`
    flex: 1;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    padding-top: 60px;
    padding-left: 20px;
`;

export const Container = styled.View<StyledProps>`
    width: 95%;
    background-color: ${props => props.$colors?.background || '#ffffff'};
    border-radius: 20px;
    border-width: 6px;
    border-color: ${props => props.$colors?.primary || 'lavender'};
    max-height: 93%;
    elevation: 10;
`;

export const Header = styled.Text<StyledProps>`
    margin: 0 30px;
    font-size: 28px;
    margin-top: 25px;
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom-width: 5px;
    border-bottom-color: ${props => props.$colors?.primary || 'lavender'};
    color: ${props => props.$colors?.text || 'black'};
    margin-bottom: 25px;
`;

export const HeaderInput = styled.TextInput<StyledProps>`
    margin: 0 30px;
    font-size: 28px;
    margin-top: 25px;
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom-width: 5px;
    border-bottom-color: ${props => props.$colors?.primary || 'lavender'};
    color: ${props => props.$colors?.text || 'black'};
    margin-bottom: 25px;
`;

export const ContentWrap = styled.ScrollView.attrs<StyledProps>(props => ({
    persistentScrollbar: true,
    scrollIndicatorInsets: { right: 15 },
    indicatorStyle: props.$colors?.background === '#000000' ? 'white' : 'black',
    contentContainerStyle: {
        paddingHorizontal: 30,
        paddingBottom: 25,
    }
}))<StyledProps>``;

export const DateTimeInfoRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
`;

export const DateTimeInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const CalendarIcon = styled(MaterialIcons).attrs({})<StyledProps>`
    margin-right: 12px;
    color: ${props => props.$colors?.primary || '#9970FF'};
`;

export const DateTimeTexts = styled.View`
    flex: 1;
`;

export const DateText = styled.Text<StyledProps>`
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.$colors?.text || '#9393db'};
    opacity: 0.8;
`;

export const TimeText = styled.Text<StyledProps>`
    font-size: 22px;
    font-weight: 700;
    color: ${props => props.$colors?.primary || '#9970FF'};
    margin-top: 2px;
`;

export const Label = styled.Text<StyledProps>`
    font-size: 22px;
    font-weight: bold;
    color: ${props => props.$colors?.primary || '#9970FF'};
    margin-bottom: 8px;
`;

export const ValueText = styled.Text<StyledProps>`
    width: 100%;
    background-color: ${props => props.$colors?.card || '#f4f4fd'};
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 16px;
    color: ${props => props.$colors?.text || '#484389'};
    font-weight: 500;
    margin-bottom: 25px;
    line-height: 24px;
    overflow: hidden;
`;

export const ValueInput = styled.TextInput<StyledProps>`
    width: 100%;
    background-color: ${props => props.$colors?.card || '#f4f4fd'};
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 16px;
    color: ${props => props.$colors?.text || '#484389'};
    font-weight: 500;
    margin-bottom: 25px;
    line-height: 24px;
    border-width: 1px;
    border-color: ${props => props.$colors?.primary || '#9970FF'};
`;

export const AllDayRow = styled.View<StyledProps>`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-color: ${props => props.$colors?.border || '#eee'};
`;

export const DateTimePickersRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 25px;
`;

export const DateTimePickerButton = styled.TouchableOpacity<StyledProps>`
    background-color: ${props => props.$colors?.card || '#f4f4fd'};
    padding: 12px;
    border-radius: 10px;
    align-items: center;
    flex: 1;
`;

export const DateTimePickerButtonText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || '#484389'};
    font-size: 16px;
    font-weight: 600;
`;

export const TagSelectorContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
`;

export const TagSelectorItem = styled.TouchableOpacity<StyledProps & { selected: boolean; color?: string; }>`
    padding: 8px 16px;
    border-radius: 20px;
    border-width: 2px;
    border-color: ${({ color, $colors }) => color || $colors?.border || 'gray'};
    background-color: ${({ selected, color }) => selected ? color : 'transparent'};
`;

export const TagSelectorText = styled.Text<StyledProps & { selected: boolean }>`
    color: ${({ selected, $colors }) => selected ? ($colors?.card || 'white') : ($colors?.text || 'black')};
    font-weight: bold;
`;

export const DeleteButton = styled.TouchableOpacity`
    padding: 5px;
    margin-left: 10px;
`;

export const SelectedTagWrap = styled.View`
     flex-direction: row;
     flex-wrap: wrap;
 `;

export const SelectedTag = styled.View<{ color: string }>`
     flex-direction: row;
     align-items: center;
     background-color: ${(props) => props.color};
     border-radius: 16px;
     padding: 8px 16px;
     margin-bottom: 25px;
`;

export const SelectedTagText = styled.Text<StyledProps>`
     color: ${props => props.$colors?.card || '#ffffff'};
     font-weight: bold;
     font-size: 18px;
 `;

export const ButtonArea = styled.View<StyledProps>`
    flex-direction: row;
    background-color: ${props => props.$colors?.card || '#f9f9f9'};
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
    overflow: hidden;
`;

export const ActionButton = styled.TouchableOpacity<StyledProps & { primary?: boolean }>`
    flex: 1;
    padding: 18px;
    align-items: center;
    background-color: ${({ primary, $colors }) => primary ? ($colors?.primary || '#9970FF') : ($colors?.card || '#eef0f4')};
`;

export const ActionButtonText = styled.Text<StyledProps & { primary?: boolean }>`
    font-size: 22px;
    font-weight: bold;
    color: ${({ primary, $colors }) => primary ? ($colors?.card || 'white') : ($colors?.primary || '#9970FF')};
`;

export const ButtonSeparator = styled.View<StyledProps>`
    width: 1px;
    background-color: ${props => props.$colors?.border || 'lavender'};
`;
