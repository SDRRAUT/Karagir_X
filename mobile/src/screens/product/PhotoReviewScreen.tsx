import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useProductDraftStore, ProductPhoto, PhotoAngle } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoReview'>;

export const PhotoReviewScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { photos, removePhoto, primaryPhotoId, setPrimaryPhoto } = useProductDraftStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedPhoto: ProductPhoto | undefined = photos[selectedIndex] || photos[0];

  const angleLabels: Record<PhotoAngle, string> = {
    FRONT: 'सामने (Front)',
    TEXTURE: 'कारीगरी (Detail)',
    SIDE_BACK: 'साइड / पीछे (Side)',
    SCALE: 'नाप (Scale)',
  };

  const handleDelete = (id: string) => {
    Alert.alert('फोटो हटाएं', 'क्या आप इस फोटो को हटाना चाहते हैं?', [
      { text: 'रद्द करें', style: 'cancel' },
      {
        text: 'हटाएं',
        style: 'destructive',
        onPress: () => {
          removePhoto(id);
          if (selectedIndex >= photos.length - 1 && selectedIndex > 0) {
            setSelectedIndex((prev) => prev - 1);
          }
        },
      },
    ]);
  };

  const handleAddMore = () => {
    if (photos.length >= 4) {
      Alert.alert('अधिकतम सीमा', 'अधिकतम 4 फोटो पूरी हो चुकी हैं।');
      return;
    }
    navigation.navigate('CameraCapture');
  };

  const handleProceedEnhance = () => {
    if (photos.length === 0) {
      Alert.alert('फोटो आवश्यक है', 'कम से कम एक फोटो जोड़ें।');
      return;
    }
    navigation.navigate('AiEnhancement');
  };

  if (!selectedPhoto) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium" color={theme.colors.text.primary} align="center">
            कोई फोटो नहीं मिली
          </Text>
          <Button
            label="फोटो खींचें (Take Photo) 📷"
            variant="primary"
            onPress={() => navigation.navigate('CameraCapture')}
            style={styles.emptyBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Top Header */}
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
          फोटो समीक्षा ({photos.length}/4)
        </Text>
        <TouchableOpacity
          onPress={() => handleDelete(selectedPhoto.id)}
          accessibilityRole="button"
          accessibilityLabel="Delete selected photo"
          style={styles.deleteBtn}
        >
          <Text style={styles.trashEmoji}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Large Photo Preview */}
        <Card style={styles.mainPreviewCard}>
          <Image
            source={{ uri: selectedPhoto.uri }}
            style={styles.largeImage}
            resizeMode="cover"
          />

          {/* Quality Indicator Pill */}
          <View
            style={[
              styles.qualityBadge,
              {
                backgroundColor:
                  selectedPhoto.quality === 'GOOD'
                    ? '#E8F5E9'
                    : theme.colors.surface.parchment,
                borderColor:
                  selectedPhoto.quality === 'GOOD'
                    ? theme.colors.primary.emerald700
                    : theme.colors.status.warning,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={
                selectedPhoto.quality === 'GOOD'
                  ? theme.colors.primary.emerald700
                  : theme.colors.status.warning
              }
            >
              {selectedPhoto.quality === 'GOOD'
                ? '✅ क्वालिटी अच्छी है (Clear & Sharp)'
                : '⚠️ थोड़ी धुंधली है (Slightly Blurry)'}
            </Text>
          </View>

          {/* Primary Badge */}
          {primaryPhotoId === selectedPhoto.id && (
            <View style={styles.primaryBadge}>
              <Text variant="bodySmall" weight="bold" color="#FFFFFF">
                ⭐ मुख्य कवर फोटो (Primary Cover)
              </Text>
            </View>
          )}
        </Card>

        {/* Thumbnail Selector Strip */}
        <View style={styles.thumbnailSection}>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary} style={styles.sectionLabel}>
            सभी एंगल्स ({photos.length}/4)
          </Text>

          <View style={styles.thumbnailRow}>
            {photos.map((photo, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <TouchableOpacity
                  key={photo.id}
                  onPress={() => setSelectedIndex(idx)}
                  style={[
                    styles.thumbWrapper,
                    {
                      borderColor: isSelected
                        ? theme.colors.primary.emerald700
                        : theme.colors.surface.border,
                      borderWidth: isSelected ? 3 : 1.5,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select photo ${idx + 1}`}
                >
                  <Image source={{ uri: photo.uri }} style={styles.thumbImage} />
                  <View style={styles.thumbAngleTag}>
                    <Text variant="bodySmall" weight="bold" color="#FFFFFF" style={styles.angleText}>
                      {angleLabels[photo.angle]}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Angle Button */}
            {photos.length < 4 && (
              <TouchableOpacity
                testID="add-angle-btn"
                onPress={handleAddMore}
                style={[
                  styles.addAngleBtn,
                  {
                    borderColor: theme.colors.primary.emerald700,
                    backgroundColor: theme.colors.primary.emerald100,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Add another photo angle"
              >
                <Text style={styles.addAngleIcon}>➕</Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700} align="center">
                  और एंगल
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Set as Primary Button if not already */}
        {primaryPhotoId !== selectedPhoto.id && (
          <Button
            label="इसे मुख्य कवर फोटो बनाएं (Set as Primary) ⭐"
            variant="outline"
            size="default"
            onPress={() => setPrimaryPhoto(selectedPhoto.id)}
            style={styles.setPrimaryBtn}
          />
        )}
      </ScrollView>

      {/* Bottom CTA to AI Enhancement */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label="AI से फोटो सुंदर बनाएं (Enhance with AI) ✨"
          variant="terracotta"
          size="decision"
          onPress={handleProceedEnhance}
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
  deleteBtn: {
    padding: 4,
  },
  trashEmoji: {
    fontSize: 24,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  mainPreviewCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20,
  },
  largeImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#F0EAE1',
  },
  qualityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(30, 86, 49, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  thumbnailSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  thumbnailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thumbWrapper: {
    width: 76,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 10,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbAngleTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  angleText: {
    fontSize: 9,
  },
  addAngleBtn: {
    width: 76,
    height: 96,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  addAngleIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  setPrimaryBtn: {
    marginVertical: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyBtn: {
    marginTop: 16,
  },
});
