import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ZoomInView, FadeInDownView, FadeInView } from './animations';

interface CompletionStepProps {
    onFinish: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ onFinish }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.page}>
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
                        onPress={onFinish}
                    >
                        <Text style={styles.actionBtnText}>Get Started Now</Text>
                    </TouchableOpacity>
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
});
