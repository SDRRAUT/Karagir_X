import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type TextVariant =
  | 'display'
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'caption'
  | 'numeral'
  | 'numeralExtraBold';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'normal';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyLarge',
  color,
  weight,
  align = 'left',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const resolvedWeight =
    weight === 'normal'
      ? 'regular'
      : weight === 'extraBold'
      ? 'bold'
      : weight ||
        (variant.startsWith('headline') || variant.startsWith('display') ? 'bold' : 'regular');

  const letterSpacing = theme.typography.letterSpacing
    ? (theme.typography.letterSpacing[variant as keyof typeof theme.typography.letterSpacing] ?? 0)
    : 0;

  const variantStyle: TextStyle = {
    fontSize: theme.typography.sizes[variant] || 16,
    lineHeight: theme.typography.lineHeights[variant] || 24,
    letterSpacing,
    fontFamily: theme.typography.fonts[resolvedWeight] || theme.typography.fonts.regular,
    fontWeight: theme.typography.weights[resolvedWeight] || '400',
    color: color || theme.colors.text.primary,
    textAlign: align,
  };

  return (
    <RNText style={[variantStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
