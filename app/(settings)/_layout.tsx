import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { BackButton } from '@/components/style/SettingStyled';

// A custom back button that uses the router to go back
const CustomBackButton = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <BackButton onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color={theme.text} />
    </BackButton>
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
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="profile-edit"
        options={{
          title: 'Edit Profile',
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="notification-settings"
        options={{
          title: 'Notification Settings',
          headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack>
  );
}