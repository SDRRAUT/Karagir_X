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

export type ButtonVariant = 'primary' | 'secondary' | 'terracotta' | 'outline' | 'danger' | 'forest';
export type ButtonSize = 'default' | 'decision' | 'sm';

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
  const height =
    size === 'decision'
      ? theme.touch.buttonHeightDecision
      : size === 'sm'
      ? 44
      : theme.touch.buttonHeightPrimary;

  let backgroundColor: string = theme.colors.brand.primary; // Stitch Terracotta #E85D2A
  let textColor: string = theme.colors.text.inverse;
  let borderColor: string = 'transparent';

  switch (variant) {
    case 'primary':
    case 'terracotta':
      backgroundColor = theme.colors.brand.primary;
      textColor = theme.colors.text.inverse;
      break;
    case 'outline':
      backgroundColor = 'transparent';
      textColor = theme.colors.brand.primary;
      borderColor = theme.colors.brand.primary;
      break;
    case 'secondary':
      backgroundColor = theme.colors.surface.subtle; // #F6F1EA
      textColor = theme.colors.charcoal[900];
      borderColor = theme.colors.surface.border; // #EFEAE3
      break;
    case 'forest':
      backgroundColor = theme.colors.primary.emerald700; // #1B5E38
      textColor = theme.colors.text.inverse;
      break;
    case 'danger':
      backgroundColor = theme.colors.status.danger;
      textColor = theme.colors.text.inverse;
      break;
  }

  if (disabled) {
    backgroundColor = isOutline ? 'transparent' : theme.colors.sand[200];
    textColor = theme.colors.text.muted;
    borderColor = isOutline ? theme.colors.surface.border : 'transparent';
  }

  const containerStyle: ViewStyle = {
    height,
    minHeight: size === 'sm' ? 44 : theme.touch.minTargetSize,
    backgroundColor,
    borderRadius: theme.borderRadius.lg, // Stitch 12px
    borderWidth: isOutline || variant === 'secondary' ? 1.5 : 0,
    borderColor,
    ...(!isOutline && !disabled ? (variant === 'primary' ? theme.shadows.level2 : theme.shadows.level1) : {}),
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
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
            variant={size === 'decision' ? 'headlineMedium' : size === 'sm' ? 'bodySmall' : 'bodyLarge'}
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
