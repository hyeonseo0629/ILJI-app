import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { ThemeColors } from "@/types/theme"; // ThemeColors import 추가

interface StyledProps {
  $colors?: ThemeColors;
}

// --------- //
// Container //
// --------- //

export const ScreenContainer = styled.View<StyledProps & { $paddingTop?: number; $paddingBottom?: number; }>`
    flex: 1;
    background-color: ${props => props.$colors?.background || '#fff'};
    padding-top: ${props => props.$paddingTop || 0}px;
    padding-bottom: ${props => props.$paddingBottom || 0}px;
`;

export const Container = styled.View<StyledProps>`
    flex: 1;
    background-color: ${props => props.$colors?.background || '#ffffff'};
`;

export const ButtonIconWrap = styled.TouchableOpacity`
     position: absolute;
     bottom: 15px;
     right: 15px;
 `

 export const ButtonIcon = styled(MaterialCommunityIcons).attrs({
     size: 40
 })<StyledProps>`
     background-color: ${props => props.$colors?.card ? `${props.$colors.card}B3` : 'rgba(230, 230, 250, 0.7)'};
     border-radius: 50px;
     padding: 15px;
     margin: 5px;
     border: 2px solid ${props => props.$colors?.primary || '#7B68EE'};
 `;

// --- //
// Tab //
// --- //
interface TabButtonProps extends StyledProps {
    $isActive?: boolean;
}

export const TabsContainer = styled.View<StyledProps>`
    flex-direction: row;
    justify-content: space-between;
    background-color: ${props => props.$colors?.background || '#fff'};
`

export const TabsButton = styled.TouchableOpacity<TabButtonProps>`
    width: 50%;
    padding: 20px;
    align-items: center;
    border-bottom-width: 3px;
    border-bottom-color: ${(props) => (props.$isActive ? (props.$colors?.primary || '#7B68EE') : (props.$colors?.border || '#f0f0f0'))};
`

export const TabsButtonText = styled.Text<StyledProps>`
    font-weight: bold;
    color: ${props => props.$colors?.text || 'black'};
`

// ----------------- //
// I-Log List View //
// ----------------- //

export const ListSearchWrap = styled.View`
    z-index: 1;
    width: 100%;
`

export const ListSearchButton = styled.TouchableOpacity<StyledProps>`
    padding: 10px;
    background-color: ${props => props.$colors?.background || '#fff'};
`

export const ListSearchButtonTextWrap = styled.View<StyledProps>`
    margin: 5px 10px;
    padding-bottom: 10px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    flex-direction: row;
`

export const ListSearchButtonText = styled.Text<StyledProps>`
    font-size: 20px;
    padding: 2px 0 0;
    color: ${props => props.$colors?.text || 'black'};
`

export const ListDropDownWrap = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`

export const ListDropDownMenuWrap = styled.View<StyledProps>`
    position: relative;
    width: 300px;
    border-radius: 10px;
    padding: 0;
    background-color: ${props => props.$colors?.card || '#fff'};

`

export const ListNoSearchResultWrap = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    
`

export const ListNoSearchResultText = styled.Text<StyledProps>`
    font-size: 15px;
    color: ${props => props.$colors?.text || 'black'};
`

export const ListWrap = styled.View<StyledProps>`
    flex-direction: row;
    padding: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.$colors?.border || '#eee'};
`;

export const ListThumbnail = styled.Image<StyledProps>`
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background-color: ${props => props.$colors?.card || '#e0e0e0'};
    margin-right: 15px;
`;

export const ListMainContent = styled.View`
    flex: 1;
    justify-content: center;
`;

export const ListHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

export const ListDateText = styled.Text<StyledProps>`
    font-size: 20px;
    color: ${props => props.$colors?.text || '#555'};
`;

export const ListTimeText = styled.Text<StyledProps>`
    font-size: 12px;
    color: ${props => props.$colors?.text || '#888'};
    margin: 5px;
`;

export const ListContent = styled.Text<StyledProps>`
    font-size: 14px;
    color: ${props => props.$colors?.text || '#666'};
    line-height: 20px;
    margin: 5px 8px 20px 0;
`;

export const ListStatsContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
`;

export const ListStatItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-right: 12px;
`;

export const ListStatText = styled.Text<StyledProps>`
    font-size: 12px;
    color: ${props => props.$colors?.text || '#777'};
    margin-left: 3px;
`;

