import {Text, TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import { useRouter } from "expo-router";
import * as BS from "@/components/style/BottomSheetStyled";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {TaggedSchedule} from "@/components/tag/TaggedSchedule";
import {Schedule} from "@/components/calendar/scheduleTypes";
import {Tag} from "@/components/tag/TagTypes";
import {useSchedule} from "@/src/context/ScheduleContext";
import EditTagModal from "@/components/editTagModal/edit-tagmodal";

interface BottomSheetContentProps {
    activeTab: string; // e.g., "All", "Work", "Personal", "Study"
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({activeTab}) => {
    const router = useRouter();
    // [수정] Context에서 selectedDate를 추가로 가져옵니다.
    const { events: schedules, tags, selectedDate } = useSchedule();
    const [sortBy, setSortBy] = useState('latest');
    // 태그 편집 모달의 표시 상태를 관리합니다.
    const [isEditTagModalVisible, setIsEditTagModalVisible] = useState(false);

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

    // 1. 핸들러 함수 분리
    const handleAddSchedulePress = () => {
        router.push({ pathname: '/add-schedule', params: { tags: JSON.stringify(tags) } });
    };

    const handleAddPress = () => {
        router.push({
            pathname: '/add-schedule',
            // Date 객체를 문자열로 변환하여 파라미터로 전달
            params: { initialDate: selectedDate.toISOString() },
        });
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
                    <TouchableOpacity onPress={handleAddPress}>
                        <BS.ScheduleAddButton name="pluscircleo" size={20}/>
                    </TouchableOpacity>
                    <BS.TagEditBTN onPress={() => setIsEditTagModalVisible(true)}>
                        <MaterialCommunityIcons name="book-edit-outline" size={24} color="mediumslateblue" />
                    </BS.TagEditBTN>
                </BS.HeaderRight>
            </BS.Header>
            <BottomSheetScrollView style={{flex:1}}>
                <BS.ContentWrap>
                    {filteredSchedules.map(schedule => (
                        <TaggedSchedule key={schedule.id} item={schedule} />
                    ))}
                </BS.ContentWrap>
            </BottomSheetScrollView>
            {/* 태그 편집 모달 */}
            <EditTagModal
                visible={isEditTagModalVisible}
                onClose={() => setIsEditTagModalVisible(false)}
            />
        </BS.Container>
    );
}