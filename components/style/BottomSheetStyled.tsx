import styled from "styled-components/native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

export const Container = styled.View<StyledProps>`
    background-color: ${props => props.$colors?.card || '#ffffff'};
    width: 100%;
    height: 100%;
    padding: 10px;
`

// ------ //
// Header //
// ------ //

export const Header = styled.View<StyledProps>`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${props => props.$colors?.card || '#ffffff'};
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
    color: ${props => props.$colors?.primary || 'mediumslateblue'};
`

// ------- //
// Content //
// ------- //

export const ContentWrap = styled.View`
    position: relative;
    padding: 20px;
    width: 100%;
`

export const ScheduleListWrap = styled.View`

`

export const ScheduleWrap = styled.View<StyledProps>`
    border-color: ${props => props.$colors?.border || '#555'};
    border-bottom-width: 1px;
    border-top-width: 1px;
    flex-direction: row;
    margin: 10px 0;
    padding: 10px;
    justify-content: space-between;
`

export const ScheduleState = styled.Text<StyledProps>`
    position: absolute;
    font-size: 18px;
    top: -16px;
    background-color: ${props => props.$colors?.card || '#ffffff'};
    color: ${props => props.$colors?.text || '#000'};
    text-align: center;
    padding: 0 5px 0 0;
`

export const ScheduleCheckBox = styled(MaterialIcons).attrs<StyledProps>(props => ({
    size: 28,
    color: props.$colors?.primary || 'mediumslateblue',
}))<StyledProps>`
`

interface TextProps extends StyledProps {
    $isChecked?: boolean;
}

export const ScheduleTextsWrap = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const ScheduleLeftWrap = styled.View`
    flex-direction: row;
`

export const ScheduleTextWrap = styled.View`
    margin-left: 10px;
`

export const ScheduleDayWrap = styled.View`
flex-direction: row;
`

export const ScheduleDate = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? (props.$colors?.border || '#ccc') : (props.$colors?.text || '#8e8e93'))};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleTime = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? (props.$colors?.border || '#ccc') : (props.$colors?.text || '#8e8e93'))};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleTitle = styled.Text<TextProps>`
    font-size: 25px;
    font-weight: bold;
    padding: 5px 10px 0;
    color: ${(props) => (props.$isChecked ? (props.$colors?.border || '#aaa') : (props.$colors?.text || '#333'))};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleIcon = styled.Text<TextProps>`
    font-size: 50px;
    opacity: ${(props) => (props.$isChecked ? 0.4 : 1)};
`