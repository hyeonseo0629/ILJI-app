import { Dimensions, View, FlatList } from "react-native";
import * as I from "@/components/style/I-logStyled";
import React from "react";
import { ILogData } from "@/app/(tabs)/i-log";
import { format } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

// DiaryPage는 FlatList의 각 아이템을 렌더링하는 역할을 합니다.
const DiaryPage = ({ item }: { item: ILogData }) => {
    let parsedFriendTags: {id: number, name: string}[] = [];
    try {
        if (item.friend_tags) {
            parsedFriendTags = JSON.parse(item.friend_tags);
        }
    } catch (e) {
        console.error("Failed to parse friend_tags:", e);
    }

    return (
        <I.PageWrap>
            <I.PageScrollView showsVerticalScrollIndicator={false}>
                <I.PageHeader>
                    <I.PageDateInfo>
                        <I.PageDateText>{format(item.i_log_date, 'yyyy.MM.dd')}</I.PageDateText>
                        <I.PageTimeText>{format(item.created_at, 'HH:mm:ss')}</I.PageTimeText>
                    </I.PageDateInfo>
                </I.PageHeader>

                <I.PageTitle>{item.title}</I.PageTitle>

                {item.img_url && (
                    <I.PageImageContainer>
                        <I.PageImage source={{ uri: item.img_url }} />
                        <I.PageStatsContainer>
                            <I.PageStatItem>
                                <AntDesign name="heart" size={14} color="white" />
                                <I.PageStatText>{item.like_count}</I.PageStatText>
                            </I.PageStatItem>
                            <I.PageStatItem>
                                <AntDesign name="message1" size={14} color="white" />
                                <I.PageStatText>{item.comment_count}</I.PageStatText>
                            </I.PageStatItem>
                        </I.PageStatsContainer>
                    </I.PageImageContainer>
                )}

                {parsedFriendTags.length > 0 && (
                    <I.PageFriendTagsContainer>
                        {parsedFriendTags.map(tag => (
                            <I.PageFriendTag key={tag.id}>
                                <I.PageFriendTagText>@{tag.name}</I.PageFriendTagText>
                            </I.PageFriendTag>
                        ))}
                    </I.PageFriendTagsContainer>
                )}

                <I.PageContent>{item.content}</I.PageContent>

                {item.tags && (
                    <I.PageTagsContainer>
                        <I.PageTagsText>{item.tags}</I.PageTagsText>
                    </I.PageTagsContainer>
                )}
            </I.PageScrollView>
        </I.PageWrap>
    );
};

// FlatList를 사용하여 페이지 뷰를 구현한 메인 컴포넌트
const ILogPageView = ({ ilogs }: { ilogs: ILogData[] }) => {

    if (!ilogs || ilogs.length === 0) {
        return <View><I.PageContent>작성된 일지가 없습니다.</I.PageContent></View>;
    }

    const renderItem = ({ item }: { item: ILogData }) => (
        <View style={{ width }}>
            <DiaryPage item={item} />
        </View>
    );

    const getItemLayout = (data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });

    return (
        <I.Container>
            <FlatList
                data={ilogs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                windowSize={2}
            />
        </I.Container>
    );
};

export default ILogPageView;
