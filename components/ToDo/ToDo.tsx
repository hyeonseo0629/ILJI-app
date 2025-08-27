import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import {
    BSToDoWrap,
    BSToDoState,
    BSToDoLeftWrap,
    BSToDoCheckBox,
    BSToDoTextWrap,
    BSToDoDayWrap,
    BSToDoDate,
    BSToDoTime,
    BSToDoTitle,
    BSToDoIcon, BSToDoListWrap, BSToDoTextsWarp
} from "@/components/bottomSheet/BottomSheetStyled";

interface ToDoProps {
    title: string;
    date: string;
    time: string;
    state: string;
    icon: string;
}

// ToDo 컴포넌트의 주요 내용(체크박스, 텍스트)을 담는 하위 컴포넌트입니다.
interface ToDoMainContentProps {
    title: string;
    date: string;
    time: string;
    icon: string;
}

export const ToDoMainContent: React.FC<ToDoMainContentProps> = ({title, date, time, icon}) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <BSToDoTextsWarp>
        <BSToDoLeftWrap>
            <TouchableOpacity onPress={() => setIsChecked(prev => !prev)}>
                <BSToDoCheckBox
                    name={isChecked ? 'check-circle-outline' : 'radio-button-unchecked'}
                />
            </TouchableOpacity>
            <BSToDoTextWrap>
                <BSToDoDayWrap>
                    <BSToDoDate $isChecked={isChecked}> {date}</BSToDoDate>
                    <BSToDoTime $isChecked={isChecked}> {time}</BSToDoTime>
                </BSToDoDayWrap>
                <BSToDoTitle $isChecked={isChecked}>{title}</BSToDoTitle>
            </BSToDoTextWrap>
        </BSToDoLeftWrap>
        <BSToDoIcon $isChecked={isChecked}>{icon}</BSToDoIcon>
        </BSToDoTextsWarp>
    );
};

export const ToDo: React.FC<ToDoProps> = ({title, date, time, state, icon}) => {
    return (
        <BSToDoWrap>
            <BSToDoState> {state} </BSToDoState>
            <BSToDoListWrap>
                <ToDoMainContent
                    title={title}
                    date={date}
                    time={time}
                    icon={icon}
                />
                <ToDoMainContent
                    title={title}
                    date={date}
                    time={time}
                    icon={icon}
                />
            </BSToDoListWrap>
        </BSToDoWrap>
    )
}