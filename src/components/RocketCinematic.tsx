import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface RocketCinematicProps {
    size?: number;
    color?: string;
}

export const RocketCinematic: React.FC<RocketCinematicProps> = ({
    size = 100,
    color = '#5D4037'
}) => {
    // Animation Values
    const launchProgress = useRef(new Animated.Value(0)).current;
    const flybyOpacity = useRef(new Animated.Value(0)).current;
    const flybyProgress = useRef(new Animated.Value(0)).current;
    const handScale = useRef(new Animated.Value(0)).current;
    const launchOpacity = useRef(new Animated.Value(1)).current;

    const offScreenX = width * 0.7 + size;
    const offScreenY = height * 0.7 + size;

    useEffect(() => {
        // Phase 1: Launch (delay 400ms, duration 1400ms)
        const launchAnimation = Animated.sequence([
            Animated.delay(400),
            Animated.parallel([
                Animated.timing(launchProgress, {
                    toValue: 1,
                    duration: 1400,
                    easing: Easing.in(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(1300),
                    Animated.timing(launchOpacity, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]);

        // Phase 2: Flyby (delay 3780ms from start, duration 1470ms)
        const flybyAnimation = Animated.sequence([
            Animated.delay(3780),
            Animated.parallel([
                Animated.timing(flybyOpacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(flybyProgress, {
                    toValue: 1,
                    duration: 1470,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(flybyOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]);

        // Phase 3: Arrival (delay 5600ms from start, duration 1000ms)
        const arrivalAnimation = Animated.sequence([
            Animated.delay(5600),
            Animated.spring(handScale, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]);

        // Start all animations
        launchAnimation.start();
        flybyAnimation.start();
        arrivalAnimation.start();
    }, []);

    // Launch interpolations
    const launchTranslateX = launchProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, offScreenX],
    });

    const launchTranslateY = launchProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -offScreenY],
    });

    // Flyby interpolations
    const flybyTranslateX = flybyProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [offScreenX, -offScreenX],
    });

    const flybyTranslateY = flybyProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-offScreenY, offScreenY],
    });

    return (
        <View style={[styles.container, { width: size * 3, height: size * 3 }]}>
            {/* Launch Rocket */}
            <Animated.View
                style={[
                    styles.rocketContainer,
                    {
                        opacity: launchOpacity,
                        transform: [
                            { translateX: launchTranslateX },
                            { translateY: launchTranslateY },
                            { rotate: '45deg' },
                        ],
                    },
                ]}
            >
                <RocketImage size={size} />
            </Animated.View>

            {/* Flyby Rocket */}
            <Animated.View
                style={[
                    styles.rocketContainer,
                    {
                        opacity: flybyOpacity,
                        transform: [
                            { translateX: flybyTranslateX },
                            { translateY: flybyTranslateY },
                            { scale: 3 },
                            { rotate: '225deg' },
                        ],
                    },
                ]}
            >
                <RocketImage size={size} />
            </Animated.View>

            {/* Hand Icon */}
            <Animated.View
                style={[
                    styles.center,
                    {
                        opacity: handScale,
                        transform: [{ scale: handScale }],
                    },
                ]}
            >
                <MaterialCommunityIcons name="hand-wave" size={size} color={color} />
            </Animated.View>
        </View>
    );
};

const RocketImage = ({ size }: { size: number }) => (
    <MaterialCommunityIcons name="rocket" size={size} color="#5D4037" />
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    center: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocketContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
