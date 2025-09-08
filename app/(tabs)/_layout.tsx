import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native'; // Added Text import
import { useTheme } from '@react-navigation/native'; // useTheme 훅 임포트

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground'; // Removed import
// Colors 상수는 더 이상 직접 사용하지 않으므로, 필요에 따라 제거할 수 있습니다.
// import { Colors } from '@/constants/Colors'; 
// useColorScheme은 tabBarActiveTintColor를 위해 여전히 필요할 수 있습니다.
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const theme = useTheme(); // useTheme 훅 사용
    const { colorScheme } = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                // theme.colors.primary를 사용하여 활성 탭 색상 설정
                tabBarActiveTintColor: theme.colors.primary, 
                headerShown: false,
                // tabBarButton: HapticTab, // Commented out this line
                // tabBarBackground: TabBarBackground, // Removed this line
                tabBarStyle: {
                    position: 'absolute',
                    borderTopColor: theme.colors.border, // 테마에 맞는 테두리 색상
                    // 플랫폼별 스타일 분리
                    ...(Platform.OS === 'ios' 
                        ? {
                            height: 85,
                            paddingBottom: 25,
                          }
                        : {
                            height: 65,
                            paddingTop: 5,
                            paddingBottom: 8,
                            // backgroundColor가 TabBarBackground에 의해 제어되므로 제거
                          }),
                },
            }}>
            {/* ... Tabs.Screen 컴포넌트들 ... */}
            <Tabs.Screen
                name="index"
                options={{
                    title: '', // Explicitly set title to empty string
                    tabBarIcon: ({color}) => <Text style={{ color }}>🏠</Text>, // Replaced IconSymbol with Text
                }}
            />
            {/* <Tabs.Screen
                name="ILog"
                options={{
                    // title: 'I-Log',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="newspaper.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    // title: 'Profile',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="person.fill" color={color}/>,
                }}
            /> */}
        </Tabs>
    );
}
