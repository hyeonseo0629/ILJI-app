import React, { useState, useEffect, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import debounce from 'lodash/debounce';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import api from '../../src/lib/api';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import {
    ProfileEditScrollView,
    ProfileLoadingContainer,
    ImageSection,
    ProfileImage,
    ImageChangeButton,
    ChangeButtonText,
    NicknameSection,
    Label,
    StyledInput,
    FeedbackContainer,
    ErrorText,
    SaveButton,
    SaveButtonText
} from '@/components/style/SettingStyled';

type ManipulatedImageResult = Awaited<ReturnType<typeof ImageManipulator.manipulateAsync>>;

export default function ProfileEditScreen() {
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];

    const [nickname, setNickname] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [newProfileImage, setNewProfileImage] = useState<ManipulatedImageResult | null>(null);

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
            quality: 1, // 원본 품질로 선택
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            try {
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 800 } }], // 가로 800px로 리사이즈
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // 70% 품질의 JPEG로 압축
                );
                setNewProfileImage(manipulatedImage);
            } catch (error) {
                Alert.alert("오류", "이미지를 처리하는 중 오류가 발생했습니다.");
                console.error("Image manipulation error:", error);
            }
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

            const requestData: { nickname?: string } = {};
            if (newNickname !== nickname && newNickname.length > 0) {
                requestData.nickname = newNickname;
            }

            formData.append('request', JSON.stringify(requestData));

            if (newProfileImage) {
                const uri = newProfileImage.uri;
                formData.append('profileImage', {
                    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                    name: `photo.jpg`,
                    type: `image/jpeg`,
                } as any);
            }

            await api.put('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('성공', '프로필이 성공적으로 변경되었습니다.');
            fetchUserProfile();
            setNewProfileImage(null);

        } catch (e: any) {
            console.error('Error saving profile:', JSON.stringify(e, null, 2));
            if (e.response) {
                console.error('Axios response data:', e.response.data);
                console.error('Axios response status:', e.response.status);
                console.error('Axios response headers:', e.response.headers);
            } else if (e.request) {
                console.error('Axios request:', e.request);
            } else {
                console.error('Error message:', e.message);
            }
            Alert.alert('오류', '프로필 변경에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <ProfileLoadingContainer $colors={theme}>
                <ActivityIndicator size="large" color={theme.pointColors.purple} />
            </ProfileLoadingContainer>
        );
    }

    const displayImageUri = newProfileImage?.uri || profileImage;

    return (
        <ProfileEditScrollView $colors={theme}>
            <ImageSection>
                <ProfileImage
                    $colors={theme}
                    source={displayImageUri ? { uri: displayImageUri } : require('../../assets/images/logo.png')}
                />
                <ImageChangeButton onPress={pickImage}>
                    <ChangeButtonText $colors={theme}>사진 변경</ChangeButtonText>
                </ImageChangeButton>
            </ImageSection>

            <NicknameSection>
                <Label $colors={theme}>닉네임</Label>
                <StyledInput
                    $colors={theme}
                    value={newNickname}
                    onChangeText={handleNicknameChange}
                    autoCapitalize="none"
                    maxLength={10}
                    hasError={!!nicknameError}
                />
                <FeedbackContainer>
                    {isChecking ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        nicknameError && <ErrorText $colors={theme}>{nicknameError}</ErrorText>
                    )}
                </FeedbackContainer>
            </NicknameSection>

            <SaveButton $colors={theme} onPress={handleSave} disabled={isSaving}>
                {isSaving ? (
                    <ActivityIndicator color={theme.pointColors.white} />
                ) : (
                    <SaveButtonText>저장</SaveButtonText>
                )}
            </SaveButton>
        </ProfileEditScrollView>
    );
}