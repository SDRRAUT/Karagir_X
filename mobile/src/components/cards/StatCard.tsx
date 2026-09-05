import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';

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
          backgroundColor: '#163D26', // Rich deep craft green with high contrast
          borderRadius: theme.touch.radii.lg,
          padding: theme.spacing.lg,
          ...theme.shadows.medium,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleWrapper}>
          <Text variant="bodyLarge" weight="medium" color="rgba(255, 255, 255, 0.85)">
            {title}
          </Text>
        </View>

        {onPressAudio && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Listen to balance"
            onPress={onPressAudio}
            style={[styles.speakerButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
          >
            <Icon name="speaker" size={18} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        variant="display"
        weight="bold"
        color={theme.colors.text.inverse}
        style={styles.amount}
      >
        {amountFormatted}
      </Text>

      <View style={styles.bottomRow}>
        {trendText && (
          <View
            style={[
              styles.trendPill,
              { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: theme.touch.radii.full },
            ]}
          >
            <Text variant="bodySmall" weight="semiBold" color={theme.colors.text.inverse}>
              {trendText}
            </Text>
          </View>
        )}
        {subtitle && (
          <Text
            variant="bodySmall"
            color="rgba(255, 255, 255, 0.8)"
            style={styles.subtitle}
          >
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
  titleWrapper: {
    flex: 1,
  },
  speakerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  trendPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subtitle: {
    marginLeft: 8,
  },
});
