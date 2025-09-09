import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';


// --------- //
// Container //
// --------- //

export const ScreenContainer = styled.View<{ $paddingTop?: number; $paddingBottom?: number; }>`
    flex: 1;
    background-color: lavender;
    padding-top: ${props => props.$paddingTop || 0}px;
    padding-bottom: ${props => props.$paddingBottom || 0}px;
`;

export const Container = styled.View`
    flex: 1;
    background-color: #ffffff;
`;

export const ButtonIconWrap = styled.TouchableOpacity`
     position: absolute;
     bottom: 15px;
     right: 15px;
 `

 export const ButtonIcon = styled(MaterialCommunityIcons).attrs({
     size: 40
 })`
     background-color: rgba(230, 230, 250, 0.7);
     border-radius: 50px;
     padding: 15px;
     margin: 5px;
     border: 2px solid #7B68EE;
 `;

// --- //
// Tab //
// --- //
interface TabButtonProps {
    $isActive?: boolean;
}

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
    border-bottom-color: ${(props) => (props.$isActive ? '#7B68EE' : '#f0f0f0')};
`

export const TabsButtonText = styled.Text`
    font-weight: bold;
`

// ----------------- //
// I-Log List View //
// ----------------- //

export const ListWrap = styled.View`
    flex-direction: row;
    padding: 15px;
    border-bottom-width: 1px;
    border-bottom-color: #eee;
`;

export const ListThumbnail = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background-color: #e0e0e0;
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
    margin-bottom: 4px;
`;

export const ListDateText = styled.Text`
    font-size: 13px;
    color: #555;
`;

export const ListTimeText = styled.Text`
    font-size: 12px;
    color: #888;
`;

export const ListTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
`;

export const ListContent = styled.Text`
    font-size: 14px;
    color: #666;
    line-height: 20px;
    margin-bottom: 8px;
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

export const ListStatText = styled.Text`
    font-size: 12px;
    color: #777;
    margin-left: 3px;
`;

export const ListTagsContainer = styled.View``;

export const ListTagsText = styled.Text`
    font-size: 12px;
    color: #888;
    font-style: italic;
`;


// ----------------- //
// I-Log Page View //
// ----------------- //

export const PageWrap = styled.View`
    flex: 1;
    margin: 20px;
`;

export const PageHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
`;

export const PageDateInfo = styled.View``;

export const PageDateText = styled.Text`
    font-size: 24px;
    font-weight: bold;
`;

export const PageTimeText = styled.Text`
    font-size: 14px;
    color: #888;
    margin-top: 4px;
`;

export const PageTitle = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 15px;
`;

export const PageImageContainer = styled.View`
    width: 100%;
    height: 400px; 
    margin-bottom: 10px;
    position: relative;
`;

export const PageImage = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: #e0e0e0;
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

export const PageContent = styled.Text`
    font-size: 16px;
    line-height: 24px;
    color: #333;
    margin-bottom: 20px;
`;

export const PageFriendTagsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const PageFriendTag = styled.View`
    background-color: #eef2fa;
    border-radius: 15px;
    padding: 6px 12px;
    margin: 4px;
`;

export const PageFriendTagText = styled.Text`
    color: #4c669f;
    font-weight: bold;
`;

export const PageTagsContainer = styled.View``;

export const PageTagsText = styled.Text`
    font-size: 14px;
    color: #888;
    font-style: italic;
`;

export const PageScrollView = styled.ScrollView``;

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
`;

export const AddHeader = styled.View`
    padding: 15px;
    margin-bottom: 20px;
    background-color: #fff; /* 배경색 추가 */
    justify-content: start;
    align-items: center;
`;

export const AddInput = styled.TextInput.attrs({
    placeholderTextColor: '#9f9ff0',
    cursorColor: 'mediumslateblue'
})`
    width: 95%;
    border-color: mediumslateblue;
    border-bottom-width: 2px;
    padding: 15px;
    font-size: 30px;
    background-color: #fff;
    color: mediumslateblue;
`;

export const AddTextArea = styled(AddInput)<{ height?: number }>`
    height: ${props => props.height || 200}px; /* 기본 높이 300px로 변경 */
    text-align-vertical: top;
    font-size: 15px;
    border-color: #B5B5E9;
    border-top-width: 2px;
    border-bottom-width: 2px;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 75px;
    position: relative;
`;

export const AddImagePickerText = styled.Text`
    position: absolute;
    padding: 5px 10px;
    bottom: 15px;
    left: 15px;
    font-size: 15px;
    opacity: 0.8;
    color: #fff;
    background-color: #ccc;
    border-radius: 10px;
    /* iOS Shadow */
    shadow-color: #000;
    shadow-offset-width: 0;
    shadow-offset-height: 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;

    /* Android Shadow (기존 코드) */
    elevation: 5;

`;

export const AddImagePreview = styled.Image`
    width: 100%;
    height: 375px;
    border-radius: 8px;
    margin-bottom: 15px;
`;

export const AddImagePlaceholder = styled.TouchableOpacity`
    width: 100%;
    height: 375px;
    border-radius: 8px;
    margin-bottom: 15px;
    background-color: #f0f0f0;
    justify-content: center;
    align-items: center;
    border: 2px dashed #ccc;
`;

export const AddImageRemoveButton = styled.TouchableOpacity`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    padding: 2px;
`;

export const AddSuggestionContainer = styled.View<{ $bottom?: number }>`
    position: absolute; /* 절대 위치로 변경 */
    left: 0;
    right: 0;
    background-color: lavender;
    z-index: 10; /* 다른 요소 위에 표시 */
    bottom: ${props => props.$bottom || 0}px; /* $bottom prop 적용 */
`;

export const AddSuggestionButton = styled.TouchableOpacity`
    background-color: #fff;
    border: 1px solid mediumslateblue;
    padding: 8px 12px;
    border-radius: 50px;
    margin: 10px;
`;

export const AddSuggestionButtonText = styled.Text`
    color: mediumslateblue;
    font-weight: bold;
`;

export const AddTagBadgeContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 0;
    margin-bottom: 10px;
    width: 100%;
`;

export const AddTagBadge = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #7B68EE;
    border-radius: 15px;
    padding: 6px 10px;
    margin: 4px;
`;

export const AddTagBadgeText = styled.Text`
    color: #fff;
    font-weight: bold;
    margin-right: 5px;
`;

export const AddButtonWrap = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
`


export const AddSaveButton = styled.TouchableOpacity`
    width: 50%;
    border: 2px solid lavender;
`

export const AddCancelButton = styled.TouchableOpacity`
    width: 50%;
    border: 2px solid lavender;
    border-right-width: 0;
    
`

export const AddButtonText = styled.Text`
    font-size: 25px;
    text-align: center;
    padding: 15px;
    color: mediumslateblue;
`
