import styled from 'styled-components/native';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

// -------------- //
// Calendar Area  //
// -------------- //

export const CalendarContainer = styled.View<StyledProps>`
    flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
    background-color: ${props => props.$colors?.background || '#ffffff'};
    width: 100%;
    padding: 15px 10px;
`
// ------------------------ //
// Calendar Style Component //
// ------------------------ //

export const MonthContainer = styled.View<StyledProps>`
    flex: 1; /* 부모 컨테이너(CContainer)의 공간을 모두 차지하도록 설정 */
    background-color: ${props => props.$colors?.background || '#ffffff'};
    padding-vertical: 15px;
    width: 100%;
`

export const MonthLoadingContainer = styled.View`
    justify-content: center;
    align-items: center;
    height: 420px; // Give it a fixed height to avoid layout shifts
`

export const MonthHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-horizontal: 15px;
    padding: 0 18px;
`;

export const MonthText = styled.Text<StyledProps>`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.$colors?.text || '#333'};
    width: 35%;
`;

export const MonthDayNameText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})<StyledProps>`
    flex: 1;
    font-size: 12px;
    color: ${props => props.$colors?.text || '#8E8E93'};
    font-weight: 500;
    text-align: center;
`;

export const MonthWeek = styled.View<{ $isHeader?: boolean }>`
    flex-direction: row;
    ${(props) => props.$isHeader ?
            `height: 50px;` : `flex: 1;`
    }
`;

export const DayOfTheWeek = styled.View`
    flex-direction: row;
    height: 60px;
    margin-bottom: 20px; /* 요일과 날짜 사이의 간격 */
`

export const DayOfTheWeekText = styled.Text<StyledProps>`
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.$colors?.text || '#8E8E93'};
`

interface MonthDayContainerProps extends StyledProps {
    $isSelected?: boolean;
}

export const MonthDayContainer = styled.TouchableOpacity<MonthDayContainerProps>`
    flex: 1;
    flex-direction: column; /* 날짜와 제목을 세로로 쌓습니다. */
    align-items: center; /* 가로 중앙 정렬 */
    justify-content: flex-start; /* 세로 상단 정렬 */
    padding: 5px;
    background-color: ${(props) => (props.$isSelected ? (props.$colors?.primary || '#EFEFEF') : 'transparent')};
    border-radius: 8px;
`;

export const MonthEmptyDayContainer = styled.View`
    flex: 1;
    height: 10px;
