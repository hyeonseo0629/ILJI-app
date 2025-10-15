import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColorValue = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  // useThemeColor가 객체를 반환하는 경우를 대비해, 문자열일 때만 backgroundColor로 사용
  const backgroundColor = typeof backgroundColorValue === 'string' ? backgroundColorValue : undefined;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
