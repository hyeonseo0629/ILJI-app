import {Tabs} from 'expo-router';
import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {StatusBar} from "expo-status-bar";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as NavigationBar from 'expo-navigation-bar';


export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isnets = useSafeAreaInsets();

    useEffect(() => {
        // 안드로이드 플랫폼에서만 실행합니다.
        if (Platform.OS === 'android') {
            // 사용자가 화면 하단을 스와이프하면 네비게이션 바가 나타나도록 설정합니다.
            NavigationBar.setBehaviorAsync('inset-swipe');
            // 네비게이션 바를 숨깁니다.
            NavigationBar.setVisibilityAsync('hidden');
        }
    }, []); // 빈 배열은 이 코드가 앱 시작 시 한 번만 실행되도록 보장합니다.

    return (
        <View style={{flex: 1}}>
            <View style={{flex: 1, paddingTop: isnets.top, backgroundColor: 'lavender'}}>
                <StatusBar style="dark"/>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                        headerShown: false,
                        tabBarButton: HapticTab,
                        tabBarBackground: TabBarBackground,
                        tabBarStyle: Platform.select({
                            ios: {
                                // Use a transparent background on iOS to show the blur effect
                                position: 'absolute',
                                height: 85,
                                paddingBottom: 25,
                            },
                            default: {
                                height: 65,
                                paddingTop: 5,
                                paddingBottom: 8,
                                backgroundColor: 'lavender',
                                borderTopWidth: 0,
                            },
                        }),
                    }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Home',
                            tabBarIcon: ({color}) => <IconSymbol size={28} name="calendar" color={color}/>,
                        }}
                    />
                    <Tabs.Screen
                        // 파일 이름(i-log.tsx)과 동일하게 설정합니다.
                        name="i-log"
                        options={{
                            title: 'I-Log',
                            // 아이콘은 'book.fill'을 사용합니다.
                            tabBarIcon: ({color}) => <IconSymbol size={28} name="book.fill" color={color}/>,
                        }}
                    />
                    <Tabs.Screen
                        name="login" // 새 탭 이름
                        options={{
                            title: "Login",
                            tabBarIcon: ({color}) => (
                                <IconSymbol
                                    size={28}
                                    name="person.fill"
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Tabs>
            </View>
        </View>

    );
}
