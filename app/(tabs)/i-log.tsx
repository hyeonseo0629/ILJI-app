import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainContainer } from "@/components/style/MainStyled";
import ILogPageView from "@/components/i-log/i-logPageView";
import ILogListView from "@/components/i-log/i-logListView";
import React, { useState, useEffect, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TabsContainer, TabsButton, TabsButtonText } from "@/components/style/I-logStyled";
import * as I from "@/components/style/I-logStyled";

// 새로운 통합 데이터 타입
export type ILogData = {
    id: number;
    user_id: number;
    title: string;
    i_log_date: Date;
    content: string;
    img_url?: string;
    created_at: Date;
    like_count: number;
    comment_count: number;
    visibility: number;
    friend_tags?: string;
    tags?: string;
}

const initialILogs: ILogData[] = [
    {
        id: 1,
        user_id: 101,
        title: "특별한 느낌으로 시작된 하루",
        i_log_date: new Date('2023-09-03'),
        content: '오늘 하루는 아침부터 조금 특별한 느낌으로 시작되었다. ...',
        img_url: 'https://picsum.photos/seed/picsum/400/400',
        created_at: new Date('2023-09-03T17:29:00'),
        like_count: 15,
        comment_count: 4,
        visibility: 1,
        friend_tags: JSON.stringify([{id: 201, name: 'friend1'}, {id: 202, name: 'friend2'}]),
        tags: '#일상 #생각 #아침'
    },
    {
        id: 2,
        user_id: 102,
        title: "동그라미에 대한 고찰",
        i_log_date: new Date('2023-09-04'),
        content: '오늘은 동그란 것들을 생각해봤다. 동그란 해, 동그란 시계, 동그란 접시.',
        img_url: 'https://picsum.photos/seed/hello/400/400',
        created_at: new Date('2023-09-04T18:30:00'),
        like_count: 5,
        comment_count: 1,
        visibility: 1,
        friend_tags: JSON.stringify([{id: 203, name: 'friend3'}]),
        tags: '#생각 #단상'
    }
];

export default function DiaryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [viewMode, setViewMode] = useState('page');
    const [ilogs, setIlogs] = useState<ILogData[]>(initialILogs);

    // 1. 모든 로그에서 중복 없는 태그 목록 추출
    const uniqueTags = useMemo(() => {
        const allTags = ilogs
            .flatMap(log => log.tags?.split(' ') || []) // 모든 태그를 하나의 배열로 펼치기
            .filter(tag => tag.startsWith('#')); // #으로 시작하는 태그만 필터링
        return [...new Set(allTags)]; // Set을 사용하여 중복 제거
    }, [ilogs]);

    useEffect(() => {
        if (params.newLog) {
            const newLogData = JSON.parse(params.newLog as string);
            newLogData.i_log_date = new Date(newLogData.i_log_date);
            newLogData.created_at = new Date(newLogData.created_at);
            setIlogs(prevIlogs => [newLogData, ...prevIlogs]);
            router.setParams({ newLog: '' });
        }
    }, [params.newLog]);

    // 2. add-ilog 화면으로 이동할 때, 추출된 태그 목록을 파라미터로 전달
    const handleAddPress = () => {
        router.push({
            pathname: '/add-ilog',
            params: { uniqueTags: JSON.stringify(uniqueTags) },
        });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MainContainer>
                <TabsContainer>
                    <TabsButton onPress={() => setViewMode('list')} $isActive={viewMode === 'list'}>
                        <TabsButtonText>List View</TabsButtonText>
                    </TabsButton>
                    <TabsButton onPress={() => setViewMode('page')} $isActive={viewMode === 'page'}>
                        <TabsButtonText>Page View</TabsButtonText>
                    </TabsButton>
                </TabsContainer>

                {viewMode === 'list' ? (
                    <ILogListView ilogs={ilogs} />
                ) : (
                    <ILogPageView ilogs={ilogs} />
                )}
            </MainContainer>
            
            <I.ButtonIconWrap onPress={handleAddPress}>
                <I.ButtonIcon name="square-edit-outline" />
            </I.ButtonIconWrap>
        </GestureHandlerRootView>
    );
}
