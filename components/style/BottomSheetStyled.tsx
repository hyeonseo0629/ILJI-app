import styled from "styled-components/native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export const Container = styled.View`
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    padding: 10px;
`

// ------ //
// Header //
// ------ //

export const Header = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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

export const TodayText = styled.Text`
    padding: 10px 0;
    font-size: 15px;
`

export const ScheduleAddButton = styled(AntDesign).attrs({})`
    margin-left: 10px;
    padding: 10px 0; /* 터치 영역 확보 및 수직 정렬 */
    color: mediumslateblue;
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
export const VerticalBar = styled.View<{ color: string }>`
    width: 4px;
    height: 100%;
    background-color: ${props => props.color || 'gray'};
    margin-right: 12px; // A bit more space
    border-radius: 2px;
`;

// Wrapper for the list of schedules
export const ScheduleListWrap = styled.View`
    /* No specific styles needed for now */
`;

// A single schedule item container
export const ScheduleWrap = styled.View`
    flex-direction: row;
    align-items: center; // Vertically align bar and text
    margin: 8px 0;
    padding: 12px;
    background-color: #f7f7f7; // A very light gray
    border-radius: 8px;
`;

// Wrapper for the text content (title and date/time)
export const ScheduleTextWrap = styled.View`
    flex: 1;
    flex-direction: column;
`;

// Schedule Title
export const ScheduleTitle = styled.Text`
    font-size: 16px;
    font-weight: 600; // Semi-bold
    color: #333;
    margin-bottom: 4px;
`;

// Schedule Date and Time
export const ScheduleDateTime = styled.Text`
    font-size: 13px;
    color: #8e8e93;
`;
