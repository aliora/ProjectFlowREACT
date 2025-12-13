/**
 * ProjectFlow - React Native App
 * Full app with all migrated components
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ThemeProvider,
  useTheme,
  useColors,
  getTypography,
} from './src/theme';
import {
  ThemedPrimaryButton,
  ThemedOutlinedButton,
  ThemedCard,
  ThemedIconButton,
  FloatingActionButton,
  GitHubLogo,
  FolderIcon,
  PersonIcon,
  SunIcon,
  MoonIcon,
  AddIcon,
  SettingsIcon,
  DashboardIcon,
  BottomNavBar,
} from './src/components';
import { Spacing, BorderRadius } from './src/constants';

/**
 * Main Demo Component
 * Demonstrates theme, buttons, icons, cards, and navigation
 */
const ProjectFlowDemo: React.FC = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const colors = useColors();
  const typography = getTypography(theme);
  const [selectedTab, setSelectedTab] = useState(1);

  const navItems = [
    { icon: <GitHubLogo size={24} color={selectedTab === 0 ? colors.primary : colors.icon} />, label: 'GitHub', key: 'github' },
    { icon: <FolderIcon size={24} color={selectedTab === 1 ? colors.primary : colors.icon} />, label: 'Projects', key: 'projects' },
    { icon: <PersonIcon size={24} color={selectedTab === 2 ? colors.primary : colors.icon} />, label: 'Profile', key: 'profile' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* App Bar */}
      <View style={[styles.appBar, { backgroundColor: colors.surface }]}>
        <ThemedIconButton
          icon={<DashboardIcon size={24} color={colors.icon} />}
          onPress={() => { }}
        />
        <Text style={[typography.titleLarge, { color: colors.text.primary }]}>
          ProjectFlow
        </Text>
        <ThemedIconButton
          icon={isDarkMode
            ? <SunIcon size={24} color={colors.icon} />
            : <MoonIcon size={24} color={colors.icon} />
          }
          onPress={toggleTheme}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[typography.displaySmall, { color: colors.text.primary }]}>
            Expo Go Ready! 🚀
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.text.secondary, marginTop: Spacing.sm }]}>
            Full app with all components loaded
          </Text>
        </View>

        {/* Buttons Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Button Components
          </Text>

          <View style={styles.buttonRow}>
            <ThemedPrimaryButton
              label="Primary"
              icon={<AddIcon size={18} color="#FFFFFF" />}
              onPress={() => console.log('Primary pressed')}
            />
            <ThemedOutlinedButton
              label="Outlined"
              onPress={() => console.log('Outlined pressed')}
            />
          </View>

          <View style={[styles.buttonRow, { marginTop: Spacing.md }]}>
            <ThemedPrimaryButton
              label="Loading..."
              isLoading
              size="small"
            />
            <ThemedOutlinedButton
              label="Disabled"
              disabled
              size="small"
            />
          </View>

          <ThemedPrimaryButton
            label="Full Width Button"
            fullWidth
            style={{ marginTop: Spacing.md }}
          />
        </ThemedCard>

        {/* Icons Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Icon Components
          </Text>

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <GitHubLogo size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                GitHub
              </Text>
            </View>
            <View style={styles.iconItem}>
              <FolderIcon size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Folder
              </Text>
            </View>
            <View style={styles.iconItem}>
              <PersonIcon size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Person
              </Text>
            </View>
            <View style={styles.iconItem}>
              <SettingsIcon size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Settings
              </Text>
            </View>
            <View style={styles.iconItem}>
              <SunIcon size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Sun
              </Text>
            </View>
            <View style={styles.iconItem}>
              <MoonIcon size={32} color={colors.icon} />
              <Text style={[typography.caption, { color: colors.text.tertiary, marginTop: 4 }]}>
                Moon
              </Text>
            </View>
          </View>
        </ThemedCard>

        {/* Cards Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Card Variants
          </Text>

          <ThemedCard
            padding={Spacing.md}
            onPress={() => console.log('Card tapped')}
            style={{ marginBottom: Spacing.md }}
          >
            <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
              Tappable Card
            </Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
              Tap me to see the effect
            </Text>
          </ThemedCard>

          <ThemedCard
            padding={Spacing.md}
            selected
          >
            <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
              Selected Card
            </Text>
            <Text style={[typography.bodySmall, { color: colors.text.secondary }]}>
              With highlighted border
            </Text>
          </ThemedCard>
        </ThemedCard>

        {/* Colors Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Color Palette
          </Text>

          <View style={styles.colorGrid}>
            <ColorSwatch name="Primary" color={colors.primary} />
            <ColorSwatch name="Secondary" color={colors.secondary} />
            <ColorSwatch name="Background" color={colors.background} />
            <ColorSwatch name="Surface" color={colors.surface} />
            <ColorSwatch name="Success" color={colors.success} />
            <ColorSwatch name="Warning" color={colors.warning} />
            <ColorSwatch name="Error" color={colors.error} />
            <ColorSwatch name="Divider" color={colors.divider} />
          </View>
        </ThemedCard>

        {/* Typography Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Typography Scale
          </Text>

          <Text style={[typography.displaySmall, { color: colors.text.primary }]}>
            Display Small
          </Text>
          <Text style={[typography.headlineMedium, { color: colors.text.primary, marginTop: 4 }]}>
            Headline Medium
          </Text>
          <Text style={[typography.titleLarge, { color: colors.text.primary, marginTop: 4 }]}>
            Title Large
          </Text>
          <Text style={[typography.bodyLarge, { color: colors.text.primary, marginTop: 4 }]}>
            Body Large - Main content text
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.text.secondary, marginTop: 4 }]}>
            Body Medium - Secondary content
          </Text>
          <Text style={[typography.bodySmall, { color: colors.text.tertiary, marginTop: 4 }]}>
            Body Small - Hints and captions
          </Text>
        </ThemedCard>

        {/* Spacing Section */}
        <ThemedCard style={styles.section}>
          <Text style={[typography.titleMedium, { color: colors.text.primary, marginBottom: Spacing.md }]}>
            Spacing & Layout
          </Text>

          <View style={styles.spacingDemo}>
            {Object.entries(Spacing).map(([key, value]) => (
              <View key={key} style={styles.spacingItem}>
                <View
                  style={[
                    styles.spacingBox,
                    {
                      width: value,
                      height: value,
                      backgroundColor: colors.primary,
                    }
                  ]}
                />
                <Text style={[typography.caption, { color: colors.text.tertiary }]}>
                  {key}: {value}px
                </Text>
              </View>
            ))}
          </View>
        </ThemedCard>

        {/* Bottom padding for nav bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation Bar with Animations */}
      <View style={styles.bottomNavContainer}>
        <BottomNavBar
          items={navItems}
          selectedIndex={selectedTab}
          onSelect={setSelectedTab}
        />
      </View>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <FloatingActionButton
          icon={<AddIcon size={32} color="#FFFFFF" />}
          onPress={() => console.log('FAB pressed')}
        />
      </View>
    </SafeAreaView>
  );
};

/**
 * Color Swatch Component
 */
interface ColorSwatchProps {
  name: string;
  color: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color }) => {
  const colors = useColors();
  const { theme } = useTheme();
  const typography = getTypography(theme);

  return (
    <View style={styles.swatchContainer}>
      <View
        style={[
          styles.swatch,
          { backgroundColor: color, borderColor: colors.divider },
        ]}
      />
      <Text style={[typography.caption, { color: colors.text.tertiary }]}>
        {name}
      </Text>
    </View>
  );
};

/**
 * Main App Component
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectFlowDemo />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContent: {
    padding: Spacing.base,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.base,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  iconItem: {
    alignItems: 'center',
    width: 60,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  swatchContainer: {
    alignItems: 'center',
    width: 70,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: 4,
  },
  spacingDemo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    alignItems: 'flex-end',
  },
  spacingItem: {
    alignItems: 'center',
  },
  spacingBox: {
    borderRadius: 4,
    marginBottom: 4,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 85,
    right: 16,
  },
});

export default App;
