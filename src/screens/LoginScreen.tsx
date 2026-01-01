import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Image,
    LayoutAnimation,
    UIManager
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AuthService } from '../services/AuthService';
import { RadioSwitch } from '../components/RadioSwitch';

interface Props {
    startWithRegister?: boolean;
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'register';

// Animation helper components
const FadeInView: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({ delay = 0, children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
};

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

    return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
};

const SlideInDownView: React.FC<{ delay?: number; fromY?: number; children: React.ReactNode; style?: any }> = ({ delay = 0, fromY, children, style }) => {
    const translateY = useRef(new Animated.Value(fromY ?? 50)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true })
            ]).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
};

export const LoginScreen: React.FC<Props> = ({ startWithRegister = false, onSuccess }) => {
    const { colors, isDark } = useTheme();

    const [authMode, setAuthMode] = useState<AuthMode>(startWithRegister ? 'register' : 'login');
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const toggleBackgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    useEffect(() => {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    const handleAuthModeChange = (nextMode: AuthMode) => {
        if (nextMode === authMode) {
            return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAuthMode(nextMode);
    };

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (authMode === 'register' && (!firstName || !lastName)) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        setLoading(true);
        try {
            if (authMode === 'login') {
                await AuthService.signInWithEmail(email, password);
            } else {
                await AuthService.registerWithEmail(email, password, firstName, lastName);
            }
            onSuccess?.();
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const socialLogin = async (provider: 'google' | 'github') => {
        Alert.alert('Not Implemented', `${provider} login needs native setup.`);
    };

    return (
        <View style={styles.container}>
            <FadeInView delay={100} style={styles.header}>
                <Image
                    source={require('../../assets/animations/rocket.png')}
                    style={styles.rocketImage}
                    resizeMode="contain"
                />
                <Text style={[styles.title, { color: colors.text, letterSpacing: 2 }]}>ProjectFlow</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary, letterSpacing: 2.5 }]}>
                    Plan. Execute. Succeed.
                </Text>
            </FadeInView>

            <FadeInDownView delay={200} style={[styles.toggleContainer, { backgroundColor: toggleBackgroundColor }]}>
                <RadioSwitch
                    leftLabel="Login"
                    rightLabel="Register"
                    isLeftSelected={authMode === 'login'}
                    onChange={(isLeft) => handleAuthModeChange(isLeft ? 'login' : 'register')}
                />
            </FadeInDownView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
                {authMode === 'register' && (
                    <SlideInDownView delay={80} fromY={-12} style={styles.row}>
                        <TextInput
                            ref={firstNameRef}
                            style={[styles.input, styles.halfInput, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: colors.divider, color: colors.text }]}
                            placeholder="First Name"
                            placeholderTextColor={colors.textSecondary}
                            value={firstName}
                            onChangeText={setFirstName}
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => lastNameRef.current?.focus()}
                        />
                        <View style={{ width: 10 }} />
                        <TextInput
                            ref={lastNameRef}
                            style={[styles.input, styles.halfInput, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: colors.divider, color: colors.text }]}
                            placeholder="Last Name"
                            placeholderTextColor={colors.textSecondary}
                            value={lastName}
                            onChangeText={setLastName}
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => emailRef.current?.focus()}
                        />
                    </SlideInDownView>
                )}

                <SlideInDownView delay={200}>
                    <TextInput
                        ref={emailRef}
                        style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: colors.divider, color: colors.text }]}
                        placeholder="Email"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                </SlideInDownView>

                <SlideInDownView delay={300}>
                    <View style={[styles.passwordContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: colors.divider }]}>
                        <TextInput
                            ref={passwordRef}
                            style={[styles.passwordInput, { color: colors.text }]}
                            placeholder="Password"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            returnKeyType="done"
                            onSubmitEditing={handleAuth}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                            <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </SlideInDownView>

                <SlideInDownView delay={400} style={{ marginTop: 20 }}>
                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitBtnText}>{authMode === 'login' ? 'Login' : 'Register'}</Text>
                        )}
                    </TouchableOpacity>
                </SlideInDownView>

                <View style={styles.dividerContainer}>
                    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                    <Text style={[styles.orText, { color: colors.textSecondary }]}>OR</Text>
                    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                </View>

                <TouchableOpacity
                    style={[styles.socialBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff', borderColor: colors.divider }]}
                    onPress={() => socialLogin('google')}
                >
                    <MaterialCommunityIcons name="google" size={20} color={colors.text} />
                    <Text style={[styles.socialBtnText, { color: colors.text }]}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.socialBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#000', borderColor: colors.divider }]}
                    onPress={() => socialLogin('github')}
                >
                    <MaterialCommunityIcons name="github" size={20} color={isDark ? colors.text : '#fff'} />
                    <Text style={[styles.socialBtnText, { color: isDark ? colors.text : '#fff' }]}>Continue with GitHub</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    rocketImage: {
        width: 110,
        height: 110,
        transform: [{ rotate: '45deg' }, { scale: 2.5 }],
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 5,
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        borderRadius: 12,
        padding: 4,
        height: 52,
    },
    formContainer: {
        paddingBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    halfInput: {
        flex: 1,
        marginBottom: 0,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        height: 50,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
    },
    submitBtn: {
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 12,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    socialBtnText: {
        marginLeft: 10,
        fontWeight: '600',
    },
});
