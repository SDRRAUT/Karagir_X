import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  iconName?: IconName;
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  iconName,
  icon,
  size = 'small',
  style,
}) => {
  const theme = useTheme();

  let backgroundColor: string = theme.colors.surface.subtle;
  let textColor: string = theme.colors.text.secondary;
  let borderColor: string = 'transparent';

  switch (variant) {
    case 'success':
      backgroundColor = theme.colors.brand.secondaryLight;
      textColor = theme.colors.brand.secondary;
      borderColor = 'rgba(27, 94, 59, 0.2)';
      break;
    case 'warning':
      backgroundColor = theme.colors.status.warningLight;
      textColor = theme.colors.status.warning;
      borderColor = 'rgba(230, 126, 34, 0.2)';
      break;
    case 'danger':
      backgroundColor = theme.colors.status.errorLight;
      textColor = theme.colors.status.error;
      borderColor = 'rgba(211, 47, 47, 0.2)';
      break;
    case 'info':
      backgroundColor = theme.colors.status.infoLight;
      textColor = theme.colors.status.info;
      borderColor = 'rgba(25, 118, 210, 0.2)';
      break;
    case 'gold':
      backgroundColor = theme.colors.brand.accentLight;
      textColor = '#7A5B0B';
      borderColor = 'rgba(212, 165, 54, 0.3)';
      break;
    case 'neutral':
    default:
      backgroundColor = theme.colors.surface.subtle;
      textColor = theme.colors.text.secondary;
      borderColor = theme.colors.border.subtle;
      break;
  }

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: theme.touch.radii.full,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 3 : 5,
        },
        style,
      ]}
      accessibilityRole="text"
    >
      {icon ? (
        <View style={styles.iconWrapper}>{icon}</View>
      ) : iconName ? (
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={isSmall ? 12 : 14} color={textColor} />
        </View>
      ) : null}
      <Text
        variant="labelMedium"
        weight="semiBold"
        color={textColor}
        style={{ fontSize: isSmall ? 11 : 12, lineHeight: isSmall ? 14 : 16 }}
      >
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
  },
  iconWrapper: {
    marginRight: 4,
  },
});
