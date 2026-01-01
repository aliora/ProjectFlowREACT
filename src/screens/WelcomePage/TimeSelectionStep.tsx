import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';
import { AnalogClockIcon } from '../../components/OnboardingIcons';
import WheelPicker from '../../components/WheelPicker';

// Constants
const CLOCK_SIZE = 100;
const PICKER_WIDTH = 120;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

interface TimeSelectionStepProps {
    startTime: { hour: number; minute: number };
    endTime: { hour: number; minute: number };
    isSelectingStart: boolean;
    setStartTime: React.Dispatch<React.SetStateAction<{ hour: number; minute: number }>>;
    setEndTime: React.Dispatch<React.SetStateAction<{ hour: number; minute: number }>>;
    setIsSelectingStart: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
}

// Helper function to format time
const formatTime = (hour: number, minute: number): string =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

// Time Picker Column Component
interface TimePickerColumnProps {
    label: string;
    data: number[];
    selectedValue: number;
    onValueChange: (val: number) => void;
    labelColor: string;
    onScrollBegin?: () => void;
    onScrollEnd?: () => void;
}

const TimePickerColumn: React.FC<TimePickerColumnProps> = ({
    label,
    data,
    selectedValue,
    onValueChange,
    labelColor,
    onScrollBegin,
    onScrollEnd
}) => (
    <View style={styles.pickerColumn}>
        <Text style={[styles.pickerLabel, { color: labelColor }]}>{label}</Text>
        <WheelPicker
            data={data}
            selectedValue={selectedValue}
            onValueChange={(val) => {
                const numVal = typeof val === 'string' ? parseInt(val) : val;
                onValueChange(numVal);
            }}
            width={PICKER_WIDTH}
            onScrollBegin={onScrollBegin}
            onScrollEnd={onScrollEnd}
        />
    </View>
);

export const TimeSelectionStep: React.FC<TimeSelectionStepProps> = ({
    startTime,
    endTime,
    isSelectingStart,
    setStartTime,
    setEndTime,
    setIsSelectingStart,
    isVisible
}) => {
    const { colors, isDark } = useTheme();
    const [isSpinning, setIsSpinning] = useState(false);

    const currentTime = isSelectingStart ? startTime : endTime;
    const setCurrentTime = isSelectingStart ? setStartTime : setEndTime;

    const handleHourChange = (hour: number) => {
        setCurrentTime(prev => ({ ...prev, hour }));
    };

    const handleMinuteChange = (minute: number) => {
        setCurrentTime(prev => ({ ...prev, minute }));
    };

    const containerBackgroundColor = isDark ? 'rgba(141, 110, 99, 0.15)' : 'rgba(93, 64, 55, 0.08)';

    return (
        <View style={styles.container}>
            {/* Clock Icon */}
            <View style={styles.clockContainer}>
                <AnalogClockIcon
                    size={CLOCK_SIZE}
                    color={colors.primary}
                    isVisible={isVisible}
                    hour={currentTime.hour}
                    minute={currentTime.minute}
                    isSpinning={isSpinning}
                />
            </View>

            {/* Title & Description */}
            <Text style={[styles.title, { color: colors.text }]}>
                When are you free?
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
                Select your preferred hours for working on personal projects.
            </Text>

            {/* Animated Time Toggle Switch */}
            <View style={[styles.toggleContainer, { backgroundColor: containerBackgroundColor }]}>
                <ToggleSwitch
                    isSelectingStart={isSelectingStart}
                    setIsSelectingStart={setIsSelectingStart}
                    startTime={startTime}
                    endTime={endTime}
                    colors={colors}
                    isDark={isDark}
                />
            </View>

            {/* Time Picker */}
            <View style={styles.pickerRow}>
                <TimePickerColumn
                    label="HOUR"
                    data={HOURS}
                    selectedValue={currentTime.hour}
                    onValueChange={handleHourChange}
                    labelColor={colors.textSecondary}
                    onScrollBegin={() => setIsSpinning(true)}
                    onScrollEnd={() => setIsSpinning(false)}
                />
                <Text style={[styles.pickerSeparator, { color: colors.primary }]}>:</Text>
                <TimePickerColumn
                    label="MINUTE"
                    data={MINUTES}
                    selectedValue={currentTime.minute}
                    onValueChange={handleMinuteChange}
                    labelColor={colors.textSecondary}
                    onScrollBegin={() => setIsSpinning(true)}
                    onScrollEnd={() => setIsSpinning(false)}
                />
            </View>
        </View>
    );
};

