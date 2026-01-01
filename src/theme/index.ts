/**
 * Theme Module Index
 * Exports all theme-related constants, providers, and utilities
 */

// Color Palette
export {
  AppPalette,
  LightColors,
  DarkColors,
  type LightPalette,
  type DarkPalette,
  type ThemePalette,
  type ThemeType,
} from './AppPalette';

// Theme Context and Provider
// Theme Context and Provider
export {
  ThemeProvider,
  useTheme,
  useColors,
  useIsDarkMode,
} from '../context/ThemeContext';

// Typography
export {
  Typography,
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
  getTypography,
  type ThemeTypography,
} from './Typography';
