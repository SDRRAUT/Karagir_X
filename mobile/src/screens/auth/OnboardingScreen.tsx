import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';
import { UserRole } from '@/api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface Slide {
  badge: string;
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  voiceHi: string;
  highlights: { icon: string; text: string }[];
  accentColor: string;
  lightBg: string;
  borderColor: string;
}

const SLIDES: Slide[] = [
  {
    badge: 'FEATURE 1 OF 3',
    emoji: '📸',
    title: 'Snap a Photo, AI Builds Your Store',
    tagline: 'Instant 4K studio catalog from any simple smartphone camera',
    description:
      'Simply capture your craft on your workshop table. Our AI automatically cleans the background into 4K studio lighting and writes rich descriptions in 6 Indian languages.',
    voiceHi:
      'सिर्फ अपने उत्पाद की एक साधारण फोटो लें। हमारा AI बैकग्राउंड साफ करके प्रोफेशनल 4K कैटलॉग तैयार करता है।',
    highlights: [
      { icon: '✨', text: 'Instant 4K Background Cleanup' },
      { icon: '🌐', text: '6 Regional Languages Generated' },
      { icon: '📱', text: 'Works on Any Budget Smartphone' },
    ],
    accentColor: '#EA580C',
    lightBg: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  {
    badge: 'FEATURE 2 OF 3',
    emoji: '🎙️',
    title: 'Speak Naturally, Fair Dynamic Pricing',
    tagline: 'Voice Saathi calculates labor hours, materials & true craft value',
    description:
      'No complicated typing required. Just describe materials, intricate effort, and hours in your native dialect. AI recommends profitable, transparent pricing that honors your craft.',
    voiceHi:
      'अपनी मातृभाषा में बोलकर शिल्प के बारे में बताएं। AI आपकी मेहनत, सामग्री और समय का सही दाम तय करेगा।',
    highlights: [
      { icon: '🗣️', text: 'Native Dialect Voice Assistant' },
      { icon: '⚖️', text: 'Fair Labor & Craft Hours Valuation' },
      { icon: '📊', text: 'Transparent Material Cost Breakdown' },
    ],
    accentColor: '#4338CA',
    lightBg: '#EEF2FF',
    borderColor: '#E0E7FF',
  },
  {
    badge: 'FEATURE 3 OF 3',
    emoji: '💰',
    title: 'Doorstep Pickup, Direct Escrow Payout',
    tagline: 'India Post collects from your workshop • 48-Hour direct payout',
    description:
      'India Post picks up packages directly from your workshop door. Enjoy zero middleman cuts, 100% escrow protection, and payments settled directly to your bank account within 48 hours.',
    voiceHi:
      'डाक विभाग आपके दरवाजे से पार्सल उठाएगा। डिलीवरी के बाद पैसा सीधे आपके बैंक खाते में सुरक्षित आ जाएगा।',
    highlights: [
      { icon: '📦', text: 'India Post Doorstep Parcel Pickup' },
      { icon: '🔒', text: '100% Direct Escrow Buyer Protection' },
      { icon: '⚡', text: '48-Hour Fast Bank / UPI Settlement' },
    ],
    accentColor: '#16A34A',
    lightBg: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const changeSlide = (nextIndex: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      setCurrentSlide(nextIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    });
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      changeSlide(currentSlide + 1);
    } else {
      navigation.replace('AuthPhone', { role: 'ARTISAN' as UserRole });
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigation.replace('AuthPhone', { role: 'ARTISAN' as UserRole });
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Top Bar: Brand Badge & Skip */}
          <View style={styles.topBar}>
            <View style={styles.brandPill}>
              <Text variant="caption" weight="bold" color="#EA580C" style={styles.brandPillText}>
                ✨ KARAGIRX TOUR
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding tour"
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <Text variant="bodySmall" weight="bold" color="#64748B">
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Slide Content */}
          <Animated.View style={[styles.slideContent, { opacity: fadeAnim }]}>
            {/* Step Counter Pill */}
            <View
              style={[
                styles.stepBadge,
                { backgroundColor: slide.lightBg, borderColor: slide.borderColor },
              ]}
            >
              <Text variant="caption" weight="bold" color={slide.accentColor} style={styles.stepBadgeText}>
                {slide.badge}
              </Text>
            </View>

            {/* Giant Visual Emoji Container */}
            <View
              style={[
                styles.emojiCircle,
                {
                  backgroundColor: slide.lightBg,
                  borderColor: slide.borderColor,
                },
              ]}
            >
              <Text style={styles.emojiText}>{slide.emoji}</Text>
            </View>

            {/* Title & Tagline */}
            <Text variant="headlineMedium" weight="bold" color="#0F172A" style={styles.title}>
              {slide.title}
            </Text>

            <Text variant="bodySmall" weight="bold" color={slide.accentColor} style={styles.tagline}>
              {slide.tagline}
            </Text>

            {/* Hindi Voice Audio Guidance Button */}
            <View style={styles.voiceWrapper}>
              <VoiceCueButton
                textHi={slide.voiceHi}
                label="Listen in Hindi"
                size="medium"
                testID={`voice-cue-slide-${currentSlide}`}
              />
            </View>

            {/* Description Text */}
            <Text variant="bodyMedium" color="#475569" style={styles.description}>
              {slide.description}
            </Text>

            {/* Feature Highlights Pills */}
            <View style={styles.highlightsContainer}>
              {slide.highlights.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.highlightPill,
                    {
                      backgroundColor: slide.lightBg,
                      borderColor: slide.borderColor,
                    },
                  ]}
                >
                  <Text variant="bodySmall" style={styles.highlightIcon}>
                    {item.icon}
                  </Text>
                  <Text
                    variant="bodySmall"
                    weight="medium"
                    color="#1E293B"
                    style={styles.highlightText}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Bottom Controls: Dots & Navigation Buttons */}
          <View style={styles.footerSection}>
            {/* Interactive Slide Dots */}
            <View style={styles.dotsRow}>
              {SLIDES.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => changeSlide(index)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to slide ${index + 1}`}
                  >
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isActive ? slide.accentColor : '#E2E8F0',
                          width: isActive ? 28 : 8,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsRow}>
              {currentSlide > 0 && (
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backBtn}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Previous slide"
                >
                  <Text variant="bodyMedium" weight="bold" color="#64748B">
                    ← Back
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleNext}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: isLast ? '#EA580C' : '#0F172A',
                    flex: currentSlide > 0 ? 1 : undefined,
                    width: currentSlide === 0 ? '100%' : undefined,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={isLast ? 'Get Started' : 'Next Feature'}
              >
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.primaryBtnText}>
                  {isLast ? 'Get Started →' : 'Next Feature →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ECE8E1',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  brandPillText: {
    letterSpacing: 1.1,
    fontSize: 9.5,
  },
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  slideContent: {
    alignItems: 'center',
  },
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  stepBadgeText: {
    letterSpacing: 1.2,
    fontSize: 9.5,
  },
  emojiCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  emojiText: {
    fontSize: 44,
  },
  title: {
    textAlign: 'center',
    fontSize: 21,
    lineHeight: 28,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 12.5,
    paddingHorizontal: 8,
  },
  voiceWrapper: {
    marginBottom: 14,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 13.5,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  highlightsContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  highlightIcon: {
    fontSize: 16,
  },
  highlightText: {
    fontSize: 12.5,
    flex: 1,
  },
  footerSection: {
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
