import styled from 'styled-components/native';

// --- 전체 캘린더 영역 스타일 ---

// CContainer는 캘린더 관련 컴포넌트들을 감싸는 메인 컨테이너입니다.
export const CContainer = styled.View`
    flex: 1; /* 화면의 남은 공간을 모두 차지합니다. */
    background-color: #ffffff; /* 배경색을 흰색으로 설정합니다. */
    padding: 0 30px; /* **수정된 부분:** 좌우 패딩을 30px로 설정합니다. */
`;

// --- 월간 캘린더 (MonthView) 컴포넌트 스타일 ---

// MContainer는 월간 캘린더의 컨테이너입니다.
export const MContainer = styled.View`
    flex: 1; /* 부모 컨테이너(CContainer)의 공간을 모두 차지합니다. */
    background-color: #ffffff; /* 배경색을 흰색으로 설정합니다. */
    /* **수정된 부분:** 불필요한 패딩과 너비 스타일을 제거하여, */
    /* 레이아웃이 부모(CContainer)에 의해 결정되도록 합니다. */
`;

// MLoadingContainer는 데이터 로딩 시 보여주는 로딩 인디케이터의 컨테이너입니다.
export const MLoadingContainer = styled.View`
    justify-content: center; /* 자식 요소를 수직 중앙에 정렬합니다. */
    align-items: center; /* 자식 요소를 수평 중앙에 정렬합니다. */
    height: 420px; /* 고정 높이를 주어 레이아웃 변경을 방지합니다. */
`;

// MHeader는 월간 캘린더의 헤더(월 표시 및 이전/다음 버튼) 영역입니다.
export const MHeader = styled.View`
    flex-direction: row; /* 자식 요소들을 가로로 배열합니다. */
    justify-content: space-between; /* 자식 요소들 사이에 공간을 균등하게 배분합니다. */
    align-items: center; /* 자식 요소들을 수직 중앙에 정렬합니다. */
    margin-bottom: 20px; /* 아래쪽 외부 여백을 20px로 설정합니다. */
    padding-top: 15px; /* 상단 여백을 추가합니다. */
`;

// MMonthText는 현재 월을 표시하는 텍스트입니다.
export const MMonthText = styled.Text`
    font-size: 20px; /* 글자 크기를 20px로 설정합니다. */
    font-weight: bold; /* 글자를 굵게 만듭니다. */
    color: #333; /* 글자 색상을 설정합니다. */
`;

// MDayNameText는 요일(일, 월, 화...)을 표시하는 텍스트입니다.
export const MDayNameText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 합니다.
})`
    flex: 1; /* 주(Week) 내에서 동일한 너비를 차지하도록 합니다. */
    font-size: 12px; /* 글자 크기를 12px로 설정합니다. */
    color: #8E8E93; /* 글자 색상을 설정합니다. */
    font-weight: 500; /* 글자 굵기를 설정합니다. */
    text-align: center; /* 텍스트를 중앙 정렬합니다. */
`;

// MWeek는 한 주를 감싸는 컨테이너입니다.
export const MWeek = styled.View`
    flex-direction: row; /* 날짜들을 가로로 배열합니다. */
`;

// MDayContainer에 전달될 props의 타입을 정의합니다.
interface MDayContainerProps {
    $isSelected?: boolean; // 날짜 선택 여부
}

// MDayContainer는 개별 날짜를 감싸는 터치 가능한 컨테이너입니다.
export const MDayContainer = styled.TouchableOpacity<MDayContainerProps>`
    flex: 1; /* 주(Week) 내에서 동일한 너비를 차지하도록 합니다. */
    height: 65px; /* 고정 높이를 설정합니다. */
    justify-content: center; /* 내부 요소를 수직 중앙에 정렬합니다. */
    align-items: center; /* 내부 요소를 수평 중앙에 정렬합니다. */
    padding: 10px; /* 내부 여백을 10px로 설정합니다. */
    background-color: ${(props) => (props.$isSelected ? '#EFEFEF' : 'transparent')};
    border-radius: 8px; /* 모서리를 둥글게 만듭니다. */
`;

// MEmptyDayContainer는 달력에서 비어있는 날짜 칸을 채우는 컨테이너입니다.
export const MEmptyDayContainer = styled.View`
    flex: 1; /* 주(Week) 내에서 동일한 너비를 차지하도록 합니다. */
    height: 65px; /* MDayContainer와 높이를 통일하여 레이아웃을 유지합니다. */
`;

// MDayText에 전달될 props의 타입을 정의합니다.
interface MDayTextProps {
    $isNotInMonth?: boolean; // 현재 월에 속하지 않는 날짜 여부
    $isToday?: boolean;      // 오늘 날짜 여부
    $isSelected?: boolean;   // 선택된 날짜 여부
}