export const ListTagsContainer = styled.View``;

export const ListTagsText = styled.Text<StyledProps>`
    font-size: 12px;
    color: ${props => props.$colors?.text || '#888'};
    font-style: italic;
`;


// ----------------- //
// I-Log Page View //
// ----------------- //

export const PageWrap = styled.View<StyledProps>`
    flex: 1;
    margin: 20px;
    background-color: ${props => props.$colors?.background || 'transparent'};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
`;

export const PageDateInfo = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`;

export const PageDateButton = styled.TouchableOpacity<StyledProps>`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    padding: 0 10px 3px 5px;
`

export const PageDateText = styled.Text<StyledProps>`
    font-size: 30px;
    font-weight: bold;
    padding-left: 5px;
    color: ${props => props.$colors?.text || 'black'};
`;

export const PageTimeText = styled.Text<StyledProps>`
    font-size: 14px;
    color: ${props => props.$colors?.text || '#888'};
`;

export const PageTitle = styled.Text<StyledProps>`
    font-size: 20px;
    font-weight: bold;
    border-left-width: 2px;
    border-right-width: 2px;
    border-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    padding: 0 10px;
    margin: 5px 0 15px;
    color: ${props => props.$colors?.text || 'black'};
`;

export const PageImageContainer = styled.View`
    width: 100%;
    height: 400px; 
    margin-bottom: 20px;
    position: relative;
`;

export const PageImage = styled.Image<StyledProps>`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: ${props => props.$colors?.card || '#e0e0e0'};
`;

export const PageStatsContainer = styled.View`
    position: absolute;
    bottom: 10px;
    right: 10px;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 5px 10px;
    border-radius: 15px;
`;

export const PageStatItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
`;

export const PageStatText = styled.Text`
    color: #fff;
    font-size: 14px;
    margin-left: 4px;
`;

export const PageContent = styled.Text<StyledProps>`
    font-size: 16px;
    line-height: 24px;
    color: ${props => props.$colors?.text || '#333'};
    margin-bottom: 20px;
    border-left-width: 2px;
    border-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    padding: 10px 20px;
`;

export const PageFriendTagsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const PageFriendTag = styled.View<StyledProps>`
    background-color: ${props => props.$colors?.card || '#eef2fa'};
    border-radius: 15px;
    padding: 6px 12px;
    margin: 4px;
`;

export const PageFriendTagText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || '#4c669f'};
    font-weight: bold;
`;

export const PageTagsContainer = styled.View``;

export const PageTagsText = styled.Text<StyledProps>`
    font-size: 15px;
    color: ${props => props.$colors?.text || '#888'};
`;

export const PageScrollView = styled.ScrollView``;

// ------------------ //
// I-Log Detail View  //
// ------------------ //

export const DetailHeader = styled.TouchableOpacity<StyledProps>`
    background-color: ${props => props.$colors?.background || '#fff'};
    padding: 15px;
    flex-direction: row;
    
    /* iOS Shadow */
    shadow-color: ${props => props.$colors?.text || '#000'};
    shadow-offset: 0px 2px; /* Corrected: Combined width and height into shadow-offset */
    shadow-opacity: 0.25;

    /* Android Shadow */
    elevation: 5;
`

export const DetailHeaderText = styled.Text<StyledProps>`
    position: sticky;
    padding-left: 10px;
    font-size: 20px;
    color: ${props => props.$colors?.text || 'black'};
`

export const DetailWrap = styled.View<StyledProps>`
    flex: 1;
    margin: 20px;
    background-color: ${props => props.$colors?.background || 'transparent'};
`

export const DetailDateWrap = styled.View`
    justify-content: space-between;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 20px;
`
export const DetailDateText = styled.Text<StyledProps>`
    font-size: 45px;
    font-weight: bold;
    padding-right: 5px;
    border-bottom-width: 3px;
    border-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    color: ${props => props.$colors?.text || 'black'};
`

export const DetailTimeText = styled.Text<StyledProps>`
    font-size: 14px;
    color: ${props => props.$colors?.text || '#888'};
    padding-top: 40px;
`

export const DetailActionsWrap = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
`;

