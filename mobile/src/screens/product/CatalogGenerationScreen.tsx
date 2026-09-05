import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

        const laborHours = Number(interviewAnswers['labor_time']) || 24;
        const pricingResult = await pricingService.calculateFairPrice({
          laborHours,
          materialDeclaredCost: 350,
          artisanState: 'Bihar',
        });

        if (isMounted) {
          setPricingResult(pricingResult);
          setCompletedSteps([1, 2, 3, 4]);

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <View style={styles.container}>
        {/* Animated Charkha / Loom Icon */}
        <View style={styles.animCircle}>
          <Text style={styles.animEmoji}>🧶</Text>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          AI कैटलॉग तैयार हो रहा है
        </Text>
        <Text variant="bodyMedium" color={theme.colors.charcoal[600]} style={styles.subtitle}>
          आपकी कला को दुनिया के सामने पेश करने के लिए AI विवरण और डिजिटल पासपोर्ट तैयार कर रहा है...
        </Text>

        {/* Step-by-Step Progress Card */}
        <Card style={styles.progressCard} variant="elevated">
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
                        ? '#6C63FF'
                        : isCurrent
                        ? '#6C63FF'
                        : '#E0DCFF',
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, !isDone && !isCurrent && { color: '#8A827B' }]}>
                    {isDone ? '✓' : step.id}
                  </Text>
                </View>
                <View style={styles.stepTexts}>
                  <Text
                    variant="bodyMedium"
                    weight={isDone || isCurrent ? 'bold' : 'medium'}
                    color={isDone ? '#6C63FF' : isCurrent ? '#6C63FF' : theme.colors.charcoal[800]}
                  >
                    {step.labelHi}
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
                    {step.labelEn}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Vernacular Audio Readout */}
        <View style={styles.voiceCard}>
          <View style={styles.speakerBox}>
            <Text style={{ fontSize: 20 }}>🔊</Text>
          </View>
          <Text variant="bodyMedium" color={theme.colors.charcoal[800]} style={styles.voiceText}>
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
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#6C63FF',
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  animEmoji: {
    fontSize: 44,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: 300,
  },
  progressCard: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
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
    fontSize: 13,
  },
  stepTexts: {
    flex: 1,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFBF42',
    width: '100%',
  },
  speakerBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  voiceText: {
    flex: 1,
    lineHeight: 20,
  },
});

