/**
 * ThemeContext - Theme management for ProjectFlow
 * Migrated from Flutter's theme_provider.dart
 *
 * Provides theme state management with persistence using AsyncStorage.
 * Supports light and dark themes with automatic system theme detection.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppPalette, ThemePalette, ThemeType } from './AppPalette';

// Storage key for theme persistence
const THEME_STORAGE_KEY = '@projectflow/theme_mode';

/**
 * Theme Context Type Definition
 */
interface ThemeContextType {
  /** Current theme type ('light' | 'dark') */
  theme: ThemeType;
  /** Current theme colors */
  colors: ThemePalette;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Toggle between light and dark themes */
  toggleTheme: () => Promise<void>;
  /** Set a specific theme */
  setTheme: (theme: ThemeType) => Promise<void>;
  /** Use system theme preference */
  useSystemTheme: () => Promise<void>;
  /** Whether theme is still loading from storage */
  isLoading: boolean;
}

// Create the context with undefined default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Props
 */
interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Initial theme (defaults to system preference or 'light') */
  initialTheme?: ThemeType;
}

/**
 * ThemeProvider Component
 *
 * Wraps the application and provides theme context to all children.
 * Automatically loads saved theme preference from AsyncStorage.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
}) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();

  // State for current theme
  const [theme, setThemeState] = useState<ThemeType>(
    initialTheme ?? (systemColorScheme === 'dark' ? 'dark' : 'light')
  );
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load saved theme from AsyncStorage on mount
   */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  /**
   * Save theme to AsyncStorage
   */
  const saveTheme = useCallback(async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  /**
   * Set a specific theme and persist it
   */
  const setTheme = useCallback(
    async (newTheme: ThemeType) => {
      setThemeState(newTheme);
      await saveTheme(newTheme);
    },
    [saveTheme]
  );

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = useCallback(async () => {
    const newTheme: ThemeType = theme === 'dark' ? 'light' : 'dark';
    await setTheme(newTheme);
  }, [theme, setTheme]);

  /**
   * Use system theme preference
   */
  const useSystemTheme = useCallback(async () => {
    const systemTheme: ThemeType = systemColorScheme === 'dark' ? 'dark' : 'light';
    await setTheme(systemTheme);
  }, [systemColorScheme, setTheme]);

  /**
   * Derived values
   */
  const isDarkMode = theme === 'dark';
  const colors = useMemo(
    () => (isDarkMode ? AppPalette.dark : AppPalette.light),
    [isDarkMode]
  );

  /**
   * Context value
   */
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      colors,
      isDarkMode,
      toggleTheme,
      setTheme,
      useSystemTheme,
      isLoading,
    }),
    [theme, colors, isDarkMode, toggleTheme, setTheme, useSystemTheme, isLoading]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 *
 * Custom hook to access theme context.
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * const { colors, isDarkMode, toggleTheme } = useTheme();
 *
 * return (
 *   <View style={{ backgroundColor: colors.background }}>
 *     <Text style={{ color: colors.text.primary }}>Hello</Text>
 *     <Button onPress={toggleTheme} title="Toggle Theme" />
 *   </View>
 * );
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

/**
 * useColors Hook
 *
 * Convenience hook to access only the colors from theme context.
 *
 * @example
 * ```tsx
 * const colors = useColors();
 * return <View style={{ backgroundColor: colors.background }} />;
 * ```
 */
export const useColors = (): ThemePalette => {
  const { colors } = useTheme();
  return colors;
};

/**
 * useIsDarkMode Hook
 *
 * Convenience hook to check if dark mode is active.
 *
 * @example
 * ```tsx
 * const isDark = useIsDarkMode();
 * const icon = isDark ? 'sun' : 'moon';
 * ```
 */
export const useIsDarkMode = (): boolean => {
  const { isDarkMode } = useTheme();
  return isDarkMode;
};

export default ThemeContext;
