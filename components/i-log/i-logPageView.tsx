import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import * as I from "@/components/style/I-logStyled";
import React, {useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import { Diary } from "@/app/(tabs)/i-log"; // 부모에게서 Diary 타입을 import 합니다.

const {width} = Dimensions.get("window");

// DiaryPage는 Diary 타입의 item을 받습니다.
const DiaryPage = ({item}: { item: Diary }) => {
    return (
        <View style={{flex: 1}}>
            <I.PageWrap>
                <ScrollView>
                    <I.PageTextWrap>
                        <I.PageDateText>{item.date}</I.PageDateText>
                        <I.PageTextLeftWrap>
                            <I.PageTextTopWrap>
                                <I.PageWeekText>{item.week}</I.PageWeekText>
                            </I.PageTextTopWrap>
                            <I.PageTextBottomWrap>
                                <I.PageYearText>{item.year}</I.PageYearText>
                                <I.PageTimeText>{item.time}</I.PageTimeText>
                            </I.PageTextBottomWrap>
                        </I.PageTextLeftWrap>
                    </I.PageTextWrap>
                    <I.PageImage/>
                    <I.PageContentWrap>
                        <I.PageTitle>{item.title}</I.PageTitle>
                        <I.PageContent>{item.content}</I.PageContent>
                    </I.PageContentWrap>
                </ScrollView>
            </I.PageWrap>
        </View>
    );
};

// ILogPageView는 diaries 배열을 props로 받습니다.
const ILogPageView = ({ diaries }: { diaries: Diary[] }) => {
    const insets = useSafeAreaInsets();

    const [pageIndex, setPageIndex] = useState(0);
    const activeIndex = useSharedValue(0); // 애니메이션 전용 인덱스

    const dragX = useSharedValue(0);
    const THRESHOLD = 20;

    const gesture = Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .onUpdate((e) => {
            dragX.value = e.translationX;
        })
        .onEnd(() => {
            if (dragX.value < -THRESHOLD && activeIndex.value < diaries.length - 1) {
                // 다음 페이지로
                dragX.value = withSpring(-width, {stiffness: 150, damping: 18}, (isFinished) => {
                    if (isFinished) {
                        activeIndex.value = activeIndex.value + 1;
                        dragX.value = 0;
                        runOnJS(setPageIndex)(activeIndex.value);
                    }
                });
            } else if (dragX.value > THRESHOLD && activeIndex.value > 0) {
                // 이전 페이지로
                dragX.value = withSpring(width, {stiffness: 150, damping: 18}, (isFinished) => {
                    if (isFinished) {
                        activeIndex.value = activeIndex.value - 1;
                        dragX.value = 0;
                        runOnJS(setPageIndex)(activeIndex.value);
                    }
                });
            } else {
                // 원위치
                dragX.value = withSpring(0, {stiffness: 150, damping: 18});
            }
        });


    // 현재 페이지
    const animatedStyleCurrent = useAnimatedStyle(() => {
        const rotateY =
            dragX.value >= 0
                ? interpolate(dragX.value, [0, width], [0, 150])
                : interpolate(dragX.value, [-width, 0], [-150, 0]);

        const shadowOpacity = interpolate(Math.abs(dragX.value), [0, width], [0.05, 0.3]);

        return {
            transform: [
                {perspective: 1200},
                {translateX: -width / 2},
                {rotateY: `${rotateY}deg`},
                {translateX: width / 2},
            ],
            backfaceVisibility: "hidden",
            shadowOpacity,
        };
    });

    // 이전 페이지
    const animatedStylePrev = useAnimatedStyle(() => {
        if (activeIndex.value === 0) return {opacity: 1};
        const rotateY = dragX.value > 0 ? interpolate(dragX.value, [0, width], [-175, 0]) : -90;
        const opacity = interpolate(dragX.value, [0, width / 2], [0, 1]);

        return {
            transform: [
                {perspective: 1200},
                {translateX: -width / 2},
                {rotateY: `${rotateY}deg`},
                {translateX: width / 2},
            ],
            backfaceVisibility: "hidden",
            opacity,
        };
    });

    // 다음 페이지
    const animatedStyleNext = useAnimatedStyle(() => {
        if (activeIndex.value === diaries.length - 1) return {opacity: 1};
        const rotateY = dragX.value < 0 ? interpolate(dragX.value, [-width, 0], [0, 0]) : 90;

        return {
            transform: [
                {perspective: 1200},
                {translateX: -width / 2},
                {rotateY: `${rotateY}deg`},
                {translateX: width / 2},
            ],
            backfaceVisibility: "hidden",
            opacity: 1,
        };
    });

    return (
        <I.Container style={{paddingBottom: insets.bottom}}>
            <GestureHandlerRootView style={{flex: 1}}>
                <GestureDetector gesture={gesture}>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <Animated.View style={[styles.page, animatedStylePrev]}>
                            <DiaryPage item={diaries[pageIndex > 0 ? pageIndex - 1 : 0]}/>
                        </Animated.View>
                        <Animated.View style={[styles.page, animatedStyleNext]}>
                            <DiaryPage
                                item={diaries[pageIndex < diaries.length - 1 ? pageIndex + 1 : diaries.length - 1]}/>
                        </Animated.View>
                        <Animated.View style={[styles.page, animatedStyleCurrent]}>
                            <DiaryPage item={diaries[pageIndex]}/>
                        </Animated.View>
                    </View>
                </GestureDetector>
            </GestureHandlerRootView>
        </I.Container>
    )
}

const styles = StyleSheet.create({
    page: {
        position: "absolute",
        backgroundColor: "#ffffff",
        zIndex: -999,
        height: 765,
        top: 0
    },
});

export default ILogPageView;
