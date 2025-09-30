import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import {
    NotificationContainer,
    NotificationText
} from '@/components/style/SettingStyled';

export default function NotificationSettingsScreen() {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <NotificationContainer $colors={theme}>
      <NotificationText $colors={theme}>알림 설정 화면입니다.</NotificationText>
      {/* 여기에 알림 설정 관련 항목들을 추가할 수 있습니다. */}
    </NotificationContainer>
  );
}