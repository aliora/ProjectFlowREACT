import React, { useRef, useState, useEffect } from 'react';
import { Alert, Linking, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../theme';
import { NotificationService } from '../../services/NotificationService';
import { AuthService } from '../../services/AuthService';

// Import step components
import { IntroStep } from './IntroStep';
import { TimeSelectionStep } from './TimeSelectionStep';
import { NotificationStep } from './NotificationStep';
import { AuthStep } from './AuthStep';
import { CompletionStep } from './CompletionStep';

interface Props {
    onFinish?: () => void;
}

const NavDot: React.FC<{
    isActive: boolean;
    onPress: () => void;
    colors: any;
}> = ({ isActive, onPress, colors }) => {
    const progress = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(isActive ? 1 : 0, { duration: 220 });
    }, [isActive]);

    const dotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 0.8 + progress.value * 0.6 }],
        opacity: 0.35 + progress.value * 0.65,
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [`${colors.textSecondary}55`, colors.primary]
        ),
    }));

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.dotWrapper}>
            <Animated.View style={[styles.dot, dotStyle]} />
        </TouchableOpacity>
    );
};

export const WelcomePage: React.FC<Props> = ({ onFinish }) => {
    const { colors } = useTheme();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Time Selection State
    const [startTime, setStartTime] = useState({ hour: 17, minute: 0 });
    const [endTime, setEndTime] = useState({ hour: 22, minute: 0 });
    const [isSelectingStart, setIsSelectingStart] = useState(true);

    // Notification State
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    // Animation values
    const navBarTranslateY = useSharedValue(100);
    const navBarOpacity = useSharedValue(0);

    useEffect(() => {
        loadSavedData();
        // Animate navbar entrance
        navBarTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        navBarOpacity.value = withTiming(1, { duration: 500 });
    }, []);

    const loadSavedData = async () => {
        try {
            const startH = await AsyncStorage.getItem('freeTimeStartHour');
            const startM = await AsyncStorage.getItem('freeTimeStartMinute');
            if (startH && startM) setStartTime({ hour: parseInt(startH), minute: parseInt(startM) });

            const endH = await AsyncStorage.getItem('freeTimeEndHour');
            const endM = await AsyncStorage.getItem('freeTimeEndMinute');
            if (endH && endM) setEndTime({ hour: parseInt(endH), minute: parseInt(endM) });
        } catch (e) { }
    };

    useEffect(() => {
        if (currentPage === 4) {
            // Completion Page - auto finish after delay
            const timer = setTimeout(() => {
                completeOnboarding();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentPage]);

    const onPageSelected = (e: any) => {
        const newPage = e.nativeEvent.position;
        if (newPage !== currentPage) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setCurrentPage(newPage);
    };

    const onPageScroll = (e: any) => {
        const { position, offset } = e.nativeEvent;

        if (position === 0 && offset > 0.001) {
            if (currentPage !== 1) setCurrentPage(1);
        }
        else if (position === 1 && offset < 0.999 && offset > 0) {
            if (currentPage !== 1) setCurrentPage(1);
        }
        else {
            const page = Math.round(position + offset);
            if (page !== currentPage) {
                setCurrentPage(page);
            }
        }
    };

    const goToPage = (page: number) => {
        if (page >= 0 && page <= 4 && page !== currentPage) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCurrentPage(page);
            pagerRef.current?.setPage(page);
        }
    };

    const nextPage = () => {
        if (currentPage < 4) {
            goToPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    };

    const requestNotifications = async () => {
        const { granted, canAskAgain } = await NotificationService.requestPermissions();
        if (granted) {
            setNotificationsEnabled(true);
            NotificationService.scheduleFreeTimeReminders();
            return;
        }

        Alert.alert(
            'Notifications Disabled',
            'Enable notifications to get project and team updates.',
            canAskAgain
                ? [{ text: 'OK' }]
                : [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ]
        );
    };

    const completeOnboarding = async () => {
        await AsyncStorage.setItem('seenOnboarding', 'true');
        await AsyncStorage.setItem('freeTimeStartHour', startTime.hour.toString());
        await AsyncStorage.setItem('freeTimeStartMinute', startTime.minute.toString());
        await AsyncStorage.setItem('freeTimeEndHour', endTime.hour.toString());
        await AsyncStorage.setItem('freeTimeEndMinute', endTime.minute.toString());

        const user = AuthService.getCurrentUser();
        if (user && onFinish) {
            onFinish();
        } else if (!user) {
            if (currentPage === 4) {
                if (onFinish) onFinish();
            }
        }
    };

    const handleFinish = () => {
        if (onFinish) {
            onFinish();
        } else {
            completeOnboarding();
        }
    };

    const navBarAnimStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: navBarTranslateY.value }],
        opacity: navBarOpacity.value,
    }));

    const isPrevDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= 4 || currentPage === 3;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
                scrollEnabled={true}
            >
                <View key="1">
                    <IntroStep />
                </View>

                <View key="2">
                    <TimeSelectionStep
                        startTime={startTime}
                        endTime={endTime}
                        isSelectingStart={isSelectingStart}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                        setIsSelectingStart={setIsSelectingStart}
                        isVisible={currentPage === 1}
                    />
                </View>

                <View key="3">
                    <NotificationStep
                        notificationsEnabled={notificationsEnabled}
                        onRequestNotifications={requestNotifications}
                    />
                </View>

                <View key="4">
                    <AuthStep onSuccess={nextPage} />
                </View>

                <View key="5">
                    <CompletionStep onFinish={handleFinish} />
                </View>
            </PagerView>

            {/* Minimal Dot Navigation */}
            <Animated.View style={[styles.navBarWrapper, navBarAnimStyle]}>
                <View style={styles.navBarInner}>
                    <TouchableOpacity
                        onPress={prevPage}
                        disabled={isPrevDisabled}
                        activeOpacity={0.8}
                        style={[
                            styles.navButtonBase,
                            styles.navButtonGhost,
                            { borderColor: colors.divider, opacity: isPrevDisabled ? 0.2 : 0.6 },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={22}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    <View style={styles.dotsRow}>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <NavDot
                                key={i}
                                isActive={currentPage === i}
                                onPress={() => goToPage(i)}
                                colors={colors}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={nextPage}
                        disabled={isNextDisabled}
                        activeOpacity={0.8}
                        style={[
                            styles.navButtonBase,
                            styles.navButtonPrimary,
                            {
                                backgroundColor: colors.primary,
                                opacity: isNextDisabled ? 0.35 : 1,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={22}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

// Re-export for backward compatibility
export { WelcomePage as OnboardingScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
    },
    navBarWrapper: {
        position: 'absolute',
        bottom: 18,
        left: 20,
        right: 20,
    },
    navBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    dotWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    navButtonBase: {
        width: 36,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButtonGhost: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    navButtonPrimary: {
        backgroundColor: '#000',
    },
});
