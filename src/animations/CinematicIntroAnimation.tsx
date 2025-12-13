/**
 * CinematicIntroAnimation
 * Migrated from Flutter's rocket_cinematic.dart
 *
 * A three-phase rocket animation:
 * 1. Launch (easeInExpo) - Rocket takes off with shake and smoke
 * 2. Flyby (linear) - Rocket flies across screen at 3x scale
 * 3. Arrival (elasticOut) - Waving hand appears
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { useColors } from '../theme';
import { WavingHandIcon } from '../components/Icons';

interface CinematicIntroAnimationProps {
  /** Size of the rocket/icon */
  size?: number;
  /** Color for the waving hand */
  color?: string;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * Animation timing configuration (matching Flutter)
 * Total duration: 7000ms
 *
 * Phase 1 - Launch: 0.12 - 0.32 (840ms - 2240ms)
 * Phase 2 - Flyby: 0.54 - 0.75 (3780ms - 5250ms)
 * Phase 3 - Arrival: 0.80 - 1.0 (5600ms - 7000ms)
 */
const TOTAL_DURATION = 7000;

// Phase intervals (as fractions of total duration)
const PHASES = {
  // Pre-launch delay
  START_DELAY: 400,

  // Phase 1: Launch
  LAUNCH_START: 0.12,
  LAUNCH_END: 0.32,

  // Phase 2: Flyby
  FLYBY_START: 0.54,
  FLYBY_END: 0.75,

  // Phase 3: Arrival
  ARRIVAL_START: 0.80,
  ARRIVAL_END: 1.0,
};

/**
 * Custom easeInExpo easing function
 */
const easeInExpo = (t: number): number => {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
};

/**
 * Custom elasticOut easing function
 */
