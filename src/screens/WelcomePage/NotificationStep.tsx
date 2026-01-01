import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ThemedPrimaryButton } from '../../components/ThemedButton';
import { ZoomInView } from './animations';

interface NotificationStepProps {
    notificationsEnabled: boolean;
    onRequestNotifications: () => void;
}

export const NotificationStep: React.FC<NotificationStepProps> = ({
    notificationsEnabled,
    onRequestNotifications
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.page}>
            <View style={styles.centerContent}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                        <MaterialCommunityIcons
                            name="bell-badge-outline"
                            size={80}
                            color={colors.primary}
                        />
                    </View>
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Stay Updated</Text>
                <Text style={[styles.body, { color: colors.textSecondary }]}>
                    Get timely reminders for your free time sessions. We promise not to spam.
                </Text>
            </View>

            <View style={styles.actionContainer}>
                {notificationsEnabled ? (
                    <ZoomInView style={styles.permissionGranted}>
                        <MaterialCommunityIcons name="check-circle" size={60} color={colors.primary} />
                        <Text style={[styles.subtitle, { color: colors.primary }]}>All Set!</Text>
                    </ZoomInView>
                ) : (
                    <ThemedPrimaryButton
                        label="Enable Notifications"
                        icon={<MaterialCommunityIcons name="bell-ring" size={20} color="#fff" />}
                        onPress={onRequestNotifications}
                        size="large"
                        fullWidth
                        style={styles.button}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 24,
        paddingBottom: 48,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
    },
    button: {
        borderRadius: 16,
    },
    permissionGranted: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
