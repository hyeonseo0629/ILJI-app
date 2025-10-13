import React, { useState } from 'react';
import { Switch, Alert, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
    MainSettingsContainer,
    SettingsItem,
    SettingsItemText,
    SettingsItemView,
    SignOutButtonContainer,
    SignOutButton,
    SignOutButtonText
} from '@/components/style/SettingStyled';

export default function SettingsScreen() {
    const { signOut } = useSession();
    const [busy, setBusy] = useState(false);
    const { colorScheme, isDarkColorScheme, toggleColorScheme } = useColorScheme();
    const theme = Colors[colorScheme];
    const router = useRouter();

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
        <MainSettingsContainer $colors={theme}>
            <View>
                {/* Account Settings */}
                <SettingsItem $colors={theme} onPress={() => router.push('/(settings)/account-settings')}>
                    <SettingsItemText $colors={theme}>계정</SettingsItemText>
                    <Ionicons name="chevron-forward" size={22} color={theme.text} />
                </SettingsItem>

                {/* Notification Settings */}
                <SettingsItem $colors={theme} onPress={() => router.push('/(settings)/notification-settings')}>
                    <SettingsItemText $colors={theme}>알림 설정</SettingsItemText>
                    <Ionicons name="chevron-forward" size={22} color={theme.text} />
                </SettingsItem>

                {/* Dark Mode Setting */}
                <SettingsItemView $colors={theme}>
                    <SettingsItemText $colors={theme}>다크 모드</SettingsItemText>
                    <Switch
                        value={isDarkColorScheme}
                        onValueChange={toggleColorScheme}
                        trackColor={{ false: theme.icon, true: theme.pointColors.blue }}
                        thumbColor={isDarkColorScheme ? theme.pointColors.yellow : theme.background}
                    />
                </SettingsItemView>
            </View>

            {/* Sign Out Button */}
            <SignOutButtonContainer>
                {busy ? (
                    <ActivityIndicator />
                ) : (
                    <SignOutButton onPress={handleSignOut}>
                        <SignOutButtonText $colors={theme}>Sign out</SignOutButtonText>
                    </SignOutButton>
                )}
            </SignOutButtonContainer>
        </MainSettingsContainer>
    );
}
