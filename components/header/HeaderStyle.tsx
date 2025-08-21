import styled from 'styled-components/native';

export const HContainer = styled.View`
    width: 100%;
    background-color: #ffffff;
    elevation: 5;
    z-index: 1;
`

export const HTop = styled.View`
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
    padding: 10px;
    flex-direction: row;
    justify-content: space-around;
`

export const HRecentDiary = styled.View`
    width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: lavender;
`