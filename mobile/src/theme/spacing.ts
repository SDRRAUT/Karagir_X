export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16, // Base Gutter & screen margin
  lg: 24, // Section margin
  xl: 32, // Landmark gap
  xxl: 48,
} as const;

export type SpacingTokens = typeof spacing;
