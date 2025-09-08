import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import { MainContainer } from "@/components/MainStyled";
import ILogView from "@/components/iLog/ILogView";
import { AnimationContext } from '@/components/common/AnimationContext';
import { useSharedValue } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native'; // useTheme 훅 임포트

export default function ILogScreen() {
    const animatedIndex = useSharedValue<number>(0);
    const theme = useTheme(); // 테마 객체 가져오기

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AnimationContext.Provider value={{ animatedIndex }}>
                <MainContainer theme={theme}> {/* MainContainer에도 theme prop 전달 */}
                    <Header theme={theme} /> {/* Header에 theme prop 전달 */}
                    <ILogView />
                </MainContainer>
            </AnimationContext.Provider>
        </GestureHandlerRootView>
    );
}
