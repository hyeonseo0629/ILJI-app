import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Theme } from '@react-navigation/native'; // Theme 타입 임포트
import { View } from 'react-native'; // Import View from react-native
import Octicons from "react-native-vector-icons/Octicons";

interface HContainerProps {
    $isMain?: boolean;
    $isSheetExpanded?: boolean;
}

interface ThemeProps { // ThemeProps 인터페이스 정의
    theme: Theme;
}

const mainHeaderStyles = css<HContainerProps & ThemeProps>` // ThemeProps 추가
    /* iOS Shadow */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-radius: 3.84px;
`;

export const HContainer = styled(View)<HContainerProps & ThemeProps>` // Changed from Animated.View to View
    width: 100%;
    background-color: ${(props) => props.theme?.colors?.background || '#ffffff'};
    ${(props) => props.$isMain && mainHeaderStyles}
    /* 바텀 시트가 확장되면 zIndex를 0으로, 아닐 때는 1로 설정합니다. */
    z-index: ${(props) => (props.$isSheetExpanded ? 0 : 1)};

    /* $isMain prop이 true일 때만 그림자 효과를 적용합니다. */
    ${(props) => props.$isMain && mainHeaderStyles};
    padding-top: 10px;
`;

export const HWrap = styled.View`
    padding: 0 10px;
    flex-direction: row;
    justify-content: space-between;
`;

export const HLogo = styled.Image.attrs((props) => ({
    source: require('../../assets/images/logo.png'),
}))`
    width: 65px;
    height: 65px;
    margin: 0 5px;
`;

export const HIconWrap = styled.View`
    width: 30%;
    margin: 15px 20px 0;
    flex-direction: row;
    justify-content: space-between;
`;

export const HIcon = styled.Text<ThemeProps>` // ThemeProps 추가
    font-size: 20px;
    color: ${(props) => props.theme?.colors?.text || '#000'};
`;

export const HBottom = styled.View`
    padding: 15px;
    flex-direction: row;
    justify-content: space-around;
`;

export const HRecentDiary = styled.View<ThemeProps>` // ThemeProps 추가
    width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: ${(props) => props.theme?.colors?.card || 'lavender'};
`;

export const HIconBell = styled(Octicons).attrs<ThemeProps>({})`
    padding: 5px;
    color: ${(props) => props.theme?.colors?.text || 'mediumslateblue'};
`
export const HIconMail = styled(Octicons).attrs<ThemeProps>({})`
    padding: 5px;
    color: ${(props) => props.theme?.colors?.text || 'mediumslateblue'};
`

export const HIconShare = styled(Octicons).attrs<ThemeProps>({})`
    padding: 5px;
    color: ${(props) => props.theme?.colors?.text || 'mediumslateblue'};
`
