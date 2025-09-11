import {Tabs} from 'expo-router';
import React from 'react';
import {Platform, View} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
                    <StatusBar style="dark"/>
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
        </GestureHandlerRootView>
    );
}
