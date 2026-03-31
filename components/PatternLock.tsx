import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
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

// Base valid techniques according to oncology recommendations
// We use stringified arrays for easy exact-matching comparison.
const VALID_TECHNIQUES_ARRAYS = [
  // Técnica Vertical (Cortacésped) - Barriendo de borde a borde y moviéndose de columna
  [0,3,6,7,4,1,2,5,8], [6,3,0,1,4,7,8,5,2], [2,5,8,7,4,1,0,3,6], [8,5,2,1,4,7,6,3,0],
  // Técnica Horizontal (Barrido de filas)
  [0,1,2,5,4,3,6,7,8], [2,1,0,3,4,5,8,7,6], [6,7,8,5,4,3,0,1,2], [8,7,6,3,4,5,2,1,0],
  // Técnica Espiral Reloj
  [0,1,2,5,8,7,6,3,4], [2,5,8,7,6,3,0,1,4], [8,7,6,3,0,1,2,5,4], [6,3,0,1,2,5,8,7,4],
  // Técnica Espiral Contra-Reloj
  [0,3,6,7,8,5,2,1,4], [6,7,8,5,2,1,0,3,4], [8,5,2,1,0,3,6,7,4], [2,1,0,3,6,7,8,5,4],
  // Técnica Radial estricta (De borde al pezón y rebote al borde opuesto)
  [0,4,8], [8,4,0], [1,4,7], [7,4,1], [2,4,6], [6,4,2], [3,4,5], [5,4,3]
];
// Add reverses: e.g. Spiral starting from the center and going out
const REVERSED_TECHNIQUES = VALID_TECHNIQUES_ARRAYS.map(arr => [...arr].reverse());
const ALL_VALID_TECHNIQUES = [...VALID_TECHNIQUES_ARRAYS, ...REVERSED_TECHNIQUES].map(a => a.join(','));

// GLOBALLY CREATE GRAPHICS COMPONENTS TO AVOID MEMORY LEAKS (The Crash Fix)
const AnimatedLineComponent = Animated.createAnimatedComponent(Line);

export default function PatternLock({ onSuccess }: { onSuccess?: () => void }) {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [strokeColor, setStrokeColor] = useState('rgba(255, 255, 255, 0.8)');
  const currentX = useSharedValue(-1);
  const currentY = useSharedValue(-1);
  const isInteracting = useSharedValue(false);

  // Helper to append node safely
  const appendNode = (id: number) => {
    setActiveNodes((prev) => {
      // Don't append if it's already there
      if (!prev.includes(id)) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return [...prev, id];
      }
      return prev;
    });
  };

  const evaluatePattern = (nodes: number[]) => {
    if (nodes.length < 3) {
      // Too short to be anything
      return false;
    }

    const pathString = nodes.join(',');
    
    // Check if the current path matches exactly any known technique
    const isExactMatch = ALL_VALID_TECHNIQUES.includes(pathString);
    
    // We can also allow "Prefix" matching if we wanted to evaluate partials, 
    // but the user's requirement is a strict oncology pattern drawn fully.
    return isExactMatch;
  };

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      // Reset color to white when starting a new gesture
      runOnJS(setStrokeColor)('rgba(255, 255, 255, 0.8)');
      
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
        // Only evaluate if they drew something
        if (nodes.length === 0) return;

        const isValid = evaluatePattern(nodes);
        
        if (isValid) {
          // Exito Oncolo-educativo: Verde Brillante
          setStrokeColor('rgba(60, 255, 80, 0.9)');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (onSuccess) {
            // Give them time to see the green before the modal pops
            setTimeout(onSuccess, 500); 
          }
        } else {
          // Error en el examen: Rojo Peligro
          setStrokeColor('rgba(255, 60, 60, 0.9)');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        // Clear pattern after a visual delay
        setTimeout(() => {
          setActiveNodes([]);
          setStrokeColor('rgba(255, 255, 255, 0.8)');
        }, isValid ? 1500 : 1000);
      })(activeNodes);
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <View style={styles.gridContainer}>
            {/* Draw active lines using SVG */}
            <Svg height={GRID_SIZE} width={GRID_SIZE} style={StyleSheet.absoluteFill}>
              {/* Static lines for locked segments */}
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
                    stroke={strokeColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                );
              })}
              
              {/* Dynamic line following the finger while dragging */}
              {activeNodes.length > 0 && isInteracting.value && currentX.value !== -1 && (
                <ActiveAnimatedLine
                  x1={NODES[activeNodes[activeNodes.length - 1]].x}
                  y1={NODES[activeNodes[activeNodes.length - 1]].y}
                  currentX={currentX}
                  currentY={currentY}
                  color={strokeColor}
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
                  {isActive && !isCenter && <View style={[styles.innerDot, { backgroundColor: strokeColor === 'rgba(255, 255, 255, 0.8)' ? 'white' : strokeColor }]} />}
                </View>
              );
            })}
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

// Subcomponent for the dynamic line to encapsulate the useAnimatedProps cleanly
const ActiveAnimatedLine = ({ x1, y1, currentX, currentY, color }: any) => {
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
      // @ts-ignore (Reanimated props mapping)
      stroke={color}
      strokeWidth="8"
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
