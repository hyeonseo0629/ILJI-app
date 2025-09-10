import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, ColorSchemeProvider } from '@/hooks/_useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useSession } from '@/hooks/useAuth';

// Layout 컴포넌트는 그대로 유지됩니다.
function Layout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme(); // 이제 Context로부터 올바른 값을 받아옵니다.

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'login';
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
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
    <Stack key={isDarkColorScheme ? 'dark-theme' : 'light-theme'}>
      <Stack.Screen name="login" options={{ headerShown: false }}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
      <Stack.Screen name="add-schedule" options={{ title: 'New Schedule', presentation: 'modal' }} />
      <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// ColorSchemeProvider 내부에서 테마를 사용하는 새로운 핵심 컴포넌트입니다.
function ThemedAppLayout() {
  const { isDarkColorScheme, isColorSchemeLoading } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded || isColorSchemeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

// 최상위 RootLayout은 Provider를 제공하는 역할만 합니다.
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorSchemeProvider>
        <ThemedAppLayout />
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}
