import React from "react";
import {format} from "date-fns";
import * as BS from "@/components/style/BottomSheetStyled";
import {Schedule} from "@/components/calendar/scheduleTypes";

interface ToDoProps {
    item: Schedule;
}

// TaggedSchedule 컴포넌트의 주요 내용(텍스트)을 담는 하위 컴포넌트입니다.
interface ToDoMainContentProps {
    title: string;
    date: string;
    time: string;
}

export const ScheduleMainContent: React.FC<ToDoMainContentProps> = ({title, date, time}) => {
    return (
        <BS.ScheduleTextsWrap>
            <BS.ScheduleLeftWrap>
                <BS.ScheduleTextWrap>
                    <BS.ScheduleDayWrap>
                        <BS.ScheduleDate>{date}</BS.ScheduleDate>
                        <BS.ScheduleTime>{time}</BS.ScheduleTime>
                    </BS.ScheduleDayWrap>
                    <BS.ScheduleTitle>{title}</BS.ScheduleTitle>
                </BS.ScheduleTextWrap>
            </BS.ScheduleLeftWrap>
        </BS.ScheduleTextsWrap>
    );
};

export const TaggedSchedule: React.FC<ToDoProps> = ({item}) => {
    return (
        <BS.ScheduleWrap>
            <BS.ScheduleListWrap>
                <ScheduleMainContent
                    title={item.title}
                    date={format(item.startTime, "yyyy / MM / dd")}
                    time={format(item.startTime, "HH:mm")}
                />
            </BS.ScheduleListWrap>
        </BS.ScheduleWrap>
    )
}