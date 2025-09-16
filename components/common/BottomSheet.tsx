import {TouchableOpacity} from "react-native";
import React, {useMemo, useState} from "react";
import { useRouter } from "expo-router";
import * as BS from "@/components/style/BottomSheetStyled";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {TaggedSchedule} from "@/components/tag/TaggedSchedule";
import {useSchedule} from "@/src/context/ScheduleContext";
import EditTagModal from "@/components/editTagModal/EditTagModal";
import { ThemeColors } from "@/types/theme";

interface BottomSheetContentProps {
    activeTab: string; // e.g., "All", "Work", "Personal", "Study"
    colors: ThemeColors;
}

export const BottomSheetContent: React.FC<BottomSheetContentProps> = ({activeTab, colors}) => {
    const router = useRouter();
    const { events: schedules, tags, selectedDate } = useSchedule();
    const [sortBy, setSortBy] = useState('latest');
    const [isEditTagModalVisible, setIsEditTagModalVisible] = useState(false);

    const pickerItems = [
        {label: "latest", value: "latest"},
        {label: "oldest", value: "oldest"},
        {label: "priority", value: "priority"},
    ];

    const filteredSchedules = useMemo(() => {
        if (activeTab === 'All') {
            return schedules;
        }

        const currentTag = tags.find(tag => tag.label === activeTab);

        if (!currentTag) {
            return [];
        }

        return schedules.filter(schedule => schedule.tagId === currentTag.id);
    }, [activeTab, schedules, tags]);

    const handleAddPress = () => {
        router.push({
            pathname: '/add-schedule',
            params: { initialDate: selectedDate.toISOString() },
        });
    };

    return (
        <BS.Container $colors={colors}>
            <BS.Header $colors={colors}>
                <BS.HeaderLeft>
                    <SortByPicker
                        items={pickerItems}
                        selectedValue={sortBy}
                        onValueChange={setSortBy}
                        colors={colors}
                    />
                </BS.HeaderLeft>
                <BS.HeaderRight>
                    <BS.TodayText $colors={colors}>{format(new Date(), "yyyy-MM-dd")}</BS.TodayText>
                    <TouchableOpacity onPress={handleAddPress}>
                        <BS.ScheduleAddButton name="pluscircleo" size={20} $colors={colors}/>
                    </TouchableOpacity>
                    <BS.TagEditBTN onPress={() => setIsEditTagModalVisible(true)}>
                        <MaterialCommunityIcons name="book-edit-outline" size={24} color={colors.primary} />
                    </BS.TagEditBTN>
                </BS.HeaderRight>
            </BS.Header>
            <BottomSheetScrollView style={{flex:1}}>
                <BS.ContentWrap>
                    {filteredSchedules.map(schedule => (
                        <TaggedSchedule key={schedule.id} item={schedule} colors={colors} />
                    ))}
                </BS.ContentWrap>
            </BottomSheetScrollView>
            <EditTagModal
                visible={isEditTagModalVisible}
                onClose={() => setIsEditTagModalVisible(false)}
                colors={colors}
            />
        </BS.Container>
    );
}