import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  accessibilityLabel: string;
  size?: number;
  backgroundColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  accessibilityLabel,
  size = 56,
  backgroundColor = 'transparent',
  style,
  ...props
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    width: Math.max(size, theme.touch.minTargetSize), // Enforces minimum 56dp
    height: Math.max(size, theme.touch.minTargetSize),
    borderRadius: size / 2,
    backgroundColor,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.base, containerStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
