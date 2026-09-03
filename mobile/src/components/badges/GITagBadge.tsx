import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface GITagBadgeProps {
  style?: ViewStyle;
}

export const GITagBadge: React.FC<GITagBadgeProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.ochre.dark,
          borderRadius: theme.touch.radii.xs,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel="Geographical Indication Heritage Certified"
    >
      <Text style={styles.icon}>🏛️</Text>
      <Text variant="bodySmall" weight="bold" color={theme.colors.ochre.light}>
        GI TAGGED HERITAGE
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
    fontSize: 10,
  },
});
