import React, { useRef, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Animated
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../context/ThemeContext';
import { RocketCinematic } from '../components/RocketCinematic';
import { AnalogClockIcon, PendulumBellIcon } from '../components/OnboardingIcons';
import { FlipTimePicker } from '../components/FlipTimePicker';
import { LoginScreen } from './LoginScreen';
import { NotificationService } from '../services/NotificationService';
import { AuthService } from '../services/AuthService';

const { width } = Dimensions.get('window');

interface Props {
    onFinish?: () => void;
}

// Custom FadeInDown animation component
const FadeInDownView: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({ delay = 0, children, style }) => {
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
const ZoomInView: React.FC<{ delay?: number; duration?: number; children: React.ReactNode; style?: any }> = ({ delay = 0, duration = 400, children, style }) => {
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
const FadeInView: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({ delay = 0, children, style }) => {
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

export const OnboardingScreen: React.FC<Props> = ({ onFinish }) => {
    const { colors, isDark } = useTheme();
    const pagerRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);

    // Time Selection State
    const [startTime, setStartTime] = useState({ hour: 17, minute: 0 });
    const [endTime, setEndTime] = useState({ hour: 22, minute: 0 });
    const [isSelectingStart, setIsSelectingStart] = useState(true);

    // Notification State
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        loadSavedData();
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
        setCurrentPage(e.nativeEvent.position);
    };

    const nextPage = () => {
        if (currentPage < 4) {
            pagerRef.current?.setPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            pagerRef.current?.setPage(currentPage - 1);
        }
    };

    const requestNotifications = async () => {
        const granted = await NotificationService.requestPermissions();
        if (granted) {
            setNotificationsEnabled(true);
            NotificationService.scheduleFreeTimeReminders();
        }
    };

    const completeOnboarding = async () => {
        await AsyncStorage.setItem('seenOnboarding', 'true');
        await AsyncStorage.setItem('freeTimeStartHour', startTime.hour.toString());
        await AsyncStorage.setItem('freeTimeStartMinute', startTime.minute.toString());
        await AsyncStorage.setItem('freeTimeEndHour', endTime.hour.toString());
        await AsyncStorage.setItem('freeTimeEndMinute', endTime.minute.toString());

        // Check if user is logged in
        const user = AuthService.getCurrentUser();
        if (user && onFinish) {
            onFinish();
        } else if (!user) {
            if (currentPage === 4) {
                if (onFinish) onFinish();
            }
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={onPageSelected}
                scrollEnabled={false}
            >
                {/* Page 1: Intro */}
                <View key="1" style={styles.page}>
                    <View style={styles.contentContainer}>
                        <RocketCinematic size={120} color={colors.primary} />
                        <FadeInDownView delay={500} style={styles.textBlock}>
                            <Text style={[styles.title, { color: colors.text }]}>Welcome to ProjectFlow</Text>
                            <Text style={[styles.body, { color: colors.textSecondary }]}>
                                Your personal productivity companion. Let's get you set up for success.
                            </Text>
                        </FadeInDownView>
                    </View>
                </View>

                {/* Page 2: Time Selection */}
                <View key="2" style={styles.page}>
                    <View style={styles.contentContainer}>
                        <View style={{ height: 120, justifyContent: 'center' }}>
                            {currentPage === 1 && <AnalogClockIcon size={100} color={colors.primary} />}
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>When are you free?</Text>
                        <Text style={[styles.body, { color: colors.textSecondary }]}>
                            Select your preferred hours for working on personal projects.
                        </Text>

                        <View style={styles.timeToggleContainer}>
                            <TouchableOpacity onPress={() => setIsSelectingStart(true)} style={styles.timeToggleBtn}>
                                <Text style={[styles.smallLabel, isSelectingStart && { color: colors.primary, fontWeight: 'bold' }]}>Start Time</Text>
                                <Text style={[styles.timeDisplay, { color: colors.text }]}>
                                    {startTime.hour.toString().padStart(2, '0')}:{startTime.minute.toString().padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ width: 20 }} />
                            <TouchableOpacity onPress={() => setIsSelectingStart(false)} style={styles.timeToggleBtn}>
                                <Text style={[styles.smallLabel, !isSelectingStart && { color: colors.primary, fontWeight: 'bold' }]}>End Time</Text>
                                <Text style={[styles.timeDisplay, { color: colors.text }]}>
                                    {endTime.hour.toString().padStart(2, '0')}:{endTime.minute.toString().padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <FlipTimePicker
                            initialTime={isSelectingStart ? startTime : endTime}
                            color={colors.text}
                            onTimeChanged={(t) => {
                                if (isSelectingStart) setStartTime(t);
                                else setEndTime(t);
                            }}
                        />
                    </View>
                </View>

                {/* Page 3: Notifications */}
                <View key="3" style={styles.page}>
                    <View style={styles.contentContainer}>
                        <View style={{ height: 150, justifyContent: 'center' }}>
                            <PendulumBellIcon size={120} color={colors.primary} />
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>Stay on Track</Text>
                        <Text style={[styles.body, { color: colors.textSecondary }]}>
                            Enable notifications to receive reminders during your free time.
                        </Text>

                        <View style={{ marginTop: 40 }}>
                            {notificationsEnabled ? (
                                <ZoomInView style={styles.permissionGranted}>
                                    <MaterialCommunityIcons name="check-circle" size={80} color={colors.primary} />
                                    <Text style={[styles.subtitle, { color: colors.primary }]}>Permission Granted!</Text>
                                </ZoomInView>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                                    onPress={requestNotifications}
                                >
                                    <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" />
                                    <Text style={styles.actionBtnText}>Enable Notifications</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Page 4: Auth */}
                <View key="4" style={styles.page}>
                    <View style={[styles.contentContainer, { justifyContent: 'center' }]}>
                        <LoginScreen onSuccess={nextPage} />
                    </View>
                </View>

                {/* Page 5: Completion */}
                <View key="5" style={styles.page}>
                    <View style={styles.contentContainer}>
                        <ZoomInView duration={800}>
                            <MaterialCommunityIcons name="check-circle-outline" size={120} color="#4CAF50" />
                        </ZoomInView>

                        <FadeInDownView delay={600}>
                            <Text style={[styles.title, { color: colors.text }]}>You're all set!</Text>
                            <Text style={[styles.body, { color: colors.textSecondary }]}>
                                Redirecting you to the dashboard...
                            </Text>
                        </FadeInDownView>

                        <FadeInView delay={2000} style={{ marginTop: 40 }}>
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                                onPress={onFinish || completeOnboarding}
                            >
                                <Text style={styles.actionBtnText}>Get Started Now</Text>
                            </TouchableOpacity>
                        </FadeInView>
                    </View>
                </View>

            </PagerView>

            {/* Navigation Controls */}
            <View style={styles.footer}>
                {currentPage > 0 && (
                    <TouchableOpacity onPress={prevPage} style={styles.navBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.secondary} />
                    </TouchableOpacity>
                )}

                <View style={styles.dots}>
                    {[0, 1, 2, 3, 4].map(i => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: i === currentPage ? colors.primary : colors.divider,
                                    width: i === currentPage ? 24 : 8
                                }
                            ]}
                        />
                    ))}
                </View>

                {currentPage < 4 && currentPage !== 3 && (
                    <TouchableOpacity onPress={nextPage} style={styles.navBtn}>
                        <MaterialCommunityIcons name="arrow-right" size={24} color={colors.primary} />
                    </TouchableOpacity>
                )}
                {/* Placeholder for spacing when button hidden */}
                {(currentPage === 4 || currentPage === 3) && <View style={{ width: 40 }} />}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
    },
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    navBtn: {
        padding: 10,
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    timeToggleContainer: {
        flexDirection: 'row',
        marginVertical: 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 10,
        borderRadius: 16,
    },
    timeToggleBtn: {
        alignItems: 'center',
    },
    smallLabel: {
        fontSize: 12,
        marginBottom: 4,
        color: '#888',
    },
    timeDisplay: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 16,
        elevation: 4,
        marginTop: 20,
    },
    actionBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    permissionGranted: {
        alignItems: 'center',
    }
});
