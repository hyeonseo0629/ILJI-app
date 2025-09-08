import styled from "styled-components/native";
import MaterialDesignIons from "react-native-vector-icons/MaterialCommunityIcons";


// --------- //
// Container //
// --------- //

export const Container = styled.View`
    width: 100%;
    height: 100%;
    background-color: #fff;
`

interface TabButtonProps {
    $isActive?: boolean;
}

// --- //
// Tab //
// --- //

export const TabsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
`

export const TabsButton = styled.TouchableOpacity<TabButtonProps>`
    width: 50%;
    padding: 20px;
    align-items: center;
    border-bottom-width: 3px;
    border-bottom-color: ${(props) => (props.$isActive ? 'mediumslateblue' : '#f0f0f0')};
`

export const TabsButtonText = styled.Text`
    font-weight: bold;
`

// -------------- //
// Page View Main //
// -------------- //

export const PageWrap = styled.View`
    width: 100%;
    padding: 20px;
`

export const PageTextWrap = styled.View`
    width: 90%;
    flex-direction: row;
    margin: auto;
    justify-content: space-between;
`

export const PageDateText = styled.Text`
    font-size: 60px;
    padding: 10px 0;
`
export const PageTextLeftWrap = styled.View`
    width: 60%;
    padding: 25px 0;
    
`
export const PageTextTopWrap = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

export const PageWeekText = styled.Text`
    font-size: 20px;
    font-weight: bold;
`

export const PageButtonIconWrap = styled.View`
    justify-content: space-between;
    position: absolute;
    bottom: 15px;
    right: 15px;
`

// MaterialDesignIons
// close-box-outline
// square-edit-outline
export const PageButtonIcon = styled(MaterialDesignIons).attrs({
    size: 30
})`
    background-color: rgba(230, 230, 250, 0.5);
    border-radius: 50px;
    padding: 10px;
    margin: 5px;
    border: 3px solid mediumslateblue;
`

export const PageTextBottomWrap = styled.View`
    flex-direction: row;
`

export const PageYearText = styled.Text`
    font-size: 15px;
    font-weight: 300;
    margin: 0 10px 0 0;
`

export const PageTimeText = styled.Text`
    font-weight: 300;
    color: #999999;
`

export const PageImage = styled.Image`
    width: 325px;
    height: 350px;
    margin: auto;
    border-radius: 20px;
    background-color: #999999;
`

export const PageContentWrap = styled.View`
    width: 100%;
    padding: 20px;
`

export const PageTitle = styled.Text`
    font-size: 30px;
    font-weight: bold;
    padding: 0 10px;
`

export const PageContent = styled.Text`
    font-weight: normal;
    padding: 10px 15px;
`

// -------------- //
// List View Main //
// -------------- //

export const ListWrap = styled.View`
    width: 90%;
    background-color: #fff;
    border-bottom-width: 1px;
    margin: auto;
`

export const ListDateWrap = styled.View`
    flex-direction: row;
    padding: 20px;
`

export const ListDateText = styled.Text`
    margin-right: 10px;
    font-size: 18px;
`

export const ListTimeText = styled.Text`
    font-size: 18px;
`

export const ListContentWrap = styled.View`
    padding: 0 20px 20px;
`

export const ListTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`

export const ListContent = styled.Text`
    font-size: 15px;
`
