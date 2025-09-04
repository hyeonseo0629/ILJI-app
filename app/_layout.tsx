import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ilji_session';

// Define the shape of the user session
export type SessionUser = {
  user: { name: string; email: string; photo?: string };
  token: string;
};

// Define the shape of the authentication context
interface AuthContextType {
  signIn: (user: SessionUser) => Promise<void>;
  signOut: () => Promise<void>;
  session?: SessionUser | null;
  isLoading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to access the authentication session
export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return value;
}

// Provider component that manages authentication state
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedSession) {
          setSession(JSON.parse(storedSession));
        }
      } catch (e) {
        console.error("Failed to load session from secure store", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (user: SessionUser) => {
    setSession(user);
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(user));
  };

  const signOut = async () => {
    setSession(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Component that handles the navigation logic based on auth state
function Layout() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait until the session is loaded

    const inLoginPage = segments[0] === 'login';

    if (!session && !inLoginPage) {
      // User is not signed in and not on the login page, redirect to login.
      router.replace('/login');
    } else if (session && inLoginPage) {
      // User is signed in and on the login page, redirect to the main app.
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments]);

  // The initial route is determined by the logic above.
  // We can just render the stack navigator here.
  return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-schedule" options={{ title: 'New Schedule', presentation: 'modal' }} />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings', 
            presentation: 'modal', 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="profile-edit" 
          options={{ 
            title: 'Edit Profile', 
            presentation: 'modal' 
          }} 
        />
        <Stack.Screen 
          name="notification-settings" 
          options={{ 
            title: 'Notification Settings', 
            presentation: 'modal' 
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
