import React, {useState, useEffect} from 'react';
import {ScrollView, Alert, Modal, Text, View, TouchableOpacity} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as I from "@/components/style/I-logStyled";
import {ILogData} from "@/app/(tabs)/i-log";
import {format} from 'date-fns';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DetailActionsWrap, DetailDateWrap, DetailHeaderText} from "@/components/style/I-logStyled";

// Mock data for now - in a real app, you'd fetch this from a backend
const initialILogs: ILogData[] = [
    {
        id: 109,
        user_profile_id: 101,
        title: '작은 이야기',
        log_date: new Date('2025-05-10'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/500/400/400',
        created_at: new Date('2025-05-10T14:48:06.000Z'),
        like_count: 27,
        comment_count: 5,
        visibility: 1,
        friend_tags: JSON.stringify([]),
        tags: '#개발 #음악'
    },
    {
        id: 108,
        user_profile_id: 103,
        title: '새로운 시작',
        log_date: new Date('2025-04-29'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘ender 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/972/400/400',
        created_at: new Date('2025-04-29T19:54:06.000Z'),
        like_count: 32,
        comment_count: 1,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#개발 #공부'
    },
    {
        id: 107,
        user_profile_id: 101,
        title: '나의 하루',
        log_date: new Date('2025-04-21'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/769/400/400',
        created_at: new Date('2025-04-21T17:15:06.000Z'),
        like_count: 45,
        comment_count: 10,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {
            "id": 202,
            "name": "Charlie"
        }]),
        tags: '#일상 #기록'
    },
    {
        id: 106,
        user_profile_id: 102,
        title: '추억 한 조각',
        log_date: new Date('2025-03-24'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/563/400/400',
        created_at: new Date('2025-03-24T18:03:06.000Z'),
        like_count: 13,
        comment_count: 6,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#추억 #감성'
    },
    {
        id: 105,
        user_profile_id: 101,
        title: '깊은 고찰',
        log_date: new Date('2025-02-28'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/697/400/400',
        created_at: new Date('2025-02-28T11:29:06.000Z'),
        like_count: 36,
        comment_count: 8,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#생각 #독서'
    },
    {
        id: 104,
        user_profile_id: 103,
        title: '일상의 기록',
        log_date: new Date('2025-02-09'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/490/400/400',
        created_at: new Date('2025-02-09T16:09:06.000Z'),
        like_count: 21,
        comment_count: 3,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {
            "id": 202,
            "name": "Charlie"
        }]),
        tags: '#일상 #기록'
    },
    {
        id: 103,
        user_profile_id: 102,
        title: '새로운 발견',
        log_date: new Date('2025-01-19'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/41/400/400',
        created_at: new Date('2025-01-19T10:40:06.000Z'),
        like_count: 48,
        comment_count: 9,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#생각 #개발'
    },
    {
        id: 102,
        user_profile_id: 101,
        title: '오늘의 생각',
        log_date: new Date('2024-12-29'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/688/400/400',
        created_at: new Date('2024-12-29T15:21:06.000Z'),
        like_count: 19,
        comment_count: 2,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}]),
        tags: '#일상 #생각'
    },
    {
        id: 101,
        user_profile_id: 103,
        title: '특별한 순간',
        log_date: new Date('2024-11-20'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/150/400/400',
        created_at: new Date('2024-11-20T17:07:06.000Z'),
        like_count: 38,
        comment_count: 7,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}, {"id": 201, "name": "Bob"}, {
            "id": 202,
            "name": "Charlie"
        }]),
        tags: '#여행 #추억'
    },
    {
        id: 100,
        user_profile_id: 102,
        title: '나의 하루',
        log_date: new Date('2024-10-25'),
        content: '이것은 테스트를 위한 일기 내용입니다. 약 200자 정도의 길이를 가집니다. 이 내용은 시스템의 글자 수 제한 기능을 시험하고, 캘린더 연동 및 페이지 이동 기능을 확인하는 데 사용됩니다. 다양한 상황을 시뮬레이션하기 위해 여러 일기 항목을 생성합니다. 사용자 경험을 개선하기 위한 중요한 단계입니다. 계속해서 기능을 개선하고 안정성을 확보하는 데 집중하고 있습니다. 이 텍스트는 임의로 생성되었으며, 실제 의미는 없습니다. 시스템의 견고함을 확인하는 데 도움이 되기를 바랍니다.',
        img_url: 'https://picsum.photos/seed/891/400/400',
        created_at: new Date('2024-10-25T12:34:06.000Z'),
        like_count: 25,
        comment_count: 4,
        visibility: 1,
        friend_tags: JSON.stringify([{"id": 200, "name": "Alice"}]),
        tags: '#일상 #하루'
    }
].sort((a, b) => b.log_date.getTime() - a.log_date.getTime());

export default function ILogDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {id} = params;
    const [log, setLog] = useState<ILogData | null>(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (id) {
            // In a real app, you'd fetch the log from a database using the id
            const foundLog = initialILogs.find(item => item.id.toString() === id);
            if (foundLog) {
                // Ensure log_date and created_at are Date objects
                setLog({
                    ...foundLog,
                    log_date: new Date(foundLog.log_date),
                    created_at: new Date(foundLog.created_at)
                });
            } else {
                Alert.alert('오류', '일기를 찾을 수 없습니다.');
                router.back();
            }
        }
    }, [id]);

    const handleEdit = () => {
        if (log) {
            router.push({
                pathname: '/update-ilog',
                params: {
                    editLog: JSON.stringify(log),
                    uniqueTags: JSON.stringify([]) // You might want to pass actual unique tags here
                },
            });
        }
    };

    const handleDelete = () => {
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (log) {
            // Navigate back to the list and pass the deleted log's ID
            router.push({pathname: '/(tabs)/i-log', params: {deletedLogId: log.id.toString()}});
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
        if (log.friend_tags) {
            parsedFriendTags = JSON.parse(log.friend_tags);
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
                        <I.DetailDateText>{format(log.log_date, 'yyyy.MM.dd')}</I.DetailDateText>
                        <I.DetailTimeText>{format(log.created_at, 'HH:mm:ss')}</I.DetailTimeText>
                        <I.DetailActionsWrap>
                            <I.DetailActionButton onPress={handleEdit}>
                                <MaterialCommunityIcons name="square-edit-outline" size={28} color="black"/>
                            </I.DetailActionButton>
                            <I.DetailActionButton onPress={handleDelete}>
                                <MaterialCommunityIcons name="trash-can-outline" size={28} color="black"/>
                            </I.DetailActionButton>
                        </I.DetailActionsWrap>
                    </I.DetailDateWrap>

                    <I.DetailTitle>{log.title}</I.DetailTitle>

                    {log.img_url && (
                        <I.DetailImageContainer>
                            <I.DetailImage source={{uri: log.img_url}}/>
                            <I.DetailStatsContainer>
                                <I.DetailStatItem>
                                    <AntDesign name="heart" size={14} color="white"/>
                                    <I.DetailStatText>{log.like_count}</I.DetailStatText>
                                </I.DetailStatItem>
                                <I.DetailStatItem>
                                    <AntDesign name="message1" size={14} color="white"/>
                                    <I.DetailStatText>{log.comment_count}</I.DetailStatText>
                                </I.DetailStatItem>
                            </I.DetailStatsContainer>
                        </I.DetailImageContainer>
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

                    {log.tags && (
                        <I.DetailTagsContainer>
                            <I.DetailTagsText>{log.tags}</I.DetailTagsText>
                        </I.DetailTagsContainer>
                    )}
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
