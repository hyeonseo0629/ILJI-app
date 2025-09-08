import React, {useState, useRef, useMemo} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/style/MainStyle";
import ILogView from "@/components/i-log/i-logView";

export default function DiaryScreen() {
    const [sheetIndex, setSheetIndex] = useState(0);

    return (
        <GestureHandlerRootView>
            <MainContainer>
                <ILogView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}