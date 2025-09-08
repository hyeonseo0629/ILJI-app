import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MainContainer} from "@/components/style/MainStyled";
import ILogPageView from "@/components/i-log/i-logPageView";

export default function DiaryScreen() {

    return (
        <GestureHandlerRootView>
            <MainContainer>
                <ILogPageView/>
            </MainContainer>
        </GestureHandlerRootView>
    );
}