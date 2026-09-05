import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { AppHeader } from '@/components/navigation/AppHeader';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phoneNumber, sessionId, role } = route.params;
  const theme = useTheme();
  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

  const [otpDigits, setOtpDigits] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleDigit = (digit: string) => {
    if (otpDigits.length < 6) {
      setOtpDigits((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleBackspace = () => {
    setOtpDigits((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const resp = await authService.sendOtp(phoneNumber, locale, role);
      setCurrentSessionId(resp.session_id);
      setSecondsRemaining(60);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setErrorMessage('Error sending SMS — please try again.');
    }
  };

  const handleVerify = async () => {
    if (otpDigits.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.verifyOtp(
        currentSessionId || `sess_${Date.now()}`,
        otpDigits,
        phoneNumber,
        role,
        locale
      );

      await setSession(
        {
          accessToken: resp.access_token,
          refreshToken: resp.refresh_token,
          expiresInSeconds: resp.expires_in_seconds,
        },
        resp.user
      );

      setIsLoading(false);

      if (resp.is_new_user || !resp.user.isProfileComplete) {
        navigation.replace('ProfileSetup', { role });
      } else {
        navigation.replace('MainTabs', { screen: 'HomeTab' });
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Incorrect OTP code. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        showBack
        showBrand
        title="Verification Code"
        subtitle={`+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`}
      />

      <View style={styles.content}>
        {/* Test Mode Notification */}
        <View style={[styles.testBadge, { backgroundColor: theme.colors.ochre.light, borderColor: theme.colors.ochre.border }]}>
          <Text variant="caption" weight="bold" color={theme.colors.ochre.text}>
            🧪 Test Mode: Default OTP is 123456 (Bypass active)
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            Enter 6-Digit OTP
          </Text>
          <VoiceCueButton
            textHi="आपके मोबाइल नंबर पर भेजा गया 6 अंकों का ओटीपी कोड यहाँ दर्ज करें।"
            size="small"
            testID="voice-cue-otp"
          />
        </View>
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
          Enter 123456 or the code sent via SMS
        </Text>

        {/* 6 Digit Boxes */}
        <View style={styles.otpBoxesRow}>
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const digit = otpDigits[idx] || '';
            const isCurrent = otpDigits.length === idx;
            return (
              <View
                key={`box-${idx}`}
                style={[
                  styles.digitBox,
                  {
                    backgroundColor: theme.colors.surface.card,
                    borderColor: errorMessage
                      ? theme.colors.status.danger
                      : isCurrent
                      ? theme.colors.brand.primary
                      : theme.colors.sand[200],
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <Text variant="numeralExtraBold" weight="bold" color={theme.colors.charcoal[900]}>
                  {digit ? digit : ''}
                </Text>
              </View>
            );
          })}
        </View>

        {errorMessage && (
          <Text variant="bodySmall" weight="bold" color={theme.colors.status.danger} style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        )}

        {/* Countdown Timer or Resend Buttons */}
        <View style={styles.timerContainer}>
          {secondsRemaining > 0 ? (
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              ⏱️ Request new code in {secondsRemaining}s
            </Text>
          ) : (
            <View style={styles.resendRow}>
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.brand.primary}>
                  🔄 Resend OTP via SMS
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          label="Verify & Continue →"
          variant="primary"
          size="decision"
          isLoading={isLoading}
          disabled={false}
          onPress={handleVerify}
          style={styles.verifyBtn}
        />
      </View>

      {/* Tactile Keypad */}
      <View
        style={[
          styles.keypadContainer,
          {
            backgroundColor: theme.colors.surface.card,
            borderTopColor: theme.colors.sand[200],
            ...theme.shadows.level4,
          },
        ]}
      >
        <TactileKeypad
          onPressDigit={handleDigit}
          onPressBackspace={handleBackspace}
          onPressConfirm={handleVerify}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  testBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    marginBottom: 14,
  },
  digitBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  timerContainer: {
    marginBottom: 16,
  },
  resendRow: {
    alignItems: 'center',
  },
  resendBtn: {
    padding: 6,
  },
  verifyBtn: {
    width: '100%',
  },
  keypadContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
});
