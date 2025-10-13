import React from "react";
import { format } from "date-fns";
import * as BS from "@/components/style/BottomSheetStyled";
import { Schedule } from "@/components/calendar/scheduleTypes";
import { useSchedule } from "@/src/context/ScheduleContext";
import { TouchableOpacity } from "react-native";
import { ThemeColors } from "@/types/theme";


interface TaggedScheduleProps {
    item: Schedule;
    colors: ThemeColors;
    onPress: (schedule: Schedule) => void;
}

interface ToDoMainContentProps {
    title: string;
    date: string;
    time: string;
    icon: string;
    colors: ThemeColors;
}

export const TaggedSchedule: React.FC<TaggedScheduleProps> = ({ item, colors, onPress }) => {
    const { tags } = useSchedule();
    const tagColor = tags.find(tag => tag.id === item.tagId)?.color || 'gray';

    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <BS.ScheduleWrap $colors={colors}>
                <BS.VerticalBar color={tagColor} />
                <BS.ScheduleTextWrap>
                    <BS.ScheduleTitle  $colors={colors}>{item.title}</BS.ScheduleTitle>
                    <BS.ScheduleDateTime>
                        {format(item.startTime, "yyyy-MM-dd HH:mm")}
                    </BS.ScheduleDateTime>
                </BS.ScheduleTextWrap>
            </BS.ScheduleWrap>
        </TouchableOpacity>
    );
};
