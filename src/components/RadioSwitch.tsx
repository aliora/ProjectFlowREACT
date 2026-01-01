import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';

interface TimeValue {
    hour: number;
    minute: number;
}

interface RadioSwitchProps {
    startTime: TimeValue;
    endTime: TimeValue;
    isSelectingStart: boolean;
    onChange: (isStart: boolean) => void;
}

const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

export const RadioSwitch: React.FC<RadioSwitchProps> = ({
    startTime,
    endTime,
    isSelectingStart,
    onChange
}) => {
    const { colors, isDark } = useTheme();
    const [containerWidth, setContainerWidth] = useState(0);

    const slideAnim = useRef(new Animated.Value(isSelectingStart ? 0 : 1)).current;
    const startScale = useRef(new Animated.Value(isSelectingStart ? 1 : 0.95)).current;
    const endScale = useRef(new Animated.Value(isSelectingStart ? 0.95 : 1)).current;
    const startOpacity = useRef(new Animated.Value(isSelectingStart ? 1 : 0.6)).current;
    const endOpacity = useRef(new Animated.Value(isSelectingStart ? 0.6 : 1)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: isSelectingStart ? 0 : 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
        }).start();

        Animated.parallel([
            Animated.spring(startScale, {
                toValue: isSelectingStart ? 1 : 0.92,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(endScale, {
                toValue: isSelectingStart ? 0.92 : 1,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(startOpacity, {
                toValue: isSelectingStart ? 1 : 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(endOpacity, {
                toValue: isSelectingStart ? 0.5 : 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [endOpacity, endScale, isSelectingStart, slideAnim, startOpacity, startScale]);

    const sliderColor = isDark ? colors.primary : colors.primary;
    const sliderShadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

    const sliderWidth = containerWidth > 0 ? (containerWidth / 2) - 6 : 0;
    const sliderTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [3, containerWidth / 2 + 3],
    });

    const activeTextColor = '#FFFFFF';

    return (
        <View
            style={styles.container}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View
                style={[
                    styles.slider,
                    {
                        width: sliderWidth,
                        backgroundColor: sliderColor,
                        shadowColor: sliderShadowColor,
                        transform: [
                            { translateX: sliderTranslateX },
                            {
                                scale: slideAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [1, 0.98, 1],
                                }),
                            },
                        ],
                    },
                ]}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => onChange(true)}
                activeOpacity={0.8}
            >
                <Animated.View style={[
                    styles.buttonContent,
                    {
                        transform: [{ scale: startScale }],
                        opacity: startOpacity,
                    },
                ]}>
                    <Text style={[
                        styles.label,
                        { color: isSelectingStart ? activeTextColor : colors.textSecondary },
                    ]}>
                        START
                    </Text>
                    <Text style={[
                        styles.time,
                        { color: isSelectingStart ? activeTextColor : colors.text },
                    ]}>
                        {formatTime(startTime.hour, startTime.minute)}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => onChange(false)}
                activeOpacity={0.8}
            >
                <Animated.View style={[
                    styles.buttonContent,
                    {
                        transform: [{ scale: endScale }],
                        opacity: endOpacity,
                    },
                ]}>
                    <Text style={[
                        styles.label,
                        { color: !isSelectingStart ? activeTextColor : colors.textSecondary },
                    ]}>
                        END
                    </Text>
                    <Text style={[
                        styles.time,
                        { color: !isSelectingStart ? activeTextColor : colors.text },
                    ]}>
                        {formatTime(endTime.hour, endTime.minute)}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
        height: '100%',
    },
    slider: {
        position: 'absolute',
        top: 3,
        bottom: 3,
        borderRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 6,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    buttonContent: {
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    time: {
        fontSize: 20,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
});
