import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'terracotta' | 'outline' | 'danger';
export type ButtonSize = 'default' | 'decision';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const theme = useTheme();

  const isOutline = variant === 'outline';
  const height = size === 'decision' ? theme.touch.buttonHeightDecision : theme.touch.buttonHeightPrimary;

  let backgroundColor: string = theme.colors.primary.emerald700;
  let textColor: string = theme.colors.text.inverse;
  let borderColor: string = 'transparent';

  switch (variant) {
    case 'terracotta':
      backgroundColor = theme.colors.terracotta.primary;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = theme.colors.primary.emerald700;
      borderColor = theme.colors.primary.emerald700;
      break;
    case 'secondary':
      backgroundColor = theme.colors.surface.subtle;
      textColor = theme.colors.primary.emerald700;
      borderColor = theme.colors.surface.border;
      break;
    case 'danger':
      backgroundColor = theme.colors.status.danger;
      break;
  }

  if (disabled) {
    backgroundColor = isOutline ? 'transparent' : theme.colors.surface.subtle;
    textColor = theme.colors.text.muted;
    borderColor = isOutline ? theme.colors.surface.border : 'transparent';
  }

  const containerStyle: ViewStyle = {
    height,
    minHeight: theme.touch.minTargetSize, // Enforces >=56dp touch boundary
    backgroundColor,
    borderRadius: theme.touch.radii.card,
    borderWidth: isOutline ? 2 : 0,
    borderColor,
    ...(!isOutline && !disabled ? theme.shadows.level1 : {}),
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[styles.base, containerStyle, style]}
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
            variant={size === 'decision' ? 'headlineMedium' : 'bodyLarge'}
            weight="bold"
            color={textColor}
            style={styles.label}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
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
    marginHorizontal: 8,
  },
  label: {
    textAlign: 'center',
  },
});
