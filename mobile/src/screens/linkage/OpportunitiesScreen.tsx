import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { marketLinkageService } from '@/api/marketLinkageService';
import { useMarketLinkageStore, MarketOpportunity } from '@/store/useMarketLinkageStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Opportunities'>;

export const OpportunitiesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { opportunities, setOpportunities } = useMarketLinkageStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    marketLinkageService.getMatchedOpportunities().then((ops) => {
      setOpportunities(ops);
      setIsLoading(false);
    });
  }, [setOpportunities]);

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
          बड़ा बाज़ार (B2B Opportunities)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Value Proposition Hero Banner */}
        <Card style={[styles.heroCard, { backgroundColor: theme.colors.primary.emerald800 }]}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text variant="bodySmall" weight="bold" color="#D4AF37">
                AI क्लस्टर मैचमेकिंग इंजन
              </Text>
              <Text variant="headlineSmall" weight="bold" color="#FFFFFF" style={{ marginVertical: 4 }}>
                कॉर्पोरेट व संस्थागत थोक ऑर्डर्स
              </Text>
              <Text variant="bodySmall" color="#E0D7C9">
                आपकी क्षमता अनुसार छोटा कोटा, 30% एडवांस सामग्री भुगतान और पक्की कमाई।
              </Text>
            </View>
            <Text style={{ fontSize: 40 }}>🤝</Text>
          </View>
        </Card>

        {/* Opportunity List Section */}
        <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.sectionHeading}>
          आपके लिए उपलब्ध अवसर ({opportunities.length})
        </Text>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              अवसर खोजे जा रहे हैं...
            </Text>
          </View>
        ) : (
          opportunities.map((item: MarketOpportunity) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('OpportunityDetail', { opportunityId: item.id })}
              accessibilityRole="button"
              accessibilityLabel={item.rfqTitle.hi}
            >
              <Card style={styles.opportunityCard}>
                {/* Match Badge & Buyer */}
                <View style={styles.topRow}>
                  <View style={[styles.matchBadge, { backgroundColor: theme.colors.primary.emerald100 }]}>
                    <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                      🎯 {item.matchConfidencePercentage}% शिल्प मिलान
                    </Text>
                  </View>
                  <Text variant="bodySmall" color={theme.colors.terracotta.primary} weight="bold">
                    {item.craftCategoryName}
                  </Text>
                </View>

                {/* Buyer Name & Title */}
                <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 6 }}>
                  🏢 {item.buyerName}
                </Text>
                <Text
                  variant="headlineSmall"
                  weight="bold"
                  color={theme.colors.text.primary}
                  style={styles.rfqTitle}
                >
                  {item.rfqTitle.hi}
                </Text>

                {/* Quota & Earnings Matrix */}
                <View style={[styles.matrixCard, { backgroundColor: theme.colors.surface.parchment }]}>
                  <View style={styles.matrixCol}>
                    <Text variant="bodySmall" color={theme.colors.text.secondary}>
                      आपका कोटा (Quota):
                    </Text>
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                      {item.artisanAllocatedQuota} पीस
                    </Text>
                  </View>

                  <View style={styles.matrixDivider} />

                  <View style={styles.matrixCol}>
                    <Text variant="bodySmall" color={theme.colors.text.secondary}>
                      दर प्रति पीस:
                    </Text>
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                      ₹{item.unitRateArtisan}
                    </Text>
                  </View>

                  <View style={styles.matrixDivider} />

                  <View style={styles.matrixCol}>
                    <Text variant="bodySmall" color={theme.colors.text.secondary}>
                      कुल पक्की कमाई:
                    </Text>
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                      ₹{item.totalPotentialPayout.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Advance Material Guarantee Pill */}
                <View style={styles.advanceRow}>
                  <Text style={{ fontSize: 16, marginRight: 6 }}>💰</Text>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                    ₹{item.upfrontMaterialAdvance.toLocaleString('en-IN')} कच्चा माल एडवांस तुरंत
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginLeft: 'auto' }}>
                    ⏳ {item.daysToDeliver} दिन
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
        >
          <Text style={{ fontSize: 24, marginRight: 10 }}>🏢</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              क्या आप कॉर्पोरेट खरीदार हैं?
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              कारीगर क्लस्टर्स को सीधे बल्क RFQ भेजें →
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
    paddingBottom: 40,
  },
  heroCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeading: {
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
    borderRadius: 8,
  },
  rfqTitle: {
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 22,
  },
  matrixCard: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  matrixCol: {
    flex: 1,
    alignItems: 'center',
  },
  matrixDivider: {
    width: 1,
    backgroundColor: '#E0D7C9',
  },
  advanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0D7C9',
  },
  buyerPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
  },
});
