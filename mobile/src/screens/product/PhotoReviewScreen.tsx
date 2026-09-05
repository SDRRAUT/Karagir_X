import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
        <AppHeader
          title="फोटो समीक्षा"
          subtitle="Review Product Photos"
          onBackPress={() => navigation.goBack()}
          showDevanagariLogo
        />
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium" color={theme.colors.charcoal[900]} align="center">
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title={`फोटो समीक्षा (${photos.length}/4)`}
        subtitle="Review Product Photos"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
        rightElement={
          <TouchableOpacity
            onPress={() => handleDelete(selectedPhoto.id)}
            accessibilityRole="button"
            accessibilityLabel="Delete selected photo"
            style={styles.deleteBtn}
          >
            <Text style={styles.trashEmoji}>🗑️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Large Photo Preview */}
        <Card style={styles.mainPreviewCard} variant="elevated">
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
                    ? '#E8F5EE'
                    : '#FFF8E1',
                borderColor:
                  selectedPhoto.quality === 'GOOD'
                    ? '#6C63FF'
                    : '#FFBF42',
              },
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={
                selectedPhoto.quality === 'GOOD'
                  ? '#6C63FF'
                  : '#9C6E00'
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
          <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionLabel}>
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
                        ? '#6C63FF'
                        : '#E0DCFF',
                      borderWidth: isSelected ? 2.5 : 1.5,
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
                style={styles.addAngleBtn}
                accessibilityRole="button"
                accessibilityLabel="Add another photo angle"
              >
                <Text style={styles.addAngleIcon}>➕</Text>
                <Text variant="bodySmall" weight="bold" color="#6C63FF" align="center">
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
            variant="secondary"
            size="default"
            onPress={() => setPrimaryPhoto(selectedPhoto.id)}
            style={styles.setPrimaryBtn}
          />
        )}
      </ScrollView>

      {/* Bottom CTA to AI Enhancement */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label="AI से फोटो सुंदर बनाएं (Enhance with AI) ✨"
          variant="primary"
          size="default"
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
  deleteBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
  },
  trashEmoji: {
    fontSize: 18,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  mainPreviewCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
  },
  largeImage: {
    width: '100%',
    height: 320,
    backgroundColor: '#F7F4F0',
  },
  qualityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'rgba(20, 24, 21, 0.7)',
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
    borderColor: '#6C63FF',
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  addAngleIcon: {
    fontSize: 22,
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

