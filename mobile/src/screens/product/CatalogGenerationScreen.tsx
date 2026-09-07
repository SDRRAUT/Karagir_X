import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  label: string;
  detail: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Studio Photography Finish', detail: 'Enhancing shadows, lighting & background' },
  { id: 2, label: 'Craft Storytelling & Attributes', detail: 'Extracting GI pedigree, motif & materials' },
  { id: 3, label: 'Trilingual Catalog Translation', detail: 'Generating localized listings & SEO tags' },
  { id: 4, label: 'Fair Price Algorithm Calculation', detail: 'Computing raw costs, labor floor & benchmark' },
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
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={() => {
            if (navigation?.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation?.navigate?.('MainTabs', { screen: 'HomeTab' });
            }
          }}
          style={styles.topBackButton}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        >
          <Text style={styles.topBackIcon}>‹</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* Animated Loom Icon */}
        <View style={styles.animCircle}>
          <Text style={styles.animEmoji}>🧶</Text>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          Synthesizing AI Catalogue
        </Text>
        <Text variant="bodyLarge" weight="semiBold" color="#EA580C" style={{ textAlign: 'center', marginBottom: 6 }}>
          AI Smart Cataloguing in Progress...
        </Text>
        <Text variant="bodyMedium" color={theme.colors.charcoal[600]} style={styles.subtitle}>
          Generating complete product listing, craft storytelling, and Digital Craft Passport...
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
                    {step.label}
                  </Text>
                  <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
                    {step.detail}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Audio Readout */}
        <View style={styles.voiceCard}>
          <View style={styles.speakerBox}>
            <Text style={{ fontSize: 20 }}>🔊</Text>
          </View>
          <Text variant="bodyMedium" color={theme.colors.charcoal[800]} style={styles.voiceText}>
            "Generating your product listing and digital craft passport. Just a few moments..."
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
  topNavRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBackButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBackIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: -2,
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

