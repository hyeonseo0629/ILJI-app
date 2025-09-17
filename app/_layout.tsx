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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ScheduleProvider} from "@/src/context/ScheduleContext";
import {ILogProvider} from "@/src/context/ILogContext";


// Layout 컴포넌트는 그대로 유지됩니다.
function Layout() {

    const isnets = useSafeAreaInsets();

    const {session, isLoading} = useSession();
    const segments = useSegments();
    const router = useRouter();
    const {isDarkColorScheme} = useColorScheme();
    const theme = useTheme(); // theme 가져오기
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator/>
            </View>
        );
    }

    return (
        <View style={{flex: 1, paddingBottom: isnets.bottom, backgroundColor: 'lavender'}}>
            <View style={{flex: 1, paddingTop: isnets.top, backgroundColor: 'lavender'}}>
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
                            <Stack.Screen
                                name="login"
                                options={{headerShown: false}}
                            />
                            <Stack.Screen
                                name="(settings)"
                                options={{headerShown: false}}
                            />

                            <Stack.Screen
                                name="(tabs)"
                                options={{
                                    headerShown: false,
                                    title: ''
                                }}
                            />
                            <Stack.Screen
                                name="add-schedule"
                                options={{
                                    title: 'New Schedule',
                                    presentation: 'modal',
                                    headerStyle: {
                                        backgroundColor: theme.colors.card,
                                    },
                                    headerTintColor: theme.colors.text,
                                    headerShown: false
                                }}
                            />
                            <Stack.Screen
                                name="add-ilog"
                                options={{headerShown: false}} // add-ilog 헤더 숨김
                            />
                            <Stack.Screen
                                name="i-log/[id]"
                                options={{headerShown: false}} // i-log/[id] 헤더 숨김
                            />
                            <Stack.Screen
                                name="update-ilog"
                                options={{headerShown: false}} // update-ilog 헤더 숨김
                            />
                            <Stack.Screen
                                name="+not-found"
                            />
                        </Stack>
            </View>
        </View>
    );
}

// ColorSchemeProvider 내부에서 테마를 사용하는 새로운 핵심 컴포넌트입니다.
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
          <ILogProvider>
            <Layout />
          </ILogProvider>
        </ScheduleProvider>
      </AuthProvider>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

// 최상위 RootLayout은 Provider를 제공하는 역할만 합니다.
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
