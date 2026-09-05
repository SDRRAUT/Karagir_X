import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useProductDraftStore } from '@/store/useProductDraftStore';
import { voiceService, VoiceTranscriptionResult } from '@/api/voiceService';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceDescription'>;

export const VoiceDescriptionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { photos, primaryPhotoId, setVoiceStory } = useProductDraftStore();

  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<VoiceTranscriptionResult | null>(null);

  const [pulseAnim] = useState(() => new Animated.Value(1));
  const timerRef = useRef<any>(null);

  const primaryPhoto =
    photos.find((p) => p.id === primaryPhotoId) || photos[0];

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      timerRef.current = setInterval(() => {
        setSecondsRecorded((prev) => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, pulseAnim]);

  const handleStartRecording = () => {
    setSecondsRecorded(0);
    setIsRecording(true);
    setTranscriptionResult(null);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      const result = await voiceService.transcribeDescription('file:///mock/recorded_voice.wav');
      setTranscriptionResult(result);
      setVoiceStory('file:///mock/recorded_voice.wav', result.transcript, result.extractedEntities);
      setIsProcessing(false);
    } catch (_err) {
      setIsProcessing(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="बोलकर बताएं (Voice Story)"
        subtitle="बोलिए साथी • 12+ भारतीय भाषायें"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Photo & Context Banner */}
        <Card style={styles.productBanner} variant="elevated">
          {primaryPhoto ? (
            <Image
              source={{ uri: primaryPhoto.enhancedUri || primaryPhoto.uri }}
              style={styles.thumb}
            />
          ) : (
            <View style={[styles.thumb, styles.placeholderThumb]}>
              <Text style={{ fontSize: 24 }}>🎨</Text>
            </View>
          )}
          <View style={styles.bannerInfo}>
            <View style={styles.voiceTagPill}>
              <Text style={styles.voiceTagText}>बोली साथी • AI SAATHI</Text>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              अपनी कला के बारे में खुलकर बताएं
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2 }}>
              यह क्या है, कैसे बनाई, क्या सामग्री और समय लगा
            </Text>
          </View>
        </Card>

        {/* Central Audio Recording Studio */}
        <View style={styles.centerStage}>
          {/* Animated Pulse Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: isRecording ? '#6C63FF' : '#DAA520',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          {/* 96dp Round Recording Button */}
          <TouchableOpacity
            testID="record-voice-btn"
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            activeOpacity={0.85}
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording ? '#6B6B8D' : '#6C63FF',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'रिकॉर्डिंग रोकें' : 'रिकॉर्डिंग शुरू करें'}
          >
            <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
          </TouchableOpacity>

          {/* Recording Timer & Guidance Text */}
          <Text
            variant="headlineLarge"
            weight="bold"
            color={isRecording ? '#6C63FF' : theme.colors.charcoal[900]}
            style={styles.timerText}
          >
            {isRecording ? formatTimer(secondsRecorded) : 'माइक दबाकर बोलें'}
          </Text>

          <View style={styles.guidancePill}>
            <Text variant="bodySmall" color={theme.colors.charcoal[600]}>
              {isRecording
                ? '🔴 आवाज़ रिकॉर्ड हो रही है... जब पूरा हो जाए तो रोकें'
                : '🎤 1-2 मिनट अपनी स्वाभाविक मातृभाषा में बोलें'}
            </Text>
          </View>

          {/* Sound Wave Visualization when recording */}
          {isRecording && (
            <View style={styles.waveRow}>
              {[8, 18, 28, 14, 24, 32, 20, 12, 26, 16, 30, 22, 10, 20].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: h,
                      backgroundColor: i % 2 === 0 ? '#6C63FF' : '#4F9DFF',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Processing State */}
        {isProcessing && (
          <Card style={styles.processingCard} variant="elevated">
            <LoadingSpinner size={32} message="" />
            <Text
              variant="bodyLarge"
              weight="bold"
              color={theme.colors.terracotta[600]}
              style={{ marginTop: 8 }}
            >
              भाषिणी AI आवाज़ समझ रहा है...
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              Bhashini Speech Engine: ट्रांसक्रिप्शन व जानकारी निकाली जा रही है
            </Text>
          </Card>
        )}

        {/* Successful Transcript Card (Stitch Bolie Saathi Transcription format) */}
        {transcriptionResult && !isProcessing && (
          <Card style={styles.resultCard} variant="elevated">
            <View style={styles.resultHeader}>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>LIVE SPEECH TRANSCRIPTION</Text>
              </View>
              <Text variant="bodySmall" color={theme.colors.heritageTeal[700]} weight="bold">
                Hindi • English Mixed
              </Text>
            </View>

            <Text variant="caption" weight="bold" color={theme.colors.brand.primary} style={{ marginTop: 6, marginBottom: 2 }}>
              आपकी आवाज़ का सारांश (Voice Summary):
            </Text>

            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.transcriptText}>
              "{transcriptionResult.transcript}"
            </Text>

            <View style={styles.clusterBadge}>
              <Text style={styles.clusterBadgeText}>
                ✓ AI Match: GI Certified Cluster Attributes Attached
              </Text>
            </View>

            {/* Extracted Entities Tag Chips */}
            <View style={styles.entitiesContainer}>
              {Boolean(transcriptionResult.extractedEntities.material) && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[800]}>
                    🧵 सामग्री: {transcriptionResult.extractedEntities.material}
                  </Text>
                </View>
              )}
              {Boolean(transcriptionResult.extractedEntities.technique) && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta[600]}>
                    🖌️ शैली: {transcriptionResult.extractedEntities.technique}
                  </Text>
                </View>
              )}
              {Boolean(transcriptionResult.extractedEntities.motif) && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[800]}>
                    🪡 पैटर्न: {transcriptionResult.extractedEntities.motif}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Sticky Bar */}
      {!isProcessing && (
        <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
          <Button
            label={
              transcriptionResult
                ? "अगला: सवाल-जवाब (Continue to AI Voice Saathi) →"
                : "🎙️ अगला: सवाल-जवाब (Start Voice Saathi Interview) →"
            }
            variant="primary"
            size="default"
            onPress={() => navigation.navigate('VoiceFollowUp')}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 20,
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    marginRight: 14,
  },
  placeholderThumb: {
    backgroundColor: '#F3EFE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  voiceTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  voiceTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6C63FF',
    letterSpacing: 0.5,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2.5,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  micIcon: {
    fontSize: 42,
  },
  timerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  guidancePill: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3EFE9',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginTop: 18,
    gap: 4,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  processingCard: {
    alignItems: 'center',
    padding: 18,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
  },
  resultCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B6B8D',
    letterSpacing: 0.5,
  },
  transcriptText: {
    lineHeight: 24,
    marginBottom: 12,
  },
  clusterBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  clusterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
  },
  entitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  entityChip: {
    backgroundColor: '#F3EFE9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
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
});

