import {TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import { useRouter } from "expo-router";
import * as BS from "@/components/style/BottomSheetStyled";
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {TaggedSchedule} from "@/components/tag/TaggedSchedule";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {Tag} from "@/components/tag/TagTypes";

interface BottomSheetContentProps {
    schedules: Schedule[];
    tags: Tag[];
    activeTab: string; // e.g., "Work", "Personal", "Study"
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({schedules, tags, activeTab}) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState('latest');
    const pickerItems = [
        {label: "latest", value: "latest"},
        {label: "oldest", value: "oldest"},
        {label: "priority", value: "priority"},
    ];

    // 1. activeTab(태그 라벨)에 해당하는 스케줄만 필터링합니다.
    const filteredSchedules = useMemo(() => {
        // 현재 활성화된 탭의 라벨과 일치하는 태그를 찾습니다.
        const currentTag = tags.find(tag => tag.label === activeTab);

        // 해당 태그가 없으면 빈 배열을 반환합니다.
        if (!currentTag) {
            return [];
        }

        // 찾은 태그의 ID와 일치하는 스케줄만 필터링합니다.
        return schedules.filter(schedule => schedule.tagId === currentTag.id);
    }, [activeTab, schedules, tags]);

    return (
        <BS.Container>
            <BS.Header>
                <BS.HeaderLeft>
                    <SortByPicker
                        items={pickerItems}
                        selectedValue={sortBy}
                        onValueChange={setSortBy}
                    />
                </BS.HeaderLeft>
                <BS.HeaderRight>
                    <BS.TodayText>{format(new Date(), "yyyy-MM-dd")}</BS.TodayText>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/add-schedule', params: { tags: JSON.stringify(tags) } })}>
                        <BS.ScheduleAddButton name="pluscircleo" size={20}/>
                    </TouchableOpacity>
                </BS.HeaderRight>
            </BS.Header>
            <BottomSheetScrollView style={{flex:1}}>
                <BS.ContentWrap>
                    {/* 2. 필터링된 스케줄 목록을 화면에 렌더링합니다. */}
                    {filteredSchedules.map(schedule => (
                        <TaggedSchedule key={schedule.id} item={schedule} />
                    ))}
                </BS.ContentWrap>
            </BottomSheetScrollView>
        </BS.Container>
    );
}