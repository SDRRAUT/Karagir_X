import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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
          कैटलॉग पूर्वावलोकन (Preview)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Product Image Carousel / Cover */}
        <Card style={styles.imageCard}>
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
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary.emerald700 }]}>
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              {craftCategoryName}
            </Text>
          </View>
        </Card>

        {/* Trilingual Language Selector Tabs */}
        <View style={styles.langRow}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.langLabel}>
            भाषा बदलें (Language):
          </Text>
          <View style={styles.langButtons}>
            {(['hi', 'en', 'bn'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setSelectedLang(lang)}
                style={[
                  styles.langBtn,
                  selectedLang === lang && {
                    backgroundColor: theme.colors.primary.emerald700,
                    borderColor: theme.colors.primary.emerald700,
                  },
                ]}
              >
                <Text
                  variant="bodySmall"
                  weight="bold"
                  color={selectedLang === lang ? '#FFFFFF' : theme.colors.text.primary}
                >
                  {lang === 'hi' ? 'हिन्दी' : lang === 'en' ? 'English' : 'বাংলা'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Details Card */}
        <Card style={styles.detailsCard}>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary} style={styles.titleText}>
            {displayTitle}
          </Text>

          {/* Price Bar */}
          <View style={styles.priceRow}>
            <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{(finalSellingPrice || 2150).toLocaleString('en-IN')}
            </Text>
            <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.primary.emerald100 }]}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                ✓ प्रामाणिक हस्तशिल्प
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Cultural Storytelling Copy */}
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.sectionHeading}>
            शिल्प की कहानी (Artisan Story):
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.descriptionText}>
            {displayDescription}
          </Text>

          {/* Care Instructions */}
          {careInstructions.hi ? (
            <View style={[styles.careBox, { backgroundColor: '#FFF8E1' }]}>
              <Text variant="bodySmall" weight="bold" color="#795548">
                💡 देखभाल के निर्देश: {careInstructions.hi}
              </Text>
            </View>
          ) : null}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tagPill}>
                <Text variant="bodySmall" color={theme.colors.primary.emerald700}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label={isPublishing ? 'पब्लिश हो रहा है...' : 'दुकान में पब्लिश करें (Publish to Store) 🚀'}
          variant="primary"
          size="decision"
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
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    position: 'relative',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 280,
  },
  placeholderImage: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginLeft: 6,
    backgroundColor: '#FFFFFF',
  },
  detailsCard: {
    padding: 16,
  },
  titleText: {
    lineHeight: 28,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D7C9',
    marginVertical: 12,
  },
  sectionHeading: {
    marginBottom: 6,
  },
  descriptionText: {
    lineHeight: 22,
    marginBottom: 14,
  },
  careBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: '#F3EFE6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
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
