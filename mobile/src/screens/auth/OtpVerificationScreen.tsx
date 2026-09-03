import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

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
      setErrorMessage('SMS भेजने में त्रुटि — कृपया पुनः प्रयास करें।');
    }
  };

  const handleVerify = async () => {
    if (otpDigits.length !== 6) {
      setErrorMessage('कृपया 6 अंकों का पूरा कोड डालें (Enter 6-digit code)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.verifyOtp(
        currentSessionId,
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
      setErrorMessage('गलत OTP कोड। कृपया SMS देखकर पुनः दर्ज करें।');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          +91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}
        </Text>
      </View>

      <View style={styles.content}>
        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          SMS सत्यापन कोड दर्ज करें
        </Text>
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
          6-digit verification code sent to your phone
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
                      ? theme.colors.primary.emerald700
                      : theme.colors.surface.border,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <Text variant="numeralExtraBold" weight="bold" color={theme.colors.text.primary}>
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
              ⏱️ नया कोड मंगाएं {secondsRemaining} सेकंड में
            </Text>
          ) : (
            <View style={styles.resendRow}>
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Text variant="bodyMedium" weight="bold" color={theme.colors.primary.emerald700}>
                  🔄 दोबारा SMS भेजें (Resend SMS)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          label="सत्यापित करें (Verify Code) ✓"
          variant="primary"
          size="decision"
          isLoading={isLoading}
          disabled={otpDigits.length !== 6}
          onPress={handleVerify}
          style={styles.verifyBtn}
        />
      </View>

      {/* Tactile Keypad */}
      <View style={[styles.keypadContainer, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level3 }]}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  timerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendBtn: {
    padding: 8,
  },
  verifyBtn: {
    marginTop: 8,
  },
  keypadContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});

