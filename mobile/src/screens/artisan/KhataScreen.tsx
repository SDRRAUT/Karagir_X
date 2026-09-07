import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';

const { width } = Dimensions.get('window');

export const KhataScreen: React.FC<{ navigation?: any; embedded?: boolean }> = ({
  navigation,
  embedded = false,
}) => {
  const insets = useSafeAreaInsets();
  const [loanApplied, setLoanApplied] = useState(false);

  const handleSpeak = (text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleApplyCredit = () => {
    setLoanApplied(true);
    handleSpeak('Badhaai ho! Aapka Karigar credit loan pachhees hazaar rupaye pre-approved hokar submit ho gaya hai.');
  };

  return (
    <View style={[styles.container, !embedded && { paddingTop: insets.top }]}>
      {/* Standalone Header */}
      {!embedded && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (navigation?.canGoBack?.() ? navigation.goBack() : navigation?.navigate?.('HomeTab'))}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>💰 मेरा खाता (Khata)</Text>
            <Text style={styles.headerSub}>100% Transparent Fair Price Ledger</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              handleSpeak(
                'Aapki kul kamai chaubees hazaar aath sau rupaye hai. Escrow mein do hazaar aath sau baanve rupaye surakshit hain. Agla payout kal subah das baje aapke State Bank of India khate mein credit hoga.'
              )
            }
            style={styles.headerAudioBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.headerAudioIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollBody, embedded && { paddingBottom: 130 }]}
      >
        {/* 1. BIG EARNINGS CARD */}
        <View style={styles.bigEarningsCard}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardLabel}>कुल कमाई (Total Earnings)</Text>
            <TouchableOpacity
              onPress={() =>
                handleSpeak('Kul kamai chaubees hazaar aath sau rupaye. Is mahine teen hazaar do sau rupaye badhe hain.')
              }
              style={styles.cardAudioBtn}
            >
              <Text style={styles.cardAudioText}>🔊 Suno</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardAmount}>₹ 24,800</Text>

          <View style={styles.monthlyGrowthPill}>
            <Text style={styles.monthlyGrowthText}>📈 Is mahine +₹3,200</Text>
          </View>

          <View style={styles.bankStatusRow}>
            <Text style={styles.bankNameText}>🏦 SBI ••••4021 ✓ Active</Text>
            <Text style={styles.autoCreditText}>🔄 Auto-credit ON</Text>
          </View>
        </View>

        {/* 2. ESCROW STATUS STRIP */}
        <View style={styles.escrowCard}>
          <View style={styles.escrowRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.escrowTitle}>🔒 Escrow mein safe: ₹2,892</Text>
              <Text style={styles.escrowSub}>(3 orders complete hone par milega)</Text>
            </View>
            <View style={styles.payoutTimeBadge}>
              <Text style={styles.payoutTimeText}>⏰ Next payout: Kal 10 AM</Text>
            </View>
          </View>
        </View>

        {/* 3. 100% TRANSPARENT PRICE BREAKDOWN LEDGER (Anti-Exploitation USP) */}
        <View style={styles.ledgerSectionCard}>
          <View style={styles.ledgerHeaderRow}>
            <View>
              <Text style={styles.ledgerSectionTitle}>💎 100% TRANSPARENT BREAKDOWN (USP)</Text>
              <Text style={styles.ledgerSectionSub}>Last Sale: Terracotta Diya Set × 2</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleSpeak(
                  'Customer ne kul do hazaar ek sau pachas rupaye diye. Mitti aur rang do sau pachas rupaye, aapki mehnat chaudah sau rupaye, GI skill bonus teen sau pachas rupaye, packing saath rupaye, platform fee ek sau aath rupaye. Aapko mila do hazaar bayalees rupaye, yani pachaanve pratishat.'
                )
              }
              style={styles.ledgerAudioBtn}
            >
              <Text style={styles.ledgerAudioText}>🔊 पूरा सुनो</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ledgerTable}>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>Customer ne diye (Paid):</Text>
              <Text style={styles.ledgerCustomerVal}>₹2,150</Text>
            </View>
            <View style={styles.ledgerDivider} />

            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerItemLabel}>Mitti + Rang (Raw Material):</Text>
              <Text style={styles.ledgerDebitVal}>-₹250</Text>
            </View>

            <View style={[styles.ledgerRow, styles.ledgerRowGreen]}>
              <Text style={styles.ledgerHighlightLabel}>Aapki Mehnat (Labor Hours):</Text>
              <Text style={styles.ledgerHighlightVal}>+₹1,400 ✓</Text>
            </View>

            <View style={[styles.ledgerRow, styles.ledgerRowGreen]}>
              <Text style={styles.ledgerHighlightLabel}>GI Skill Bonus (Heritage Craft):</Text>
              <Text style={styles.ledgerHighlightVal}>+₹350 ✓</Text>
            </View>

            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerItemLabel}>Eco Packaging:</Text>
              <Text style={styles.ledgerDebitVal}>-₹60</Text>
            </View>

            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerItemLabel}>Platform Tech Fee (5%):</Text>
              <Text style={styles.ledgerDebitVal}>-₹108</Text>
            </View>
            <View style={styles.ledgerDivider} />

            {/* Artisan Take Home (95%) */}
            <View style={styles.ledgerFinalRow}>
              <View>
                <Text style={styles.ledgerFinalLabel}>💰 Aapko Mila (Take-Home):</Text>
                <Text style={styles.ledgerFinalSub}>(95% of total paid by customer)</Text>
              </View>
              <Text style={styles.ledgerFinalAmount}>₹2,042</Text>
            </View>
          </View>
        </View>

        {/* 4. PASSBOOK (TRANSACTIONS LEDGER) */}
        <View style={styles.passbookSection}>
          <View style={styles.passbookHeaderRow}>
            <Text style={styles.passbookTitle}>📜 Passbook (Ledger)</Text>
            <Text style={styles.passbookSub}>Auditable Bank UTRs</Text>
          </View>

          <View style={styles.transactionsList}>
            {/* Tx 1 */}
            <View style={styles.txCard}>
              <View style={styles.txLeft}>
                <Text style={styles.txTitle}>+₹2,042  Order Payment</Text>
                <Text style={styles.txSub}>6 Sept • UTR: 902837482910</Text>
              </View>
              <View style={styles.txBadgeCredit}>
                <Text style={styles.txBadgeCreditText}>Bank Transfer ✓</Text>
              </View>
            </View>

            {/* Tx 2 */}
            <View style={styles.txCard}>
              <View style={styles.txLeft}>
                <Text style={styles.txTitle}>+₹1,800  Mela Mode Sale</Text>
                <Text style={styles.txSub}>5 Sept • UPI Direct Settlement</Text>
              </View>
              <View style={styles.txBadgeCredit}>
                <Text style={styles.txBadgeCreditText}>UPI Instant ✓</Text>
              </View>
            </View>

            {/* Tx 3 */}
            <View style={styles.txCard}>
              <View style={styles.txLeft}>
                <Text style={styles.txTitle}>+₹15,000 PM Vishwakarma Grant</Text>
                <Text style={styles.txSub}>1 Sept • Govt Direct Benefit Transfer</Text>
              </View>
              <View style={styles.txBadgeGovt}>
                <Text style={styles.txBadgeGovtText}>Govt Scheme 🏛️</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. KAARIGAR CREDIT SCORE (Financial Inclusion USP) */}
        <View style={styles.creditScoreCard}>
          <View style={styles.creditHeaderRow}>
            <View>
              <Text style={styles.creditTitle}>💳 Kaarigar Credit Score (USP)</Text>
              <Text style={styles.creditSub}>Micro-Credit for tools & raw materials</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>⭐ 785 / 900</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.scoreProgressBar}>
            <View style={styles.scoreProgressFill} />
          </View>

          <View style={styles.creditEligibleBox}>
            <Text style={styles.creditEligibleText}>
              ✅ <Text style={{ fontWeight: '800' }}>₹25,000 tak loan mil sakta hai</Text> (bina paperwork / zero collateral).
            </Text>
          </View>

          {loanApplied ? (
            <View style={styles.loanAppliedBanner}>
              <Text style={styles.loanAppliedText}>✓ Loan Application Submitted! Disbursal in 2 hours.</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleApplyCredit} style={styles.applyCreditButton} activeOpacity={0.85}>
              <Text style={styles.applyCreditButtonText}>Apply Now (ऋण के लिए आवेदन करें) →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 26,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerAudioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAudioIcon: {
    fontSize: 16,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 95,
    gap: 14,
  },
  bigEarningsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  cardAudioBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardAudioText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  monthlyGrowthPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  monthlyGrowthText: {
    color: '#34D399',
    fontSize: 11.5,
    fontWeight: '800',
  },
  bankStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bankNameText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  autoCreditText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  escrowCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  escrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escrowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  escrowSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  payoutTimeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payoutTimeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
  },
  ledgerSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  ledgerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ledgerSectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.3,
  },
  ledgerSectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ledgerAudioBtn: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ledgerAudioText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '800',
  },
  ledgerTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  ledgerRowGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  ledgerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  ledgerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  ledgerCustomerVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  ledgerItemLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  ledgerDebitVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  ledgerHighlightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  ledgerHighlightVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  ledgerFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
  },
  ledgerFinalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  ledgerFinalSub: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 2,
  },
  ledgerFinalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
  },
  passbookSection: {},
  passbookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  passbookTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  passbookSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  transactionsList: {
    gap: 8,
  },
  txCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txLeft: {
    flex: 1,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  txSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  txBadgeCredit: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  txBadgeCreditText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  txBadgeGovt: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  txBadgeGovtText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  creditScoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  creditHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  creditTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  creditSub: {
    fontSize: 11,
    color: '#64748B',
  },
  scoreBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  scoreProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  scoreProgressFill: {
    width: '87%',
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  creditEligibleBox: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  creditEligibleText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  applyCreditButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyCreditButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  loanAppliedBanner: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  loanAppliedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
});
