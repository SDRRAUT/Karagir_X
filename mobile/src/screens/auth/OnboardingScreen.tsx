import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
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
    bgColor: '#FFF3DB', // Warm Golden Ivory / Sunshine Cream (Light colour)
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;

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
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: slide.bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollWrapper}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Sleek Smartphone Mockup Card */}
        <View style={[styles.phoneFrame, { backgroundColor: slide.bgColor }]}>
          {/* Top Status & Header Bar */}
          <View style={styles.topBar}>
            <Text
              variant="caption"
              weight="bold"
              color={slide.titleColor}
              style={styles.timeText}
            >
              9:41
            </Text>

            <TouchableOpacity
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding tour"
              style={[
                styles.skipPill,
                {
                  backgroundColor: slide.isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.75)',
                  borderColor: slide.isDark
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.06)',
                },
              ]}
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

          {/* Animated Main Slide Section */}
          <Animated.View
            style={[
              styles.contentBody,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideTranslateY }],
              },
            ]}
          >
            {/* Top 3D Isometric Art Section */}
            <View style={styles.illustrationWrapper}>
              <View
                style={[
                  styles.imageShadowBox,
                  {
                    shadowColor: slide.isDark ? '#000000' : '#475569',
                  },
                ]}
              >
                <Image
                  source={slide.image}
                  style={styles.illustrationImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Bottom Content Area */}
            <View style={styles.detailsArea}>
              {/* Capsule + Dots Progress Indicator (Exact match to inspiration) */}
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

              {/* Bold 2-Line Headline */}
              <Text
                variant="headlineLarge"
                weight="bold"
                color={slide.titleColor}
                style={styles.headline}
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

              {/* Subtitle / Description Text */}
              <Text
                variant="bodyMedium"
                color={slide.descColor}
                style={styles.descriptionText}
              >
                {slide.description}
              </Text>
            </View>
          </Animated.View>

          {/* Bottom Action Button (Full-width Rounded Pill) */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              testID="onboarding-next-btn"
              onPress={handleNext}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: slide.btnBg,
                  shadowColor: slide.isDark ? '#000000' : '#64748B',
                },
              ]}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 390,
    minHeight: Platform.OS === 'web' ? 620 : undefined,
    borderRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 26,
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  skipPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  contentBody: {
    width: '100%',
    justifyContent: 'space-between',
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    width: '100%',
  },
  imageShadowBox: {
    width: 240,
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  detailsArea: {
    paddingHorizontal: 8,
    paddingTop: 10,
    alignItems: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  indicatorHit: {
    paddingVertical: 4,
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
    fontSize: 25,
    lineHeight: 31,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 8,
  },
  voiceWrapper: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: -0.1,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  bottomSection: {
    paddingTop: 14,
    paddingHorizontal: 2,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
