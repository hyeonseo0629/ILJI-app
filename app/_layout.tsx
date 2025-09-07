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

// Component that handles the navigation logic based on auth state
function Layout() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until the session is loaded
    }

    // When the session is ready, move to the right screen
    if (!session) {
      // User is not signed in, redirect to the login screen.
      router.replace('/login');
    } else {
      // User is signed in, redirect to the main app screen.
      router.replace('/(tabs)');
    }
  }, [session, isLoading]); // React to session changes

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

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
