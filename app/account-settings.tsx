import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function AccountSettingsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Change Password */}
      <TouchableOpacity style={styles.settingItem} onPress={() => console.log('비밀번호 변경 클릭')}>
        <Text style={[styles.settingText, { color: theme.colors.text }]}>비밀번호 변경</Text>
      </TouchableOpacity>

      {/* Delete Account */}
      <TouchableOpacity style={styles.settingItem} onPress={() => console.log('계정 탈퇴 클릭')}>
        <Text style={[styles.settingText, { color: theme.colors.text }]}>계정 탈퇴</Text>
      </TouchableOpacity>

      {/* 여기에 다른 계정 관련 설정 항목들을 추가할 수 있습니다. */}
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
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
});
