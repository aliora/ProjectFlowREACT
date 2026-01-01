/**
 * Themed Button Components
 * Migrated from Flutter's themed_components.dart
 *
 * Includes Primary (Elevated) and Outlined button variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { ButtonSize } from '../constants/Layout';

/**
 * Button size type
 */
type ButtonSizeType = 'small' | 'medium' | 'large';

/**
 * Common button props
 */
interface BaseButtonProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress?: () => void;
  /** Icon component to display before label */
  icon?: React.ReactNode;
  /** Whether button is in loading state */
  isLoading?: boolean;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button size variant */
  size?: ButtonSizeType;
  /** Custom button style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
}

/**
 * ThemedPrimaryButton - Elevated/filled button style
 */
export const ThemedPrimaryButton: React.FC<BaseButtonProps> = ({
  label,
  onPress,
  icon,
  isLoading = false,
  fullWidth = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const sizeStyle = ButtonSize[size];
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: isDisabled
            ? colors.primary + '80' // Simple opacity simulation
            : colors.primary,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          minHeight: sizeStyle.minHeight,
          borderRadius: sizeStyle.borderRadius,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: '#FFFFFF',
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * ThemedOutlinedButton - Outlined/secondary button style
 */
export const ThemedOutlinedButton: React.FC<BaseButtonProps> = ({
  label,
  onPress,
  icon,
  isLoading = false,
  fullWidth = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const sizeStyle = ButtonSize[size];
  const isDisabled = disabled || isLoading;
  const contentColor = colors.secondary; // Or primary depending on design

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        styles.outlinedButton,
        {
          borderColor: isDisabled
            ? contentColor + '80'
            : contentColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          minHeight: sizeStyle.minHeight,
          borderRadius: sizeStyle.borderRadius,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={contentColor}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: isDisabled
                  ? contentColor + '80'
                  : contentColor,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * ThemedTextButton - Text-only button style
 */
export const ThemedTextButton: React.FC<BaseButtonProps> = ({
  label,
  onPress,
  icon,
  isLoading = false,
  disabled = false,
  size = 'medium',
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const sizeStyle = ButtonSize[size];
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.6}
      style={[
        styles.textButton,
        {
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical / 2,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.textButtonLabel,
              {
                color: isDisabled
                  ? colors.primary + '80'
                  : colors.primary,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * ThemedIconButton - Circular icon button
 */
interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

export const ThemedIconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 48,
  disabled = false,
  style,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colors } = useTheme(); // Available if needed for defaults
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

/**
 * FloatingActionButton - FAB component
 */
interface FABProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  icon,
  onPress,
  size = 56,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  textButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});

export default {
  ThemedPrimaryButton,
  ThemedOutlinedButton,
  ThemedTextButton,
  ThemedIconButton,
  FloatingActionButton,
};
