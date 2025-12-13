/**
 * Icon Components
 * Custom icon components for ProjectFlow
 *
 * Includes GitHubLogo and other custom icons
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '../theme';
import { IconSize } from '../constants/Layout';

/**
 * GitHub brand colors
 */
export const GitHubColors = {
  /** Primary GitHub dark theme color */
  dark: '#24292E',
  /** Darker variant for hover states */
  darkHover: '#161B22',
  /** Light background color */
  light: '#F6F8FA',
  /** Success state color (green) */
  success: '#238636',
  /** Danger/error state color (red) */
  danger: '#D73A49',
} as const;

interface IconProps {
  /** Icon size in pixels */
  size?: number;
  /** Icon color */
  color?: string;
}

/**
 * GitHubLogo - GitHub mark/logo icon using SVG
 *
 * Uses the official GitHub Octicon mark
 *
 * @example
 * ```tsx
 * <GitHubLogo size={24} color="#FFFFFF" />
 * ```
 */
export const GitHubLogo: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
      />
    </Svg>
  );
};

/**
 * AddIcon - Plus/Add icon
 */
export const AddIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
};

/**
 * FolderIcon - Folder icon for projects
 */
export const FolderIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      />
    </Svg>
  );
};

/**
 * PersonIcon - User/Profile icon
 */
export const PersonIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </Svg>
  );
};

/**
 * SunIcon - Light mode icon
 */
export const SunIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
      />
    </Svg>
  );
};

/**
 * MoonIcon - Dark mode icon
 */
export const MoonIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M9 2c-1.05 0-2.05.16-3 .46 4.06 1.27 7 5.06 7 9.54 0 4.48-2.94 8.27-7 9.54.95.3 1.95.46 3 .46 5.52 0 10-4.48 10-10S14.52 2 9 2z"
      />
    </Svg>
  );
};

/**
 * MenuIcon - Hamburger menu icon
 */
export const MenuIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </Svg>
  );
};

/**
 * SettingsIcon - Settings/gear icon
 */
export const SettingsIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
      />
    </Svg>
  );
};

/**
 * LogoutIcon - Sign out icon
 */
export const LogoutIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.error;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
      />
    </Svg>
  );
};

/**
 * HelpIcon - Help/question icon
 */
export const HelpIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
      />
    </Svg>
  );
};

/**
 * DashboardIcon - Dashboard icon
 */
export const DashboardIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.icon;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      />
    </Svg>
  );
};

/**
 * WavingHandIcon - Waving hand emoji-style icon
 */
export const WavingHandIcon: React.FC<IconProps> = ({
  size = IconSize.md,
  color,
}) => {
  const colors = useColors();
  const iconColor = color || colors.primary;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={iconColor}
    >
      <Path
        d="M23 17c0 3.31-2.69 6-6 6v-1.5c2.48 0 4.5-2.02 4.5-4.5H23zM1 7c0-3.31 2.69-6 6-6v1.5C4.52 2.5 2.5 4.52 2.5 7H1zm7.5-2c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm4-2c-.83 0-1.5.67-1.5 1.5v8c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5zm4 4c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm0 10c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
      />
    </Svg>
  );
};

export default {
  GitHubLogo,
  AddIcon,
  FolderIcon,
  PersonIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  SettingsIcon,
  LogoutIcon,
  HelpIcon,
  DashboardIcon,
  WavingHandIcon,
  GitHubColors,
};
