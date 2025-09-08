import * as I from "@/components/style/I-logStyled";
import { FlatList, View } from "react-native";
import { ILogData } from "@/app/(tabs)/i-log";
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';

// FlatList의 각 아이템을 렌더링하는 컴포넌트
const ListItem = ({ item }: { item: ILogData }) => {
    const maxLength = 80; // 내용 글자 수 제한

    // 각 다이어리 내용의 길이를 조절합니다.
    const truncatedContent = item.content.length > maxLength
        ? item.content.substring(0, maxLength) + "..."
        : item.content;

    return (
        <I.ListWrap>
            {/* 이미지가 있을 경우에만 썸네일 표시 */}
            {item.img_url && (
                <I.ListThumbnail source={{ uri: item.img_url }} />
            )}
            <I.ListMainContent>
                <I.ListHeader>
                    <I.ListDateText>{format(item.i_log_date, 'yyyy.MM.dd')}</I.ListDateText>
                    {/* 요청하신대로 우측 상단에 작성 시간 추가 */}
                    <I.ListTimeText>{format(item.created_at, 'HH:mm:ss')}</I.ListTimeText>
                </I.ListHeader>

                <I.ListTitle>{item.title}</I.ListTitle>
                <I.ListContent>{truncatedContent}</I.ListContent>

                {/* 좋아요, 댓글 */}
                <I.ListStatsContainer>
                    <I.ListStatItem>
                        <AntDesign name="hearto" size={12} color="#777" />
                        <I.ListStatText>{item.like_count}</I.ListStatText>
                    </I.ListStatItem>
                    <I.ListStatItem>
                        <AntDesign name="message1" size={12} color="#777" />
                        <I.ListStatText>{item.comment_count}</I.ListStatText>
                    </I.ListStatItem>
                </I.ListStatsContainer>

                {/* 태그 */}
                {item.tags && (
                    <I.ListTagsContainer>
                        <I.ListTagsText>{item.tags}</I.ListTagsText>
                    </I.ListTagsContainer>
                )}
            </I.ListMainContent>
        </I.ListWrap>
    );
};

// ILogListView 메인 컴포넌트
const ILogListView = ({ ilogs }: { ilogs: ILogData[] }) => {
    if (!ilogs || ilogs.length === 0) {
        return <View><I.PageContent>작성된 일지가 없습니다.</I.PageContent></View>;
    }

    return (
        <I.Container> 
            <FlatList
                data={ilogs}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </I.Container>
    );
};

export default ILogListView;
