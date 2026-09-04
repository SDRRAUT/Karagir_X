import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { touch } from './touch';
import { shadows } from './shadows';
import { motion } from './motion';

export const theme = {
  colors,
  typography,
  spacing,
  touch,
  shadows,
  motion,
} as const;

export type Theme = typeof theme;
