import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// 이 파일은 Expo Router를 사용하여 탭 레이아웃을 설정합니다.
// `_layout.tsx`라는 파일 이름은 이 디렉토리(tabs)에 대한 레이아웃을 정의한다는 규칙입니다.
export default function TabLayout() {
    // `useColorScheme` 훅을 사용하여 현재 기기의 색상 스킴(light 또는 dark)을 가져옵니다.
    const colorScheme = useColorScheme();

    return (
        // `Tabs` 컴포넌트는 탭 네비게이션의 컨테이너 역할을 합니다.
        <Tabs
            // `screenOptions`는 모든 탭 화면에 공통적으로 적용될 옵션을 설정합니다.
            screenOptions={{
                // `tabBarActiveTintColor`는 활성화된 탭의 아이콘과 텍스트 색상을 설정합니다.
                // `Colors` 객체에서 현재 색상 스킴에 맞는 tint 색상을 가져옵니다.
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // `headerShown: false`는 각 탭 화면의 기본 헤더를 숨깁니다.
                // (헤더는 각 화면에서 개별적으로 `Header` 컴포넌트를 사용하여 렌더링하고 있습니다.)
                headerShown: false,
                // `tabBarButton`에 커스텀 컴포넌트(`HapticTab`)를 제공하여
                // 탭을 누를 때 햅틱(진동) 피드백을 추가합니다.
                tabBarButton: HapticTab,
                // `tabBarBackground`에 커스텀 컴포넌트(`TabBarBackground`)를 제공하여
                // 탭 바의 배경에 블러 효과나 다른 시각적 효과를 줍니다.
                tabBarBackground: TabBarBackground,
                // `tabBarStyle`은 탭 바 자체의 스타일을 지정합니다.
                // `Platform.select`를 사용하여 iOS와 다른 플랫폼(예: Android)에 대해 다른 스타일을 적용합니다.
                tabBarStyle: Platform.select({
                    ios: {
                        // iOS에서는 블러 효과를 보여주기 위해 배경을 투명하게 만듭니다.
                        // `position: 'absolute'`는 탭 바가 콘텐츠 위에 떠 있도록 합니다.
                        position: 'absolute',
                        height: 85, // 탭 바의 높이
                        paddingBottom: 25, // 하단 여백
                    },
                    default: {
                        // 다른 플랫폼에서의 스타일
                        height: 90, // 탭 바의 높이
                        paddingTop: 5, // 상단 여백
                        paddingBottom: 8, // 하단 여백
                    },
                }),
            }}>
            {/* `Tabs.Screen`은 개별 탭을 정의합니다. */}
            <Tabs.Screen
                // `name`은 이 탭과 연결될 파일의 이름입니다. (index.tsx)
                name="index"
                options={{
                    // `title`은 탭 바에 표시될 텍스트입니다.
                    title: 'Home',
                    // `tabBarIcon`은 탭의 아이콘을 렌더링하는 함수입니다.
                    // `color` prop은 활성/비활성 상태에 따라 `tabBarActiveTintColor` 또는 기본 색상을 받습니다.
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="calendar" color={color}/>,
                }}
            />
            <Tabs.Screen
                // 이 탭은 `ILog.tsx` 파일과 연결됩니다.
                name="ILog"
                options={{
                    title: 'I-Log',
                    // `newspaper.fill` 아이콘을 사용합니다.
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="newspaper.fill" color={color}/>,
                }}
            />
        </Tabs>
    );
}
