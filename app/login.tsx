import { useSession, SessionUser } from '@/hooks/useAuth';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

// app.json에서 클라이언트 ID들을 가져옵니다.
const extra = Constants.expoConfig?.extra ?? {};
const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID as string;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID as string;

export default function LoginScreen(): React.JSX.Element {
    // useSession 훅을 사용하여 세션 상태와 함수들을 가져옵니다.
    const { signIn, signOut, session, isLoading } = useSession();
    // 로그인 진행 중 상태를 관리합니다.
    const [busy, setBusy] = useState(false);
    const router = useRouter();

    // useMemo를 사용하여 Google Sign-In 설정을 최적화합니다.
    const config = useMemo(
        () => ({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            scopes: ['profile', 'email'],
            // Platform.OS 값에 따라 iosClientId를 동적으로 추가합니다.
            ...(Platform.OS === 'ios'
                ? { iosClientId: GOOGLE_IOS_CLIENT_ID }
                : {}),
            offlineAccess: false,
            forceCodeForRefreshToken: false,
        }),
        []
    );

    useEffect(() => {
        if (GOOGLE_WEB_CLIENT_ID) {
            GoogleSignin.configure(config);
        } else {
            console.error('Google Web Client ID is missing!');
        }
    }, [config]);

    const handleGoogleSignIn = async (): Promise<void> => {
        if (!GOOGLE_WEB_CLIENT_ID) {
            const errorMessage = 'Google Web Client ID is missing. Please check your app10.json.';
            Alert.alert('Configuration Error', errorMessage);
            return;
        }

        try {
            setBusy(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            const userInfo = await GoogleSignin.signIn();
            console.log("userInfo :", userInfo)
            const data = (userInfo as any).data;
            console.log("✅ Google Login Success:", data);

            // Google 로그인 성공 후 받은 데이터에서 idToken과 user 정보를 추출합니다.
            const idToken = data.idToken;
            const user = data.user;

            if (!idToken) {
                Alert.alert('Google Sign-In Error', 'Failed to retrieve authentication token (idToken) from Google.');
                return;
            }

            // 플랫폼에 따라 백엔드 서버 주소를 다르게 설정합니다.
            const backendUrl = Platform.OS === 'android' ? 'http://10.100.1.29:8090' : 'http://localhost:8090';

            const response = await fetch(`${backendUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                const authResponse = await response.json();

                // 백엔드 응답에 user 객체와 id가 있는지 확인합니다.
                if (!authResponse.user || !authResponse.user.id) {
                    Alert.alert('Login Failed', 'User data not found in server response.');
                    return;
                }

                // 백엔드에서 받은 user 객체를 세션 user 타입에 맞게 매핑합니다.
                const sessionUser: SessionUser = {
                    user: {
                        id: authResponse.user.id,
                        name: authResponse.user.name,
                        email: authResponse.user.email,
                        photo: authResponse.user.picture, // 'picture'를 'photo'로 매핑
                    },
                    token: authResponse.appToken,
                };

                await signIn(sessionUser);
            } else {
                const errorText = await response.text();
                Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
            }

        } catch (error: any) {
            // iOS 코드의 상세한 에러 핸들링을 적용합니다.
            if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Sign-in was cancelled by the user.');
                return;
            }
            if (error?.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Info', 'Sign-in is already in progress.');
                return;
            }
            if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services is required.');
                return;
            }
            if (error?.code === '10') { // DEVELOPER_ERROR
                 Alert.alert(
                    'Developer Error',
                    'There is a configuration issue with Google Sign-In. Please check your `app10.json` and Google Cloud Console settings.'
                );
                return;
            }
            Alert.alert('Login Failed', `An unexpected error occurred: ${error?.message ?? 'Unknown'}`);
        } finally {
            setBusy(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await GoogleSignin.signOut();
            await signOut(); // useSession의 signOut 함수 호출
        } catch (error) {
            console.error("Sign Out Error:", error);
            Alert.alert('Sign Out Failed', 'An error occurred while signing out.');
        }
    };

    // 로딩 중일 때 ActivityIndicator를 보여줍니다.
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {session ? (
                <>
                    <Text style={styles.title}>Welcome</Text>
                    <Text style={styles.subtitle}>{session.user.name}</Text>
                    <Text style={{ marginBottom: 20 }}>{session.user.email}</Text>
                    <Button title="Sign Out" onPress={handleSignOut} />
                </>
            ) : (
                <>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.subtitle}>Sign in to sync your schedules.</Text>
                    {busy && (
                        <View style={{ marginBottom: 16 }}>
                            <ActivityIndicator />
                        </View>
                    )}
                    <Button
                        title="Sign in with Google"
                        onPress={handleGoogleSignIn}
                        disabled={busy}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
});
