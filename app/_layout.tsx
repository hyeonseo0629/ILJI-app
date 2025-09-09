import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {AuthProvider} from '@/hooks/useAuth';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="add-schedule"
                        options={{headerShown: false}} // add-schedule 헤더 숨김
                    />
                    <Stack.Screen
                        name="add-ilog"
                        options={{headerShown: false}} // add-ilog 헤더 숨김
                    />
                    <Stack.Screen
                        name="+not-found"
                    />
                </Stack>
            </ThemeProvider>
        </AuthProvider>
    );
}
