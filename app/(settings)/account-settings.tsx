import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function AccountSettingsScreen() {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Delete Account */}
            <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => console.log('계정 탈퇴 클릭')}>
                <Text style={[styles.settingText, { color: theme.colors.text }]}>계정 탈퇴</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    settingText: {
        fontSize: 18,
    },
});
