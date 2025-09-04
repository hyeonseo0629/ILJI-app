import {Dimensions, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {
    DiaryContainer,
    PCount,
    PWrap,
    PCountWrap,
    PImage,
    PTextWrap,
    PTop,
    PUserID,
    MWrap,
    MDateText,
    MTextWrap,
    MWeekText,
    MYearText,
    MTimeText,
    MTextLeftWrap, MTextBottomWrap, MImage, MContentWrap, MTitle, MContent,
} from "@/components/diary/DiaryStyle";
import React, {useState} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";

type Diary = {
    id: string;
    date: string;
    week: string;
    year: string;
    time: string;
    title: string;
    content: string;
};

const diaries: Diary[] = [
    {
        id: '1',
        date: '09.03',
        week: '수',
        year: '2023',
        time: '17:29:00',
        title: '첫 번째 일기',
        content: '네모난 침대에서 일어나 눈을 떠 보면, 네모난 창문으로 보이는 똑같은 풍경'
    },
    {
        id: '2',
        date: '09.04',
        week: '목',
        year: '2023',
        time: '18:30:00',
        title: '두 번째 일기',
        content: '오늘은 동그란 것들을 생각해봤다. 동그란 해, 동그란 시계, 동그란 접시.'
    },
    {
        id: '3',
        date: '09.05',
        week: '금',
        year: '2023',
        time: '19:31:00',
        title: '세 번째 일기',
        content: '세모난 샌드위치를 먹었다. 세상은 네모, 동그라미, 세모로 가득하다.'
    },
    {
        id: '4',
        date: '09.06',
        week: '토',
        year: '2023',
        time: '11:15:00',
        title: '주말 아침',
        content: '늦잠을 자고 일어나니 햇살이 방 안 가득했다. 완벽한 주말의 시작이다.'
    },
    {
        id: '5',
        date: '09.07',
        week: '일',
        year: '2023',
        time: '16:45:00',
        title: '공원 산책',
        content: '가까운 공원에 나가 산책을 했다. 시원한 바람이 기분 좋았다.'
    },
    {
        id: '6',
        date: '09.08',
        week: '월',
        year: '2023',
        time: '09:05:00',
        title: '새로운 한 주',
        content: '월요일 아침은 언제나 분주하다. 이번 주도 힘내보자.'
    },
    {
        id: '7',
        date: '09.09',
        week: '화',
        year: '2023',
        time: '21:20:00',
        title: '영화 감상',
        content: '집에서 오래된 흑백 영화를 봤다. 특유의 분위기가 마음에 들었다.'
    },
    {
        id: '8',
        date: '09.10',
        week: '수',
        year: '2023',
        time: '13:00:00',
        title: '점심 약속',
        content: '오랜만에 친구를 만나 맛있는 파스타를 먹으며 이야기를 나눴다.'
    },
    {
        id: '9',
        date: '09.11',
        week: '목',
        year: '2023',
        time: '23:50:00',
        title: '밤의 생각',
        content: '잠들기 전, 오늘 있었던 일들을 되돌아보는 시간을 가졌다.'
    },
    {
        id: '10',
        date: '09.12',
        week: '금',
        year: '2023',
        time: '18:00:00',
        title: '퇴근길',
        content: '금요일 퇴근길의 발걸음은 언제나 가볍다. 주말 계획을 세워야지.'
    },
    {
        id: '11',
        date: '09.13',
        week: '토',
        year: '2023',
        time: '14:30:00',
        title: '서점 방문',
        content: '서점에 들러 새로 나온 책들을 구경했다. 책 냄새는 마음을 편안하게 한다.'
    },
    {
        id: '12',
        date: '09.14',
        week: '일',
        year: '2023',
        time: '19:00:00',
        title: '저녁 식사',
        content: '가족들과 함께 맛있는 저녁을 먹었다. 집밥이 최고다.'
    },
    {
        id: '13',
        date: '09.15',
        week: '월',
        year: '2023',
        time: '08:30:00',
        title: '비 오는 아침',
        content: '창밖으로 비가 내린다. 차분한 분위기 속에서 하루를 시작한다.'
    },
    {
        id: '14',
        date: '09.16',
        week: '화',
        year: '2023',
        time: '15:10:00',
        title: '업무 마감',
        content: '중요한 업무를 하나 끝냈다. 뿌듯함과 함께 피로가 몰려온다.'
    },
    {
        id: '15',
        date: '09.17',
        week: '수',
        year: '2023',
        time: '22:00:00',
        title: '하루 마무리',
        content: '오늘 하루도 무사히 끝났다. 내일은 또 어떤 일이 기다리고 있을까.'
    }
];

const { width } = Dimensions.get("window");

// DiaryPage는 이제 하나의 다이어리 항목만 렌더링합니다.
const DiaryPage = ({item}: { item: Diary }) => {
    return (
        <View style={{flex: 1}}>
            <MWrap>
                <MTextWrap>
                    <MDateText>{item.date}</MDateText>
                    <MTextLeftWrap>
                        <MWeekText>{item.week}</MWeekText>
                        <MTextBottomWrap>
                            <MYearText>{item.year}</MYearText>
                            <MTimeText>{item.time}</MTimeText>
                        </MTextBottomWrap>
                    </MTextLeftWrap>
                </MTextWrap>
                <MImage/>
                <MContentWrap>
                    <MTitle>{item.title}</MTitle>
                    <MContent>{item.content}</MContent>
                </MContentWrap>
            </MWrap>
        </View>
    );
};

const DiaryView = () => {
    const insets = useSafeAreaInsets();

    // 첫 번째 다이어리 항목만 표시합니다.
    const singleDiary = diaries[0];

    const [pageIndex, setPageIndex] = useState(0);
    const dragX = useSharedValue(0);
    const THRESHOLD = 20;

    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            dragX.value = e.translationX;
        })
        .onEnd(() => {
            if (dragX.value < -THRESHOLD && pageIndex < diaries.length - 1) {
                dragX.value = withSpring(-width, { stiffness: 150, damping: 18 }, () => {
                    runOnJS(setPageIndex)(pageIndex + 1);
                    dragX.value = 0;
                });
            } else if (dragX.value > THRESHOLD && pageIndex > 0) {
                dragX.value = withSpring(width, { stiffness: 150, damping: 18 }, () => {
                    runOnJS(setPageIndex)(pageIndex - 1);
                    dragX.value = 0;
                });
            } else {
                dragX.value = withSpring(0, { stiffness: 150, damping: 18 });
            }
        });

    const shadowStyle = {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    };

    // 현재 페이지 회전
    const animatedStyleCurrent = useAnimatedStyle(() => {
        const rotateY =
            dragX.value >= 0
                ? interpolate(dragX.value, [0, width], [0, 150])
                : interpolate(dragX.value, [-width, 0], [-150, 0]);

        // 드래그에 따라 현재 페이지가 살짝 축소
        const scale = interpolate(Math.abs(dragX.value), [0, width], [1, 0.95]);

        const shadowOpacity = interpolate(Math.abs(dragX.value), [0, width], [0.05, 0.3]);
        return {
            transform: [
                { perspective: 1200 },
                { translateX: -width / 2 },
                { rotateY: `${rotateY}deg` },
                { translateX: width / 2 },
                { scale }, // 스케일 적용
            ],
            backfaceVisibility: "hidden",
            shadowOpacity,
        };
    });

