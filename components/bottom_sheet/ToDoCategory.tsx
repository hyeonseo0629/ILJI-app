import {Text, FlatList, View} from "react-native";
import React from "react";
import {TCContainer} from "@/components/bottom_sheet/ToDoCategoryStyle";
import {Schedule} from "@/app/hooks/useFetchSchedules";

interface ContentProps {
  data: Schedule[];
}

// -------------------------------------- //
// 컴포넌트 이름은 카테고리 확정에 따라 변경 예정 //
// -------------------------------------- //
export const ToDoContent = ({ data }: ContentProps) => {
    return (
        <TCContainer>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{padding: 10}}>
                        <Text>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No To-Do items for today.</Text>}
            />
        </TCContainer>
    );
}

export const RoutineContent = ({ data }: ContentProps) => {
    return (
        <TCContainer>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{padding: 10}}>
                        <Text>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No routines for today.</Text>}
            />
        </TCContainer>
    );
}

export const GoalContent = ({ data }: ContentProps) => {
    return (
        <TCContainer>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{padding: 10}}>
                        <Text>{item.title}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No goals for today.</Text>}
            />
        </TCContainer>
    );
}
