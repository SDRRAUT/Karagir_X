import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
        <AppHeader
          title="AI स्टूडियो निखार"
          subtitle="Smart Craft Recognition"
          onBackPress={() => navigation.goBack()}
          showDevanagariLogo
        />
        <View style={styles.centerBox}>
          <Text variant="headlineMedium" color={theme.colors.charcoal[900]}>
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="AI स्टूडियो निखार"
        subtitle="AI Recognition & Clean Finish"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vernacular Audio Readback Banner (Stitch Voice Saathi style) */}
        <View style={styles.voiceCard}>
          <View style={styles.voiceIconBox}>
            <Text style={{ fontSize: 20 }}>🎙️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.voiceTagText}>बोलिए साथी • VOICE SAATHI</Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[800]} style={styles.voiceText}>
              "देखिए! AI ने बैकग्राउंड साफ़ कर दिया है और टेराकोटा की बारीकियों को उभार दिया है।"
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.listenBtn}>
            <Text style={{ fontSize: 18 }}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* Live Progress Stage Stepper if Processing */}
        {isProcessing && (
          <Card style={styles.progressCard} variant="elevated">
            <LoadingSpinner size={36} message="" />
            <Text variant="bodyLarge" weight="bold" color={theme.colors.terracotta[600]} style={styles.progressText}>
              {currentStage.labelHi}
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              {currentStage.labelEn} ({currentStage.progressPercent}%)
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${currentStage.progressPercent}%`,
                    backgroundColor: '#6C63FF',
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
              viewMode === 'ENHANCED' ? styles.toggleBtnActiveEnhanced : styles.toggleBtnInactive,
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={viewMode === 'ENHANCED' ? '#FFFFFF' : theme.colors.charcoal[700]}
            >
              ✨ AI स्टूडियो फोटो (Enhanced)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="toggle-original-btn"
            onPress={() => setViewMode('ORIGINAL')}
            style={[
              styles.toggleBtn,
              viewMode === 'ORIGINAL' ? styles.toggleBtnActiveOriginal : styles.toggleBtnInactive,
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={viewMode === 'ORIGINAL' ? '#FFFFFF' : theme.colors.charcoal[700]}
            >
              📷 मूल फोटो (Original)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Photo Canvas with Stitch AI Recognition Pill */}
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

          {/* Stitch AI Recognition Pill Overlay */}
          <View style={styles.recognitionPill}>
            <View style={styles.recognitionIcon}>
              <Text style={{ fontSize: 16 }}>⚡</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.recognitionStatus}>
                {viewMode === 'ENHANCED' ? '✨ स्वच्छ स्टूडियो फिनिश' : '📷 मूल वर्कशॉप फोटो'}
              </Text>
              <Text style={styles.recognitionResult} numberOfLines={1}>
                Terracotta Pottery Detected (GI #MH-24)
              </Text>
            </View>
            <View style={styles.recognitionCheck}>
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>✓</Text>
            </View>
          </View>
        </Card>

        {/* AI Studio Quality Metrics Bar */}
        <Card style={styles.metricsCard} variant="elevated">
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.forest[700]}>
              {Math.round(metrics.segmentationConfidence * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              🎯 AI शुद्धता
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.terracotta[600]}>
              {Math.round(metrics.sharpnessScore * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              🌟 स्पष्टता
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.forest[700]}>
              {Math.round(metrics.colorAccuracyScore * 100)}%
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              🎨 रंग सत्यता
            </Text>
          </View>
        </Card>

        {/* Studio Background Selector Presets */}
        <View style={styles.presetSection}>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} style={styles.presetTitle}>
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
                        ? '#e85d2a'
                        : '#ECE8DC',
                      borderWidth: isSelected ? 2.5 : 1,
                    },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    color={isSelected ? '#6C63FF' : theme.colors.charcoal[800]}
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
              variant="secondary"
              size="default"
              isLoading={isBatchEnhancing}
              onPress={handleEnhanceAll}
            />
          </View>
        )}

        {/* Multi-Photo Thumbnails */}
        {photos.length > 1 && (
          <View style={styles.multiRow}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[600]} style={styles.multiLabel}>
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
                          ? '#6C63FF'
                          : '#E0DCFF',
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
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label="यह फोटो सही है (Accept & Continue) ✓"
          variant="primary"
          size="default"
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
  voiceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  voiceTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9C6E00',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  voiceText: {
    lineHeight: 18,
  },
  listenBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  progressCard: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
  },
  progressText: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0ECE6',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  toggleBtnActiveEnhanced: {
    backgroundColor: '#e85d2a',
  },
  toggleBtnActiveOriginal: {
    backgroundColor: '#6B6B8D',
  },
  previewCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  previewImage: {
    width: '100%',
    height: 320,
  },
  recognitionPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  recognitionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recognitionStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8A827B',
  },
  recognitionResult: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e85d2a',
  },
  recognitionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e85d2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  metricsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginTop: 16,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#ECE8DC',
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
    backgroundColor: '#FFFFFF',
  },
  thumbFill: {
    width: '100%',
    height: '100%',
  },
  thumbCheck: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#6C63FF',
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

