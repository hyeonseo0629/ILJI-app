import styled from "styled-components/native";
import { ThemeColors } from "@/types/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    border-bottom-width: 0px;
    border-bottom-color: ${(props) => props.$colors?.borderColor || '#E0E0E0'}; // 견고한 폴백 색상 사용
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

export const MainToDoCategoryText = styled.Text<CategoryTabProps & StyledProps>`
    font-size: 15px;
    font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
    color: ${(props) => props.$colors?.text || '#333333'};
    line-height: 15px;
`;

export const StyledGestureHandlerRootView = styled(GestureHandlerRootView)`
    flex: 1;
`;

export const LoadingContainer = styled.View<StyledProps>`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.$colors?.background};
`;

export const LoadingText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.text};
    margin-top: 10px;
`;

export const TabHandleContainer = styled.View`
    flex-direction: row;
    align-items: flex-start;
`;

export const ChevronButton = styled.TouchableOpacity`
    padding: 8px;
`;

export const TabPagingContainer = styled.View`
    flex: 1;
`;

export const StyledSafeAreaView = styled.SafeAreaView<StyledProps>`
    flex: 1;
    background-color: ${props => props.$colors?.background};
`;