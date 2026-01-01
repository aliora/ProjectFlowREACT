import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimationProps {
    delay?: number;
    duration?: number;
    children: React.ReactNode;
    style?: ViewStyle;
}

// Custom FadeInDown animation component
export const FadeInDownView: React.FC<AnimationProps> = ({ delay = 0, children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true })
            ]).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
            {children}
        </Animated.View>
    );
};

// Custom ZoomIn animation component
export const ZoomInView: React.FC<AnimationProps> = ({ delay = 0, duration = 400, children, style }) => {
    const scale = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })
            ]).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[style, { opacity, transform: [{ scale }] }]}>
            {children}
        </Animated.View>
    );
};

// Custom FadeIn animation component
export const FadeInView: React.FC<AnimationProps> = ({ delay = 0, children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[style, { opacity }]}>
            {children}
        </Animated.View>
    );
};
