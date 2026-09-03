import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from './Card';

export interface PriceLedgerItem {
  icon: string;
  label: string;
  amount: number;
}

export interface PriceLedgerCardProps {
  items: PriceLedgerItem[];
  suggestedPrice: number;
  takeHomeAmount: number;
  platformFeeAmount: number;
}

export const PriceLedgerCard: React.FC<PriceLedgerCardProps> = ({
  items,
  suggestedPrice,
  takeHomeAmount,
  platformFeeAmount,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.container}>
      {items.map((item, index) => (
        <View key={`ledger-item-${index}`} style={styles.row}>
          <Text variant="bodyMedium" color={theme.colors.text.primary} style={styles.labelCol}>
            {item.icon} {item.label}
          </Text>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
            ₹{item.amount.toLocaleString('en-IN')}
          </Text>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: theme.colors.surface.border }]} />

      <View style={styles.row}>
        <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
          💰 AI सुझाया दाम (Suggested)
        </Text>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.terracotta.primary}>
          ₹{suggestedPrice.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={[styles.highlightBox, { backgroundColor: theme.colors.primary.emerald100, borderRadius: theme.touch.radii.sm }]}>
        <View style={styles.row}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald900}>
            💵 आपके खाते में आएंगे:
          </Text>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald900}>
            ₹{takeHomeAmount.toLocaleString('en-IN')}
          </Text>
        </View>
        <Text variant="bodySmall" color={theme.colors.primary.emerald700} style={styles.feeNote}>
          (5% सहयोग शुल्क: ₹{platformFeeAmount.toLocaleString('en-IN')} के बाद)
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  labelCol: {
    flex: 1,
  },
  divider: {
    height: 1.5,
    marginVertical: 10,
  },
  highlightBox: {
    padding: 12,
    marginTop: 10,
  },
  feeNote: {
    marginTop: 4,
  },
});
