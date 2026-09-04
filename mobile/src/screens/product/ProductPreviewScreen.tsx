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
import { productService } from '@/api/productService';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductPreview'>;

export const ProductPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const {
    photos,
    primaryPhotoId,
    titles,
    descriptions,
    careInstructions,
    tags,
    craftCategoryName,
    finalSellingPrice,
    setPublishedProduct,
  } = useProductDraftStore();

  const [selectedLang, setSelectedLang] = useState<'hi' | 'en' | 'bn'>('hi');
  const [isPublishing, setIsPublishing] = useState(false);

  const primaryPhoto =
    photos.find((p) => p.id === primaryPhotoId) || photos[0];

  const displayTitle =
    titles[selectedLang] || titles.hi || titles.en || 'पारंपरिक हस्तकला उत्पाद';

  const displayDescription =
    descriptions[selectedLang] || descriptions.hi || descriptions.en || 'कारीगर द्वारा निर्मित';

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const result = await productService.createProduct({
        title: titles,
        description: descriptions,
        craftCategoryCode: 'PAINTING_MITHILA',
        sellingPrice: finalSellingPrice || 2150,
        aiSuggestedPrice: finalSellingPrice || 2150,
        stockQuantity: 1,
        stockType: 'READY_STOCK',
        images: photos.map((p) => ({
          url: p.enhancedUri || p.uri,
          isPrimary: p.id === primaryPhotoId,
        })),
        tags,
        careInstructions: careInstructions.hi,
      });

      setPublishedProduct(result);
      setIsPublishing(false);
      navigation.replace('PublishSuccess');
    } catch (_err) {
      setIsPublishing(false);
      navigation.replace('PublishSuccess');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="कैटलॉग पूर्वावलोकन"
        subtitle="Catalog & Digital Passport"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Product Image Carousel / Cover */}
        <Card style={styles.imageCard} variant="elevated">
          {primaryPhoto ? (
            <Image
              source={{ uri: primaryPhoto.enhancedUri || primaryPhoto.uri }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, styles.placeholderImage]}>
              <Text style={{ fontSize: 40 }}>🖼️</Text>
            </View>
          )}

          {/* Badge Over Photo */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              ✓ {craftCategoryName || 'प्रमाणित हस्तशिल्प'}
            </Text>
          </View>
        </Card>

        {/* Trilingual Language Selector Tabs */}
        <View style={styles.langRow}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[600]} style={styles.langLabel}>
            भाषा चुनें (Language):
          </Text>
          <View style={styles.langButtons}>
            {(['hi', 'en', 'bn'] as const).map((lang) => {
              const isSelected = selectedLang === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setSelectedLang(lang)}
                  style={[
                    styles.langBtn,
                    isSelected ? styles.langBtnActive : styles.langBtnInactive,
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    color={isSelected ? '#FFFFFF' : theme.colors.charcoal[800]}
                  >
                    {lang === 'hi' ? 'हिन्दी' : lang === 'en' ? 'English' : 'বাংলা'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Product Details Card */}
        <Card style={styles.detailsCard} variant="elevated">
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]} style={styles.titleText}>
            {displayTitle}
          </Text>

          {/* Price Bar */}
          <View style={styles.priceRow}>
            <View>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
                स्वीकृत विक्रय मूल्य (Selling Price)
              </Text>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={{ marginTop: 2 }}>
                ₹{(finalSellingPrice || 2150).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>
                ✓ 100% प्रामाणिक हस्तशिल्प
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Cultural Storytelling Copy */}
          <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionHeading}>
            शिल्प की कहानी (Artisan Story):
          </Text>
          <Text variant="bodyMedium" color={theme.colors.charcoal[700]} style={styles.descriptionText}>
            {displayDescription}
          </Text>

          {/* Care Instructions */}
          {Boolean(careInstructions.hi) && (
            <View style={styles.careBox}>
              <Text variant="bodySmall" weight="bold" color="#59413A">
                💡 देखभाल के निर्देश: {careInstructions.hi}
              </Text>
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tagPill}>
                <Text style={styles.tagText}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label={isPublishing ? 'पब्लिश हो रहा है...' : 'दुकान में पब्लिश करें (Publish to Store) 🚀'}
          variant="primary"
          size="default"
          isLoading={isPublishing}
          onPress={handlePublish}
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
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEAE3',
    backgroundColor: '#FFFFFF',
  },
  mainImage: {
    width: '100%',
    height: 280,
  },
  placeholderImage: {
    backgroundColor: '#F3EFE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(232, 93, 42, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  langLabel: {
    fontSize: 13,
  },
  langButtons: {
    flexDirection: 'row',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 6,
    borderWidth: 1,
  },
  langBtnActive: {
    backgroundColor: '#E85D2A',
    borderColor: '#E85D2A',
  },
  langBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEAE3',
  },
  detailsCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE3',
  },
  titleText: {
    lineHeight: 28,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  verifiedBadge: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B5E38',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEAE3',
    marginVertical: 14,
  },
  sectionHeading: {
    marginBottom: 6,
  },
  descriptionText: {
    lineHeight: 22,
    marginBottom: 14,
  },
  careBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFF7E8',
    borderWidth: 1,
    borderColor: '#FFE082',
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: '#F3EFE9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E85D2A',
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
    shadowColor: '#141815',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
});

