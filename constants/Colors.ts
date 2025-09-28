/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const palette = {
  // Black/Dark Gray
  black: '#000000', // black
  gray_900: '#1C1C1E',
  gray_800: '#333333',

  // Grays
  gray_700: '#555555',
  gray_600: '#666666',
  gray_500: '#777777',
  gray_450: '#767577',
  gray_400: '#888888',
  gray_350: '#8E8E93',
  gray_300: '#cccccc',
  gray_250: '#D1D1D6',
  gray_200: '#DDDDDD',
  gray_100: '#e0e0e0',
  gray_50: '#eeeeee',

  // White/Light
  offWhite_blue: '#eef0f4',
  offWhite_blue_2: '#eef2fa',
  offWhite: '#f0f0f0',
  offWhite_purple: '#f4f3f4',
  offWhite_purple_2: '#f4f4fd',
  almostWhite_1: '#f7f7f7',
  almostWhite_2: '#f8f8f8',
  almostWhite_3: '#f9f9f9',
  almostWhite_4: '#fcfcfc',
  white: '#ffffff', // white

  // Reds
  red_700: '#c1121f',
  red_500: '#D25A5A',
  red_300: '#FF6B6B',
  red: '#FF0000', // red

  // Blues/Purples
  purple_900: '#484389',
  blue_700: '#4c669f',
  purple_500: '#7B68EE', // mediumslateblue
  blue_300: '#81b0ff',
  purple_400: '#9970FF',
  purple_300: '#9f9ff0',
  purple_350: '#9393db',
  purple_200: '#B5B5E9',
  purple_100: '#e4d9ff',
  lavender: '#E6E6FA', // lavender

  // Yellows
  yellow_500: '#f5dd4b',

  // Transparent
  transparent: 'rgba(0, 0, 0, 0)', // transparent
  transparent_black_50: 'rgba(0, 0, 0, 0.5)',
  transparent_black_60: 'rgba(0, 0, 0, 0.6)',
  transparent_lavender_70: 'rgba(230, 230, 250, 0.7)',
};

export const Colors = {
  light: {
    text: palette.gray_900,
    background: palette.white,
    icon: palette.gray_450,
    tabIconDefault: palette.gray_450,
    tabIconSelected: palette.purple_400,
    borderColor: palette.gray_250,
    notification: palette.red_500,
    // Point colors can be accessed like: Colors.light.pointColors.purple
    pointColors: {
      purple: palette.purple_400,
      white: palette.white,
      blue: palette.blue_300,
      red: palette.red_300,
      yellow: palette.yellow_500,
    }
  },
  dark: {
    text: palette.almostWhite_1,
    background: palette.black,
    icon: palette.gray_350,
    tabIconDefault: palette.gray_350,
    tabIconSelected: palette.white,
    borderColor: palette.gray_800,
    notification: palette.red_300,
    // Point colors can be accessed like: Colors.dark.pointColors.purple
    pointColors: {
      purple: palette.purple_400, // Dark mode might need a lighter purple, e.g., palette.purple_200. This can be adjusted later.
      white: palette.white,
      blue: palette.blue_300,
      red: palette.red_300,
      yellow: palette.yellow_500,
    }
  },
};
