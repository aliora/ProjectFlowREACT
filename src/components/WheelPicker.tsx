import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, NativeSyntheticEvent, NativeScrollEvent, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';

// AYARLAR
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const REPEAT_COUNT = 100; // Her yönde kaç kez tekrar edilecek

interface WheelPickerProps {
    data: (string | number)[];
    onValueChange?: (value: string | number) => void;
    selectedValue?: string | number;
    width?: number;
    containerStyle?: ViewStyle;
    onScrollBegin?: () => void;
    onScrollEnd?: () => void;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
    data,
    onValueChange,
    selectedValue,
    width = 100,
    containerStyle,
    onScrollBegin,
    onScrollEnd
}) => {
    const { colors, isDark } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const lastRealIndex = useRef<number>(-1);
    const lastHapticIndex = useRef<number>(-1);
    const isScrolling = useRef<boolean>(false);

    // Infinite data: repeat the original data many times
    const infiniteData = useMemo(() => {
        const repeated: (string | number)[] = [];
        for (let i = 0; i < REPEAT_COUNT; i++) {
            repeated.push(...data);
        }
        return repeated;
    }, [data]);

    // Calculate initial index in the middle of infinite data
    const initialIndex = useMemo(() => {
        const middleRepeat = Math.floor(REPEAT_COUNT / 2);
        const baseIndex = middleRepeat * data.length;
        if (selectedValue === undefined) return baseIndex;
        const idx = data.indexOf(selectedValue);
        return idx !== -1 ? baseIndex + idx : baseIndex;
    }, [data, selectedValue]);

    // Get real index from infinite index
    const getRealIndex = useCallback((infiniteIndex: number) => {
        return ((infiniteIndex % data.length) + data.length) % data.length;
    }, [data.length]);

    // Scroll to selected value when it changes externally
    useEffect(() => {
        if (selectedValue !== undefined && flatListRef.current && !isScrolling.current) {
            const realIdx = data.indexOf(selectedValue);
            if (realIdx !== -1 && realIdx !== lastRealIndex.current) {
                lastRealIndex.current = realIdx;
                lastHapticIndex.current = realIdx;
                // Calculate target in the middle section
                const middleRepeat = Math.floor(REPEAT_COUNT / 2);
                const targetIndex = middleRepeat * data.length + realIdx;
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
                }, 50);
            }
        }
    }, [selectedValue, data, getRealIndex]);

    // Handle scroll with haptic feedback on each number pass
    const handleScrollWithHaptics = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const infiniteIndex = Math.round(offsetY / ITEM_HEIGHT);
        const realIndex = getRealIndex(infiniteIndex);

        // Trigger light haptic on each number pass
        if (realIndex !== lastHapticIndex.current) {
            lastHapticIndex.current = realIndex;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [getRealIndex]);

    const handleScroll = useMemo(() => Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: true,
            listener: handleScrollWithHaptics
        }
    ), [scrollY, handleScrollWithHaptics]);

    const handleScrollBegin = useCallback(() => {
        isScrolling.current = true;
        onScrollBegin?.(); // Trigger parent handler
    }, [onScrollBegin]);

    const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        isScrolling.current = false;
        onScrollEnd?.(); // Trigger parent handler

        const offsetY = event.nativeEvent.contentOffset.y;
        const infiniteIndex = Math.round(offsetY / ITEM_HEIGHT);
        const realIndex = getRealIndex(infiniteIndex);

        if (realIndex !== lastRealIndex.current) {
            lastRealIndex.current = realIndex;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onValueChange?.(data[realIndex]);
        }

        // Re-center to middle section if scrolled too far
        const middleRepeat = Math.floor(REPEAT_COUNT / 2);
        const middleStart = middleRepeat * data.length;
        const middleEnd = (middleRepeat + 1) * data.length;

        if (infiniteIndex < middleStart - data.length || infiniteIndex >= middleEnd + data.length) {
            const targetIndex = middleStart + realIndex;
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: targetIndex, animated: false });
            }, 100);
        }
    }, [data, getRealIndex, onValueChange]);

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    }), []);

    const keyExtractor = useCallback((_: any, index: number) => index.toString(), []);

    const renderItem = useCallback(({ item, index }: { item: string | number; index: number }) => {
        const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
        ];

        const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.75, 0.85, 1.15, 0.85, 0.75],
            extrapolate: 'clamp',
        });

        const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.3, 0.5, 1, 0.5, 0.3],
            extrapolate: 'clamp',
        });

        const rotateX = scrollY.interpolate({
            inputRange,
            outputRange: ['50deg', '25deg', '0deg', '-25deg', '-50deg'],
            extrapolate: 'clamp',
        });

        // Format display value
        const displayValue = typeof item === 'number'
            ? item.toString().padStart(2, '0')
            : item;

        return (
            <Animated.View
                style={[
                    styles.item,
                    {
                        transform: [
                            { perspective: 800 },
                            { scale },
                            { rotateX },
                        ],
                        opacity,
                    },
                ]}
            >
                <Text style={[styles.text, { color: colors.text }]}>{displayValue}</Text>
            </Animated.View>
        );
    }, [scrollY, colors.text]);

    const containerHeight = ITEM_HEIGHT * VISIBLE_ITEMS;

    return (
        <View style={[
            styles.container,
            {
                width,
                height: containerHeight,
                backgroundColor: isDark ? colors.surface : colors.card,
                borderRadius: 16,
            },
            containerStyle
        ]}>
            {/* Selection indicator */}
            <View style={styles.indicatorOverlay} pointerEvents="none">
                <View style={[
                    styles.indicator,
                    {
                        backgroundColor: isDark
                            ? 'rgba(141, 110, 99, 0.2)'
                            : 'rgba(93, 64, 55, 0.08)',
                        borderColor: colors.primary,
                        borderTopWidth: 2,
                        borderBottomWidth: 2,
                    }
                ]} />
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={infiniteData}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                onScroll={handleScroll}
                onScrollBeginDrag={handleScrollBegin}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                getItemLayout={getItemLayout}
                initialScrollIndex={initialIndex}
                contentContainerStyle={{
                    paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
                }}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
    },
    indicatorOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    indicator: {
        width: '100%',
        height: ITEM_HEIGHT,
        borderRadius: 12,
    },
});

export default WheelPicker;
