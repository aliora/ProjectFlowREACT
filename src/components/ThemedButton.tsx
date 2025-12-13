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
import { useColors } from '../theme';
import { ButtonSize, BorderRadius } from '../constants/Layout';

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
 *
 * @example
 * ```tsx
 * <ThemedPrimaryButton
 *   label="Create Project"
 *   icon={<AddIcon />}
 *   onPress={() => console.log('pressed')}
 * />
 * ```
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
  const colors = useColors();
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
            ? colors.button.primary.background + '80' // 50% opacity
            : colors.button.primary.background,
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
          color={colors.button.primary.text}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: colors.button.primary.text,
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
 *
 * @example
 * ```tsx
 * <ThemedOutlinedButton
 *   label="Cancel"
 *   onPress={() => console.log('cancelled')}
 * />
 * ```
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
  const colors = useColors();
  const sizeStyle = ButtonSize[size];
  const isDisabled = disabled || isLoading;

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
            ? colors.button.secondary.border + '80'
            : colors.button.secondary.border,
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
          color={colors.button.secondary.text}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.label,
              {
                color: isDisabled
                  ? colors.button.secondary.text + '80'
                  : colors.button.secondary.text,
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
  const colors = useColors();
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
  const colors = useColors();

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
