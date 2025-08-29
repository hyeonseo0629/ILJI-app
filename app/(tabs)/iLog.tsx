import React, {useState, useRef, useMemo} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/MainStyle";
import ILogView from "@/components/iLog/ILogView";

export default function ILogScreen() {
    const [sheetIndex, setSheetIndex] = useState(0);

    return (
        <GestureHandlerRootView>
            <MainContainer>
                <Header sheetIndex={sheetIndex}/>
                <ILogView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}