/**
 * Typography - Text styles for ProjectFlow
 * Migrated from Flutter's theme system
 *
 * Defines consistent text styles used throughout the application.
 * Includes both light and dark theme variants.
 */

import { TextStyle, Platform } from 'react-native';
import { AppPalette, ThemeType } from './AppPalette';

/**
 * Font family configuration
 * Uses system fonts for platform consistency
 */
export const FontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

/**
 * Font weights
 */
export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

/**
 * Font sizes following an 8px grid system
 */
export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

/**
 * Line heights
 */
export const LineHeight = {
  tight: 1.2,
  normal: 1.45,
  relaxed: 1.5,
  loose: 1.75,
} as const;

/**
 * Letter spacing
 */
export const LetterSpacing = {
  tighter: -0.2,
  tight: -0.1,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

/**
 * Typography style interface
 */
interface TypographyStyle {
  fontFamily?: string;
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing: number;
  color: string;
}

/**
 * Complete typography styles for a theme
 */
export interface ThemeTypography {
  // Display (largest)
  displayLarge: TypographyStyle;
  displayMedium: TypographyStyle;
  displaySmall: TypographyStyle;

  // Headline
  headlineLarge: TypographyStyle;
  headlineMedium: TypographyStyle;
  headlineSmall: TypographyStyle;

  // Title
  titleLarge: TypographyStyle;
  titleMedium: TypographyStyle;
  titleSmall: TypographyStyle;

  // Body
  bodyLarge: TypographyStyle;
  bodyMedium: TypographyStyle;
  bodySmall: TypographyStyle;

  // Label
  labelLarge: TypographyStyle;
  labelMedium: TypographyStyle;
  labelSmall: TypographyStyle;

  // Button
  button: TypographyStyle;

  // Caption
  caption: TypographyStyle;
}

/**
 * Create typography styles for a given theme
 */
const createTypography = (theme: ThemeType): ThemeTypography => {
  const colors = AppPalette[theme];
  const fontFamily = FontFamily.regular;

  return {
    // Display styles
    displayLarge: {
      fontFamily,
      fontSize: FontSize['5xl'],
      fontWeight: FontWeight.extrabold,
      lineHeight: FontSize['5xl'] * LineHeight.tight,
      letterSpacing: LetterSpacing.tighter,
      color: colors.text.primary,
    },
    displayMedium: {
      fontFamily,
      fontSize: FontSize['4xl'],
      fontWeight: FontWeight.extrabold,
      lineHeight: FontSize['4xl'] * LineHeight.tight,
      letterSpacing: LetterSpacing.tighter,
      color: colors.text.primary,
    },
    displaySmall: {
      fontFamily,
      fontSize: FontSize['3xl'],
      fontWeight: FontWeight.bold,
      lineHeight: FontSize['3xl'] * LineHeight.tight,
      letterSpacing: LetterSpacing.tight,
      color: colors.text.primary,
    },

    // Headline styles
    headlineLarge: {
      fontFamily,
      fontSize: FontSize['2xl'],
      fontWeight: FontWeight.extrabold,
      lineHeight: FontSize['2xl'] * LineHeight.tight,
      letterSpacing: LetterSpacing.tight,
      color: colors.text.primary,
    },
    headlineMedium: {
      fontFamily,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      lineHeight: FontSize.xl * LineHeight.normal,
      letterSpacing: LetterSpacing.tight,
      color: colors.text.primary,
    },
    headlineSmall: {
      fontFamily,
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      lineHeight: FontSize.lg * LineHeight.normal,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.primary,
    },

    // Title styles (matching Flutter's titleLarge)
    titleLarge: {
      fontFamily,
      fontSize: FontSize.xl,
      fontWeight: FontWeight.extrabold,
      lineHeight: FontSize.xl * LineHeight.normal,
      letterSpacing: LetterSpacing.tighter,
      color: colors.text.primary,
    },
    titleMedium: {
      fontFamily,
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      lineHeight: FontSize.md * LineHeight.normal,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.primary,
    },
    titleSmall: {
      fontFamily,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      lineHeight: FontSize.base * LineHeight.normal,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.primary,
    },

    // Body styles (matching Flutter's bodyLarge, bodyMedium, bodySmall)
    bodyLarge: {
      fontFamily,
      fontSize: FontSize.md,
      fontWeight: FontWeight.regular,
      lineHeight: FontSize.md * LineHeight.relaxed,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.primary,
    },
    bodyMedium: {
      fontFamily,
      fontSize: FontSize.base,
      fontWeight: FontWeight.regular,
      lineHeight: FontSize.base * LineHeight.relaxed,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.secondary,
    },
    bodySmall: {
      fontFamily,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.regular,
      lineHeight: FontSize.sm * LineHeight.normal,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.tertiary,
    },

    // Label styles
    labelLarge: {
      fontFamily,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      lineHeight: FontSize.base * LineHeight.normal,
      letterSpacing: LetterSpacing.wide,
      color: colors.text.primary,
    },
    labelMedium: {
      fontFamily,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      lineHeight: FontSize.sm * LineHeight.normal,
      letterSpacing: LetterSpacing.wide,
      color: colors.text.secondary,
    },
    labelSmall: {
      fontFamily,
      fontSize: FontSize.xs,
      fontWeight: FontWeight.medium,
      lineHeight: FontSize.xs * LineHeight.normal,
      letterSpacing: LetterSpacing.wide,
      color: colors.text.tertiary,
    },

    // Button style
    button: {
      fontFamily,
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      lineHeight: FontSize.base * LineHeight.tight,
      letterSpacing: LetterSpacing.wide,
      color: colors.button.primary.text,
    },

    // Caption style
    caption: {
      fontFamily,
      fontSize: FontSize.xs,
      fontWeight: FontWeight.regular,
      lineHeight: FontSize.xs * LineHeight.normal,
      letterSpacing: LetterSpacing.normal,
      color: colors.text.tertiary,
    },
  };
};

/**
 * Pre-generated typography for both themes
 */
export const Typography = {
  light: createTypography('light'),
  dark: createTypography('dark'),
} as const;

/**
 * Get typography for a specific theme
 */
export const getTypography = (theme: ThemeType): ThemeTypography => {
  return Typography[theme];
};

export default Typography;
