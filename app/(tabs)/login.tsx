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
import { useSchedule } from '@/src/context/ScheduleContext'; // 스케줄 컨텍스트 import

// app.json에서 클라이언트 ID들을 가져옵니다.
const extra = Constants.expoConfig?.extra ?? {};
const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID as string;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID as string;

export default function LoginScreen(): React.JSX.Element {
    const { signIn, signOut, session, isLoading } = useSession();
    const { fetchSchedules } = useSchedule(); // fetchSchedules 함수를 가져옵니다.
    const [busy, setBusy] = useState(false);

    const config = useMemo(
        () => ({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            scopes: ['profile', 'email'],
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
            const errorMessage = 'Google Web Client ID is missing. Please check your app.json.';
            Alert.alert('Configuration Error', errorMessage);
            return;
        }

        try {
            setBusy(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            const userInfo = await GoogleSignin.signIn();
            const data = (userInfo as any).data;

            const idToken = data.idToken;
            const user = data.user;

            if (!idToken) {
                Alert.alert('Google Sign-In Error', 'Failed to retrieve authentication token (idToken) from Google.');
                return;
            }

            const backendUrl = Platform.OS === 'android' ? 'http://192.168.0.113:8090' : 'http://localhost:8090';

            const response = await fetch(`${backendUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                const authResponse = await response.json();

                console.log("✅ Backend Auth Success:", JSON.stringify(authResponse, null, 2));

                if (!authResponse.user || !authResponse.user.id) {
                    Alert.alert('Login Failed', 'User data not found in server response.');
                    return;
                }

                const sessionUser: SessionUser = {
                    user: {
                        id: authResponse.user.id,
                        name: authResponse.user.name,
                        email: authResponse.user.email,
                        photo: authResponse.user.picture,
                    },
                    token: authResponse.appToken,
                };
                
                console.log('[LoginScreen] Calling signIn with user ID:', sessionUser.user.id);
                await signIn(sessionUser);

            } else {
                const errorText = await response.text();
                Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
            }

        } catch (error: any) {
            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                console.error("LOGIN_NETWORK_ERROR: Could not connect to backend.", error);
                Alert.alert('로그인 실패', '서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
                return;
            }

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
                    'There is a configuration issue with Google Sign-In. Please check your `app.json` and Google Cloud Console settings.'
                );
                return;
            }
            Alert.alert('로그인 실패', `예상치 못한 오류가 발생했습니다: ${error?.message ?? 'Unknown'}`);
        } finally {
            setBusy(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await GoogleSignin.signOut();
            await signOut();
        } catch (error) {
            console.error("Sign Out Error:", error);
            Alert.alert('Sign Out Failed', 'An error occurred while signing out.');
        }
    };

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