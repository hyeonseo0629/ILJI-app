import {Text, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {
    BSContainer, BSContentWrap, BSHeader, BSHeaderLeft, BSHeaderRight, BSTodayText,
    BSToDoAddButton
} from "@/components/bottomSheet/BottomSheetStyled";
import SortByPicker from "@/components/common/SortByPicker";
import {format} from "date-fns";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {ToDo} from "@/components/ToDo/ToDo";

export const ToDoContent = () => {
    // 1. Picker의 선택된 값을 관리할 상태를 추가합니다.
    const [sortBy, setSortBy] = useState('latest');
    const pickerItems = [
        {label: "latest", value: "latest"},
        {label: "oldest", value: "oldest"},
        {label: "priority", value: "priority"},
    ];

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
                    <ToDo
                        title="Title"
                        date={format(new Date(), "yyyy / MM / dd")}
                        time={format(new Date(), "HH:mm")}
                        state="Deleyed"
                        icon="📖"
                    />
                    <ToDo
                        title="Title"
                        date={format(new Date(), "yyyy / MM / dd")}
                        time={format(new Date(), "HH:mm")}
                        state="Planning"
                        icon="📖"
                    />
                    <ToDo
                        title="Title"
                        date={format(new Date(), "yyyy / MM / dd")}
                        time={format(new Date(), "HH:mm")}
                        state="Completed"
                        icon="📖"
                    />
                    <ToDo
                        title="Title"
                        date={format(new Date(), "yyyy / MM / dd")}
                        time={format(new Date(), "HH:mm")}
                        state="Completed"
                        icon="📖"
                    />
                    <ToDo
                        title="Title"
                        date={format(new Date(), "yyyy / MM / dd")}
                        time={format(new Date(), "HH:mm")}
                        state="Completed"
                        icon="📖"
                    />
                </BSContentWrap>
            </BottomSheetScrollView>
        </BSContainer>
    );
}