import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN = 16;

interface FloatingButtonProps {
  onPress: () => void;
  isMenuOpen: boolean;
  color?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  isMenuOpen,
  color = THEME.accent,
}) => {
  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - BUTTON_SIZE - MARGIN,
      y: SCREEN_HEIGHT - BUTTON_SIZE - 200,
    }),
  ).current;

  const [isDragging, setIsDragging] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only start drag if moved more than 5 pixels
        return (
          Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5
        );
      },
      onPanResponderGrant: () => {
        setIsDragging(false);
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 5,
          useNativeDriver: true,
        }).start();

        // Extract current position
        pan.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) {
          setIsDragging(true);
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();

        // Snap to nearest edge
        const currentX = (pan.x as any)._value || 0;
        const snapX =
          currentX < SCREEN_WIDTH / 2
            ? MARGIN
            : SCREEN_WIDTH - BUTTON_SIZE - MARGIN;

        Animated.spring(pan.x, {
          toValue: snapX,
          friction: 7,
          tension: 40,
          useNativeDriver: false,
        }).start();

        // If not dragged, treat as press
        if (!isDragging) {
          onPress();
        }
        setIsDragging(false);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.button,
          { backgroundColor: color },
          isMenuOpen && styles.buttonActive,
        ]}
      >
        <Icon
          name={isMenuOpen ? 'close' : 'motorbike'}
          size={28}
          color="#FFFFFF"
        />
      </View>
      {/* Pulse ring when menu is closed */}
      {!isMenuOpen && (
        <View style={[styles.pulseRing, { borderColor: color }]} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonActive: {
    backgroundColor: THEME.surfaceLight,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  pulseRing: {
    position: 'absolute',
    width: BUTTON_SIZE + 12,
    height: BUTTON_SIZE + 12,
    borderRadius: (BUTTON_SIZE + 12) / 2,
    borderWidth: 2,
    top: -6,
    left: -6,
    opacity: 0.3,
  },
});

export default FloatingButton;
