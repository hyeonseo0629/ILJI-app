import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useFonts} from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import 'react-native-reanimated';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ThemeProvider, Theme, useTheme} from '@react-navigation/native';
import ColorSchemeProvider, {useColorScheme} from '@/hooks/useColorScheme';
import {StatusBar} from 'expo-status-bar';
import {AuthProvider, useSession} from '@/hooks/useAuth';
import {Colors} from '@/constants/Colors';
import {ScheduleProvider} from '@/src/context/ScheduleContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import api from '@/src/lib/api'; // Import the centralized API instance

function Layout() {
    const {session, isLoading} = useSession();
    const segments = useSegments();
    const router = useRouter();
    const {isDarkColorScheme} = useColorScheme();
    const theme = useTheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        const isAppLoading = isLoading || !loaded;
        if (isAppLoading) {
            return;
        }

        const inAuthGroup = segments[0] === 'login';
        const inSetupScreen = segments[0] === 'initial-profile-setup';

        // 1. No session logic
        if (!session) {
            if (!inAuthGroup) {
                router.replace('/login');
            }
            return;
        }

        // 2. Session exists logic
        const checkProfileAndRedirect = async () => {
            let hasNickname = false;
            try {
                // Use the centralized API instance which handles auth headers automatically
                const response = await api.get('/user/profile');

                if (response.status === 200 && response.data && response.data.nickname) {
                    hasNickname = true;
                }
            } catch (error) {
                // Errors (like 401) are expected if the token is invalid or expired.
                // The user will be redirected to /login by the session check anyway.
                console.log("Could not fetch profile, will redirect to login if session is invalid.");
            }

            // --- Final redirection rules ---
            if (hasNickname) {
                if (inAuthGroup || inSetupScreen) {
                    router.replace('/(tabs)');
                }
            } else {
                if (!inSetupScreen) {
                    router.replace('/initial-profile-setup');
                }
            }
        };

        checkProfileAndRedirect();

    }, [session, isLoading, segments, loaded]);

    if (isLoading || !loaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator/>
            </View>
        );
    }

    return (
        <Stack
            key={isDarkColorScheme ? 'dark-theme' : 'light-theme'}
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.card,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="login" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{headerShown: false, title: ''}}/>
            <Stack.Screen name="initial-profile-setup" options={{headerShown: false}} />
            <Stack.Screen
                name="add-schedule"
                options={{
                    title: 'New Schedule',
                    presentation: 'modal',
                    headerStyle: {
                        backgroundColor: theme.colors.card,
                    },
                    headerTintColor: theme.colors.text,
                }}
            />
            <Stack.Screen name="(settings)" options={{headerShown: false}}/>
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }}/>
        </Stack>
    );
}

function ThemedAppLayout() {
    const {isDarkColorScheme, isColorSchemeLoading} = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded || isColorSchemeLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator/>
            </View>
        );
    }

    const customDefaultTheme: Theme = {
        dark: false,
        colors: {
            primary: Colors.light.tint,
            background: Colors.light.background,
            card: Colors.light.card,
            text: Colors.light.text,
            border: Colors.light.border,
            notification: Colors.light.notification,
        },
        fonts: {
            regular: {fontFamily: '', fontWeight: 'normal'},
            medium: {fontFamily: '', fontWeight: 'normal'},
            bold: {fontFamily: '', fontWeight: 'bold'},
            heavy: {fontFamily: '', fontWeight: '900'},
        },
    };

    const customDarkTheme: Theme = {
        dark: true,
        colors: {
            primary: Colors.dark.tint,
            background: Colors.dark.background,
            card: Colors.dark.card,
            text: Colors.dark.text,
            border: Colors.dark.border,
            notification: Colors.dark.notification,
        },
        fonts: {
            regular: {fontFamily: '', fontWeight: 'normal'},
            medium: {fontFamily: '', fontWeight: 'normal'},
            bold: {fontFamily: '', fontWeight: 'bold'},
            heavy: {fontFamily: '', fontWeight: '900'},
        },
    };

    const currentTheme: Theme = isDarkColorScheme ? customDarkTheme : customDefaultTheme;

  return (
    <ThemeProvider value={currentTheme}>
      <AuthProvider>
        <ScheduleProvider>
          <Layout />
        </ScheduleProvider>
      </AuthProvider>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ColorSchemeProvider>
          <ThemedAppLayout />
        </ColorSchemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
