import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'ghost' | 'danger';
// Legacy variants mapped to new ones
type LegacyVariant = 'primary' | 'secondary' | 'terracotta' | 'outline';

export type ButtonSize = 'default' | 'decision';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: ButtonVariant | LegacyVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const LEGACY_MAP: Record<string, ButtonVariant> = {
  primary: 'filled',
  terracotta: 'filled',
  secondary: 'tonal',
  outline: 'outlined',
};

/**
 * Button — Primary interactive component.
 *
 * Variants:
 * - filled:   Brand primary bg, white text. Main CTA.
 * - tonal:    Brand primary light bg, brand primary text. Secondary actions.
 * - outlined: Transparent bg, border, dark text. Tertiary actions.
 * - ghost:    Transparent bg, brand primary text. Inline links, cancel.
 * - danger:   Error red bg, white text. Destructive only.
 *
 * Height: 48dp for all sizes. Touch target padding handles accessibility.
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  variant: rawVariant = 'filled',
  size: _size = 'default', // size is now ignored — 48dp for all
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Map legacy variants
  const variant = LEGACY_MAP[rawVariant as string] || rawVariant as ButtonVariant;

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

  // Color resolution
  let backgroundColor: string;
  let textColor: string;
  let borderColor: string = 'transparent';
  let borderWidth: number = 0;

  switch (variant) {
    case 'filled':
      backgroundColor = theme.colors.brand.primary;
      textColor = theme.colors.text.inverse;
      break;
    case 'tonal':
      backgroundColor = theme.colors.brand.primaryLight;
      textColor = theme.colors.brand.primary;
      break;
    case 'outlined':
      backgroundColor = 'transparent';
      textColor = theme.colors.text.primary;
      borderColor = theme.colors.border.default;
      borderWidth = 1;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = theme.colors.brand.primary;
      break;
    case 'danger':
      backgroundColor = theme.colors.status.error;
      textColor = theme.colors.text.inverse;
      break;
    default:
      backgroundColor = theme.colors.brand.primary;
      textColor = theme.colors.text.inverse;
  }

  // Disabled overrides
  if (disabled) {
    backgroundColor = variant === 'ghost' || variant === 'outlined'
      ? 'transparent'
      : theme.colors.surface.subtle;
    textColor = theme.colors.text.tertiary;
    borderColor = variant === 'outlined' ? theme.colors.border.default : 'transparent';
  }

  const containerStyle: ViewStyle = {
    height: theme.touch.buttonHeight,
    minHeight: theme.touch.minTargetSize,
    backgroundColor,
    borderRadius: theme.touch.radii.md,
    borderWidth,
    borderColor,
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, typeof style === 'object' ? style : undefined]}>
      <Pressable
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, containerStyle]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}
            <Text
              variant="labelLarge"
              weight="semiBold"
              color={textColor}
              style={styles.label}
            >
              {label}
            </Text>
            {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginHorizontal: 6,
  },
  label: {
    textAlign: 'center',
  },
});