// Modern Bouncy Toggle Switch Component
const ToggleSwitch = ({ isSelectingStart, setIsSelectingStart, startTime, endTime, colors, isDark }: any) => {
    const [containerWidth, setContainerWidth] = useState(0);

    // Animation values
    const slideAnim = React.useRef(new Animated.Value(isSelectingStart ? 0 : 1)).current;
    const startScale = React.useRef(new Animated.Value(isSelectingStart ? 1 : 0.95)).current;
    const endScale = React.useRef(new Animated.Value(isSelectingStart ? 0.95 : 1)).current;
    const startOpacity = React.useRef(new Animated.Value(isSelectingStart ? 1 : 0.6)).current;
    const endOpacity = React.useRef(new Animated.Value(isSelectingStart ? 0.6 : 1)).current;

    React.useEffect(() => {
        // Bouncy spring for slider
        Animated.spring(slideAnim, {
            toValue: isSelectingStart ? 0 : 1,
            friction: 6, // Lower = more bouncy
            tension: 80, // Higher = faster
            useNativeDriver: true,
        }).start();

        // Scale animation for active/inactive states
        Animated.parallel([
            Animated.spring(startScale, {
                toValue: isSelectingStart ? 1 : 0.92,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.spring(endScale, {
                toValue: isSelectingStart ? 0.92 : 1,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(startOpacity, {
                toValue: isSelectingStart ? 1 : 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(endOpacity, {
                toValue: isSelectingStart ? 0.5 : 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isSelectingStart]);

    // Colors
    const sliderColor = isDark
        ? colors.primary
        : colors.primary;
    const sliderShadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)';

    const sliderWidth = containerWidth > 0 ? (containerWidth / 2) - 6 : 0;
    const sliderTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [3, containerWidth / 2 + 3]
    });

    return (
        <View
            style={toggleStyles.container}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {/* Animated Pill Slider */}
            <Animated.View
                style={[
                    toggleStyles.slider,
                    {
                        width: sliderWidth,
                        backgroundColor: sliderColor,
                        shadowColor: sliderShadowColor,
                        transform: [
                            { translateX: sliderTranslateX },
                            {
                                scale: slideAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [1, 0.98, 1] // Slight squeeze in middle
                                })
                            }
                        ],
                    }
                ]}
            />

            {/* Start Time Button */}
            <TouchableOpacity
                style={toggleStyles.button}
                onPress={() => setIsSelectingStart(true)}
                activeOpacity={0.8}
            >
                <Animated.View style={[
                    toggleStyles.buttonContent,
                    {
                        transform: [{ scale: startScale }],
                        opacity: startOpacity
                    }
                ]}>
                    <Text style={[
                        toggleStyles.label,
                        { color: isSelectingStart ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                        START
                    </Text>
                    <Text style={[
                        toggleStyles.time,
                        { color: isSelectingStart ? '#FFFFFF' : colors.text }
                    ]}>
                        {formatTime(startTime.hour, startTime.minute)}
                    </Text>
                </Animated.View>
            </TouchableOpacity>

            {/* End Time Button */}
            <TouchableOpacity
                style={toggleStyles.button}
                onPress={() => setIsSelectingStart(false)}
                activeOpacity={0.8}
            >
                <Animated.View style={[
                    toggleStyles.buttonContent,
                    {
                        transform: [{ scale: endScale }],
                        opacity: endOpacity
                    }
                ]}>
                    <Text style={[
                        toggleStyles.label,
                        { color: !isSelectingStart ? '#FFFFFF' : colors.textSecondary }
                    ]}>
                        END
                    </Text>
                    <Text style={[
                        toggleStyles.time,
                        { color: !isSelectingStart ? '#FFFFFF' : colors.text }
                    ]}>
                        {formatTime(endTime.hour, endTime.minute)}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

// Dedicated styles for the modern toggle
const toggleStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
        height: '100%',
    },
    slider: {
        position: 'absolute',
        top: 3,
        bottom: 3,
        borderRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 6,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    buttonContent: {
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    time: {
        fontSize: 20,
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
});

const styles = StyleSheet.create({
    // Main Container
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20, // Reduced from 40 for better balance
    },

    // Clock Section
    clockContainer: {
        height: 120, // Slightly increased to give breathing room
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },

    // Text Section
    title: {
        fontSize: 24, // Increased slightly
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
        marginBottom: 30, // Increased separation from toggle
    },

    // Toggle Container
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16, // More rounded
        padding: 4,
        height: 56, // Fixed height for consistency
        width: '100%', // Ensure full width usage
        marginBottom: 20,
    },
    toggleSpacer: {
        width: 0, // Not needed with absolute layout but good for safety
    },

    // Toggle Button
    timeToggleBtn: {
        flex: 1, // Distribute space evenly
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    timeToggleBtnActive: {
        // Handled by absolute view
    },
    toggleLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeDisplay: {
        fontSize: 18,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'], // Prevent jumping numbers
    },

    // Picker Section
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto', // Push to bottom but...
        marginBottom: 40, // consistent bottom spacing
        gap: 20, // Modern ease for spacing columns
    },
    pickerColumn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerLabel: {
        position: 'absolute',
        top: -30, // Moved up slightly
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        zIndex: 10,
    },
    pickerSeparator: {
        fontSize: 32,
        fontWeight: '600',
        marginTop: 8, // Optical correction for vertical alignment with numbers
    },
});
