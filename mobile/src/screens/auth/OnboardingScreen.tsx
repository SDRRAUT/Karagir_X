import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';
import { voiceGuidance } from '@/utils/voiceGuidance';
import { UserRole } from '@/api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface SlideData {
  id: number;
  image: any;
  bgColor: string;
  isDark: boolean;
  titleLine1: string;
  titleLine2: string;
  description: string;
  voiceHi: string;
  buttonLabel: string;
  titleColor: string;
  descColor: string;
  indicatorActive: string;
  indicatorInactive: string;
  btnBg: string;
  btnTextColor: string;
  voiceBg: string;
  voiceBorder: string;
  voiceText: string;
}

const ONBOARDING_SLIDES: SlideData[] = [
  {
    id: 0,
    image: require('../../../assets/onboarding_camera.jpg'),
    bgColor: '#FCE7DF', // Warm Peach / Soft Terracotta
    isDark: false,
    titleLine1: '1 Photo = Instant',
    titleLine2: 'Online Store',
    description:
      'Zero typing or tech skills needed! Just snap a picture of your craft. Our AI cleans the clutter into 4K studio lighting and launches your shop in seconds.',
    voiceHi:
      'सिर्फ एक फोटो खींचें! AI आपकी दुकान खुद बना देगा, वो भी 10 सेकंड में।',
    buttonLabel: 'Continue',
    titleColor: '#1F1A1C',
    descColor: '#5C504C',
    indicatorActive: '#1F1A1C',
    indicatorInactive: '#E8C7BD',
    btnBg: '#FFFFFF',
    btnTextColor: '#1F1A1C',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#E5C4B9',
    voiceText: '#7A321E',
  },
  {
    id: 1,
    image: require('../../../assets/onboarding_voice.jpg'),
    bgColor: '#E6F6ED', // Fresh Soft Mint / Sage Light
    isDark: false,
    titleLine1: 'Speak Naturally,',
    titleLine2: 'Get Fair Price',
    description:
      'Never get cheated by middlemen! Speak in your own local language. Our AI calculates your true work hours, materials, and guarantees your highest profit.',
    voiceHi:
      'अपनी बोली में बोलें! AI आपकी मेहनत का सही और सबसे ज्यादा दाम तय करेगा।',
    buttonLabel: 'Continue',
    titleColor: '#0E2E1D',
    descColor: '#3B5746',
    indicatorActive: '#0E2E1D',
    indicatorInactive: '#BDDFCD',
    btnBg: '#FFFFFF',
    btnTextColor: '#0E2E1D',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#BDE2CE',
    voiceText: '#0D5432',
  },
  {
    id: 2,
    image: require('../../../assets/onboarding_escrow.jpg'),
    bgColor: '#FFF3DB', // Warm Golden Ivory / Sunshine Cream
    isDark: false,
    titleLine1: 'Doorstep Pickup,',
    titleLine2: '100% Safe Money',
    description:
      'India Post collects orders right from your workshop! Guaranteed payout sent safely to your bank account with zero risk, zero delay, and full protection.',
    voiceHi:
      'डाकघर घर से पार्सल उठाएगा, और 100% सुरक्षित पैसा सीधे आपके बैंक खाते में आएगा।',
    buttonLabel: 'Get Started',
    titleColor: '#2B1E0A',
    descColor: '#5E4B30',
    indicatorActive: '#2B1E0A',
    indicatorInactive: '#EED9B3',
    btnBg: '#FFFFFF',
    btnTextColor: '#2B1E0A',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#ECD2A4',
    voiceText: '#6D4408',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;

  // Responsive artwork sizing adapted to screen height & width
  const isCompact = height < 720;
  const isTall = height >= 840;
  const imageSize = Math.min(
    Math.max(width * 0.68, 210),
    isCompact ? 210 : isTall ? 290 : 250
  );

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === currentSlide) return;
    voiceGuidance.stopSpeaking();
    setCurrentSlide(nextIndex);
    fadeAnim.setValue(0.3);
    slideTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handleNext = () => {
    voiceGuidance.stopSpeaking();
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      changeSlide(currentSlide + 1);
    } else {
      navigation.replace('AuthPhone', { role: 'ARTISAN' as UserRole });
    }
  };

  const handleSkip = () => {
    voiceGuidance.stopSpeaking();
    navigation.replace('AuthPhone', { role: 'ARTISAN' as UserRole });
  };

  const slide = ONBOARDING_SLIDES[currentSlide];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: slide.bgColor }]}>
      {/* Top App Header Row */}
      <View style={styles.topHeader}>
        <View style={styles.brandBadge}>
          <Text variant="caption" weight="bold" color={slide.titleColor} style={styles.brandText}>
            ✨ KaragirX
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding tour"
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text
            variant="caption"
            weight="bold"
            color={slide.titleColor}
            style={styles.skipText}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Responsive Body */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainWrapper}>
          {/* Animated 3D Illustration Area */}
          <Animated.View
            style={[
              styles.artworkSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideTranslateY }],
              },
            ]}
          >
            <View
              style={[
                styles.imageShadowBox,
                {
                  width: imageSize,
                  height: imageSize,
                },
              ]}
            >
              <Image
                source={slide.image}
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          {/* Details & Features Section (Clean Center-Aligned) */}
          <Animated.View
            style={[
              styles.detailsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideTranslateY }],
              },
            ]}
          >
            {/* Capsule + Dots Progress Indicator */}
            <View style={styles.indicatorRow}>
              {ONBOARDING_SLIDES.map((item, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => changeSlide(idx)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to slide ${idx + 1}`}
                    style={styles.indicatorHit}
                  >
                    <View
                      style={[
                        isActive ? styles.capsuleIndicator : styles.dotIndicator,
                        {
                          backgroundColor: isActive
                            ? slide.indicatorActive
                            : slide.indicatorInactive,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bold Headline */}
            <Text
              variant="headlineLarge"
              weight="bold"
              color={slide.titleColor}
              style={[
                styles.headline,
                isCompact && styles.headlineCompact,
              ]}
            >
              {slide.titleLine1}
              {'\n'}
              {slide.titleLine2}
            </Text>

            {/* Hindi Voice Guidance Button */}
            <View style={styles.voiceWrapper}>
              <VoiceCueButton
                textHi={slide.voiceHi}
                label="Listen in Hindi"
                size="small"
                testID={`voice-cue-slide-${currentSlide}`}
              />
            </View>

            {/* Killer Feature Description Text */}
            <Text
              variant="bodyMedium"
              color={slide.descColor}
              style={[
                styles.descriptionText,
                isCompact && styles.descriptionCompact,
              ]}
            >
              {slide.description}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Action Section (Full-width Rounded Pill) */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            testID="onboarding-next-btn"
            onPress={handleNext}
            style={styles.actionBtn}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={slide.buttonLabel}
          >
            <Text
              variant="bodyLarge"
              weight="bold"
              color={slide.btnTextColor}
              style={styles.actionBtnText}
            >
              {slide.buttonLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 14 : 8,
    paddingBottom: 6,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  brandBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  brandText: {
    fontSize: 12.5,
    letterSpacing: 0.4,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  skipText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 16,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  artworkSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  imageShadowBox: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 14,
  },
  indicatorHit: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  capsuleIndicator: {
    width: 30,
    height: 6.5,
    borderRadius: 3.5,
  },
  dotIndicator: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },
  headline: {
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  headlineCompact: {
    fontSize: 23,
    lineHeight: 29,
    marginBottom: 6,
  },
  voiceWrapper: {
    marginBottom: 12,
    alignSelf: 'center',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.1,
    textAlign: 'center',
    paddingHorizontal: 8,
    maxWidth: 360,
  },
  descriptionCompact: {
    fontSize: 12.5,
    lineHeight: 19,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 440,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
