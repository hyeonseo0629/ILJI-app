import styled from "styled-components/native";
import { Theme } from '@react-navigation/native';

interface CategoryTabProps {
    $isActive?: boolean;
    activeColor?: string;
}

interface ThemeProps {
    theme: Theme;
}

export const MainContainer = styled.View<ThemeProps>`
    flex: 1;
    background-color: ${(props) => props.theme?.colors?.background || '#F0F0F0'}; // 견고한 폴백 색상 사용
`;

export const MainContentWrap = styled.View`
    flex: 1;
    align-items: center;
`;

export const MainToDoCategoryWarp = styled.View<ThemeProps>`
    flex-direction: row;
    padding: 16px 16px 0 16px;
    border-bottom-width: 0px;
    border-bottom-color: ${(props) => props.theme?.colors?.border || '#E0E0E0'}; // 견고한 폴백 색상 사용
    align-items: flex-end;
    justify-content: center;
    height: 55px;
`;

export const MainToDoCategory = styled.TouchableOpacity<CategoryTabProps>`
    background-color: ${(props) => props.activeColor || '#DDDDDD'};
    padding-vertical: ${(props) => (props.$isActive ? 12 : 8)};
    padding-horizontal: ${(props) => (props.$isActive ? 20 : 16)};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    opacity: ${(props) => (props.$isActive ? 1 : 0.6)};
`;

export const MainToDoCategoryText = styled.Text<CategoryTabProps & ThemeProps>`
    font-size: 15px;
    font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
    color: ${(props) => props.theme?.colors?.text || '#333333'};
    line-height: 15;
`;
