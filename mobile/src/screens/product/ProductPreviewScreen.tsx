import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
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
import { useCatalogStore } from '@/store/useCatalogStore';
import { useAuthStore } from '@/store/useAuthStore';

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
    craftCategoryCode,
    craftCategoryName,
    finalSellingPrice,
    extractedEntities,
    visionStatus,
    visionStatusMessage,
    visualAttributes,
    categoryConfidence,
    updateTitle,
    updateDescription,
    setPublishedProduct,
  } = useProductDraftStore();

  const [selectedLang, setSelectedLang] = useState<'hi' | 'en' | 'bn'>('en');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const primaryPhoto =
    photos.find((p) => p.id === primaryPhotoId) || photos[0];

  const displayTitle =
    titles[selectedLang] || titles.en || titles.hi || 'Handcrafted Artisan Product';

  const displayDescription =
    descriptions[selectedLang] || descriptions.en || descriptions.hi || 'Artisan handcrafted with traditional heritage techniques.';

  const handleOpenEdit = () => {
    setEditTitle(displayTitle);
    setEditDescription(displayDescription);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTitle(selectedLang, editTitle.trim());
    }
    if (editDescription.trim()) {
      updateDescription(selectedLang, editDescription.trim());
    }
    setIsEditModalVisible(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const result = await productService.createProduct({
        title: titles,
        description: descriptions,
        craftCategoryCode: craftCategoryCode || 'TEXTILE_HANDLOOM',
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

      const authUser = useAuthStore.getState().user;
      const sellerName =
        (extractedEntities?.artisanName as string)?.trim() ||
        authUser?.fullName?.trim() ||
        'Sunita Devi';

      // Dynamically resolve category from craftCategoryCode or draft
      let resolvedCategory = 'POTTERY';
      const catCode = (craftCategoryCode || '').toUpperCase();
      if (catCode.includes('TEXTILE') || catCode.includes('SAREE') || catCode.includes('SILK') || catCode.includes('WEAV')) {
        resolvedCategory = 'TEXTILE';
      } else if (catCode.includes('PAINTING') || catCode.includes('MITHILA') || catCode.includes('MADHUBANI') || catCode.includes('ART')) {
        resolvedCategory = 'PAINTING';
      } else if (catCode.includes('METAL') || catCode.includes('DHOKRA') || catCode.includes('BRASS') || catCode.includes('BELL')) {
        resolvedCategory = 'METAL';
      } else if (catCode.includes('WOOD') || catCode.includes('CHANNAPATNA') || catCode.includes('CARV')) {
        resolvedCategory = 'WOOD';
      } else if (catCode.includes('POTTERY') || catCode.includes('TERRACOTTA') || catCode.includes('CLAY')) {
        resolvedCategory = 'POTTERY';
      }

      // Add to central live catalog store
      useCatalogStore.getState().addProductToCatalog({
        id: result.id,
        title: displayTitle,
        artisan: sellerName,
        price: finalSellingPrice || 2150,
        originalPrice: Math.round((finalSellingPrice || 2150) * 1.35),
        imageUri: primaryPhoto?.enhancedUri || primaryPhoto?.uri,
        category: resolvedCategory,
        craftTag: `✓ ${craftCategoryName || '100% Handcrafted'}`,
        craftInfo: displayDescription,
        cluster: 'Kolhapur Heritage Cluster',
      });

      setPublishedProduct(result);
      setIsPublishing(false);
      navigation.replace('PublishSuccess');
    } catch (_err) {
      const authUser = useAuthStore.getState().user;
      const sellerName =
        (extractedEntities?.artisanName as string)?.trim() ||
        authUser?.fullName?.trim() ||
        'Sunita Devi';

      let resolvedCategory = 'POTTERY';
      const catCode = (craftCategoryCode || '').toUpperCase();
      if (catCode.includes('TEXTILE') || catCode.includes('SAREE') || catCode.includes('SILK') || catCode.includes('WEAV')) {
        resolvedCategory = 'TEXTILE';
      } else if (catCode.includes('PAINTING') || catCode.includes('MITHILA') || catCode.includes('MADHUBANI') || catCode.includes('ART')) {
        resolvedCategory = 'PAINTING';
      } else if (catCode.includes('METAL') || catCode.includes('DHOKRA') || catCode.includes('BRASS') || catCode.includes('BELL')) {
        resolvedCategory = 'METAL';
      } else if (catCode.includes('WOOD') || catCode.includes('CHANNAPATNA') || catCode.includes('CARV')) {
        resolvedCategory = 'WOOD';
      } else if (catCode.includes('POTTERY') || catCode.includes('TERRACOTTA') || catCode.includes('CLAY')) {
        resolvedCategory = 'POTTERY';
      }

      // Even if offline/network fails, ensure it is added to the local catalog
      useCatalogStore.getState().addProductToCatalog({
        title: displayTitle,
        artisan: sellerName,
        price: finalSellingPrice || 2150,
        originalPrice: Math.round((finalSellingPrice || 2150) * 1.35),
        imageUri: primaryPhoto?.enhancedUri || primaryPhoto?.uri,
        category: resolvedCategory,
        craftTag: `✓ ${craftCategoryName || '100% Handcrafted'}`,
        craftInfo: displayDescription,
        cluster: 'Kolhapur Heritage Cluster',
      });

      setIsPublishing(false);
      navigation.replace('PublishSuccess');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="Catalog Preview"
        subtitle="Catalog & Digital Craft Passport"
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
              ✓ {craftCategoryName || 'Certified Handcrafted'}
            </Text>
          </View>
        </Card>

        {/* Multimodal Vision Analysis Status Banner */}
        {visionStatus === 'VISION_SUCCESS' && (
          <View style={styles.visionSuccessBanner}>
            <View style={styles.visionBannerHeader}>
              <Text style={styles.visionSuccessIcon}>✨</Text>
              <Text variant="bodyMedium" weight="bold" color="#166534">
                Image analyzed ✓
              </Text>
              {categoryConfidence > 0 && (
                <View style={styles.confidencePill}>
                  <Text style={styles.confidenceText}>
                    {Math.round(categoryConfidence * 100)}% match
                  </Text>
                </View>
              )}
            </View>
            {visualAttributes && (
              <View style={styles.visionAttrRow}>
                {Boolean(visualAttributes.objectType) && (
                  <View style={styles.attrPill}>
                    <Text style={styles.attrPillText}>
                      📦 {visualAttributes.objectType}
                    </Text>
                  </View>
                )}
                {Boolean(visualAttributes.material) && (
                  <View style={styles.attrPill}>
                    <Text style={styles.attrPillText}>
                      🧱 {visualAttributes.material}
                    </Text>
                  </View>
                )}
                {Boolean(visualAttributes.colors?.length) && (
                  <View style={styles.attrPill}>
                    <Text style={styles.attrPillText}>
                      🎨 {visualAttributes.colors.slice(0, 2).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {visionStatus === 'VISION_UNAVAILABLE' && (
          <View style={styles.visionUnavailableBanner}>
            <View style={styles.visionBannerHeader}>
              <Text style={{ fontSize: 18, marginRight: 8 }}>⚠️</Text>
              <Text variant="bodyMedium" weight="bold" color="#991B1B">
                AI image analysis unavailable
              </Text>
            </View>
            <Text variant="bodySmall" color="#7F1D1D" style={{ marginTop: 4, marginBottom: 8, lineHeight: 18 }}>
              {visionStatusMessage ||
                'AI image analysis is currently unavailable. Please enter or edit the description manually before publishing.'}
            </Text>
            <TouchableOpacity
              style={styles.manualEditBannerBtn}
              onPress={handleOpenEdit}
              activeOpacity={0.8}
            >
              <Text style={styles.manualEditBannerBtnText}>✏️ Enter / Edit Description Manually</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trilingual Language Selector Tabs */}
        <View style={styles.langRow}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[600]} style={styles.langLabel}>
            Preview Language:
          </Text>
          <View style={styles.langButtons}>
            {(['en', 'hi', 'bn'] as const).map((lang) => {
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
                    {lang === 'hi' ? 'Hindi' : lang === 'en' ? 'English' : 'Bengali'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Product Details Card */}
        <Card style={styles.detailsCard} variant="elevated">
          <View style={styles.titleRow}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]} style={[styles.titleText, { flex: 1 }]}>
              {displayTitle}
            </Text>
            <TouchableOpacity
              onPress={handleOpenEdit}
              style={styles.editIconBtn}
              accessibilityLabel="Edit Details"
            >
              <Text style={{ fontSize: 16 }}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Price Bar */}
          <View style={styles.priceRow}>
            <View>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
                Approved Selling Price
              </Text>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={{ marginTop: 2 }}>
                ₹{(finalSellingPrice || 2150).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>
                ✓ 100% Authentic Handcrafted
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Cultural Storytelling Copy */}
          <View style={styles.sectionHeaderRow}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionHeading}>
              Artisan Story:
            </Text>
            <TouchableOpacity onPress={handleOpenEdit}>
              <Text variant="bodySmall" weight="bold" color="#6C63FF">
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Text variant="bodyMedium" color={theme.colors.charcoal[700]} style={styles.descriptionText}>
            {displayDescription}
          </Text>

          {/* Care Instructions */}
          {Boolean(careInstructions.en || careInstructions.hi) && (
            <View style={styles.careBox}>
              <Text variant="bodySmall" weight="bold" color="#6B6B8D">
                💡 Care Instructions: {careInstructions.en || careInstructions.hi}
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

      {/* Manual Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={{ marginBottom: 12 }}>
              ✏️ Edit Product Details ({selectedLang.toUpperCase()})
            </Text>

            <Text variant="bodySmall" weight="bold" color="#334155" style={{ marginBottom: 4 }}>
              Product Title:
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Enter product title..."
              placeholderTextColor="#94A3B8"
            />

            <Text variant="bodySmall" weight="bold" color="#334155" style={{ marginTop: 12, marginBottom: 4 }}>
              Product Description:
            </Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Enter detailed craft description..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label={isPublishing ? 'Publishing to Store...' : 'Publish to Store 🚀'}
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
    borderColor: '#E0DCFF',
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
    backgroundColor: 'rgba(108, 99, 255, 0.92)',
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
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  langBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0DCFF',
  },
  detailsCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
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
    color: '#6C63FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0DCFF',
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
    backgroundColor: '#FFF8E1',
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
    color: '#6C63FF',
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
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  visionSuccessBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  visionUnavailableBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  visionBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visionSuccessIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  confidencePill: {
    marginLeft: 'auto',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  visionAttrRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  attrPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attrPillText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  manualEditBannerBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  manualEditBannerBtnText: {
    color: '#B91C1C',
    fontWeight: '700',
    fontSize: 13,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  editIconBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginLeft: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modalTextArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  modalCancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveBtn: {
    backgroundColor: '#6C63FF',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

