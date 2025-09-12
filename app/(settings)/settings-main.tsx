import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@react-navigation/native';
import { useSession } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { signOut } = useSession();
  const [busy, setBusy] = useState(false);
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const theme = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View>
        {/* Account Settings */}
        <TouchableOpacity onPress={() => router.push('/account-settings')}>
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.settingText, { color: theme.colors.text }]}>계정</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        {/* Notification Settings */}
        <TouchableOpacity onPress={() => router.push('/notification-settings')}>
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.settingText, { color: theme.colors.text }]}>알림 설정</Text>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        {/* Dark Mode Setting */}
        <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.settingText, { color: theme.colors.text }]}>다크 모드</Text>
          <Switch
            value={isDarkColorScheme}
            onValueChange={toggleColorScheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkColorScheme ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutButtonContainer}>
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 18,
  },
  signOutButtonContainer: {
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
  },
});
