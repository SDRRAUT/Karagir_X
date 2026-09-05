import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const useNative = Platform.OS !== 'web';

    // 1. Entrance animation sequence: Logo pops out, followed by Title & Subtitle
    Animated.sequence([
      // A. Logo and ambient glow spring out
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: useNative,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 45,
          useNativeDriver: useNative,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.35,
          duration: 600,
          useNativeDriver: useNative,
        }),
        Animated.spring(glowScale, {
          toValue: 1.15,
          friction: 5,
          tension: 35,
          useNativeDriver: useNative,
        }),
      ]),

      // B. Title text ("KarigarX") comes out with smooth upward slide & fade
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: useNative,
        }),
      ]),

      // C. Motto & subtitle fade in
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
      ]),
    ]).start();

    // 2. Subtle 3-second progress loader animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2700,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();

    // 3. Smooth exit transition at 3 seconds
    const exitTimer = setTimeout(() => {
      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 300,
        useNativeDriver: useNative,
      }).start(() => {
        navigation.replace('AuthPhone', { role: 'ARTISAN' });
      });
    }, 2700);

    return () => clearTimeout(exitTimer);
  }, [
    navigation,
    logoScale,
    logoOpacity,
    glowScale,
    glowOpacity,
    textTranslateY,
    textOpacity,
    subtitleTranslateY,
    subtitleOpacity,
    progressAnim,
    screenFadeOut,
  ]);

  const handleSkip = () => {
    navigation.replace('AuthPhone', { role: 'ARTISAN' });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.touchContainer}
        activeOpacity={1}
        onPress={handleSkip}
      >
        <Animated.View style={[styles.mainWrapper, { opacity: screenFadeOut }]}>
          {/* Centered Logo & Brand Content */}
          <View style={styles.centerBlock}>
            {/* Ambient Warm Glow Halo behind Emblem */}
            <View style={styles.logoAnchor}>
              <Animated.View
                style={[
                  styles.glowHalo,
                  {
                    opacity: glowOpacity,
                    transform: [{ scale: glowScale }],
                  },
                ]}
              />

              {/* Popping Logo Badge */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <Image
                  source={require('../../../assets/karigarx_logo.png')}
                  style={styles.splashLogo}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {/* App Name Coming Out Animation */}
            <Animated.View
              style={[
                styles.titleBlock,
                {
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslateY }],
                },
              ]}
            >
              <Text variant="displaySmall" weight="bold" color="#0F172A" style={styles.brandTitle}>
                KarigarX
              </Text>
              <Text variant="bodySmall" weight="bold" color="#EA580C" style={styles.hindiSub}>
                कारीगरX • कलाकार सेतु
              </Text>
            </Animated.View>

            {/* Motto & Tagline Fade In */}
            <Animated.View
              style={[
                styles.mottoBlock,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }],
                },
              ]}
            >
              <View style={styles.craftPill}>
                <Text variant="caption" weight="bold" color="#EA580C" style={styles.mottoText}>
                  ✨ CRAFT • CONNECT • GROW ✨
                </Text>
              </View>

              <Text variant="bodySmall" color="#64748B" style={styles.subtext}>
                Empowering India's Heritage Master Artisans
              </Text>
            </Animated.View>
          </View>

          {/* Bottom Elegant Progress Line & Micro-indicator */}
          <View style={styles.bottomBarContainer}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressWidth },
                ]}
              />
            </View>
            <Text variant="caption" color="#94A3B8" style={styles.skipHint}>
              Tap to enter
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  touchContainer: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glowHalo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#EA580C',
    filter: 'blur(20px)' as any,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 10,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  splashLogo: {
    width: '100%',
    height: '100%',
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    letterSpacing: 1,
    fontSize: 32,
    marginBottom: 2,
    color: '#0F172A',
  },
  hindiSub: {
    letterSpacing: 0.8,
    fontSize: 13,
  },
  mottoBlock: {
    alignItems: 'center',
  },
  craftPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  mottoText: {
    letterSpacing: 1.4,
    fontSize: 10.5,
  },
  subtext: {
    textAlign: 'center',
    letterSpacing: 0.3,
    fontSize: 13,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  progressBarTrack: {
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 2,
  },
  skipHint: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
