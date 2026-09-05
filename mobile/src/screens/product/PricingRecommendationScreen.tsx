import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useProductDraftStore } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PricingRecommendation'>;

export const PricingRecommendationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const {
    pricing,
    finalSellingPrice,
    setFinalSellingPrice,
    photos,
    primaryPhotoId,
    craftCategoryName,
  } = useProductDraftStore();

  const primaryPhoto =
    photos.find((p) => p.id === primaryPhotoId) || photos[0];

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

  const materialCost = pricing?.breakdown.material_cost || 350;
  const laborCost = pricing?.breakdown.labor_cost || 1400;
  const packagingCost = pricing?.breakdown.packaging_cost || 80;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="Fair Price Advisor"
        subtitle="Explainable Value Ledger • उचित दाम सुझाव"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vernacular Audio Explanation Card */}
        <View style={styles.voiceCard}>
          <View style={styles.speakerBox}>
            <Text style={{ fontSize: 20 }}>💡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.voiceTagText}>EXPLAINABLE FAIR VALUE • निष्पक्ष मूल्य निर्धारण</Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[800]} style={styles.voiceText}>
              "Why this price? AI evaluates raw materials, skilled craft time, technique complexity, and market signals so you never sell below your worth."
            </Text>
          </View>
        </View>

        {/* Product & Suggested Range Card (Matches Stitch Fair_Price_Advisor.html) */}
        <Card style={styles.mainAdvisorCard} variant="elevated">
          <View style={styles.productRow}>
            {primaryPhoto ? (
              <Image
                source={{ uri: primaryPhoto.enhancedUri || primaryPhoto.uri }}
                style={styles.productThumb}
              />
            ) : (
              <View style={[styles.productThumb, styles.thumbPlaceholder]}>
                <Text style={{ fontSize: 24 }}>🏺</Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.productLabel}>PRODUCT ITEM</Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
                {craftCategoryName || 'Authentic Handcrafted Terracotta Craft'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rangeHeaderRow}>
            <View>
              <Text style={styles.rangeLabel}>SUGGESTED PRICE RANGE</Text>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.terracotta[600]} style={{ marginTop: 2 }}>
                ₹{Math.round(suggestedPrice * 0.95)} - ₹{Math.round(suggestedPrice * 1.15)}
              </Text>
            </View>
            <View style={styles.demandBadge}>
              <Text style={styles.demandBadgeText}>📈 High Demand</Text>
            </View>
          </View>

          <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={styles.insightText}>
            "Similar GI-certified pots from Maharashtra are selling for ₹2,100–₹2,400 this season. Your fine hand-thrown detailing adds verified extra value."
          </Text>
        </Card>

        {/* Cost Breakdown Card (Stitch Breakdown layout) */}
        <Card style={styles.breakdownCard} variant="elevated">
          <Text style={styles.breakdownTitle}>COST & VALUE BREAKDOWN (लागत विवरण)</Text>

          {/* 1. Materials */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🧵</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
                  Raw Materials • कच्चा माल
                </Text>
                <Text variant="caption" color={theme.colors.charcoal[500]}>
                  Natural clay, mineral pigments, kiln firewood
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{materialCost.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.itemDivider} />

          {/* 2. Labour */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>⏳</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
                  Skilled Artisan Labour
                </Text>
                <Text variant="caption" color={theme.colors.charcoal[500]}>
                  Hand-shaping, carving, kiln firing
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{laborCost.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.itemDivider} />

          {/* 3. Packaging */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>📦</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
                  Eco-Friendly Packaging
                </Text>
                <Text variant="caption" color={theme.colors.charcoal[500]}>
                  Straw cushioning & recycled corrugated box
                </Text>
              </View>
            </View>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{packagingCost.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.itemDivider} />

          {/* 4. Take-Home */}
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownLeft}>
              <Text style={styles.breakdownIcon}>🏦</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.forest[700]}>
                  Direct Artisan Take-Home
                </Text>
                <Text variant="caption" color={theme.colors.forest[800]}>
                  Transferred directly via ONDC / UPI
                </Text>
              </View>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.forest[700]}>
              ₹{takeHome.toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>

        {/* Price Stepper Controls */}
        <Card style={styles.adjustmentCard} variant="elevated">
          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[500]} style={styles.adjustTitle}>
            SET FINAL SELLING PRICE (अंतिम विक्रय मूल्य):
          </Text>

          <View style={styles.stepperRow}>
            <TouchableOpacity
              testID="decrease-price-btn"
              onPress={() => handleAdjustPrice(-50)}
              style={styles.stepBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.priceDisplay}>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]}>
                ₹{price.toLocaleString('en-IN')}
              </Text>
            </View>

            <TouchableOpacity
              testID="increase-price-btn"
              onPress={() => handleAdjustPrice(50)}
              style={styles.stepBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {price < minFloor && (
            <View style={styles.warningBox}>
              <Text variant="bodySmall" weight="bold" color="#B71C1C">
                ⚠️ Fair Floor Alert: This price is below your calculated minimum legal floor (₹{minFloor}).
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label="Approve Price & Preview Catalog (दाम स्वीकृत करें व कैटलॉग समीक्षा करें) →"
          variant="primary"
          size="default"
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFBF42',
    marginBottom: 16,
  },
  speakerBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  voiceTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9C6E00',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  voiceText: {
    lineHeight: 18,
  },
  mainAdvisorCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  productThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  thumbPlaceholder: {
    backgroundColor: '#F3EFE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A827B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECE8DC',
    marginBottom: 14,
  },
  rangeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rangeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8A827B',
    letterSpacing: 0.5,
  },
  demandBadge: {
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE4A0',
  },
  demandBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8F6204',
  },
  insightText: {
    marginTop: 6,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  breakdownCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A827B',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#ECE8DC',
    marginVertical: 10,
  },
  adjustmentCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginBottom: 20,
    alignItems: 'center',
  },
  adjustTitle: {
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#ECE8DC',
    backgroundColor: '#F5F3EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  priceDisplay: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  warningBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    width: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    shadowColor: '#2b2b2b',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
});

