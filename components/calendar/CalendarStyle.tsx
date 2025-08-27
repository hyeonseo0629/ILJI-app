import styled from 'styled-components/native';

// Calendar Area
export const CContainer = styled.View`
    flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
    background-color: #ffffff;
    width: 100%;
    padding: 30px;
`

// Monthly Calendar Component
export const MContainer = styled.View`
    flex: 1; /* 부모 컨테이너(CContainer)의 공간을 모두 차지하도록 설정 */
    background-color: #ffffff;
    padding-vertical: 15px;
    width: 100%;
`

export const MLoadingContainer = styled.View`
    justify-content: center;
    align-items: center;
    height: 420px; // Give it a fixed height to avoid layout shifts
`

export const MHeader = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    padding-horizontal: 15px;
`;

export const MMonthText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
    width: 115px;
`;

// --- Day/Week/Month 버튼 스타일 ---
export const MViewModeContainer = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 5px; /* 버튼 사이에 간격을 줍니다 */
`;

export const MViewModeButton = styled.Pressable<{ isActive: boolean }>`
    padding: 8px 10px; /* 버튼의 크기를 조절합니다 */
    border-radius: 20px; /* 동그란 모양을 만듭니다 */
    background-color: ${({ isActive }) => (isActive ? '#EAEAFB' : 'transparent')}; /* 활성화 시 연보라색 배경 */
`;

export const MViewModeButtonText = styled.Text<{ isActive: boolean }>`
    font-size: 14px;
    font-weight: 600;
    color: ${({ isActive }) => (isActive ? '#5856D6' : '#000000')}; /* 활성화 시 진한 보라색 텍스트 */
`;
// --- 버튼 스타일 끝 ---


export const MDayNameText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})`
    flex: 1;
    font-size: 12px;
    color: #8E8E93;
    font-weight: 500;
    text-align: center;
`;

export const MWeek = styled.View`
    flex-direction: row;
    height: 50px;
`;

interface MDayContainerProps {
    $isSelected?: boolean;
}

export const MDayContainer = styled.TouchableOpacity<MDayContainerProps>`
    flex: 1;
    height: 65px;
    justify-content: center; /* 내부 요소를 세로 중앙에 정렬 */
    align-items: center;
    padding: 10px;
    background-color: ${(props) => (props.$isSelected ? '#EFEFEF' : 'transparent')};
    border-radius: 8px;
`;

export const MEmptyDayContainer = styled.View`
    flex: 1;
    height: 65px; /* MDayContainer와 높이를 통일하여 레이아웃 깨짐 방지 */
`;

interface MDayTextProps {
    $isNotInMonth?: boolean;
    $isToday?: boolean;
    $isSelected?: boolean;
}

export const MDayText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})<MDayTextProps>`
    font-size: 12px;
    text-align: center;
    color: ${(props) => {
        if (props.$isSelected) return '#FFFFFF';
        if (props.$isNotInMonth) return '#D1D1D6';
        return '#333';
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MDayCircle = styled.View`
    width: 25px;
    height: 25px;
    background-color: mediumslateblue;
    border-radius: 12.5px; /* 완벽한 원을 위해 너비/높이의 절반 값 사용 */
    justify-content: center; /* 내부 텍스트를 세로 중앙에 정렬 */
    align-items: center; /* 내부 텍스트를 가로 중앙에 정렬 */
`;


export const EventDot = styled.View<{ color?: string }>`
    width: 5px;
    height: 5px;
    border-radius: 2.5px;
    background-color: ${(props) => props.color || 'tomato'};
    position: absolute;
    bottom: 8px;
`;

/**
 * Day View Styles
 */
export const DayViewContainer = styled.ScrollView`
    padding: 20px;
    flex: 1;
`;

export const EventItem = styled.View`
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    flex-direction: row;
    align-items: center;
`;

export const EventColorIndicator = styled.View<{ color: string }>`
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: ${(props) => props.color};
    margin-right: 10px;
`;

export const EventTitle = styled.Text`
    font-size: 16px;
`;

export const NoEventsText = styled.Text`
    text-align: center;
    color: #8e8e93;
    margin-top: 20px;
    font-size: 16px;
`;


/**
 * Timetable (Week) View Styles
 */
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

export const DayText = styled.Text`
    width: 100%;
    padding: 10px;
    text-align: center;
    font-size: 20px;
    border-bottom-width: 1px ;
    border-bottom-color: #f0f0f0;
`

export const DaysContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

export const DayColumn = styled.View<{ $isToday?: boolean }>`
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

export const EventBlock = styled.TouchableOpacity<{ top: number; height: number; color: string }>`
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

export const EventBlockText = styled.Text`
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
`;


/**
 * CalendarView Styles
 */
export const ViewModeContainer = styled.View`
    margin: 0 20px;
    padding: 0 10px;
    flex-direction: row;
    justify-content: center;
    padding-vertical: 10px;
    border-bottom-color: #eee;
`;

interface ViewModeButtonProps {
    $isActive?: boolean;
}

export const ViewModeButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px;
    border-radius: 20px;
    margin: 0 5px;
    background-color: ${(props) => (props.$isActive ? 'mediumslateblue' : 'lavender')};
    elevation: 10;
`;

export const ButtonText = styled.Text<ViewModeButtonProps>`
    font-weight: 500;
    font-size: 20px;
    color: ${(props) => (props.$isActive ? 'white' : 'black')};
`;

/**
 * Day View Header Styles
 */
export const DayViewHeader = styled.View`
     padding: 10px 20px;
     background-color: #f8f8f8;
     border-bottom-width: 1px;
     border-bottom-color: #eee;
 `;

export const DayViewHeaderText = styled.Text`
     font-size: 16px;
     font-weight: 600;
     color: #333;
     text-align: center;
 `;