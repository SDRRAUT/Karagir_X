/**
 * Kalakar Setu & KarigarX — Unified Design System Palette
 */

export const colors = {
  // Official Brand Palette
  brand: {
    DEFAULT: '#e85d2a',
    primary: '#e85d2a',
    primaryDark: '#c5491c',
    primaryLight: '#FFEEE8',
    secondary: '#1B5E3B',
    secondaryLight: '#E8F5E9',
    accent: '#D4A536',
    accentLight: '#FFF8E1',
    dark: '#c5491c',
    deep: '#9A3412',
    light: '#FFF0EA',
    container: '#FFD7C7',
  },

  // Primary Spectrum
  primary: {
    DEFAULT: '#e85d2a',
    terracotta: '#e85d2a',
    terracottaDark: '#c5491c',
    terracottaLight: '#FFF0EA',
    emerald900: '#0E2F1B',
    emerald800: '#144326',
    emerald700: '#1B5E3B',
    emerald500: '#2D8A4E',
    emerald100: '#E8F5E9',
    emerald50: '#F0F9F0',
  },

  // Forest & Teal
  forest: {
    DEFAULT: '#1b9aaa',
    primary: '#1b9aaa',
    dark: '#147582',
    light: '#E6F6F8',
    700: '#1b9aaa',
    800: '#147582',
    900: '#0E535C',
  },

  terracotta: {
    dark: '#8B2D00',
    primary: '#e85d2a',
    light: '#FFF0EA',
    accent: '#EA580C',
    600: '#c5491c',
  },

  heritageTeal: '#1b9aaa',

  teal: {
    primary: '#1b9aaa',
    secondary: '#29B6C8',
    container: '#C8EEF3',
    light: '#E6F6F8',
    dark: '#147582',
  },

  secondary: {
    DEFAULT: '#1b9aaa',
    teal: '#1b9aaa',
    container: '#C8EEF3',
    fixed: '#E6F6F8',
  },

  // Ochre Gold
  ochre: {
    dark: '#C89324',
    primary: '#f4b942',
    gold: '#f4b942',
    light: '#FFF8E7',
    border: '#FFE4A0',
    text: '#8F6204',
  },

  tertiary: {
    DEFAULT: '#f4b942',
    container: '#FFE4A0',
    dark: '#C89324',
  },

  // Indigo / Slate
  indigo: {
    dark: '#0D1E3A',
    primary: '#1B3B6F',
    light: '#E3F2FD',
  },

  // Sand / Parchment Surfaces
  sand: {
    50: '#FFFDF7',
    100: '#F5F3EB',
    200: '#ECE8DC',
    300: '#DDD8C7',
  },

  surface: {
    primary: '#FAFAF7',
    background: '#FFFDF7',
    parchment: '#FAFAF7',
    sand: '#FFFDF7',
    cream: '#FFF8F2',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    subtle: '#F3F1EC',
    container: '#F5F3EB',
    containerHigh: '#ECE8DC',
    containerLowest: '#FFFFFF',
    border: '#E8E5DF',
    borderLight: '#F5F3EB',
  },

  // Charcoal text shades
  charcoal: {
    900: '#2b2b2b',
    800: '#3D3D3D',
    700: '#525252',
    600: '#737373',
    500: '#8A8A8A',
    400: '#A3A3A3',
  },

  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    muted: '#999999',
    inverse: '#FFFFFF',
    brand: '#e85d2a',
    emerald: '#1b9aaa',
  },

  border: {
    default: '#E8E5DF',
    subtle: '#F0EDE7',
    focus: '#e85d2a',
  },

  // Semantic Status Tokens
  status: {
    success: '#1B5E3B',
    successLight: '#E8F5E9',
    warning: '#E67E22',
    warningLight: '#FFF3E0',
    error: '#D32F2F',
    errorLight: '#FFEBEE',
    info: '#1976D2',
    infoLight: '#E3F2FD',
    danger: '#D32F2F',
    offline: '#666666',
    verified: '#6C63FF',
    verifiedBg: '#F0EEFF',
    verifiedBorder: '#D6D3FF',
  },

  // Craft Marketplace Palette
  craft: {
    terracotta: '#C2410C',
    rust: '#9A3412',
    vibrant: '#EA580C',
    amber: '#F59E0B',
    gold: '#D97706',
    avatarYellow: '#FEF08A',
    discountBlue: '#0284C7',
    tint: '#FFF7ED',
    canvas: '#FAFAF9',
  },

  slate: {
    900: '#0F172A',
    800: '#1E293B',
    700: '#334155',
    600: '#475569',
    500: '#64748B',
    400: '#94A3B8',
    300: '#CBD5E1',
    200: '#E2E8F0',
    100: '#F1F5F9',
    50: '#F8FAFC',
  },
} as const;

export type ColorTokens = typeof colors;
