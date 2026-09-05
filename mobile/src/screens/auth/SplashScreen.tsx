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
  // Smooth cinematic entrance animations
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(15)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(10)).current;

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNative = Platform.OS !== 'web';

    // 1. Elegant cinematic reveal: Artwork scales and eases in smoothly
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNative,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: useNative,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNative,
      }),
    ]).start();

    // 2. Subtitle reveals after 400ms
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNative,
        }),
      ]),
    ]).start();

    // 3. Smooth 3-second progress indicator
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();

    // 4. Clean transition into Onboarding at 3.0s (React Navigation handles cross-fade)
    const exitTimer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(exitTimer);
  }, [
    navigation,
    logoScale,
    logoOpacity,
    logoTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    progressAnim,
  ]);

  const handleSkip = () => {
    navigation.replace('Onboarding');
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
        <View style={styles.mainWrapper}>
          {/* Centered Luxury Artwork Container */}
          <View style={styles.centerBlock}>
            <Animated.View
              style={[
                styles.artworkWrapper,
                {
                  opacity: logoOpacity,
                  transform: [
                    { scale: logoScale },
                    { translateY: logoTranslateY },
                  ],
                },
              ]}
            >
              <Image
                source={require('../../../assets/karigarx_logo.png')}
                style={styles.heroArtwork}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Clean Minimalist Subtitle */}
            <Animated.View
              style={[
                styles.subtitleContainer,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleTranslateY }],
                },
              ]}
            >
              <Text variant="bodySmall" color="#64748B" style={styles.brandSubtext}>
                Direct from India's Master Artisans
              </Text>
            </Animated.View>
          </View>

          {/* Bottom Minimalist Progress Bar */}
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
              Tap to continue
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FAF8F5',
  },
  touchContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 420,
  },
  artworkWrapper: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1024 / 682,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroArtwork: {
    width: '100%',
    height: '100%',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  brandSubtext: {
    textAlign: 'center',
    letterSpacing: 0.6,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 44,
    alignItems: 'center',
    width: '100%',
  },
  progressBarTrack: {
    width: 80,
    height: 2.5,
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
    letterSpacing: 0.4,
    color: '#94A3B8',
  },
});
