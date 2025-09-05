import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // Corresponds to app/(settings)/index.tsx (the main settings screen)
        options={{
          title: 'Settings',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="account-settings" // Corresponds to app/(settings)/account-settings.tsx
        options={{
          title: 'Account Settings',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="profile-edit" // Corresponds to app/(settings)/profile-edit.tsx
        options={{
          title: 'Edit Profile',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="notification-settings" // Corresponds to app/(settings)/notification-settings.tsx
        options={{
          title: 'Notification Settings',
          headerBackTitle: '',
          presentation: 'modal', // Keep modal presentation if desired
        }}
      />
    </Stack>
  );
}
