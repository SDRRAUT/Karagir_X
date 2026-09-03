import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { PriceLedgerCard, PriceLedgerItem } from '@/components/cards/PriceLedgerCard';
import { useProductDraftStore } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PricingRecommendation'>;

export const PricingRecommendationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { pricing, finalSellingPrice, setFinalSellingPrice } = useProductDraftStore();

  const suggestedPrice = pricing?.suggested_price || 2150;
  const currentPrice = finalSellingPrice > 0 ? finalSellingPrice : suggestedPrice;

  const [price, setPrice] = useState<number>(currentPrice);

  const platformFee = Math.round(price * 0.05);
  const takeHome = price - platformFee;
  const minFloor = pricing?.minimum_legal_floor || 1650;

  const handleAdjustPrice = (delta: number) => {
    const nextPrice = Math.max(500, price + delta);
    setPrice(nextPrice);
    setFinalSellingPrice(nextPrice);
  };

  const handleProceed = () => {
    setFinalSellingPrice(price);
    navigation.navigate('ProductPreview');
  };

  const ledgerItems: PriceLedgerItem[] = [
    {
      icon: '🧵',
      label: 'कच्चा माल (Materials)',
      amount: pricing?.breakdown.material_cost || 350,
    },
    {
      icon: '⏳',
      label: 'कारीगर मेहनत (Labor Hours)',
      amount: pricing?.breakdown.labor_cost || 1400,
    },
    {
      icon: '🎨',
      label: 'शिल्प जटिलता (Craft Complexity)',
      amount: pricing?.breakdown.complexity_fee || 350,
    },
    {
      icon: '📦',
      label: 'सुरक्षित पैकेजिंग (Packaging)',
      amount: pricing?.breakdown.packaging_cost || 80,
    },
    {
      icon: '📈',
      label: 'बाज़ार मांग संतुलन (Market Demand)',
      amount: pricing?.breakdown.market_demand_adjustment || 120,
    },
  ];

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
          उचित दाम सुझाव (Fair Pricing)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vernacular Audio Explanation Card */}
        <View
          style={[
            styles.voiceCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.surface.border,
              ...theme.shadows.level1,
            },
          ]}
        >
          <Text style={styles.speakerIcon}>🔊</Text>
          <Text variant="bodyMedium" color={theme.colors.text.primary} style={styles.voiceText}>
            "यह दाम आपकी मेहनत, समय और सामग्री के आधार पर AI द्वारा सुझाया गया है।"
          </Text>
        </View>

        {/* Detailed Transparent Price Ledger Card */}
        <PriceLedgerCard
          items={ledgerItems}
          suggestedPrice={suggestedPrice}
          takeHomeAmount={takeHome}
          platformFeeAmount={platformFee}
        />

        {/* Price Adjustment Controls */}
        <Card style={styles.adjustmentCard}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.adjustTitle}>
            अंतिम विक्रय मूल्य तय करें (Your Final Price):
          </Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              testID="decrease-price-btn"
              onPress={() => handleAdjustPrice(-50)}
              style={[styles.stepBtn, { backgroundColor: theme.colors.surface.parchment }]}
            >
              <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary}>
                -
              </Text>
            </TouchableOpacity>

            <View style={styles.priceDisplay}>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
                ₹{price.toLocaleString('en-IN')}
              </Text>
            </View>

            <TouchableOpacity
              testID="increase-price-btn"
              onPress={() => handleAdjustPrice(50)}
              style={[styles.stepBtn, { backgroundColor: theme.colors.surface.parchment }]}
            >
              <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          {price < minFloor && (
            <View style={styles.warningBox}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                ⚠️ चेतावनी: यह मूल्य न्यूनतम लागत (₹{minFloor}) से कम है।
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label="कैटलॉग समीक्षा करें (Review Catalog) →"
          variant="primary"
          size="decision"
          onPress={handleProceed}
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
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  speakerIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  voiceText: {
    flex: 1,
    lineHeight: 20,
  },
  adjustmentCard: {
    marginTop: 16,
    padding: 16,
  },
  adjustTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceDisplay: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  warningBox: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
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
