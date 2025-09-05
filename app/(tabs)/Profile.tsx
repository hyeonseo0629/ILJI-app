import { useSession } from '@/hooks/useAuth'; // useAuth.ts에서 useSession 임포트
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen(): React.JSX.Element {
    const { session } = useSession();
    const [menuVisible, setMenuVisible] = useState(false);

    const navigateToSettings = () => {
        setMenuVisible(false);
        router.push('/settings');
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
        <ScrollView style={styles.container}>
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
                        <Ionicons name="menu" size={32} color="black" />
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
                    <Text>첫 번째 일기</Text>
                </View>
                <View style={styles.diaryEntry}>
                    <Text>두 번째 일기</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        marginBottom: 60,
        marginTop: 60,
    },
    banner: {
        height: 150,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    menuIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
        padding: 5, // Add padding to make it easier to press
    },
    profilePictureContainer: {
        position: 'absolute',
        top: 100,
        left: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    profilePicture: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    profilePicturePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: '#ccc',
    },
    profileInfo: {
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        fontStyle: 'italic',
        textAlign: 'center'
    },
    diarySection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    diaryEntry: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
    },
    // Dropdown Menu Styles
    modalOverlay: {
        flex: 1,
    },
    modalContent: {
        position: 'absolute',
        top: 95, // Position below the banner/header area
        right: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
});
