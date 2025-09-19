import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import api from '../../src/lib/api'; // 중앙 API 인스턴스 가져오기

export default function AccountSettingsScreen() {
    const theme = useTheme();
    const [nickname, setNickname] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/user/profile');
            setNickname(response.data.nickname);
            setNewNickname(response.data.nickname);
        } catch (e) {
            Alert.alert('오류', '프로필 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const checkNicknameAvailability = async (name: string) => {
        if (!name || name === nickname) {
            setError(null);
            setIsChecking(false);
            return;
        }
        const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
        if (!nicknameRegex.test(name)) {
            setError('닉네임은 2~10자의 한글, 영문, 숫자로 구성되어야 합니다.');
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        try {
            await api.get(`/user/profile/check-nickname?nickname=${encodeURIComponent(name)}`);
            setError(null); // 성공 시 에러 없음
        } catch (e: any) {
            if (e.response && e.response.status === 409) {
                setError('이미 사용 중인 닉네임입니다.');
            } else {
                setError('닉네임 확인 중 오류가 발생했습니다.');
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

    const handleSaveNickname = async () => {
        if (error || isChecking || !newNickname || newNickname === nickname) {
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/user/profile/set-nickname', { nickname: newNickname });
            setNickname(newNickname);
            setIsEditing(false);
            Alert.alert('성공', '닉네임이 성공적으로 변경되었습니다.');
        } catch (e) {
            Alert.alert('오류', '닉네임 변경에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setNewNickname(nickname);
        setIsEditing(false);
        setError(null);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Change Nickname */}
            <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.settingText, { color: theme.colors.text }]}>닉네임</Text>
                {!isEditing ? (
                    <View style={styles.valueContainer}>
                        <Text style={[styles.nicknameText, { color: theme.colors.text }]}>{nickname}</Text>
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Text style={[styles.changeButtonText, { color: theme.colors.primary }]}>변경</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.editContainer}>
                        <TextInput
                            style={[
                                styles.input,
                                { color: theme.colors.text, borderColor: theme.colors.border },
                                error ? { borderColor: theme.colors.notification } : {}
                            ]}
                            value={newNickname}
                            onChangeText={handleNicknameChange}
                            autoCapitalize="none"
                            maxLength={10}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity onPress={handleSaveNickname} disabled={isSaving || isChecking || !!error}>
                                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>저장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancel}>
                                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
            {isEditing && (
                <View style={styles.feedbackContainer}>
                    {isChecking ? (
                        <ActivityIndicator size="small" />
                    ) : (
                        error && <Text style={[styles.errorText, { color: theme.colors.notification }]}>{error}</Text>
                    )}
                </View>
            )}

            {/* Delete Account */}
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => console.log('계정 탈퇴 클릭')}>
                <Text style={[styles.settingText, { color: theme.colors.text }]}>계정 탈퇴</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    settingText: {
        fontSize: 18,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nicknameText: {
        fontSize: 18,
        marginRight: 10,
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    editContainer: {
        flex: 1,
        marginLeft: 20,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    feedbackContainer: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        alignItems: 'flex-end',
    },
    errorText: {
        fontSize: 12,
    },
});