`;

interface MonthDayTextProps extends StyledProps {
    $isNotInMonth?: boolean;
    $isToday?: boolean;
    $isSelected?: boolean;
}

export const MonthDayText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})<MonthDayTextProps>`
    font-size: 12px;
    text-align: center;
    color: ${(props) => {
        if (props.$isSelected) return props.$colors?.card || '#FFFFFF';
        if (props.$isNotInMonth) return props.$colors?.border || '#D1D1D6';
        return props.$colors?.text || '#333';
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MonthDayCircle = styled.View<StyledProps & { $isCurrentMonth?: boolean }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.$colors?.primary || '#9970FF'};
    border-radius: 15px; /* 완벽한 원을 위해 너비/높이의 절반 값 사용 */
    justify-content: center; /* 내부 텍스트를 세로 중앙에 정렬 */
    align-items: center; /* 내부 텍스트를 가로 중앙에 정렬 */
    opacity: ${({$isCurrentMonth = true}) => $isCurrentMonth ? 1 : 0.3};
`;

interface ScheduleTitleTextProps {
    color?: string;
}

export const DayNumberWrapper = styled.View`
    height: 25px;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

export const EventBar = styled.View<{
    color: string;
    $isCurrentMonth: boolean;
    $position: 'start' | 'middle' | 'end' | 'single';
    $top: number;
}>`
    background-color: ${props => props.color || 'gray'};
    opacity: ${({$isCurrentMonth = true}) => $isCurrentMonth ? 1 : 0.4};
    height: 12px;
    justify-content: center;
    padding: 0 3px;
    position: absolute;
    top: ${props => props.$top}px;
    left: ${props => (props.$position === 'middle' || props.$position === 'end') ? '-6px' : '0px'};
    right: ${props => (props.$position === 'start' || props.$position === 'middle') ? '-6px' : '0px'};
    border-top-left-radius: ${props => (props.$position === 'start' || props.$position === 'single') ? '2px' : '0px'};
    border-bottom-left-radius: ${props => (props.$position === 'start' || props.$position === 'single') ? '2px' : '0px'};
    border-top-right-radius: ${props => (props.$position === 'end' || props.$position === 'single') ? '2px' : '0px'};
    border-bottom-right-radius: ${props => (props.$position === 'end' || props.$position === 'single') ? '2px' : '0px'};
`;

export const EventBarText = styled.Text.attrs({
    numberOfLines: 1,
    ellipsizeMode: 'tail',
})`
    font-size: 8px;
    color: #ffffff;
`;

interface MoreScheduleTextProps extends StyledProps {
    $top: number;
}

export const MoreScheduleText = styled.Text.attrs({
    numberOfLines: 1,
})<MoreScheduleTextProps>`
    position: absolute;
    top: ${props => props.$top}px;
    font-size: 10px;
    text-align: center;
    width: 100%;
    padding: 1px 3px;
    color: ${props => props.$colors?.text || '#555'}; /* 눈에 띄도록 다른 색상 사용 */
    font-weight: bold;
`;

export const ScheduleTitleText = styled.Text.attrs({
    numberOfLines: 1, // 텍스트를 한 줄로 제한합니다.
    ellipsizeMode: 'tail', // 길이가 길면 끝에 ...을 표시합니다.
})<ScheduleTitleTextProps & { $top: number }>`
    position: absolute;
    top: ${props => props.$top}px;
    height: 12px; /* Match EventBar height */
    font-size: 8px; /* Match EventBarText font size */
    text-align: center;
    width: 100%;
    border-radius: 2px;
    padding: 0 3px; /* Match EventBar horizontal padding */
    background-color: ${props => props.color || 'gray'};
    color: #ffffff;
    overflow: hidden;
`

export const MonthSchedulesContainer = styled.View`
    position: relative;
    flex: 1; /* 날짜 텍스트를 제외한 나머지 세로 공간을 모두 차지합니다. */
    width: 100%; /* 부모 컨테이너의 너비에 맞춥니다. */
    margin-top: 4px; /* 날짜와 일정 사이의 간격 */
`;


// ------------------------- //
// Timetable Style Component //
// ------------------------- //
export const TimetableWrapper = styled.View<StyledProps>`
    flex: 1;
    border-top-width: 1px;
    border-top-color: ${props => props.theme.dark ? '#f0f0f0' : '#e4d9ff'};
`;

export const TimetableGrid = styled.View`
    flex-direction: row;
    flex: 1;
`;

export const TimeColumn = styled.View`
    width: 50px;
    padding: 10px;
`;

export const TimeLabelCell = styled.View`
    height: 40px; /* 1시간의 높이 */
    justify-content: flex-start;
    align-items: center;
`;

export const TimeLabelText = styled.Text<StyledProps>`
    font-size: 12px;
    color: ${props => props.$colors?.text || '#8e8e93'};
    transform: translateY(-8px);
`;

export const TimeTableDaysContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

export const TimeTableDayColumn = styled.View<StyledProps & { $isToday?: boolean }>`
    flex: 1;
    border-left-width: 1px;
    border-left-color: ${props => props.theme.dark ? '#f0f0f0' : '#eee'};
    background-color: ${(props) => (props.$isToday ? (props.$colors?.card || '#f7f7f7') : 'transparent')};
`;

export const HourCell = styled.View<StyledProps>`
    height: 40px;
    border-bottom-width: 1px;
    border-bottom-color:  ${props => props.theme.dark ? '#f0f0f0' : '#eee'};
`;

export const ScheduleBlock = styled.TouchableOpacity<{ top: number; height: number; color: string }>`
    position: absolute;
    left: 0.1px;
    right: 0.1px;
    top: ${(props) => props.top}px;
    height: ${(props) => props.height}px;
    background-color: ${(props) => props.color};
    padding: 4px;
    border-radius: 2px;
    opacity: 0.85;
`;

export const ScheduleBlockText = styled.Text`
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
`;

// ----------------------- //
// View Mode Button Styles //
// ----------------------- //

export const ViewModeButtonContainer = styled.View<StyledProps>`
    padding: 0px;
    border-radius: 25px;
    flex-direction: row;
    justify-content: center;
    padding-vertical: 10px;
    border: 1.5px solid #9970FF;
    
    border-bottom-color: ${props => props.$colors?.border || '#eee'};
    background-color: ${props => props.$colors?.card || 'lavender'};
    elevation: 10;
`;

interface ViewModeButtonProps extends StyledProps {
    $isActive?: boolean;
}

export const ViewMonthButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: ${(props) => (props.$isActive ? (props.$colors?.primary || '#9970FF') : (props.theme.dark ? '#2C2C2E' : '#fff'))};
`

export const ViewWeekButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    background-color: ${(props) => (props.$isActive ? (props.$colors?.primary || '#9970FF') : (props.theme.dark ? '#2C2C2E' : '#fff'))};
`

export const ViewDayButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: ${(props) => (props.$isActive ? (props.$colors?.primary || '#9970FF') : (props.theme.dark ? '#2C2C2E' : '#fff'))};
`

export const ViewModeButtonText = styled.Text<ViewModeButtonProps>`
    font-weight: 500;
    font-size: 20px;
    color: ${(props) => (props.$isActive ? 'white' : (props.$colors?.text || 'black'))};
`;

// ------------------------------------- //
// Daily Calendar Header Style Component //
// ------------------------------------- //

export const DayHeader = styled.View<StyledProps>`
    padding: 10px 20px;
    background-color: ${props => props.$colors?.card || '#f8f8f8'};
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.$colors?.border || '#eee'};
`;

export const DayHeaderText = styled.Text<StyledProps>`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.$colors?.text || '#333'};
    text-align: center;
`;