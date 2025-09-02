import { useSession } from '../_layout'; // Import the useSession hook
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import {
    GoogleSignin,
    User,
} from '@react-native-google-signin/google-signin';

export default function ProfileScreen(): React.JSX.Element {
    const { signOut } = useSession(); // Get the signOut function from the context
    const [userInfo, setUserInfo] = useState<User['user'] | null>(null);
    const [busy, setBusy] = useState(false);

    // Fetch user info for display purposes
    useEffect(() => {
        const currentUser = GoogleSignin.getCurrentUser();
        if (currentUser) {
            setUserInfo(currentUser.user);
        }
    }, []);

    const handleSignOut = async (): Promise<void> => {
        try {
            setBusy(true);
            // Use the signOut function from the context to handle everything.
            await signOut();
        } catch (error: any) {
            Alert.alert('Logout Failed', error?.message ?? 'An error occurred during sign-out.');
        } finally {
            setBusy(false);
        }
    };

    if (!userInfo) {
        // Show a loading indicator while fetching user info
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.profileBox}>
                {userInfo.photo ? (
                    <Image source={{ uri: userInfo.photo }} style={styles.avatar} />
                ) : null}
                <Text style={styles.profileText}>{userInfo.name ?? '(No Name)'}</Text>
                <Text style={styles.profileEmail}>{userInfo.email ?? '(No Email)'}</Text>

                <View style={{ height: 20 }} />

                {busy ? (
                    <ActivityIndicator />
                ) : (
                    <Button title="Sign out" color="#c1121f" onPress={handleSignOut} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, width: '100%' },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
    profileBox: { marginTop: 10, alignItems: 'center', width: '100%', maxWidth: 360 },
    avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
    profileText: { fontSize: 18, fontWeight: '700' },
    profileEmail: { fontSize: 14, color: '#555', marginTop: 2 },
});
