import { useSession } from '@/hooks/useAuth';
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    SafeAreaView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import getProfileStylesAndTheme from '@/components/style/ProfileStyled';
import api from '@/src/lib/api';

// API 응답에 대한 타입 정의 (필드 이름 수정)
interface UserProfile {
    nickname: string;
    bio: string;
    profileImage: string | null; // profileImageUrl -> profileImage
    bannerImage: string | null;  // bannerImageUrl -> bannerImage
}

export default function ProfileScreen(): React.JSX.Element {
    const { session } = useSession();
    const [menuVisible, setMenuVisible] = useState(false);
    const { isDarkColorScheme } = useColorScheme();
    const { styles, theme } = getProfileStylesAndTheme(isDarkColorScheme);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async () => {
        if (!session) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/user/profile');

            if (response.status === 200) {
                const data: UserProfile = response.data;
                // The backend URL for images is already handled by the base URL in the api instance if relative.
                // However, if the image URL is absolute, it will be used as is.
                // Let's assume the api instance is configured correctly and we receive full URLs or the baseURL is prepended.
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
        router.push('/settings-main');
    };

    const navigateToProfileEdit = () => {
        setMenuVisible(false);
        router.push('/(settings)/profile-edit');
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    // 표시할 이름, 프로필 사진, 자기소개를 결정합니다. (변수명 수정)
    const displayName = profile?.nickname ?? session?.user?.name ?? '(No Name)';
    const displayPhoto = profile?.profileImage ?? session?.user?.photo;
    const displayBio = profile?.bio || '자기소개를 작성해주세요.';
    const displayBanner = profile?.bannerImage;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={menuVisible}
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.modalItem} onPress={navigateToProfileEdit}>
                                <Text style={styles.modalItemText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={navigateToSettings}>
                                <Text style={styles.modalItemText}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <View style={styles.profileHeader}>
                    <View style={styles.banner}>
                        {displayBanner && <Image source={{ uri: displayBanner }} style={styles.bannerImage} />}
                        <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
                            <Ionicons name="menu" size={32} color={theme.iconColor} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={navigateToProfileEdit} style={styles.profilePictureContainer}>
                        {displayPhoto ? (
                            <Image source={{ uri: displayPhoto }} style={styles.profilePicture} />
                        ) : (
                            <View style={styles.profilePicturePlaceholder}>
                                <Ionicons name="person" size={60} color={theme.iconColor} />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{displayName}</Text>
                    <Text style={styles.bio}>
                        {displayBio}
                    </Text>
                </View>

                <View style={styles.diarySection}>
                    <Text style={styles.sectionTitle}>내가 쓴 일기</Text>
                    <View style={styles.diaryEntry}>
                        <Text style={styles.diaryText}>첫 번째 일기</Text>
                    </View>
                    <View style={styles.diaryEntry}>
                        <Text style={styles.diaryText}>두 번째 일기</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
