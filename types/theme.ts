/**
 * This file defines the TypeScript interfaces for the theme structure.
 * It should be kept in sync with the `Colors` object in `constants/Colors.ts`.
 */

/**
 * Defines the shape of the nested pointColors object.
 */
export interface PointColors {
  purple: string;
  white: string;
  blue: string;
  red: string;
  yellow: string;
}

/**
 * Defines the shape of the main theme object (Colors.light and Colors.dark).
 */
export interface ThemeColors {
  text: string;
  background: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  borderColor: string;
  notification: string;
  pointColors: PointColors;
}