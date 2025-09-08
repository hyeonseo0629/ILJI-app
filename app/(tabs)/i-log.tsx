import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainContainer } from "@/components/style/MainStyled";
import ILogPageView from "@/components/i-log/i-logPageView";
import ILogListView from "@/components/i-log/i-logListView";
import { useState } from "react";
import { TabsContainer, TabsButton, TabsButtonText } from "@/components/style/I-logStyled";

// 1. i-logPageView.tsx에서 Diary 타입을 가져옴
export type Diary = {
    id: string;
    date: string;
    week: string;
    year: string;
    time: string;
    title: string;
    content: string;
};

// 2. 새로운 테이블 컬럼 구조에 맞는 타입 정의
export type ILogData = {
    id: number;
    user_id: number;
    i_log_date: Date;
    content: string;
    img_url?: string;
    created_at: Date;
    like_count: number;
    comment_count: number;
    visibility: number; // 0: private, 1: friends, 2: public
    friend_tags?: string; // JSON string or comma-separated
    tags?: string; // JSON string or comma-separated
}

// 3. i-logPageView.tsx에서 diaries 데이터를 가져와 useState로 관리
const initialDiaries: Diary[] = [
    {
        id: '1',
        date: '09.03',
        week: '수',
        year: '2023',
        time: '17:29:00',
        title: '첫 번째 일기',
        content: '오늘 하루는 아침부터 조금 특별한 느낌으로 시작되었다. ...' // 내용은 생략
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
    // ... 나머지 데이터
];

// 4. 새로운 테이블 컬럼 구조에 맞는 목업 데이터 생성
const newILogData: ILogData[] = [
    {
        id: 1,
        user_id: 101,
        i_log_date: new Date('2023-09-03T17:29:00'),
        content: '오늘 하루는 아침부터 조금 특별한 느낌으로 시작되었다. ...',
        img_url: 'https://example.com/image1.jpg',
        created_at: new Date(),
        like_count: 15,
        comment_count: 4,
        visibility: 1, // public
        friend_tags: JSON.stringify([{id: 201, name: 'friend1'}, {id: 202, name: 'friend2'}]),
        tags: '#일상 #생각 #아침'
    },
    {
        id: 2,
        user_id: 102,
        i_log_date: new Date('2023-09-04T18:30:00'),
        content: '오늘은 동그란 것들을 생각해봤다. 동그란 해, 동그란 시계, 동그란 접시.',
        img_url: 'https://example.com/image1.jpg',
        created_at: new Date(),
        like_count: 5,
        comment_count: 1,
        visibility: 0, // friends
        friend_tags: "",
        tags: '#생각 #단상'
    }
];

export default function DiaryScreen() {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'page'
    const [diaries, setDiaries] = useState<Diary[]>(initialDiaries);

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

                {/* 5. diaries 데이터를 props로 전달 */}
                {viewMode === 'list' ? (
                    <ILogListView diaries={diaries} />
                ) : (
                    <ILogPageView diaries={diaries} />
                )}
            </MainContainer>
        </GestureHandlerRootView>
    );
}