export const DetailActionButton = styled.TouchableOpacity<StyledProps>`
    background-color: ${props => props.$colors?.card || 'lavender'};
    padding: 5px 10px;
    border-radius: 50px;
    
    /* Android Shadow */
    elevation: 5;
    /* iOS Shadow */
    shadow-color: ${props => props.$colors?.text || '#000'};
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
`;

export const DetailImageContainer = styled.View`
    width: 100%;
    height: 400px;
    margin-bottom: 20px;
    position: relative;
`

export const DetailImage = styled.Image<StyledProps>`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: ${props => props.$colors?.card || '#e0e0e0'};
`;

export const DetailStatsContainer = styled.View`
    position: absolute;
    bottom: 10px;
    right: 10px;
    flex-direction: row;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 5px 10px;
    border-radius: 15px;
`;

export const DetailStatItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
`;

export const DetailStatText = styled.Text`
    color: #fff;
    font-size: 14px;
    margin-left: 4px;
`;

export const DetailFriendTagsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const DetailFriendTag = styled.View<StyledProps>`
    background-color: ${props => props.$colors?.card || '#eef2fa'};
    border-radius: 15px;
    padding: 6px 12px;
    margin: 4px;
`;

export const DetailFriendTagText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || '#4c669f'};
    font-weight: bold;
`;

export const DetailContent = styled.Text<StyledProps>`
    font-size: 16px;
    line-height: 24px;
    color: ${props => props.$colors?.text || '#333'};
    margin-bottom: 20px;
    border-left-width: 2px;
    border-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    padding: 10px 20px;
`;

export const DetailTagsContainer = styled.View`
    width: 95%;
    margin: 0px auto 10px;
;`;

export const DetailTagsText = styled.Text<StyledProps>`
    font-size: 20px;
    color: ${props => props.$colors?.primary || 'mediumslateblue'};
`;

export const DetailModalBackdrop = styled.TouchableOpacity`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
`;

export const DetailModalContainer = styled.View<StyledProps>`
    background-color: ${props => props.$colors?.card || 'white'};
    padding: 20px;
    border-radius: 10px;
    width: 80%;
`;

export const DetailModalTitle = styled.Text<StyledProps>`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    text-align: center;
    color: ${props => props.$colors?.text || 'black'};
`;

export const DetailModalText = styled.Text<StyledProps>`
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    color: ${props => props.$colors?.text || 'black'};
`;

export const DetailModalButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
`;

const ModalButton = styled.TouchableOpacity`
    padding: 10px;
    border-radius: 5px;
    width: 45%;
    align-items: center;
`;

export const DetailModalCancelButton = styled(ModalButton)<StyledProps>`
    background-color: ${props => props.$colors?.border || '#ccc'};
`;

export const DetailModalDeleteButton = styled(ModalButton)<StyledProps>`
    background-color: ${props => props.$colors?.notification || 'red'};
`;

export const DetailModalButtonText = styled.Text<StyledProps & { color?: string }>`
    color: ${props => props.color || props.$colors?.text || 'black'};
    font-weight: bold;
`;

export const DetailLoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;


// ----------------- //
// Add I-Log View  //
// ----------------- //

// --- AddWrap 정의 변경 ---
const AddWrapComponent = (props: ScrollViewProps, ref: React.Ref<ScrollView>) => (
    <ScrollView {...props} ref={ref} />
);
const ForwardedAddWrap = React.forwardRef(AddWrapComponent);
export const AddWrap = styled(ForwardedAddWrap)`
    width: 100%;
`;

export const AddContentContainer = styled.View`
    padding-horizontal: 20px;
    position: sticky;
`;

export const AddHeader = styled.TouchableOpacity<StyledProps>`
    position: sticky;
    flex-direction: row;
    align-items: center;
    padding: 15px 30px;
    background-color: ${props => props.$colors?.background || '#fff'};
    justify-content: start;
    border-color: ${props => props.$colors?.border || '#9f9ff0'};
    border-bottom-width: 2px;
`;

export const AddHeaderText = styled.Text<StyledProps>`
    font-size: 30px;
    color: ${props => props.$colors?.primary || 'mediumslateblue'};
`

export const AddIconWrap = styled.View`
    margin-right: 10px;
    border-radius: 50px;
