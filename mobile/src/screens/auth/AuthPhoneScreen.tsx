import React, { useState } from 'react';
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

  const handleLogin = async (phoneOverride?: string) => {
    const targetPhone = phoneOverride || phoneNumber;
    if (targetPhone.length !== 10 || !/^[6-9]\d{9}$/.test(targetPhone)) {
      setErrorMessage('कृपया सही 10 अंकों का मोबाइल नंबर डालें (Invalid Indian Phone Number)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Direct Testing Auth mode
      const resp = await authService.verifyOtp(
        `test_session_${Date.now()}`,
        '123456',
        targetPhone,
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
      setErrorMessage('नेटवर्क त्रुटि — कृपया पुनः प्रयास करें। (Failed to authenticate)');
    }
  };

  const roleLabel =
    role === 'ARTISAN'
      ? 'कारीगर खाता (Artisan)'
      : role === 'BUYER'
      ? 'खरीदार खाता (Buyer)'
      : 'सहयोगी खाता (Facilitator)';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Stitch Master Header */}
      <AppHeader
        showBack
        showBrand
        rightAction={
          <View style={[styles.helpPill, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[300] }]}>
            <Text variant="caption" weight="bold" color={theme.colors.charcoal[800]}>
              मदद / Help
            </Text>
          </View>
        }
      />

      {/* Multi-segment visual stepper matching Stitch screenshot */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperBars}>
          <View style={[styles.stepperBar, { backgroundColor: theme.colors.brand.primary }]} />
          <View style={[styles.stepperBar, { backgroundColor: theme.colors.brand.primary }]} />
          <View style={[styles.stepperBar, { backgroundColor: theme.colors.sand[200] }]} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[styles.roleStagePill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <Text variant="caption" weight="bold" color="#065F46">
              {roleLabel}
            </Text>
          </View>
          <Text variant="caption" color={theme.colors.text.secondary}>
            चरण 2/3
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Testing Mode Alert Banner */}
        <View style={styles.testModeBadge}>
          <Text variant="bodySmall" weight="bold" color={theme.colors.brand.primary}>
            🧪 टेस्टिंग मोड: OTP सत्यापन हटाया गया है (Direct Test Login)
          </Text>
        </View>

        {/* 1-Click Quick Fill Action Button */}
        <TouchableOpacity
          testID="quick-demo-btn"
          style={[
            styles.quickDemoBtn,
            {
              backgroundColor: '#FEF3C7',
              borderColor: '#FDE68A',
              ...theme.shadows.level1,
            },
          ]}
          onPress={() => {
            setPhoneNumber('9876543210');
            handleLogin('9876543210');
          }}
          accessibilityRole="button"
          accessibilityLabel="Fill demo phone and login"
        >
          <Text variant="bodySmall" weight="bold" color="#92400E">
            ⚡ टेस्ट नंबर 9876543210 से 1-क्लिक लॉगिन करें
          </Text>
        </TouchableOpacity>

        {/* Bolie Saathi Voice Guide Bar */}
        <View style={[styles.voiceBar, { backgroundColor: '#FFF9E6', borderColor: '#FDE68A' }]}>
          <View style={styles.voiceBarLeft}>
            <View style={[styles.voiceMicCircle, { backgroundColor: theme.colors.brand.primary }]}>
              <Text style={{ fontSize: 12, color: '#FFFFFF' }}>🎙️</Text>
            </View>
            <Text variant="caption" weight="bold" color={theme.colors.charcoal[900]}>
              बोलिए साथी: <Text variant="caption" color={theme.colors.text.secondary}>बोलकर नंबर भरें</Text>
            </Text>
          </View>
          <View style={[styles.tapSpeakPill, { borderColor: theme.colors.brand.primary }]}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              Tap to Speak
            </Text>
          </View>
        </View>

        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          अपना मोबाइल नंबर दर्ज करें
        </Text>
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
          नंबर दर्ज करते ही सीधा सुरक्षित लॉगिन हो जाएगा
        </Text>

        {/* Phone Input Display Card */}
        <View
          style={[
            styles.phoneDisplayCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: errorMessage
                ? theme.colors.status.danger
                : phoneNumber.length === 10
                ? theme.colors.brand.primary
                : theme.colors.sand[200],
              ...theme.shadows.level1,
            },
          ]}
        >
          <Text variant="headlineLarge" weight="bold" color={theme.colors.brand.primary} style={styles.countryCode}>
            🇮🇳 +91
          </Text>
          <Text
            variant="numeralExtraBold"
            weight="bold"
            color={phoneNumber ? theme.colors.charcoal[900] : theme.colors.text.muted}
            style={styles.phoneDigits}
          >
            {phoneNumber ? `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}` : '__________'}
          </Text>
        </View>

        {errorMessage && (
          <Text variant="bodySmall" weight="bold" color={theme.colors.status.danger} style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        )}

        <Button
          label="लॉगिन करें (बिना OTP) →"
          variant="primary"
          size="decision"
          isLoading={isLoading}
          disabled={phoneNumber.length !== 10}
          onPress={() => handleLogin()}
          style={styles.sendOtpBtn}
        />
      </View>

      {/* Tactile Keypad Container */}
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
          onPressConfirm={() => handleLogin()}
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
  helpPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepperBars: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    maxWidth: 150,
  },
  stepperBar: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  roleStagePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  voiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  voiceBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceMicCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapSpeakPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
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
    marginBottom: 12,
  },
  testModeBadge: {
    backgroundColor: '#EBF7EE',
    borderColor: '#86C29B',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickDemoBtn: {
    paddingHorizontal: 16,
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
    marginBottom: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
});
