import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import {AuthProvider} from '@/hooks/useAuth';
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function RootLayout() {

    const isnets = useSafeAreaInsets();

    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <View style={{flex: 1, paddingBottom: isnets.bottom, backgroundColor: 'lavender'}}>
                <View style={{flex: 1, paddingTop: isnets.top, backgroundColor: 'lavender'}}>
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
                    </ThemeProvider>
                </View>
            </View>
        </AuthProvider>
    );
}
