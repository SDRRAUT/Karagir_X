import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gold';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'info',
  icon,
  style,
}) => {
  const theme = useTheme();

  let backgroundColor: string = theme.colors.surface.subtle;
  let textColor: string = theme.colors.text.primary;

  switch (variant) {
    case 'success':
      backgroundColor = theme.colors.primary.emerald100;
      textColor = theme.colors.primary.emerald700;
      break;
    case 'warning':
      backgroundColor = theme.colors.terracotta.light;
      textColor = theme.colors.status.warning;
      break;
    case 'danger':
      backgroundColor = '#FFEBEE';
      textColor = theme.colors.status.danger;
      break;
    case 'gold':
      backgroundColor = theme.colors.ochre.light;
      textColor = theme.colors.ochre.dark;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: theme.touch.radii.pill,
        },
        style,
      ]}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text variant="bodySmall" weight="bold" color={textColor}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 4,
    fontSize: 12,
  },
});
