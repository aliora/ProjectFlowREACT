import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
// DateTimePicker not used in custom implementation
// Note: Requires @react-native-community/datetimepicker installed. 
// If not available, we use a custom fallback or just standard buttons.
// Assuming we need to install it: `npm install @react-native-community/datetimepicker`
// For this plan, I'll assume we might not have it and build a simple custom one or usage placeholder.

// Let's build a custom "Flip-like" picker or just a nice UI wrapper around keeping state.
// Since true "Flip" animation is complex to implement from scratch without a library like `react-native-wheel-pick`,
// we will implement a clean custom number selector.

interface Props {
    initialTime: { hour: number; minute: number };
    onTimeChanged: (time: { hour: number; minute: number }) => void;
    color?: string;
}

export const FlipTimePicker: React.FC<Props> = ({ initialTime, onTimeChanged, color = '#000' }) => {
    const [hours, setHours] = useState(initialTime.hour);
    const [minutes, setMinutes] = useState(initialTime.minute);

    const updateTime = (h: number, m: number) => {
        setHours(h);
        setMinutes(m);
        onTimeChanged({ hour: h, minute: m });
    };

    const incrementHour = () => updateTime((hours + 1) % 24, minutes);
    const decrementHour = () => updateTime((hours + 23) % 24, minutes);

    const incrementMinute = () => updateTime(hours, (minutes + 5) % 60); // 5 min steps
    const decrementMinute = () => updateTime(hours, (minutes + 55) % 60);

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <TouchableOpacity onPress={decrementHour} style={styles.btn}>
                    <Text style={[styles.btnText, { color }]}>▲</Text>
                </TouchableOpacity>
                <View style={styles.display}>
                    <Text style={[styles.timeText, { color }]}>{hours.toString().padStart(2, '0')}</Text>
                    <Text style={[styles.label, { color }]}>HOURS</Text>
                </View>
                <TouchableOpacity onPress={incrementHour} style={styles.btn}>
                    <Text style={[styles.btnText, { color }]}>▼</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.colon, { color }]}>:</Text>

            <View style={styles.column}>
                <TouchableOpacity onPress={decrementMinute} style={styles.btn}>
                    <Text style={[styles.btnText, { color }]}>▲</Text>
                </TouchableOpacity>
                <View style={styles.display}>
                    <Text style={[styles.timeText, { color }]}>{minutes.toString().padStart(2, '0')}</Text>
                    <Text style={[styles.label, { color }]}>MINUTES</Text>
                </View>
                <TouchableOpacity onPress={incrementMinute} style={styles.btn}>
                    <Text style={[styles.btnText, { color }]}>▼</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 20,
    },
    column: {
        alignItems: 'center',
    },
    display: {
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    timeText: {
        fontSize: 48,
        fontWeight: '300',
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        opacity: 0.6,
        marginTop: 5,
    },
    colon: {
        fontSize: 48,
        marginHorizontal: 10,
        marginTop: -20,
        opacity: 0.5,
    },
    btn: {
        padding: 10,
    },
    btnText: {
        fontSize: 20,
        opacity: 0.5,
    },
});
