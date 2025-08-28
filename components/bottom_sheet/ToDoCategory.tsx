import {Text} from "react-native";
import React from "react";
import {TCContainer} from "@/components/bottom_sheet/ToDoCategoryStyle";


// -------------------------------------- //
// 컴포넌트 이름은 카테고리 확정에 따라 변경 예정 //
// -------------------------------------- //
export const ToDoContent = () => {
    return (
        <TCContainer>
            <Text> To-Do Input Form </Text>
        </TCContainer>
    );
}
export const RoutineContent = () => {
    return (
        <TCContainer>
            <Text> Routine Input Form </Text>
        </TCContainer>
    );
}
export const GoalContent = () => {
    return (
        <TCContainer>
            <Text> Goal Input Form </Text>
        </TCContainer>
    );
}