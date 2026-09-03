import { Platform } from 'react-native';

export const typography = {
  fonts: {
    regular: Platform.select({ ios: 'System', android: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    semiBold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
    bold: Platform.select({ ios: 'System', android: 'sans-serif-condensed' }),
  },
  sizes: {
    displayLarge: 32,
    displayMedium: 28,
    headlineLarge: 24,
    headlineMedium: 20,
    headlineSmall: 18,
    bodyLarge: 18,
    bodyMedium: 16,
    bodySmall: 14,
    numeralExtraBold: 36,
  },
  lineHeights: {
    // 1.45x - 1.55x multiplier for Indic script descender and matra protection
    displayLarge: 44,
    displayMedium: 38,
    headlineLarge: 34,
    headlineMedium: 30,
    headlineSmall: 26,
    bodyLarge: 28,
    bodyMedium: 24,
    bodySmall: 20,
    numeralExtraBold: 46,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type TypographyTokens = typeof typography;
