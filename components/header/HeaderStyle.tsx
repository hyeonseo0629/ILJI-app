import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

interface HContainerProps {
    $isMain?: boolean;
}

const mainHeaderStyles = css<HContainerProps>`
    /* iOS Shadow */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-radius: 3.84px;
    /* Android Shadow */
`;

export const HContainer = styled(Animated.View)<HContainerProps>`
    width: 100%;
    background-color: #ffffff;
    /* $isMain prop이 true일 때만 그림자 효과를 적용합니다. */
    ${(props) => props.$isMain && mainHeaderStyles}
`;

export const HTop = styled.View`
    margin-top: 45px;
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
`

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
`

export const HIcon = styled.Text`
font-size: 20px;
`

export const HBottom = styled.View`
    padding: 15px;
    flex-direction: row;
    justify-content: space-around;
`

export const HRecentDiary = styled.View`
    width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: lavender;
`