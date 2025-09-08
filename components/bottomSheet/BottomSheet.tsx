import {Text, TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import { useRouter } from "expo-router";
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
import {useSchedule} from "@/src/context/ScheduleContext";

interface BottomSheetContentProps {
    activeTab: string; // e.g., "All", "Work", "Personal", "Study"
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({activeTab}) => {
    const router = useRouter();
    // [수정] Context에서 'events'를 가져와 'schedules'라는 별명으로 사용합니다.
    const { events: schedules, tags } = useSchedule();
    const [sortBy, setSortBy] = useState('latest');
    const pickerItems = [
        {label: "latest", value: "latest"},
        {label: "oldest", value: "oldest"},
        {label: "priority", value: "priority"},
    ];

    // [개선] '전체' 탭이 선택된 경우와 특정 태그가 선택된 경우를 모두 처리하도록 로직을 개선합니다.
    const filteredSchedules = useMemo(() => {
        // '전체' 탭이 활성화된 경우, 필터링 없이 모든 스케줄을 반환합니다.
        if (activeTab === 'All') {
            return schedules;
        }

        // 특정 태그 탭이 활성화된 경우, 기존 로직대로 해당 태그의 스케줄만 필터링합니다.
        const currentTag = tags.find(tag => tag.label === activeTab);

        if (!currentTag) {
            return [];
        }

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
                    <TouchableOpacity onPress={() => router.push('/add-schedule')}>
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