import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useSession } from '@/hooks/useAuth'; // useAuth.ts에서 AuthProvider와 useSession 임포트

// Component that handles the navigation logic based on auth state
function Layout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname(); // Get pathname using usePathname()

  useEffect(() => {
    if (isLoading) {
      return; // Wait until the session is loaded
    }

    const inAuthGroup = segments[0] === 'login';
    const inAppGroup = segments[0] === '(tabs)';
    const inSettingsGroup = segments[0] === 'settings' || segments[0] === 'profile-edit' || segments[0] === 'account-settings' || segments[0] === 'notification-settings';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/login');
      }
    } else {
      if (inAuthGroup) {
        router.replace('/(tabs)');
      } else if (!inAppGroup && !inSettingsGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, isLoading, segments, pathname]);

  return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="add-schedule" options={{ title: 'New Schedule', presentation: 'modal' }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DarkTheme : DefaultTheme}>
      <AuthProvider> {/* AuthProvider를 useAuth.ts에서 가져옴 */}
        <Layout />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
