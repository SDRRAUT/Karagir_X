import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 40,
  color,
  style,
}) => {
  const theme = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinnerColor = color || theme.colors.brand.primary;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3.5,
            borderColor: theme.colors.surface.subtle,
            borderTopColor: spinnerColor,
            transform: [{ rotate: spin }],
          },
        ]}
      />
      {message ? (
        <Text
          variant="bodyMedium"
          weight="medium"
          color={theme.colors.text.secondary}
          style={styles.message}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

export const LoadingScreen: React.FC<{ message?: string }> = ({
  message = 'कृपया प्रतीक्षा करें...',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.surface.primary }]}>
      <LoadingSpinner message={message} size={48} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
  },
});
