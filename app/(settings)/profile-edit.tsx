import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import * as ImagePicker from 'expo-image-picker';
import api from '../../src/lib/api';

export default function ProfileEditScreen() {
    const theme = useTheme();
    const [nickname, setNickname] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [newProfileImage, setNewProfileImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [nicknameError, setNicknameError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/user/profile');
            setNickname(response.data.nickname);
            setNewNickname(response.data.nickname);
            setProfileImage(response.data.profileImage);
        } catch (e) {
            Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setNewProfileImage(result.assets[0]);
        }
    };

    const checkNicknameAvailability = async (name: string) => {
        if (!name) {
            setNicknameError('닉네임을 입력해주세요.');
            return;
        }
        if (name === nickname) {
            setNicknameError(null);
            setIsChecking(false);
            return;
        }
        const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
        if (!nicknameRegex.test(name)) {
            setNicknameError('2~10자의 한글, 영문, 숫자로 구성되어야 합니다.');
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        try {
            await api.get(`/user/profile/check-nickname?nickname=${encodeURIComponent(name)}`);
            setNicknameError(null);
        } catch (e: any) {
            if (e.response && e.response.status === 409) {
                setNicknameError('이미 사용 중인 닉네임입니다.');
            } else {
                setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsChecking(false);
        }
    };

    const debouncedCheck = useCallback(debounce(checkNicknameAvailability, 500), [nickname]);

    const handleNicknameChange = (text: string) => {
        setNewNickname(text);
        debouncedCheck(text);
    };

    const handleSave = async () => {
        if (nicknameError || isChecking) {
            Alert.alert('저장 불가', '닉네임 확인 후 다시 시도해주세요.');
            return;
        }
        setIsSaving(true);

        try {
            const formData = new FormData();

            // 1. 닉네임 등 텍스트 데이터를 JSON 객체로 준비
            const requestData: { nickname?: string } = {};
            if (newNickname !== nickname && newNickname.length > 0) {
                requestData.nickname = newNickname;
            }

            // FormData에 JSON 문자열로 추가
            formData.append('request', JSON.stringify(requestData));

            // 2. 이미지 파일이 새로 선택된 경우 FormData에 추가
            if (newProfileImage) {
                const uri = newProfileImage.uri;
                const uriParts = uri.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('profileImage', {
                    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }

            // 3. 서버에 PUT 요청 전송
            await api.put('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('성공', '프로필이 성공적으로 변경되었습니다.');
            fetchUserProfile(); // 최신 정보 다시 불러오기
            setNewProfileImage(null); // 선택한 이미지 상태 초기화

        } catch (e) {
            console.error(e);
            Alert.alert('오류', '프로필 변경에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const displayImageUri = newProfileImage?.uri || profileImage;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Profile Image Edit */}
            <View style={styles.imageSection}>
                <Image
                    source={displayImageUri ? { uri: displayImageUri } : require('../../assets/images/logo.png')}
                    style={styles.profileImage}
                />
                <TouchableOpacity onPress={pickImage} style={styles.imageChangeButton}>
                    <Text style={[styles.changeButtonText, { color: theme.colors.primary }]}>사진 변경</Text>
                </TouchableOpacity>
            </View>

            {/* Nickname Edit */}
            <View style={styles.nicknameSection}>
                <Text style={[styles.label, { color: theme.colors.text }]}>닉네임</Text>
                <TextInput
                    style={[
                        styles.input,
                        { color: theme.colors.text, borderColor: theme.colors.border },
                        nicknameError ? { borderColor: theme.colors.notification } : {}
                    ]}
                    value={newNickname}
                    onChangeText={handleNicknameChange}
                    autoCapitalize="none"
                    maxLength={10}
                />
                <View style={styles.feedbackContainer}>
                    {isChecking ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        nicknameError && <Text style={[styles.errorText, { color: theme.colors.notification }]}>{nicknameError}</Text>
                    )}
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSave}
                disabled={isSaving}
            >
                {isSaving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>저장</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ccc',
    },
    imageChangeButton: {
        marginTop: 10,
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nicknameSection: {
        marginBottom: 30,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    feedbackContainer: {
        paddingVertical: 5,
        height: 20,
    },
    errorText: {
        fontSize: 12,
    },
    saveButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
