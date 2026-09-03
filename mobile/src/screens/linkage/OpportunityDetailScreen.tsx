import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          ऑर्डर विवरण (Production Brief)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buyer Verified Card */}
        <Card style={styles.buyerCard}>
          <View style={styles.buyerRow}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>🏢</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                सत्यापित कॉर्पोरेट खरीदार (Verified Buyer)
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                {opportunity.buyerName}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                कुल थोक मांग: {opportunity.totalOrderQuantity} पीस
              </Text>
            </View>
          </View>
        </Card>

        {/* Vernacular Audio Explanation Brief */}
        <TouchableOpacity
          onPress={handleToggleAudio}
          style={[styles.audioCard, { borderColor: theme.colors.primary.emerald700 }]}
          accessibilityRole="button"
          accessibilityLabel="Play audio production brief"
        >
          <Text style={{ fontSize: 30, marginRight: 12 }}>{isPlayingAudio ? '⏸️' : '🎧'}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
              {isPlayingAudio ? 'ऑडियो बज रहा है (Playing)...' : 'ऑर्डर का विवरण बोलकर सुनें (Audio Brief)'}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isPlayingAudio ? 'टैप करके रोकें' : 'सुनिए इस ऑर्डर में आपको क्या और कब तक बनाना है'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Audio Transcript Card */}
        {isPlayingAudio && (
          <Card style={[styles.transcriptCard, { backgroundColor: '#F0F9F0' }]}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900} style={{ marginBottom: 4 }}>
              ऑडियो संदेश:
            </Text>
            <Text variant="bodyMedium" color={theme.colors.primary.emerald900} style={{ lineHeight: 20 }}>
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
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              आवंटित कोटा (Your Sub-Quota):
            </Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              {opportunity.artisanAllocatedQuota} पीस
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              तय दर प्रति पीस:
            </Text>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
              ₹{opportunity.unitRateArtisan} / पीस
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              निर्माण समय सीमा (Timeline):
            </Text>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
              {opportunity.deadlineDate}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              कुल पक्की कमाई (Total Payout):
            </Text>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{opportunity.totalPotentialPayout.toLocaleString('en-IN')}
            </Text>
          </View>

          {/* Advance Working Capital Banner */}
          <View style={[styles.advanceNotice, { backgroundColor: theme.colors.primary.emerald100 }]}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>💰</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                30% अग्रिम भुगतान गारंटी (Working Capital):
              </Text>
              <Text variant="bodySmall" color={theme.colors.primary.emerald900}>
                स्वीकार करते ही ₹{opportunity.upfrontMaterialAdvance.toLocaleString('en-IN')} आपके खाते में जमा होंगे।
              </Text>
            </View>
          </View>
        </Card>

        {/* Technical Specifications */}
        <Card style={styles.specsCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            उत्पाद की गुणवत्ता व आवश्यकताएं:
          </Text>
          {opportunity.technicalSpecs.map((spec, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text variant="bodyMedium" color={theme.colors.text.secondary} style={{ flex: 1, lineHeight: 20 }}>
                {spec}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label="कोटेशन स्वीकार करें व 30% एडवांस लें 🚀"
          variant="primary"
          size="decision"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  buyerCard: {
    padding: 16,
    marginBottom: 14,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  transcriptCard: {
    padding: 14,
    marginBottom: 14,
  },
  payoutCard: {
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
    backgroundColor: '#E0D7C9',
    marginVertical: 10,
  },
  advanceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  specsCard: {
    padding: 16,
    marginBottom: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 18,
    color: '#1E5631',
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
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});
