import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import {format} from "date-fns";
import * as BS from "@/components/style/BottomSheetStyled";
import {Schedule} from "@/components/calendar/scheduleTypes";
<<<<<<< HEAD:components/ToDo/ToDo.tsx
=======
import {ScheduleTextsWrap} from "@/components/style/BottomSheetStyled";
>>>>>>> 18cf6a90759187cbac38b1a2b827cb97ff55c676:components/todo/ToDo.tsx

interface ToDoProps {
    item: Schedule;
}

// ToDo 컴포넌트의 주요 내용(체크박스, 텍스트)을 담는 하위 컴포넌트입니다.
interface ToDoMainContentProps {
    title: string;
    date: string;
    time: string;
}

export const ToDoMainContent: React.FC<ToDoMainContentProps> = ({title, date, time}) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <BS.ScheduleTextsWrap>
            <BS.ScheduleLeftWrap>
                <TouchableOpacity onPress={() => setIsChecked(prev => !prev)}>
                    <BS.ScheduleCheckBox
                        name={isChecked ? 'check-circle-outline' : 'radio-button-unchecked'}
                    />
                </TouchableOpacity>
                <BS.ScheduleTextWrap>
                    <BS.ScheduleDayWrap>
                        <BS.ScheduleDate $isChecked={isChecked}> {date}</BS.ScheduleDate>
                        <BS.ScheduleTime $isChecked={isChecked}> {time}</BS.ScheduleTime>
                    </BS.ScheduleDayWrap>
                    <BS.ScheduleTitle $isChecked={isChecked}>{title}</BS.ScheduleTitle>
                </BS.ScheduleTextWrap>
            </BS.ScheduleLeftWrap>
        </BS.ScheduleTextsWrap>
    );
};

export const ToDo: React.FC<ToDoProps> = ({item}) => {
    // 'Schedule' 타입에는 'state'와 'icon' 속성이 없어, 임시 값을 사용합니다.
    // 추후 Schedule 타입에 해당 속성을 추가해야 할 수 있습니다.
    const state = "Planning"; // Placeholder

    return (
        <BS.ScheduleWrap>
            <BS.ScheduleState> {state} </BS.ScheduleState>
            <BS.ScheduleListWrap>
                <ToDoMainContent
                    title={item.title}
                    date={format(item.startTime, "yyyy / MM / dd")}
                    time={format(item.startTime, "HH:mm")}
                />
            </BS.ScheduleListWrap>
        </BS.ScheduleWrap>
    )
}