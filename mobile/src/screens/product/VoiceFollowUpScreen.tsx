import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useProductDraftStore } from '@/store/useProductDraftStore';
import { FOLLOW_UP_QUESTIONS, FollowUpQuestion, voiceService } from '@/api/voiceService';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceFollowUp'>;

export const VoiceFollowUpScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { recordInterviewAnswer } = useProductDraftStore();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      navigation.replace('CatalogGeneration');
    } else {
      setSelectedOption(null);
      setQuestionIndex((prev) => prev + 1);
    }
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
          AI सवाल-जवाब ({questionIndex + 1}/{FOLLOW_UP_QUESTIONS.length})
        </Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
            छोड़ें (Skip) →
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Kalakar Sahayak AI Avatar Card */}
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: theme.colors.primary.emerald100,
                borderColor: theme.colors.primary.emerald700,
              },
            ]}
          >
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
            कलाकार सहायक (Kalakar Sahayak)
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            सही बाज़ार भाव तय करने के लिए बस यह छोटा सवाल बताएं
          </Text>
        </View>

        {/* Current Question Speech Bubble Card */}
        <Card style={styles.questionCard}>
          <View style={styles.questionBubble}>
            <Text style={styles.speakerIcon}>🔊</Text>
            <View style={{ flex: 1 }}>
              <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
                {currentQuestion.textHi}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 4 }}>
                {currentQuestion.textEn}
              </Text>
            </View>
          </View>
        </Card>

        {/* Voice Answer Button */}
        <View style={styles.voiceAnswerContainer}>
          <TouchableOpacity
            testID="speak-answer-btn"
            onPress={() => handleSelectOption(currentQuestion.quickOptions[0].value)}
            style={[
              styles.speakBtn,
              {
                backgroundColor: theme.colors.primary.emerald700,
                ...theme.shadows.level3,
              },
            ]}
          >
            <Text style={styles.speakMicIcon}>🎙️</Text>
            <Text variant="bodyLarge" weight="bold" color="#FFFFFF">
              बोलकर जवाब दें
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickOptionsSection}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.optionsLabel}>
            या इनमें से एक चुनें (Quick Tap):
          </Text>
          {currentQuestion.quickOptions.map((opt, idx) => {
            const isSelected = selectedOption === opt.value;
            return (
              <TouchableOpacity
                key={idx}
                disabled={isSubmitting}
                onPress={() => handleSelectOption(opt.value)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary.emerald100
                      : theme.colors.surface.card,
                    borderColor: isSelected
                      ? theme.colors.primary.emerald700
                      : theme.colors.surface.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                <Text
                  variant="bodyLarge"
                  weight={isSelected ? 'bold' : 'medium'}
                  color={isSelected ? theme.colors.primary.emerald700 : theme.colors.text.primary}
                >
                  {opt.labelHi}
                </Text>
                <Text variant="bodySmall" color={theme.colors.text.secondary}>
                  {opt.labelEn}
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
                    ? theme.colors.primary.emerald700
                    : idx < questionIndex
                    ? theme.colors.primary.emerald500
                    : '#D9D9D9',
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
  skipBtn: {
    padding: 4,
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
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  questionCard: {
    marginVertical: 16,
    padding: 16,
  },
  questionBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  speakerIcon: {
    fontSize: 28,
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
  },
  speakMicIcon: {
    fontSize: 24,
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
