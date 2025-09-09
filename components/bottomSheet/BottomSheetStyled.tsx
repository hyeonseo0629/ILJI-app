import styled from "styled-components/native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export const BSContainer = styled.View`
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    padding: 10px;
`

// ------ //
// Header //
// ------ //

export const BSHeader = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const BSHeaderLeft = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: 20px; /* 아이콘 좌측 여백 추가 */
`

export const TagEditBTN = styled.TouchableOpacity`
    padding: 10px;
`

export const BSHeaderRight = styled.View`
    padding: 5px;
    flex-direction: row;
    align-items: center; /* 아이콘과 텍스트의 수직 정렬을 맞춥니다. */
`

export const BSTodayText = styled.Text`
    padding: 10px 0;
    font-size: 15px;
`

export const BSToDoAddButton = styled(AntDesign)`
    margin-left: 10px;
    padding: 10px 0; /* 터치 영역 확보 및 수직 정렬 */
    color: mediumslateblue;
`

// ------- //
// Content //
// ------- //

export const BSContentWrap = styled.View`
    position: relative;
    padding: 20px;
    width: 100%;
`

export const BSToDoListWrap = styled.View`

`

export const BSToDoWrap = styled.View`
    border-color: #555;
    border-bottom-width: 1px;
    border-top-width: 1px;
    flex-direction: row;
    margin: 10px 0;
    padding: 10px;
    justify-content: space-between;
`

export const BSToDoState = styled.Text`
    position: absolute;
    font-size: 18px;
    top: -16px;
    background-color: #ffffff;
    text-align: center;
    padding: 0 5px 0 0;
`

export const BSToDoCheckBox = styled(MaterialIcons).attrs({
    // 체크박스의 기본 크기를 설정합니다.
    size: 28,
})`
    /* 체크박스의 색상을 지정합니다. */
    color: mediumslateblue;
`

interface TextProps {
    $isChecked?: boolean;
}

export const BSToDoTextsWarp = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const BSToDoLeftWrap = styled.View`
    flex-direction: row;
`

export const BSToDoTextWrap = styled.View`
    margin-left: 10px;
`

export const BSToDoDayWrap = styled.View`
flex-direction: row;
`

export const BSToDoDate = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? '#ccc' : '#8e8e93')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const BSToDoTime = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? '#ccc' : '#8e8e93')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const BSToDoTitle = styled.Text<TextProps>`
    font-size: 25px;
    font-weight: bold;
    padding: 5px 10px 0;
    color: ${(props) => (props.$isChecked ? '#aaa' : '#333')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const BSToDoIcon = styled.Text<TextProps>`
    font-size: 50px;
    opacity: ${(props) => (props.$isChecked ? 0.4 : 1)};
`