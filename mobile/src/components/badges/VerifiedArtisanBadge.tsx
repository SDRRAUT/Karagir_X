import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface VerifiedArtisanBadgeProps {
  style?: ViewStyle;
}

export const VerifiedArtisanBadge: React.FC<VerifiedArtisanBadgeProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.ochre.light,
          borderColor: theme.colors.ochre.primary,
          borderRadius: theme.touch.radii.pill,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel="Verified Artisan Badge"
    >
      <Text style={styles.icon}>🛡️</Text>
      <Text variant="bodySmall" weight="bold" color={theme.colors.ochre.dark}>
        सत्यापित कलाकार (Verified) ✓
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
    fontSize: 12,
  },
});
