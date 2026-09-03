import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type TextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'numeralExtraBold';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const variantStyle: TextStyle = {
    fontSize: theme.typography.sizes[variant],
    lineHeight: theme.typography.lineHeights[variant],
    fontFamily: theme.typography.fonts[weight || 'regular'],
    fontWeight: weight ? theme.typography.weights[weight] : '400',
    color: color || theme.colors.text.primary,
    textAlign: align,
  };

  return (
    <RNText style={[styles.base, variantStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    padding: 0,
    margin: 0,
  },
});
