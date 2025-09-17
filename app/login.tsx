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
import { useRouter } from 'expo-router';

// app.json에서 클라이언트 ID들을 가져옵니다.
const extra = Constants.expoConfig?.extra ?? {};
const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID as string;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID as string;

export default function LoginScreen(): React.JSX.Element {
    const { signIn, signOut, session, isLoading } = useSession();
    const { fetchSchedules } = useSchedule(); // fetchSchedules 함수를 가져옵니다.
    const [busy, setBusy] = useState(false);
    const router = useRouter();

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
        console.log('[Login] Attempting Google Sign-In...');
        if (!GOOGLE_WEB_CLIENT_ID) {
            const errorMessage = 'Google Web Client ID is missing. Please check your app.json.';
            console.error(`[Login] 🛑 Configuration Error: ${errorMessage}`);
            Alert.alert('Configuration Error', errorMessage);
            return;
        }

        try {
            setBusy(true);
            console.log('[Login] Checking for Google Play Services...');
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log('[Login] Google Play Services are available.');

            console.log('[Login] Initiating Google Sign-In prompt...');
            const userInfo = await GoogleSignin.signIn();
            console.log('[Login] ✅ Google Sign-In successful. User info received:', JSON.stringify(userInfo, null, 2));

            const data = (userInfo as any).data;
            if (!data) {
                console.error('[Login] 🛑 No `data` field in userInfo response from Google Sign-In.');
                Alert.alert('Google Sign-In Error', 'Received incomplete user data from Google.');
                return;
            }

            const idToken = data.idToken;
            const user = data.user;
            console.log(`[Login] Extracted idToken (first 10 chars): ${idToken?.substring(0, 10)}...`);
            console.log('[Login] Extracted user from Google:', JSON.stringify(user, null, 2));


            if (!idToken) {
                console.error('[Login] 🛑 idToken is missing from Google Sign-In response.');
                Alert.alert('Google Sign-In Error', 'Failed to retrieve authentication token (idToken) from Google.');
                return;
            }

            const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
            if (!API_BASE_URL) {
                Alert.alert('Configuration Error', 'API_BASE_URL is not set in app.json.');
                return;
            }

            const backendUrl = `${API_BASE_URL}/api/auth/google`;
            console.log(`[Login] Sending idToken to backend at: ${backendUrl}`);

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });

            console.log(`[Login] Backend response status: ${response.status}`);

            if (response.ok) {
                const authResponse = await response.json();
                console.log("✅ [Login] Backend Auth Success:", JSON.stringify(authResponse, null, 2));

                if (!authResponse.user || !authResponse.user.id) {
                    console.error('[Login] 🛑 User data or user ID not found in server response:', authResponse);
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

                console.log('[Login] Calling signIn with user ID:', sessionUser.user.id);
                await signIn(sessionUser);
                console.log('[Login] ✅ signIn successful, session created.');

            } else {
                const errorText = await response.text();
                console.error(`[Login] 🛑 Backend Auth Failed. Status: ${response.status}, Body: ${errorText}`);
                Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
            }

        } catch (error: any) {
            console.error('[Login] 🛑 An unexpected error occurred during the sign-in process:', JSON.stringify(error, null, 2));

            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                console.error("[Login] LOGIN_NETWORK_ERROR: Could not connect to backend.", error);
                Alert.alert('로그인 실패', '서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
                return;
            }

            const errorCode = error?.code;
            switch (errorCode) {
                case statusCodes.SIGN_IN_CANCELLED:
                    console.log('[Login] Sign-in was cancelled by the user.');
                    break;
                case statusCodes.IN_PROGRESS:
                    console.log('[Login] Sign-in is already in progress.');
                    Alert.alert('Info', 'Sign-in is already in progress.');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.error('[Login] Google Play Services is not available.');
                    Alert.alert('Error', 'Google Play Services is required for this action.');
                    break;
                case '10': // DEVELOPER_ERROR for Google Sign-In
                    console.error('[Login] Google Sign-In Developer Error. Check configuration.', error);
                    Alert.alert(
                        'Developer Error',
                        'There is a configuration issue with Google Sign-In. Please check your `app.json` and Google Cloud Console settings.'
                    );
                    break;
                default:
                    console.error(`[Login] Unhandled error code: ${errorCode}`, error);
                    Alert.alert('로그인 실패', `예상치 못한 오류가 발생했습니다: ${error?.message ?? 'Unknown'}`);
                    break;
            }
        } finally {
            setBusy(false);
            console.log('[Login] Sign-in process finished.');
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