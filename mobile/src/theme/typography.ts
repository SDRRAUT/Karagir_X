import { Platform } from 'react-native';

export const FONT_FAMILY = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  display: 'Inter_700Bold',
  body: 'Inter_400Regular',
} as const;

export const SYSTEM_FONTS = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }) as string,
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }) as string,
  semiBold: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }) as string,
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }) as string,
  display: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }) as string,
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }) as string,
};

export const typography = {
  fonts: SYSTEM_FONTS,

  sizes: {
    display: 32,
    displayLarge: 32,
    displayMedium: 28,
    displaySmall: 24,
    headlineLarge: 24,
    headlineMedium: 20,
    headlineSmall: 18,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 10,
    caption: 12,
    numeral: 28,
    numeralExtraBold: 36,
  },

  lineHeights: {
    display: 40,
    displayLarge: 40,
    displayMedium: 36,
    displaySmall: 32,
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    bodyLarge: 24,
    bodyMedium: 20,
    bodySmall: 16,
    labelLarge: 20,
    labelMedium: 16,
    labelSmall: 14,
    caption: 16,
    numeral: 36,
    numeralExtraBold: 44,
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
    extraBold: '800' as const,
  },
} as const;

export type TypographyTokens = typeof typography;
