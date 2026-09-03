import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface StatCardProps {
  title: string;
  amountFormatted: string;
  trendText?: string;
  subtitle?: string;
  onPressAudio?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amountFormatted,
  trendText,
  subtitle,
  onPressAudio,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary.emerald900,
          borderRadius: theme.touch.radii.card,
          padding: theme.spacing.md,
          ...theme.shadows.level2,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text variant="bodyLarge" weight="medium" color={theme.colors.primary.emerald100}>
          {title}
        </Text>
        {onPressAudio && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Listen to balance"
            onPress={onPressAudio}
            style={styles.speakerButton}
          >
            <Text variant="headlineMedium" color={theme.colors.text.inverse}>
              🔊
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text variant="displayLarge" weight="bold" color={theme.colors.text.inverse} style={styles.amount}>
        {amountFormatted}
      </Text>

      <View style={styles.bottomRow}>
        {trendText && (
          <View
            style={[
              styles.trendPill,
              { backgroundColor: theme.colors.primary.emerald700, borderRadius: theme.touch.radii.sm },
            ]}
          >
            <Text variant="bodySmall" weight="bold" color={theme.colors.text.inverse}>
              {trendText}
            </Text>
          </View>
        )}
        {subtitle && (
          <Text variant="bodySmall" color={theme.colors.primary.emerald100} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakerButton: {
    padding: 4,
  },
  amount: {
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  trendPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subtitle: {
    marginLeft: 8,
  },
});
