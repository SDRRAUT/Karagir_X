import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { authService } from '@/api/authService';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthPhone'>;

export const AuthPhoneScreen: React.FC<Props> = ({ route, navigation }) => {
  const { role } = route.params;
  const theme = useTheme();
  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDigit = (digit: string) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleSendOtp = async (phoneOverride?: string) => {
    const targetPhone = phoneOverride || phoneNumber;
    if (targetPhone.length !== 10 || !/^[6-9]\d{9}$/.test(targetPhone)) {
      setErrorMessage('कृपया सही 10 अंकों का मोबाइल नंबर डालें (Invalid Indian Phone Number)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.sendOtp(targetPhone, locale, role);
      setIsLoading(false);
      navigation.navigate('OtpVerification', {
        phoneNumber: targetPhone,
        sessionId: resp.session_id,
        role,
      });
    } catch {
      setIsLoading(false);
      setErrorMessage('नेटवर्क त्रुटि — कृपया पुनः प्रयास करें।');
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Direct real Supabase login using seeded test credentials
      const resp = await authService.loginWithPassword('9876543210', '123456', role);
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
      setErrorMessage('प्रमाणीकरण त्रुटि — कृपया पुनः प्रयास करें।');
    }
  };

  const roleLabel =
    role === 'ARTISAN'
      ? 'कारीगर खाता'
      : role === 'BUYER'
      ? 'खरीदार खाता'
      : 'सहयोगी खाता';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Top Header */}
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
        <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700} style={styles.rolePill}>
          {roleLabel}
        </Text>
      </View>

      <View style={styles.content}>
        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          अपना मोबाइल नंबर दर्ज करें
        </Text>
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
          लॉगिन या नया खाता बनाने के लिए OTP भेजा जाएगा
        </Text>

        {/* Quick Demo Login Button */}
        <TouchableOpacity
          testID="quick-demo-btn"
          style={[styles.quickDemoBtn, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.surface.border }]}
          onPress={handleQuickLogin}
          accessibilityRole="button"
          accessibilityLabel="Fill demo phone and login"
        >
          <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
            ⚡ टेस्ट खाता (9876543210) से त्वरित लॉगिन करें
          </Text>
        </TouchableOpacity>

        {/* Big Phone Input Display */}
        <View
          style={[
            styles.phoneDisplayCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: errorMessage
                ? theme.colors.status.danger
                : phoneNumber.length === 10
                ? theme.colors.primary.emerald700
                : theme.colors.surface.border,
              ...theme.shadows.level1,
            },
          ]}
        >
          <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700} style={styles.countryCode}>
            🇮🇳 +91
          </Text>
          <Text variant="numeralExtraBold" weight="bold" color={theme.colors.text.primary} style={styles.phoneDigits}>
            {phoneNumber ? `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}` : '__________'}
          </Text>
        </View>

        {errorMessage && (
          <Text variant="bodySmall" weight="bold" color={theme.colors.status.danger} style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        )}

        <Button
          label="OTP कोड भेजें (Send OTP) →"
          variant="primary"
          size="decision"
          isLoading={isLoading}
          disabled={phoneNumber.length !== 10}
          onPress={() => handleSendOtp()}
          style={styles.sendOtpBtn}
        />
      </View>

      {/* Tactile Keypad */}
      <View style={[styles.keypadContainer, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level3 }]}>
        <TactileKeypad
          onPressDigit={handleDigit}
          onPressBackspace={handleBackspace}
          onPressConfirm={() => handleSendOtp()}
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
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  testBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  quickDemoBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  phoneDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 68,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countryCode: {
    marginRight: 12,
  },
  phoneDigits: {
    letterSpacing: 2,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  sendOtpBtn: {
    marginTop: 6,
  },
  keypadContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});
