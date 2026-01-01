import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Line, Path, Text } from 'react-native-svg';

interface Props {
    size?: number;
    color: string;
    isVisible?: boolean;
    hour: number;
    minute: number;
    isSpinning?: boolean;
}

export const AnalogClockIcon: React.FC<Props> = ({
    size = 100,
    color,
    isVisible = true,
    hour,
    minute,
    isSpinning = false
}) => {
    // Animation values for clock hands
    const hourRotation = useRef(new Animated.Value(0)).current;
    const minuteRotation = useRef(new Animated.Value(0)).current;

    // Track current rotation values to ensure always clockwise movement
    const currentHourDeg = useRef(0);
    const currentMinuteDeg = useRef(0);

    // Continuous spin animation reference
    const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

    // Listener to keep track of current animated value
    useEffect(() => {
        const hId = hourRotation.addListener(({ value }) => { currentHourDeg.current = value; });
        const mId = minuteRotation.addListener(({ value }) => { currentMinuteDeg.current = value; });
        return () => {
            hourRotation.removeListener(hId);
            minuteRotation.removeListener(mId);
        };
    }, []);

    // Handle spinning state (User interacting with picker)
    useEffect(() => {
        if (!isVisible) return;

        if (isSpinning) {
            // Start continuous spinning
            // We use a large duration and value to simulate continuous spin
            // When interaction stops, we'll stop this and animate to target
            spinLoop.current = Animated.parallel([
                Animated.loop(
                    Animated.timing(hourRotation, {
                        toValue: currentHourDeg.current + 360,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ),
                Animated.loop(
                    Animated.timing(minuteRotation, {
                        toValue: currentMinuteDeg.current + 360,
                        duration: 300, // Minutes spin faster
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                )
            ]);
            spinLoop.current.start();
        } else {
            // Stop spinning and snap to target time
            spinLoop.current?.stop();
            spinLoop.current = null;

            // Calculate target angles
            // Hour hand: 30° per hour + 0.5° per minute
            const hourTargetBase = ((hour % 12) * 30) + (minute * 0.5);
            // Minute hand: 6° per minute
            const minuteTargetBase = minute * 6;

            // Calculate NEXT clockwise angle
            // Formula: current + ( (target - current % 360 + 360) % 360 )
            // But since we want to handle large accumulated values, we normalize slightly differently to ensure forward movement

            // For Hour:
            const currentH = currentHourDeg.current;
            const diffH = (hourTargetBase - (currentH % 360) + 360) % 360;
            // Ensure we move at least a bit, or stay if exactly same. 
            // If diff is 0, we are there. If we want "always move forward even if 360", we'd add +360.
            // Let's settle for simple shortest clockwise path from current modulo position.
            const nextHourDeg = currentH + diffH;

            // For Minute:
            const currentM = currentMinuteDeg.current;
            const diffM = (minuteTargetBase - (currentM % 360) + 360) % 360;
            const nextMinuteDeg = currentM + diffM;

            // Animate to target
            Animated.parallel([
                Animated.timing(hourRotation, {
                    toValue: nextHourDeg,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(minuteRotation, {
                    toValue: nextMinuteDeg,
                    duration: 1000,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isSpinning, hour, minute, isVisible]);

    // Initial setup (Direct set without animation on mount/visible)
    useEffect(() => {
        if (!isVisible && !isSpinning) {
            // Reset or maintain? maintaining is better for persistence feel
            return;
        }
        // If mounting and not spinning, set initial position instantly
        if (isVisible && !isSpinning && currentHourDeg.current === 0) {
            const h = ((hour % 12) * 30) + (minute * 0.5);
            const m = minute * 6;
            hourRotation.setValue(h);
            minuteRotation.setValue(m);
            currentHourDeg.current = h;
            currentMinuteDeg.current = m;
        }
    }, [isVisible]);

    // Interpolate rotations to string degrees
    const rotateHourStr = hourRotation.interpolate({
        inputRange: [-3600, 3600],
        outputRange: ['-3600deg', '3600deg']
    });

    const rotateMinuteStr = minuteRotation.interpolate({
        inputRange: [-3600, 3600],
        outputRange: ['-3600deg', '3600deg']
    });

    // Clock Face Numbers
    const clockNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // Radius for numbers placement (slightly less than half size)
    const numberRadius = size / 2 - 14;

    const renderNumbers = () => {
        return clockNumbers.map((num, i) => { // Fixed index usage
            // Angle for number: -90 offset because 0 rad is at 3 o'clock
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = (size / 2) + numberRadius * Math.cos(angle);
            const y = (size / 2) + numberRadius * Math.sin(angle);

            // Adjust text anchor position to center it
            // Simple approximation or we could use textAnchor="middle" in Svg Text if available, 
            // but react-native-svg Text is robust.

            return (
                <Text
                    key={num}
                    x={x}
                    y={y + 4} // slight vertical adjustment
                    fill={color}
                    fontSize={size * 0.12}
                    fontWeight="bold"
                    textAnchor="middle"
                    opacity={0.8}
                >
                    {num}
                </Text>
            );
        });
    };

    return (
        <Animated.View style={{ width: size, height: size }}>
            <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Outer Ring */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size / 2 - 2}
                    stroke={color}
                    strokeWidth="2.5"
                    fill="transparent"
                    opacity={0.5}
                />

                {/* Minute Ticks */}
                {Array.from({ length: 60 }).map((_, i) => {
                    const isHour = i % 5 === 0;
                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const outerR = size / 2 - 5;
                    const innerR = isHour ? outerR - 6 : outerR - 3;
                    const x1 = (size / 2) + outerR * Math.cos(angle);
                    const y1 = (size / 2) + outerR * Math.sin(angle);
                    const x2 = (size / 2) + innerR * Math.cos(angle);
                    const y2 = (size / 2) + innerR * Math.sin(angle);

                    if (isHour) return null; // Skip hours as we have numbers/larger ticks if we wanted

                    return (
                        <Line
                            key={i}
                            x1={x1} y1={y1}
                            x2={x2} y2={y2}
                            stroke={color}
                            strokeWidth={1}
                            opacity={0.4}
                        />
                    );
                })}

                {/* Numbers */}
                {renderNumbers()}

                {/* Center Dot */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size * 0.04}
                    fill={color}
                />
            </Svg>

            {/* Hands Container - We use Absolute Animated Views for smoother rotation transforms than native SVG props sometimes */}

            {/* Hour Hand */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ rotate: rotateHourStr }],
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                ]}
            >
                {/* Offset logic: The hand should point UP (0deg). pivot is center of view. */}
                <View
                    style={{
                        position: 'absolute',
                        top: size / 2 - (size * 0.25), // Length of hand upwards
                        height: size * 0.25 + (size * 0.05), // Hand length + slight overhang
                        width: 4,
                        backgroundColor: color,
                        borderRadius: 2,
                        transform: [{ translateY: size * 0.025 }] // Shift pivot to "center" of logic
                    }}
                />
            </Animated.View>

            {/* Minute Hand */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ rotate: rotateMinuteStr }],
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                ]}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: size / 2 - (size * 0.35),
                        height: size * 0.35 + (size * 0.08),
                        width: 2.5,
                        backgroundColor: color,
                        borderRadius: 1.5,
                        transform: [{ translateY: size * 0.04 }]
                    }}
                />
            </Animated.View>

            {/* Center Cap for Hands */}
            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={{
                    width: size * 0.05,
                    height: size * 0.05,
                    borderRadius: size,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor: 'white' // Or background color if we knew it
                }} />
            </View>
        </Animated.View>
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
