import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainContainer } from "@/components/style/MainStyled";
import ILogPageView from "@/components/i-log/i-logPageView";
import ILogListView from "@/components/i-log/i-logListView";
import { useState } from "react";
import { TabsContainer, TabsButton, TabsButtonText } from "@/components/style/I-logStyled";

// 기존 ListView용 타입 및 데이터 (향후 삭제 예정)
export type Diary = {
    id: string;
    date: string;
    week: string;
    year: string;
    time: string;
    title: string;
    content: string;
};
const initialDiaries: Diary[] = [
    {
        id: '1',
        date: '09.03',
        week: '수',
        year: '2023',
        time: '17:29:00',
        title: '첫 번째 일기',
        content: '오늘 하루는 아침부터 조금 특별한 느낌으로 시작되었다. ...'
    },
];

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
        content: '오늘 하루는 아침부터 조금 특별한 느낌으로 시작되었다. 알람이 울리기 전, 어슴푸레한 햇살이 창문 틈으로 스며드는 것을 느꼈다. 나는 눈을 떴지만 바로 일어나지 않고, 침대에 누운 채로 하루를 상상하며 잠시 시간을 보냈다. 생각해보니 요즘 들어 아침을 여유롭게 보내는 날이 드물었고, 오늘은 어쩐지 마음이 가벼워서 느긋하게 시간을 보내고 싶었다. 커튼 사이로 보이는 하늘은 맑고 파랗게 빛나고 있었고, 바람은 선선하게 불어왔다. 창밖으로는 이웃집 고양이가 담벼락 위를 천천히 걸어가는 모습이 보였다. 나는 그 모습을 보며 미소를 지었다. 작은 순간이지만, 이런 평온한 풍경 속에서 하루를 시작할 수 있다는 것만으로도 감사한 마음이 들었다.\n' +
            '\n' +
            '천천히 몸을 일으켜 샤워를 하고, 커피를 내렸다. 커피 향이 부엌 안 가득 퍼지자, 하루를 시작할 준비가 조금씩 되었다는 기분이 들었다. 오늘은 특별히 해야 할 일이 많지는 않았지만, 스스로에게 소소한 목표를 세워보았다. 오전에는 읽고 있던 책을 마무리하고, 오후에는 근처 공원에 가서 산책을 하며 머릿속을 정리하기로 했다. 책을 읽는 동안, 나는 주인공의 감정에 몰입하며 여러 가지 생각에 잠겼다. 사람과 사람 사이의 관계, 삶에서의 선택과 우연, 그리고 작은 일상 속에서 느낄 수 있는 행복과 슬픔에 대해 자연스럽게 생각하게 되었다. 어느새 책장을 덮고 나니, 시계는 이미 11시를 가리키고 있었다.\n' +
            '\n' +
            '점심은 간단하게 샌드위치를 만들어 먹었다. 집에 있는 재료를 이용해 만든 것치고는 꽤 맛있게 느껴졌다. 혼자 먹는 식사였지만, 여유롭게 음식을 씹으면서 오늘 하루의 계획을 마음속으로 되짚어보았다. 점심을 먹고 나서 잠깐 창밖을 바라보니, 사람들의 발걸음이 분주하게 움직이고 있었다. 그 속에서 나는 혼자만의 시간을 가지며, 마음의 균형을 잡는 것이 얼마나 소중한지 다시 한 번 느꼈다.\n' +
            '\n' +
            '오후가 되자 나는 공원으로 향했다. 걸음을 옮길 때마다 선선한 바람이 얼굴을 스치며 기분 좋게 만들어주었다. 공원에는 아이들이 뛰어놀고 있었고, 강아지를 산책시키는 사람들도 여럿 있었다. 나는 벤치에 앉아 주변을 바라보며 천천히 숨을 고르고, 가끔씩 지나가는 사람들을 관찰했다. 각자의 삶이 있고, 각자의 하루가 있다는 생각이 들었다. 어떤 사람은 바쁘게 달려가고, 어떤 사람은 느긋하게 걸으며 여유를 즐기고 있었다. 그 모습을 보면서, 나는 내 삶도 그렇게 자연스럽게 흐르는 하루하루 속에서 조금씩 만들어지고 있다는 것을 느꼈다.\n' +
            '\n' +
            '공원에서 돌아오는 길에는 작은 카페에 들러 따뜻한 차 한 잔을 마셨다. 카페 안에는 책을 읽거나 노트북으로 일을 하는 사람들이 있었고, 잔잔한 음악이 배경으로 흐르고 있었다. 나는 창가 자리에 앉아 차를 홀짝이며 오늘의 느낌을 글로 적기 시작했다. 생각을 글로 정리하다 보니, 마음속에 있던 복잡한 감정들이 조금씩 풀리는 것 같았다. 그리고 나는 그 순간, 글을 쓰는 행위 자체가 내게는 소중한 치유의 시간이라는 것을 깨달았다.\n' +
            '\n' +
            '집으로 돌아오니 어느새 해가 지고 있었다. 저녁 준비를 하며 가족들과 오늘 있었던 일에 대해 이야기했다. 서로의 하루를 공유하면서 웃고 떠들다 보니, 하루의 피로가 조금씩 풀리는 기분이었다. 저녁 식사 후에는 간단히 설거지를 하고, 창가에 앉아 별을 바라보았다. 밤하늘에는 작은 별들이 반짝이고 있었고, 나는 그 빛을 보며 하루를 정리했다. 오늘 하루는 특별한 사건이 있었던 것은 아니지만, 평온하고 차분하게 흘러간 일상이 오히려 마음을 안정시켜 주었다.\n' +
            '\n' +
            '잠자리에 들기 전, 나는 오늘 하루를 돌아보며 감사한 마음을 가졌다. 작은 순간들 속에서도 행복을 느낄 수 있다는 것, 스스로를 돌아보고 생각할 수 있는 시간을 가질 수 있다는 것, 그리고 가족과의 소소한 대화 속에서 기쁨을 발견할 수 있다는 것. 이 모든 것이 오늘 하루를 의미 있게 만들어주었다. 내일도 오늘과 같은 평화로운 하루가 이어지길 바라며, 나는 조용히 눈을 감았다.',
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
    const [viewMode, setViewMode] = useState('page');
    const [ilogs, setIlogs] = useState<ILogData[]>(initialILogs);

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
                    <ILogListView ilogs={ilogs} /> // diaries 대신 ilogs를 전달
                ) : (
                    <ILogPageView ilogs={ilogs} />
                )}
            </MainContainer>
        </GestureHandlerRootView>
    );
}
