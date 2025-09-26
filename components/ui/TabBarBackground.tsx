import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function TabBarBackground() {
  const theme = useTheme();

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]} />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
