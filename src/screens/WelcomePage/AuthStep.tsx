import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from '../LoginScreen';

interface AuthStepProps {
    onSuccess: () => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onSuccess }) => {
    return (
        <View style={styles.page}>
            <View style={[styles.contentContainer, { justifyContent: 'center' }]}>
                <LoginScreen onSuccess={onSuccess} />
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
});
