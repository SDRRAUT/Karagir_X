import React from 'react';
import { View, ViewProps, ViewStyle, Pressable, PressableProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type CardVariant = 'surface' | 'elevated';

export interface CardProps extends ViewProps {
  /** 'surface' = subtle border, no shadow. 'elevated' = no border, subtle shadow. */
  variant?: CardVariant;
  /** @deprecated Use variant instead. Kept for backward compatibility. */
  elevationLevel?: 0 | 1 | 2 | 3;
}

export interface PressableCardProps extends PressableProps {
  variant?: CardVariant;
}

/**
 * Card — Base container component.
 *
 * Two variants:
 * - surface: 1px subtle border, no shadow. For static content display.
 * - elevated: No border, subtle shadow. For interactive/tappable cards.
 *
 * Key rule: Border OR shadow, never both simultaneously.
 */
export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  elevationLevel,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  // Legacy backward compat: if elevationLevel is passed, map to variant behavior
  const effectiveVariant = elevationLevel !== undefined
    ? (elevationLevel >= 2 ? 'elevated' : 'surface')
    : variant;

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.touch.radii.md,
    padding: theme.spacing.cardPadding,
    ...(effectiveVariant === 'surface'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
        }
      : {
          ...theme.shadows.low,
        }
    ),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

/**
 * PressableCard — Tappable variant of Card.
 * Includes press feedback (subtle scale + opacity).
 */
export const PressableCard: React.FC<PressableCardProps> = ({
  variant = 'elevated',
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.touch.radii.md,
    padding: theme.spacing.cardPadding,
    ...(variant === 'surface'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
        }
      : {
          ...theme.shadows.low,
        }
    ),
  };

  return (
    <Pressable
      style={({ pressed }) => [
        cardStyle,
        pressed && { opacity: 0.92, transform: [{ scale: theme.motion.scale.cardPress }] },
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};
