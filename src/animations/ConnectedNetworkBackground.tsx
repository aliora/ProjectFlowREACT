/**
 * ConnectedNetworkBackground Animation
 * Migrated from Flutter's onboarding_background.dart
 *
 * Renders animated nodes with proximity-based connecting lines
 * Uses react-native-skia for high-performance canvas rendering
 */

import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Line,
  vec,
} from '@shopify/react-native-skia';
import { useColors } from '../theme';

interface Node {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ConnectedNetworkBackgroundProps {
  /** Color for nodes and lines */
  color?: string;
  /** Number of nodes */
  nodeCount?: number;
  /** Animation speed multiplier */
  speed?: number;
}

/**
 * ConnectedNetworkBackground - Animated particle network
 *
 * Creates a web of moving nodes that connect when near each other.
 * The connection opacity is based on proximity.
 *
 * @example
 * ```tsx
 * <ConnectedNetworkBackground
 *   color="#8D6E63"
 *   nodeCount={20}
 *   speed={0.2}
 * />
 * ```
 */
export const ConnectedNetworkBackground: React.FC<ConnectedNetworkBackgroundProps> = ({
  color,
  nodeCount = 20,
  speed = 0.2,
}) => {
  const colors = useColors();
  const networkColor = color || colors.text.tertiary;

  const { width, height } = Dimensions.get('window');

  // Initialize nodes with random positions and velocities
  const nodesRef = React.useRef<Node[]>([]);

  // Initialize nodes only once
  if (nodesRef.current.length === 0) {
    for (let i = 0; i < nodeCount; i++) {
      nodesRef.current.push({
        x: Math.random(),
        y: Math.random(),
        dx: (Math.random() - 0.5) * 0.002 * speed,
        dy: (Math.random() - 0.5) * 0.002 * speed,
      });
    }
  }

  // Animation tick counter for re-renders
  const [tick, setTick] = React.useState(0);

  // Update node positions
  const updateNodes = () => {
    nodesRef.current.forEach((node) => {
      node.x += node.dx;
      node.y += node.dy;

      // Bounce off walls
      if (node.x < 0 || node.x > 1) node.dx *= -1;
      if (node.y < 0 || node.y > 1) node.dy *= -1;

      // Clamp to bounds
      node.x = Math.max(0, Math.min(1, node.x));
      node.y = Math.max(0, Math.min(1, node.y));
    });
  };

  // Animation loop using requestAnimationFrame equivalent
  useEffect(() => {
    let frameId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      // Update every 2nd frame for performance (like Flutter)
      if (frameCount % 2 === 0) {
        updateNodes();
        setTick((t) => t + 1);
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  // Calculate screen positions
  const positions = useMemo(() => {
    return nodesRef.current.map((node) => ({
      x: node.x * width,
      y: node.y * height,
    }));
  }, [tick, width, height]);

  // Connection threshold (squared to avoid sqrt)
  const connectionThresholdSq = 150 * 150; // 150px threshold

  // Render connections
  const connections: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const distSq = dx * dx + dy * dy;

      if (distSq < connectionThresholdSq) {
        // Normalized distance (0-1)
        const dist = distSq / connectionThresholdSq;
        const opacity = (1 - dist) * 0.3;

        connections.push({
          x1: positions[i].x,
          y1: positions[i].y,
          x2: positions[j].x,
          y2: positions[j].y,
          opacity,
        });
      }
    }
  }

  // Parse color for opacity manipulation
  const parseColor = (hex: string, alpha: number): string => {
    // Handle hex colors with or without #
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Validate hex length
    if (cleanHex.length !== 6 && cleanHex.length !== 3) {
      return `rgba(128, 128, 128, ${alpha})`; // Fallback gray
    }
    
    // Convert 3-character hex to 6-character
    const fullHex = cleanHex.length === 3
      ? cleanHex.split('').map(c => c + c).join('')
      : cleanHex;
    
    // Convert hex to rgba
    const r = parseInt(fullHex.slice(0, 2), 16);
    const g = parseInt(fullHex.slice(2, 4), 16);
    const b = parseInt(fullHex.slice(4, 6), 16);
    
    // Validate parsed values
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return `rgba(128, 128, 128, ${alpha})`; // Fallback gray
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Canvas style={styles.canvas}>
        {/* Draw connection lines */}
        {connections.map((conn, index) => (
          <Line
            key={`line-${index}`}
            p1={vec(conn.x1, conn.y1)}
            p2={vec(conn.x2, conn.y2)}
            color={parseColor(networkColor, conn.opacity)}
            strokeWidth={1.5}
          />
        ))}

        {/* Draw nodes */}
        {positions.map((pos, index) => (
          <Circle
            key={`node-${index}`}
            cx={pos.x}
            cy={pos.y}
            r={4}
            color={parseColor(networkColor, 0.4)}
          />
        ))}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
});

export default ConnectedNetworkBackground;
