import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { touch } from './touch';
import { shadows } from './shadows';

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  touch,
  shadows,
  borderRadius,
} as const;

export type Theme = typeof theme;