// MDayText는 날짜 숫자를 표시하는 텍스트입니다.
export const MDayText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 합니다.
})<MDayTextProps>`
    font-size: 12px; /* 글자 크기를 12px로 설정합니다. */
    text-align: center; /* 텍스트를 중앙 정렬합니다. */
    color: ${(props) => {
        if (props.$isSelected) return '#FFFFFF'; // 선택된 날짜는 흰색
        if (props.$isNotInMonth) return '#D1D1D6'; // 다른 월의 날짜는 회색
        return '#333'; // 그 외에는 검은색
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

// MDayCircle은 오늘 날짜 또는 선택된 날짜를 강조하기 위한 원형 배경입니다.
export const MDayCircle = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 합니다.
})`
    width: 25px; /* 원의 너비 */
    height: 25px; /* 원의 높이 */
    background-color: mediumslateblue; /* 배경색 */
    border-radius: 16px; /* 원으로 만들기 위해 너비/높이의 절반 이상으로 설정 */
    text-align: center; /* 텍스트(날짜 숫자)를 중앙 정렬 */
    line-height: 25px; /* 텍스트를 수직 중앙 정렬 */
    font-size: 10px; /* 글자 크기 */
    overflow: hidden; /* 내용이 원을 벗어나면 숨김 */
`;

// EventDot은 해당 날짜에 이벤트가 있음을 나타내는 작은 점입니다.
export const EventDot = styled.View<{ color?: string }>`
    width: 5px; /* 점의 너비 */
    height: 5px; /* 점의 높이 */
    border-radius: 2.5px; /* 원으로 만듭니다. */
    background-color: ${(props) => props.color || 'tomato'};
    position: absolute; /* 부모(MDayContainer) 기준으로 위치를 지정합니다. */
    bottom: 8px; /* 아래쪽에서 8px 떨어진 곳에 위치합니다. */
`;

// --- 일간 뷰 (DayView) 스타일 ---

// DayViewContainer는 일간 뷰의 스크롤 가능한 컨테이너입니다.
export const DayViewContainer = styled.ScrollView`
    padding: 20px; /* 내부 여백 */
    flex: 1; /* 남은 공간을 모두 차지합니다. */
`;

// EventItem은 개별 이벤트 항목을 나타냅니다.
export const EventItem = styled.View`
    background-color: #f9f9f9; /* 배경색 */
    padding: 15px; /* 내부 여백 */
    border-radius: 8px; /* 모서리를 둥글게 만듭니다. */
    margin-bottom: 10px; /* 아래쪽 외부 여백 */
    flex-direction: row; /* 자식 요소들을 가로로 배열합니다. */
    align-items: center; /* 자식 요소들을 수직 중앙에 정렬합니다. */
`;

// EventColorIndicator는 이벤트의 색상을 나타내는 작은 원입니다.
export const EventColorIndicator = styled.View<{ color: string }>`
    width: 10px; /* 너비 */
    height: 10px; /* 높이 */
    border-radius: 5px; /* 원으로 만듭니다. */
    background-color: ${(props) => props.color};
    margin-right: 10px; /* 오른쪽 외부 여백 */
`;

// EventTitle은 이벤트의 제목을 표시하는 텍스트입니다.
export const EventTitle = styled.Text`
    font-size: 16px; /* 글자 크기 */
`;

// NoEventsText는 해당 날짜에 이벤트가 없을 때 표시되는 텍스트입니다.
export const NoEventsText = styled.Text`
    text-align: center; /* 중앙 정렬 */
    color: #8e8e93; /* 글자 색상 */
    margin-top: 20px; /* 위쪽 외부 여백 */
    font-size: 16px; /* 글자 크기 */
`;

// --- 타임테이블 (주간 뷰, WeekView) 스타일 ---

// TimetableContainer는 주간 타임테이블 뷰의 스크롤 가능한 컨테이너입니다.
export const TimetableContainer = styled.ScrollView`
    flex: 1; /* 남은 공간을 모두 차지합니다. */
    border-top-width: 1px; /* 위쪽 테두리 두께 */
    border-top-color: #f0f0f0; /* 위쪽 테두리 색상 */
`;

// TimetableGrid는 시간 열과 요일 열을 포함하는 전체 그리드입니다.
export const TimetableGrid = styled.View`
    flex-direction: row; /* 자식 요소(시간, 요일)를 가로로 배열합니다. */
    flex: 1; /* 남은 공간을 모두 차지합니다. */
`;

// TimeColumn은 시간(예: 09:00, 10:00)을 표시하는 왼쪽 열입니다.
export const TimeColumn = styled.View`
    width: 50px; /* 고정 너비 */
    padding: 10px; /* 내부 여백 */
`;

// TimeLabelCell은 각 시간 레이블(예: '09:00')을 담는 셀입니다.
export const TimeLabelCell = styled.View`
    height: 60px; /* 1시간에 해당하는 높이 */
    justify-content: flex-start; /* 자식 요소를 위쪽에 정렬합니다. */
    align-items: center; /* 자식 요소를 수평 중앙에 정렬합니다. */
