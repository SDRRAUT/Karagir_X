import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useProductDraftStore } from '@/store/useProductDraftStore';
import { FOLLOW_UP_QUESTIONS, FollowUpQuestion, voiceService } from '@/api/voiceService';

import { speechRecognitionService } from '@/services/speechRecognitionService';
import { realisticVoiceService } from '@/services/realisticVoiceService';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceFollowUp'>;

export const VoiceFollowUpScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { recordInterviewAnswer } = useProductDraftStore();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceAnswerText, setVoiceAnswerText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentQuestion: FollowUpQuestion =
    FOLLOW_UP_QUESTIONS[questionIndex] || FOLLOW_UP_QUESTIONS[0];

  const isLastQuestion = questionIndex === FOLLOW_UP_QUESTIONS.length - 1;

  const handleSelectOption = async (value: string | number) => {
    setSelectedOption(value);
    setIsSubmitting(true);

    recordInterviewAnswer(currentQuestion.questionId, value);
    await voiceService.submitFollowUpAnswer(currentQuestion.questionId, value);

    setIsSubmitting(false);

    if (isLastQuestion) {
      navigation.replace('CatalogGeneration');
    } else {
      setSelectedOption(null);
      setVoiceAnswerText('');
      setErrorMessage(null);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      navigation.replace('CatalogGeneration');
    } else {
      setSelectedOption(null);
      setVoiceAnswerText('');
      setErrorMessage(null);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const speakQuestion = (text: string) => {
    try {
      realisticVoiceService.speak(text, { lang: 'en-IN' });
    } catch (_err) {
      // Audio readback graceful fallback
    }
  };

  const handleVoiceAnswerToggle = () => {
    if (isListening) {
      speechRecognitionService.stopListening();
      setIsListening(false);
      return;
    }

    setErrorMessage(null);
    setVoiceAnswerText('');

    const started = speechRecognitionService.startListening(
      {
        onStart: () => {
          setIsListening(true);
          setErrorMessage(null);
        },
        onResult: (transcript, isFinal) => {
          setVoiceAnswerText(transcript);
          if (isFinal && transcript.trim()) {
            setIsListening(false);
            speechRecognitionService.stopListening();
            const lower = transcript.toLowerCase();
            const matchedOpt = currentQuestion.quickOptions.find(
              (opt) =>
                lower.includes(String(opt.value).toLowerCase()) ||
                lower.includes(opt.labelEn.toLowerCase()) ||
                lower.includes(opt.labelHi.toLowerCase())
            );
            handleSelectOption(matchedOpt ? matchedOpt.value : transcript.trim());
          }
        },
        onError: (err) => {
          setIsListening(false);
          setErrorMessage(err || 'Could not recognize speech.');
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'en-IN'
    );

    if (!started) {
      setIsListening(false);
      setErrorMessage('Microphone access denied or speech recognition unavailable.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title={`Voice Saathi • AI Interview (${questionIndex + 1}/${FOLLOW_UP_QUESTIONS.length})`}
        subtitle="Conversational AI Assistant"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
        rightElement={
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta[600]}>
              Skip →
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voice Saathi AI Avatar Card */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🗣️</Text>
          </View>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
            Voice Saathi • AI Craft Interviewer
          </Text>
          <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2, textAlign: 'center' }}>
            No tedious forms. Talk naturally or tap below to answer.
          </Text>
        </View>

        {/* Current Question Speech Bubble Card */}
        <Card style={styles.questionCard} variant="elevated">
          <View style={styles.questionBubble}>
            <TouchableOpacity
              style={styles.speakerBox}
              onPress={() => speakQuestion(currentQuestion.textEn)}
              accessibilityLabel="Listen to question"
            >
              <Text style={{ fontSize: 22 }}>🔊</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
                {currentQuestion.textEn}
              </Text>
            </View>
          </View>
        </Card>

        {/* Voice Answer Button */}
        <View style={styles.voiceAnswerContainer}>
          <TouchableOpacity
            testID="speak-answer-btn"
            onPress={handleVoiceAnswerToggle}
            style={[
              styles.speakBtn,
              isListening && { backgroundColor: '#EA580C' },
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.speakMicIcon}>{isListening ? '⏹️' : '🎙️'}</Text>
            <Text variant="bodyLarge" weight="bold" color="#FFFFFF">
              {isListening ? 'Listening... Speak Answer' : 'Tap to Speak Answer'}
            </Text>
          </TouchableOpacity>
          {voiceAnswerText ? (
            <Text variant="bodySmall" color="#EA580C" style={{ marginTop: 6, textAlign: 'center' }}>
              🗣️ "{voiceAnswerText}"
            </Text>
          ) : null}
          {errorMessage ? (
            <Text variant="bodySmall" color="#DC2626" style={{ marginTop: 6, textAlign: 'center' }}>
              ⚠️ {errorMessage}
            </Text>
          ) : null}
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickOptionsSection}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[600]} style={styles.optionsLabel}>
            Or select a quick answer option:
          </Text>
          {currentQuestion.quickOptions.map((opt, idx) => {
            const isSelected = selectedOption === opt.value;
            return (
              <TouchableOpacity
                key={idx}
                disabled={isSubmitting}
                activeOpacity={0.8}
                onPress={() => handleSelectOption(opt.value)}
                style={[
                  styles.optionChip,
                  isSelected ? styles.optionChipSelected : styles.optionChipNormal,
                ]}
              >
                <Text
                  variant="bodyLarge"
                  weight={isSelected ? 'bold' : 'semiBold'}
                  color={isSelected ? '#EA580C' : theme.colors.charcoal[900]}
                >
                  {opt.labelEn}
                </Text>
                <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2 }}>
                  {opt.labelHi}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Progress Dots Bar */}
      <View style={styles.dotsBar}>
        {FOLLOW_UP_QUESTIONS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              {
                backgroundColor:
                  idx === questionIndex
                    ? '#EA580C'
                    : idx < questionIndex
                    ? '#FDBA74'
                    : '#E2E8F0',
                width: idx === questionIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  skipBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0EEFF',
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  questionCard: {
    marginVertical: 14,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
  },
  questionBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  speakerBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  voiceAnswerContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  speakMicIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  quickOptionsSection: {
    marginTop: 10,
  },
  optionsLabel: {
    marginBottom: 10,
  },
  optionChip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  optionChipNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0DCFF',
  },
  optionChipSelected: {
    backgroundColor: '#FFF8F5',
    borderColor: '#6C63FF',
  },
  dotsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

