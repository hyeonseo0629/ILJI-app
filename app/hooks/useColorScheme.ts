import { useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const COLOR_SCHEME_KEY = 'user_color_scheme';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme(); // 시스템 색상 스키마
  const [storedColorScheme, setStoredColorScheme] = useState<'light' | 'dark' | null>(null); // SecureStore에 저장된 사용자 선호 스키마
  const [isColorSchemeLoading, setIsColorSchemeLoading] = useState(true);

  console.log('useColorScheme: Rendered. systemColorScheme:', systemColorScheme, 'storedColorScheme:', storedColorScheme);

  // 앱 시작 시 SecureStore에서 사용자 선호 스키마를 한 번만 로드
  useEffect(() => {
    const loadColorScheme = async () => {
      console.log('useColorScheme useEffect: Loading color scheme from SecureStore...');
      try {
        const stored = await SecureStore.getItemAsync(COLOR_SCHEME_KEY);
        if (stored === 'light' || stored === 'dark') {
          setStoredColorScheme(stored);
          console.log('useColorScheme useEffect: Loaded stored scheme:', stored);
        } else {
          console.log('useColorScheme useEffect: No stored scheme found.');
        }
      } catch (e) {
        console.error("useColorScheme useEffect: Failed to load color scheme from SecureStore", e);
      } finally {
        setIsColorSchemeLoading(false);
        console.log('useColorScheme useEffect: Loading finished. isColorSchemeLoading:', false);
      }
    };
    loadColorScheme();
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // systemColorScheme이 변경될 때마다 로그
  useEffect(() => {
    console.log('useColorScheme useEffect: systemColorScheme changed to', systemColorScheme);
  }, [systemColorScheme]);

  // 실제 앱에 적용될 색상 스키마 결정
  // 1. storedColorScheme (사용자 선호)가 있다면 그것을 사용
  // 2. 없다면 systemColorScheme (시스템 설정)을 사용
  // 3. systemColorScheme도 null이면 'light'를 기본값으로 사용
  const effectiveColorScheme = storedColorScheme
    ? storedColorScheme
    : (systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : 'light');

  console.log('useColorScheme: Effective color scheme:', effectiveColorScheme);

  const isDarkColorScheme = effectiveColorScheme === 'dark';

  const toggleColorScheme = async () => {
    const newScheme = isDarkColorScheme ? 'light' : 'dark';
    console.log('toggleColorScheme: Toggling to', newScheme);
    setStoredColorScheme(newScheme); // 상태를 즉시 업데이트하여 UI 즉시 반응
    try {
      await SecureStore.setItemAsync(COLOR_SCHEME_KEY, newScheme); // SecureStore에 저장하여 영구 유지
      console.log('toggleColorScheme: Saved to SecureStore:', newScheme);
    } catch (e) {
      console.error("toggleColorScheme: Failed to save color scheme to SecureStore", e);
    }
  };

  return {
    isDarkColorScheme,
    toggleColorScheme,
    colorScheme: effectiveColorScheme,
    isColorSchemeLoading,
  };
}
