import {Dimensions, View, FlatList, ViewToken, TouchableOpacity} from "react-native";
import * as I from "@/components/style/I-logStyled";
import React, {useRef, useEffect} from "react";
import {ILogData} from "@/app/(tabs)/i-log";
import {format} from 'date-fns';
import {AntDesign, EvilIcons} from '@expo/vector-icons';
import { useRouter } from "expo-router";

const {width} = Dimensions.get("window");

const DiaryPage = ({item, onDatePress}: { item: ILogData, onDatePress: () => void }) => {
    const router = useRouter();
    let parsedFriendTags: { id: number, name: string }[] = [];
    try {
        if (item.friend_tags) {
            parsedFriendTags = JSON.parse(item.friend_tags);
        }
    } catch (e) {
        console.error("Failed to parse friend_tags:", e);
    }

    const handleNavigateToDetail = () => {
        router.push({ pathname: '/i-log/[id]', params: { id: item.id.toString() } });
    };

    return (
        <I.PageWrap>
            <I.PageScrollView showsVerticalScrollIndicator={false}>
                <I.PageHeader>
                    <I.PageDateInfo>
                        <I.PageDateButton onPress={onDatePress}>
                            <EvilIcons name="search" size={35} style={{marginBottom:5}}/>
                            <I.PageDateText>{format(item.log_date, 'yyyy.MM.dd')}</I.PageDateText>
                        </I.PageDateButton>
                        <I.PageTimeText>{format(item.created_at, 'HH:mm:ss')}</I.PageTimeText>
                    </I.PageDateInfo>
                </I.PageHeader>

                {/* Wrap content below header in a TouchableOpacity for navigation */}
                <TouchableOpacity activeOpacity={0.8} onPress={handleNavigateToDetail}>

                    {item.img_url && (
                        <I.PageImageContainer>
                            <I.PageImage source={{uri: item.img_url}}/>
                            <I.PageStatsContainer>
                                <I.PageStatItem>
                                    <AntDesign name="heart" size={14} color="white"/>
                                    <I.PageStatText>{item.like_count}</I.PageStatText>
                                </I.PageStatItem>
                                <I.PageStatItem>
                                    <AntDesign name="message1" size={14} color="white"/>
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
                </TouchableOpacity>
            </I.PageScrollView>
        </I.PageWrap>
    );
};

const ILogPageView = ({ilogs, onDatePress, scrollToIndex, onPageChange}: {
    ilogs: ILogData[],
    onDatePress: () => void,
    scrollToIndex: number | null,
    onPageChange: (index: number) => void
}) => {
    const flatListRef = useRef<FlatList<ILogData>>(null);

    const onViewableItemsChanged = useRef(({viewableItems}: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index;
            if (currentIndex !== null) {
                onPageChange(currentIndex);
            }
        }
    });

    const viewabilityConfig = useRef({itemVisiblePercentThreshold: 50});

    const getItemLayout = (data: any, index: number) => ({
        length: width,
        offset: width * index,
        index,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                flatListRef.current &&
                ilogs &&
                scrollToIndex !== null &&
                scrollToIndex >= 0 &&
                scrollToIndex < ilogs.length
            ) {
                try {
                    flatListRef.current.scrollToIndex({
                        index: scrollToIndex,
                        animated: false,
                    });
                } catch (e) {
                    console.error("Failed to scroll in ILogPageView:", e);
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [scrollToIndex, ilogs]);

    if (!ilogs || ilogs.length === 0) {
        return <View><I.PageContent>작성된 일지가 없습니다.</I.PageContent></View>;
    }

    const renderItem = ({item}: { item: ILogData }) => (
        <View style={{width}}>
            <DiaryPage item={item} onDatePress={onDatePress}/>
        </View>
    );

    return (
        <I.Container>
            <FlatList
                ref={flatListRef}
                data={ilogs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout}
                windowSize={2}
                initialNumToRender={1}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig.current}
            />
        </I.Container>
    );
};

export default ILogPageView;
