import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { VoiceTextInput as TextInput } from '@/components/inputs/VoiceTextInput';
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
import {
  speechRecognitionService,
  SpeechLanguage,
} from '@/services/speechRecognitionService';
import {
  aiVoiceModifierService,
  AiVoiceModificationResult,
} from '@/services/aiVoiceModifierService';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceDescription'>;

export const VoiceDescriptionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { photos, primaryPhotoId, setVoiceStory } = useProductDraftStore();

  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState<VoiceTranscriptionResult | null>(null);
  const [isModifyingWithAi, setIsModifyingWithAi] = useState(false);
  const [aiModifiedResult, setAiModifiedResult] = useState<AiVoiceModificationResult | null>(null);

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartRecording = () => {
    setSecondsRecorded(0);
    setTranscriptionResult(null);
    setAiModifiedResult(null);
    setErrorMessage(null);

    const started = speechRecognitionService.startListening(
      {
        onStart: () => {
          setIsRecording(true);
          setErrorMessage(null);
        },
        onResult: (transcript) => {
          setSpokenTranscript(transcript);
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          setIsRecording(false);
          setErrorMessage(err || 'Voice recognition error occurred.');
        },
        onEnd: () => {
          setIsRecording(false);
        },
      },
      selectedLanguage
    );

    if (!started) {
      setIsRecording(false);
      setErrorMessage(
        selectedLanguage.startsWith('hi')
          ? 'आवाज़ पहचान शुरू नहीं हो सकी। कृपया माइक्रोफ़ोन अनुमति और डिवाइस स्पीच सेटिंग्स जांचें।'
          : selectedLanguage.startsWith('mr')
          ? 'आवाज ओळख सुरू होऊ शकली नाही. कृपया मायक्रोफोन परवानगी आणि डिव्हाइस स्पीच सेटिंग्ज तपासा.'
          : 'Android speech recognition could not start. Please check microphone permissions and device speech settings.'
      );
    } else {
      setIsRecording(true);
    }
  };

  const handleStopRecording = async () => {
    speechRecognitionService.stopListening();
    setIsRecording(false);

    const userText = spokenTranscript.trim();
    if (!userText) {
      setErrorMessage(
        selectedLanguage.startsWith('hi')
          ? 'कोई आवाज़ सुनाई नहीं दी। कृपया माइक बटन दबाकर बोलें या नीचे लिखें।'
          : selectedLanguage.startsWith('mr')
          ? 'कोणताही आवाज ऐकू आला नाही. कृपया माइक बटण दाबून बोला किंवा खाली लिहा.'
          : 'No speech detected. Please speak into the mic or type your story.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await voiceService.transcribeDescription(
        'speech-stream://microphone',
        selectedLanguage.split('-')[0],
        userText
      );

      setTranscriptionResult(result);
      setSpokenTranscript(result.transcript);
      setVoiceStory('speech-stream://microphone', result.transcript, result.extractedEntities);
      setIsProcessing(false);
    } catch (_err) {
      setIsProcessing(false);
      setErrorMessage('Could not process speech description. You can edit text directly.');
    }
  };

  const handleModifyWithAi = async () => {
    const textToModify = spokenTranscript || transcriptionResult?.transcript || '';
    if (!textToModify.trim()) return;

    setIsModifyingWithAi(true);
    try {
      const aiRes = await aiVoiceModifierService.modifyWithAi(textToModify, 'product_story');
      setAiModifiedResult(aiRes);

      const updatedEntities = {
        ...(transcriptionResult?.extractedEntities || {}),
        ...(aiRes.extractedAttributes || {}),
      };

      setVoiceStory('speech-stream://microphone', aiRes.modifiedText, updatedEntities);
      setTranscriptionResult((prev) =>
        prev
          ? {
              ...prev,
              transcript: aiRes.modifiedText,
              extractedEntities: updatedEntities,
            }
          : {
              transcript: aiRes.modifiedText,
              extractedEntities: updatedEntities,
              isComplete: false,
            }
      );
      setIsModifyingWithAi(false);
    } catch (_e) {
      setIsModifyingWithAi(false);
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
        title="Voice Story"
        subtitle="Voice Saathi • 12+ Indian Languages"
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
              <Text style={styles.voiceTagText}>VOICE SAATHI • AI ASSISTANT</Text>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              Tell us about your handcrafted creation
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2 }}>
              Speak naturally: what is it, how did you make it, what materials were used?
            </Text>
          </View>
        </Card>

        {/* Language Selector Bar */}
        <View style={styles.langSelectorRow}>
          <Text variant="bodySmall" weight="semiBold" color="#64748B">
            Language:
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('hi-IN')}
            style={[styles.langChip, selectedLanguage === 'hi-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'hi-IN' && styles.langChipTextActive,
              ]}
            >
              🇮🇳 हिंदी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('mr-IN')}
            style={[styles.langChip, selectedLanguage === 'mr-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'mr-IN' && styles.langChipTextActive,
              ]}
            >
              मराठी
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('en-IN')}
            style={[styles.langChip, selectedLanguage === 'en-IN' && styles.langChipActive]}
          >
            <Text
              style={[
                styles.langChipText,
                selectedLanguage === 'en-IN' && styles.langChipTextActive,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Central Audio Recording Studio */}
        <View style={styles.centerStage}>
          {/* Animated Pulse Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                borderColor: isRecording ? '#EA580C' : '#DAA520',
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
                backgroundColor: isRecording ? '#EA580C' : '#6C63FF',
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
          </TouchableOpacity>

          {/* Recording Timer & Guidance Text */}
          <Text
            variant="headlineLarge"
            weight="bold"
            color={isRecording ? '#EA580C' : theme.colors.charcoal[900]}
            style={styles.timerText}
          >
            {isRecording ? formatTimer(secondsRecorded) : 'Tap Mic to Speak'}
          </Text>

          <View style={styles.guidancePill}>
            <Text variant="bodySmall" color={theme.colors.charcoal[600]}>
              {isRecording
                ? '🔴 Recording audio... Tap when finished'
                : '🎤 Speak naturally in your native language for 1-2 minutes'}
            </Text>
          </View>

          {errorMessage ? (
            <View style={{ backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8, marginTop: 8, maxWidth: '90%' }}>
              <Text variant="bodySmall" color="#DC2626" weight="semiBold" style={{ textAlign: 'center' }}>
                ⚠️ {errorMessage}
              </Text>
            </View>
          ) : null}

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
                      backgroundColor: i % 2 === 0 ? '#EA580C' : '#F59E0B',
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* STEP 1: Spoken Voice Transcript Display Card (Display to User) */}
        {(spokenTranscript.length > 0 || isRecording) && (
          <Card style={styles.spokenVoiceCard} variant="elevated">
            <View style={styles.spokenHeader}>
              <Text variant="bodySmall" weight="bold" color="#EA580C">
                🎙️ 1. Your Spoken Words (आपकी आवाज़):
              </Text>
              <Text variant="caption" color="#64748B">
                Tap to edit
              </Text>
            </View>
            <TextInput
              style={styles.spokenInput}
              multiline
              value={spokenTranscript}
              onChangeText={setSpokenTranscript}
              placeholder="Aapki aawaz yahan transcript hogi..."
              placeholderTextColor="#94A3B8"
            />

            {/* Quick Suggestion Chips */}
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() =>
                  setSpokenTranscript((prev) =>
                    prev ? prev + ' शुद्ध टेराकोटा नदी की मिट्टी से बना।' : 'शुद्ध टेराकोटा नदी की मिट्टी से बना 5 पीस का दीया सेट।'
                  )
                }
              >
                <Text style={styles.quickChipText}>+ Terracotta Clay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() =>
                  setSpokenTranscript((prev) =>
                    prev ? prev + ' शुद्ध सिल्क हथकरघा साड़ी।' : 'अस्सल पैठणी शुद्ध रेशम हथकरघा साड़ी।'
                  )
                }
              >
                <Text style={styles.quickChipText}>+ Pure Silk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() =>
                  setSpokenTranscript((prev) =>
                    prev ? prev + ' 2 दिन का श्रम लगा है।' : '2 दिन का कठिन हाथ का श्रम।'
                  )
                }
              >
                <Text style={styles.quickChipText}>+ 2 Days Labor</Text>
              </TouchableOpacity>
            </View>

            {/* STEP 2: Trigger AI Modification */}
            <TouchableOpacity
              style={[
                styles.modifyAiBtn,
                (!spokenTranscript.trim() || isModifyingWithAi) && styles.btnDisabled,
              ]}
              disabled={!spokenTranscript.trim() || isModifyingWithAi}
              onPress={handleModifyWithAi}
              activeOpacity={0.85}
            >
              {isModifyingWithAi ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text variant="bodySmall" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
                    AI Analyzing & Polishing Story...
                  </Text>
                </View>
              ) : (
                <Text variant="bodySmall" weight="bold" color="#FFFFFF">
                  ✨ 2. Modify & Enhance with AI (AI से सुधारें)
                </Text>
              )}
            </TouchableOpacity>
          </Card>
        )}

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
              Artisan Voice Assistant is listening...
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
              Transcribing voice & extracting craft attributes
            </Text>
          </Card>
        )}

        {/* Successful Transcript Card / Voice Summary */}
        {transcriptionResult && !isProcessing && (
          <Card style={styles.resultCard} variant="elevated">
            <View style={styles.resultHeader}>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>LIVE SPEECH TRANSCRIPTION</Text>
              </View>
              <Text variant="bodySmall" color={theme.colors.heritageTeal[700]} weight="bold">
                Natural Vernacular Speech
              </Text>
            </View>

            <Text
              variant="caption"
              weight="bold"
              color={theme.colors.brand.primary}
              style={{ marginTop: 6, marginBottom: 2 }}
            >
              Voice Summary:
            </Text>

            <Text
              variant="bodyLarge"
              weight="bold"
              color={theme.colors.charcoal[900]}
              style={styles.transcriptText}
            >
              "{transcriptionResult.transcript}"
            </Text>

            {aiModifiedResult?.explanation && (
              <Text variant="caption" color="#059669" style={{ marginTop: 4, fontStyle: 'italic' }}>
                ✓ {aiModifiedResult.explanation}
              </Text>
            )}

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
                    🧵 Material: {transcriptionResult.extractedEntities.material}
                  </Text>
                </View>
              )}
              {Boolean(transcriptionResult.extractedEntities.technique) && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta[600]}>
                    🖌️ Technique: {transcriptionResult.extractedEntities.technique}
                  </Text>
                </View>
              )}
              {Boolean(transcriptionResult.extractedEntities.motif) && (
                <View style={styles.entityChip}>
                  <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[800]}>
                    🪡 Motif: {transcriptionResult.extractedEntities.motif}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Bottom Sticky Bar */}
      {!isProcessing && (
        <View
          style={[
            styles.bottomBar,
            { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] },
          ]}
        >
          <Button
            label={
              transcriptionResult
                ? "Next: Voice Saathi Interview →"
                : "🎙️ Next: Start Voice Saathi Interview →"
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
    marginBottom: 16,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
  },
  placeholderThumb: {
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInfo: {
    flex: 1,
  },
  voiceTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  voiceTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  langSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  langChipActive: {
    backgroundColor: '#EA580C',
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  langChipTextActive: {
    color: '#FFFFFF',
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  micIcon: {
    fontSize: 40,
  },
  timerText: {
    marginTop: 16,
  },
  guidancePill: {
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  spokenVoiceCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  spokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spokenInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 10,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 60,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  quickChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quickChipText: {
    fontSize: 11,
    color: '#C2410C',
    fontWeight: '600',
  },
  modifyAiBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  processingCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    marginBottom: 16,
  },
  resultCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  transcriptText: {
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: 4,
  },
  clusterBadge: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  clusterBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  entitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  entityChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
});
