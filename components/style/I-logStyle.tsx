import styled from "styled-components/native";
import { Theme } from '@react-navigation/native';

interface ThemeProps {
    theme: Theme;
}

// --------- //
// Container //
// --------- //

export const DiaryContainer = styled.View<ThemeProps>`
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme?.colors?.background || '#ffffff'};
`

// ---- //
// Main //
// ---- //

export const MWrap = styled.View`
    width: 100%;
    padding: 20px;
`

export const MTextWrap = styled.View`
    width: 100%;
    flex-direction: row;
    padding: 0 20px;
`

export const MDateText = styled.Text<ThemeProps>`
    font-size: 50px;
    padding: 10px;
    color: ${(props) => props.theme?.colors?.text || '#000000'};
`
export const MTextLeftWrap = styled.View`
    width: 70%;
    padding: 25px 10px;
`

export const MWeekText = styled.Text<ThemeProps>`
    font-size: 15px;
    font-weight: bold;
    color: ${(props) => props.theme?.colors?.text || '#000000'};
`
export const MTextBottomWrap = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
`

export const MYearText = styled.Text<ThemeProps>`
    font-weight: 300;
    color: ${(props) => props.theme?.colors?.text || '#000000'};
`

export const MTimeText = styled.Text<ThemeProps>`
    font-weight: 300;
    color: ${(props) => props.theme?.colors?.text || '#999999'};
    padding: 0 5px;
`

export const MImage = styled.Image`
    width: 325px;
    height: 350px;
    margin: auto;
    border-radius: 20px;
    background-color: ${(props) => props.theme?.colors?.card || '#999999'};
`

export const MContentWrap = styled.View`
    width: 100%;
    padding: 20px;
`

export const MTitle = styled.Text<ThemeProps>`
    font-size: 30px;
    font-weight: bold;
    padding: 0 10px;
    color: ${(props) => props.theme?.colors?.text || '#000000'};
`

export const MContent = styled.Text<ThemeProps>`
    font-weight: normal;
    padding: 10px 15px;
    color: ${(props) => props.theme?.colors?.text || '#000000'};
`