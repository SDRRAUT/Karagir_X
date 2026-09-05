import { ViewStyle } from 'react-native';

export const shadows = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  // Subtle neumorphic raised card shadow
  level1: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  // Standard neumorphic card elevation
  level2: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  } as ViewStyle,
  // FAB / primary button purple glow
  level3: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  } as ViewStyle,
  // Bottom bar / sheet shadow
  level4: {
    shadowColor: '#3A32B8',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  // Named helpers
  card: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  } as ViewStyle,
  fab: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  } as ViewStyle,
  deepCard: {
    shadowColor: '#4B44CC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 6,
  } as ViewStyle,
  // Neumorphic raised effect (outer shadow)
  neumorphicRaised: {
    shadowColor: '#B8B3FF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  } as ViewStyle,
  // Neumorphic inset simulation (for inputs — lighter shadow)
  neumorphicInset: {
    shadowColor: '#D0CAFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  } as ViewStyle,
};

export type ShadowTokens = typeof shadows;
