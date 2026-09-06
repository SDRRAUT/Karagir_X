import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { Icon } from '@/components/icons/Icon';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { UserRole } from '@/api/types';
import { voiceGuidance } from '@/utils/voiceGuidance';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

interface RoleTheme {
  themeColor: string;
  lightBg: string;
  borderAccent: string;
}

const ROLE_THEMES: Record<UserRole, RoleTheme> = {
  ARTISAN: {
    themeColor: '#EA580C',
    lightBg: '#FFF7ED',
    borderAccent: '#FED7AA',
  },
  BUYER: {
    themeColor: '#4338CA',
    lightBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
  },
  FACILITATOR: {
    themeColor: '#16A34A',
    lightBg: '#F0FDF4',
    borderAccent: '#BBF7D0',
  },
  ADMIN_STAFF: {
    themeColor: '#0F172A',
    lightBg: '#F1F5F9',
    borderAccent: '#CBD5E1',
  },
};

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phoneNumber, sessionId, role } = route.params;
  const roleTheme = ROLE_THEMES[role] || ROLE_THEMES.ARTISAN;

  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

  const [otpDigits, setOtpDigits] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [secondsRemaining, setSecondsRemaining] = useState(27);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const textInputRef = useRef<TextInput>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bannerAnim = useRef(new Animated.Value(-100)).current;

  // Pulse animation on the 3D lock container
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  // Auto-focus the text input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Simulated auto-read incoming SMS after 1.4s
  useEffect(() => {
    const smsTimer = setTimeout(() => {
      setShowSmsBanner(true);
      Animated.spring(bannerAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }, 1400);

    return () => clearTimeout(smsTimer);
  }, [bannerAnim]);

  // Format countdown mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Formatted phone number e.g. +91 98765 43210
  const formattedPhone =
    phoneNumber.length === 10
      ? `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
      : phoneNumber;

  // Handle auto-fill from simulated SMS
  const handleAutoFill = () => {
    const demoOtp = '123456';
    setOtpDigits(demoOtp);
    setErrorMessage(null);
    setShowSmsBanner(false);
  };

  // Listen to OTP voice guidance
  const handleSpeakOtp = () => {
    setIsSpeaking(true);
    const spokenCode = (otpDigits.length === 6 ? otpDigits : '123456')
      .split('')
      .join('... ');

    voiceGuidance.speakHindi(
      `आपका सत्यापन कोड है: ${spokenCode}`,
      () => {},
      () => {
        setIsSpeaking(false);
      }
    );
  };

  const handleDigit = (digit: string) => {
    if (otpDigits.length < 6) {
      const nextVal = otpDigits + digit;
      setOtpDigits(nextVal);
      setErrorMessage(null);
      if (nextVal.length === 6) {
        verifyCode(nextVal);
      }
    }
  };

  const handleBackspace = () => {
    setOtpDigits((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  // Primary action: verify OTP and sync to database
  const verifyCode = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otpDigits;
    if (finalCode.length !== 6) {
      setErrorMessage('कृपया पूरा 6 अंकों का OTP दर्ज करें');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.verifyOtp(
        currentSessionId,
        finalCode,
        phoneNumber,
        role,
        locale
      );

      setIsLoading(false);

      await setSession(
        {
          accessToken: resp.access_token,
          refreshToken: resp.refresh_token,
          expiresInSeconds: resp.expires_in_seconds,
        },
        resp.user
      );

      // Transition to Profile Setup onboarding
      navigation.navigate('ProfileSetup', { role });
    } catch {
      setIsLoading(false);
      setErrorMessage('गलत OTP कोड। कृपया पुनः प्रयास करें या Auto-read दबाएं।');
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSecondsRemaining(30);

    try {
      const resp = await authService.sendOtp(phoneNumber, locale, role);
      setCurrentSessionId(resp.session_id);
      setIsLoading(false);
      setShowSmsBanner(true);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('RoleSelection'))}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="arrowLeft" size={20} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.brandMottoPill}>
          <Icon name="sparkles" size={13} color="#EA580C" style={{ marginRight: 5 }} />
          <Text variant="caption" weight="bold" color="#EA580C" style={styles.brandMottoText}>
            KALAKAR SETU
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleAutoFill}
          style={[styles.autoFillPill, { borderColor: roleTheme.borderAccent }]}
          activeOpacity={0.7}
        >
          <Icon name="zap" size={13} color={roleTheme.themeColor} style={{ marginRight: 4 }} />
          <Text variant="caption" weight="bold" color={roleTheme.themeColor}>
            Auto-read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simulated SMS Auto-Read Banner */}
      {showSmsBanner && (
        <Animated.View
          style={[
            styles.smsBanner,
            {
              transform: [{ translateY: bannerAnim }],
              borderColor: roleTheme.borderAccent,
              backgroundColor: roleTheme.lightBg,
            },
          ]}
        >
          <View style={styles.smsBannerContent}>
            <Icon name="mail" size={22} color={roleTheme.themeColor} />
            <View style={{ flex: 1 }}>
              <Text variant="bodySmall" weight="bold" color="#0F172A">
                SMS Auto-Read: OTP 123456
              </Text>
              <Text variant="caption" color="#64748B">
                Tap to auto-fill verification code
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAutoFill}
              style={[styles.smsFillBtn, { backgroundColor: roleTheme.themeColor }]}
            >
              <Text variant="caption" weight="bold" color="#FFFFFF">
                Auto-fill
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 3D Clay Lock Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                borderColor: roleTheme.borderAccent,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Image
              source={require('@/../assets/otp_3d_lock.jpg')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </Animated.View>

          <Text variant="headlineLarge" weight="bold" color="#0F172A" style={styles.titleText}>
            Number Verify Karein
          </Text>

          <View style={styles.subtitleBox}>
            <Text variant="bodyMedium" color="#64748B" style={{ textAlign: 'center' }}>
              OTP bheja gaya hai
            </Text>
            <Text
              variant="bodyLarge"
              weight="bold"
              color="#0F172A"
              style={{ textAlign: 'center', marginTop: 2 }}
            >
              {formattedPhone}
            </Text>
          </View>

          {/* Dev/Testing OTP Quick Assist Pill */}
          <TouchableOpacity
            onPress={handleAutoFill}
            style={styles.devOtpHintPill}
            activeOpacity={0.8}
          >
            <Icon name="sparkles" size={13} color={roleTheme.themeColor} />
            <Text variant="caption" weight="semiBold" color="#475569">
              Dev OTP: <Text variant="caption" weight="bold" color={roleTheme.themeColor}>123456</Text> (Tap to fill)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 6-Digit OTP Box Grid (Single Connected Input) */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => textInputRef.current?.focus()}
          style={styles.otpGridWrapper}
        >
          <View style={styles.otpBoxesRow}>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const digit = otpDigits[idx] || '';
              const isCurrent = otpDigits.length === idx;
              const isFilled = digit.length > 0;

              return (
                <View
                  key={idx}
                  style={[
                    styles.digitBox,
                    isFilled && styles.digitBoxFilled,
                    isCurrent && [styles.digitBoxActive, { borderColor: roleTheme.themeColor }],
                    errorMessage ? styles.digitBoxError : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.digitText,
                      { color: isFilled ? '#0F172A' : '#CBD5E1' },
                    ]}
                  >
                    {digit || (isCurrent ? '|' : '•')}
                  </Text>
                  {isCurrent && (
                    <View style={[styles.cursorIndicator, { backgroundColor: roleTheme.themeColor }]} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Invisible TextInput overlay for smooth native keyboard & auto-fill */}
          <TextInput
            ref={textInputRef}
            value={otpDigits}
            onChangeText={(val) => {
              const cleaned = val.replace(/\D/g, '').slice(0, 6);
              setOtpDigits(cleaned);
              setErrorMessage(null);
              if (cleaned.length === 6) {
                verifyCode(cleaned);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            autoFocus={true}
            textContentType="oneTimeCode"
          />
        </TouchableOpacity>

        {/* Error Message */}
        {errorMessage && (
          <View style={styles.errorRow}>
            <Icon name="alertCircle" size={14} color="#EF4444" style={{ marginRight: 5 }} />
            <Text variant="bodySmall" weight="semiBold" color="#EF4444">
              {errorMessage}
            </Text>
          </View>
        )}

        {/* Voice OTP Readout Button */}
        <TouchableOpacity
          style={[styles.voiceOtpBtn, { backgroundColor: roleTheme.lightBg }]}
          onPress={handleSpeakOtp}
          activeOpacity={0.8}
        >
          <Icon name="speaker" size={18} color={roleTheme.themeColor} />
          <Text variant="bodyMedium" weight="bold" color={roleTheme.themeColor}>
            {isSpeaking ? 'OTP sun rahe hain...' : 'OTP sunayein'}
          </Text>
        </TouchableOpacity>

        {/* Countdown Timer or Resend Button */}
        <View style={styles.timerRow}>
          {secondsRemaining > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="clock" size={14} color="#64748B" />
              <Text variant="bodyMedium" color="#64748B" style={styles.timerText}>
                Resend OTP in <Text weight="bold" color="#0F172A">{formatTimer(secondsRemaining)}</Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="refresh" size={16} color={roleTheme.themeColor} />
                <Text variant="bodyMedium" weight="bold" color={roleTheme.themeColor}>
                  Resend OTP via SMS
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          testID="verify-submit-btn"
          style={[
            styles.verifyBtn,
            { backgroundColor: roleTheme.themeColor },
            (otpDigits.length !== 6 || isLoading) && styles.verifyBtnDisabled,
          ]}
          onPress={() => verifyCode()}
          disabled={otpDigits.length !== 6 || isLoading}
          activeOpacity={0.85}
        >
          <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.verifyBtnText}>
            {isLoading ? 'Verifying OTP...' : 'Verify & Continue →'}
          </Text>
        </TouchableOpacity>

        {/* Number Change Link */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.changeNumberBtn}
          activeOpacity={0.7}
        >
          <Text variant="bodyMedium" weight="semiBold" color="#64748B">
            Number change karein
          </Text>
        </TouchableOpacity>

        {/* Tactile Keypad Toggle for accessibility */}
        <TouchableOpacity
          onPress={() => setShowKeypad(!showKeypad)}
          style={styles.keypadToggle}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name={showKeypad ? 'keyboard' : 'keypad'} size={15} color="#94A3B8" />
            <Text variant="caption" weight="medium" color="#94A3B8">
              {showKeypad ? 'Use standard keyboard' : 'Use on-screen tactile keypad'}
            </Text>
          </View>
        </TouchableOpacity>

        {showKeypad && (
          <View style={styles.keypadWrapper}>
            <TactileKeypad
              onPressDigit={handleDigit}
              onPressBackspace={handleBackspace}
              onPressConfirm={() => verifyCode()}
              disabled={isLoading}
            />
          </View>
        )}

        {/* Security & Privacy Assurance */}
        <View style={styles.securityRow}>
          <Icon name="shieldCheck" size={16} color="#64748B" />
          <Text variant="caption" weight="medium" color="#64748B">
            Aapki jankari 100% surakshit hai
          </Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  brandMottoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  brandMottoText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  autoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  smsBanner: {
    marginHorizontal: 18,
    marginTop: 6,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  smsBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smsFillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#3F200A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleBox: {
    alignItems: 'center',
    marginTop: 2,
  },
  devOtpHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  otpGridWrapper: {
    width: '100%',
    maxWidth: 360,
    marginVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  digitBox: {
    width: 50,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  digitBoxFilled: {
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  digitBoxActive: {
    borderWidth: 2.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  digitBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  digitText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cursorIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 16,
    height: 2.5,
    borderRadius: 2,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.01,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineStyle: 'none',
        } as any)
      : {}),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 10,
    gap: 8,
  },
  timerRow: {
    marginVertical: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
  },
  resendBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  verifyBtn: {
    width: '100%',
    maxWidth: 360,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  verifyBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyBtnText: {
    fontSize: 16,
  },
  changeNumberBtn: {
    paddingVertical: 10,
    marginTop: 4,
  },
  keypadToggle: {
    paddingVertical: 8,
    marginTop: 6,
  },
  keypadWrapper: {
    width: '100%',
    maxWidth: 360,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
});
