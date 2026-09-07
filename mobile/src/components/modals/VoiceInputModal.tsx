import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import {
  speechRecognitionService,
  SpeechLanguage,
} from '@/services/speechRecognitionService';
import {
  aiVoiceModifierService,
  AiVoiceModificationResult,
} from '@/services/aiVoiceModifierService';

export interface VoiceInputModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyText: (text: string, entities?: any) => void;
  title?: string;
  context?: 'product_story' | 'search' | 'saathi' | 'general';
  initialText?: string;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  visible,
  onClose,
  onApplyText,
  title = 'Voice Input & AI Assistant',
  context = 'general',
  initialText = '',
}) => {
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<SpeechLanguage>('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState(initialText);
  const [isModifying, setIsModifying] = useState(false);
  const [aiResult, setAiResult] = useState<AiVoiceModificationResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setSpokenText(initialText);
      setAiResult(null);
      setIsListening(false);
      setStatusMessage('Mic dabayein aur bolna shuru karein (Tap Mic to speak)');
    } else {
      stopListening();
    }
  }, [visible, initialText]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isListening) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      animation?.stop();
    };
  }, [isListening, pulseAnim]);

  const startListening = () => {
    setAiResult(null);
    setStatusMessage('🔴 Sun rahe hain... (Listening... bolte rahiye)');

    const started = speechRecognitionService.startListening(
      {
        onStart: () => {
          setIsListening(true);
        },
        onResult: (transcript) => {
          setSpokenText(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          setStatusMessage(`Mic notice: ${err}. Aap yahan likh ya edit bhi kar sakte hain.`);
        },
        onEnd: () => {
          setIsListening(false);
          setStatusMessage('Aawaz capture ho gayi hai. Ab aap ise AI se modify kar sakte hain.');
        },
      },
      selectedLanguage
    );

    if (!started) {
      // If Web Speech API not supported or permissions unavailable, provide clear fallback
      setIsListening(false);
      setStatusMessage('Speech recognition is starting or not supported. You can type or use quick chips below.');
    }
  };

  const stopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleModifyWithAi = async () => {
    if (!spokenText.trim()) {
      setStatusMessage('Pehle kuch boliye ya likhiye, fir AI modify karega.');
      return;
    }

    setIsModifying(true);
    setStatusMessage('✨ AI aapki aawaz ko polish aur structure kar raha hai...');

    try {
      const result = await aiVoiceModifierService.modifyWithAi(spokenText, context);
      setAiResult(result);
      setIsModifying(false);
      setStatusMessage('✓ AI modification complete! Review karke apply karein.');
    } catch (err: any) {
      setIsModifying(false);
      setStatusMessage('AI modification unavailable right now.');
    }
  };

  const handleApply = (useAi: boolean) => {
    const textToApply = useAi && aiResult?.modifiedText ? aiResult.modifiedText : spokenText;
    stopListening();
    onApplyText(textToApply, aiResult?.extractedAttributes);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text variant="headlineSmall" weight="bold" color="#0F172A">
                🎙️ {title}
              </Text>
              <Text variant="caption" color="#64748B">
                Live Speech to Text • Trilingual AI Enhancement
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
              <Text style={{ fontSize: 18, color: '#64748B', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Language Selector */}
            <View style={styles.langRow}>
              <Text variant="bodySmall" weight="semiBold" color="#475569">
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

            {/* Central Mic Stage */}
            <View style={styles.micStage}>
              <Animated.View
                style={[
                  styles.pulseRing,
                  {
                    transform: [{ scale: pulseAnim }],
                    borderColor: isListening ? '#EA580C' : '#CBD5E1',
                  },
                ]}
              />
              <TouchableOpacity
                onPress={toggleListening}
                style={[styles.bigMicBtn, isListening && styles.bigMicBtnListening]}
                activeOpacity={0.8}
                accessibilityLabel={isListening ? 'Stop Listening' : 'Start Listening'}
              >
                <Text style={styles.micEmoji}>{isListening ? '⏹️' : '🎙️'}</Text>
              </TouchableOpacity>
              <Text
                variant="bodySmall"
                weight="bold"
                color={isListening ? '#EA580C' : '#334155'}
                style={{ marginTop: 10, textAlign: 'center' }}
              >
                {statusMessage}
              </Text>
            </View>

            {/* Step 1: Spoken Text Box (Display to User) */}
            <View style={styles.textBoxContainer}>
              <View style={styles.textLabelRow}>
                <Text variant="bodySmall" weight="bold" color="#0F172A">
                  🎙️ 1. Spoken Voice Input (आपकी आवाज़):
                </Text>
                {spokenText.length > 0 && (
                  <TouchableOpacity onPress={() => setSpokenText('')}>
                    <Text variant="caption" color="#EF4444" weight="bold">
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.textInput}
                multiline
                value={spokenText}
                onChangeText={setSpokenText}
                placeholder="Mic dabakar boliye, ya yahan likhiye..."
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Quick Suggestion Chips */}
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() =>
                  setSpokenText((prev) =>
                    prev
                      ? prev + ' शुद्ध टेराकोटा नदी की मिट्टी से बना है।'
                      : 'हाथ से बना पारंपरिक कोल्हापुरी टेराकोटा दीया सेट, 5 पीस।'
                  )
                }
              >
                <Text style={styles.suggestionChipText}>+ Terracotta Clay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() =>
                  setSpokenText((prev) =>
                    prev ? prev + ' शुद्ध सिल्क हथकरघा साड़ी।' : 'अस्सल पैठणी शुद्ध सिल्क हथकरघा साड़ी।'
                  )
                }
              >
                <Text style={styles.suggestionChipText}>+ Pure Silk Handloom</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() =>
                  setSpokenText((prev) =>
                    prev ? prev + ' 2 दिन का श्रम लगा है।' : '2 दिन का कठिन हाथ का श्रम।'
                  )
                }
              >
                <Text style={styles.suggestionChipText}>+ 2 Days Labor</Text>
              </TouchableOpacity>
            </View>

            {/* Step 2: AI Modification Trigger */}
            <TouchableOpacity
              style={[
                styles.modifyAiButton,
                (!spokenText.trim() || isModifying) && styles.buttonDisabled,
              ]}
              disabled={!spokenText.trim() || isModifying}
              onPress={handleModifyWithAi}
              activeOpacity={0.85}
            >
              {isModifying ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text variant="bodyMedium" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
                    AI Analyzing & Polishing...
                  </Text>
                </View>
              ) : (
                <Text variant="bodyMedium" weight="bold" color="#FFFFFF">
                  ✨ 2. Modify & Polish with AI (AI से सुधारें)
                </Text>
              )}
            </TouchableOpacity>

            {/* Step 3: AI Modified Output Display */}
            {aiResult && (
              <View style={styles.aiResultCard}>
                <View style={styles.aiResultHeader}>
                  <Text variant="bodySmall" weight="bold" color="#166534">
                    ✨ AI Enhanced Result:
                  </Text>
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>✓ Indic NLP Verified</Text>
                  </View>
                </View>

                <Text variant="bodyMedium" color="#1E293B" style={styles.aiResultText}>
                  {aiResult.modifiedText}
                </Text>

                {aiResult.explanation ? (
                  <Text variant="caption" color="#475569" style={{ marginTop: 6, fontStyle: 'italic' }}>
                    💡 {aiResult.explanation}
                  </Text>
                ) : null}

                {/* Attributes preview if present */}
                {Object.keys(aiResult.extractedAttributes).length > 0 && (
                  <View style={styles.attributesRow}>
                    {aiResult.extractedAttributes.material && (
                      <View style={styles.attributePill}>
                        <Text style={styles.attributePillText}>
                          🧵 {aiResult.extractedAttributes.material}
                        </Text>
                      </View>
                    )}
                    {aiResult.extractedAttributes.technique && (
                      <View style={styles.attributePill}>
                        <Text style={styles.attributePillText}>
                          🖌️ {aiResult.extractedAttributes.technique}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons Footer */}
          <View style={styles.footerRow}>
            {aiResult ? (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnOutline]}
                  onPress={() => handleApply(false)}
                >
                  <Text variant="bodySmall" weight="bold" color="#334155">
                    Keep Spoken As-Is
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                  onPress={() => handleApply(true)}
                >
                  <Text variant="bodySmall" weight="bold" color="#FFFFFF">
                    ✓ Apply AI Version
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.actionBtnPrimary,
                  !spokenText.trim() && styles.buttonDisabled,
                ]}
                disabled={!spokenText.trim()}
                onPress={() => handleApply(false)}
              >
                <Text variant="bodyMedium" weight="bold" color="#FFFFFF">
                  ✓ Insert Spoken Text
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  closeBtn: {
    padding: 6,
  },
  modalContent: {
    marginTop: 12,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
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
  micStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
  },
  bigMicBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  bigMicBtnListening: {
    backgroundColor: '#EA580C',
  },
  micEmoji: {
    fontSize: 32,
  },
  textBoxContainer: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  textLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textInput: {
    minHeight: 70,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  suggestionChip: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C2410C',
  },
  modifyAiButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  aiResultCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  aiResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#15803D',
  },
  aiResultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  attributePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attributePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutline: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  actionBtnPrimary: {
    backgroundColor: '#EA580C',
  },
});
