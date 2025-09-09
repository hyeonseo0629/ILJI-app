import styled from "styled-components/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';


export const Container = styled.View`
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 10px;
`

export const Header = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const HeaderLeft = styled.View`
    padding: 5px;
`

export const HeaderRight = styled.View`
    padding: 5px;
    flex-direction: row;
`

export const TodayText = styled.Text`
    padding: 10px 0;
    font-size: 15px;
`

export const ScheduleAddButton = styled(AntDesign).attrs({})`
    margin-left: 10px;
    padding: 10px 5px;
`

export const ContentWrap = styled.View`
    position: relative;
    padding: 20px;
    width: 100%;
`

export const ScheduleListWrap = styled.View`

`

export const ScheduleWrap = styled.View`
    border-color: #555;
    border-bottom-width: 1px;
    border-top-width: 1px;
    flex-direction: row;
    margin: 10px 0;
    padding: 10px;
    justify-content: space-between;
`

export const ScheduleState = styled.Text`
    position: absolute;
    font-size: 18px;
    top: -16px;
    background-color: #ffffff;
    text-align: center;
    padding: 0 5px 0 0;
`

export const ScheduleCheckBox = styled(MaterialIcons).attrs({
    size: 28,
})`
    color: mediumslateblue;
`

interface TextProps {
    $isChecked?: boolean;
}

export const ScheduleTextsWarp = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const ScheduleLeftWrap = styled.View`
    flex-direction: row;
`

export const ScheduleTextWrap = styled.View`
    margin-left: 10px;
`

export const ScheduleDayWrap = styled.View`
flex-direction: row;
`

export const ScheduleDate = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? '#ccc' : '#8e8e93')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleTime = styled.Text<TextProps>`
    font-size: 20px;
    padding: 2px 5px;
    color: ${(props) => (props.$isChecked ? '#ccc' : '#8e8e93')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleTitle = styled.Text<TextProps>`
    font-size: 25px;
    font-weight: bold;
    padding: 5px 10px 0;
    color: ${(props) => (props.$isChecked ? '#aaa' : '#333')};
    text-decoration-line: ${(props) => (props.$isChecked ? 'line-through' : 'none')};
`

export const ScheduleIcon = styled.Text<TextProps>`
    font-size: 50px;
    opacity: ${(props) => (props.$isChecked ? 0.4 : 1)};
`