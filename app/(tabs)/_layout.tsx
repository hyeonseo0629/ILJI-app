import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
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
                        height: 90,
                        paddingTop: 5,
                        paddingBottom: 8,
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
                // 파일 이름(diary.tsx)과 동일하게 설정합니다.
                name="diary"
                options={{
                    title: 'Diary',
                    // 아이콘은 'book.fill'을 사용합니다.
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="book.fill" color={color}/>,
                }}
            />
        </Tabs>
    );
}
