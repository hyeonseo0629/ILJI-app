import styled from "styled-components/native";

// --------- //
// Container //
// --------- //

export const DiaryContainer = styled.View`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
`

// ------- //
// Profile //
// ------- //

export const PWrap = styled.View`
    background-color: #ffffff;
    padding: 20px;
`

export const PTop = styled.View`
    width: 100%;
    flex-direction: row;
`

export const PImage = styled.View`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: lavender;
`

export const PTextWrap = styled.View`
`

export const PUserID = styled.Text`
    color: mediumslateblue;
    font-size: 18px;
    padding: 15px 30px 10px;
`

export const PCountWrap = styled.View`
    flex-direction: row;
    width: 250px;
    margin: 0 20px;
`


export const PCount = styled.View`
    margin: 5px 20px;
    align-items: center;
`

export const PBottom = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const PUserName = styled.Text`
    font-size: 18px;
    color: mediumslateblue;
    padding: 20px 8px 0;
`

export const PEditButton = styled.Text`
    width: 100px;
    height: 30px;
    margin: 20px 15px 0;
    padding: 5px;
    border-radius: 20px;
    font-size: 15px;
    text-align: center;
    background-color: mediumslateblue;
    color: #ffffff;
`
// ------- //
// Top-Tab //
// ------- //

export const TopTabWrap = styled.View`
    width: 100%;
    background-color: #ffffff;
    border: 2px solid;
    flex-direction: row;
    justify-content: space-around;
`

export const TopTab = styled.Text`
    width: 200px;
    font-size: 15px;
    padding: 10px;
    text-align: center;
    color: mediumslateblue;
    background-color: lavender;
`