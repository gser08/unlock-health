import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Line, Circle as SvgCircle, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Technique, validateAnyTechnique } from '../utils/techniques';

// Constants for layout
const GRID_SIZE = 280;
const NODE_SIZE = 54;
const NODE_RADIUS = NODE_SIZE / 2;
const SPACING = (GRID_SIZE - 3 * NODE_SIZE) / 2;

// Calculate the center coordinates of each node
const NODES = Array.from({ length: 9 }).map((_, i) => {
  const row = Math.floor(i / 3);
  const col = i % 3;
  return {
    id: i,
    x: col * (NODE_SIZE + SPACING) + NODE_RADIUS,
    y: row * (NODE_SIZE + SPACING) + NODE_RADIUS,
  };
});

const HIT_SLOP = 38;

// Create animated component ONCE at module level (crash fix)
const AnimatedLineComponent = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

type PatternResult = 'idle' | 'success' | 'error';

interface PatternLockProps {
  onSuccess?: (technique: Technique) => void;
  guidePath?: number[]; // Ghost guide to show the user which pattern to draw
}

export default function PatternLock({ onSuccess, guidePath }: PatternLockProps) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [result, setResult] = useState<PatternResult>('idle');
  const currentX = useSharedValue(-1);
  const currentY = useSharedValue(-1);
  const isInteracting = useSharedValue(false);

  // Pulse animation for the guide dots
  const guideOpacity = useSharedValue(0.15);

  useEffect(() => {
    guideOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 1200 }),
        withTiming(0.15, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const getStrokeColor = () => {
    switch (result) {
      case 'success': return '#4AE68A';
      case 'error': return '#FF6B6B';
      default: return 'rgba(255, 255, 255, 0.85)';
    }
  };

  const getNodeGlowColor = () => {
    switch (result) {
      case 'success': return 'rgba(74, 230, 138, 0.5)';
      case 'error': return 'rgba(255, 107, 107, 0.5)';
      default: return 'rgba(255, 255, 255, 0.35)';
    }
  };

  const appendNode = (id: number) => {
    setActiveNodes((prev) => {
      if (!prev.includes(id)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return [...prev, id];
      }
      return prev;
    });
  };

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(setResult)('idle');
      isInteracting.value = true;
      currentX.value = e.x;
      currentY.value = e.y;

      const node = NODES.find(n => Math.hypot(n.x - e.x, n.y - e.y) < HIT_SLOP);
      if (node) {
        runOnJS(appendNode)(node.id);
        currentX.value = node.x;
        currentY.value = node.y;
      }
    })
    .onUpdate((e) => {
      currentX.value = e.x;
      currentY.value = e.y;
      const node = NODES.find(n => Math.hypot(n.x - e.x, n.y - e.y) < HIT_SLOP);
      if (node) {
        runOnJS(appendNode)(node.id);
      }
    })
    .onEnd(() => {
      isInteracting.value = false;
      currentX.value = -1;
      currentY.value = -1;

      runOnJS((nodes: number[]) => {
        if (nodes.length < 3) {
          setActiveNodes([]);
          return;
        }

        const matched = validateAnyTechnique(nodes);

        if (matched) {
          setResult('success');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            if (onSuccess) onSuccess(matched);
            setActiveNodes([]);
            setResult('idle');
          }, 1200);
        } else {
          setResult('error');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setTimeout(() => {
            setActiveNodes([]);
            setResult('idle');
          }, 900);
        }
      })(activeNodes);
    });

  const guideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: guideOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 0 }}>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <View style={styles.gridContainer}>
            <Svg height={GRID_SIZE} width={GRID_SIZE} style={StyleSheet.absoluteFill}>
              {/* Ghost guide lines */}
              {guidePath && guidePath.map((id, index) => {
                if (index === 0) return null;
                const prev = NODES[guidePath[index - 1]];
                const curr = NODES[id];
                return (
                  <Line
                    key={`guide-${index}`}
                    x1={prev.x} y1={prev.y}
                    x2={curr.x} y2={curr.y}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8,8"
                  />
                );
              })}

              {/* Active drawn lines */}
              {activeNodes.map((id, index) => {
                if (index === 0) return null;
                const prevNode = NODES[activeNodes[index - 1]];
                const currNode = NODES[id];
                return (
                  <Line
                    key={`line-${index}`}
                    x1={prevNode.x} y1={prevNode.y}
                    x2={currNode.x} y2={currNode.y}
                    stroke={getStrokeColor()}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Dynamic finger-following line */}
              {activeNodes.length > 0 && isInteracting.value && currentX.value !== -1 && (
                <FingerLine
                  x1={NODES[activeNodes[activeNodes.length - 1]].x}
                  y1={NODES[activeNodes[activeNodes.length - 1]].y}
                  currentX={currentX}
                  currentY={currentY}
                  color={getStrokeColor()}
                />
              )}
            </Svg>

            {/* Nodes */}
            {NODES.map((node) => {
              const isActive = activeNodes.includes(node.id);
              const isCenter = node.id === 4;
              const isGuideNode = guidePath?.includes(node.id) && !isActive;

              return (
                <View key={node.id} style={[
                  styles.nodeOuter,
                  { left: node.x - NODE_RADIUS, top: node.y - NODE_RADIUS },
                ]}>
                  {/* Outer glow ring for active nodes */}
                  {isActive && (
                    <View style={[styles.glowRing, { borderColor: getStrokeColor(), shadowColor: getStrokeColor() }]} />
                  )}
                  
                  <View style={[
                    styles.node,
                    isCenter && styles.nodeCenter,
                    isActive && !isCenter && { borderColor: getStrokeColor(), backgroundColor: getNodeGlowColor() },
                    isGuideNode && !isCenter && styles.nodeGuide,
                  ]}>
                    {isCenter && <View style={styles.nipple} />}
                    {isActive && !isCenter && (
                      <View style={[styles.innerDot, { backgroundColor: getStrokeColor() }]} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

// Animated line that follows the user's finger
const FingerLine = ({ x1, y1, currentX, currentY, color }: any) => {
  const animatedProps = useAnimatedProps(() => ({
    x2: currentX.value,
    y2: currentY.value,
  }));

  return (
    <AnimatedLineComponent
      x1={x1} y1={y1}
      animatedProps={animatedProps}
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      opacity={0.6}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    position: 'relative',
  },
  nodeOuter: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: NODE_SIZE + 12,
    height: NODE_SIZE + 12,
    borderRadius: (NODE_SIZE + 12) / 2,
    borderWidth: 2,
    opacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  nodeGuide: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  nodeCenter: {
    backgroundColor: '#F5D0C5',
    borderColor: '#E8BFB0',
    borderWidth: 0,
    shadowColor: '#D9A18E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  innerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  nipple: {
    width: 20,
    height: 20,
    backgroundColor: '#D19A87',
    borderRadius: 10,
  },
});
