import React from "react";
import { format } from "date-fns";
import * as BS from "@/components/style/BottomSheetStyled";
import { Schedule } from "@/components/calendar/scheduleTypes";
import { useSchedule } from "@/src/context/ScheduleContext";
import { TouchableOpacity } from "react-native";

interface TaggedScheduleProps {
    item: Schedule;
    onPress: (schedule: Schedule) => void;
}

export const TaggedSchedule: React.FC<TaggedScheduleProps> = ({ item, onPress }) => {
    const { tags } = useSchedule();
    const tagColor = tags.find(tag => tag.id === item.tagId)?.color || 'gray';

    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <BS.ScheduleWrap>
                <BS.VerticalBar color={tagColor} />
                <BS.ScheduleTextWrap>
                    <BS.ScheduleTitle>{item.title}</BS.ScheduleTitle>
                    <BS.ScheduleDateTime>
                        {format(item.startTime, "yyyy-MM-dd HH:mm")}
                    </BS.ScheduleDateTime>
                </BS.ScheduleTextWrap>
            </BS.ScheduleWrap>
        </TouchableOpacity>
    );
};
