import {Text, FlatList, useWindowDimensions, View} from "react-native";
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
import React from "react";
// 1. Reanimated에서 필요한 것들을 import 합니다.
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated';

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
];

// 2. DiaryPage 컴포넌트가 index와 scrollX를 props로 받도록 수정합니다.
const DiaryPage = ({ item, index, scrollX }: { item: Diary, index: number, scrollX: Animated.SharedValue<number> }) => {
    const { width } = useWindowDimensions();

    // 3. 스크롤 위치에 따라 애니메이션 스타일을 계산합니다.
    const animatedStyle = useAnimatedStyle(() => {
        // 현재 페이지의 위치(왼쪽, 중앙, 오른쪽)를 정의합니다.
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        // 위치에 따라 Y축 회전 각도를 설정합니다.
        // 페이지가 오른쪽에 있을 때: 45도 회전
        // 중앙에 있을 때: 0도 (정면)
        // 왼쪽에 있을 때: -45도 회전
        const rotateY = interpolate(
            scrollX.value,
            inputRange,
            [100, 0, 0, -45],
        );

        return {
            transform: [
                // 3D 효과를 주기 위해 perspective(원근) 값을 설정합니다.
                { perspective: 1000 },
                // 계산된 각도만큼 Y축으로 회전시킵니다.
                { rotateY: `${rotateY}deg` },
            ],
        };
    });

    return (
        // 4. View를 Animated.View로 바꾸고, 계산된 스타일을 적용합니다.
        <Animated.View style={[{ width }, animatedStyle]}>
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
        </Animated.View>
    );
};


const DiaryView = () => {
    // 5. 스크롤 위치를 저장할 SharedValue를 생성합니다.
    const scrollX = useSharedValue(0);

    // 6. 스크롤 이벤트를 처리할 핸들러를 생성합니다.
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
    });

    // DiaryView.tsx 파일의 DiaryPage 컴포넌트 부분을 이걸로 교체하세요.

    const DiaryPage = ({ item, index, scrollX }: { item: Diary, index: number, scrollX: Animated.SharedValue<number> }) => {
        const { width } = useWindowDimensions();

        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

            // 1. 회전 각도를 90도로 늘립니다.
            const rotateY = interpolate(
                scrollX.value,
                inputRange,
                [90, 0, -90], // 더 과감한 각도
            );

            // 2. 투명도를 추가합니다.
            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0.3, 1, 0.3], // 옆에 있는 페이지는 흐릿하게
            );

            // 3. 크기를 추가합니다.
            const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.7, 1, 0.7], // 옆에 있는 페이지는 작게
            );

            return {
                opacity,
                transform: [
                    { perspective: 1000 },
                    { rotateY: `${rotateY}deg` },
                    { scale },
                ],
            };
        });

        return (
            <Animated.View style={[{ width }, animatedStyle]}>
                <MWrap>
                    {/* ... 기존 페이지 내용 ... */}
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
            </Animated.View>
        );
    };

    return (
        <DiaryContainer>
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

            {/* 7. FlatList를 Animated.FlatList로 바꾸고, 스크롤 핸들러를 연결합니다. */}
            <Animated.FlatList
                data={diaries}
                renderItem={({ item, index }) => <DiaryPage item={item} index={index} scrollX={scrollX} />}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16} // 스크롤 이벤트를 16ms(60fps)마다 감지
            />
        </DiaryContainer>
    )
}

export default DiaryView;