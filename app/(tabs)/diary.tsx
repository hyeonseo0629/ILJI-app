import React, {useState, useRef, useMemo} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/MainStyle";
import DiaryView from "@/components/Diary/DiaryView";

export default function DiaryScreen() {

    return (
        <GestureHandlerRootView>
            <MainContainer>
                <Header/>
                <DiaryView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}