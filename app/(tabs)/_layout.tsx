import {Tabs} from 'expo-router';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import {Platform} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { StatusBar } from "expo-status-bar";
import { StyledGestureHandlerRootView } from '@/components/style/MainStyled';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];
    usePushNotifications();
  
    return (
        <StyledGestureHandlerRootView>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: theme.tabIconSelected,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: Platform.select({
                        ios: {
                            position: 'absolute',
                            height: 85,
                            paddingBottom: 25,
                            backgroundColor: theme.background,
                            borderTopWidth: 0,
                            borderTopColor: 'transparent'
                        },
                        default: {
                            height: 65,
                            paddingTop: 5,
                            paddingBottom: 8,
                            backgroundColor: theme.background,
                            borderTopWidth: 0,
                            borderTopColor: 'transparent',
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
        </StyledGestureHandlerRootView>
    );
}