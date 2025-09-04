import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router'; // Added usePathname
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
      console.log("AuthProvider: Attempting to load session...");
      try {
        const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          setSession(parsedSession);
          console.log("AuthProvider: Session loaded successfully:", parsedSession);
        } else {
          console.log("AuthProvider: No session found in SecureStore.");
        }
      } catch (e) {
        console.error("AuthProvider: Failed to load session from secure store", e);
      } finally {
        setIsLoading(false);
        console.log("AuthProvider: isLoading set to false.");
      }
    };

    loadSession();
  }, []);

  const signIn = async (user: SessionUser) => {
    console.log("AuthProvider: Signing in user:", user);
    setSession(user);
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(user));
      console.log("AuthProvider: Session saved to SecureStore.");
    } catch (e) {
      console.error("AuthProvider: Failed to save session to SecureStore", e);
    }
  };

  const signOut = async () => {
    console.log("AuthProvider: Signing out user.");
    setSession(null);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      console.log("AuthProvider: Session deleted from SecureStore.");
    } catch (e) {
      console.error("AuthProvider: Failed to delete session from SecureStore", e);
    }
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
  const pathname = usePathname(); // Get pathname using usePathname()

  useEffect(() => {
    console.log("Layout useEffect: session=", session, "isLoading=", isLoading, "segments=", segments, "pathname=", pathname);
    if (isLoading) {
      console.log("Layout useEffect: Still loading, returning.");
      return; // Wait until the session is loaded
    }

    const inAuthGroup = segments[0] === 'login'; // Check if the current segment is 'login'
    const inAppGroup = segments[0] === '(tabs)'; // Check if the current segment is '(tabs)'
    const inSettingsOrProfile = segments[0] === 'settings' || segments[0] === 'profile-edit'; // Check for settings or profile

    if (!session) {
      // User is not signed in
      if (!inAuthGroup) {
        // If not on the login page, redirect to login
        console.log("Layout useEffect: Not signed in and not on login page, redirecting to /login");
        router.replace('/login');
      }
    } else {
      // User is signed in
      if (inAuthGroup) {
        // If on the login page, redirect to app group
        console.log("Layout useEffect: Signed in and on login page, redirecting to /(tabs)");
        router.replace('/(tabs)');
      } else if (!inAppGroup && !inSettingsOrProfile) {
        // If signed in but not in app group, settings, or profile, redirect to app group
        console.log("Layout useEffect: Signed in, but not in app group, settings, or profile, redirecting to /(tabs)");
        router.replace('/(tabs)');
      }
    }
  }, [session, isLoading, segments, pathname]); // Depend on segments and pathname

  // The initial route is determined by the logic above.
  // We can just render the stack navigator here.
  return (
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="add-schedule" options={{ title: 'New Schedule', presentation: 'modal' }} />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerBackTitle: '', // Added this line
          }}
        />
        <Stack.Screen
          name="profile-edit"
          options={{
            title: 'Edit Profile',
            headerBackTitle: '', // Added this line
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
