import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, Image } from 'react-native';
import { useTheme } from '../../theme';
import { WavingHandIcon } from '../../components/Icons';
import { FadeInDownView } from './animations';

const rocketImage = require('../../../assets/animations/rocket.png');
const smokeFrames = {
    start: [
        require('../../../assets/animations/smoke/1.png'),
        require('../../../assets/animations/smoke/2.png'),
        require('../../../assets/animations/smoke/3.png'),
        require('../../../assets/animations/smoke/4.png'),
    ],
    loop: [
        require('../../../assets/animations/smoke/loop1.png'),
        require('../../../assets/animations/smoke/loop2.png'),
        require('../../../assets/animations/smoke/loop3.png'),
        require('../../../assets/animations/smoke/loop4.png'),
    ],
};

/**
 * CinematicIntroAnimation
 * Migrated from Flutter's rocket_cinematic.dart
 * Using standard React Native Animated API for Expo Go compatibility
 *
 * A three-phase rocket animation:
 * 1. Launch (easeInExpo) - Rocket takes off with shake and smoke
 * 2. Flyby (linear) - Rocket flies across screen at 3x scale
 * 3. Arrival (elasticOut) - Waving hand appears
 */

interface CinematicIntroAnimationProps {
    /** Size of the rocket/icon */
    size?: number;
    /** Color for the waving hand */
    color?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

/**
 * Animation timing configuration (matching Flutter)
 * Total duration: 7000ms
 */
const TOTAL_DURATION = 6000;

// Phase intervals (as fractions of total duration)
const PHASES = {
    START_DELAY: 400,
    LAUNCH_START: 0.12,
    LAUNCH_END: 0.32,
    FLYBY_START: 0.54,
    FLYBY_END: 0.75,
    ARRIVAL_START: 0.80,
    ARRIVAL_END: 1.0,
};

/**
 * Smoke Animation Component
 */
const SmokeAnimation: React.FC<{ size: number }> = ({ size }) => {
    const [currentFrame, setCurrentFrame] = React.useState(0);
    const [isLooping, setIsLooping] = React.useState(false);

    useEffect(() => {
        let frameIndex = 0;
        let loopIndex = 0;

        const interval = setInterval(() => {
            if (!isLooping) {
                if (frameIndex < smokeFrames.start.length) {
                    setCurrentFrame(frameIndex);
                    frameIndex++;
                } else {
                    setIsLooping(true);
                    // Start loop immediately
                    setCurrentFrame(0);
                }
            } else {
                setCurrentFrame(loopIndex);
                loopIndex = (loopIndex + 1) % smokeFrames.loop.length;
            }
        }, 100); // 100ms per frame

        return () => clearInterval(interval);
    }, [isLooping]);

    const imageSource = isLooping
        ? smokeFrames.loop[currentFrame]
        : smokeFrames.start[currentFrame];

    // Don't render if we are past the start frames but the loop logic hasn't picked up yet (though logic handles this)
    if (!imageSource) return null;

    return (
        <Image
            source={imageSource}
            style={{
                width: size * 0.5, // Explicit width (replaces scale 0.8)
                height: size * 0.5, // Explicit height
                position: 'absolute',
                top: size * 0.46, // Moved closer (was 0.5)
            }}
            resizeMode="contain"
        />
    );
};

/**
 * Rocket with smoke effect
 */
const RocketWithSmoke: React.FC<{ size: number }> = ({ size }) => {
    const enlargedSize = size * 2.2; // Increase visual size without affecting layout container

    return (
        <View style={[localStyles.rocket, { width: size, height: size }]}>
            <View style={{ width: enlargedSize, height: enlargedSize, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={rocketImage}
                    style={{ width: enlargedSize, height: enlargedSize }}
                    resizeMode="contain"
                />
                <SmokeAnimation size={enlargedSize} />
            </View>
        </View>
    );
};

const CinematicIntroAnimation: React.FC<CinematicIntroAnimationProps> = ({
    size = 100,
    color,
    onComplete,
}) => {
    const { colors } = useTheme();
    const iconColor = color || colors.primary;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // Calculate off-screen positions
    const offScreenX = screenWidth * 0.7 + size;
    const offScreenY = screenHeight * 0.7 + size;

    // Animation progress (0 to 1)
    const progress = useRef(new Animated.Value(0)).current;

    // Shake effect values
    const shakeX = useRef(new Animated.Value(0)).current;
    const shakeY = useRef(new Animated.Value(0)).current;

    // Phase visibility states (derived from progress)
    const launchOpacity = progress.interpolate({
        inputRange: [0, PHASES.LAUNCH_END, PHASES.LAUNCH_END + 0.01],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp',
    });

    const launchTranslateX = progress.interpolate({
        inputRange: [PHASES.LAUNCH_START, PHASES.LAUNCH_END],
        outputRange: [0, offScreenX],
        extrapolate: 'clamp',
    });

    const launchTranslateY = progress.interpolate({
        inputRange: [PHASES.LAUNCH_START, PHASES.LAUNCH_END],
        outputRange: [0, -offScreenY],
        extrapolate: 'clamp',
    });

    const flybyOpacity = progress.interpolate({
        inputRange: [PHASES.FLYBY_START - 0.01, PHASES.FLYBY_START, PHASES.FLYBY_END, PHASES.FLYBY_END + 0.01],
        outputRange: [0, 1, 1, 0],
        extrapolate: 'clamp',
    });

    const flybyTranslateX = progress.interpolate({
        inputRange: [PHASES.FLYBY_START, PHASES.FLYBY_END],
        outputRange: [offScreenX, -offScreenX],
        extrapolate: 'clamp',
    });

    const flybyTranslateY = progress.interpolate({
        inputRange: [PHASES.FLYBY_START, PHASES.FLYBY_END],
        outputRange: [-offScreenY, offScreenY],
        extrapolate: 'clamp',
    });

    const arrivalOpacity = progress.interpolate({
        inputRange: [PHASES.ARRIVAL_START - 0.01, PHASES.ARRIVAL_START],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const arrivalScale = progress.interpolate({
        inputRange: [PHASES.ARRIVAL_START, PHASES.ARRIVAL_END],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Rotation for launch (pointing towards top-right)
    const launchRotation = Math.atan2(-offScreenY, offScreenX) + Math.PI / 2;
    const launchRotationDeg = `${(launchRotation * 180) / Math.PI}deg`;

    // Rotation for flyby (pointing towards bottom-left)
    const flybyRotation = Math.atan2(offScreenY * 2, -offScreenX * 2) + Math.PI / 2;
    const flybyRotationDeg = `${(flybyRotation * 180) / Math.PI}deg`;

    useEffect(() => {
        let shakeInterval: NodeJS.Timeout;

        const timeout = setTimeout(() => {
            // Main animation
            Animated.timing(progress, {
                toValue: 1,
                duration: TOTAL_DURATION,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished && onComplete) {
                    onComplete();
                }
            });

            // Pre-launch shake effect
            const shakeDuration = TOTAL_DURATION * 0.15;
            let shakeCount = 0;
            const maxShakes = Math.floor(shakeDuration / 250);

            const doShake = () => {
                if (shakeCount < maxShakes) {
                    Animated.sequence([
                        Animated.timing(shakeX, { toValue: (Math.random() - 0.5) * 3, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeX, { toValue: (Math.random() - 0.5) * 3, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeX, { toValue: 0, duration: 50, useNativeDriver: true }),
                    ]).start();
                    Animated.sequence([
                        Animated.timing(shakeY, { toValue: (Math.random() - 0.5) * 3, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeY, { toValue: (Math.random() - 0.5) * 3, duration: 50, useNativeDriver: true }),
                        Animated.timing(shakeY, { toValue: 0, duration: 50, useNativeDriver: true }),
                    ]).start();
                    shakeCount++;
                }
            };

            shakeInterval = setInterval(doShake, 250);
            setTimeout(() => clearInterval(shakeInterval), shakeDuration);

        }, PHASES.START_DELAY);

        return () => {
            clearTimeout(timeout);
            if (shakeInterval) clearInterval(shakeInterval);
        };
    }, []);

    return (
        <View style={[localStyles.container, { width: size * 3, height: size * 3 }]}>
            {/* Phase 1: Launch Scene */}
            <Animated.View
                style={[
                    localStyles.rocketContainer,
                    {
                        opacity: launchOpacity,
                        transform: [
                            { translateX: Animated.add(launchTranslateX, shakeX) },
                            { translateY: Animated.add(launchTranslateY, shakeY) },
                            { rotate: launchRotationDeg },
                        ],
                    },
                ]}
            >
                <RocketWithSmoke size={size} />
            </Animated.View>

            {/* Phase 2: Flyby Scene */}
            <Animated.View
                style={[
                    localStyles.rocketContainer,
                    {
                        opacity: flybyOpacity,
                        transform: [
                            { translateX: flybyTranslateX },
                            { translateY: flybyTranslateY },
                            { scale: 3.0 },
                            { rotate: flybyRotationDeg },
                        ],
                    },
                ]}
            >
                <RocketWithSmoke size={size} />
            </Animated.View>

            {/* Phase 3: Arrival Scene (Waving Hand) */}
            <Animated.View
                style={[
                    localStyles.handContainer,
                    {
                        opacity: arrivalOpacity,
                        transform: [{ scale: arrivalScale }],
                    },
                ]}
            >
                <Image
                    source={rocketImage}
                    style={{ width: size * 3.2, height: size * 3.2, transform: [{ rotate: '45deg' }] }}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    rocketContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocket: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rocketEmoji: {
        textAlign: 'center',
    },
    handContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const IntroStep: React.FC = () => {
    const { colors } = useTheme();

    return (
        <View style={styles.page}>
            <View style={styles.contentContainer}>
                <CinematicIntroAnimation size={150} color={colors.primary} />
                <FadeInDownView delay={500} style={styles.textBlock}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome to ProjectFlow</Text>
                    <Text style={[styles.body, { color: colors.textSecondary }]}>
                        Your personal productivity companion. Let's get you set up for success.
                    </Text>
                </FadeInDownView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: {
        alignItems: 'center',
        marginTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
});
