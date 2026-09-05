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
    highlight: 'India Post Pickup & Direct Escrow Safety',
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Top Skip Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} accessibilityRole="button" accessibilityLabel="Skip onboarding">
          <Text variant="bodyMedium" weight="bold" color={theme.colors.brand.primary}>
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
              backgroundColor: theme.colors.brand.light,
              borderColor: theme.colors.brand.primary,
              ...theme.shadows.level2,
            },
          ]}
        >
          <Text style={styles.emojiText}>{slide.emoji}</Text>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          {slide.title}
        </Text>

        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.description}>
          {slide.description}
        </Text>

        <View
          style={[
            styles.highlightBadge,
            {
              backgroundColor: theme.colors.ochre.light,
              borderColor: theme.colors.ochre.border,
            },
          ]}
        >
          <Text variant="bodySmall" weight="bold" color={theme.colors.ochre.text}>
            ✨ {slide.highlight}
          </Text>
        </View>
      </View>

      {/* Footer with Dots & Next Button */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentSlide ? theme.colors.brand.primary : theme.colors.sand[300],
                  width: index === currentSlide ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          label={currentSlide === SLIDES.length - 1 ? 'शुरू करें (Get Started) →' : 'आगे बढ़ें (Next) →'}
          variant="primary"
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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emojiText: {
    fontSize: 52,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  highlightBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  dotsRow: {
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
