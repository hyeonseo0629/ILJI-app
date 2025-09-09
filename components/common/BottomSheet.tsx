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

    const filteredSchedules = useMemo(() => {
        const currentTag = tags.find(tag => tag.label === activeTab);
        if (!currentTag) {
            return [];
        }
        return schedules.filter(schedule => schedule.tagId === currentTag.id);
    }, [activeTab, schedules, tags]);

    // 1. 핸들러 함수 분리
    const handleAddSchedulePress = () => {
        router.push({ pathname: '/add-schedule', params: { tags: JSON.stringify(tags) } });
    };

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
                    {/* 2. 분리된 핸들러 함수를 onPress에 적용 */}
                    <TouchableOpacity onPress={handleAddSchedulePress}>
                        <BS.ScheduleAddButton name="pluscircleo" size={20}/>
                    </TouchableOpacity>
                </BS.HeaderRight>
            </BS.Header>
            <BottomSheetScrollView style={{flex:1}}>
                <BS.ContentWrap>
                    {filteredSchedules.map(schedule => (
                        <TaggedSchedule key={schedule.id} item={schedule} />
                    ))}
                </BS.ContentWrap>
            </BottomSheetScrollView>
        </BS.Container>
    );
}