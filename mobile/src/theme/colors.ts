export const colors = {
  // Official Stitch Brand Terracotta (Primary)
  brand: {
    DEFAULT: '#e85d2a',
    primary: '#e85d2a',
    dark: '#c5491c',
    deep: '#9A3412',
    light: '#FFF0EA',
    container: '#FFD7C7',
    accent: '#EA580C',
  },

  // Primary Palette (Stitch Terracotta Spectrum)
  primary: {
    DEFAULT: '#e85d2a',
    terracotta: '#e85d2a',
    terracottaDark: '#c5491c',
    terracottaLight: '#FFF0EA',
    emerald900: '#2b2b2b',
    emerald800: '#3D3D3D',
    emerald700: '#e85d2a',
    emerald500: '#EA580C',
    emerald100: '#FFD7C7',
    emerald50: '#FFFDF7',
  },

  // Forest Tones
  forest: {
    DEFAULT: '#1b9aaa',
    primary: '#1b9aaa',
    dark: '#147582',
    light: '#E6F6F8',
    700: '#1b9aaa',
    800: '#147582',
    900: '#0E535C',
  },

  // Terracotta Palette
  terracotta: {
    dark: '#c5491c',
    primary: '#e85d2a',
    light: '#FFF0EA',
    accent: '#EA580C',
    600: '#c5491c',
  },

  heritageTeal: '#1b9aaa',

  // Stitch Heritage Teal (Secondary Accent)
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

  // Stitch Ochre Gold (Tertiary Accent)
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

  // Indigo → Deep Slate
  indigo: {
    dark: '#1E293B',
    primary: '#334155',
    light: '#F1F5F9',
  },

  // Stitch Sand / Canvas Surfaces
  sand: {
    50: '#FFFDF7',  // Stitch Background canvas
    100: '#F5F3EB', // Secondary container
    200: '#ECE8DC', // Card border
    300: '#DDD8C7', // Input border
  },
  surface: {
    background: '#FFFDF7',
    parchment: '#FFFDF7',
    sand: '#FFFDF7',
    cream: '#FFF8F2',
    card: '#FFFFFF',
    subtle: '#F5F3EB',
    container: '#F5F3EB',
    containerHigh: '#ECE8DC',
    containerLowest: '#FFFFFF',
    border: '#ECE8DC',
    borderLight: '#F5F3EB',
  },

  // Charcoal → Stitch Deep Neutral Text (#2b2b2b)
  charcoal: {
    900: '#2b2b2b',
    800: '#3D3D3D',
    700: '#525252',
    600: '#737373',
    500: '#8A8A8A',
    400: '#A3A3A3',
  },
  text: {
    primary: '#2b2b2b',
    secondary: '#64748B',
    tertiary: '#8A8A8A',
    muted: '#A3A3A3',
    inverse: '#FFFFFF',
    brand: '#e85d2a',
    emerald: '#1b9aaa',
  },

  border: {
    subtle: '#E0DCFF',
    default: '#D0CAFF',
    focus: '#6C63FF',
  },

  // Semantic Status Tokens
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    offline: '#6B6B8D',
    verified: '#6C63FF',
    verifiedBg: '#F0EEFF',
    verifiedBorder: '#D6D3FF',
  },

  // Kalakar Setu Official Craft Marketplace Palette (Matching UI Mockup)
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
