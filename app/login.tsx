import { useSession, SessionUser } from '@/hooks/useAuth';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import Constants from 'expo-constants';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { useSchedule } from '@/src/context/ScheduleContext';
import { useRouter } from 'expo-router';
import { palette } from '../constants/Colors';
import IljiLogo from '../assets/images/logo.png';

const extra = Constants.expoConfig?.extra ?? {};
const GOOGLE_WEB_CLIENT_ID = extra.GOOGLE_WEB_CLIENT_ID as string;
const GOOGLE_IOS_CLIENT_ID = extra.GOOGLE_IOS_CLIENT_ID as string;

export default function LoginScreen(): React.JSX.Element {
    const { signIn, session, isLoading } = useSession();
    const { fetchSchedules } = useSchedule();
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
            if (Platform.OS === 'android') {
                await GoogleSignin.signOut();
            }
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const userInfo = await GoogleSignin.signIn();
            const data = (userInfo as any).data;
            if (!data) {
                Alert.alert('Google Sign-In Error', 'Received incomplete user data from Google.');
                return;
            }

            const idToken = data.idToken;
            if (!idToken) {
                Alert.alert('Google Sign-In Error', 'Failed to retrieve authentication token (idToken) from Google.');
                return;
            }

            const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
            if (!API_BASE_URL) {
                Alert.alert('Configuration Error', 'API_BASE_URL is not set in app.json.');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                const authResponse = await response.json();
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
                await signIn(sessionUser);
            } else {
                const errorText = await response.text();
                Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
            }
        } catch (error: any) {
            const errorCode = error?.code;
            switch (errorCode) {
                case statusCodes.SIGN_IN_CANCELLED:
                    break;
                case statusCodes.IN_PROGRESS:
                    Alert.alert('Info', 'Sign-in is already in progress.');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    Alert.alert('Error', 'Google Play Services is required for this action.');
                    break;
                default:
                    Alert.alert('로그인 실패', `예상치 못한 오류가 발생했습니다: ${error?.message ?? 'Unknown'}`);
                    break;
            }
        } finally {
            setBusy(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator color={palette.purple_400} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {session ? (
                <View style={styles.centeredContent}>
                    {busy ? (
                        <ActivityIndicator color={palette.purple_400} />
                    ) : (
                        <>
                            {session.user.photo && (
                                <Image source={{ uri: session.user.photo }} style={styles.profileImage} />
                            )}
                            <Text style={styles.title}>Welcome</Text>
                            <Text style={styles.subtitle}>{session.user.name}</Text>
                            <Text style={styles.emailText}>{session.user.email}</Text>
                        </>
                    )}
                </View>
            ) : (
                <View style={styles.centeredContent}>
                    <Image source={IljiLogo} style={styles.logo} />
                    <Text style={styles.subtitle}>Plan your days.</Text>
                    <Text style={styles.subtitle}>Remember your moments.</Text>
                    {busy ? (
                        <ActivityIndicator style={{ height: 48 }} color={palette.purple_400} />
                    ) : (
                        <View style={styles.googleButtonWrapper}>
                            <GoogleSigninButton
                                style={{ width: '100%', height: '100%' }}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Light}
                                onPress={handleGoogleSignIn}
                                disabled={busy}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.offWhite_purple,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: palette.gray_800,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: palette.gray_600,
        textAlign: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    emailText: {
        fontSize: 14,
        color: palette.gray_500,
        marginBottom: 20,
    },
    googleButtonWrapper: {
        width: '80%',
        height: 80,
        borderTopWidth: 2,
        borderTopColor: palette.purple_300,
        borderRadius: 8,
        overflow: 'hidden',
        paddingTop: 15,
        marginTop: 100
    },
});