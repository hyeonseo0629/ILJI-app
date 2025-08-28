// app/(auth)/login.tsx  또는 screens/login.tsx

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
    SignInResponse,            // v15: signIn() 반환 타입
    SignInSilentlyResponse,    // v1s5: signInSilently() 반환 타입
} from '@react-native-google-signin/google-signin';

import { MainContainer } from '@/components/MainStyle';
import Header from '@/components/header/Header';

interface ExtraType {
    googleClientId?: {
        iosId?: string;
        androidId?: string;
        webId?: string;
    };
}

const extra: ExtraType = (Constants.expoConfig?.extra as ExtraType) ?? {};

const googleClientId = extra.googleClientId ?? {};

// 화면에 찍기 편한 요약(디버깅용)
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

// eslint-disable-next-line import/no-unused-modules
export default function LoginScreen(): React.JSX.Element {
    const [busy, setBusy] = useState(false);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    // 플랫폼별 클라이언트 설정
    const config = useMemo(
        () => ({
            webClientId: googleClientId.webId, // idToken/서버코드 받으려면 필수(웹 클라이언트 ID)
            ...(Platform.OS === 'ios' ? { iosClientId: googleClientId.iosId } : {}),
            offlineAccess: false,
            forceCodeForRefreshToken: false,
        }),
        [googleClientId.webId, googleClientId.iosId]
    );

    // 초기 설정
    useEffect(() => {
        GoogleSignin.configure(config);
    }, [config]);

    // 앱 시작 시, 저장된 자격으로 조용히 로그인 시도
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
                    // type === 'noSavedCredentialFound' → 무시
                    setUserInfo(null);
                }
            } catch {
                // 조용히 실패 무시
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
                Alert.alert('로그인 성공', s.email ?? '성공적으로 로그인했습니다.');
                // TODO: res.data.idToken 또는 serverAuthCode를 서버로 전송해 검증/세션 처리
            } else {
                // type === 'cancelled'
                // 사용자가 로그인 창에서 취소한 케이스
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
            Alert.alert('로그인 실패', error?.message ?? 'Google 로그인 중 오류가 발생했습니다.');
        } finally {
            setBusy(false);
        }
    };

    const handleGetTokens = async (): Promise<void> => {
        try {
            setBusy(true);
            // v15엔 isSignedIn() 없음 → 현재 유저 동기 조회
            const current = GoogleSignin.getCurrentUser(); // User | null (sync)
            if (!current) {
                Alert.alert('알림', '먼저 로그인하세요.');
                return;
            }

            const tokens = await GoogleSignin.getTokens(); // { accessToken?: string; idToken?: string }
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
            Alert.alert('로그아웃', '정상적으로 로그아웃되었습니다.');
        } catch (error: any) {
            Alert.alert('로그아웃 실패', error?.message ?? '로그아웃 중 오류가 발생했습니다.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <MainContainer>
            <Header sheetIndex={0} />
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
        </MainContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
    profileBox: { marginTop: 10, alignItems: 'center', width: '100%', maxWidth: 360 },
    avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
    profileText: { fontSize: 18, fontWeight: '700' },
    profileEmail: { fontSize: 14, color: '#555', marginTop: 2 },
});