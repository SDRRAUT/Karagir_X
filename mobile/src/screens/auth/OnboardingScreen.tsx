import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  emoji: string;
  title: string;
  description: string;
  highlight: string;
}

const SLIDES: Slide[] = [
  {
    emoji: '📸',
    title: 'फोटो खींचें, AI बनाएगा दुकान',
    description: 'सिर्फ एक साधारण फोटो लें। हमारा AI बैकग्राउंड साफ करके प्रोफेशनल ई-कॉमर्स कैटलॉग तैयार करता है।',
    highlight: 'Clean Studio Photo & Trilingual Catalog',
  },
  {
    emoji: '🎙️',
    title: 'अपनी बोली में बोलें, सही दाम पाएं',
    description: 'अपनी मातृभाषा में प्रोडक्ट के बारे में बताएं। AI आपकी मेहनत और समय का उचित दाम तय करेगा।',
    highlight: 'Fair Dynamic Pricing & Cost Breakdown',
  },
  {
    emoji: '💰',
    title: 'सीधा बैंक में पैसा, सुरक्षित डिलीवरी',
    description: 'डाक विभाग आपके दरवाजे से पार्सल उठाएगा। डिलीवरी के बाद 48 घंटे में पैसा सीधे आपके खाते में।',
    highlight: 'India Post Pickup & RBI Escrow Safety',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigation.navigate('RoleSelection');
    }
  };

  const handleSkip = () => {
    navigation.navigate('RoleSelection');
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Top Skip Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} accessibilityRole="button" accessibilityLabel="Skip onboarding">
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.secondary}>
            छोड़ें (Skip)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slide Content */}
      <View style={styles.centerContent}>
        <View
          style={[
            styles.emojiCircle,
            {
              backgroundColor: theme.colors.primary.emerald100,
              borderColor: theme.colors.primary.emerald700,
            },
          ]}
        >
          <Text style={styles.emojiText}>{slide.emoji}</Text>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          {slide.title}
        </Text>

        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.description}>
          {slide.description}
        </Text>

        <View
          style={[
            styles.highlightBadge,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.surface.border,
            },
          ]}
        >
          <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
            ✓ {slide.highlight}
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={`dot-${idx}`}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    idx === currentSlide
                      ? theme.colors.primary.emerald700
                      : theme.colors.surface.border,
                  width: idx === currentSlide ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          label={currentSlide === SLIDES.length - 1 ? 'शुरू करें (Get Started) →' : 'आगे बढ़ें (Next) →'}
          variant="terracotta"
          size="decision"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emojiText: {
    fontSize: 56,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  highlightBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  bottomControls: {
    padding: 20,
    paddingBottom: 28,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

