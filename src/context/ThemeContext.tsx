import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

// Color Palette from Flutter
export const AppPalette = {
    // Light
    offWhite: '#F5F5F5',
    earthBrown: '#5D4037',
    taupe: '#A1887F',
    lightStone: '#EFEFE9',
    lightDivider: '#E0E0E0',

    // Dark
    charcoal: '#212121',
    leather: '#8D6E63',
    deepSurface: '#2B2B2B',
    darkDivider: '#3A3A3A',
};

type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    divider: string;
    error: string;
}

const LightTheme: ThemeColors = {
    primary: AppPalette.earthBrown,
    secondary: AppPalette.taupe,
    background: AppPalette.offWhite,
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#2B211C',
    textSecondary: '#4B3A32',
    border: AppPalette.earthBrown,
    divider: AppPalette.lightDivider,
    error: '#B00020',
};

const DarkTheme: ThemeColors = {
    primary: AppPalette.leather,
    secondary: AppPalette.taupe,
    background: AppPalette.charcoal,
    surface: AppPalette.deepSurface,
    card: AppPalette.deepSurface,
    text: AppPalette.lightStone,
    textSecondary: '#D6D1CB',
    border: AppPalette.lightStone,
    divider: AppPalette.darkDivider,
    error: '#CF6679',
};

interface ThemeContextType {
    theme: 'light' | 'dark';
    colors: ThemeColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme_mode';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                setThemeMode(savedTheme as ThemeMode);
            } else if (systemColorScheme) {
                setThemeMode(systemColorScheme);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    const colors = themeMode === 'dark' ? DarkTheme : LightTheme;

    return (
        <ThemeContext.Provider
            value={{
                theme: themeMode,
                colors,
                toggleTheme,
                isDark: themeMode === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
