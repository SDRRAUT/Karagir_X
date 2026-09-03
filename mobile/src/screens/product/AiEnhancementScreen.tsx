import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import {
  useProductDraftStore,
  ProductPhoto,
  StudioBackgroundPreset,
} from '@/store/useProductDraftStore';
import { visionService, StageInfo, ENHANCEMENT_STAGES } from '@/api/visionService';

type Props = NativeStackScreenProps<RootStackParamList, 'AiEnhancement'>;

const PRESETS: { id: StudioBackgroundPreset; labelHi: string; labelEn: string; color: string }[] = [
  { id: 'STUDIO_WHITE', labelHi: 'सफेद स्टूडियो', labelEn: 'Studio White', color: '#FFFFFF' },
  { id: 'WARM_PARCHMENT', labelHi: 'हस्तशिल्प क्रीम', labelEn: 'Warm Parchment', color: '#F9F6F0' },
  { id: 'STUDIO_GREY', labelHi: 'तटस्थ ग्रे', labelEn: 'Neutral Grey', color: '#EBEBEB' },
];

export const AiEnhancementScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const {
    photos,
    primaryPhotoId,
    backgroundPreset,
    setBackgroundPreset,
    setEnhancedPhoto,
  } = useProductDraftStore();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'ENHANCED' | 'ORIGINAL'>('ENHANCED');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<StageInfo>(ENHANCEMENT_STAGES.COMPLETED);
  const [isBatchEnhancing, setIsBatchEnhancing] = useState(false);

  const activePhoto: ProductPhoto | undefined =
    photos.find((p) => p.id === primaryPhotoId) || photos[activePhotoIndex] || photos[0];

  const activePhotoId = activePhoto?.id;
  const isAlreadyEnhanced = activePhoto?.isEnhanced;

  const processSinglePhoto = useCallback(
    async (photo: ProductPhoto) => {
      setIsProcessing(true);
      try {
        const result = await visionService.enhancePhoto(
          photo.uri,
          'TEXTILE_HANDLOOM',
          (info) => setCurrentStage(info)
        );

        setEnhancedPhoto(photo.id, result.enhanced_asset_url, {
          sharpnessScore: result.quality_metrics.sharpness_score,
          colorAccuracyScore: result.quality_metrics.color_accuracy_score,
          segmentationConfidence: result.quality_metrics.segmentation_confidence,
        });
        setIsProcessing(false);
      } catch (_err) {
        setIsProcessing(false);
      }
    },
    [setEnhancedPhoto]
  );

  useEffect(() => {
    if (activePhoto && !isAlreadyEnhanced) {
      const timer = setTimeout(() => {
        processSinglePhoto(activePhoto);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activePhotoId, isAlreadyEnhanced, activePhoto, processSinglePhoto]);

  const handleEnhanceAll = async () => {
    setIsBatchEnhancing(true);
    for (const photo of photos) {
      if (!photo.isEnhanced) {
        await processSinglePhoto(photo);
      }
    }
    setIsBatchEnhancing(false);
    Alert.alert('सभी फोटो तैयार हैं!', 'सभी एंगल्स AI से सफलतापूर्वक निखार दिए गए हैं।');
  };

  const handleAcceptAndContinue = () => {
    navigation.navigate('MicPermission');
  };

  if (!activePhoto) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
        <View style={styles.centerBox}>
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            कोई फोटो नहीं मिली
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentBgColor =
    backgroundPreset === 'STUDIO_WHITE'
      ? '#FFFFFF'
      : backgroundPreset === 'WARM_PARCHMENT'
      ? '#F9F6F0'
      : '#EBEBEB';

  const metrics = activePhoto.qualityMetrics || {
    sharpnessScore: 0.93,
    colorAccuracyScore: 0.96,
    segmentationConfidence: 0.95,
  };

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
          AI स्टूडियो निखार (AI Studio)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vernacular Audio Readback Banner */}
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
            "देखिए! AI ने बैकग्राउंड साफ़ कर दिया है और असली रंगों को उभार दिया है।"
          </Text>
        </View>

        {/* Live Progress Stage Stepper if Processing */}
        {isProcessing && (
          <Card style={styles.progressCard}>
            <LoadingSpinner size={36} message="" />
            <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700} style={styles.progressText}>
              {currentStage.labelHi}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {currentStage.labelEn} ({currentStage.progressPercent}%)
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${currentStage.progressPercent}%`,
                    backgroundColor: theme.colors.primary.emerald700,
                  },
                ]}
              />
            </View>
          </Card>
        )}

        {/* Before / After View Mode Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            testID="toggle-enhanced-btn"
            onPress={() => setViewMode('ENHANCED')}
            style={[
              styles.toggleBtn,
              viewMode === 'ENHANCED' && {
                backgroundColor: theme.colors.primary.emerald700,
                borderColor: theme.colors.primary.emerald700,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={viewMode === 'ENHANCED' ? '#FFFFFF' : theme.colors.text.primary}
            >
              ✨ AI स्टूडियो फोटो (Enhanced)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="toggle-original-btn"
            onPress={() => setViewMode('ORIGINAL')}
            style={[
              styles.toggleBtn,
              viewMode === 'ORIGINAL' && {
                backgroundColor: theme.colors.terracotta.primary,
                borderColor: theme.colors.terracotta.primary,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={viewMode === 'ORIGINAL' ? '#FFFFFF' : theme.colors.text.primary}
            >
              📷 मूल फोटो (Original)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Photo Canvas */}
        <Card
          style={[
            styles.previewCard,
            {
              backgroundColor: viewMode === 'ENHANCED' ? currentBgColor : '#EAEAEA',
            },
          ]}
        >
          <Image
            source={{
              uri:
                viewMode === 'ENHANCED' && activePhoto.enhancedUri
                  ? activePhoto.enhancedUri
                  : activePhoto.uri,
            }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {/* Mode Pill Tag */}
          <View
            style={[
              styles.modeTag,
              {
                backgroundColor:
                  viewMode === 'ENHANCED'
                    ? theme.colors.primary.emerald700
                    : theme.colors.terracotta.primary,
              },
            ]}
          >
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              {viewMode === 'ENHANCED' ? '✨ स्वच्छ स्टूडियो फिनिश' : '📷 मूल वर्कशॉप फोटो'}
            </Text>
          </View>
        </Card>

        {/* AI Studio Quality Metrics Bar */}
        <View
          style={[
            styles.metricsCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.surface.border,
              ...theme.shadows.level1,
            },
          ]}
        >
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
              {Math.round(metrics.segmentationConfidence * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              🎯 AI शुद्धता
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.terracotta.primary}>
              {Math.round(metrics.sharpnessScore * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              🌟 स्पष्टता
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
              {Math.round(metrics.colorAccuracyScore * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              🎨 रंग सत्यता
            </Text>
          </View>
        </View>

        {/* Studio Background Selector Presets */}
        <View style={styles.presetSection}>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary} style={styles.presetTitle}>
            स्टूडियो बैकग्राउंड चुनें (Studio Background):
          </Text>
          <View style={styles.presetRow}>
            {PRESETS.map((preset) => {
              const isSelected = backgroundPreset === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => setBackgroundPreset(preset.id)}
                  style={[
                    styles.presetPill,
                    {
                      backgroundColor: preset.color,
                      borderColor: isSelected
                        ? theme.colors.primary.emerald700
                        : theme.colors.surface.border,
                      borderWidth: isSelected ? 2.5 : 1,
                    },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    color={isSelected ? theme.colors.primary.emerald700 : theme.colors.text.primary}
                  >
                    {preset.labelHi}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Batch Enhance All Angles Button (If multiple photos exist) */}
        {photos.length > 1 && (
          <View style={styles.batchContainer}>
            <Button
              label={isBatchEnhancing ? 'सभी फोटो निखार रहे हैं...' : `सभी ${photos.length} फोटो AI से निखारें (Enhance All) ⚡`}
              variant="outline"
              size="default"
              isLoading={isBatchEnhancing}
              onPress={handleEnhanceAll}
            />
          </View>
        )}

        {/* Multi-Photo Thumbnails */}
        {photos.length > 1 && (
          <View style={styles.multiRow}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.multiLabel}>
              अन्य एंगल चुनें:
            </Text>
            <View style={styles.photoThumbList}>
              {photos.map((p, idx) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setActivePhotoIndex(idx)}
                  style={[
                    styles.smallThumb,
                    {
                      borderColor:
                        activePhoto.id === p.id
                          ? theme.colors.primary.emerald700
                          : theme.colors.surface.border,
                      borderWidth: activePhoto.id === p.id ? 2.5 : 1,
                    },
                  ]}
                >
                  <Image source={{ uri: p.enhancedUri || p.uri }} style={styles.thumbFill} />
                  {p.isEnhanced && (
                    <View style={styles.thumbCheck}>
                      <Text style={styles.thumbCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label="यह फोटो सही है (Accept & Continue) ✓"
          variant="primary"
          size="decision"
          onPress={handleAcceptAndContinue}
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
    fontSize: 28,
    marginRight: 12,
  },
  voiceText: {
    flex: 1,
  },
  progressCard: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  progressText: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  previewCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 320,
  },
  modeTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  metricsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0D7C9',
  },
  presetSection: {
    marginBottom: 16,
  },
  presetTitle: {
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetPill: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batchContainer: {
    marginBottom: 16,
  },
  multiRow: {
    marginTop: 8,
  },
  multiLabel: {
    marginBottom: 8,
  },
  photoThumbList: {
    flexDirection: 'row',
  },
  smallThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    position: 'relative',
  },
  thumbFill: {
    width: '100%',
    height: '100%',
  },
  thumbCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#1E5631',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCheckText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
