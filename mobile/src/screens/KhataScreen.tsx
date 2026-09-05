import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { AppHeader } from '@/components/navigation/AppHeader';

export const KhataScreen: React.FC = () => {
  const theme = useTheme();

  const ledgerItems = [
    { icon: '🧵', label: 'कच्चा माल (Raw Materials)', amount: '₹250' },
    { icon: '⏱️', label: 'कारीगर मेहनत (Labor 4 Days)', amount: '₹1,400' },
    { icon: '🎨', label: 'पारंपरिक शिल्प कौशल (GI Skill)', amount: '₹350' },
    { icon: '📦', label: 'पर्यावरण-अनुकूल पैकेजिंग (Packaging)', amount: '₹60' },
  ];

  const recentTransactions = [
    {
      id: 'tx-1',
      title: 'Order #KS-83901 — टेराकोटा दीप',
      date: 'आज, 09:45 AM',
      amount: '+₹2,090',
      type: 'CREDIT',
      status: 'बैंक में जमा (Settled)',
      utr: 'UTR-981240129',
    },
    {
      id: 'tx-2',
      title: 'B2B एडवांस भुगतान — TCS बल्क क्लस्टर',
      date: 'कल, 04:30 PM',
      amount: '+₹7,500',
      type: 'CREDIT',
      status: 'एस्क्रो रिलीज (Escrow Release)',
      utr: 'UTR-849102834',
    },
    {
      id: 'tx-3',
      title: 'मासिक पैकेजिंग सामग्री आपूर्ति',
      date: '28 अगस्त, 11:20 AM',
      amount: '-₹850',
      type: 'DEBIT',
      status: 'सामग्री भुगतान',
      utr: 'UPI-3029104',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="डिजिटल खाता"
        subtitle="Passbook & Fair Share Ledger"
        showDevanagariLogo={true}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lifetime Earnings Stat Hero Card (Stitch Forest Green Earnings Style) */}
        <Card style={[styles.heroCard, { backgroundColor: '#4B44CC', borderColor: '#27593C' }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text variant="labelMedium" color="#D6D3FF">
                कुल जीवनकाल कमाई (Lifetime Payouts)
              </Text>
              <Text variant="displaySmall" weight="bold" color="#FFFFFF" style={{ marginTop: 4 }}>
                ₹24,800
              </Text>
            </View>
            <View style={[styles.audioPromptCircle, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
              <Text style={{ fontSize: 18 }}>🔊</Text>
            </View>
          </View>

          <View style={styles.heroSubRow}>
            <View style={styles.heroSubItem}>
              <Text variant="labelSmall" color="#D6D3FF">
                सफल ऑर्डर्स
              </Text>
              <Text variant="labelLarge" weight="bold" color="#FFFFFF">
                18 ऑर्डर्स
              </Text>
            </View>
            <View style={[styles.vDivider, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]} />
            <View style={styles.heroSubItem}>
              <Text variant="labelSmall" color="#D6D3FF">
                एस्क्रो में सुरक्षित
              </Text>
              <Text variant="labelLarge" weight="bold" color="#FFFFFF">
                ₹2,892
              </Text>
            </View>
            <View style={[styles.vDivider, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]} />
            <View style={styles.heroSubItem}>
              <Text variant="labelSmall" color="#D6D3FF">
                अगला भुगतान
              </Text>
              <Text variant="labelLarge" weight="bold" color="#FFFFFF">
                कल 10 AM
              </Text>
            </View>
          </View>
        </Card>

        {/* Bank & Payout Destination */}
        <Card style={styles.bankCard}>
          <View style={styles.bankRow}>
            <View style={[styles.bankIconCircle, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
              <Text style={{ fontSize: 20 }}>🏦</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                State Bank of India (SBI)
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                खाता: •••• 4021 • ऑटो-क्रेडिट सक्रिय
              </Text>
            </View>
            <View style={[styles.activePill, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
              <Text variant="labelSmall" weight="bold" color="#6C63FF">
                UPI सक्रिय ✓
              </Text>
            </View>
          </View>
        </Card>

        {/* Fair Share Pricing Breakdown Ledger */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            पारदर्शी दाम गणना (Fair Share Ledger)
          </Text>
        </View>

        <Card style={styles.ledgerCard}>
          <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginBottom: 12 }}>
            कलाकार सेतु 100% पारदर्शी नीति — हर रुपए का स्पष्ट हिसाब:
          </Text>

          {ledgerItems.map((item, idx) => (
            <View key={idx} style={styles.ledgerItemRow}>
              <View style={styles.ledgerItemLeft}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>{item.icon}</Text>
                <Text variant="labelMedium" color={theme.colors.text.primary}>
                  {item.label}
                </Text>
              </View>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                {item.amount}
              </Text>
            </View>
          ))}

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 12 }]} />

          <View style={styles.summaryRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              ग्राहक द्वारा कुल देय दाम:
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              ₹2,150
            </Text>
          </View>

          <View style={[styles.payoutHighlight, { backgroundColor: 'rgba(108, 99, 255, 0.08)' }]}>
            <View>
              <Text variant="labelMedium" weight="bold" color="#6C63FF">
                कारीगर को सीधा भुगतान (95%):
              </Text>
              <Text variant="labelSmall" color="#6C63FF">
                प्लेटफ़ॉर्म व AI सुविधा शुल्क केवल 5% (₹108)
              </Text>
            </View>
            <Text variant="headlineSmall" weight="bold" color="#6C63FF">
              ₹2,042
            </Text>
          </View>
        </Card>

        {/* Recent Passbook Transactions */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            हालिया लेन-देन (Passbook Entries)
          </Text>
        </View>

        <Card style={styles.txCard}>
          {recentTransactions.map((tx, idx) => (
            <View key={tx.id}>
              <View style={styles.txRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {tx.date} • {tx.utr}
                  </Text>
                  <Text
                    variant="labelSmall"
                    weight="bold"
                    color={tx.type === 'CREDIT' ? '#6C63FF' : theme.colors.terracotta.primary}
                    style={{ marginTop: 2 }}
                  >
                    {tx.status}
                  </Text>
                </View>
                <Text
                  variant="labelLarge"
                  weight="bold"
                  color={tx.type === 'CREDIT' ? '#6C63FF' : '#EF4444'}
                >
                  {tx.amount}
                </Text>
              </View>
              {idx < recentTransactions.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 10 }]} />
              )}
            </View>
          ))}
        </Card>

        {/* Instant UPI Withdraw Button */}
        <Button
          label="तत्काल बैंक ट्रांसफर (Instant UPI Transfer)"
          variant="primary"
          onPress={() => {}}
          style={styles.withdrawBtn}
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
  heroCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  audioPromptCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  heroSubItem: {
    alignItems: 'center',
  },
  vDivider: {
    width: 1,
    height: 28,
  },
  bankCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 12,
  },
  ledgerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  ledgerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  ledgerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    height: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  payoutHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  txCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  withdrawBtn: {
    marginBottom: 20,
  },
});