`;

// TimeLabelText는 시간 텍스트 자체입니다.
export const TimeLabelText = styled.Text`
    font-size: 12px; /* 글자 크기 */
    color: #8e8e93; /* 글자 색상 */
    transform: translateY(-8px); /* 시간 구분선의 중앙에 오도록 위치를 미세 조정합니다. */
`;

// DaysContainer는 모든 요일 열을 감싸는 컨테이너입니다.
export const DaysContainer = styled.View`
    flex: 1; /* 남은 공간을 모두 차지합니다. */
    flex-direction: row; /* 요일들을 가로로 배열합니다. */
`;

// DayColumn은 하루에 해당하는 열입니다.
export const DayColumn = styled.View`
    flex: 1; /* DaysContainer 내에서 동일한 너비를 차지합니다. */
    border-left-width: 1px; /* 왼쪽 테두리 두께 */
    border-left-color: #f0f0f0; /* 왼쪽 테두리 색상 */
`;

// HourCell은 시간 단위(1시간)를 나타내는 셀입니다.
export const HourCell = styled.View`
    height: 60px; /* 1시간에 해당하는 높이 */
    border-bottom-width: 1px; /* 아래쪽 테두리 두께 */
    border-bottom-color: #f0f0f0; /* 아래쪽 테두리 색상 */
`;

// EventBlock은 타임테이블에 표시되는 개별 이벤트 블록입니다.
export const EventBlock = styled.TouchableOpacity<{ top: number; height: number; color: string }>`
    position: absolute; /* 부모(DayColumn) 기준으로 위치를 지정합니다. */
    left: 5px; /* 왼쪽에서 5px 떨어진 곳에 위치합니다. */
    right: 5px; /* 오른쪽에서 5px 떨어진 곳에 위치합니다. */
    top: ${(props) => props.top}px;
    height: ${(props) => props.height}px;
    background-color: ${(props) => props.color};
    padding: 4px; /* 내부 여백 */
    border-radius: 4px; /* 모서리를 둥글게 만듭니다. */
    opacity: 0.85; /* 약간의 투명도를 줍니다. */
`;

// EventBlockText는 이벤트 블록 내의 텍스트입니다.
export const EventBlockText = styled.Text`
    color: #ffffff; /* 글자 색상 */
    font-size: 12px; /* 글자 크기 */
    font-weight: 500; /* 글자 굵기 */
`;

// --- 캘린더 뷰 모드 (월/주/일) 전환 스타일 ---

// ViewModeContainer는 뷰 모드 전환 버튼들을 감싸는 컨테이너입니다.
export const ViewModeContainer = styled.View`
    margin: 0 20px; /* 좌우 외부 여백 */
    padding: 0 10px; /* 좌우 내부 여백 */
    flex-direction: row; /* 버튼들을 가로로 배열합니다. */
    justify-content: center; /* 버튼들을 중앙 정렬합니다. */
    padding-vertical: 10px; /* 위아래 내부 여백 */
    border-bottom-color: #eee; /* 아래쪽 테두리 색상 */
`;

// ViewModeButton에 전달될 props의 타입을 정의합니다.
interface ViewModeButtonProps {
    $isActive?: boolean; // 현재 활성화된 뷰 모드인지 여부
}

// ViewModeButton은 '월', '주', '일' 뷰 모드를 전환하는 버튼입니다.
export const ViewModeButton = styled.TouchableOpacity<ViewModeButtonProps>`
    padding: 8px 18px; /* 내부 여백 */
    border-radius: 20px; /* 모서리를 둥글게 만듭니다. */
    margin: 0 5px; /* 좌우 외부 여백 */
    background-color: ${(props) => (props.$isActive ? 'mediumslateblue' : 'lavender')};
    elevation: 10; /* 안드로이드에서 그림자 효과를 줍니다. */
`;

// ButtonText는 ViewModeButton 내의 텍스트입니다.
export const ButtonText = styled.Text<ViewModeButtonProps>`
    font-weight: 500; /* 글자 굵기 */
    font-size: 20px; /* 글자 크기 */
    color: ${(props) => (props.$isActive ? 'white' : 'black')};
`;

// NavButton은 월/주/일 이동을 위한 네비게이션 버튼입니다(예: '<', '>').
export const NavButton = styled.TouchableOpacity`
    padding: 10px; /* 터치 영역을 넓히기 위한 내부 여백 */
`;

// NavButtonText는 네비게이션 버튼 내의 텍스트입니다.
export const NavButtonText = styled.Text`
    font-size: 18px; /* 글자 크기 */
    color: #007AFF; /* 글자 색상 (iOS 기본 파란색) */
    font-weight: 500; /* 글자 굵기 */
`;
