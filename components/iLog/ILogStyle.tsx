import styled from "styled-components/native";

// --------- //
// Container //
// --------- //

export const ILogContainer = styled.View`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
`

// ------- //
// Profile //
// ------- //

export const IWrap = styled.View`
    background-color: #ffffff;
    padding: 20px;
`

export const ITop = styled.View`
    width: 100%;
    flex-direction: row;
`

export const IImage = styled.View`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: lavender;
`

export const ITextWrap = styled.View`
`

export const IUserID = styled.Text`
    color: mediumslateblue;
    font-size: 18px;
    padding: 15px 30px 10px;
`

export const ICountWrap = styled.View`
    flex-direction: row;
    width: 250px;
    margin: 0 20px;
`


export const ICount = styled.View`
    margin: 5px 20px;
    align-items: center;
`

export const IBottom = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const IUserName = styled.Text`
    font-size: 18px;
    color: mediumslateblue;
    padding: 20px 8px 0;
`

export const IEditButton = styled.TouchableOpacity`
    width: 100px;
    height: 30px;
    margin: 20px 15px 0;
    padding: 5px;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    background-color: mediumslateblue;
`

export const IEditButtonText = styled.Text`
    font-size: 15px;
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

export const ILogContentWrap = styled.View`
  flex: 1;
`;

export const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.active ? 'blue' : 'transparent')};
`;

export const ListContainer = styled.View`
  flex: 1;
`;

export const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  height: 20%;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

export const ListImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

export const ListTitle = styled.Text`
  font-size: 18px;
`;
