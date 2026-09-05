import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { authService } from '@/api/authService';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/api/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthPhone'>;

export const AuthPhoneScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialRole: UserRole = route?.params?.role || 'ARTISAN';
  const [role, setRole] = useState<UserRole>(initialRole);
  const theme = useTheme();
  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

  React.useEffect(() => {
    if (route?.params?.role) {
      setRole(route.params.role);
    }
  }, [route?.params?.role]);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

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
      setErrorMessage('कृपया सही 10 अंकों का मोबाइल नंबर डालें (Enter valid 10-digit number)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Centered Neumorphic Card */}
        <View style={styles.cardContainer}>
          {/* Top 3D Neumorphic Emblem Card */}
          <View style={styles.emblemShadowWrapper}>
            <View style={styles.emblemCard}>
              <Image
                source={require('../../../assets/karigarx_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Heading & Subtitle */}
          <View style={styles.headerBlock}>
            <Text variant="headlineLarge" weight="bold" color="#0E243F" style={styles.titleText}>
              KARIGARX
            </Text>
            <Text variant="bodyMedium" weight="medium" color="#5A52DD" style={styles.taglineText}>
              CRAFT • CONNECT • GROW
            </Text>
            <Text variant="bodySmall" color="#64748B" style={styles.subtitleText}>
              कलाकार सेतु — कारीगर से बाज़ार तक
            </Text>
          </View>

          {/* Role Segmented Pill Selector */}
          <View style={styles.roleSegmentContainer}>
            {(['ARTISAN', 'BUYER', 'FACILITATOR'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              const label =
                r === 'ARTISAN' ? '🎨 कारीगर' : r === 'BUYER' ? '🛍️ खरीदार' : '🤝 सहयोगी';
              return (
                <TouchableOpacity
                  key={r}
                  testID={`role-tab-${r}`}
                  style={[
                    styles.roleSegmentItem,
                    isSelected && styles.roleSegmentItemActive,
                  ]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.85}
                >
                  <Text
                    variant="caption"
                    weight={isSelected ? 'bold' : 'medium'}
                    color={isSelected ? '#FFFFFF' : '#475569'}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Demo 1-Click Banner */}
          <TouchableOpacity
            testID="quick-demo-btn"
            style={styles.quickDemoChip}
            onPress={() => {
              setPhoneNumber('9876543210');
              handleLogin('9876543210');
            }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 13, marginRight: 6 }}>⚡</Text>
            <Text variant="caption" weight="bold" color="#4F46E5">
              1-टैप डेमो लॉगिन (9876543210)
            </Text>
          </TouchableOpacity>

          {/* Neumorphic Input Capsule */}
          <View
            style={[
              styles.inputCapsule,
              errorMessage ? styles.inputCapsuleError : null,
              phoneNumber.length === 10 ? styles.inputCapsuleValid : null,
            ]}
          >
            <View style={styles.inputPrefix}>
              <Text style={{ fontSize: 15, marginRight: 6 }}>📱</Text>
              <Text variant="bodyMedium" weight="bold" color="#0E243F">
                +91
              </Text>
            </View>

            <TextInput
              style={styles.phoneTextInput}
              value={phoneNumber}
              onChangeText={(val) => {
                const cleaned = val.replace(/\D/g, '').slice(0, 10);
                setPhoneNumber(cleaned);
                setErrorMessage(null);
              }}
              placeholder="मोबाइल नंबर (10 अंक)"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
            />

            {phoneNumber.length > 0 && (
              <TouchableOpacity
                onPress={() => setPhoneNumber('')}
                style={styles.clearBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Error message */}
          {errorMessage && (
            <Text variant="caption" weight="semiBold" color="#EF4444" style={styles.errorText}>
              ⚠️ {errorMessage}
            </Text>
          )}

          {/* Forgot PIN / Voice Saathi Helper Row */}
          <View style={styles.helperRow}>
            <TouchableOpacity
              onPress={() => setShowKeypad(!showKeypad)}
              style={styles.keypadToggleBtn}
            >
              <Text variant="caption" weight="semiBold" color="#6366F1">
                {showKeypad ? '⌨️ कीपैड छुपाएं' : '🔢 कीपैड खोलें'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPhoneNumber('9876543210');
              }}
            >
              <Text variant="caption" weight="medium" color="#64748B">
                मदद / Help?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button (Gradient Style Pill) */}
          <TouchableOpacity
            testID="login-submit-btn"
            style={[
              styles.gradientButton,
              (phoneNumber.length !== 10 || isLoading) && styles.gradientButtonDisabled,
            ]}
            onPress={() => handleLogin()}
            disabled={phoneNumber.length !== 10 || isLoading}
            activeOpacity={0.88}
          >
            <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.buttonLabel}>
              {isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें (Login) →'}
            </Text>
          </TouchableOpacity>

          {/* Divider: OR CONTINUE WITH */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text variant="caption" weight="bold" color="#94A3B8" style={styles.dividerText}>
              OR CONTINUE WITH
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* 3D Neumorphic Circular Social Buttons */}
          <View style={styles.socialButtonsRow}>
            {/* Google */}
            <TouchableOpacity
              testID="social-login-google"
              style={styles.socialCircleBtn}
              activeOpacity={0.8}
              accessibilityLabel="Sign in with Google"
              onPress={() => {
                setPhoneNumber('9876543210');
                handleLogin('9876543210');
              }}
            >
              <Image
                source={require('../../../assets/google_logo.png')}
                style={styles.socialLogoImg}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              testID="social-login-apple"
              style={styles.socialCircleBtn}
              activeOpacity={0.8}
              accessibilityLabel="Sign in with Apple"
              onPress={() => {
                setPhoneNumber('9876543210');
                handleLogin('9876543210');
              }}
            >
              <Image
                source={require('../../../assets/apple_logo.png')}
                style={styles.socialLogoImgApple}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              testID="social-login-facebook"
              style={styles.socialCircleBtn}
              activeOpacity={0.8}
              accessibilityLabel="Sign in with Facebook"
              onPress={() => {
                setPhoneNumber('9876543210');
                handleLogin('9876543210');
              }}
            >
              <Image
                source={require('../../../assets/facebook_logo.png')}
                style={styles.socialLogoImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Footnote Links */}
          <View style={styles.footerNavRow}>
            <TouchableOpacity
              testID="login-change-lang-btn"
              onPress={() => navigation.navigate('LanguageSelection')}
            >
              <Text variant="caption" weight="bold" color="#5A52DD">
                🌐 भाषा बदलें
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity
              testID="login-intro-tour-btn"
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text variant="caption" weight="bold" color="#5A52DD">
                ℹ️ ऐप टूर (App Tour)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Collapsible Tactile Keypad */}
          {showKeypad && (
            <View style={styles.keypadEmbed}>
              <TactileKeypad
                onPressDigit={handleDigit}
                onPressBackspace={handleBackspace}
                onPressConfirm={() => handleLogin()}
                disabled={isLoading}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF2F8',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 20,
    alignItems: 'center',
    // Soft neumorphic shadow
    shadowColor: '#536582',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  emblemShadowWrapper: {
    marginBottom: 12,
    // Dual soft shadow for 3D emblem look
    shadowColor: '#5A52DD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  emblemCard: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EFE9DE',
    overflow: 'hidden',
    padding: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    letterSpacing: 1.5,
    marginBottom: 2,
    fontSize: 24,
  },
  taglineText: {
    letterSpacing: 2,
    fontSize: 10.5,
    marginBottom: 3,
  },
  subtitleText: {
    letterSpacing: 0.2,
    fontSize: 12,
  },
  roleSegmentContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F1F4F9',
    borderRadius: 20,
    padding: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleSegmentItem: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  roleSegmentItemActive: {
    backgroundColor: '#5A52DD',
    shadowColor: '#5A52DD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  quickDemoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: '#F3F5FA',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E5EAF2',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  inputCapsuleValid: {
    borderColor: '#5A52DD',
    backgroundColor: '#F8F9FE',
  },
  inputCapsuleError: {
    borderColor: '#EF4444',
  },
  inputPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    marginRight: 10,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#0E243F',
    fontWeight: '600',
    letterSpacing: 1,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 4,
    marginBottom: 6,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  keypadToggleBtn: {
    paddingVertical: 2,
  },
  gradientButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5A52DD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A52DD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 14,
  },
  gradientButtonDisabled: {
    backgroundColor: '#A5B4FC',
    shadowOpacity: 0.1,
  },
  buttonLabel: {
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 11,
    letterSpacing: 1,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 14,
  },
  socialCircleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F0F3F8',
    // 3D Neumorphic raised shadow
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  socialLogoImg: {
    width: 24,
    height: 24,
  },
  socialLogoImgApple: {
    width: 22,
    height: 24,
  },
  footerNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerDot: {
    color: '#94A3B8',
    fontSize: 14,
  },
  keypadEmbed: {
    width: '100%',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F4F9',
  },
});
