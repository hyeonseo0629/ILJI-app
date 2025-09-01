
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from '../src/screens/LoginScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Restoring token failed', e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (!loaded || isAuthLoading) {
    return null; // Show a loading screen here if you have one
  }

  // If the user is not authenticated, show the login screen.
  if (!isAuthenticated) {
    // Pass a function that the login screen can call on success.
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If the user is authenticated, show the main app.
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-schedule"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
