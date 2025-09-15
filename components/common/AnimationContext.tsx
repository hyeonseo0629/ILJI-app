import React, { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

interface AnimationContextType {
  animatedIndex: SharedValue<number>;
}

export const AnimationContext = createContext<AnimationContextType | null>(null);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
