import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { touch } from './touch';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  touch,
  shadows,
} as const;

export type Theme = typeof theme;
