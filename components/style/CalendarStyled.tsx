import styled from 'styled-components/native';

// -------------- //
// Calendar Area  //
// -------------- //

export const CalendarContainer = styled.View`
    flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
    background-color: #ffffff;
    width: 100%;
    padding: 15px 10px;
`
// ------------------------ //
// Calendar Style Component //
// ------------------------ //

export const MonthContainer = styled.View`
    flex: 1; /* 부모 컨테이너(CContainer)의 공간을 모두 차지하도록 설정 */
    background-color: #ffffff;
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

export const MonthText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    width: 35%;
`;

export const MonthDayNameText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})`
    flex: 1;
    font-size: 12px;
    color: #8E8E93;
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

export const DayOfTheWeekText = styled.Text`
    flex-direction: row;
    margin-bottom: 20px; /* 요일과 날짜 사이의 간격 */
`

interface MonthDayContainerProps {
    $isSelected?: boolean;
}

export const MonthDayContainer = styled.TouchableOpacity<MonthDayContainerProps>`
    flex: 1;
    flex-direction: column; /* 날짜와 제목을 세로로 쌓습니다. */
    align-items: center; /* 가로 중앙 정렬 */
    justify-content: flex-start; /* 세로 상단 정렬 */
    padding: 5px;
    background-color: ${(props) => (props.$isSelected ? '#EFEFEF' : 'transparent')};
    border-radius: 8px;
`;

export const MonthEmptyDayContainer = styled.View`
    flex: 1;
    height: 10px; /* MDayContainer와 높이를 통일하여 레이아웃 깨짐 방지 */
`;

interface MonthDayTextProps {
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
        if (props.$isSelected) return '#FFFFFF';
        if (props.$isNotInMonth) return '#D1D1D6';
        return '#333';
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MonthDayCircle = styled.View`
    width: 16px;
    height: 16px;
    background-color: mediumslateblue;
    border-radius: 15px; /* 완벽한 원을 위해 너비/높이의 절반 값 사용 */
    justify-content: center; /* 내부 텍스트를 세로 중앙에 정렬 */
    align-items: center; /* 내부 텍스트를 가로 중앙에 정렬 */
`;

interface ScheduleTitleTextProps {
    color?: string;
}

export const ScheduleTitleText = styled.Text.attrs({
    numberOfLines: 1, // 텍스트를 한 줄로 제한합니다.
    ellipsizeMode: 'tail', // 길이가 길면 끝에 ...을 표시합니다.
})<ScheduleTitleTextProps>`
    font-size: 10px; /* 월별 캘린더에 맞게 작은 글씨 크기 */
    text-align: center;
    margin-top: 2px;
    width: 100%; /* 컨테이너 너비에 맞춤 */
    border-radius: 4px;
    padding: 1px 3px; /* 텍스트 주변에 약간의 여백을 줍니다. */
    color: #ffffff;
    background-color: ${(props) => props.color || 'gray'};
`;

export const MoreScheduleText = styled.Text.attrs({
    numberOfLines: 1,
})`
    font-size: 10px;
    text-align: center;
    margin-top: 2px;
    width: 100%;
    padding: 1px 3px;
    color: #555; /* 눈에 띄도록 다른 색상 사용 */
    font-weight: bold;
`;

export const MonthSchedulesContainer = styled.View`
    flex: 1; /* 날짜 텍스트를 제외한 나머지 세로 공간을 모두 차지합니다. */
    width: 100%; /* 부모 컨테이너의 너비에 맞춥니다. */
    overflow: hidden; /* 이 컨테이너의 크기를 벗어나는 자식 요소(일정)를 숨깁니다. */
`;


// ------------------------- //
// Timetable Style Component //
// ------------------------- //
export const TimetableWrapper = styled.View`
    flex: 1;
    border-top-width: 1px;
    border-top-color: #f0f0f0;
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
    height: 60px; /* 1시간의 높이 */
    justify-content: flex-start;
    align-items: center;
`;

export const TimeLabelText = styled.Text`
    font-size: 12px;
    color: #8e8e93;
    transform: translateY(-8px); /* 선의 중앙에 오도록 미세 조정 */
`;

export const TimeTableDaysContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

export const TimeTableDayColumn = styled.View<{ $isToday?: boolean }>`
    flex: 1;
    border-left-width: 1px;
    border-left-color: #f0f0f0;
    background-color: ${(props) => (props.$isToday ? '#f7f7f7' : 'transparent')};
`;

export const HourCell = styled.View`
    height: 60px; /* 1시간의 높이 */
    border-bottom-width: 1px;
    border-bottom-color: #f0f0f0;
`;

export const ScheduleBlock = styled.TouchableOpacity<{ top: number; height: number; color: string }>`
    position: absolute;
    left: 5px;
    right: 5px;
    top: ${(props) => props.top}px;
    height: ${(props) => props.height}px;
    background-color: ${(props) => props.color};
    padding: 4px;
    border-radius: 4px;
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

export const ViewModeButtonContainer = styled.View`
    padding: 0px;
    border-radius: 20px;
    flex-direction: row;
    justify-content: center;
    padding-vertical: 10px;
    border-bottom-color: #eee;
    background-color: lavender;
    elevation: 10;
`;

interface ViewModeButtonProps {
    $isActive?: boolean;
}

export const ViewMonthButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: ${(props) => (props.$isActive ? 'mediumslateblue' : 'lavender')};
`

export const ViewWeekButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    background-color: ${(props) => (props.$isActive ? 'mediumslateblue' : 'lavender')};
`

export const ViewDayButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: ${(props) => (props.$isActive ? 'mediumslateblue' : 'lavender')};
`

export const ViewModeButtonText = styled.Text<ViewModeButtonProps>`
    font-weight: 500;
    font-size: 20px;
    color: ${(props) => (props.$isActive ? 'white' : 'black')};
`;

// ------------------------------------- //
// Daily Calendar Header Style Component //
// ------------------------------------- //

export const DayHeader = styled.View`
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
`;

export const DayHeaderText = styled.Text`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    text-align: center;
`;