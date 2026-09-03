import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text, StatCard, PriceLedgerCard } from '@/components';

export const KhataScreen: React.FC = () => {
  const theme = useTheme();

  const mockLedgerItems = [
    { icon: '🧵', label: 'कच्चा माल (Material Cost)', amount: 250 },
    { icon: '⏱️', label: 'मेहनत (Labor 4 Days)', amount: 1400 },
    { icon: '🎨', label: 'कला की बनावट (Complexity)', amount: 350 },
    { icon: '📦', label: 'पैकेजिंग (Eco Packaging)', amount: 60 },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          डिजिटल खाता (Digital Passbook)
        </Text>

        <StatCard
          title="कुल जीवनकाल कमाई (Lifetime Earnings)"
          amountFormatted="₹24,800"
          subtitle="18 सफल ऑर्डर्स से प्राप्त"
          onPressAudio={() => {}}
        />

        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary} style={styles.sectionTitle}>
          पारदर्शी दाम गणना (Pricing Breakdown Example)
        </Text>

        <PriceLedgerCard
          items={mockLedgerItems}
          suggestedPrice={2150}
          takeHomeAmount={2042}
          platformFeeAmount={108}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  title: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
});
