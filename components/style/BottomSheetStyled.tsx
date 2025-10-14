import styled from "styled-components/native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

export const Container = styled.View<StyledProps>`
    background-color: ${props => props.$colors?.background || '#fff'};
    width: 99%;
    flex: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: 3px solid ${props => props.$colors?.primary || 'lavender'};
`

// ------ //
// Header //
// ------ //

export const Header = styled.View<StyledProps>`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.$colors?.background || '#fff'};
    border-radius: 10px;
`

export const HeaderLeft = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 20px; /* 아이콘 좌측 여백 추가 */
`

export const TagEditBTN = styled.TouchableOpacity`
    padding: 10px;
`

export const HeaderRight = styled.View`
    padding: 5px;
    flex-direction: row;
    align-items: center; /* 아이콘과 텍스트의 수직 정렬을 맞춥니다. */
`

export const TodayText = styled.Text<StyledProps>`
    padding: 10px 0;
    font-size: 15px;
    color: ${props => props.$colors?.text || '#000'};
`

export const ScheduleAddButton = styled(AntDesign).attrs({})<StyledProps>`
    margin-left: 10px;
    padding: 10px 0; /* 터치 영역 확보 및 수직 정렬 */
    color: ${props => props.$colors?.primary || '#9970FF'};
`

// ------- //
// Content //
// ------- //

export const ContentWrap = styled.View`
    position: relative;
    padding: 20px;
    width: 100%;
`

// New component for the vertical bar
export const VerticalBar = styled.View<StyledProps & { color: string }>`
    width: 4px;
    height: 100%;
    background-color: ${props => props.color || props.$colors?.border || 'gray'};
    margin-right: 12px; // A bit more space
    border-radius: 2px;
`;

// Wrapper for the list of schedules
export const ScheduleListWrap = styled.View`
    /* No specific styles needed for now */
`;

// A single schedule item container
export const ScheduleWrap = styled.View<StyledProps>`
    flex-direction: row;
    align-items: center; // Vertically align bar and text
    margin: 8px 0;
    padding: 12px;
`;

// Wrapper for the text content (title and date/time)
export const ScheduleTextWrap = styled.View`
    flex: 1;
    flex-direction: column;
`;

// Schedule Title
export const ScheduleTitle = styled.Text<StyledProps>`
    font-size: 16px;
    font-weight: 600; // Semi-bold
    color: ${props => props.$colors?.text || '#333'};
    margin-bottom: 4px;
`;

// Schedule Date and Time
export const ScheduleDateTime = styled.Text<StyledProps>`
    font-size: 13px;
    color: ${props => props.$colors?.text || '#8e8e93'};
    opacity: 0.8; /* Make it slightly less prominent than the title */
`;