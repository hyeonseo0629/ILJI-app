import { useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const COLOR_SCHEME_KEY = 'user_color_scheme';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const [userColorScheme, setUserColorScheme] = useState<'light' | 'dark' | null>(null);
  const [isColorSchemeLoading, setIsColorSchemeLoading] = useState(true);

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const storedScheme = await SecureStore.getItemAsync(COLOR_SCHEME_KEY);
        if (storedScheme === 'light' || storedScheme === 'dark') {
          setUserColorScheme(storedScheme);
          console.log('Loaded color scheme from SecureStore:', storedScheme); // 추가
        } else {
          const initialScheme = systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : 'light';
          setUserColorScheme(initialScheme);
          console.log('No stored scheme, using system/default:', initialScheme); // 추가
        }
      } catch (e) {
        console.error("Failed to load color scheme from SecureStore", e);
        setUserColorScheme(systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : 'light');
      } finally {
        setIsColorSchemeLoading(false);
      }
    };
    loadColorScheme();
  }, [systemColorScheme]);

  const isDarkColorScheme = userColorScheme === 'dark';

  const toggleColorScheme = async () => {
    const newScheme = isDarkColorScheme ? 'light' : 'dark';
    setUserColorScheme(newScheme);
    console.log('Toggling color scheme to:', newScheme); // 추가
    try {
      await SecureStore.setItemAsync(COLOR_SCHEME_KEY, newScheme);
      console.log('Saved color scheme to SecureStore:', newScheme); // 추가
    } catch (e) {
      console.error("Failed to save color scheme to SecureStore", e);
    }
  };

  return {
    isDarkColorScheme,
    toggleColorScheme,
    colorScheme: userColorScheme,
    isColorSchemeLoading,
  };
}
