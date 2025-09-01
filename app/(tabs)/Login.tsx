// app/(auth)/login.tsx  or screens/login.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import Constants from 'expo-constants';
import {
    GoogleSignin,
    statusCodes,
    User,
    SignInResponse,
    SignInSilentlyResponse,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOTE: The custom components causing resolution errors have been removed for compatibility.
// import { MainContainer } from '@/components/MainStyle';
// import Header from '@/components/header/Header';

// Get the extra config from app.json
const extra = Constants.expoConfig?.extra ?? {};

// Helper function for debugging
const summarize = (u: User) => ({
    email: u.user?.email ?? null,
    name: u.user?.name ?? null,
    givenName: u.user?.givenName ?? null,
    familyName: u.user?.familyName ?? null,
    photo: u.user?.photo ?? null,
    id: u.user?.id,
    idToken: u.idToken ?? null,
    serverAuthCode: u.serverAuthCode ?? null,
    scopes: u.scopes ?? [],
});

// The "import/no-unused-modules" warning is safe to ignore for Expo Router files.
// Your linter doesn't know Expo Router uses this file, so it thinks it's unused.
export default function LoginScreen(): React.JSX.Element {
    const [busy, setBusy] = useState(false);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    // Configure Google Sign-In
    const config = useMemo(
        () => ({
            // CORRECTED: Read client IDs directly from the 'extra' object
            webClientId: extra.GOOGLE_WEB_CLIENT_ID as string,
            ...(Platform.OS === 'ios'
                ? { iosClientId: extra.GOOGLE_IOS_CLIENT_ID as string }
                : {}),
            offlineAccess: false,
            forceCodeForRefreshToken: false,
        }),
        [] // Dependencies are constant, so this runs once
    );

    // Initialize Google Sign-In
    useEffect(() => {
        GoogleSignin.configure(config);
    }, [config]);

    // Attempt silent sign-in on app start
    useEffect(() => {
        (async () => {
            try {
                if (Platform.OS === 'android') {
                    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                }
                const silent: SignInSilentlyResponse = await GoogleSignin.signInSilently();
                if (silent.type === 'success') {
                    setUserInfo(silent.data);
                } else {
                    setUserInfo(null);
                }
            } catch {
                setUserInfo(null);
            }
        })();
    }, []);

    const handleGoogleSignIn = async (): Promise<void> => {
        try {
            setBusy(true);
            if (Platform.OS === 'android') {
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            }

            const res: SignInResponse = await GoogleSignin.signIn();
            if (res.type === 'success') {
                setUserInfo(res.data);
                const s = summarize(res.data);
                console.log('[Google Sign-In] summary:', s);
                
                // --- START: Backend Authentication ---
                if (res.data.idToken) {
                    try {
                        // NOTE: Using the computer's local IP address instead of localhost
                        const backendUrl = 'http://192.168.0.36:8081';
                        console.log(`[Backend Auth] Sending ID token to ${backendUrl}/api/auth/google`);
                        
                        const response = await fetch(`${backendUrl}/api/auth/google`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ token: res.data.idToken }),
                        });

                        if (response.ok) {
                            const authResponse = await response.json();
                            console.log('[Backend Auth] Successfully received JWT token.');
                            await AsyncStorage.setItem('jwtToken', authResponse.token);
                            Alert.alert('로그인 성공', '백엔드 인증에도 성공했습니다.');
                        } else {
                            const errorText = await response.text();
                            console.error(`[Backend Auth] Failed. Status: ${response.status}, Body: ${errorText}`);
                            throw new Error(`Backend authentication failed: ${errorText}`);
                        }
                    } catch (backendError: any) {
                        console.error('[Backend Auth] Error during fetch:', backendError);
                        Alert.alert('백엔드 인증 실패', backendError?.message ?? '백엔드 서버와 통신 중 오류가 발생했습니다.');
                    }
                } else {
                    Alert.alert('오류', 'Google ID 토큰을 가져올 수 없습니다.');
                }
                // --- END: Backend Authentication ---
            }
        } catch (error: any) {
            if (error?.code === statusCodes.SIGN_IN_CANCELLED) return;
            if (error?.code === statusCodes.IN_PROGRESS) {
                Alert.alert('알림', '이미 로그인 진행 중입니다.');
                return;
            }
            if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('오류', 'Google Play 서비스가 필요합니다.');
                return;
            }
            console.error('[Google Sign-In] Error:', error);
            Alert.alert('로그인 실패', error?.message ?? 'Google 로그인 중 오류가 발생했습니다.');
        } finally {
            setBusy(false);
        }
    };

    const handleGetTokens = async (): Promise<void> => {
        try {
            setBusy(true);
            const current = GoogleSignin.getCurrentUser();
            if (!current) {
                Alert.alert('알림', '먼저 로그인하세요.');
                return;
            }

            const tokens = await GoogleSignin.getTokens();
            console.log('[Google Sign-In] getTokens:', tokens);
            Alert.alert('토큰', `idToken: ${tokens.idToken ? '있음' : '없음'}`);
        } catch (error: any) {
            Alert.alert('토큰 조회 실패', error?.message ?? '토큰 조회 중 오류가 발생했습니다.');
        } finally {
            setBusy(false);
        }
    };

    const handleSignOut = async (): Promise<void> => {
        try {
            setBusy(true);
            await GoogleSignin.signOut();
            setUserInfo(null);
            await AsyncStorage.removeItem('jwtToken');
            console.log('[Auth] JWT token removed.');
            Alert.alert('로그아웃', '정상적으로 로그아웃되었습니다.');
        } catch (error: any)
        {
            Alert.alert('로그아웃 실패', error?.message ?? '로그아웃 중 오류가 발생했습니다.');
        } finally {
            setBusy(false);
        }
    };

    return (
        // Replaced MainContainer with a standard View to fix compilation issue.
        <View style={styles.mainContainer}>
            {/* Removed Header component to fix compilation issue. */}
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Sign in to sync your schedules.</Text>

                {busy && (
                    <View style={{ marginBottom: 16 }}>
                        <ActivityIndicator />
                    </View>
                )}

                {!userInfo ? (
                    <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
                ) : (
                    <View style={styles.profileBox}>
                        {userInfo.user?.photo ? (
                            <Image source={{ uri: userInfo.user.photo }} style={styles.avatar} />
                        ) : null}
                        <Text style={styles.profileText}>{userInfo.user?.name ?? '(이름 없음)'}</Text>
                        <Text style={styles.profileEmail}>{userInfo.user?.email ?? '(이메일 없음)'}</Text>

                        <View style={{ height: 12 }} />

                        <Button title="Get Tokens (debug)" onPress={handleGetTokens} />
                        <View style={{ height: 8 }} />
                        <Button title="Sign out" color="#c1121f" onPress={handleSignOut} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 }, // Added style for the new root View
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
    profileBox: { marginTop: 10, alignItems: 'center', width: '100%', maxWidth: 360 },
    avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
    profileText: { fontSize: 18, fontWeight: '700' },
    profileEmail: { fontSize: 14, color: '#555', marginTop: 2 },
});
