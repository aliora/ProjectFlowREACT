import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { MainScreen } from './src/screens/MainScreen';
import { AuthService } from './src/services/AuthService';

const AppContent = () => {
  const { isDark, colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkInitialState();

    const unsubscribe = AuthService.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  const checkInitialState = async () => {
    try {
      const seenOnboarding = await AsyncStorage.getItem('seenOnboarding');
      if (seenOnboarding !== 'true') {
        setShowOnboarding(true);
      }
    } catch (e) {
      console.log('Error checking onboarding status', e);
    } finally {
      // Small delay to prevent flash
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If user is not logged in OR hasn't seen onboarding, show Onboarding
  // Note: OnboardingScreen handles Auth internally in its step 4
  // But if we have seen onboarding but NOT logged in, we might want to show Onboarding (or just Login)
  // For simplicity, let's say "OnboardingScreen" is the entry point for non-auth users or first-timers.

  if (!user || showOnboarding) {
    return (
      <OnboardingScreen
        onFinish={() => {
          setShowOnboarding(false);
          // After onFinish, if user is logged in, MainScreen will render next render cycle
        }}
      />
    );
  }

  return <MainScreen />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
