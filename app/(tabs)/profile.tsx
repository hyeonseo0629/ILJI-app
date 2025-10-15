import {useSession} from '@/hooks/useAuth';
import React, {useState, useCallback, useEffect} from 'react';
import {
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Modal,
    View,
    Text
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Colors} from '@/constants/Colors';
import api from '@/src/lib/api';
import DiaryScreen from "@/components/i-log/DiaryScreen";
import {useILog} from '@/src/context/ILogContext';
import * as I from "@/components/style/I-logStyled";
import {
    ProfileContainer,
    LoadingContainer,
    ProfileHeaderContainer,
    Banner,
    BannerImage,
    MenuIcon,
    ProfilePictureContainer,
    ProfilePicture,
    ProfilePicturePlaceholder,
    ProfileInfo,
    ProfileName,
    Bio,
    ModalOverlay,
    ModalContent,
    ModalItem,
    ModalItemText
} from "@/components/style/ProfileStyled";

interface UserProfile {
    nickname: string;
    bio: string;
    profileImage: string | null;
    bannerImage: string | null;
}

export default function ProfileScreen(): React.JSX.Element {
    const {session} = useSession();
    const [menuVisible, setMenuVisible] = useState(false);
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];
    const {ilogs, fetchILogs} = useILog(); // fetchILogs 추가
    const params = useLocalSearchParams(); // params 추가

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 삭제 후 목록 새로고침을 위한 useEffect
    useEffect(() => {
        if (params.lastAction === 'deleted') {
            fetchILogs();
        }
    }, [params.lastAction]);

    const fetchProfile = async () => {
        if (!session) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/user/profile');

            if (response.status === 200) {
                const data: UserProfile = response.data;
                setProfile(data);
            } else {
                console.log("프로필 정보를 가져오는데 실패했습니다.");
            }
        } catch (error) {
            console.error("프로필 정보 조회 중 오류 발생:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchProfile();
        }, [session])
    );

    const navigateToSettings = () => {
        setMenuVisible(false);
        router.push('/(settings)/settings-main');
    };

    const navigateToProfileEdit = () => {
        setMenuVisible(false);
        router.push('/(settings)/profile-edit');
    };

    const handleAddPress = () => {
        const simplifiedIlogs = ilogs.map(log => ({
            id: log.id,
            logDate: log.logDate.toISOString(),
        }));

        router.push({
            pathname: '../i-log/add-ilog/add-ilog',
            params: {
                existingLogs: JSON.stringify(simplifiedIlogs),
            },
        });
    };

    if (isLoading) {
        return (
            <LoadingContainer $colors={theme}>
                <ActivityIndicator/>
            </LoadingContainer>
        );
    }

    const displayName = profile?.nickname ?? session?.user?.name ?? '(No Name)';
    const displayPhoto = profile?.profileImage ?? session?.user?.photo;
    const displayBio = profile?.bio || '자기소개를 작성해주세요.';
    const displayBanner = profile?.bannerImage;

    const ProfileHeader = () => (
        <ProfileHeaderContainer>
            <Modal
                transparent={true}
                animationType="fade"
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <ModalOverlay onPress={() => setMenuVisible(false)}>
                    <ModalContent $colors={theme}>
                        <ModalItem onPress={navigateToProfileEdit}>
                            <ModalItemText $colors={theme}>Edit Profile</ModalItemText>
                        </ModalItem>
                        <ModalItem onPress={navigateToSettings}>
                            <ModalItemText $colors={theme}>Settings</ModalItemText>
                        </ModalItem>
                    </ModalContent>
                </ModalOverlay>
            </Modal>

            <Banner $colors={theme}>
                {displayBanner && <BannerImage source={{uri: displayBanner}}/>}
                <MenuIcon onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={32} color={theme.icon}/>
                </MenuIcon>
            </Banner>
            <ProfilePictureContainer $colors={theme} onPress={navigateToProfileEdit}>
                {displayPhoto ? (
                    <ProfilePicture source={{uri: displayPhoto}}/>
                ) : (
                    <ProfilePicturePlaceholder $colors={theme}>
                        <Ionicons name="person" size={60} color={theme.icon}/>
                    </ProfilePicturePlaceholder>
                )}
            </ProfilePictureContainer>

            <ProfileInfo $colors={theme}>
                <ProfileName $colors={theme}>{displayName}</ProfileName>
                <Bio $colors={theme}>
                    {displayBio}
                </Bio>
            </ProfileInfo>
        </ProfileHeaderContainer>
    );

    return (
        <ProfileContainer $colors={theme}>
            <DiaryScreen ListHeader={ProfileHeader} theme={theme}/>
            <I.ButtonIconWrap onPress={handleAddPress}>
                <I.ButtonIcon name="square-edit-outline" $colors={theme} color='#7B68EE'/>
            </I.ButtonIconWrap>
        </ProfileContainer>
    );
}
