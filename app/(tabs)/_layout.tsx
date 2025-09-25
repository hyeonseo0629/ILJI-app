import {Tabs} from 'expo-router';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import {Platform} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground'; // TabBarBackground import 제거
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function TabLayout() {
    const theme = useTheme(); // useTheme 훅 사용

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <StatusBar style="dark"/>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: theme.colors.primary,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    // tabBarBackground: TabBarBackground, // TabBarBackground prop 제거
                    tabBarStyle: Platform.select({
                        ios: {
                            position: 'absolute',
                            height: 85,
                            paddingBottom: 25,
                            backgroundColor: theme.colors.card, // iOS에도 배경색 다시 활성화
                            borderTopWidth: 0,
                        },
                        default: {
                            height: 65,
                            paddingTop: 5,
                            paddingBottom: 8,
                            backgroundColor: theme.colors.card, // 여기도 테마 배경색 다시 활성화
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
                    name="profile" // 새 탭 이름
                    options={{
                        title: "My I-Log",
                        tabBarIcon: ({color}) => (
                            <FontAwesome5
                                name="book-reader"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </GestureHandlerRootView>
    );
}
