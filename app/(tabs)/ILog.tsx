import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import { MainContainer } from "@/components/MainStyle";
import ILogView from "@/components/iLog/ILogView";
import { AnimationContext } from '@/components/common/AnimationContext';
import { useSharedValue } from 'react-native-reanimated';

export default function ILogScreen() {
    // ILogScreen에는 BottomSheet가 없으므로, Header가 기본 상태로 표시되도록
    // 항상 0의 값을 갖는 정적 animatedIndex를 생성하여 Context로 제공합니다.
    const animatedIndex = useSharedValue<number>(0);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AnimationContext.Provider value={{ animatedIndex }}>
                <MainContainer>
                    <Header />
                    <ILogView />
                </MainContainer>
            </AnimationContext.Provider>
        </GestureHandlerRootView>
    );
}
