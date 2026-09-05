import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Animated, ViewStyle, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/icons/Icon';

export interface FloatingMicButtonProps {
  isRecording?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({
  isRecording = false,
  onPress,
  accessibilityLabel = 'Voice Assistant',
  style,
}) => {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 450,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      animation?.stop();
    };
  }, [isRecording, pulseAnim]);

  const handlePress = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onPress();
  }, [onPress]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.94,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const buttonColor = isRecording
    ? theme.colors.status.error
    : theme.colors.brand.primary;

  const fabSize = theme.touch.floatingMicSize || 56;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }],
        },
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected: isRecording }}
        style={[
          styles.button,
          {
            backgroundColor: buttonColor,
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
            ...theme.shadows.medium,
          },
        ]}
      >
        <Icon
          name="microphone"
          size={28}
          color={theme.colors.text.inverse}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 999,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
