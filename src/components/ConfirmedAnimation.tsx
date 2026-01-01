import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ConfirmedAnimationProps {
    trigger: boolean;
    size?: number;
    strokeWidth?: number;
    color?: string;
    scale?: number;
    style?: ViewStyle;
}

export const ConfirmedAnimation: React.FC<ConfirmedAnimationProps> = ({
    trigger,
    size = 96,
    strokeWidth = 6,
    color,
    scale: targetScale = 1,
    style,
}) => {
    const { colors } = useTheme();
    const strokeColor = color ?? colors.primary;

    const circleProgress = useRef(new Animated.Value(0)).current;
    const checkProgress = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.6)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const radius = useMemo(() => 50 - strokeWidth / 2, [strokeWidth]);
    const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
    const checkLength = useMemo(() => 74, []);

    useEffect(() => {
        circleProgress.setValue(0);
        checkProgress.setValue(0);
        scaleAnim.setValue(0.6);
        opacity.setValue(0);

        if (!trigger) {
            return;
        }

        const pop = Animated.spring(scaleAnim, {
            toValue: targetScale,
            friction: 6,
            tension: 90,
            useNativeDriver: true,
        });
        const fade = Animated.timing(opacity, {
            toValue: 1,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        });
        const drawCircle = Animated.timing(circleProgress, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        });
        const drawCheck = Animated.timing(checkProgress, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        });

        Animated.sequence([
            Animated.parallel([pop, fade, drawCircle]),
            drawCheck,
        ]).start();
    }, [checkProgress, circleProgress, opacity, scaleAnim, targetScale, trigger]);

    const circleDashoffset = circleProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });
    const checkDashoffset = checkProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [checkLength, 0],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                { width: size, height: size, opacity, transform: [{ scale: scaleAnim }] },
                style,
            ]}
        >
            <Svg width={size} height={size} viewBox="0 0 100 100">
                <AnimatedCircle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circleDashoffset}
                    rotation={-90}
                    originX={50}
                    originY={50}
                />
                <AnimatedPath
                    d="M 28 48 L 44 64 L 74 36"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={checkLength}
                    strokeDashoffset={checkDashoffset}
                />
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
