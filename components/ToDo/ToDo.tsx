import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import {format} from "date-fns";
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
import {Schedule} from "@/components/calendar/types";

interface ToDoProps {
    item: Schedule;
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

export const ToDo: React.FC<ToDoProps> = ({item}) => {
    // 'Schedule' 타입에는 'state'와 'icon' 속성이 없어, 임시 값을 사용합니다.
    // 추후 Schedule 타입에 해당 속성을 추가해야 할 수 있습니다.
    const state = "Planning"; // Placeholder
    const icon = "📖"; // Placeholder

    return (
        <BSToDoWrap>
            <BSToDoState> {state} </BSToDoState>
            <BSToDoListWrap>
                <ToDoMainContent
                    title={item.title}
                    date={format(item.startTime, "yyyy / MM / dd")}
                    time={format(item.startTime, "HH:mm")}
                    icon={icon}
                />
            </BSToDoListWrap>
        </BSToDoWrap>
    )
}