import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, Alert, Modal, ActivityIndicator, Dimensions, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as I from "@/components/style/I-logStyled";
import { ILog } from '@/src/types/ilog';
import {format} from 'date-fns';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { useILog } from '@/src/context/ILogContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ILogDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {id} = params;
    const { ilogs, deleteILog } = useILog();
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];

    const [log, setLog] = useState<ILog | null>(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (id) {
            const foundLog = ilogs.find(item => item.id.toString() === id);
            if (foundLog) {
                setLog({
                    ...foundLog,
                    logDate: new Date(foundLog.logDate),
                    createdAt: new Date(foundLog.createdAt)
                });
            } else if (!isDeleting) {
                router.back();
            }
        }
    }, [id, ilogs, isDeleting]);

    const handleEdit = () => {
        setMenuVisible(false);
        if (log) {
            router.push({
                pathname: '/i-log/update-ilog/[id]',
                params: { id: log.id.toString() },
            });
        }
    };

    const handleDelete = () => {
        setMenuVisible(false);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (isDeleting || !log) return;
        setIsDeleting(true);
        await deleteILog(log.id);
        setDeleteModalVisible(false);
        router.push({ pathname: '/profile', params: { lastAction: 'deleted' } });
    };

    const handleImagePress = (url: string) => {
        setSelectedImageUrl(url);
        setImageModalVisible(true);
    };

    const closeImageModal = () => {
        setImageModalVisible(false);
        setSelectedImageUrl('');
    };

    if (!log) {
        return (
            <I.ScreenContainer $colors={theme} $paddingBottom={insets.bottom} $paddingTop={insets.top}>
                <I.DetailLoadingContainer>
                    <I.DetailModalText $colors={theme}>일기를 불러오는 중...</I.DetailModalText>
                </I.DetailLoadingContainer>
            </I.ScreenContainer>
        );
    }

    let parsedFriendTags: { id: number, name: string }[] = [];
    try {
        if (log.friendTags) parsedFriendTags = JSON.parse(log.friendTags);
    } catch (e) {
        console.error("Failed to parse friend_tags:", e);
    }

    const isMyLog = true; // Placeholder for actual ownership check

    return (
        <I.ScreenContainer $colors={theme}>
            <I.DetailHeader $colors={theme}>
                <I.HeaderButton onPress={() => router.push('/profile')}>
                    <AntDesign name="arrowleft" size={24} color={theme.text}/>
                    <I.DetailHeaderText $colors={theme}>뒤로가기</I.DetailHeaderText>
                </I.HeaderButton>
                {isMyLog && (
                    <I.MenuButton onPress={() => setMenuVisible(true)}>
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.text} />
                    </I.MenuButton>
                )}
            </I.DetailHeader>

            <ScrollView>
                <I.DetailWrap $colors={theme}>
                    <I.DetailDateWrap>
                        <I.DetailDateText $colors={theme}>{format(log.logDate, 'yyyy.MM.dd')}</I.DetailDateText>
                        <I.DetailTimeText $colors={theme}>{format(log.createdAt, 'HH:mm:ss')}</I.DetailTimeText>
                    </I.DetailDateWrap>

                    {log.images && log.images.length > 0 && (
                        <>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                                    const slide = Math.round(event.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 45));
                                    if (slide !== activeSlide) setActiveSlide(slide);
                                }}
                                snapToInterval={Dimensions.get('window').width}
                                snapToAlignment={'start'}
                            >
                                {log.images.map((imageUri, index) => (
                                    <I.CarouselItemWrapper key={index} isLast={index === log.images.length - 1}>
                                        <I.HeaderButton onPress={() => handleImagePress(imageUri)}>
                                            <I.DetailImage $colors={theme} source={{uri: imageUri}} resizeMode="cover"/>
                                        </I.HeaderButton>
                                        <I.DetailStatsContainer>
                                            <I.DetailStatItem>
                                                <AntDesign name="heart" size={14} color={theme.pointColors.white}/>
                                                <I.DetailStatText>{log.likeCount}</I.DetailStatText>
                                            </I.DetailStatItem>
                                            <I.DetailStatItem>
                                                <AntDesign name="message1" size={14} color={theme.pointColors.white}/>
                                                <I.DetailStatText>{log.commentCount}</I.DetailStatText>
                                            </I.DetailStatItem>
                                        </I.DetailStatsContainer>
                                    </I.CarouselItemWrapper>
                                ))}
                            </ScrollView>

                            {log.images.length > 1 && (
                                <I.PaginationContainer>
                                    {log.images.map((_, index) => (
                                        <I.HeaderButton
                                            key={index}
                                            onPress={() => {
                                                scrollViewRef.current?.scrollTo({x: index * Dimensions.get('window').width, animated: true});
                                                setActiveSlide(index);
                                            }}
                                        >
                                            <I.PaginationDot $colors={theme} active={activeSlide === index}>•</I.PaginationDot>
                                        </I.HeaderButton>
                                    ))}
                                </I.PaginationContainer>
                            )}
                        </>
                    )}

                    {parsedFriendTags.length > 0 && (
                        <I.DetailFriendTagsContainer>
                            {parsedFriendTags.map(tag => (
                                <I.DetailFriendTag key={tag.id} $colors={theme}>
                                    <I.DetailFriendTagText $colors={theme}>@{tag.name}</I.DetailFriendTagText>
                                </I.DetailFriendTag>
                            ))}
                        </I.DetailFriendTagsContainer>
                    )}

                    <I.DetailContent $colors={theme}>{log.content}</I.DetailContent>
                </I.DetailWrap>
            </ScrollView>

            {/* Action Menu Modal */}
            <Modal transparent={true} animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
                <I.ActionMenuModalOverlay onPress={() => setMenuVisible(false)}>
                    <I.ActionMenuContent $colors={theme}>
                        <I.ActionMenuItem onPress={handleEdit}>
                            <I.ActionMenuItemText $colors={theme}>수정</I.ActionMenuItemText>
                            <MaterialCommunityIcons name="square-edit-outline" size={24} color={theme.text}/>
                        </I.ActionMenuItem>
                        <I.ActionMenuItem onPress={handleDelete}>
                            <I.ActionMenuItemText $colors={theme} isDelete={true}>삭제</I.ActionMenuItemText>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.notification}/>
                        </I.ActionMenuItem>
                    </I.ActionMenuContent>
                </I.ActionMenuModalOverlay>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
                <I.DetailModalBackdrop activeOpacity={1} onPressOut={() => setDeleteModalVisible(false)}>
                    <I.DetailModalContainer $colors={theme}>
                        {isDeleting ? (
                            <>
                                <ActivityIndicator size="large" color={theme.text}/>
                                <I.DetailModalText $colors={theme} style={{marginTop: 10}}>삭제 중...</I.DetailModalText>
                            </>
                        ) : (
                            <>
                                <I.DetailModalTitle $colors={theme}>일기 삭제</I.DetailModalTitle>
                                <I.DetailModalText $colors={theme}>정말로 이 일기를 삭제하시겠습니까?</I.DetailModalText>
                                <I.DetailModalButtonContainer>
                                    <I.DetailModalCancelButton $colors={theme} onPress={() => setDeleteModalVisible(false)}>
                                        <I.DetailModalButtonText color={theme.text}>취소</I.DetailModalButtonText>
                                    </I.DetailModalCancelButton>
                                    <I.DetailModalDeleteButton $colors={theme} onPress={confirmDelete}>
                                        <I.DetailModalButtonText color={theme.pointColors.white}>삭제</I.DetailModalButtonText>
                                    </I.DetailModalDeleteButton>
                                </I.DetailModalButtonContainer>
                            </>
                        )}
                    </I.DetailModalContainer>
                </I.DetailModalBackdrop>
            </Modal>

            {/* Image Modal */}
            <Modal animationType="fade" transparent={true} visible={isImageModalVisible} onRequestClose={closeImageModal}>
                <I.ImageModalOverlay onPress={closeImageModal}>
                    <I.FullScreenImage source={{ uri: selectedImageUrl }} />
                    <I.ImageModalCloseButton onPress={closeImageModal} topInset={insets.top}>
                        <AntDesign name="close" size={32} color={theme.pointColors.white} />
                    </I.ImageModalCloseButton>
                </I.ImageModalOverlay>
            </Modal>
        </I.ScreenContainer>
    );
}
