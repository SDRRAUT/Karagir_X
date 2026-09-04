import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon, IconName } from '@/components/icons/Icon';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon?: React.ReactNode;
  iconName?: IconName;
  iconColor?: string;
  accessibilityLabel: string;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
  variant?: 'surface' | 'ghost' | 'filled';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconName,
  iconColor,
  accessibilityLabel,
  size = 44,
  iconSize = 22,
  backgroundColor,
  variant = 'surface',
  style,
  onPress,
  disabled,
  ...props
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: theme.motion.scale.buttonPress,
      duration: theme.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, theme]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: theme.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, theme]);

  const handlePress = useCallback(
    (e: any) => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onPress?.(e);
    },
    [onPress]
  );

  let bg = backgroundColor;
  let borderCol = 'transparent';
  let borderW = 0;

  if (!bg) {
    if (variant === 'filled') {
      bg = theme.colors.brand.primary;
    } else if (variant === 'surface') {
      bg = theme.colors.surface.card;
      borderCol = theme.colors.border.default;
      borderW = 1;
    } else {
      bg = 'transparent';
    }
  }

  const defaultIconColor =
    iconColor ||
    (variant === 'filled'
      ? theme.colors.text.inverse
      : theme.colors.text.primary);

  const containerStyle: ViewStyle = {
    width: Math.max(size, 40),
    height: Math.max(size, 40),
    borderRadius: size / 2,
    backgroundColor: bg,
    borderColor: borderCol,
    borderWidth: borderW,
    opacity: disabled ? 0.4 : 1,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        disabled={disabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, containerStyle, style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: !!disabled }}
        hitSlop={8}
        {...props}
      >
        {icon ? (
          icon
        ) : iconName ? (
          <Icon name={iconName} size={iconSize} color={defaultIconColor} />
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
