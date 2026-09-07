import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { marketLinkageService } from '@/api/marketLinkageService';
import { useMarketLinkageStore, MarketOpportunity } from '@/store/useMarketLinkageStore';
import { useTranslation } from '@/hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'Opportunities'>;

export const OpportunitiesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isHindi } = useTranslation();
  const { opportunities, setOpportunities } = useMarketLinkageStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    marketLinkageService.getMatchedOpportunities().then((ops) => {
      setOpportunities(ops);
      setIsLoading(false);
    });
  }, [setOpportunities]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title={isHindi ? 'बड़ा बाज़ार (B2B थोक अवसर)' : 'B2B Wholesale Opportunities'}
        subtitle={isHindi ? 'एआई क्लस्टर मैचमेकिंग' : 'AI Cluster Matchmaking'}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Value Proposition Hero Banner */}
        <Card style={[styles.heroCard, { backgroundColor: theme.colors.terracotta.primary }]}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={styles.heroBadge}>
                <Text variant="labelSmall" weight="bold" color="#FFFFFF">
                  {isHindi ? '✨ AI क्लस्टर मैचमेकिंग इंजन' : '✨ AI Cluster Matchmaking Engine'}
                </Text>
              </View>
              <Text variant="headlineSmall" weight="bold" color="#FFFFFF" style={{ marginVertical: 4 }}>
                {isHindi ? 'कॉर्पोरेट व संस्थागत थोक ऑर्डर्स' : 'Corporate & Enterprise Bulk Orders'}
              </Text>
              <Text variant="labelSmall" color="#E0DCFF">
                {isHindi
                  ? 'आपकी क्षमता अनुसार छोटा कोटा, 30% एडवांस सामग्री भुगतान और पक्की कमाई।'
                  : 'Flexible production quotas, 30% upfront material advance, and guaranteed escrow payout.'}
              </Text>
            </View>
            <Text style={{ fontSize: 36 }}>🤝</Text>
          </View>
        </Card>

        {/* Opportunity List Section */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            {isHindi ? `आपके लिए उपलब्ध अवसर (${opportunities.length})` : `Available Opportunities (${opportunities.length})`}
          </Text>
          <Text variant="labelSmall" color={theme.colors.text.secondary}>
            {isHindi ? 'शिल्प व क्षमता अनुसार ऑटो-मैच' : 'Auto-matched by craft skill & capacity'}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              {isHindi ? 'अवसर खोजे जा रहे हैं...' : 'Finding matched opportunities...'}
            </Text>
          </View>
        ) : (
          opportunities.map((item: MarketOpportunity) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('OpportunityDetail', { opportunityId: item.id })}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={isHindi ? item.rfqTitle.hi : (item.rfqTitle.en || item.rfqTitle.hi)}
            >
              <Card style={styles.opportunityCard}>
                {/* Match Badge & Category */}
                <View style={styles.topRow}>
                  <View style={[styles.matchBadge, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
                    <Text variant="labelSmall" weight="bold" color="#6C63FF">
                      {isHindi ? `🎯 ${item.matchConfidencePercentage}% शिल्प मिलान` : `🎯 ${item.matchConfidencePercentage}% Craft Match`}
                    </Text>
                  </View>
                  <Text variant="labelSmall" color={theme.colors.terracotta.primary} weight="bold">
                    {item.craftCategoryName}
                  </Text>
                </View>

                {/* Buyer Name & Title */}
                <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 6 }}>
                  🏢 {item.buyerName}
                </Text>
                <Text
                  variant="labelLarge"
                  weight="bold"
                  color={theme.colors.text.primary}
                  style={styles.rfqTitle}
                >
                  {isHindi ? item.rfqTitle.hi : (item.rfqTitle.en || item.rfqTitle.hi)}
                </Text>

                {/* Quota & Earnings Matrix */}
                <View style={[styles.matrixCard, { backgroundColor: theme.colors.surface.card }]}>
                  <View style={styles.matrixCol}>
                    <Text variant="labelSmall" color={theme.colors.text.secondary}>
                      {isHindi ? 'आपका कोटा' : 'Your Quota'}
                    </Text>
                    <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                      {item.artisanAllocatedQuota} {isHindi ? 'पीस' : 'Units'}
                    </Text>
                  </View>

                  <View style={[styles.matrixDivider, { backgroundColor: theme.colors.border.subtle }]} />

                  <View style={styles.matrixCol}>
                    <Text variant="labelSmall" color={theme.colors.text.secondary}>
                      {isHindi ? 'दर प्रति पीस' : 'Rate / Unit'}
                    </Text>
                    <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                      ₹{item.unitRateArtisan}
                    </Text>
                  </View>

                  <View style={[styles.matrixDivider, { backgroundColor: theme.colors.border.subtle }]} />

                  <View style={styles.matrixCol}>
                    <Text variant="labelSmall" color={theme.colors.text.secondary}>
                      {isHindi ? 'कुल पक्की कमाई' : 'Total Payout'}
                    </Text>
                    <Text variant="labelMedium" weight="bold" color="#6C63FF">
                      ₹{item.totalPotentialPayout.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Advance Material Guarantee Pill */}
                <View style={styles.advanceRow}>
                  <Text style={{ fontSize: 15, marginRight: 6 }}>💰</Text>
                  <Text variant="labelSmall" weight="bold" color="#6C63FF">
                    {isHindi
                      ? `₹${item.upfrontMaterialAdvance.toLocaleString('en-IN')} कच्चा माल एडवांस तुरंत`
                      : `₹${item.upfrontMaterialAdvance.toLocaleString('en-IN')} Instant Material Advance`}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginLeft: 'auto' }}>
                    {isHindi ? `⏳ ${item.daysToDeliver} दिन` : `⏳ ${item.daysToDeliver} Days`}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        {/* Corporate Buyer Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBulkRfq')}
          style={[styles.buyerPromptCard, { borderColor: theme.colors.terracotta.primary }]}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, marginRight: 12 }}>🏢</Text>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
              {isHindi ? 'क्या आप कॉर्पोरेट खरीदार हैं?' : 'Are you a Corporate Buyer?'}
            </Text>
            <Text variant="labelSmall" color={theme.colors.text.secondary}>
              {isHindi ? 'कारीगर क्लस्टर्स को सीधे बल्क RFQ भेजें →' : 'Send bulk custom RFQ directly to artisan clusters →'}
            </Text>
          </View>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  heroCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  opportunityCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rfqTitle: {
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 22,
  },
  matrixCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  matrixCol: {
    flex: 1,
    alignItems: 'center',
  },
  matrixDivider: {
    width: 1,
  },
  advanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  buyerPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
  },
});
