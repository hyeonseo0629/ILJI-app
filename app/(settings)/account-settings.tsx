import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import {
    SettingsContainer,
    SettingsItem,
    SettingsItemText
} from '@/components/style/SettingStyled';

export default function AccountSettingsScreen() {
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];

    return (
        <SettingsContainer $colors={theme}>
            {/* Delete Account */}
            <SettingsItem $colors={theme} onPress={() => console.log('계정 탈퇴 클릭')}>
                <SettingsItemText $colors={theme}>계정 탈퇴</SettingsItemText>
            </SettingsItem>
        </SettingsContainer>
    );
}