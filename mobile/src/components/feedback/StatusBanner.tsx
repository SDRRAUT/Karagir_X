import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export type BannerType = 'offline' | 'warning' | 'error' | 'success';

export interface StatusBannerProps {
  message: string;
  type?: BannerType;
  icon?: string;
  style?: ViewStyle;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  message,
  type = 'offline',
  icon,
  style,
}) => {
  const theme = useTheme();

  let backgroundColor: string = theme.colors.status.offline;
  let defaultIcon = '📡';

  switch (type) {
    case 'warning':
      backgroundColor = theme.colors.status.warning;
      defaultIcon = '⚠️';
      break;
    case 'error':
      backgroundColor = theme.colors.status.danger;
      defaultIcon = '❌';
      break;
    case 'success':
      backgroundColor = theme.colors.status.success;
      defaultIcon = '✓';
      break;
  }

  return (
    <View style={[styles.banner, { backgroundColor }, style]}>
      <Text style={styles.icon}>{icon || defaultIcon}</Text>
      <Text variant="bodySmall" weight="bold" color={theme.colors.text.inverse} style={styles.text}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  text: {
    textAlign: 'center',
  },
});
