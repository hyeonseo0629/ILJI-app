import {Text} from "react-native";
import React from "react";
import {TCContainer, TCHandleIndicator} from "@/components/BottomSheet/ToDoCategoryStyle";


// -------------------------------------- //
// 컴포넌트 이름은 카테고리 확정에 따라 변경 예정 //
// -------------------------------------- //
export const ToDoContent = () => {
    return (
        <TCContainer>
            <TCHandleIndicator/>
            <Text> 첫번째 </Text>
        </TCContainer>
    );
}
export const RoutineContent = () => {
    return (
        <TCContainer>
            <TCHandleIndicator/>
            <Text> 두번째 </Text>
        </TCContainer>
    );
}
export const GoalContent = () => {
    return (
        <TCContainer>
            <TCHandleIndicator/>
            <Text> 세번째 </Text>
        </TCContainer>
    );
}