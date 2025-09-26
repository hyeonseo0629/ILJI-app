import {
    Dimensions,
    View,
    FlatList,
    ViewToken,
    TouchableOpacity,
    Text,
    ScrollView,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Modal,
    Image,
    Pressable, Platform
} from "react-native";
import * as I from "@/components/style/I-logStyled";
import React, {useRef, useEffect, useState} from "react";
import {ILog} from '@/src/types/ilog';
import {format} from 'date-fns';
import {AntDesign, EvilIcons} from '@expo/vector-icons';
import {useRouter} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width} = Dimensions.get("window");

const DiaryPage = ({item, onDatePress, onImagePress}: { item: ILog, onDatePress: () => void, onImagePress: (url: string) => void }) => {
    const router = useRouter();
    const [activeSlide, setActiveSlide] = React.useState(0);
    const scrollViewRef = React.useRef<ScrollView>(null);
    let parsedFriendTags: { id: number, name: string }[] = [];
    try {
        if (item.friendTags) {
            parsedFriendTags = JSON.parse(item.friendTags);
        }
    } catch (e) {
        console.error("Failed to parse friend_tags:", e);
    }

    const handleNavigateToDetail = () => {
        router.push({pathname: '/i-log/detail-ilog/[id]', params: {id: item.id.toString()}});
    };

    const { height: windowHeight } = Dimensions.get('window'); // Get total window height
    const insets = useSafeAreaInsets();
    const statusBarHeight = insets.top;
    const navigationBarHeight = insets.bottom;

    const usableScreenHeight = windowHeight - statusBarHeight - navigationBarHeight;

    return (
        <I.PageWrap style={{ height: usableScreenHeight }}>
            <I.PageScrollView showsVerticalScrollIndicator={false}>
                <I.PageHeader>
                    <I.PageDateInfo>
                        <I.PageDateButton onPress={onDatePress}>
                            <EvilIcons name="search" size={35} style={{marginBottom: 5}}/>
                            <I.PageDateText>{format(item.logDate, 'yyyy.MM.dd')}</I.PageDateText>
                        </I.PageDateButton>
                        <I.PageTimeText>{format(item.createdAt, 'HH:mm:ss')}</I.PageTimeText>
                    </I.PageDateInfo>
                </I.PageHeader>

                {item.images && item.images.length > 0 && (
                    <View>
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                                const slide = Math.round(event.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 45));
                                if (slide !== activeSlide) {
                                    setActiveSlide(slide);
                                }
                            }}
                            snapToAlignment={'start'}
                        >
                            {item.images.map((imageUri, index) => (
                                <TouchableOpacity key={index} onPress={() => onImagePress(imageUri)}>
                                    <I.CarouselItemWrapper
                                        isLast={index === item.images.length - 1}
                                    >
                                        <I.PageImage source={{uri: imageUri}}/>
                                        <I.PageStatsContainer>
                                            <I.PageStatItem>
                                                <AntDesign name="heart" size={14} color="white"/>
                                                <I.PageStatText>{item.likeCount}</I.PageStatText>
                                            </I.PageStatItem>
                                            <I.PageStatItem>
                                                <AntDesign name="message1" size={14} color="white"/>
                                                <I.PageStatText>{item.commentCount}</I.PageStatText>
                                            </I.PageStatItem>
                                        </I.PageStatsContainer>
                                    </I.CarouselItemWrapper>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {item.images.length > 1 && (
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                {item.images.map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            scrollViewRef.current?.scrollTo({
                                                x: index * Dimensions.get('window').width,
                                                animated: true
                                            });
                                            setActiveSlide(index);
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 24,
                                            color: activeSlide === index ? 'black' : 'gray',
                                            marginHorizontal: 4
                                        }}>•</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                <TouchableOpacity onPress={handleNavigateToDetail}>
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
                </TouchableOpacity>
            </I.PageScrollView>
        </I.PageWrap>
    );
};

const ILogPageView = ({
    ilogs,
    onDatePress,
    scrollToIndex,
    onPageChange,
    ListHeaderComponent, // New prop
}: {
    ilogs: ILog[];
    onDatePress: () => void;
    scrollToIndex: number | null;
    onPageChange: (index: number) => void;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined; // New prop type
}) => {
    const flatListRef = useRef<FlatList<ILog>>(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = Dimensions.get('window');

    useEffect(() => {
        console.log('ILogPageView - Window Height:', windowHeight);
        console.log('ILogPageView - Insets Top:', insets.top);
        console.log('ILogPageView - Insets Bottom:', insets.bottom);
        console.log('ILogPageView - Usable Height:', windowHeight - insets.top - insets.bottom);
    }, [windowHeight, insets]);

    const handleImagePress = (url: string) => {
        setSelectedImageUrl(url);
        setImageModalVisible(true);
    };

    const closeImageModal = () => {
        setImageModalVisible(false);
        setSelectedImageUrl('');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            const currentIndex = viewableItems[0].index;
            if (currentIndex !== null) {
                onPageChange(currentIndex);
            }
        }
    });

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });

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

    const statusBarHeight = insets.top;
    const navigationBarHeight = insets.bottom;

    const usableScreenHeight = windowHeight - statusBarHeight - navigationBarHeight;

    if (!ilogs || ilogs.length === 0) {
        return (
            <I.PageNoContentWrap style={{ height: usableScreenHeight }}>
                {ListHeaderComponent && (React.isValidElement(ListHeaderComponent) ? ListHeaderComponent : React.createElement(ListHeaderComponent))}
                <I.PageNoContentText>작성된 일지가 없습니다.</I.PageNoContentText>
            </I.PageNoContentWrap>
        );
    }

    const renderItem = ({ item }: { item: ILog }) => (
            <DiaryPage item={item} onDatePress={onDatePress} onImagePress={handleImagePress} />
    );

    return (
        <I.Container>
            {ListHeaderComponent && (React.isValidElement(ListHeaderComponent) ? ListHeaderComponent : React.createElement(ListHeaderComponent))}
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={isImageModalVisible}
                onRequestClose={closeImageModal}
            >
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }} onPress={closeImageModal}>
                    <Image
                        source={{ uri: selectedImageUrl }}
                        style={{ width: '100%', height: '80%', resizeMode: 'contain' }}
                    />
                    <TouchableOpacity
                        onPress={closeImageModal}
                        style={{ position: 'absolute', top: insets.top + 10, right: 20, zIndex: 1 }}
                    >
                        <AntDesign name="close" size={32} color="white" />
                    </TouchableOpacity>
                </Pressable>
            </Modal>
        </I.Container>
    );
};

export default ILogPageView;
