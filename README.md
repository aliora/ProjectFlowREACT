# ProjectFlow

A modern productivity app built with React Native. Manage your projects efficiently with a beautiful, cinematic UI.

## Features

- 🎨 **Dual Theme Support** - Light and Dark modes with automatic system detection
- 🚀 **High-Performance Animations** - Powered by Reanimated and Skia
- 📱 **Native Experience** - iOS and Android support
- 🔐 **Firebase Integration** - Authentication and cloud storage
- 🐙 **GitHub Sync** - Import repositories with repo scope access

## Tech Stack

- **React Native** 0.73+
- **TypeScript** 5.x
- **react-native-reanimated** - High-performance animations
- **react-native-skia** - Canvas rendering for particle effects
- **react-native-gesture-handler** - Gesture support for navigation
- **react-native-svg** - SVG icon rendering
- **@react-native-async-storage** - Theme persistence

## Project Structure

```
projectflow/
├── src/
│   ├── theme/
│   │   ├── AppPalette.ts      # Color constants (light/dark)
│   │   ├── ThemeContext.tsx   # Theme provider & hooks
│   │   ├── Typography.ts      # Text styles
│   │   └── index.ts
│   ├── components/
│   │   ├── ThemedButton.tsx   # Primary, Outlined, Text, Icon, FAB
│   │   ├── ThemedCard.tsx     # Card, ListTile, IconContainer
│   │   ├── Icons.tsx          # SVG icons
│   │   ├── BottomNavBar.tsx   # Animated navigation bar
│   │   └── index.ts
│   ├── constants/
│   │   ├── Layout.ts          # Spacing, sizes, radii
│   │   └── index.ts
│   ├── animations/
│   │   ├── ConnectedNetworkBackground.tsx  # Skia particle network
│   │   ├── CinematicIntroAnimation.tsx     # Rocket animation
│   │   └── index.ts
│   ├── screens/               # Screen components
│   └── types/                 # TypeScript definitions
├── assets/
│   ├── images/               # Image assets
│   └── animations/           # Animation assets
├── App.tsx                   # Main application
├── package.json
└── tsconfig.json
```

## Installation

```bash
# Install dependencies
npm install

# iOS only: Install pods
cd ios && pod install && cd ..
```

## Development

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Theme System

```tsx
import { ThemeProvider, useTheme, useColors } from './src/theme';

// Wrap your app
<ThemeProvider>
  <App />
</ThemeProvider>

// In components
const { isDarkMode, toggleTheme } = useTheme();
const colors = useColors();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>
```

## Components

### Buttons

```tsx
import { ThemedPrimaryButton, FloatingActionButton } from './src/components';

<ThemedPrimaryButton
  label="Create Project"
  icon={<AddIcon size={18} color="#FFFFFF" />}
  onPress={() => {}}
/>

<FloatingActionButton
  icon={<AddIcon size={32} color="#FFFFFF" />}
  onPress={() => {}}
/>
```

### Cards

```tsx
import { ThemedCard } from './src/components';

<ThemedCard onPress={() => console.log('tapped')}>
  <Text>Card content</Text>
</ThemedCard>
```

### Icons

```tsx
import { GitHubLogo, FolderIcon, PersonIcon } from './src/components';

<GitHubLogo size={24} color="#FFFFFF" />
<FolderIcon size={24} />
<PersonIcon size={24} />
```

### Bottom Navigation

```tsx
import { BottomNavBar } from './src/components';

<BottomNavBar
  items={[
    { icon: <GitHubLogo />, label: 'GitHub', key: 'github' },
    { icon: <FolderIcon />, label: 'Projects', key: 'projects' },
    { icon: <PersonIcon />, label: 'Profile', key: 'profile' },
  ]}
  selectedIndex={1}
  onSelect={(index) => setSelectedIndex(index)}
/>
```

### Animations

```tsx
import { ConnectedNetworkBackground, CinematicIntroAnimation } from './src/animations';

// Particle network background
<ConnectedNetworkBackground nodeCount={20} speed={0.2} />

// Rocket intro animation
<CinematicIntroAnimation size={100} onComplete={() => {}} />
```

## Color Palette

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Primary | #5D4037 | #8D6E63 | Main actions |
| Secondary | #A1887F | #A1887F | Secondary UI |
| Background | #F5F5F5 | #212121 | Page backgrounds |
| Surface | #FFFFFF | #2B2B2B | Cards, dialogs |
| Divider | #E0E0E0 | #3A3A3A | Borders |

## Layout Constants

```tsx
import { Spacing, BorderRadius, IconSize } from './src/constants';

// Spacing (8px grid)
Spacing.xs   // 4px
Spacing.sm   // 8px
Spacing.md   // 12px
Spacing.base // 16px
Spacing.lg   // 20px
Spacing.xl   // 24px

// Border radius
BorderRadius.sm   // 8px
BorderRadius.base // 12px
BorderRadius.pill // 30px

// Icon sizes
IconSize.sm  // 18px
IconSize.md  // 24px
IconSize.lg  // 32px
```

## License

MIT
