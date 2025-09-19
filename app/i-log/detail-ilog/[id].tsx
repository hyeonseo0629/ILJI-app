import React, {useState, useEffect} from 'react';
import {ScrollView, Alert, Modal} from 'react-native';
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
    const [isDeleting, setIsDeleting] = useState(false); // Add isDeleting state to prevent race condition
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (id) {
            const foundLog = ilogs.find(item => item.id.toString() === id);
            if (foundLog) {
                // Ensure log_date and created_at are Date objects
                setLog({
                    ...foundLog,
                    logDate: new Date(foundLog.logDate),
                    createdAt: new Date(foundLog.createdAt)
                });
            } else {
                // Only navigate back if not in the process of deletion
                if (!isDeleting) {
                    router.back();
                }
            }
        }
    }, [id, ilogs, isDeleting]);

    const handleEdit = () => {
        if (log) {
            router.push({
                pathname: '/i-log/update-ilog/[id]',
                params: {
                    id: log.id.toString(),
                },
            });
        }
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (log) {
            setIsDeleting(true);
            await deleteILog(log.id);
            setDeleteModalVisible(false);
            // Navigate to list page with a parameter to indicate successful deletion
            router.push({
                pathname: '/i-log',
                params: { lastAction: 'deleted' },
            });
        }
        setDeleteModalVisible(false);
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
        if (log.friendTags) {
            parsedFriendTags = JSON.parse(log.friendTags);
        }
    } catch (e) {
        console.error("Failed to parse friend_tags:", e);
    }

    return (
        <I.ScreenContainer>
            <I.DetailHeader onPress={() => router.push('/i-log')}>
                <AntDesign name="arrowleft" size={24} color="black"/>
                <I.DetailHeaderText>뒤로가기</I.DetailHeaderText>
            </I.DetailHeader>
            <ScrollView style={{flex: 1}}>
                <I.DetailWrap>
                    <I.DetailDateWrap>
                        <I.DetailDateText>{format(log.logDate, 'yyyy.MM.dd')}</I.DetailDateText>
                        <I.DetailTimeText>{format(log.createdAt, 'HH:mm:ss')}</I.DetailTimeText>
                    </I.DetailDateWrap>

                    {log.images && log.images.length > 0 && (
                        <I.DetailImageContainer>
                            <I.DetailImage source={{uri: log.images[0]}}/>
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
                        </I.DetailImageContainer>
                    )}

                    <I.DetailActionsWrap>
                        <I.DetailActionButton onPress={handleEdit} style={{marginRight: 10}}>
                            <MaterialCommunityIcons name="square-edit-outline" size={40} color="mediumslateblue"/>
                        </I.DetailActionButton>
                        <I.DetailActionButton onPress={handleDelete}>
                            <MaterialCommunityIcons name="trash-can-outline" size={40} color="#D25A5A"/>
                        </I.DetailActionButton>
                    </I.DetailActionsWrap>


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

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <I.DetailModalBackdrop
                    activeOpacity={1}
                    onPressOut={() => setDeleteModalVisible(false)}
                >
                    <I.DetailModalContainer>
                        <I.DetailModalTitle>일기 삭제</I.DetailModalTitle>
                        <I.DetailModalText>정말로 이 일기를 삭제하시겠습니까?</I.DetailModalText>
                        <I.DetailModalButtonContainer>
                            <I.DetailModalCancelButton
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <I.DetailModalButtonText color="black">취소</I.DetailModalButtonText>
                            </I.DetailModalCancelButton>
                            <I.DetailModalDeleteButton
                                onPress={confirmDelete}
                            >
                                <I.DetailModalButtonText color="white">삭제</I.DetailModalButtonText>
                            </I.DetailModalDeleteButton>
                        </I.DetailModalButtonContainer>
                    </I.DetailModalContainer>
                </I.DetailModalBackdrop>
            </Modal>
        </I.ScreenContainer>
    );
}


