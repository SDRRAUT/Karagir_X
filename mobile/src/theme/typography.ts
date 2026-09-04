import { Platform } from 'react-native';

const sansFont = Platform.select({
  web: '"Plus Jakarta Sans", "Noto Sans Devanagari", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

const bodyFont = Platform.select({
  web: '"Manrope", "Noto Sans Devanagari", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  ios: 'System',
  default: 'sans-serif',
});

export const typography = {
  fonts: {
    regular: bodyFont,
    medium: bodyFont,
    semiBold: sansFont,
    bold: sansFont,
    display: sansFont,
    body: bodyFont,
  },
  sizes: {
    displayLarge: 32,
    displayMedium: 28,
    displaySmall: 24,
    headlineLarge: 24,
    headlineMedium: 20,
    headlineSmall: 18,
    bodyLarge: 18,
    bodyMedium: 16,
    bodySmall: 14,
    labelLarge: 16,
    labelMedium: 14,
    labelSmall: 12,
    caption: 12,
    numeralExtraBold: 36,
  },
  lineHeights: {
    displayLarge: 40,
    displayMedium: 36,
    displaySmall: 32,
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    bodyLarge: 28,
    bodyMedium: 24,
    bodySmall: 20,
    labelLarge: 20,
    labelMedium: 18,
    labelSmall: 16,
    caption: 16,
    numeralExtraBold: 44,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
} as const;

export type TypographyTokens = typeof typography;
