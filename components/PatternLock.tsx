import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import Svg, { Line, Circle as SvgCircle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

// Constants for layout
const GRID_SIZE = 300;
const NODE_SIZE = 60;
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

const HIT_SLOP = 35; // How close the finger needs to be to a node to snap to it

export default function PatternLock({ onSuccess }: { onSuccess?: () => void }) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const currentX = useSharedValue(-1);
  const currentY = useSharedValue(-1);
  const isInteracting = useSharedValue(false);

  // Helper to append node safely
  const appendNode = (id: number) => {
    setActiveNodes((prev) => {
      if (!prev.includes(id)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return [...prev, id];
      }
      return prev;
    });
  };

  const gesture = Gesture.Pan()
    .onBegin((e) => {
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
        // Validation: Medical pattern must trace at least 4 nodes and cover the center (areola)
        const isValid = nodes.length >= 4 && nodes.includes(4);
        
        if (isValid) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (onSuccess) onSuccess();
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Clear pattern after a short delay
        setTimeout(() => {
          setActiveNodes([]);
        }, isValid ? 1500 : 800);
      })(activeNodes);
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <View style={styles.gridContainer}>
            {/* Draw active lines using SVG */}
            <Svg height={GRID_SIZE} width={GRID_SIZE} style={StyleSheet.absoluteFill}>
              {activeNodes.map((id, index) => {
                if (index === 0) return null;
                const prevNode = NODES[activeNodes[index - 1]];
                const currNode = NODES[id];
                return (
                  <Line
                    key={`line-${index}`}
                    x1={prevNode.x}
                    y1={prevNode.y}
                    x2={currNode.x}
                    y2={currNode.y}
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                );
              })}
              
              {/* Dynamic line following the finger */}
              {activeNodes.length > 0 && isInteracting.value && currentX.value !== -1 && (
                <AnimatedLine
                  x1={NODES[activeNodes[activeNodes.length - 1]].x}
                  y1={NODES[activeNodes[activeNodes.length - 1]].y}
                  currentX={currentX}
                  currentY={currentY}
                />
              )}
            </Svg>

            {/* Draw nodes */}
            {NODES.map((node) => {
              const isActive = activeNodes.includes(node.id);
              const isCenter = node.id === 4;

              return (
                <View
                  key={node.id}
                  style={[
                    styles.node,
                    { left: node.x - NODE_RADIUS, top: node.y - NODE_RADIUS },
                    isActive && !isCenter && styles.nodeActive, // active state for white nodes
                    isCenter && styles.nodeCenter,
                  ]}
                >
                  {isCenter && (
                    <View style={styles.nipple} />
                  )}
                  {isActive && !isCenter && <View style={styles.innerDot} />}
                </View>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

// Custom animated line component
const AnimatedLine = ({ x1, y1, currentX, currentY }: any) => {
  const animatedProps = useAnimatedStyle(() => ({
    // Setting these implicitly via useAnimatedProps is more robust, but SVG Line animated props are tricky.
    // We can simulate an animated line using absolute positioned rotated View instead for simplicity,
    // or use createAnimatedComponent on Line. 
  }));

  // A pure Reanimated 3 workaround for animated SVG line:
  const AnimatedSVGLine = Animated.createAnimatedComponent(Line);
  
  // Actually, animating SVGs directly via props requires `useAnimatedProps`.
  return (
    <ActiveAnimatedLine x1={x1} y1={y1} currentX={currentX} currentY={currentY} />
  );
};

import { useAnimatedProps } from 'react-native-reanimated';
const ActiveAnimatedLine = ({ x1, y1, currentX, currentY }: any) => {
  const AnimatedLineComponent = Animated.createAnimatedComponent(Line);
  const animatedProps = useAnimatedProps(() => {
    return {
      x2: currentX.value,
      y2: currentY.value,
    };
  });

  return (
    <AnimatedLineComponent
      x1={x1}
      y1={y1}
      animatedProps={animatedProps}
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="6"
      strokeLinecap="round"
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
  node: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nodeActive: {
    borderColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  // The center node (anatomical representation)
  nodeCenter: {
    backgroundColor: '#F5D0C5', // Skin tone base
    borderColor: '#E2B8A8',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nipple: {
    width: 22,
    height: 22,
    backgroundColor: '#D19A87', // Darker skin tone for the center
    borderRadius: 11,
  }
});
