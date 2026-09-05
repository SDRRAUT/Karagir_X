import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { MOCK_OPPORTUNITIES } from '@/api/marketLinkageService';
import { MarketOpportunity, useMarketLinkageStore } from '@/store/useMarketLinkageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OpportunityDetail'>;

export const OpportunityDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { opportunityId } = route.params;
  const setActiveOpportunity = useMarketLinkageStore((s) => s.setActiveOpportunity);

  const [opportunity] = useState<MarketOpportunity>(() => {
    return MOCK_OPPORTUNITIES.find((o) => o.id === opportunityId) || MOCK_OPPORTUNITIES[0];
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setActiveOpportunity(opportunity);
  }, [opportunity, setActiveOpportunity]);

  if (!opportunity) {
    return null;
  }

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const handleProceedToQuote = () => {
    navigation.navigate('QuoteNegotiation', { opportunityId: opportunity.id });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="B2B Bulk Order & Smart Cluster"
        subtitle="AI Cluster Matchmaking & Production Brief"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buyer Verified Card */}
        <Card style={styles.buyerCard}>
          <View style={styles.buyerRow}>
            <View style={[styles.buyerIconCircle, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
              <Text style={{ fontSize: 24 }}>🏢</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <View style={styles.badgeRow}>
                <View style={[styles.verifiedPill, { backgroundColor: 'rgba(234, 88, 12, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#EA580C">
                    Verified Institutional Buyer ✓
                  </Text>
                </View>
              </View>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 2 }}>
                {opportunity.buyerName}
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                Total Bulk Demand: 5,000 Pieces • {opportunity.craftCategoryName}
              </Text>
            </View>
          </View>
        </Card>

        {/* Feature 5: AI Bulk Order → Smart Artisan Cluster Aggregation */}
        <Card style={styles.clusterEngineCard}>
          <View style={styles.clusterHeaderRow}>
            <View style={styles.clusterIconBox}>
              <Text style={{ fontSize: 20 }}>🤝</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.aiPillBadge}>
                <Text style={{ fontSize: 10, marginRight: 4 }}>⚡</Text>
                <Text variant="caption" weight="bold" color="#EA580C">
                  AI CLUSTER AGGREGATION ENGINE
                </Text>
              </View>
              <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 2 }}>
                5,000 Units Demand → 5 Artisans Pooled
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Solved via capacity matching + location proximity + reliability score
              </Text>
            </View>
          </View>

          {/* Aggregated Capacity Bar */}
          <View style={styles.clusterProgressSection}>
            <View style={styles.clusterProgressHeader}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.primary}>
                Aggregated Capacity: 5,000 / 5,000 Pieces
              </Text>
              <Text variant="labelSmall" weight="bold" color="#16A34A">
                100% Matched
              </Text>
            </View>
            <View style={styles.clusterProgressBarTrack}>
              <View style={[styles.clusterProgressBarFill, { width: '100%', backgroundColor: '#EA580C' }]} />
            </View>
          </View>

          {/* Cluster Member Quotas */}
          <View style={styles.artisanQuotaList}>
            <Text variant="caption" weight="bold" color={theme.colors.text.secondary} style={styles.quotaListTitle}>
              CLUSTER MEMBER WORKLOAD ALLOCATION:
            </Text>

            <View style={styles.quotaItem}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🏺</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
                  Ramesh Kumbhar (You • Kolhapur)
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary}>
                  ⭐ 4.9 • 98% On-Time Delivery
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text variant="caption" weight="bold" color="#EA580C">
                  600 Pcs (₹15,000)
                </Text>
              </View>
            </View>

            <View style={styles.quotaItem}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🏺</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
                  Sunita Devi (Kolhapur Cluster Lead)
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary}>
                  ⭐ 4.8 • 96% Reliability
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text variant="caption" weight="bold" color="#EA580C">
                  500 Pcs (₹12,500)
                </Text>
              </View>
            </View>

            <View style={styles.quotaItem}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🏺</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
                  Ganesh Kumbhar (Panchganga Unit)
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary}>
                  ⭐ 4.9 • Master Wheel Craftsman
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text variant="caption" weight="bold" color="#EA580C">
                  700 Pcs (₹17,500)
                </Text>
              </View>
            </View>

            <View style={styles.quotaItem}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🏺</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
                  Savita Kumbhar (Kolhapur Guild)
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary}>
                  ⭐ 4.7 • Hand-carving Specialist
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text variant="caption" weight="bold" color="#EA580C">
                  650 Pcs (₹16,250)
                </Text>
              </View>
            </View>

            <View style={styles.quotaItem}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🏺</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
                  Tukaram Clay Potter SHG (5 Artisans)
                </Text>
                <Text variant="caption" color={theme.colors.text.secondary}>
                  ⭐ 4.9 • Kiln & Firing Hub
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text variant="caption" weight="bold" color="#EA580C">
                  2,550 Pcs (₹63,750)
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Feature 6: Digital Production Brief + Collective Tracking */}
        <Card style={styles.specsCard}>
          <View style={styles.specHeaderRow}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>📋</Text>
            <View>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                ऑर्डर विवरण (Production Brief)
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Digital Production Brief • Common Specs across all 5 cluster artisans
              </Text>
            </View>
          </View>

          <View style={styles.briefGrid}>
            <View style={styles.briefCol}>
              <Text variant="caption" weight="bold" color="#EA580C">
                📐 EXACT DIMENSIONS
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                10 cm dia × 4 cm height (±2mm tolerance)
              </Text>
            </View>
            <View style={styles.briefCol}>
              <Text variant="caption" weight="bold" color="#EA580C">
                🏺 CLAY & PURITY
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                100% Natural Panchganga river terracotta
              </Text>
            </View>
            <View style={styles.briefCol}>
              <Text variant="caption" weight="bold" color="#EA580C">
                🔥 FIRING & FINISH
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                Sun-dried 3 days, kiln fired @ 850°C
              </Text>
            </View>
            <View style={styles.briefCol}>
              <Text variant="caption" weight="bold" color="#EA580C">
                📦 ECO-PACKAGING
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.primary}>
                Biodegradable straw wrap in 12-pack recycled cartons
              </Text>
            </View>
          </View>

          {/* Collective Progress Bar */}
          <View style={styles.collectiveTrackerBox}>
            <View style={styles.collectiveTrackerHeader}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.primary}>
                Cluster Collective Production Progress
              </Text>
              <Text variant="labelSmall" weight="bold" color="#16A34A">
                82% Completed (4,100 / 5,000 Pcs)
              </Text>
            </View>
            <View style={styles.collectiveTrack}>
              <View style={[styles.collectiveFill, { width: '82%', backgroundColor: '#16A34A' }]} />
            </View>
            <Text variant="caption" color={theme.colors.text.secondary} style={{ marginTop: 4 }}>
              Buyer Single-View Live Status: All 5 artisans on schedule for Diwali dispatch
            </Text>
          </View>
        </Card>

        {/* Quota & Guaranteed Payout Card */}
        <Card style={styles.payoutCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            Your Quota & Guaranteed Payout:
          </Text>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              Your Allocated Sub-Quota:
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              600 Pieces
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              Guaranteed Unit Rate:
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              ₹25 / Piece
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              Total Assured Payout:
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#EA580C">
              ₹25,000
            </Text>
          </View>

          {/* Advance Working Capital Banner */}
          <View style={[styles.advanceNotice, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5', borderWidth: 1 }]}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>💰</Text>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall" weight="bold" color="#EA580C">
                30% Upfront Material Advance (30% अग्रिम भुगतान गारंटी):
              </Text>
              <Text variant="labelSmall" color="#9A3412">
                ₹7,500 transferred immediately to your bank upon contract acceptance.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF' }]}>
        <Button
          label="Accept Quota & Sign Contract (कोटेशन स्वीकार करें व 30% एडवांस लें) 🚀"
          variant="primary"
          onPress={handleProceedToQuote}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  buyerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  verifiedPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 2,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  audioIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transcriptCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  payoutCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  advanceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  specsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  clusterEngineCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  clusterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clusterIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiPillBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  clusterProgressSection: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clusterProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  clusterProgressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  clusterProgressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  artisanQuotaList: {
    gap: 8,
  },
  quotaListTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  quotaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quotaBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  specHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  briefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  briefCol: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  collectiveTrackerBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  collectiveTrackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  collectiveTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DCFCE7',
    overflow: 'hidden',
  },
  collectiveFill: {
    height: '100%',
    borderRadius: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    fontSize: 18,
    marginRight: 8,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
});
