import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

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
  const [pulseAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 500,
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

  const buttonColor = isRecording
    ? theme.colors.status.danger
    : theme.colors.terracotta.primary;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected: isRecording }}
        style={[
          styles.button,
          {
            backgroundColor: buttonColor,
            width: theme.touch.floatingMicSize,
            height: theme.touch.floatingMicSize,
            borderRadius: theme.touch.floatingMicSize / 2,
            ...theme.shadows.level3,
          },
        ]}
      >
        <Text variant="headlineMedium" color={theme.colors.text.inverse}>
          🎤
        </Text>
      </TouchableOpacity>
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
