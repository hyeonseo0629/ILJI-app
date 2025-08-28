import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/MainStyle";
import ILogView from "@/components/iLog/ILogView";

// ILogScreen은 앱의 다이어리 탭에 해당하는 화면을 렌더링하는 주 컴포넌트입니다.
export default function ILogScreen() {

    return (
        // `GestureHandlerRootView`는 react-native-gesture-handler 라이브러리가
        // 제스처를 올바르게 처리하기 위해 필요한 최상위 래퍼(wrapper) 컴포넌트입니다.
        <GestureHandlerRootView style={{flex: 1}}>
            {/* `MainContainer`는 화면의 전체적인 레이아웃과 배경 스타일을 담당하는
                styled-component입니다. */}
            <MainContainer>
                {/* `Header` 컴포넌트는 앱의 상단에 위치하는 헤더를 렌더링합니다. */}
                <Header sheetIndex={0}/>
                {/* `ILogView` 컴포넌트는 다이어리의 내용을 보여주는 주된 UI를 렌더링합니다. */}
                <ILogView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}