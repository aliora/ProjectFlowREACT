import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ThemedPrimaryButton } from '../../components/ThemedButton';
import { ConfirmedAnimation } from '../../components/ConfirmedAnimation';
import { ZoomInView } from './animations';

interface NotificationStepProps {
    notificationsEnabled: boolean;
    onRequestNotifications: () => void;
}

export const NotificationStep: React.FC<NotificationStepProps> = ({
    notificationsEnabled,
    onRequestNotifications
}) => {
    const { colors, isDark } = useTheme();
    const shellBackground = isDark ? 'rgba(141, 110, 99, 0.15)' : 'rgba(93, 64, 55, 0.08)';

    return (
        <View style={styles.page}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                        <MaterialCommunityIcons
                            name="bell-badge-outline"
                            size={80}
                            color={colors.primary}
                        />
                    </View>
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Stay In The Loop</Text>
                <Text style={[styles.body, { color: colors.textSecondary }]}>
                    ProjectFlow sends reminders for your projects and tasks, and notifies you
                    when teammates make progress in shared projects.
                </Text>
            </View>
            <View style={styles.actionContainer}>
                {notificationsEnabled ? (
                    <ZoomInView style={styles.permissionGranted}>
                        <ConfirmedAnimation
                            trigger={notificationsEnabled}
                            size={88}
                            strokeWidth={5}
                            scale={0.7}
                        />
                    </ZoomInView>
                ) : (
                    <View style={[styles.buttonShell, { backgroundColor: shellBackground }]}>
                        <ThemedPrimaryButton
                            label="Enable Notifications"
                            icon={<MaterialCommunityIcons name="bell-ring" size={15} color="#fff" />}
                            onPress={onRequestNotifications}
                            size="medium"
                            fullWidth
                            pressScale={0.96}
                            style={styles.button}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 24,
    },
    content: {
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
        paddingBottom: 24,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
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
    button: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    permissionGranted: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
