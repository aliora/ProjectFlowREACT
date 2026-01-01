import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AuthService } from '../services/AuthService';

const { width } = Dimensions.get('window');

const TAB_WIDTH = width / 3;

export const MainScreen = () => {
    const { colors, toggleTheme, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState(1); // 0: GitHub, 1: Projects, 2: Profile
    const tabIndicatorPos = useRef(new Animated.Value(TAB_WIDTH)).current; // Start at index 1

    const handleTabPress = (index: number) => {
        setActiveTab(index);
        Animated.spring(tabIndicatorPos, {
            toValue: index * TAB_WIDTH,
            damping: 15,
            stiffness: 100,
            useNativeDriver: true,
        }).start();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <PlaceholderTab icon="github" text="GitHub Projects" subText="Sync your repositories" colors={colors} />;
            case 1:
                return <PlaceholderTab icon="folder-outline" text="Local Projects" subText="Create a new project to start" colors={colors} />;
            case 2:
                return (
                    <View style={styles.centerContent}>
                        <MaterialCommunityIcons name="account-circle" size={80} color={colors.primary} />
                        <Text style={[styles.tabText, { color: colors.text }]}>Profile</Text>
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: colors.error, marginTop: 20 }]}
                            onPress={() => AuthService.signOut()}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.divider }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>ProjectFlow</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
                    <MaterialCommunityIcons
                        name={isDark ? "weather-sunny" : "weather-night"}
                        size={24}
                        color={colors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.content}>
                {renderContent()}
            </View>

            {/* Floating/Bottom Tab Bar */}
            <View style={[styles.tabBar, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
                {/* Animated Indicator */}
                <Animated.View style={[styles.indicatorContainer, { transform: [{ translateX: tabIndicatorPos }] }]}>
                    <View style={[styles.indicator, { backgroundColor: colors.primary + '30', borderColor: colors.primary }]} />
                </Animated.View>

                {/* Tab Items */}
                <TabItem
                    index={0}
                    icon="github"
                    label="GitHub"
                    active={activeTab === 0}
                    onPress={handleTabPress}
                    colors={colors}
                />
                <TabItem
                    index={1}
                    icon="folder"
                    label="Projects"
                    active={activeTab === 1}
                    onPress={handleTabPress}
                    colors={colors}
                />
                <TabItem
                    index={2}
                    icon="account"
                    label="Profile"
                    active={activeTab === 2}
                    onPress={handleTabPress}
                    colors={colors}
                />
            </View>
        </SafeAreaView>
    );
};

const TabItem = ({ index, icon, label, active, onPress, colors }: any) => (
    <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onPress(index)}
        activeOpacity={0.7}
    >
        <MaterialCommunityIcons
            name={icon}
            size={24}
            color={active ? colors.primary : colors.textSecondary}
        />
        <Text style={[
            styles.tabLabel,
            { color: active ? colors.primary : colors.textSecondary, fontWeight: active ? 'bold' : 'normal' }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const PlaceholderTab = ({ icon, text, subText, colors }: any) => (
    <View style={styles.centerContent}>
        <MaterialCommunityIcons name={icon} size={60} color={colors.textSecondary + '80'} />
        <Text style={[styles.tabText, { color: colors.text, marginTop: 20 }]}>{text}</Text>
        <Text style={[styles.subText, { color: colors.textSecondary }]}>{subText}</Text>

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, marginTop: 30 }]}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
    },
    themeBtn: {
        padding: 8,
    },
    content: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 20,
        fontWeight: '600',
    },
    subText: {
        fontSize: 14,
        marginTop: 5,
    },
    btn: {
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        elevation: 10,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    indicatorContainer: {
        position: 'absolute',
        width: TAB_WIDTH,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
    },
});
