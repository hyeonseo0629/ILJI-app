import React, {useState, useRef, useMemo} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/MainStyle";
import DiaryView from "@/components/diary/DiaryView";

export default function DiaryScreen() {
    const [sheetIndex, setSheetIndex] = useState(0);

    return (
        <GestureHandlerRootView>
            <MainContainer>
                <Header sheetIndex={sheetIndex}/>
                <DiaryView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}