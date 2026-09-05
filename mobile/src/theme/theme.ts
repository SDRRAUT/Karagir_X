import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { touch } from './touch';
import { shadows } from './shadows';
import { motion } from './motion';

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const gradients = {
  primary: ['#6C63FF', '#4F9DFF'],
  accent: ['#7B6AFF', '#64B5F6'],
  success: ['#22C55E', '#10B981'],
  surface: ['#F4F2FF', '#E0DCFF'],
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  touch,
  shadows,
  motion,
  borderRadius,
  gradients,
} as const;

export type Theme = typeof theme;
