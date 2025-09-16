import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * DetailSchedule Modal Styles (AddScheduleStyle based)
 */
export const ModalOverlay = styled.Pressable`
    flex: 1;
    justify-content: center; /* 모달을 수직으로 중앙 정렬합니다. */
    background-color: rgba(0, 0, 0, 0.5);
    padding-top: 60px;
    padding-left: 20px;
`;

export const Container = styled.View`
    width: 95%; /* 부모(ModalOverlay)의 여백을 제외한 전체 너비를 사용합니다. */
    background-color: #ffffff;
    border-radius: 20px;
    border-width: 6px; /* 모달 안쪽 테두리 두께 */
    border-color: lavender; /* 모달 안쪽 테두리 색상 (연한 보라색) */
    /* 상단 패딩을 제거하여 헤더가 위쪽에 붙도록 합니다. */
    max-height: 93%; /* 화면의 90%를 넘지 않도록 설정 */
    elevation: 10; /* 안드로이드에서 그림자 효과를 줍니다. */
`;

export const Header = styled.Text`
    margin: 0 30px; /* 헤더의 좌우 여백을 여기서 직접 지정합니다. */
    font-size: 28px; /* 동적 제목에 맞게 폰트 크기 조정 */
    margin-top: 25px; /* 컨테이너의 패딩을 헤더의 마진으로 이동합니다. */
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom-width: 5px;
    border-bottom-color: lavender;
    color: black;
    margin-bottom: 25px;
`;

export const HeaderInput = styled.TextInput`
    margin: 0 30px;
    font-size: 28px;
    margin-top: 25px;
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom-width: 5px;
    border-bottom-color: lavender;
    color: black;
    margin-bottom: 25px;
`;

export const ContentWrap = styled.ScrollView.attrs({
    // (Android) 스크롤바가 항상 보이도록 설정합니다. iOS에서는 스크롤 시에만 표시됩니다.
    persistentScrollbar: true,
    // (iOS) 스크롤바를 콘텐츠 패딩(30px) 안쪽으로 들여옵니다.
    scrollIndicatorInsets: { right: 15 },
    // (iOS 전용) 스크롤바 스타일을 어둡게 설정합니다.
    // 안드로이드에서는 기본 시스템 색상으로 표시됩니다.
    indicatorStyle: 'black',
    contentContainerStyle: {
        paddingHorizontal: 30, /* 내용 영역의 좌우 여백을 여기서 직접 지정합니다. */
        paddingBottom: 25,
    }
})``;

export const DateTimeInfoRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between; /* 아이콘과 텍스트 그룹, 삭제 버튼을 양쪽으로 정렬 */
    margin-bottom: 25px; /* 섹션 간의 여백을 확보합니다. */
`;

export const DateTimeInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1; /* 삭제 버튼을 제외한 나머지 공간을 차지하도록 설정 */
`;

export const CalendarIcon = styled(MaterialIcons).attrs({})`
    margin-right: 12px; /* 아이콘과 텍스트 사이 간격 조정 */
    color: mediumslateblue;
`;

export const DateTimeTexts = styled.View`
    flex: 1;
`;

export const DateText = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: #9393db;
`;

export const TimeText = styled.Text`
    font-size: 22px;
    font-weight: 700;
    color: mediumslateblue;
    margin-top: 2px;
`;

export const Label = styled.Text`
    font-size: 22px; /* 라벨 폰트 크기를 약간 줄여 균형을 맞춥니다. */
    font-weight: bold;
    color: mediumslateblue;
    /* 상단 여백은 이전 요소에서 제어하도록 margin-top을 제거합니다. */
    margin-bottom: 8px; /* 내용과의 간격을 살짝 줄입니다. */