// 이전 페이지 (prevPage)
    const animatedStylePrev = useAnimatedStyle(() => {
        if (pageIndex === 0) return { opacity: 0 }; // 첫 페이지면 보이지 않음
        const rotateY = dragX.value > 0 ? interpolate(dragX.value, [0, width], [-175, 0]) : -90;

        // 드래그에 따라 이전 페이지가 살짝 축소
        const scale = interpolate(Math.abs(dragX.value), [0, width], [1, 0.95]);

        return {
            transform: [
                { perspective: 1200 },
                { translateX: -width / 2 },
                { rotateY: `${rotateY}deg` },
                { translateX: width / 2 },
                { scale }, // 스케일 적용
            ],
            backfaceVisibility: "hidden",
            opacity: 1,
        };
    });

// 다음 페이지 (nextPage)
    const animatedStyleNext = useAnimatedStyle(() => {
        if (pageIndex === diaries.length - 1) return { opacity: 0 };
        const rotateY = dragX.value < 0 ? interpolate(dragX.value, [-width, 0], [0, 0]) : 90;

        // 드래그에 따라 이전 페이지가 살짝 축소
        const scale = interpolate(Math.abs(dragX.value), [0, width], [1, 0.95]);

        return {
            transform: [
                { perspective: 1200 },
                { translateX: -width / 2 },
                { rotateY: `${rotateY}deg` },
                { translateX: width / 2 },
                { scale }, // 스케일 적용
            ],
            backfaceVisibility: "hidden",
            opacity: 1,
        };
    });

    return (
        <DiaryContainer style={{paddingBottom: insets.bottom}}>
            {/* 상단 프로필 영역 */}
            <PWrap>
                <PTop>
                    <PImage/>
                    <PTextWrap>
                        <PUserID>@UserID</PUserID>
                        <PCountWrap>
                            <PCount><Text>Post</Text><Text>0</Text></PCount>
                            <PCount><Text>Post</Text><Text>0</Text></PCount>
                            <PCount><Text>Post</Text><Text>0</Text></PCount>
                        </PCountWrap>
                    </PTextWrap>
                </PTop>
            </PWrap>

            {/* 페이지 영역: 기존 BookCurl3D */}
            <GestureHandlerRootView style={{flex: 1}}>
                <GestureDetector gesture={gesture}>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        {pageIndex > 0 && (
                            <Animated.View style={[styles.page, animatedStylePrev, {zIndex: pageIndex - 1}]}>
                                <DiaryPage item={diaries[pageIndex - 1]}/>
                            </Animated.View>
                        )}
                        {pageIndex < diaries.length - 1 && (
                            <Animated.View style={[styles.page, animatedStyleNext, {zIndex: pageIndex - 1}]}>
                                <DiaryPage item={diaries[pageIndex + 1]}/>
                            </Animated.View>
                        )}
                        <Animated.View style={[styles.page, animatedStyleCurrent, {zIndex: pageIndex + 1}]}>
                            <DiaryPage item={diaries[pageIndex]}/>
                        </Animated.View>
                    </View>
                </GestureDetector>
            </GestureHandlerRootView>
        </DiaryContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
    },
    page: {
        position: "absolute",
        backgroundColor: "#ffffff",
        zIndex: -999,
        height: 590
    },
    text: {
        fontSize: 18,
        lineHeight: 26,
        color: "#000",
    },
});

export default DiaryView;
