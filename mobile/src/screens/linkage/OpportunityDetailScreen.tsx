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
        title="ऑर्डर विवरण (Production Brief)"
        subtitle="Corporate RFQ Brief"
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
                <View style={[styles.verifiedPill, { backgroundColor: 'rgba(232, 93, 42, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.terracotta.primary}>
                    सत्यापित कॉर्पोरेट खरीदार ✓
                  </Text>
                </View>
              </View>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginTop: 2 }}>
                {opportunity.buyerName}
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                कुल थोक मांग: {opportunity.totalOrderQuantity} पीस • {opportunity.craftCategoryName}
              </Text>
            </View>
          </View>
        </Card>

        {/* Vernacular Audio Explanation Brief */}
        <TouchableOpacity
          onPress={handleToggleAudio}
          style={[styles.audioCard, { borderColor: theme.colors.terracotta.primary }]}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Play audio production brief"
        >
          <View style={[styles.audioIconCircle, { backgroundColor: theme.colors.terracotta.primary }]}>
            <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{isPlayingAudio ? '⏸️' : '🎧'}</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
              {isPlayingAudio ? 'ऑडियो बज रहा है (Playing)...' : 'ऑर्डर का विवरण बोलकर सुनें'}
            </Text>
            <Text variant="labelSmall" color={theme.colors.text.secondary}>
              {isPlayingAudio ? 'रोकने के लिए टैप करें' : 'सुनिए इस ऑर्डर में आपको क्या और कब तक बनाना है'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Audio Transcript Card */}
        {isPlayingAudio && (
          <Card style={[styles.transcriptCard, { backgroundColor: 'rgba(27, 94, 56, 0.08)' }]}>
            <Text variant="labelSmall" weight="bold" color="#1B5E38" style={{ marginBottom: 4 }}>
              📢 बोली-साथी ऑडियो संदेश:
            </Text>
            <Text variant="bodySmall" color="#1B5E38" style={{ lineHeight: 20 }}>
              "{opportunity.audioBriefTranscriptHi}"
            </Text>
          </Card>
        )}

        {/* Quota & Guaranteed Payout Card */}
        <Card style={styles.payoutCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            आपके हिस्से का कोटा व कमाई:
          </Text>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              आवंटित कोटा (Your Sub-Quota):
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              {opportunity.artisanAllocatedQuota} पीस
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              तय दर प्रति पीस:
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              ₹{opportunity.unitRateArtisan} / पीस
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              निर्माण समय सीमा (Timeline):
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              {opportunity.deadlineDate}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

          <View style={styles.specRow}>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              कुल पक्की कमाई:
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#1B5E38">
              ₹{opportunity.totalPotentialPayout.toLocaleString('en-IN')}
            </Text>
          </View>

          {/* Advance Working Capital Banner */}
          <View style={[styles.advanceNotice, { backgroundColor: 'rgba(27, 94, 56, 0.08)' }]}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>💰</Text>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall" weight="bold" color="#1B5E38">
                30% अग्रिम भुगतान गारंटी (Working Capital):
              </Text>
              <Text variant="labelSmall" color="#1B5E38">
                स्वीकार करते ही ₹{opportunity.upfrontMaterialAdvance.toLocaleString('en-IN')} आपके बैंक खाते में जमा होंगे।
              </Text>
            </View>
          </View>
        </Card>

        {/* Technical Specifications */}
        <Card style={styles.specsCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 10 }}>
            उत्पाद की गुणवत्ता व आवश्यकताएं:
          </Text>
          {opportunity.technicalSpecs.map((spec, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: theme.colors.terracotta.primary }]}>•</Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ flex: 1, lineHeight: 20 }}>
                {spec}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF' }]}>
        <Button
          label="कोटेशन स्वीकार करें व 30% एडवांस लें 🚀"
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
