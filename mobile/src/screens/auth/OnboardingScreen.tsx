import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';

import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  emoji: string;
  title: string;
  description: string;
  highlight: string;
  voiceHi: string;
}

const SLIDES: Slide[] = [
  {
    emoji: '📸',
    title: 'Snap a Photo, AI Builds Your Store',
    description: 'Simply take a clear photo of your craft. Our AI cleans the background and generates professional studio catalogs.',
    highlight: 'Clean Studio Photo & Multi-language Catalog',
    voiceHi: 'सिर्फ अपने उत्पाद की एक साधारण फोटो लें। हमारा AI बैकग्राउंड साफ करके प्रोफेशनल कैटलॉग तैयार करता है।',
  },
  {
    emoji: '🎙️',
    title: 'Speak Naturally, Get Fair Dynamic Pricing',
    description: 'Describe your craft in your native voice. Our AI calculates fair materials, labor hours, and profitable pricing.',
    highlight: 'Fair Dynamic Pricing & Cost Breakdown',
    voiceHi: 'अपनी मातृभाषा में बोलकर शिल्प के बारे में बताएं। AI आपकी मेहनत और समय का सही दाम तय करेगा।',
  },
  {
    emoji: '💰',
    title: 'Doorstep Pickup, Direct Escrow Payout',
    description: 'India Post picks up parcels from your workshop door. Receive direct payments safely in your bank within 48 hours.',
    highlight: 'India Post Pickup & Direct Escrow Safety',
    voiceHi: 'डाक विभाग आपके दरवाजे से पार्सल उठाएगा। डिलीवरी के बाद पैसा सीधे आपके खाते में सुरक्षित आ जाएगा।',
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
            Skip
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

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            {slide.title}
          </Text>
        </View>

        <View style={{ marginVertical: 6 }}>
          <VoiceCueButton
            textHi={slide.voiceHi}
            label="Listen in Hindi"
            size="medium"
            testID={`voice-cue-slide-${currentSlide}`}
          />
        </View>

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
          label={currentSlide === SLIDES.length - 1 ? 'Get Started →' : 'Next →'}
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
