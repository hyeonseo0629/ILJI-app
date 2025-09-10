import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const COLOR_SCHEME_KEY = 'user_color_scheme';

interface ColorSchemeContextType {
  isDarkColorScheme: boolean;
  toggleColorScheme: () => void;
  colorScheme: 'light' | 'dark';
  isColorSchemeLoading: boolean;
}

// Create a context with a default value.
const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

// Create the provider component.
export function ColorSchemeProvider({ children }: PropsWithChildren<{}>) {
  const systemColorScheme = useSystemColorScheme();
  const [storedColorScheme, setStoredColorScheme] = useState<'light' | 'dark' | null>(null);
  const [isColorSchemeLoading, setIsColorSchemeLoading] = useState(true);

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const stored = await SecureStore.getItemAsync(COLOR_SCHEME_KEY);
        if (stored === 'light' || stored === 'dark') {
          setStoredColorScheme(stored);
        }
      } catch (e) {
        console.error("Failed to load color scheme", e);
      } finally {
        setIsColorSchemeLoading(false);
      }
    };
    loadColorScheme();
  }, []);

  const effectiveColorScheme = storedColorScheme 
    ? storedColorScheme 
    : (systemColorScheme === 'light' || systemColorScheme === 'dark' ? systemColorScheme : 'light');

  const isDarkColorScheme = effectiveColorScheme === 'dark';

  const toggleColorScheme = async () => {
    const newScheme = isDarkColorScheme ? 'light' : 'dark';
    setStoredColorScheme(newScheme); // Update state instantly
    try {
      await SecureStore.setItemAsync(COLOR_SCHEME_KEY, newScheme); // Persist the change
    } catch (e) {
      console.error("Failed to save color scheme", e);
    }
  };

  const value = {
    isDarkColorScheme,
    toggleColorScheme,
    colorScheme: effectiveColorScheme,
    isColorSchemeLoading,
  };

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

// Create the consumer hook.
export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
}
