import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<any>(null);

  const primaryPhoto =
    photos.find((p) => p.id === primaryPhotoId) || photos[0];

  // Pulsing animation during recording
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
          बोलकर बताएं (Voice Story)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Photo & Context Banner */}
        <Card style={styles.productBanner}>
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
            <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
              अपनी कला के बारे में बताएं
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              (जैसे: यह क्या है, कैसे बनाई, क्या सामग्री लगी)
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
                borderColor: isRecording
                  ? theme.colors.terracotta.primary
                  : theme.colors.primary.emerald700,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />

          {/* 96dp Round Recording Button */}
          <TouchableOpacity
            testID="record-voice-btn"
            onPress={isRecording ? handleStopRecording : handleStartRecording}
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording
                  ? theme.colors.terracotta.primary
                  : theme.colors.primary.emerald700,
                ...theme.shadows.level3,
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
            color={isRecording ? theme.colors.terracotta.primary : theme.colors.text.primary}
            style={styles.timerText}
          >
            {isRecording ? formatTimer(secondsRecorded) : 'माइक दबाकर बोलें'}
          </Text>

          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.guidancePill}>
            {isRecording
              ? '🔴 आवाज़ रिकॉर्ड हो रही है... जब पूरा हो जाए तो बटन दबाएं'
              : '🎤 1-2 मिनट खुलकर अपनी भाषा में बोलें'}
          </Text>
        </View>

        {/* Processing State */}
        {isProcessing && (
          <Card style={styles.processingCard}>
            <LoadingSpinner size={32} message="" />
            <Text
              variant="bodyLarge"
              weight="bold"
              color={theme.colors.primary.emerald700}
              style={{ marginTop: 8 }}
            >
              AI आपकी आवाज़ समझ रहा है...
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              Bhashini Speech Engine: ट्रांसक्रिप्शन व जानकारी निकाली जा रही है
            </Text>
          </Card>
        )}

        {/* Successful Transcript Card */}
        {transcriptionResult && !isProcessing && (
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                ✅ आपकी आवाज़ का सारांश:
              </Text>
            </View>
            <Text variant="bodyMedium" color={theme.colors.text.primary} style={styles.transcriptText}>
              "{transcriptionResult.transcript}"
            </Text>

            {/* Extracted Entities Tag Chips */}
            <View style={styles.entitiesContainer}>
              {transcriptionResult.extractedEntities.material && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                    🧵 सामग्री: {transcriptionResult.extractedEntities.material}
                  </Text>
                </View>
              )}
              {transcriptionResult.extractedEntities.technique && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                    🖌️ शैली: {transcriptionResult.extractedEntities.technique}
                  </Text>
                </View>
              )}
              {transcriptionResult.extractedEntities.motif && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                    🪡 पैटर्न: {transcriptionResult.extractedEntities.motif}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Sticky Bar */}
      {transcriptionResult && !isProcessing && (
        <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
          <Button
            label="अगला: सवाल-जवाब (Continue to AI Q&A) →"
            variant="primary"
            size="decision"
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
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 24,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 14,
  },
  placeholderThumb: {
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 44,
  },
  timerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  guidancePill: {
    marginTop: 8,
    textAlign: 'center',
  },
  processingCard: {
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
  },
  resultCard: {
    marginTop: 20,
    padding: 16,
  },
  resultHeader: {
    marginBottom: 8,
  },
  transcriptText: {
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  entitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  entityChip: {
    backgroundColor: '#F3EFE6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
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
