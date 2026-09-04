/**
 * Kalakar Setu — Motion / Animation Tokens
 *
 * Consistent timing and easing for all micro-interactions.
 */

import { Easing } from 'react-native';

export const motion = {
  duration: {
    fast: 150,
    medium: 250,
    slow: 400,
    skeleton: 1200,
  },

  easing: {
    standard: Easing.bezier(0.4, 0, 0.2, 1),
    decelerate: Easing.bezier(0, 0, 0.2, 1),
    accelerate: Easing.bezier(0.4, 0, 1, 1),
  },

  scale: {
    buttonPress: 0.97,
    cardPress: 0.98,
    pulse: 1.15,
  },
} as const;

export type MotionTokens = typeof motion;