`;

// 메모, 위치 등 상세 내용을 보여주는 텍스트 스타일
export const ValueText = styled.Text`
    width: 100%;
    background-color: #f4f4fd; /* 은은한 배경색으로 구분감을 줍니다. */
    padding: 14px 16px; /* 넉넉한 내부 여백을 추가합니다. */
    border-radius: 12px; /* 모서리를 부드럽게 처리합니다. */
    font-size: 16px;
    color: #484389;
    font-weight: 500;
    margin-bottom: 25px; /* 다음 섹션과의 간격을 일정하게 조정합니다. */
    line-height: 24px; /* 여러 줄일 경우 가독성 확보 */
    overflow: hidden; /* iOS에서 borderRadius를 적용하기 위해 필요합니다. */
`;

export const ValueInput = styled.TextInput`
    width: 100%;
    background-color: #f4f4fd;
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 16px;
    color: #484389;
    font-weight: 500;
    margin-bottom: 25px;
    line-height: 24px;
    border-width: 1px;
    border-color: mediumslateblue;
`;

export const AllDayRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 15px;
    border-top-width: 1px;
    border-bottom-width: 1px;
    border-color: #eee;
`;

export const DateTimePickersRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 25px;
`;

export const DateTimePickerButton = styled.TouchableOpacity`
    background-color: #f4f4fd;
    padding: 12px;
    border-radius: 10px;
    align-items: center;
    flex: 1;
`;

export const DateTimePickerButtonText = styled.Text`
    color: #484389;
    font-size: 16px;
    font-weight: 600;
`;

export const TagSelectorContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
`;

export const TagSelectorItem = styled.TouchableOpacity<{ selected: boolean; color?: string; }>`
    padding: 8px 16px;
    border-radius: 20px;
    border-width: 2px;
    border-color: ${({ color }) => color || 'gray'};
    background-color: ${({ selected, color }) => selected ? color : 'transparent'};
`;

export const TagSelectorText = styled.Text<{ selected: boolean }>`
    color: ${({ selected }) => selected ? 'white' : 'black'};
    font-weight: bold;
`;

export const DeleteButton = styled.TouchableOpacity`
    padding: 5px; /* 터치 영역 확보 */
    margin-left: 10px; /* 왼쪽 요소와의 간격 */
`;

export const SelectedTagWrap = styled.View`
     flex-direction: row;
     flex-wrap: wrap; /* 태그 라벨이 사라져서 상단 여백을 제거합니다. */
 `;

export const SelectedTag = styled.View<{ color: string }>`
     flex-direction: row;
     align-items: center;
     background-color: ${(props) => props.color};
     border-radius: 16px;
     padding: 8px 16px; /* 좌우 패딩을 조절하여 좀 더 보기 좋게 만듭니다. */
     margin-bottom: 25px; /* 다음 섹션과의 간격을 일정하게 조정합니다. */
`;

export const SelectedTagText = styled.Text`
     color: #ffffff;
     font-weight: bold;
     font-size: 18px;
 `;

export const ButtonArea = styled.View`
    flex-direction: row;
    /* 내용과 버튼 영역 사이의 간격은 ContentWrap의 padding-bottom으로 제어합니다. */
    /* 버튼 위의 라벤더 구분선을 제거하여 더 깔끔하게 만듭니다. */
    background-color: #f9f9f9; /* 버튼 영역 배경색 */
    border-bottom-left-radius: 14px; /* 컨테이너의 둥근 모서리에 맞춤 (20px - 6px) */
    border-bottom-right-radius: 14px;
    overflow: hidden; /* 둥근 모서리를 적용하기 위해 필수 */
`;

export const ActionButton = styled.TouchableOpacity<{ primary?: boolean }>`
    flex: 1; /* 버튼이 영역을 동일하게 나누어 가집니다. */
    padding: 18px;
    align-items: center;
    background-color: ${({ primary }) => primary ? 'mediumslateblue' : '#eef0f4'}; /* secondary 버튼에 아주 연한 배경색 추가 */
`;

export const ActionButtonText = styled.Text<{ primary?: boolean }>`
    font-size: 22px;
    font-weight: bold;
    color: ${({ primary }) => primary ? 'white' : 'mediumslateblue'}; /* secondary 버튼 텍스트 색상 유지 */
`;

export const ButtonSeparator = styled.View`
    width: 1px;
    background-color: lavender; /* 구분선 색상 */
`;