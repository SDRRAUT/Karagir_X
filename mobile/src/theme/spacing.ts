/**
 * Kalakar Setu — Spacing Tokens
 *
 * 8-point grid system. Screen margins = 20px. Section gaps = 32px.
 */

export const spacing = {
  xs: 4,        // Inline gaps (icon + label)
  sm: 8,        // Tight component padding
  md: 12,       // Card internal padding, small gaps
  lg: 16,       // Default component spacing
  xl: 20,       // Screen horizontal margins
  '2xl': 24,    // Section gaps
  '3xl': 32,    // Major section separation
  '4xl': 48,    // Full-page vertical breathing room

  // Semantic aliases
  screenMargin: 20,
  sectionGap: 32,
  cardPadding: 16,
  inlinePadding: 12,

  // Legacy aliases — will be removed after migration
  xxs: 2,
} as const;

export type SpacingTokens = typeof spacing;
