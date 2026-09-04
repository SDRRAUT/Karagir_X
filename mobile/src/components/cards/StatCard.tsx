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
          backgroundColor: '#123922', // Stitch Forest Green Gradient base
          borderColor: '#27593C',
          borderRadius: theme.borderRadius.xl,
          ...theme.shadows.deepCard,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text variant="bodyMedium" weight="semiBold" color="#D1FAE5">
          {title}
        </Text>
        {onPressAudio && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Listen to balance"
            onPress={onPressAudio}
            style={styles.speakerButton}
          >
            <Text style={styles.speakerIcon}>🔊</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.amountRow}>
        <Text variant="displayLarge" weight="bold" color="#FFFFFF" style={styles.amount}>
          {amountFormatted}
        </Text>
        {trendText && (
          <View style={styles.trendPill}>
            <Text variant="caption" weight="bold" color="#D1FAE5">
              {trendText}
            </Text>
          </View>
        )}
      </View>

      {subtitle && (
        <View style={styles.bottomRow}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text variant="caption" color="#A7F3D0">
              सक्रिय भुगतान खाता:
            </Text>
          </View>
          <Text variant="caption" weight="semiBold" color="#FFFFFF">
            {subtitle}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 18,
    borderWidth: 1,
    marginVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 14,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  amount: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  trendPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#256F43',
    borderRadius: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.2)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
});
