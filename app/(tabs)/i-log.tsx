import React, {useState, useRef, useMemo} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Header from "@/components/header/Header";
import {MainContainer} from "@/components/style/MainStyle";
import ILogView from "@/components/i-log/i-logView";
import { useTheme } from '@react-navigation/native';

export default function DiaryScreen() {
    const [sheetIndex, setSheetIndex] = useState(0);
    const theme = useTheme(); // 테마 객체 가져오기

    return (
        <GestureHandlerRootView>
            <MainContainer theme={theme} >
                <ILogView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}