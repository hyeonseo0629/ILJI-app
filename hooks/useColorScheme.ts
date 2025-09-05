import { useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const COLOR_SCHEME_KEY = 'user_color_scheme';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme(); // 'light' | 'dark' | undefined
  const [userColorScheme, setUserColorScheme] = useState<'light' | 'dark' | null>(null);

  // Load user preference on mount
  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const storedScheme = await SecureStore.getItemAsync(COLOR_SCHEME_KEY);
        if (storedScheme === 'light' || storedScheme === 'dark') {
          setUserColorScheme(storedScheme);
        } else {
          // If no user preference, use system preference, converting undefined to null
          setUserColorScheme(systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : null);
        }
      } catch (e) {
        console.error("Failed to load color scheme from SecureStore", e);
        setUserColorScheme(systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : null); // Fallback to system
      }
    };
    loadColorScheme();
  }, [systemColorScheme]);

  const isDarkColorScheme = userColorScheme === 'dark';

  const toggleColorScheme = async () => {
    const newScheme = isDarkColorScheme ? 'light' : 'dark';
    setUserColorScheme(newScheme);
    try {
      await SecureStore.setItemAsync(COLOR_SCHEME_KEY, newScheme);
    } catch (e) {
      console.error("Failed to save color scheme to SecureStore", e);
    }
  };

  return {
    isDarkColorScheme,
    toggleColorScheme,
    // Expose the actual userColorScheme state if needed for other purposes
    colorScheme: userColorScheme,
  };
}
