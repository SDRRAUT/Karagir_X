import React from 'react';
import { View, ViewProps, ViewStyle, Pressable, PressableProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export type CardVariant = 'surface' | 'elevated' | 'flat' | 'outlined';

export interface CardProps extends ViewProps {
  /** 'surface' / 'flat' = subtle border, no shadow. 'elevated' = no border, subtle shadow. */
  variant?: CardVariant;
  /** @deprecated Use variant instead. Kept for backward compatibility. */
  elevationLevel?: 0 | 1 | 2 | 3;
}

export interface PressableCardProps extends PressableProps {
  variant?: CardVariant;
  elevationLevel?: 0 | 1 | 2 | 3;
}

/**
 * Card — Base container component.
 */
export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  elevationLevel,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const isElevated =
    variant === 'elevated' || (elevationLevel !== undefined && elevationLevel >= 2);

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.touch.radii.md,
    padding: theme.spacing.cardPadding,
    ...(isElevated
      ? {
          ...theme.shadows.low,
        }
      : {
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
        }),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

/**
 * PressableCard — Tappable variant of Card.
 */
export const PressableCard: React.FC<PressableCardProps> = ({
  variant = 'elevated',
  elevationLevel,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const isElevated =
    variant === 'elevated' || (elevationLevel !== undefined && elevationLevel >= 2);

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.touch.radii.md,
    padding: theme.spacing.cardPadding,
    ...(isElevated
      ? {
          ...theme.shadows.low,
        }
      : {
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
        }),
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
