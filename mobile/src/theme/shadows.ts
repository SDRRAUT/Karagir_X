import { ViewStyle } from 'react-native';

export const shadows = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
  // Stitch subtle organic card shadow
  level1: {
    shadowColor: '#2C1E10',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,
  // Stitch standard app card elevation
  level2: {
    shadowColor: '#2C1E10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  } as ViewStyle,
  // Stitch floating action button (FAB) terracotta glow shadow
  level3: {
    shadowColor: '#E85D2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,
  // Stitch deep bottom bar / sheet shadow
  level4: {
    shadowColor: '#2C1E10',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  } as ViewStyle,
  // Named Stitch helpers
  card: {
    shadowColor: '#2C1E10',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  } as ViewStyle,
  fab: {
    shadowColor: '#E85D2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  } as ViewStyle,
  deepCard: {
    shadowColor: '#123922',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  } as ViewStyle,
};

export type ShadowTokens = typeof shadows;
