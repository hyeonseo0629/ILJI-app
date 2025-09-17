import { useSession } from '@/hooks/useAuth';
import React, { useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import getProfileStyles from '@/components/style/ProfileStyled';

export default function ProfileScreen(): React.JSX.Element {
    const { session } = useSession();
    const [menuVisible, setMenuVisible] = useState(false);
    const { isDarkColorScheme } = useColorScheme(); // Get dark mode state
    const styles = getProfileStyles(isDarkColorScheme); // Get styles based on dark mode

    const navigateToSettings = () => {
        setMenuVisible(false);
        router.push('/settings-main');
    };

    const navigateToProfileEdit = () => {
        setMenuVisible(false);
        router.push('/profile-edit');
    };

    if (!session || !session.user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    const { user } = session;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Menu Modal (Dropdown) */}
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
                        <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
                            <Ionicons name="menu" size={32} color={styles.menuIcon.color} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profilePictureContainer}>
                        {user.photo ? (
                            <Image source={{ uri: user.photo }} style={styles.profilePicture} />
                        ) : (
                            <View style={styles.profilePicturePlaceholder} />
                        )}
                    </View>
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user.name ?? '(No Name)'}</Text>
                    <Text style={styles.bio}>
                        자기소개를 작성해주세요.
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
