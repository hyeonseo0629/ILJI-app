import styled from "styled-components/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


// --------- //
// Container //
// --------- //

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

export const AddWrap = styled.ScrollView`
    padding: 20px;
`;

export const AddHeader = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

export const AddInput = styled.TextInput`
    border-width: 1px;
    border-color: #ccc;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    font-size: 16px;
    background-color: #fff;
`;

export const AddTextArea = styled(AddInput)`
    height: 250px;
    text-align-vertical: top;
`;

export const AddImagePickerButton = styled.TouchableOpacity`
    background-color: #e0e0e0;
    padding: 15px;
    border-radius: 8px;
    align-items: center;
    margin-bottom: 15px;
`;

export const AddImagePickerText = styled.Text`
    font-size: 16px;
    color: #333;
`;

export const AddImagePreview = styled.Image`
    width: 100%;
    height: 200px;
    border-radius: 8px;
    margin-bottom: 15px;
`;

export const AddSuggestionContainer = styled.View`
    position: absolute; /* 절대 위치로 변경 */
    left: 0;
    right: 0;
    background-color: #f9f9f9;
    border-top-width: 1px;
    border-top-color: #eee;
    padding: 10px 0;
    z-index: 10; /* 다른 요소 위에 표시 */
`;

export const AddSuggestionButton = styled.TouchableOpacity`
    background-color: #eef2fa;
    padding: 8px 12px;
    border-radius: 15px;
    margin-right: 8px;
`;

export const AddSuggestionButtonText = styled.Text`
    color: #4c669f;
    font-weight: bold;
`;

export const AddTagBadgeContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px 0;
    margin-bottom: 10px;
    border-top-width: 1px;
    border-top-color: #eee;
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

export const AddTagBadgeDeleteButton = styled.TouchableOpacity``;
