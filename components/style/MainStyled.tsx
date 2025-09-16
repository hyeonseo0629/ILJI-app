import styled from "styled-components/native";
import { ThemeColors } from "@/types/theme";

interface CategoryTabProps {
    $isActive?: boolean;
    activeColor?: string;
}

interface StyledProps {
    $colors?: ThemeColors;
}

export const MainContainer = styled.View<StyledProps>`
    flex: 1;
    background-color: ${(props) => props.$colors?.background || '#F0F0F0'}; // 견고한 폴백 색상 사용
`;

export const MainContentWrap = styled.View`
    flex: 1;
    align-items: center;
`;

export const MainToDoCategoryWarp = styled.View<StyledProps>`
    flex-direction: row;
    padding: 16px 16px 0 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.$colors?.border || '#E0E0E0'}; // 견고한 폴백 색상 사용
    align-items: flex-end;
    background-color: ${(props) => props.$colors?.card || '#F0F0F0'}; // 배경색 추가
`;

export const MainToDoCategory = styled.TouchableOpacity<CategoryTabProps>`
    background-color: ${(props) => props.activeColor};
    padding: ${(props) => (props.$isActive ? '12px 20px' : '8px 16px')};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    opacity: ${(props) => (props.$isActive ? 1 : 0.6)};
`;

export const MainToDoCategoryText = styled.Text<CategoryTabProps & StyledProps>`
    font-size: 15px;
    font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
    color: ${(props) => props.$colors?.text || '#333333'};
`;
