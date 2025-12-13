/**
 * AppPalette - Color constants for ProjectFlow
 * Migrated from Flutter's theme_provider.dart
 *
 * This file defines the core color palette used throughout the application.
 * Colors are organized by theme (light/dark) for easy reference.
 */

// Light Theme Colors
export const LightColors = {
  /** Kırık Beyaz - Off White background */
  offWhite: '#F5F5F5',
  /** Toprak Kahvesi - Earth Brown primary */
  earthBrown: '#5D4037',
  /** Vizon - Taupe secondary */
  taupe: '#A1887F',
  /** Açık taş - Light Stone for text/surfaces */
  lightStone: '#EFEFE9',
  /** Light divider color */
  lightDivider: '#E0E0E0',

  // Text Colors
  textPrimary: '#2B211C',
  textSecondary: '#4B3A32',
  textTertiary: '#6A5A54',

  // Surface Colors
  surface: '#FFFFFF',
  card: '#FFFFFF',
} as const;

// Dark Theme Colors
export const DarkColors = {
  /** Koyu Antrasit - Charcoal background */
  charcoal: '#212121',
  /** Eskitme Deri - Leather primary */
  leather: '#8D6E63',
  /** Deep surface for cards/containers */
  deepSurface: '#2B2B2B',
  /** Dark divider color */
  darkDivider: '#3A3A3A',

  // Shared from Light
  /** Vizon - Taupe secondary (same as light) */
  taupe: '#A1887F',
  /** Açık taş - Light Stone for text on dark */
  lightStone: '#EFEFE9',

  // Text Colors
  textPrimary: '#EFEFE9', // lightStone
  textSecondary: '#D6D1CB',
  textTertiary: '#B8B2AC',

  // Surface Colors
  surface: '#2B2B2B',
  card: '#2B2B2B',
} as const;

/**
 * AppPalette - Combined color palette for both themes
 */
export const AppPalette = {
  light: {
    // Main Colors
    primary: LightColors.earthBrown,
    secondary: LightColors.taupe,
    background: LightColors.offWhite,
    surface: LightColors.surface,
    card: LightColors.card,

    // Text Colors
    text: {
      primary: LightColors.textPrimary,
      secondary: LightColors.textSecondary,
      tertiary: LightColors.textTertiary,
    },

    // UI Colors
    divider: LightColors.lightDivider,
    border: LightColors.lightDivider,
    icon: LightColors.earthBrown,

    // Button Colors
    button: {
      primary: {
        background: LightColors.earthBrown,
        text: '#FFFFFF',
      },
      secondary: {
        background: 'transparent',
        text: LightColors.earthBrown,
        border: LightColors.earthBrown,
      },
    },

    // Input Colors
    input: {
      background: '#FFFFFF',
      border: LightColors.lightDivider,
      focusBorder: LightColors.earthBrown,
      label: LightColors.earthBrown,
      placeholder: LightColors.taupe,
    },

    // Status Colors (common across themes)
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  dark: {
    // Main Colors
    primary: DarkColors.leather,
    secondary: DarkColors.taupe,
    background: DarkColors.charcoal,
    surface: DarkColors.surface,
    card: DarkColors.card,

    // Text Colors
    text: {
      primary: DarkColors.textPrimary,
      secondary: DarkColors.textSecondary,
      tertiary: DarkColors.textTertiary,
    },

    // UI Colors
    divider: DarkColors.darkDivider,
    border: DarkColors.darkDivider,
    icon: DarkColors.lightStone,

    // Button Colors
    button: {
      primary: {
        background: DarkColors.leather,
        text: '#FFFFFF',
      },
      secondary: {
        background: 'transparent',
        text: DarkColors.lightStone,
        border: DarkColors.lightStone,
      },
    },

    // Input Colors
    input: {
      background: DarkColors.deepSurface,
      border: DarkColors.darkDivider,
      focusBorder: DarkColors.leather,
      label: DarkColors.lightStone,
      placeholder: DarkColors.taupe,
    },

    // Status Colors (common across themes)
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',
  },
} as const;

// Type exports for TypeScript support
export type LightPalette = typeof AppPalette.light;
export type DarkPalette = typeof AppPalette.dark;
export type ThemePalette = LightPalette | DarkPalette;
export type ThemeType = 'light' | 'dark';
