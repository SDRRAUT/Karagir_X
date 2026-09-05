import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';

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
          backgroundColor: theme.colors.brand.secondaryLight,
          borderColor: 'rgba(27, 94, 59, 0.25)',
          borderRadius: theme.touch.radii.full,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel="Verified Artisan Badge"
    >
      <View style={styles.iconWrap}>
        <Icon name="checkCircle" size={14} color={theme.colors.brand.secondary} />
      </View>
      <Text
        variant="labelMedium"
        weight="semiBold"
        color={theme.colors.brand.secondary}
        style={styles.label}
      >
        सत्यापित कलाकार (Verified)
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
  iconWrap: {
    marginRight: 4,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
  },
});
