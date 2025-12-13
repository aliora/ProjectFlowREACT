/**
 * ThemedCard Component
 * Migrated from Flutter's themed_components.dart
 *
 * A styled card container with shadow and optional selection state
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useColors } from '../theme';
import { CardStyle, BorderRadius } from '../constants/Layout';

interface ThemedCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Custom padding */
  padding?: number;
  /** Custom margin */
  margin?: number;
  /** Press handler (makes card tappable) */
  onPress?: () => void;
  /** Whether card is in selected state */
  selected?: boolean;
  /** Custom border radius */
  borderRadius?: number;
  /** Custom style */
  style?: ViewStyle;
}

/**
 * ThemedCard - A styled card container
 *
 * @example
 * ```tsx
 * <ThemedCard onPress={() => console.log('tapped')}>
 *   <Text>Card content</Text>
 * </ThemedCard>
 * ```
 */
export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  padding = CardStyle.padding,
  margin,
  onPress,
  selected = false,
  borderRadius = CardStyle.borderRadius,
  style,
}) => {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    padding,
    margin,
    borderRadius,
    backgroundColor: selected
      ? colors.primary + '1F' // ~12% opacity
      : colors.card,
    borderWidth: selected ? 2 : 1,
    borderColor: selected ? colors.primary : colors.divider,
    // Shadow styles
    shadowColor: '#000',
    shadowOffset: CardStyle.shadowOffset,
    shadowOpacity: CardStyle.shadowOpacity,
    shadowRadius: CardStyle.shadowRadius,
    elevation: CardStyle.elevation,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={[styles.card, cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
};

/**
 * ThemedListTile - A list tile component for menus
 */
interface ThemedListTileProps {
  /** Leading icon/widget */
  leading?: React.ReactNode;
  /** Title text or component */
  title: React.ReactNode;
  /** Subtitle text or component */
  subtitle?: React.ReactNode;
  /** Trailing icon/widget */
  trailing?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Custom style */
  style?: ViewStyle;
}

export const ThemedListTile: React.FC<ThemedListTileProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  onPress,
  style,
}) => {
  const colors = useColors();

  const content = (
    <View style={[styles.listTile, style]}>
      {leading && <View style={styles.leading}>{leading}</View>}
      <View style={styles.listTileContent}>
        {title}
        {subtitle && subtitle}
      </View>
      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

/**
 * IconContainer - Styled icon container for list tiles
 */
interface IconContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  size?: number;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  backgroundColor,
  size = 40,
}) => {
  const colors = useColors();

  return (
    <View
      style={[
        styles.iconContainer,
        {
          width: size,
          height: size,
          borderRadius: BorderRadius.sm,
          backgroundColor: backgroundColor || colors.primary + '1A', // ~10% opacity
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  listTile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leading: {
    marginRight: 16,
  },
  listTileContent: {
    flex: 1,
  },
  trailing: {
    marginLeft: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default {
  ThemedCard,
  ThemedListTile,
  IconContainer,
};
