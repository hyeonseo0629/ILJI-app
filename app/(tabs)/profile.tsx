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
        if (!session?.token) {
            setIsLoading(false);
            return;
        }

        try {
            const backendUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8090' : 'http://localhost:8090';
            const response = await fetch(`${backendUrl}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${session.token}`,
                },
            });

            if (response.ok) {
                const data: UserProfile = await response.json();
                // 이미지가 상대 경로일 경우, 전체 URL을 구성합니다.
                if (data.profileImage && !data.profileImage.startsWith('http')) {
                    data.profileImage = `${backendUrl}${data.profileImage}`;
                }
                if (data.bannerImage && !data.bannerImage.startsWith('http')) {
                    data.bannerImage = `${backendUrl}${data.bannerImage}`;
                }
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
    const displayPhoto = profile?.profileImage ?? session?.user?.photo; // profileImageUrl -> profileImage
    const displayBio = profile?.bio || '자기소개를 작성해주세요.';
    const displayBanner = profile?.bannerImage; // bannerImageUrl -> bannerImage

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
                    <View style={styles.profilePictureContainer}>
                        {displayPhoto ? (
                            <Image source={{ uri: displayPhoto }} style={styles.profilePicture} />
                        ) : (
                            <View style={styles.profilePicturePlaceholder}>
                                <Ionicons name="person" size={60} color={theme.iconColor} />
                            </View>
                        )}
                    </View>
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
