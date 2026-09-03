import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useProductDraftStore } from '@/store/useProductDraftStore';
import { catalogSynthesisService } from '@/api/catalogSynthesisService';
import { pricingService } from '@/api/pricingService';

type Props = NativeStackScreenProps<RootStackParamList, 'CatalogGeneration'>;

interface StepItem {
  id: number;
  labelHi: string;
  labelEn: string;
}

const STEPS: StepItem[] = [
  { id: 1, labelHi: 'फोटो स्टूडियो फिनिश तैयार...', labelEn: 'Studio photography finish...' },
  { id: 2, labelHi: 'कहानी और विवरण तैयार हो रहा है...', labelEn: 'Craft storytelling & attributes...' },
  { id: 3, labelHi: 'अंग्रेजी और हिंदी में अनुवाद...', labelEn: 'Trilingual catalog translation...' },
  { id: 4, labelHi: 'सही बाज़ार दाम गणना...', labelEn: 'Fair pricing algorithm calculation...' },
];

export const CatalogGenerationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const {
    extractedEntities,
    interviewAnswers,
    voiceTranscript,
    setCatalogSynthesis,
    setPricingResult,
  } = useProductDraftStore();

  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  useEffect(() => {
    let isMounted = true;

    async function runGeneration() {
      // Step 2: Catalog Synthesis
      try {
        const catalogResult = await catalogSynthesisService.synthesizeCatalog({
          entities: {
            ...extractedEntities,
            ...interviewAnswers,
          },
          artisanStoryTranscript: voiceTranscript || undefined,
        });

        if (isMounted) {
          setCatalogSynthesis(catalogResult);
          setCompletedSteps([1, 2, 3]);
        }

        // Step 4: Pricing Engine
        const laborHours = Number(interviewAnswers['labor_time']) || 24;
        const pricingResult = await pricingService.calculateFairPrice({
          laborHours,
          materialDeclaredCost: 350,
          artisanState: 'Bihar',
        });

        if (isMounted) {
          setPricingResult(pricingResult);
          setCompletedSteps([1, 2, 3, 4]);

          // Small delay then proceed to Pricing Recommendation
          setTimeout(() => {
            if (isMounted) {
              navigation.replace('PricingRecommendation');
            }
          }, 800);
        }
      } catch (_err) {
        if (isMounted) {
          navigation.replace('PricingRecommendation');
        }
      }
    }

    runGeneration();

    return () => {
      isMounted = false;
    };
  }, [extractedEntities, interviewAnswers, voiceTranscript, setCatalogSynthesis, setPricingResult, navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <View style={styles.container}>
        {/* Animated Charkha / Loom Icon */}
        <View
          style={[
            styles.animCircle,
            {
              backgroundColor: theme.colors.primary.emerald100,
              borderColor: theme.colors.primary.emerald700,
            },
          ]}
        >
          <Text style={styles.animEmoji}>🧶</Text>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          AI कैटलॉग तैयार हो रहा है
        </Text>
        <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.subtitle}>
          आपकी कला को दुनिया के सामने पेश करने के लिए AI विवरण लिख रहा है...
        </Text>

        {/* Step-by-Step Progress Card */}
        <Card style={styles.progressCard}>
          {STEPS.map((step) => {
            const isDone = completedSteps.includes(step.id);
            const isCurrent = !isDone && completedSteps.includes(step.id - 1);

            return (
              <View key={step.id} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepBadge,
                    {
                      backgroundColor: isDone
                        ? theme.colors.primary.emerald700
                        : isCurrent
                        ? theme.colors.terracotta.primary
                        : '#E0E0E0',
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{isDone ? '✓' : step.id}</Text>
                </View>
                <View style={styles.stepTexts}>
                  <Text
                    variant="bodyMedium"
                    weight={isDone || isCurrent ? 'bold' : 'regular'}
                    color={isDone ? theme.colors.primary.emerald700 : theme.colors.text.primary}
                  >
                    {step.labelHi}
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.text.secondary}>
                    {step.labelEn}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Vernacular Audio Readout */}
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
            "आपकी दुकान की लिस्टिंग बन रही है। बस कुछ सेकंड और..."
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  animEmoji: {
    fontSize: 48,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  progressCard: {
    width: '100%',
    padding: 16,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepTexts: {
    flex: 1,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
  },
  speakerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  voiceText: {
    flex: 1,
  },
});
