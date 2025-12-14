import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface Props {
    size?: number;
    color: string;
}

export const AnalogClockIcon: React.FC<Props> = ({ size = 100, color }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 360,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // Static hands with rotating container for simplicity
    const rotateMinute = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    const rotateHour = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '30deg'], // Move slower
    });

    return (
        <View style={{ width: size, height: size }}>
            <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Face */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size / 2 - 2}
                    stroke={color}
                    strokeWidth="3"
                    fill="transparent"
                />
                {/* Center Dot */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r="4"
                    fill={color}
                />
                {/* Hour hand (static position) */}
                <Line
                    x1={size / 2}
                    y1={size / 2}
                    x2={size / 2}
                    y2={size / 2 - size * 0.25}
                    stroke={color}
                    strokeWidth="5"
                    strokeLinecap="round"
                />
                {/* Minute hand (static position) */}
                <Line
                    x1={size / 2}
                    y1={size / 2}
                    x2={size / 2}
                    y2={size / 2 - size * 0.35}
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </Svg>
            {/* Rotating overlay for visual effect */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ rotate: rotateMinute }],
                    },
                ]}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: size / 2 - 3,
                        left: size / 2 - 1,
                        width: 2,
                        height: size * 0.35,
                        backgroundColor: color,
                        borderRadius: 1,
                        transformOrigin: 'top',
                    }}
                />
            </Animated.View>
        </View>
    );
};

export const PendulumBellIcon: React.FC<Props> = ({ size = 100, color }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotation, {
                    toValue: 15,
                    duration: 375,
                    easing: Easing.sin,
                    useNativeDriver: true,
                }),
                Animated.timing(rotation, {
                    toValue: -15,
                    duration: 750,
                    easing: Easing.sin,
                    useNativeDriver: true,
                }),
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 375,
                    easing: Easing.sin,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [-15, 0, 15],
        outputRange: ['-15deg', '0deg', '15deg'],
    });

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
                style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: size,
                    transform: [{ rotate: rotateInterpolate }],
                }}
            >
                <Svg height={size} width={size} viewBox="0 0 24 24">
                    <Circle cx="12" cy="19" r="2" fill={color} />
                    <Path
                        d="M12 2C10.3 2 9 3.3 9 5V6C9 6 6 8 6 13V17H4V19H20V17H18V13C18 8 15 6 15 6V5C15 3.3 13.7 2 12 2Z"
                        fill={color}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};
