import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useSession } from '@/hooks/useAuth';

// This component handles the navigation logic based on auth state
function Layout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme(); // useColorScheme 훅을 여기서도 사용

  useEffect(() => {
    if (isLoading) {
      return; // Wait until the session is loaded
    }

    const inAuthGroup = segments[0] === 'login';

    if (!session && !inAuthGroup) {
      // User is not signed in and not in login screen, redirect to login
      router.replace('/login');
    } else if (session && inAuthGroup) {
      // User is signed in but in login screen, redirect to home
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
      // isDarkColorScheme 값에 따라 key를 변경하여 Stack 강제 재렌더링
      <Stack key={isDarkColorScheme ? 'dark-theme' : 'light-theme'}>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="add-schedule" options={{ title: 'New Schedule', presentation: 'modal' }} />
        <Stack.Screen 
          name="(settings)" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}

export default function RootLayout() {
  const { isDarkColorScheme, isColorSchemeLoading } = useColorScheme(); // isColorSchemeLoading 추가
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded || isColorSchemeLoading) { // 로딩 조건 추가
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Layout />
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
