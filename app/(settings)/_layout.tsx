import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

// A custom back button that uses the router to go back
const CustomBackButton = () => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 15 }}>
      <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default function SettingsStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="settings-main"
        options={{
          title: 'Settings',
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="account-settings"
        options={{
          title: 'Account Settings',
        }}
      />
      <Stack.Screen
        name="profile-edit"
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="notification-settings"
        options={{
          title: 'Notification Settings',
        }}
      />
    </Stack>
  );
}
