import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface CardProps extends ViewProps {
  elevationLevel?: 0 | 1 | 2 | 3;
  variant?: 'elevated' | 'outlined' | 'flat' | string;
}

export const Card: React.FC<CardProps> = ({
  elevationLevel = 1,
  variant,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const shadowStyle =
    variant === 'flat' || variant === 'outlined' || elevationLevel === 0
      ? theme.shadows.level0
      : elevationLevel === 1
      ? theme.shadows.level1
      : elevationLevel === 2
      ? theme.shadows.level2
      : theme.shadows.level3;

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.touch.radii.card,
    borderWidth: variant === 'flat' ? 0 : 1.5,
    borderColor: variant === 'flat' ? 'transparent' : theme.colors.surface.border,
    padding: theme.spacing.md,
    ...shadowStyle,
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};
