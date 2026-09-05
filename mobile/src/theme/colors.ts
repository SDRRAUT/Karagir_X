export const colors = {
  // Brand Purple (Primary)
  brand: {
    DEFAULT: '#6C63FF',
    primary: '#6C63FF',
    dark: '#4B44CC',
    deep: '#3A32B8',
    light: '#F0EEFF',
    container: '#D6D3FF',
    accent: '#7B6AFF',
  },

  // Primary Palette (Purple Spectrum)
  primary: {
    DEFAULT: '#6C63FF',
    terracotta: '#6C63FF', // Backward compat alias
    terracottaDark: '#4B44CC',
    terracottaLight: '#F0EEFF',
    // Deep violet tones for heritage/earnings elements
    emerald900: '#1A1A2E',
    emerald800: '#252547',
    emerald700: '#6C63FF', // Brand primary
    emerald500: '#8B83FF',
    emerald100: '#EDEAFF',
    emerald50: '#F5F3FF',
  },

  // Forest Tones → Deep Purple Tones
  forest: {
    DEFAULT: '#6C63FF',
    primary: '#6C63FF',
    dark: '#4B44CC',
    light: '#F0EEFF',
    700: '#6C63FF',
    800: '#4B44CC',
    900: '#3A32B8',
  },

  // Terracotta → Purple (backward compat)
  terracotta: {
    dark: '#4B44CC',
    primary: '#6C63FF',
    light: '#F0EEFF',
    accent: '#7B6AFF',
    600: '#5A52DD',
  },

  heritageTeal: '#4F9DFF',

  // Teal → Sky Blue (secondary accent)
  teal: {
    primary: '#4F9DFF',
    secondary: '#64B5F6',
    container: '#D6EBFF',
    light: '#E3F2FD',
    dark: '#2979C9',
  },
  secondary: {
    DEFAULT: '#4F9DFF',
    teal: '#64B5F6',
    container: '#D6EBFF',
    fixed: '#E3F2FD',
  },

  // Ochre → Amber/Gold (tertiary / badges)
  ochre: {
    dark: '#B8860B',
    primary: '#FFBF42',
    gold: '#DAA520',
    light: '#FFF8E1',
    border: '#FFE082',
    text: '#7C5D00',
  },
  tertiary: {
    DEFAULT: '#FFBF42',
    container: '#FFECB3',
    dark: '#B8860B',
  },

  // Indigo → Deep Purple (logistics / B2B accent)
  indigo: {
    dark: '#1A1A2E',
    primary: '#3A32B8',
    light: '#EDEAFF',
  },

  // Sand → Lavender Surfaces
  sand: {
    50: '#F4F2FF',  // Background canvas
    100: '#EDEAFF', // Secondary card
    200: '#E0DCFF', // Card border
    300: '#D0CAFF', // Input border
  },
  surface: {
    background: '#F4F2FF',
    parchment: '#F4F2FF',
    sand: '#F4F2FF',
    cream: '#F0EEFF',
    card: '#FFFFFF',
    subtle: '#EBE8FF',
    container: '#E0DCFF',
    containerHigh: '#D6D3FF',
    containerLowest: '#FFFFFF',
    border: '#E0DCFF',
    borderLight: '#EDEAFF',
  },

  // Charcoal → Deep Navy Text
  charcoal: {
    900: '#1A1A2E',
    800: '#252547',
    700: '#2D2D5E',
    600: '#6B6B8D',
    500: '#8888A8',
    400: '#8888A8',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#6B6B8D',
    tertiary: '#8888A8',
    muted: '#A0A0BE',
    inverse: '#FFFFFF',
    brand: '#6C63FF',
    emerald: '#6C63FF',
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
} as const;

export type ColorTokens = typeof colors;
