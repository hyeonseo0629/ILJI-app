import styled, { css } from 'styled-components/native';
import Octicons from "react-native-vector-icons/Octicons";

interface HContainerProps {
    $isMain?: boolean;
    $isSheetExpanded?: boolean;
}

const mainHeaderStyles = css<HContainerProps>`
    /* iOS Shadow */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    /* 바텀 시트가 열리면 그림자를 숨깁니다. */
    shadow-opacity: ${(props) => (props.$isSheetExpanded ? 0 : 0.08)};
    shadow-radius: 3.84px;
    /* Android Shadow */
    /* 바텀 시트가 열리면 elevation을 0으로 만들어 뒤로 보냅니다. */
    elevation: ${(props) => (props.$isSheetExpanded ? 0 : 5)};
`;

export const HContainer = styled.View<HContainerProps>`
    width: 100%;
    background-color: #ffffff;
    /* 바텀 시트가 확장되면 zIndex를 0으로, 아닐 때는 1로 설정합니다. */
    z-index: ${(props) => (props.$isSheetExpanded ? 0 : 1)};

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
    width: 65px;
    height: 65px;
    margin: 5px;
`;

export const HIconWrap = styled.View`
    width: 30%;
    margin: 20px;
    flex-direction: row;
    justify-content: space-between;
`

export const HIcon = styled.Text`
font-size: 20px;
`
export const HIconBell = styled(Octicons).attrs({})`
    padding: 5px;
    color: mediumslateblue;
`
export const HIconMail = styled(Octicons).attrs({})`
    padding: 5px;
    color: mediumslateblue;
`

export const HIconShare = styled(Octicons).attrs({})`
    padding: 5px;
    color: mediumslateblue;
    
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
    border: 3px solid mediumslateblue;
`