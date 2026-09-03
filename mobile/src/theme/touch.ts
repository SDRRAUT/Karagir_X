export const touch = {
  minTargetSize: 56, // Enforces 56dp x 56dp minimum touch target for rural artisans
  buttonHeightPrimary: 56,
  buttonHeightDecision: 64,
  floatingMicSize: 68,
  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    card: 16,
    pill: 999,
  },
} as const;

export type TouchTokens = typeof touch;
