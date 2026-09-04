/**
 * Kalakar Setu — Touch & Radius Tokens
 *
 * Minimum 48dp touch targets. 4-tier radius system.
 */

export const touch = {
  minTargetSize: 48,           // WCAG AA minimum
  buttonHeight: 48,            // Standard button height
  floatingMicSize: 56,         // FAB size (reduced from 68)

  radii: {
    sm: 8,                     // Chips, badges, inline elements
    md: 12,                    // Cards, inputs, buttons
    lg: 16,                    // Image containers, modals
    full: 9999,                // Avatars, pills, FAB

    // Legacy aliases
    xs: 8,
    card: 12,
    pill: 9999,
  },

  // Legacy aliases
  buttonHeightPrimary: 48,
  buttonHeightDecision: 48,
} as const;

export type TouchTokens = typeof touch;
