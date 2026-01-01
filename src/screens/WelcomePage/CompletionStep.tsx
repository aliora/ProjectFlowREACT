import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useTheme } from '../../theme';
import { ThemedPrimaryButton } from '../../components/ThemedButton';
import { ZoomInView, FadeInDownView, FadeInView } from './animations';

interface CompletionStepProps {
    onFinish: () => void;
}

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

const SmokeAnimation: React.FC<{ size: number }> = ({ size }) => {
    const allFrames = [...smokeFrames.start, ...smokeFrames.loop];
    const frameOpacities = useRef(allFrames.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
    const frameIndexRef = useRef(0);
    const isLoopingRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const prevIndex = frameIndexRef.current;
            let nextIndex: number;

            if (!isLoopingRef.current) {
                if (frameIndexRef.current < smokeFrames.start.length - 1) {
                    nextIndex = frameIndexRef.current + 1;
                    frameIndexRef.current = nextIndex;
                } else {
                    isLoopingRef.current = true;
                    frameIndexRef.current = 4;
                    nextIndex = 4;
                }
            } else {
                nextIndex = 4 + ((frameIndexRef.current - 4 + 1) % smokeFrames.loop.length);
                frameIndexRef.current = nextIndex;
            }

            frameOpacities[prevIndex].setValue(0);
            frameOpacities[nextIndex].setValue(1);
        }, 100);

        return () => clearInterval(interval);
    }, [frameOpacities]);

    return (
        <View style={{
            width: size * 0.5,
            height: size * 0.5,
            position: 'absolute',
            top: size * 0.46,
        }}>
            {allFrames.map((frame, index) => (
                <Animated.Image
                    key={index}
                    source={frame}
                    style={{
                        width: size * 0.5,
                        height: size * 0.5,
                        position: 'absolute',
                        opacity: frameOpacities[index],
                    }}
                    resizeMode="contain"
                />
            ))}
        </View>
    );
};

const RocketWithSmoke: React.FC<{ size: number }> = ({ size }) => {
    const shakeX = useRef(new Animated.Value(0)).current;
    const shakeY = useRef(new Animated.Value(0)).current;
    const enlargedSize = size * 2.8;

    useEffect(() => {
        let shakeInterval: ReturnType<typeof setInterval> | undefined;

        const doShake = () => {
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
        };

        doShake();
        shakeInterval = setInterval(doShake, 250);

        return () => {
            if (shakeInterval) clearInterval(shakeInterval);
        };
    }, [shakeX, shakeY]);

    return (
        <Animated.View style={{ transform: [{ translateX: shakeX }, { translateY: shakeY }, { rotate: '45deg' }] }}>
            <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: enlargedSize, height: enlargedSize, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={rocketImage}
                        style={{ width: enlargedSize, height: enlargedSize }}
                        resizeMode="contain"
                    />
                    <SmokeAnimation size={enlargedSize} />
                </View>
            </View>
        </Animated.View>
    );
};

export const CompletionStep: React.FC<CompletionStepProps> = ({ onFinish }) => {
    const { colors, isDark } = useTheme();
    const shellBackground = isDark ? 'rgba(141, 110, 99, 0.15)' : 'rgba(93, 64, 55, 0.08)';

    return (
        <View style={styles.page}>
            <View style={styles.contentContainer}>
                <View style={styles.rocketLayer}>
                    <ZoomInView duration={800}>
                        <RocketWithSmoke size={96} />
                    </ZoomInView>
                </View>

                <View style={styles.textLayer}>
                    <FadeInDownView delay={600}>
                        <Text style={[styles.title, { color: colors.text, letterSpacing: 1.5 }]}>You're Ready to Start!</Text>
                        <Text style={[styles.body, { color: colors.textSecondary }]}>
                            Your workspace is ready. Let’s jump in and start building.
                        </Text>
                    </FadeInDownView>
                </View>

                <FadeInView delay={1600} style={styles.actionContainer}>
                    <View style={[styles.buttonShell, { backgroundColor: shellBackground }]}>
                        <ThemedPrimaryButton
                            label="Get Started Now"
                            onPress={onFinish}
                            size="large"
                            fullWidth
                            pressScale={0.96}
                            style={styles.actionBtn}
                        />
                    </View>
                </FadeInView>
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
    rocketLayer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        transform: [{ translateY: -56 }],
        zIndex: 2,
    },
    textLayer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
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
    actionContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 32,
    },
    buttonShell: {
        width: '100%',
        padding: 4,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    actionBtn: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
});
