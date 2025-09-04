import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useSession } from './_layout';

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useSession();
    const [busy, setBusy] = useState(false);

    const handleSignOut = async () => {
        setBusy(true);
        try {
            await signOut();
            // Sign-out is handled by the root layout, which will redirect to the login screen.
        } catch (e: any) {
            Alert.alert('Sign Out Error', e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>
            <View style={styles.content}>
                {/* Your other settings content can go here */}
                <View style={styles.signOutButtonContainer}>
                    {busy ? (
                        <ActivityIndicator />
                    ) : (
                        <Button title="Sign out" color="#c1121f" onPress={handleSignOut} />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns children to the bottom
        alignItems: 'center',
        paddingBottom: 40, // Add some padding at the bottom
    },
    signOutButtonContainer: {
        width: '80%',
    },
});
