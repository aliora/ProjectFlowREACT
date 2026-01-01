import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const onPageScroll = (e: any) => {
        const { position, offset } = e.nativeEvent;

        // Trigger EARLY animation
        // If we are on page 0 and scrolling to 1 (Time Selection), 
        // trigger as soon as we move 0.1% (offset > 0.001)
        if (position === 0 && offset > 0.001) {
            if (currentPage !== 1) setCurrentPage(1);
        }
        // If we are on page 2 and scrolling back to 1
        else if (position === 1 && offset < 0.999 && offset > 0) {
            if (currentPage !== 1) setCurrentPage(1);
        }
        // Fallback for standard page changes
        else {
            const page = Math.round(position + offset);
            if (page !== currentPage) {
                setCurrentPage(page);
            }
        }
    };

    const nextPage = () => {
        if (currentPage < 4) {
            const next = currentPage + 1;
            setCurrentPage(next); // Optimize: Update state immediately
            pagerRef.current?.setPage(next);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            const prev = currentPage - 1;
            setCurrentPage(prev); // Optimize: Update state immediately
            pagerRef.current?.setPage(prev);
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

    const handleFinish = () => {
        if (onFinish) {
            onFinish();
        } else {
            completeOnboarding();
        }
    };

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
                {/* Page 1: Intro */}
                <View key="1">
                    <IntroStep />
                </View>

                {/* Page 2: Time Selection */}
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

                {/* Page 3: Notifications */}
                <View key="3">
                    <NotificationStep
                        notificationsEnabled={notificationsEnabled}
                        onRequestNotifications={requestNotifications}
                    />
                </View>

                {/* Page 4: Auth */}
                <View key="4">
                    <AuthStep onSuccess={nextPage} />
                </View>

                {/* Page 5: Completion */}
                <View key="5">
                    <CompletionStep onFinish={handleFinish} />
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

// Re-export for backward compatibility
export { WelcomePage as OnboardingScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
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
});
