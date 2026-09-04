export const colors = {
  // Brand Terracotta (Stitch Master Primary)
  brand: {
    DEFAULT: '#E85D2A',
    primary: '#E85D2A',
    dark: '#C84616',
    deep: '#A83300',
    light: '#FFF2EB',
    container: '#FFDBD0',
    accent: '#F97316',
  },

  // Primary Cultural Palette (Mapped to Stitch Master Tokens)
  primary: {
    DEFAULT: '#E85D2A',
    terracotta: '#E85D2A',
    terracottaDark: '#C84616',
    terracottaLight: '#FFF2EB',
    // Forest tones for heritage/earnings elements
    emerald900: '#0D2718',
    emerald800: '#123922',
    emerald700: '#1B5E38', // Verified Forest Green
    emerald500: '#256F43',
    emerald100: '#E8F5E9',
    emerald50: '#F0F9F0',
  },

  // Forest Tones
  forest: {
    DEFAULT: '#1B5E38',
    primary: '#1B5E38',
    dark: '#123922',
    light: '#E8F5E9',
    700: '#1B5E38',
    800: '#123922',
    900: '#0D2718',
  },

  // Terracotta Specific Palette
  terracotta: {
    dark: '#C84616',
    primary: '#E85D2A', // Master Primary
    light: '#FFF2EB',
    accent: '#F97316',
    600: '#C84616',
  },

  heritageTeal: '#006874',

  // Peacock & Heritage Teal (Stitch Secondary)
  teal: {
    primary: '#006874',
    secondary: '#1B9AAA',
    container: '#82ECFE',
    light: '#98F0FF',
    dark: '#004F58',
  },
  secondary: {
    DEFAULT: '#006874',
    teal: '#1B9AAA',
    container: '#82ECFE',
    fixed: '#98F0FF',
  },

  // Haldi & Marigold Ochre (Stitch Tertiary / GI Badges)
  ochre: {
    dark: '#795600',
    primary: '#F4B942', // Haldi Marigold
    gold: '#D4AF37',
    light: '#FFF7E8',
    border: '#F5DCB1',
    text: '#975B00',
  },
  tertiary: {
    DEFAULT: '#F4B942',
    container: '#FFDEA7',
    dark: '#795600',
  },

  // Indigo / Logistics / B2B Accent
  indigo: {
    dark: '#0D1E3A',
    primary: '#1B3B6F',
    light: '#E3F2FD',
  },

  // Sand, Cream & Anti-Glare Surfaces (Stitch Surfaces)
  sand: {
    50: '#FCFAF8', // Canvas / Background
    100: '#F7F3EF', // Secondary card / Subtle
    200: '#EFEAE3', // Card border
    300: '#E3DDD4', // Input border
  },
  surface: {
    background: '#FCFAF8', // Stitch Canvas
    parchment: '#FCFAF8',
    sand: '#FCFAF8',
    cream: '#FCF9F6',
    card: '#FFFFFF',
    subtle: '#F6F1EA',
    container: '#F0EDED',
    containerHigh: '#EAE7E7',
    containerLowest: '#FFFFFF',
    border: '#EFEAE3',
    borderLight: '#ECE4D8',
  },

  // Charcoal & Inks (Stitch Typography Text Colors)
  charcoal: {
    900: '#141815', // Primary Text
    800: '#1F2421',
    700: '#2B2B2B',
    600: '#59413A',
    500: '#8D7168',
    400: '#8D7168',
  },
  text: {
    primary: '#141815', // Stitch 900 Charcoal
    secondary: '#59413A', // Stitch Warm Brown Secondary
    tertiary: '#8D7168', // Stitch Outline Muted
    muted: '#8D7168', // Stitch Outline Muted
    inverse: '#FFFFFF',
    brand: '#E85D2A',
    emerald: '#1B5E38',
  },

  border: {
    subtle: '#EFEAE3',
    default: '#E1BFB5',
    focus: '#E85D2A',
  },

  // Semantic Status Tokens
  status: {
    success: '#1B5E38',
    warning: '#D35400',
    danger: '#BA1A1A',
    offline: '#59413A',
    verified: '#975B00',
    verifiedBg: '#FFF7E8',
    verifiedBorder: '#F5DCB1',
  },
} as const;

export type ColorTokens = typeof colors;
