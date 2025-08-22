import styled from "styled-components/native";
import { Shadow } from "react-native-shadow-2";

interface CategoryTabProps {
    $isActive?: boolean;
    activeColor?: string;
}

export const MainContainer = styled.View`
    flex: 1;
`

export const MainContentWrap = styled.View`
    flex: 1;
    align-items: center;
`

export const MainToDoCategoryWarp = styled.View`
    flex-direction: row;
    /* 탭이 바텀시트의 헤더 역할을 하도록 스타일 조정 */
    padding: 16px 16px 0 16px; /* 상, 좌우, 하단 여백 */
    background-color: #ffffff; /* 바텀시트 배경과 동일하게 설정 */
    border-bottom-width: 1px;
    border-bottom-color: #f0f0f0; /* 콘텐츠와 구분되는 연한 선 */
    /* 높이가 다른 탭들을 하단에 정렬하여 보기 좋게 만듭니다. */
    align-items: flex-end;
`

export const MainToDoCategory = styled.TouchableOpacity<CategoryTabProps>`
    background-color: ${(props) => props.activeColor};
    /* $isActive prop에 따라 패딩 값을 다르게 주어 크기를 조절합니다. */
    padding: ${(props) => (props.$isActive ? '12px 20px' : '8px 16px')};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    opacity: ${(props) => (props.$isActive ? '1' : '0.6')};
    
`

export const MainTodoCategoryText = styled.Text<CategoryTabProps>`
    font-size: 15px;
    font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
    color: ${(props) => '#333333'};
    font-weight: bold;
`