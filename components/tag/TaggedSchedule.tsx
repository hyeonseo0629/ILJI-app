import React, {useState} from "react";
import {TouchableOpacity} from "react-native";
import {format} from "date-fns";
import * as BS from "@/components/style/BottomSheetStyled";
import {Schedule} from "@/components/calendar/scheduleTypes";
import { ThemeColors } from "@/types/theme";

interface ToDoProps {
    item: Schedule;
    colors: ThemeColors;
}

interface ToDoMainContentProps {
    title: string;
    date: string;
    time: string;
    icon: string;
    colors: ThemeColors;
}

export const ScheduleMainContent: React.FC<ToDoMainContentProps> = ({title, date, time, icon, colors}) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <BS.ScheduleTextsWrap>
            <BS.ScheduleLeftWrap>
                <TouchableOpacity onPress={() => setIsChecked(prev => !prev)}>
                    <BS.ScheduleCheckBox
                        name={isChecked ? 'check-circle-outline' : 'radio-button-unchecked'}
                        $colors={colors}
                    />
                </TouchableOpacity>
                <BS.ScheduleTextWrap>
                    <BS.ScheduleDayWrap>
                        <BS.ScheduleDate $isChecked={isChecked} $colors={colors}>{date}</BS.ScheduleDate>
                        <BS.ScheduleTime $isChecked={isChecked} $colors={colors}>{`${time}`}</BS.ScheduleTime>
                    </BS.ScheduleDayWrap>
                    <BS.ScheduleTitle $isChecked={isChecked} $colors={colors}>{title}</BS.ScheduleTitle>
                </BS.ScheduleTextWrap>
            </BS.ScheduleLeftWrap>
        </BS.ScheduleTextsWrap>
    );
};

export const TaggedSchedule: React.FC<ToDoProps> = ({item, colors}) => {
    const state = "Planning";
    const icon = "📖";

    return (
        <BS.ScheduleWrap $colors={colors}>
            <BS.ScheduleState $colors={colors}>{state}</BS.ScheduleState>
            <BS.ScheduleListWrap>
                <ScheduleMainContent
                    title={item.title}
                    date={format(item.startTime, "yyyy / MM / dd")}
                    time={format(item.startTime, "HH:mm")}
                    icon={icon}
                    colors={colors}
                />
            </BS.ScheduleListWrap>
        </BS.ScheduleWrap>
    )
}