import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, Alert, Modal, View, ActivityIndicator, Text, Dimensions, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, Image, Pressable, StyleSheet} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as I from "@/components/style/I-logStyled";
import { ILog } from '@/src/types/ilog';
import {format} from 'date-fns';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { useILog } from '@/src/context/ILogContext';

export default function ILogDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {id} = params;
    const { ilogs, deleteILog } = useILog();
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
            <I.ScreenContainer $paddingBottom={insets.bottom} $paddingTop={insets.top}>
                <I.DetailLoadingContainer>
                    <I.DetailModalText>일기를 불러오는 중...</I.DetailModalText>
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
        <I.ScreenContainer>
            <I.DetailHeader style={{ justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => router.push('/profile')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="arrowleft" size={24} color="black"/>
                    <I.DetailHeaderText>뒤로가기</I.DetailHeaderText>
                </TouchableOpacity>
                {isMyLog && (
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ padding: 5 }}>
                        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </I.DetailHeader>

            <ScrollView style={{flex: 1}}>
                <I.DetailWrap>
                    <I.DetailDateWrap>
                        <I.DetailDateText>{format(log.logDate, 'yyyy.MM.dd')}</I.DetailDateText>
                        <I.DetailTimeText>{format(log.createdAt, 'HH:mm:ss')}</I.DetailTimeText>
                    </I.DetailDateWrap>

                    {log.images && log.images.length > 0 && (
                        <View>
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
                                        <TouchableOpacity onPress={() => handleImagePress(imageUri)}>
                                            <I.DetailImage source={{uri: imageUri}} resizeMode="cover"/>
                                        </TouchableOpacity>
                                        <I.DetailStatsContainer>
                                            <I.DetailStatItem>
                                                <AntDesign name="heart" size={14} color="white"/>
                                                <I.DetailStatText>{log.likeCount}</I.DetailStatText>
                                            </I.DetailStatItem>
                                            <I.DetailStatItem>
                                                <AntDesign name="message1" size={14} color="white"/>
                                                <I.DetailStatText>{log.commentCount}</I.DetailStatText>
                                            </I.DetailStatItem>
                                        </I.DetailStatsContainer>
                                    </I.CarouselItemWrapper>
                                ))}
                            </ScrollView>

                            {log.images.length > 1 && (
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                    {log.images.map((_, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                scrollViewRef.current?.scrollTo({x: index * Dimensions.get('window').width, animated: true});
                                                setActiveSlide(index);
                                            }}
                                        >
                                            <Text style={{fontSize: 24, color: activeSlide === index ? 'black' : 'gray', marginHorizontal: 4}}>•</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {parsedFriendTags.length > 0 && (
                        <I.DetailFriendTagsContainer>
                            {parsedFriendTags.map(tag => (
                                <I.DetailFriendTag key={tag.id}>
                                    <I.DetailFriendTagText>@{tag.name}</I.DetailFriendTagText>
                                </I.DetailFriendTag>
                            ))}
                        </I.DetailFriendTagsContainer>
                    )}

                    <I.DetailContent>{log.content}</I.DetailContent>
                </I.DetailWrap>
            </ScrollView>

            {/* Action Menu Modal */}
            <Modal transparent={true} animationType="fade" visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuContent}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                            <Text style={styles.menuItemText}>수정</Text>
                            <MaterialCommunityIcons name="square-edit-outline" size={24} color="#333"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                            <Text style={[styles.menuItemText, {color: '#D25A5A'}]}>삭제</Text>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#D25A5A"/>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal animationType="fade" transparent={true} visible={isDeleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
                <I.DetailModalBackdrop activeOpacity={1} onPressOut={() => setDeleteModalVisible(false)}>
                    <I.DetailModalContainer>
                        {isDeleting ? (
                            <>
                                <ActivityIndicator size="large" color="black"/>
                                <I.DetailModalText style={{marginTop: 10}}>삭제 중...</I.DetailModalText>
                            </>
                        ) : (
                            <>
                                <I.DetailModalTitle>일기 삭제</I.DetailModalTitle>
                                <I.DetailModalText>정말로 이 일기를 삭제하시겠습니까?</I.DetailModalText>
                                <I.DetailModalButtonContainer>
                                    <I.DetailModalCancelButton onPress={() => setDeleteModalVisible(false)}>
                                        <I.DetailModalButtonText color="black">취소</I.DetailModalButtonText>
                                    </I.DetailModalCancelButton>
                                    <I.DetailModalDeleteButton onPress={confirmDelete}>
                                        <I.DetailModalButtonText color="white">삭제</I.DetailModalButtonText>
                                    </I.DetailModalDeleteButton>
                                </I.DetailModalButtonContainer>
                            </>
                        )}
                    </I.DetailModalContainer>
                </I.DetailModalBackdrop>
            </Modal>

            {/* Image Modal */}
            <Modal animationType="fade" transparent={true} visible={isImageModalVisible} onRequestClose={closeImageModal}>
                <Pressable style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }} onPress={closeImageModal}>
                    <Image source={{ uri: selectedImageUrl }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }}/>
                    <TouchableOpacity onPress={closeImageModal} style={{ position: 'absolute', top: insets.top + 10, right: 20, zIndex: 1 }}>
                        <AntDesign name="close" size={32} color="white" />
                    </TouchableOpacity>
                </Pressable>
            </Modal>
        </I.ScreenContainer>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    menuContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginTop: 50, // Adjust as needed to position below the header
        marginRight: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: 120, // Adjust width as needed
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
});