/**
 * Kalakar Setu — Unified Color Tokens
 *
 * Design direction: Terracotta warmth, premium simplicity, purposeful restraint.
 * Terracotta = primary brand. Green = money/success only. Gold = trust/verified.
 *
 * Migration note: Old tokens (primary.emerald*, terracotta.*, ochre.*, indigo.*,
 * surface.parchment, heritage.*) are preserved as aliases below to avoid
 * breaking existing screens. They will be removed once all screens are migrated.
 */

// ─── New Unified Palette ─────────────────────────────────────────────

export const colors = {
  // ── Brand Colors ──────────────────────────────────────────────────
  brand: {
    primary: '#C04000',       // Terracotta — primary CTA, brand accent
    primaryDark: '#8B2D00',   // Pressed / active state
    primaryLight: '#FFEEE8',  // Tinted backgrounds, selected state
    secondary: '#1B5E3B',     // Money, success, earnings
    secondaryLight: '#E8F5E9', // Success backgrounds
    accent: '#D4A536',        // Verified badges, GI tag, trust elements
    accentLight: '#FFF8E1',   // Trust section backgrounds
  },

  // ── Surface / Background ──────────────────────────────────────────
  surface: {
    primary: '#FAFAF7',       // Main screen background (refined warm white)
    card: '#FFFFFF',          // Card backgrounds
    elevated: '#FFFFFF',      // Bottom sheets, modals
    subtle: '#F3F1EC',        // Secondary backgrounds, divider areas
    // Legacy alias — will be removed after migration
    parchment: '#FAFAF7',
    border: '#E8E5DF',
  },

  // ── Text Colors ───────────────────────────────────────────────────
  text: {
    primary: '#1A1A1A',       // Headlines, primary body (15:1 contrast)
    secondary: '#666666',     // Secondary body, descriptions
    tertiary: '#999999',      // Captions, timestamps, placeholders
    inverse: '#FFFFFF',       // Text on dark/brand backgrounds
    // Legacy alias
    muted: '#999999',
  },

  // ── Border Colors ─────────────────────────────────────────────────
  border: {
    default: '#E8E5DF',       // Cards, inputs at rest
    subtle: '#F0EDE7',        // Dividers, separators
    focus: '#C04000',         // Focus rings (matches brand.primary)
  },

  // ── Status / Semantic ─────────────────────────────────────────────
  status: {
    success: '#1B5E3B',
    successLight: '#E8F5E9',
    warning: '#E67E22',
    warningLight: '#FFF3E0',
    error: '#D32F2F',
    errorLight: '#FFEBEE',
    info: '#1976D2',
    infoLight: '#E3F2FD',
    // Legacy alias
    danger: '#D32F2F',
    offline: '#666666',
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGACY ALIASES — Preserved to avoid breaking existing screens.
  // These map old token paths to new unified values.
  // Remove after all screens are migrated.
  // ═══════════════════════════════════════════════════════════════════
  primary: {
    emerald900: '#0E2F1B',
    emerald800: '#144326',
    emerald700: '#1B5E3B',   // → brand.secondary
    emerald500: '#2D8A4E',
    emerald100: '#E8F5E9',   // → brand.secondaryLight
    emerald50: '#F0F9F0',
  },
  terracotta: {
    dark: '#8B2D00',         // → brand.primaryDark
    primary: '#C04000',      // → brand.primary
    light: '#FFEEE8',        // → brand.primaryLight
  },
  ochre: {
    dark: '#5B4A10',
    primary: '#D4A536',      // → brand.accent
    light: '#FFF8E1',        // → brand.accentLight
  },
  indigo: {
    dark: '#0D1E3A',
    primary: '#1B3B6F',
    light: '#E3F2FD',
  },
} as const;

export type ColorTokens = typeof colors;
