import React, { useEffect, useRef, useState } from 'react';
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
import { useAuthStore } from '@/store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Smooth cinematic entrance animations
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(15)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(10)).current;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Audio waveform pulse animation bars
  const waveAnim1 = useRef(new Animated.Value(1)).current;
  const waveAnim2 = useRef(new Animated.Value(1)).current;
  const waveAnim3 = useRef(new Animated.Value(1)).current;

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioFinished, setAudioFinished] = useState(false);
  const audioPlayerRef = useRef<any>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const { isAuthenticated, user, isLoading, activeRole } = useAuthStore();

  const doNavigate = () => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    if (audioPlayerRef.current) {
      try {
        if (typeof audioPlayerRef.current.pause === 'function') {
          audioPlayerRef.current.pause();
        } else if (typeof audioPlayerRef.current.stopAsync === 'function') {
          audioPlayerRef.current.stopAsync().catch(() => {});
        }
      } catch {}
    }
    const currentAuth = useAuthStore.getState();
    const effectiveRole = currentAuth.activeRole || currentAuth.user?.role || 'ARTISAN';
    if (currentAuth.isAuthenticated && currentAuth.user?.isProfileComplete) {
      navigation.replace('MainTabs', {
        screen: 'HomeTab',
        params: { role: effectiveRole },
      });
    } else {
      navigation.replace('Onboarding');
    }
  };

  // Instant / smooth resume if user session is already active (e.g. web browser refresh)
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.isProfileComplete) {
      const targetRole = activeRole || user?.role || 'ARTISAN';
      const quickTimer = setTimeout(() => {
        if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.stopAsync().catch(() => {});
        }
        navigation.replace('MainTabs', {
          screen: 'HomeTab',
          params: { role: targetRole },
        });
      }, 350);
      return () => clearTimeout(quickTimer);
    }
  }, [isLoading, isAuthenticated, user?.isProfileComplete, activeRole, navigation]);

  const startWaveAnimation = () => {
    const useNative = Platform.OS !== 'web';
    const makeWave = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.8,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useNative,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: useNative,
          }),
        ])
      );

    waveLoopRef.current = Animated.parallel([
      makeWave(waveAnim1, 0),
      makeWave(waveAnim2, 130),
      makeWave(waveAnim3, 260),
    ]);
    waveLoopRef.current.start();
  };

  const stopWaveAnimation = () => {
    waveLoopRef.current?.stop();
    waveAnim1.setValue(1);
    waveAnim2.setValue(1);
    waveAnim3.setValue(1);
  };

  useEffect(() => {
    const useNative = Platform.OS !== 'web';
    let isMounted = true;

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

    // 3. Gentle breathing glow animation for Start Button
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: useNative,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: useNative,
        }),
      ])
    );
    pulseLoop.start();

    // 4. Play splash.mp3 with universal fallback
    const playSplashAudio = async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
          // Web Native HTML Audio
          const audio = new window.Audio(require('../../../assets/audio/splash.mp3'));
          audioPlayerRef.current = audio;
          audio.volume = 1.0;

          audio.onplay = () => {
            if (!isMounted) return;
            setIsAudioPlaying(true);
            startWaveAnimation();
          };

          audio.onended = () => {
            if (!isMounted) return;
            setIsAudioPlaying(false);
            setAudioFinished(true);
            stopWaveAnimation();
            navigationTimerRef.current = setTimeout(() => {
              if (isMounted) doNavigate();
            }, 400);
          };

          try {
            await audio.play();
            setIsAudioPlaying(true);
            startWaveAnimation();

            Animated.timing(progressAnim, {
              toValue: 1,
              duration: 7000,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: false,
            }).start();
          } catch (_e) {
            setIsAudioPlaying(false);
            setAudioFinished(true);
            navigationTimerRef.current = setTimeout(() => {
              if (isMounted) doNavigate();
            }, 3500);
          }
        } else {
          // Native Device (Expo Go / Android / iOS)
          // Timed elegant cinematic splash entrance
          setIsAudioPlaying(true);
          startWaveAnimation();

          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
          }).start();

          navigationTimerRef.current = setTimeout(() => {
            if (isMounted) {
              setIsAudioPlaying(false);
              setAudioFinished(true);
              stopWaveAnimation();
              doNavigate();
            }
          }, 3200);
        }
      } catch (_err) {
        if (!isMounted) return;
        setAudioFinished(true);
        navigationTimerRef.current = setTimeout(() => {
          if (isMounted) doNavigate();
        }, 3000);
      }
    };

    const audioDelay = setTimeout(() => playSplashAudio(), 100);

    return () => {
      isMounted = false;
      clearTimeout(audioDelay);
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
      stopWaveAnimation();
      pulseLoop.stop();
      audioPlayerRef.current?.stopAsync().catch(() => {});
      audioPlayerRef.current?.unloadAsync().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btnScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        testID="splash-touchable"
        style={styles.touchContainer}
        activeOpacity={0.95}
        onPress={doNavigate}
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
                source={require('../../../assets/kalakar_setu_logo.png')}
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

            {/* Audio Playing Indicator (Only visible while audio is playing) */}
            {isAudioPlaying && (
              <Animated.View style={[styles.audioIndicator, { opacity: subtitleOpacity }]}>
                <View style={styles.audioPlayingRow}>
                  {/* Speaker icon */}
                  <View style={styles.speakerIconWrap}>
                    <Text style={styles.speakerEmoji}>🔊</Text>
                  </View>
                  {/* Animated wave bars */}
                  <View style={styles.waveContainer}>
                    {([waveAnim1, waveAnim2, waveAnim3] as Animated.Value[]).map((anim, i) => (
                      <Animated.View
                        key={i}
                        style={[styles.waveBar, { transform: [{ scaleY: anim }] }]}
                      />
                    ))}
                  </View>
                  <Text style={styles.audioPlayingText}>Suniye...</Text>
                </View>
              </Animated.View>
            )}

            {/* Creative Modern Transparent Start Action with Glowing Breathing Pulse */}
            <Animated.View
              style={[
                styles.startBtnContainer,
                {
                  opacity: subtitleOpacity,
                  transform: [{ scale: btnScale }],
                },
              ]}
            >
              <TouchableOpacity
                testID="splash-start-btn"
                style={styles.startBtn}
                onPress={doNavigate}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Get Started"
              >
                <View style={styles.startBtnIconWrap}>
                  <Text style={styles.startBtnIcon}>🎧</Text>
                </View>
                <Text style={styles.startBtnText}>Get Started</Text>
                <Text style={styles.startBtnArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>

          </View>

          {/* Bottom Progress Bar */}
          <View style={styles.bottomBarContainer}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[styles.progressBarFill, { width: progressWidth }]}
              />
            </View>
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
  audioIndicator: {
    marginTop: 18,
    alignItems: 'center',
    minHeight: 38,
  },
  audioPlayingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(234, 88, 12, 0.08)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.22)',
  },
  speakerIconWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerEmoji: {
    fontSize: 15,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 18,
  },
  waveBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#EA580C',
  },
  audioPlayingText: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '600',
    letterSpacing: 0.3,
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
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 2,
  },
  startBtnContainer: {
    marginTop: 22,
    alignItems: 'center',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(234, 88, 12, 0.45)',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  startBtnIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(234, 88, 12, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnIcon: {
    fontSize: 13,
  },
  startBtnText: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  startBtnArrow: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 2,
  },
});
