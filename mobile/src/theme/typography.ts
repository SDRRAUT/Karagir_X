/**
 * Kalakar Setu — Typography Tokens
 *
 * Typeface: Inter (loaded via expo-font). Falls back to system sans-serif.
 * Indic scripts (Devanagari, Bengali, Tamil, etc.) use Noto Sans via system fallback.
 *
 * Line heights: 1.4x multiplier for Latin, 1.5x for Indic script protection.
 */

import { Platform } from 'react-native';

export const FONT_FAMILY = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

// System fallbacks used until fonts are loaded
export const SYSTEM_FONTS = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif' }) as string,
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium' }) as string,
  semiBold: Platform.select({ ios: 'System', android: 'sans-serif-medium' }) as string,
  bold: Platform.select({ ios: 'System', android: 'sans-serif' }) as string,
};

export const typography = {
  fonts: SYSTEM_FONTS, // Will be swapped to FONT_FAMILY once fonts load

  sizes: {
    display: 32,
    headlineLarge: 24,
    headlineMedium: 20,
    headlineSmall: 17,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    numeral: 28,
    // Legacy aliases — map old names to new values
    displayLarge: 32,
    displayMedium: 28,
    numeralExtraBold: 28,
  },

  lineHeights: {
    display: 40,
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    bodyLarge: 24,
    bodyMedium: 20,
    bodySmall: 16,
    labelLarge: 20,
    labelMedium: 16,
    numeral: 36,
    // Legacy aliases
    displayLarge: 40,
    displayMedium: 36,
    numeralExtraBold: 36,
  },

  letterSpacing: {
    display: -0.02,
    headlineLarge: -0.01,
    headlineMedium: 0,
    headlineSmall: 0,
    bodyLarge: 0,
    bodyMedium: 0,
    bodySmall: 0.02,
    labelLarge: 0.02,
    labelMedium: 0.04,
    numeral: 0,
  },

  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;

export type TypographyTokens = typeof typography;
