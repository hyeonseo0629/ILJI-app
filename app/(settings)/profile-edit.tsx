import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function ProfileEditScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>프로필 수정 화면입니다.</Text>
      {/* 여기에 프로필 수정 관련 항목들을 추가할 수 있습니다. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
