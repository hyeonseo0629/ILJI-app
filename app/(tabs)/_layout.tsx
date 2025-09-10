import {Tabs} from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {StatusBar} from "expo-status-bar";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function TabLayout() {
    const theme = useTheme(); // useTheme 훅 사용
    const insets = useSafeAreaInsets();

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View style={{flex: 1, paddingBottom: Platform.OS === 'android' ? insets.bottom : 0, backgroundColor: theme.colors.background}}>
                <View style={{flex: 1, paddingTop: insets.top, backgroundColor: theme.colors.background}}>
                    <StatusBar style={theme.dark ? "light" : "dark"}/>
                    <Tabs
                        screenOptions={{
                            tabBarActiveTintColor: theme.colors.primary,
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
                                    backgroundColor: theme.colors.card, // 여기도 테마 배경색을 사용하도록 변경합니다.
                                    borderTopWidth: 0,
                                },
                            }),
                        }}>
                        <Tabs.Screen
                            name="index"
                            options={{
                                title: 'Calendar',
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
                            name="profile" // 새 탭 이름
                            options={{
                                title: "profile",
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
        </GestureHandlerRootView>
    );
}
// Added a comment to force re-evaluation.
