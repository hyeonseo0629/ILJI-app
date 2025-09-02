import { useSession } from './_layout'; // Import the useSession hook
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
    SignInResponse,
} from '@react-native-google-signin/google-signin';

const extra = Constants.expoConfig?.extra ?? {};

export default function LoginScreen(): React.JSX.Element {
    const { signIn } = useSession(); // Get the signIn function from the context
    const [busy, setBusy] = useState(false);

    const config = useMemo(
        () => ({
            webClientId: extra.GOOGLE_WEB_CLIENT_ID as string,
            ...(Platform.OS === 'ios'
                ? { iosClientId: extra.GOOGLE_IOS_CLIENT_ID as string }
                : {}),
            offlineAccess: false,
            forceCodeForRefreshToken: false,
        }),
        []
    );

    useEffect(() => {
        GoogleSignin.configure(config);
    }, [config]);

    const handleGoogleSignIn = async (): Promise<void> => {
        if (!extra.GOOGLE_WEB_CLIENT_ID || !extra.GOOGLE_IOS_CLIENT_ID) {
            Alert.alert(
                'Configuration Error',
                'Google Client ID is missing. Please ensure app.json is configured correctly and restart the server.'
            );
            return;
        }

        try {
            setBusy(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const res: SignInResponse = await GoogleSignin.signIn();

            if (res.type === 'success' && res.data.idToken) {
                const backendUrl = 'http://localhost:8090';
                const response = await fetch(`${backendUrl}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: res.data.idToken }),
                });

                if (response.ok) {
                    const authResponse = await response.json();
                    // Use the signIn function from the context to update the session.
                    // This will trigger the redirect in _layout.tsx automatically.
                    signIn(authResponse.appToken);
                } else {
                    const errorText = await response.text();
                    Alert.alert('Backend Auth Failed', `Server response error: ${errorText}`);
                }
            } else {
                 Alert.alert('Error', 'Could not get Google ID token.');
            }
        } catch (error: any) {
            if (error?.code === statusCodes.SIGN_IN_CANCELLED) return;
            if (error?.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Info', 'Sign-in is already in progress.');
                return;
            }
            if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services is required.');
                return;
            }
            Alert.alert('Login Failed', error?.message ?? 'An error occurred during Google Sign-In.');
        } finally {
            setBusy(false);
        }
    };

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
