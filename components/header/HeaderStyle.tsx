import styled from 'styled-components/native';

export const HContainer = styled.View`
    width: 100%;
    background-color: #ffffff;
    border: 2px solid black;
`

export const HTop = styled.View`
    flex-direction: row;
    border: 2px solid black;
`

export const HLogo = styled.Image.attrs((props) => ({
    // .attrs()를 사용해 source prop의 기본값을 설정합니다.
    // require()의 경로는 현재 파일(HeaderStyle.tsx) 기준입니다.
    source: require('../../assets/images/logo.png'),
}))`
   width: 50px;
   height: 50px;
 `;

export const HIconWrap = styled.View`
border: 2px solid black;
`

export const HIcon = styled.Text`
font-size: 20px;
`

export const HBottom = styled.View`
    border: 2px solid black;
`