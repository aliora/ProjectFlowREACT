/**
 * Layout Constants - Spacing, Sizes, and Layout values for ProjectFlow
 * Migrated from Flutter's layout system
 *
 * Following an 8px grid system for consistent spacing
 */

/**
 * Spacing values following an 8px grid system
 */
export const Spacing = {
  /** 4px - Extra small spacing */
  xs: 4,
  /** 8px - Small spacing */
  sm: 8,
  /** 12px - Medium-small spacing */
  md: 12,
  /** 16px - Medium spacing (base unit) */
  base: 16,
  /** 20px - Medium-large spacing */
  lg: 20,
  /** 24px - Large spacing */
  xl: 24,
  /** 32px - Extra large spacing */
  xxl: 32,
  /** 40px - 2x extra large spacing */
  xxxl: 40,
  /** 48px - 3x extra large spacing */
  xxxxl: 48,
} as const;

/**
 * Border radius values
 */
export const BorderRadius = {
  /** 4px - Extra small radius */
  xs: 4,
  /** 8px - Small radius */
  sm: 8,
  /** 10px - Medium-small radius */
  md: 10,
  /** 12px - Medium radius (base) */
  base: 12,
  /** 16px - Large radius */
  lg: 16,
  /** 20px - Extra large radius */
  xl: 20,
  /** 30px - Pill shape for buttons */
  pill: 30,
  /** 50px - Circle shape */
  circle: 50,
  /** 9999px - Full round */
  full: 9999,
} as const;

/**
 * Icon sizes
 */
export const IconSize = {
  /** 16px - Extra small icon */
  xs: 16,
  /** 18px - Small icon */
  sm: 18,
  /** 24px - Medium icon (default) */
  md: 24,
  /** 32px - Large icon */
  lg: 32,
  /** 48px - Extra large icon */
  xl: 48,
  /** 80px - 2x extra large icon */
  xxl: 80,
} as const;

/**
 * Button sizes matching Flutter's ElevatedButton style
 */
export const ButtonSize = {
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: BorderRadius.md,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    borderRadius: BorderRadius.base,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
    borderRadius: BorderRadius.base,
  },
} as const;

/**
 * Card dimensions and styles
 */
export const CardStyle = {
  padding: Spacing.base,
  borderRadius: BorderRadius.base,
  elevation: 2,
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
} as const;

/**
 * Navigation bar dimensions
 */
export const NavBarStyle = {
  height: 70,
  itemWidth: 'auto' as const,
  indicatorPadding: 20,
  indicatorBorderRadius: 30,
  indicatorDraggedBorderRadius: 50,
  iconSize: IconSize.md,
  labelFontSize: 12,
  shadowBlur: 10,
  shadowOffset: { width: 0, height: -2 },
} as const;

/**
 * App Bar dimensions
 */
export const AppBarStyle = {
  height: 56,
  elevation: 0,
  titleFontSize: 22,
  iconButtonSize: 48,
} as const;

/**
 * Floating Action Button dimensions
 */
export const FABStyle = {
  size: 56,
  iconSize: 32,
  borderRadius: BorderRadius.full,
  elevation: 6,
} as const;

/**
 * Bottom Sheet dimensions
 */
export const BottomSheetStyle = {
  borderRadius: 20,
  handleWidth: 40,
  handleHeight: 4,
  handleMarginTop: 12,
  handleMarginBottom: 16,
} as const;

/**
 * Drawer dimensions
 */
export const DrawerStyle = {
  width: 300,
  headerPadding: {
    top: 60,
    horizontal: 24,
    bottom: 24,
  },
  avatarRadius: 32,
  avatarFontSize: 28,
} as const;

/**
 * Input field dimensions
 */
export const InputStyle = {
  height: 48,
  paddingHorizontal: 12,
  paddingVertical: 14,
  borderWidth: 1,
  focusBorderWidth: 1.8,
  borderRadius: BorderRadius.base,
} as const;

/**
 * Progress indicator dimensions
 */
export const ProgressStyle = {
  height: 4,
  borderRadius: 2,
  strokeWidth: 2,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const AnimationDuration = {
  fast: 200,
  normal: 300,
  slow: 400,
  verySlow: 700,
  pageTransition: 400,
  drawerSlide: 300,
  indicatorMove: 300,
} as const;

/**
 * Touch target sizes (minimum for accessibility)
 */
export const TouchTarget = {
  minimum: 48,
  comfortable: 56,
} as const;

export default {
  Spacing,
  BorderRadius,
  IconSize,
  ButtonSize,
  CardStyle,
  NavBarStyle,
  AppBarStyle,
  FABStyle,
  BottomSheetStyle,
  DrawerStyle,
  InputStyle,
  ProgressStyle,
  AnimationDuration,
  TouchTarget,
};
