import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AuthContext = createContext<{
  session: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({ 
  session: null, 
  isLoading: true, 
  signIn: async () => {},
  signOut: async () => {},
});

export function useSession() {
  return useContext(AuthContext);
}

function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        setSession(token);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('jwtToken', token);
    setSession(token);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await GoogleSignin.signOut().catch(console.error);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signOut,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

function RootLayoutNav() {
    const { session, isLoading } = useSession();
    const segments = useSegments();
    const router = useRouter();
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (isLoading) return;

        // Check if the user is in the login screen or not.
        const inLoginPage = segments[0] === 'login';

        // If the user is not signed in and not on the login page, redirect to login.
        if (!session && !inLoginPage) {
            router.replace('/login');
        }
        // If the user is signed in and on the login page, redirect to the main app.
        else if (session && inLoginPage) {
            router.replace('/(tabs)');
        }
    }, [session, isLoading, segments]);

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded || isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                {/* The initial route is now determined by the useEffect logic */}
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="add-schedule" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}
