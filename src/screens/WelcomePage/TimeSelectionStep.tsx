import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { AnalogClockIcon } from '../../components/OnboardingIcons';
import WheelPicker from '../../components/WheelPicker';
import { RadioSwitch } from '../../components/RadioSwitch';

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
                <RadioSwitch
                    startTime={startTime}
                    endTime={endTime}
                    isSelectingStart={isSelectingStart}
                    onChange={setIsSelectingStart}
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

    // Picker Section
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        marginBottom: 24,
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
