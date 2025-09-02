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
                name="ILog"
                options={{
                    title: 'I-Log',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="newspaper.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="person.fill" color={color}/>,
                }}
            />
        </Tabs>
    );
}
