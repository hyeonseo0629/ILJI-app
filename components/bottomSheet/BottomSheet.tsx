import {Text, TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    BSContainer, BSContentWrap, BSHeader, BSHeaderLeft, BSHeaderRight, TagEditBTN, BSTodayText,
    BSToDoAddButton,
} from "@/components/bottomSheet/BottomSheetStyled";
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ToDo} from "@/components/ToDo/ToDo";
import {Schedule} from "@/components/calendar/types";
import {Tag} from "@/components/ToDo/types";
import {useSchedule} from "@/src/context/ScheduleContext";
import EditTagModal from "@/components/EditTagModal/edit-tagmodal";

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

    const handleAddPress = () => {
        router.push({
            pathname: '/add-schedule',
            // Date 객체를 문자열로 변환하여 파라미터로 전달
            params: { initialDate: selectedDate.toISOString() },
        });
    };

    return (
        <BSContainer>
            <BSHeader>
                <BSHeaderLeft>
                    {/* 정렬 피커를 다시 헤더 왼쪽으로 이동시켰습니다. */}
                    <SortByPicker items={pickerItems} selectedValue={sortBy} onValueChange={setSortBy} />
                </BSHeaderLeft>
                <BSHeaderRight>
                    {/* [수정] 하드코딩된 new Date() 대신, Context에서 가져온 selectedDate를 사용합니다. */}
                    <BSTodayText>{format(selectedDate, "yyyy-MM-dd")}</BSTodayText>
                    {/* [수정] '+' 버튼 클릭 시 handleAddPress 함수를 호출합니다. */}
                    <TouchableOpacity onPress={handleAddPress}>
                        <BSToDoAddButton name="pluscircleo" size={20}/>
                    </TouchableOpacity>
                    <TagEditBTN onPress={() => setIsEditTagModalVisible(true)}>
                        <MaterialCommunityIcons name="book-edit-outline" size={24} color="mediumslateblue" />
                    </TagEditBTN>
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
            {/* 태그 편집 모달 */}
            <EditTagModal
                visible={isEditTagModalVisible}
                onClose={() => setIsEditTagModalVisible(false)}
            />
        </BSContainer>
    );
}