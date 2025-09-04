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
    padding: 0 20px 10px;
    elevation: 3px;
`

export const PTop = styled.View`
    width: 100%;
    flex-direction: row;
`

export const PImage = styled.View`
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background-color: lavender;
    margin: 10px;
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

export const MDateText = styled.Text`
    font-size: 50px;
    padding: 10px;
`
export const MTextLeftWrap = styled.View`
    width: 70%;
    padding: 25px 10px;
`

export const MWeekText = styled.Text`
    font-size: 15px;
    font-weight: bold;
`
export const MTextBottomWrap = styled.View`
    width: 90%;
    flex-direction: row;
    justify-content: space-between;
`

export const MYearText = styled.Text`
    font-weight: 300;
`

export const MTimeText = styled.Text`
    font-weight: 300;
    color: #999999;
    padding: 0 5px;
`

export const MImage = styled.Image`
    width: 325px;
    height: 350px;
    margin: auto;
    border-radius: 20px;
    background-color: #999999;
`

export const MContentWrap = styled.View`
    width: 100%;
    padding: 20px;
`

export const MTitle = styled.Text`
    font-size: 30px;
    font-weight: bold;
    padding: 0 10px;
`

export const MContent = styled.Text`
    font-weight: normal;
    padding: 10px 15px;
`