`

export const AddInput = styled.TextInput.attrs<StyledProps>(props => ({
    placeholderTextColor: props.$colors?.text || '#9f9ff0',
    cursorColor: props.$colors?.primary || 'mediumslateblue'
}))<StyledProps>`
    width: 95%;
    border-color: ${props => props.$colors?.primary || 'mediumslateblue'};
    border-bottom-width: 2px;
    padding: 15px;
    font-size: 30px;
    background-color: ${props => props.$colors?.background || '#fff'};
    color: ${props => props.$colors?.text || 'mediumslateblue'};
`;

export const AddTextArea = styled(AddInput)<StyledProps & { height?: number }>`
    height: ${props => props.height || 200}px; /* 기본 높이 300px로 변경 */
    text-align-vertical: top;
    font-size: 15px;
    border-color: ${props => props.$colors?.border || '#B5B5E9'};
    border-top-width: 2px;
    border-bottom-width: 2px;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 75px;
    position: relative;
`;

export const AddImagePickerText = styled.Text<StyledProps>`
    position: absolute;
    padding: 5px 10px;
    bottom: 15px;
    left: 15px;
    font-size: 15px;
    opacity: 0.8;
    color: ${props => props.$colors?.text || '#fff'};
    background-color: ${props => props.$colors?.card || '#ccc'};
    border-radius: 10px;
    /* iOS Shadow */
    shadow-color: ${props => props.$colors?.text || '#000'};
    shadow-offset: 0px 2px; /* Corrected: Combined width and height into shadow-offset */
    shadow-opacity: 0.25;

    /* Android Shadow (기존 코드) */
    elevation: 5;

`;

export const AddImagePreview = styled.Image`
    width: 100%;
    height: 375px;
    border-radius: 8px;
    margin: 20px 0 10px;
`;

export const AddImagePlaceholder = styled.TouchableOpacity<StyledProps>`
    width: 100%;
    height: 375px;
    border-radius: 8px;
    margin: 20px 0 10px;
    background-color: ${props => props.$colors?.card || '#f0f0f0'};
    justify-content: center;
    align-items: center;
    border: 2px dashed ${props => props.$colors?.border || '#ccc'};
`;

export const AddImageRemoveButton = styled.TouchableOpacity`
    position: absolute;
    top: 30px;
    right: 10px;
    z-index: 1;
    border-radius: 15px;
    padding: 2px;
    
    /* Android Shadow */
    elevation: 10;
    /* iOS Shadow */
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
`;

export const AddSuggestionContainer = styled.View<StyledProps & { $bottom?: number }>`
    position: absolute; /* 절대 위치로 변경 */
    left: 0;
    right: 0;
    background-color: ${props => props.$colors?.card || 'lavender'};
    z-index: 10; /* 다른 요소 위에 표시 */
    bottom: ${props => props.$bottom || 0}px; /* $bottom prop 적용 */
`;

export const AddSuggestionButton = styled.TouchableOpacity<StyledProps>`
    background-color: ${props => props.$colors?.background || '#fff'};
    border: 1px solid ${props => props.$colors?.primary || 'mediumslateblue'};
    padding: 8px 12px;
    border-radius: 50px;
    margin: 10px;
`;

export const AddSuggestionButtonText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.primary || 'mediumslateblue'};
    font-weight: bold;
`;

export const AddTagBadgeContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 0;
    margin-bottom: 10px;
    width: 100%;
`;

export const AddTagBadge = styled.View<StyledProps>`
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.$colors?.primary || '#7B68EE'};
    border-radius: 15px;
    padding: 6px 10px;
    margin: 4px;
`;

export const AddTagBadgeText = styled.Text<StyledProps>`
    color: ${props => props.$colors?.text || '#fff'};
    font-weight: bold;
    margin-right: 5px;
`;

export const AddButtonWrap = styled.View<StyledProps>`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${props => props.$colors?.background || '#fff'};
`


export const AddSaveButton = styled.TouchableOpacity<StyledProps>`
    width: 50%;
    border: 2px solid ${props => props.$colors?.border || 'lavender'};
`

export const AddCancelButton = styled.TouchableOpacity<StyledProps>`
    width: 50%;
    border: 2px solid ${props => props.$colors?.border || 'lavender'};
    border-right-width: 0;
    
`

export const AddButtonText = styled.Text<StyledProps>`
    font-size: 25px;
    text-align: center;
    padding: 15px;
    color: ${props => props.$colors?.primary || 'mediumslateblue'};
`
