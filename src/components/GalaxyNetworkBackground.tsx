import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from '../theme';

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    depth: number;
};

const FRAME_MS = 33;
const MIN_NODES = 24;
const MAX_NODES = 40;

const createNodes = (count: number, width: number, height: number): Node[] => {
    const padding = 18;
    const safeWidth = Math.max(width - padding * 2, 1);
    const safeHeight = Math.max(height - padding * 2, 1);

    return Array.from({ length: count }, () => {
        const depth = 0.6 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.08 + Math.random() * 0.16) * depth;

        return {
            x: padding + Math.random() * safeWidth,
            y: padding + Math.random() * safeHeight,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 1.2 + depth * 1.6,
            opacity: 0.35 + depth * 0.45,
            depth,
        };
    });
};

const updateNodes = (nodes: Node[], width: number, height: number, step: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outMargin = Math.min(width, height) * 0.12 + 24;

    for (const node of nodes) {
        const toCenterX = centerX - node.x;
        const toCenterY = centerY - node.y;
        const dist = Math.max(1, Math.hypot(toCenterX, toCenterY));

        const pull = 0.00035 * node.depth * step;
        const swirl = 0.00055 * node.depth * step;

        node.vx += (toCenterX / dist) * pull;
        node.vy += (toCenterY / dist) * pull;
        node.vx += (-toCenterY / dist) * swirl;
        node.vy += (toCenterX / dist) * swirl;

        node.x += node.vx * step;
        node.y += node.vy * step;

        if (node.x < -outMargin) node.x = width + outMargin;
        if (node.x > width + outMargin) node.x = -outMargin;
        if (node.y < -outMargin) node.y = height + outMargin;
        if (node.y > height + outMargin) node.y = -outMargin;

        const maxSpeed = 0.28 * node.depth + 0.06;
        const speed = Math.hypot(node.vx, node.vy);
        if (speed > maxSpeed) {
            node.vx = (node.vx / speed) * maxSpeed;
            node.vy = (node.vy / speed) * maxSpeed;
        }
    }
};

export const GalaxyNetworkBackground: React.FC = () => {
    const { colors, isDark } = useTheme();
    const { width, height } = useWindowDimensions();
    const nodesRef = useRef<Node[]>([]);
    const [, setTick] = useState(0);

    const nodeCount = useMemo(() => {
        if (!width || !height) return MIN_NODES;
        const scaled = Math.sqrt(width * height) / 34;
        return Math.round(Math.min(MAX_NODES, Math.max(MIN_NODES, scaled)));
    }, [width, height]);

    const maxDistance = useMemo(() => Math.min(width, height) * 0.22, [width, height]);

    useEffect(() => {
        if (!width || !height) return;
        nodesRef.current = createNodes(nodeCount, width, height);
    }, [nodeCount, width, height]);

    useEffect(() => {
        if (!width || !height) return;

        let frameId = 0;
        let lastTime = 0;

        const animate = (time: number) => {
            if (!lastTime) lastTime = time;
            const delta = time - lastTime;

            if (delta >= FRAME_MS) {
                updateNodes(nodesRef.current, width, height, delta / 16.67);
                setTick((value) => (value + 1) % 100000);
                lastTime = time;
            }

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [width, height]);

    const nodes = nodesRef.current;
    const dotOpacityScale = isDark ? 0.35 : 0.22;
    const lineOpacityScale = isDark ? 0.18 : 0.12;

    const lines = [];
    for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);

            if (dist <= maxDistance) {
                const fade = 1 - dist / maxDistance;
                lines.push(
                    <Line
                        key={`line-${i}-${j}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={colors.textSecondary}
                        strokeWidth={1}
                        strokeOpacity={fade * lineOpacityScale}
                    />
                );
            }
        }
    }

    return (
        <View pointerEvents="none" style={styles.container}>
            <Svg width={width} height={height}>
                {lines}
                {nodes.map((node, index) => (
                    <Circle
                        key={`dot-${index}`}
                        cx={node.x}
                        cy={node.y}
                        r={node.radius}
                        fill={colors.textSecondary}
                        fillOpacity={node.opacity * dotOpacityScale}
                    />
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
});
