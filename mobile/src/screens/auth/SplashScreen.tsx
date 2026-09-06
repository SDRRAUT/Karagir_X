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
import { Audio } from 'expo-av';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { UserProfile, UserRole, AuthTokens } from '@/api/types';

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
  const soundRef = useRef<Audio.Sound | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const { isAuthenticated, user, activeRole, isLoading, setSession } = useAuthStore();
  const { setLocale } = useAppStore();
  const hasCompletedProfile = !isLoading && (isAuthenticated || !!user?.isProfileComplete);

  const doNavigate = () => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    const role = activeRole || user?.role || 'ARTISAN';
    navigation.replace('MainTabs', { screen: 'HomeTab', params: { role } });
  };

  useEffect(() => {
    // Direct redirect on screens
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    if (soundRef.current) {
      soundRef.current.stopAsync().catch(() => {});
    }
    const role = activeRole || user?.role || 'ARTISAN';
    navigation.replace('MainTabs', { screen: 'HomeTab', params: { role } });
  }, [activeRole, user?.role, navigation]);

  const handleDevJump = async (role: UserRole) => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {}
    }

    const demoProfiles: Partial<Record<UserRole, UserProfile>> = {
      ARTISAN: {
        id: 'demo_artisan_user',
        phoneNumber: '9876543210',
        fullName: 'Ramesh Kumbhar',
        role: 'ARTISAN',
        preferredLanguage: 'hi_IN',
        craftCategoryCode: 'POTTERY_TERRACOTTA',
        countryId: 1,
        stateId: 26,
        districtId: 101,
        subDistrictId: 1001,
        villageId: 10001,
        state: 'Maharashtra',
        district: 'Kolhapur',
        subDistrict: 'Karveer',
        villageName: 'Uchgaon Pottery Hub',
        isProfileComplete: true,
      },
      BUYER: {
        id: 'demo_buyer_user',
        phoneNumber: '9811223344',
        fullName: 'Priya Sharma',
        role: 'BUYER',
        preferredLanguage: 'en_IN',
        craftCategoryCode: 'POTTERY',
        countryId: 1,
        stateId: 7,
        districtId: 951,
        state: 'Delhi',
        district: 'Delhi NCR / New Delhi',
        subDistrict: 'Connaught Place',
        villageName: 'Central Market',
        isProfileComplete: true,
      },
      ADMIN: {
        id: 'demo_admin_user',
        phoneNumber: '9800011223',
        fullName: 'Rajesh Sharma (Admin)',
        role: 'ADMIN',
        preferredLanguage: 'en_IN',
        countryId: 1,
        stateId: 7,
        districtId: 1,
        state: 'Delhi',
        district: 'New Delhi',
        isProfileComplete: true,
      },
    };

    const user = demoProfiles[role];
    if (!user) return;
    const tokens: AuthTokens = {
      accessToken: `demo_token_${role.toLowerCase()}`,
      refreshToken: `demo_refresh_${role.toLowerCase()}`,
      expiresInSeconds: 86400,
    };

    useAuthStore.getState().setActiveRole(role);
    await setSession(tokens, user);
    await setLocale((user.preferredLanguage as SupportedLocale) || 'hi_IN');
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const roleLabel =
        role === 'ARTISAN' ? 'Artisans' :
        role === 'BUYER' ? 'Buyer' :
        role === 'ADMIN' ? 'Command Center' : '';
      document.title = `Kalakar Setu ~ ${roleLabel}`;
    }
    navigation.replace('MainTabs', { screen: 'HomeTab', params: { role } });
  };

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

    // 4. Play splash.mp3
    const playSplashAudio = async () => {
      try {
        if (Platform.OS !== 'web') {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        }

        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/audio/splash.mp3'),
          { shouldPlay: false, volume: 1.0 }
        );
        soundRef.current = sound;

        if (!isMounted) {
          sound.unloadAsync().catch(() => {});
          return;
        }

        sound.setOnPlaybackStatusUpdate((s) => {
          if (!isMounted) return;
          if (!s.isLoaded) {
            setIsAudioPlaying(false);
            setAudioFinished(true);
            stopWaveAnimation();
            return;
          }
          if (s.isPlaying) {
            setIsAudioPlaying(true);
          }
          if (s.didJustFinish) {
            setIsAudioPlaying(false);
            setAudioFinished(true);
            stopWaveAnimation();
            // Auto-navigate 500ms after audio finishes
            navigationTimerRef.current = setTimeout(() => {
              if (isMounted) doNavigate();
            }, 500);
          }
        });

        // Try playing
        try {
          await sound.playAsync();
          setIsAudioPlaying(true);
          startWaveAnimation();

          // Progress bar tracks audio duration
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: false,
          }).start();
        } catch (_autoplayErr) {
          // Autoplay blocked by browser policy without user gesture on web.
          // Option A: User taps "शुरू करें / Get Started" to register user activation.
          setIsAudioPlaying(false);
          setAudioFinished(true);
          // Long safety fallback (15s) in case unattended
          navigationTimerRef.current = setTimeout(() => {
            if (isMounted) doNavigate();
          }, 15000);
        }
      } catch (_err) {
        if (!isMounted) return;
        setAudioFinished(true);
        navigationTimerRef.current = setTimeout(() => {
          if (isMounted) doNavigate();
        }, 15000);
      }
    };

    const audioDelay = setTimeout(() => playSplashAudio(), 100);

    return () => {
      isMounted = false;
      clearTimeout(audioDelay);
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
      stopWaveAnimation();
      pulseLoop.stop();
      soundRef.current?.stopAsync().catch(() => {});
      soundRef.current?.unloadAsync().catch(() => {});
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
  // [DEV ONLY] Styles for quick jump switcher
  devBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 12,
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 10,
    alignItems: 'center',
  },
  devBarPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  devBarTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  devButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  devRoleBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  devRoleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
