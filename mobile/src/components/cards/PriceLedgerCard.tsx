import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from './Card';
import { Icon } from '@/components/icons/Icon';

export interface PriceLedgerItem {
  icon?: string;
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
    <Card variant="surface" style={styles.container}>
      {items.map((item, index) => (
        <View key={`ledger-item-${index}`} style={styles.row}>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.labelCol}>
            {item.label}
          </Text>
          <Text variant="bodyLarge" weight="medium" color={theme.colors.text.primary}>
            ₹{item.amount.toLocaleString('en-IN')}
          </Text>
        </View>
      ))}

      <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

      <View style={styles.row}>
        <View style={styles.iconTitleRow}>
          <Icon name="sparkles" size={18} color={theme.colors.brand.primary} />
          <Text variant="bodyLarge" weight="semiBold" color={theme.colors.text.primary} style={styles.titleWithIcon}>
            AI सुझाया दाम (Suggested)
          </Text>
        </View>
        <Text variant="headlineSmall" weight="bold" color={theme.colors.brand.primary}>
          ₹{suggestedPrice.toLocaleString('en-IN')}
        </Text>
      </View>

      <View
        style={[
          styles.highlightBox,
          {
            backgroundColor: theme.colors.brand.secondaryLight,
            borderRadius: theme.touch.radii.md,
            borderColor: theme.colors.brand.secondary,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.iconTitleRow}>
            <Icon name="wallet" size={20} color={theme.colors.brand.secondary} />
            <Text variant="bodyLarge" weight="bold" color={theme.colors.brand.secondary} style={styles.titleWithIcon}>
              आपके खाते में आएंगे:
            </Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.brand.secondary}>
            ₹{takeHomeAmount.toLocaleString('en-IN')}
          </Text>
        </View>
        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.feeNote}>
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
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWithIcon: {
    marginLeft: 6,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  highlightBox: {
    padding: 14,
    marginTop: 12,
  },
  feeNote: {
    marginTop: 6,
  },
});
