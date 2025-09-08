import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { Theme } from '@react-navigation/native'; // Theme 타입 임포트
import { View } from 'react-native'; // Import View from react-native

interface HContainerProps {
    $isMain?: boolean;
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
`;

export const HTop = styled.View`
    margin-top: 45px;
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
`;

export const HLogo = styled.Image.attrs((props) => ({
    source: require('../../assets/images/logo.png'),
}))`
   width: 50px;
   height: 50px;
 `;

export const HIconWrap = styled.View`
    width: 30%;
    margin: 10px;
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
