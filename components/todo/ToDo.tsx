import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { format } from "date-fns";
import { MaterialIcons } from '@expo/vector-icons';
import * as BS from "@/components/style/BottomSheetStyled";
import { Schedule } from "@/components/calendar/scheduleTypes";

interface ToDoProps {
    item: Schedule;
    onPress: (schedule: Schedule) => void;
}

export const ToDo: React.FC<ToDoProps> = ({ item, onPress }) => {
    const [isChecked, setIsChecked] = useState(false);

    // isAllDay가 아니고, 시작 시간과 종료 시간이 다를 경우 시간 범위를 표시합니다.
    const timeString = !item.isAllDay && item.startTime !== item.endTime
        ? `${format(new Date(item.startTime), "HH:mm")} - ${format(new Date(item.endTime), "HH:mm")}`
        : "All Day";

    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <BS.ScheduleWrap>
                {/* VerticalBar는 BottomSheetStyled에 정의되어 있습니다. */}
                {/* <BS.VerticalBar color={item.color || 'gray'} /> */}
                <TouchableOpacity onPress={() => setIsChecked(prev => !prev)} style={{ marginRight: 12 }}>
                    <MaterialIcons
                        name={isChecked ? 'check-circle' : 'radio-button-unchecked'}
                        size={24}
                        color={isChecked ? 'lightgray' : '#9970FF'}
                    />
                </TouchableOpacity>

                <BS.ScheduleTextWrap>
                    <BS.ScheduleTitle style={{ textDecorationLine: isChecked ? 'line-through' : 'none', color: isChecked ? 'lightgray' : '#333' }}>
                        {item.title}
                    </BS.ScheduleTitle>
                    <BS.ScheduleDateTime style={{ textDecorationLine: isChecked ? 'line-through' : 'none', color: isChecked ? 'lightgray' : '#8e8e93' }}>
                        {timeString}
                    </BS.ScheduleDateTime>
                </BS.ScheduleTextWrap>
            </BS.ScheduleWrap>
        </TouchableOpacity>
    );
};