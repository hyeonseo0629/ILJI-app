import {useSession, SessionUser} from '@/hooks/useAuth';
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
    const {signIn, signOut, session, isLoading} = useSession();
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
        console.log('Configuring Google Sign-In...');
        if (GOOGLE_WEB_CLIENT_ID) {
            GoogleSignin.configure(config);
            console.log('Google Sign-In configured with:', config);
        } else {
            console.error('Google Web Client ID is missing!');
        }
    }, [config]);

    const handleGoogleSignIn = async (): Promise<void> => {
        console.log('Attempting Google Sign-In...');
        if (!GOOGLE_WEB_CLIENT_ID) {
            const errorMessage = 'Google Web Client ID is missing. Please check your app.json and ensure `extra.GOOGLE_WEB_CLIENT_ID` is set correctly.';
            Alert.alert('Configuration Error', errorMessage);
            console.error(errorMessage);
            return;
        }

        try {
            setBusy(true);
            console.log('Checking for Play Services...');
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            console.log('Play Services are available.');

            console.log('Calling GoogleSignin.signIn()...');
            const userInfo = (await GoogleSignin.signIn()) as any;
            console.log('Google Sign-In Success! User Info:', JSON.stringify(userInfo, null, 2));

            // Correctly access the nested data from the userInfo object
            const idToken = userInfo.data.idToken;
            const user = userInfo.data.user;

            if (!idToken) {
                const errorMessage = 'Failed to retrieve authentication token (idToken) from Google. This usually means the `webClientId` in your app configuration does not match the one in your Google Cloud project.';
                Alert.alert('Google Sign-In Error', errorMessage);
                console.error(errorMessage, 'Received userInfo:', userInfo);
                return;
            }

            if (!user || !user.email) {
                const errorMessage = 'Could not retrieve user profile (email) from Google. Please ensure your Google account has an email and that the app has permission.';
                Alert.alert('Google Sign-In Error', errorMessage);
                console.error(errorMessage, 'Received user object:', user);
                return;
            }

            // 플랫폼에 따라 백엔드 서버 주소를 다르게 설정합니다.
            const backendUrl = Platform.OS === 'android' ? 'http://10.100.0.86:8090' : 'http://localhost:8090';

            console.log(`Sending idToken to backend: ${backendUrl}/api/auth/google`);
            const response = await fetch(`${backendUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                const authResponse = await response.json();
                const sessionUser: SessionUser = {
                    user: { name: user.name, email: user.email, photo: user.photo },
                    token: authResponse.appToken,
                };
                console.log('Backend authentication successful. Signing in...');
                await signIn(sessionUser);
            } else {
                const errorText = await response.text();
                Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
                console.error('Backend Auth Failed:', errorText);
            }

        } catch (error: any) {
            console.error('--- Google Sign-In Error ---');
            console.error('Full Error Object:', JSON.stringify(error, null, 2));
            console.error('--------------------------');

            if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('Sign-in was cancelled by the user.');
                return;
            }
            if (error?.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Info', 'Sign-in is already in progress.');
                console.warn('Sign-in is already in progress.');
                return;
            }
            if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services is required.');
                console.error('Google Play Services is not available.');
                return;
            }
            if (error?.code === '10') { // DEVELOPER_ERROR
                 Alert.alert(
                    'Developer Error',
                    'There is a configuration issue with Google Sign-In. Please check your `app.json` and Google Cloud Console settings (SHA-1, Bundle ID, etc.)'
                );
                return;
            }
            Alert.alert('Login Failed', `An unexpected error occurred: ${error?.message ?? 'Unknown'}`);
        } finally {
            setBusy(false);
            console.log('Google Sign-In flow finished.');
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to sync your schedules.</Text>

            {busy && (
                <View style={{ marginBottom: 16 }}>
                    <ActivityIndicator />
                </View>
            )}

            <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
    subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
});
