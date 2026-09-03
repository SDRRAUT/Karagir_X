export const colors = {
  // Primary Cultural Palette
  primary: {
    emerald900: '#0E2F1B',
    emerald800: '#144326',
    emerald700: '#1E5631', // Forest Emerald (Default Primary / Money)
    emerald500: '#2D8A4E',
    emerald100: '#E8F5E9',
    emerald50: '#F0F9F0',
  },
  terracotta: {
    dark: '#7F2A00',
    primary: '#C04000', // Deep Terracotta (Commerce Actions)
    light: '#FBE9E7',
  },
  ochre: {
    dark: '#5B4A10',
    primary: '#D4AF37', // Haldi Ochre (Verified Badge / Seals)
    light: '#FFF8E1',
  },
  indigo: {
    dark: '#0D1E3A',
    primary: '#1B3B6F', // Logistics & B2B
    light: '#E3F2FD',
  },

  // Surfaces & Anti-Glare Neutrals
  surface: {
    parchment: '#F9F6F0', // Warm kora cotton background
    card: '#FFFFFF',
    subtle: '#F0EAE1',
    border: '#E0D7C9',
  },

  // Typography Text Colors
  text: {
    primary: '#1A1C1E', // Charcoal primary (15.2:1 contrast)
    secondary: '#49454F', // Charcoal secondary (6.8:1 contrast)
    muted: '#79747E',
    inverse: '#FFFFFF',
  },

  // Semantic Status Tokens
  status: {
    success: '#1E5631',
    warning: '#ED6C02',
    danger: '#B00020',
    offline: '#49454F',
  },
} as const;

export type ColorTokens = typeof colors;
