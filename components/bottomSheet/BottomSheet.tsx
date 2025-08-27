import {Text, TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import {
    BSContainer, BSContentWrap, BSHeader, BSHeaderLeft, BSHeaderRight, BSTodayText,
    BSToDoAddButton
} from "@/components/bottomSheet/BottomSheetStyled";
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ToDo} from "@/components/ToDo/ToDo";
import {Schedule} from "@/components/calendar/types";
import {Tag} from "@/components/ToDo/types";

interface BottomSheetContentProps {
    schedules: Schedule[];
    tags: Tag[];
    activeTab: string; // e.g., "Work", "Personal", "Study"
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({schedules, tags, activeTab}) => {
    const [sortBy, setSortBy] = useState('latest');
    const pickerItems = [
        {label: "최신순", value: "latest"},
        {label: "오래된순", value: "oldest"},
        {label: "중요도순", value: "priority"},
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
        <BSContainer>
            <BSHeader>
                <BSHeaderLeft>
                    <SortByPicker
                        items={pickerItems}
                        selectedValue={sortBy}
                        onValueChange={setSortBy}
                    />
                </BSHeaderLeft>
                <BSHeaderRight>
                    <BSTodayText>{format(new Date(), "yyyy-MM-dd")}</BSTodayText>
                    <TouchableOpacity>
                        <BSToDoAddButton name="pluscircleo" size={20}/>
                    </TouchableOpacity>
                </BSHeaderRight>
            </BSHeader>
            <BottomSheetScrollView style={{flex:1}}>
                <BSContentWrap>
                    {/* 2. 필터링된 스케줄 목록을 화면에 렌더링합니다. */}
                    {filteredSchedules.map(schedule => (
                        <ToDo key={schedule.id} item={schedule} />
                    ))}
                </BSContentWrap>
            </BottomSheetScrollView>
        </BSContainer>
    );
}