const elasticOut = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export const CinematicIntroAnimation: React.FC<CinematicIntroAnimationProps> = ({
  size = 100,
  color,
  onComplete,
}) => {
  const colors = useColors();
  const iconColor = color || colors.primary;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Calculate off-screen positions
  const offScreenX = screenWidth * 0.7 + size;
  const offScreenY = screenHeight * 0.7 + size;

  // Animation progress (0 to 1)
  const progress = useSharedValue(0);

  // Shake effect values
  const shakeX = useSharedValue(0);
  const shakeY = useSharedValue(0);

  // Start animation on mount
  useEffect(() => {
    // Start after delay
    const timeout = setTimeout(() => {
      // Main animation
      progress.value = withTiming(1, {
        duration: TOTAL_DURATION,
        easing: Easing.linear,
      }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });

      // Pre-launch shake effect (first 15% of animation = ~1050ms)
      const shakeDuration = TOTAL_DURATION * 0.15;
      const shakeSequence = () => {
        return withSequence(
          withTiming((Math.random() - 0.5) * 3, { duration: 50 }),
          withTiming((Math.random() - 0.5) * 3, { duration: 50 }),
          withTiming((Math.random() - 0.5) * 3, { duration: 50 }),
          withTiming((Math.random() - 0.5) * 3, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      };

      // Repeat shake for pre-launch period
      let shakeCount = 0;
      const maxShakes = Math.floor(shakeDuration / 250);
      const doShake = () => {
        if (shakeCount < maxShakes) {
          shakeX.value = shakeSequence();
          shakeY.value = shakeSequence();
          shakeCount++;
          setTimeout(doShake, 250);
        }
      };
      doShake();

    }, PHASES.START_DELAY);

    return () => clearTimeout(timeout);
  }, []);

  // Phase 1: Launch animation style
  const launchStyle = useAnimatedStyle(() => {
    const p = progress.value;

    // Only visible during launch phase
    if (p > PHASES.LAUNCH_END) {
      return { opacity: 0 };
    }

    // Normalize progress within launch phase
    const launchProgress = interpolate(
      p,
      [PHASES.LAUNCH_START, PHASES.LAUNCH_END],
      [0, 1],
      Extrapolate.CLAMP
    );

    // Apply easeInExpo
    const easedProgress = easeInExpo(launchProgress);

    // Calculate translation (moving towards top-right)
    const targetDx = offScreenX;
    const targetDy = -offScreenY;
    const dx = easedProgress * targetDx;
    const dy = easedProgress * targetDy;

    // Rotation angle pointing towards direction of movement
    const angle = Math.atan2(targetDy, targetDx) + Math.PI / 2;
    const rotationDeg = (angle * 180) / Math.PI;

    return {
      opacity: 1,
      transform: [
        { translateX: dx + shakeX.value },
        { translateY: dy + shakeY.value },
        { rotate: `${rotationDeg}deg` },
      ],
    };
  });

  // Phase 2: Flyby animation style
  const flybyStyle = useAnimatedStyle(() => {
    const p = progress.value;

    // Only visible during flyby phase
    if (p < PHASES.FLYBY_START || p >= PHASES.FLYBY_END) {
      return { opacity: 0 };
    }

    // Normalize progress within flyby phase
    const flybyProgress = interpolate(
      p,
      [PHASES.FLYBY_START, PHASES.FLYBY_END],
      [0, 1],
      Extrapolate.CLAMP
    );

    // Linear movement from top-right to bottom-left
    const startX = offScreenX;
    const startY = -offScreenY;
    const endX = -offScreenX;
    const endY = offScreenY;

    const dx = startX + (endX - startX) * flybyProgress;
    const dy = startY + (endY - startY) * flybyProgress;

    // Rotation angle for bottom-left movement
    const vectorAngle = Math.atan2(endY - startY, endX - startX);
    const rotationAngle = vectorAngle + Math.PI / 2;
    const rotationDeg = (rotationAngle * 180) / Math.PI;

    return {
      opacity: 1,
      transform: [
        { translateX: dx },
        { translateY: dy },
        { scale: 3.0 },
        { rotate: `${rotationDeg}deg` },
      ],
    };
  });

  // Phase 3: Arrival (hand) animation style
  const arrivalStyle = useAnimatedStyle(() => {
    const p = progress.value;

    // Only visible during arrival phase
    if (p < PHASES.ARRIVAL_START) {
      return {
        opacity: 0,
        transform: [{ scale: 0 }],
      };
    }

    // Normalize progress within arrival phase
    const arrivalProgress = interpolate(
      p,
      [PHASES.ARRIVAL_START, PHASES.ARRIVAL_END],
      [0, 1],
      Extrapolate.CLAMP
    );

    // Apply elasticOut
    const easedProgress = elasticOut(arrivalProgress);

    return {
      opacity: 1,
      transform: [{ scale: easedProgress }],
    };
  });

  return (
    <View style={[styles.container, { width: size * 3, height: size * 3 }]}>
      {/* Phase 1: Launch Scene */}
      <Animated.View style={[styles.rocketContainer, launchStyle]}>
        <RocketWithSmoke size={size} />
      </Animated.View>

      {/* Phase 2: Flyby Scene */}
      <Animated.View style={[styles.rocketContainer, flybyStyle]}>
        <RocketWithSmoke size={size} />
      </Animated.View>

      {/* Phase 3: Arrival Scene (Waving Hand) */}
      <Animated.View style={[styles.handContainer, arrivalStyle]}>
        <WavingHandIcon size={size} color={iconColor} />
      </Animated.View>
    </View>
  );
};

/**
 * Rocket with smoke effect
 */
interface RocketWithSmokeProps {
  size: number;
}

const RocketWithSmoke: React.FC<RocketWithSmokeProps> = ({ size }) => {
  // For now, using emoji as placeholder
  // In production, this would use actual rocket image assets

  return (
    <View style={styles.rocketWithSmoke}>
      {/* Rocket emoji as placeholder */}
      <View style={[styles.rocket, { width: size, height: size }]}>
        <Animated.Text style={[styles.rocketEmoji, { fontSize: size * 0.8 }]}>
          🚀
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  rocketContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rocketWithSmoke: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rocket: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rocketEmoji: {
    textAlign: 'center',
  },
  handContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CinematicIntroAnimation;
