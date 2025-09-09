import styled from 'styled-components/native';


export const ASContainer = styled.ScrollView`
    flex: 1;
    background-color: #ffffff;
`;


export const ASHeader = styled.Text`
    margin: 30px 30px 0;
    font-size: 35px;
    padding-bottom: 10px;
    width: 85%;
    border-bottom-width: 3px;
    border-bottom-color: lavender;
    color: mediumslateblue;
`

export const ASContentWrap = styled.View`
    padding: 5px 50px 25px;
`;


export const ASLabel = styled.Text`
    font-size: 25px;
    font-weight: bold;
    color: mediumslateblue;
    margin-top: 20px;
    margin-bottom: 10px;
`;

export const ASInput = styled.TextInput.attrs({
    placeholderTextColor: "#9f9ff0",
})`
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 16px;
    background-color: lavender;
    color: mediumslateblue;
    margin-bottom: 20px;
`;

export const ASPickerWrap = styled.View`
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: lavender;
    justify-content: center;
    margin-bottom: 20px;
`;

export const ASSwitchRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

export const ASDateTimeRow = styled.View`
    flex-direction: row;
    gap: 10px;
    margin-bottom: 20px; /* 버튼 대신 행 전체에 하단 여백을 주어 일관성을 높입니다. */
`;

export const ASDateTimeButton = styled.TouchableOpacity`
    flex: 1; /* 버튼이 사용 가능한 공간을 모두 차지하도록 하여, 1개일 땐 100%, 2개일 땐 50%씩 나눠 갖게 합니다. */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    background-color: lavender;
    align-items: center;
`;

export const ASDateTimeButtonText = styled.Text`
    font-size: 16px;
    color: mediumslateblue;
    font-weight: bold;
`;

export const ASSelectedTagWrap = styled.View`
     flex-direction: row;
     flex-wrap: wrap; /* 태그가 여러 개일 경우 줄바꿈을 허용합니다. */
     margin-top: 10px;
 `;

export const ASSelectedTag = styled.View<{ color: string }>`
     flex-direction: row;
     align-items: center;
     background-color: ${(props) => props.color};
     border-radius: 16px;
     padding: 6px 12px; 
    margin-bottom: 30px;
`;

export const ASSelectedTagText = styled.Text`
     color: #ffffff;
     font-weight: bold;
     font-size: 14px;
 `;

export const ASButtonWrap = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    border: 2px solid #f0f0f0;
`

export const ASSaveButton = styled.TouchableOpacity`
    width: 50%;
    background-color: #ffffff;
    color: mediumslateblue;
    padding: 20px;
    align-items: center;
    border-right-width: 2px;
    border-right-color: #f0f0f0;
`;

export const ASCancelButton = styled.TouchableOpacity`
    width: 50%;
    background-color: #ffffff;
    padding: 20px;
    align-items: center;
`

export const ASCancelButtonText = styled.Text`
    color: mediumslateblue;
    font-size: 25px;
    font-weight: bold
`

export const ASSaveButtonText = styled.Text`
    color: mediumslateblue;
    font-size: 25px;
    font-weight: bold;
`;