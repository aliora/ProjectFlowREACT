/**
 * BottomNavBar Component - Expo Go Compatible Version
 * Uses standard React Native Animated API instead of reanimated
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useColors } from '../theme';
import { NavBarStyle, AnimationDuration } from '../constants/Layout';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  key: string;
}

interface BottomNavBarProps {
  items: NavItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  items,
  selectedIndex,
  onSelect,
}) => {
  const colors = useColors();
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const indicatorPosition = useRef(new Animated.Value(selectedIndex)).current;
  const itemWidth = containerWidth / items.length;

  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: selectedIndex,
      damping: 20,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, indicatorPosition]);

  const handleLayout = useCallback((event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const indicatorTranslateX = indicatorPosition.interpolate({
    inputRange: items.map((_, i) => i),
    outputRange: items.map((_, i) => i * itemWidth),
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: '#000',
        },
      ]}
      onLayout={handleLayout}
    >
      {/* Floating Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: itemWidth - NavBarStyle.indicatorPadding * 2,
            backgroundColor: colors.primary + '26',
            borderColor: colors.primary + '80',
            transform: [{ translateX: indicatorTranslateX }],
            marginLeft: NavBarStyle.indicatorPadding,
          },
        ]}
      />

      {/* Navigation Items */}
      <View style={styles.itemsRow}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, { width: itemWidth }]}
            onPress={() => onSelect(index)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              { transform: [{ scale: selectedIndex === index ? 1.2 : 1 }] }
            ]}>
              {item.icon}
            </View>
            <Text
              style={[
                styles.navLabel,
                {
                  color: selectedIndex === index ? colors.primary : colors.textSecondary,
                  fontWeight: selectedIndex === index ? '700' : '500',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: NavBarStyle.height,
    shadowOffset: NavBarStyle.shadowOffset,
    shadowOpacity: 0.1,
    shadowRadius: NavBarStyle.shadowBlur,
    elevation: 10,
  },
  indicator: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    borderRadius: NavBarStyle.indicatorBorderRadius,
    borderWidth: 1.5,
  },
  itemsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: NavBarStyle.labelFontSize,
    marginTop: 4,
  },
});

export default BottomNavBar;
