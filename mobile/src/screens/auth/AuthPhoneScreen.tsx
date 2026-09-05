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
import { Text } from '@/components/typography/Text';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { authService } from '@/api/authService';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/api/types';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthPhone'>;

export const AuthPhoneScreen: React.FC<Props> = ({ route, navigation }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const role: UserRole = selectedRole || route?.params?.role || 'ARTISAN';
  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

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

  interface RoleMeta {
    title: string;
    phone: string;
    name: string;
    location: string;
    submitLabel: string;
    placeholder: string;
    themeColor: string;
    themeLightBg: string;
    icon: string;
  }

  const ROLE_DATA: Record<UserRole, RoleMeta> = {
    BUYER: {
      title: 'Buyer Portal',
      phone: '9810012345',
      name: 'Priya Sharma',
      location: 'Delhi NCR • Verified Buyer',
      submitLabel: 'Continue to Buyer Portal',
      placeholder: 'Enter 10-digit mobile number',
      themeColor: '#4338CA',
      themeLightBg: '#EEF2FF',
      icon: '🛍️',
    },
    ARTISAN: {
      title: 'Artisan Studio',
      phone: '9876543210',
      name: 'Ramesh Kumbhar',
      location: 'Kolhapur, MH • Master Potter',
      submitLabel: 'Continue to Artisan Studio',
      placeholder: 'Enter 10-digit mobile number',
      themeColor: '#EA580C',
      themeLightBg: '#FFF7ED',
      icon: '🎨',
    },
    FACILITATOR: {
      title: 'Sahyogi Desk',
      phone: '9822399887',
      name: 'Pooja Verma',
      location: 'Pune Cluster, MH • Field Lead',
      submitLabel: 'Continue to Sahyogi Desk',
      placeholder: 'Enter 10-digit mobile number',
      themeColor: '#16A34A',
      themeLightBg: '#F0FDF4',
      icon: '🤝',
    },
    ADMIN_STAFF: {
      title: 'Operations Desk',
      phone: '9800011223',
      name: 'Vikram Mehta',
      location: 'National Hub • Operations',
      submitLabel: 'Continue to Operations Desk',
      placeholder: 'Enter admin mobile',
      themeColor: '#0F172A',
      themeLightBg: '#F1F5F9',
      icon: '🛡️',
    },
  };

  const roleInfo = ROLE_DATA[role] || ROLE_DATA.ARTISAN;

  const handleLogin = async (phoneOverride?: string, roleOverride?: UserRole) => {
    const targetRole = roleOverride || role;
    const targetMeta = ROLE_DATA[targetRole] || ROLE_DATA.ARTISAN;
    const targetPhone = phoneOverride || phoneNumber || targetMeta.phone;

    if (targetPhone.length !== 10 || !/^[6-9]\d{9}$/.test(targetPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.verifyOtp(
        `test_session_${Date.now()}`,
        '123456',
        targetPhone,
        targetRole,
        'en_IN'
      );

      resp.user.fullName = targetMeta.name;
      resp.user.role = targetRole;
      resp.user.phoneNumber = targetPhone;

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
        navigation.replace('ProfileSetup', { role: targetRole });
      } else {
        navigation.replace('MainTabs', { screen: 'HomeTab' });
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Network error — please check your connection and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.authCard}>
          {/* Brand Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../../assets/karigarx_logo.png')}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>

            <Text variant="headlineMedium" weight="bold" color="#0F172A" style={styles.titleText}>
              KarigarX
            </Text>

            <View style={styles.mottoPill}>
              <Text variant="caption" weight="bold" color="#EA580C" style={styles.mottoText}>
                ✨ CRAFT • CONNECT • GROW ✨
              </Text>
            </View>

            <Text variant="bodySmall" color="#64748B" style={styles.subtitleText}>
              Direct from India's Master Artisans
            </Text>
          </View>

          {/* Role Segmented Tabs (Buyer | Artisan | Sahyogi) */}
          <View style={styles.roleTabsContainer}>
            {(['BUYER', 'ARTISAN', 'FACILITATOR'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              const meta = ROLE_DATA[r];
              return (
                <TouchableOpacity
                  key={r}
                  testID={`role-tab-${r}`}
                  style={[
                    styles.roleTabButton,
                    isSelected && {
                      backgroundColor: meta.themeColor,
                      shadowColor: meta.themeColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      elevation: 3,
                    },
                  ]}
                  onPress={() => {
                    setSelectedRole(r);
                    setErrorMessage(null);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.roleTabIcon}>{meta.icon}</Text>
                  <Text
                    variant="caption"
                    weight={isSelected ? 'bold' : 'semiBold'}
                    color={isSelected ? '#FFFFFF' : '#64748B'}
                    style={styles.roleTabLabel}
                  >
                    {r === 'BUYER' ? 'Buyer' : r === 'ARTISAN' ? 'Artisan' : 'Sahyogi'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Form Label & Quick Demo Link */}
          <View style={styles.fieldHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text variant="caption" weight="bold" color="#334155" style={styles.fieldLabel}>
                MOBILE NUMBER
              </Text>
              <VoiceCueButton
                textHi="कृपया अपना दस अंकों का मोबाइल नंबर यहाँ दर्ज करें।"
                size="small"
                testID="voice-cue-mobile"
              />
            </View>
            <TouchableOpacity
              testID="quick-demo-btn"
              onPress={() => {
                setPhoneNumber(roleInfo.phone);
                handleLogin(roleInfo.phone, role);
              }}
              activeOpacity={0.7}
              style={styles.demoLinkBtn}
            >
              <Text variant="caption" weight="bold" color={roleInfo.themeColor}>
                ⚡ 1-Tap Demo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Clean Phone Input Capsule */}
          <View
            style={[
              styles.inputCapsule,
              errorMessage ? styles.inputCapsuleError : null,
              phoneNumber.length === 10 && {
                borderColor: roleInfo.themeColor,
                backgroundColor: '#FFFFFF',
              },
            ]}
          >
            <View style={styles.countryCodeBadge}>
              <Text style={{ fontSize: 16, marginRight: 6 }}>🇮🇳</Text>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
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
              placeholder={roleInfo.placeholder}
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
            />

            {phoneNumber.length > 0 && (
              <TouchableOpacity
                onPress={() => setPhoneNumber('')}
                style={styles.clearBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Error Message */}
          {errorMessage && (
            <Text variant="caption" weight="semiBold" color="#EF4444" style={styles.errorText}>
              ⚠️ {errorMessage}
            </Text>
          )}

          {/* Keypad & Fill Demo Helpers */}
          <View style={styles.helperRow}>
            <TouchableOpacity
              onPress={() => setShowKeypad(!showKeypad)}
              style={styles.keypadToggleBtn}
            >
              {showKeypad ? (
                <Text variant="caption" weight="semiBold" color={roleInfo.themeColor}>
                  ⌨️ Hide Keypad
                </Text>
              ) : (
                <Text variant="caption" weight="semiBold" color={roleInfo.themeColor}>
                  🔢 कीपैड खोलें
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPhoneNumber(roleInfo.phone);
                setErrorMessage(null);
              }}
            >
              <Text variant="caption" weight="medium" color="#64748B">
                Auto-fill ({roleInfo.phone})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            testID="login-submit-btn"
            style={[
              styles.submitBtn,
              { backgroundColor: roleInfo.themeColor },
              (phoneNumber.length !== 10 || isLoading) && styles.submitBtnDisabled,
            ]}
            onPress={() => handleLogin()}
            disabled={phoneNumber.length !== 10 || isLoading}
            activeOpacity={0.88}
          >
            <Text variant="bodyMedium" weight="bold" color="#FFFFFF" style={styles.submitBtnText}>
              {isLoading ? 'Signing In...' : `${roleInfo.submitLabel} →`}
            </Text>
          </TouchableOpacity>

          {/* Collapsible Keypad */}
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

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text variant="caption" weight="medium" color="#94A3B8" style={styles.dividerText}>
              or continue with
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Icons Row */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              testID="social-login-google"
              style={styles.socialCircle}
              activeOpacity={0.8}
              onPress={() => handleLogin(roleInfo.phone)}
            >
              <Image
                source={require('../../../assets/google_logo.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              testID="social-login-apple"
              style={styles.socialCircle}
              activeOpacity={0.8}
              onPress={() => handleLogin(roleInfo.phone)}
            >
              <Image
                source={require('../../../assets/apple_logo.png')}
                style={styles.socialIconApple}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              testID="social-login-facebook"
              style={styles.socialCircle}
              activeOpacity={0.8}
              onPress={() => handleLogin(roleInfo.phone)}
            >
              <Image
                source={require('../../../assets/facebook_logo.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Footer Navigation Links */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              testID="login-change-lang-btn"
              onPress={() => navigation.navigate('LanguageSelection')}
            >
              <Text variant="caption" weight="semiBold" color="#64748B">
                🌐 Change Language
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity
              testID="login-intro-tour-btn"
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text variant="caption" weight="semiBold" color="#64748B">
                ℹ️ App Tour
              </Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ECE8E1',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
    marginBottom: 10,
    padding: 6,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    letterSpacing: 0.5,
    fontSize: 22,
    color: '#0F172A',
    marginBottom: 4,
  },
  mottoPill: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  mottoText: {
    letterSpacing: 1.2,
    fontSize: 9.5,
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  roleTabsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    marginBottom: 18,
  },
  roleTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 11,
    gap: 4,
  },
  roleTabIcon: {
    fontSize: 13,
  },
  roleTabLabel: {
    fontSize: 12,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  fieldLabel: {
    fontSize: 10.5,
    letterSpacing: 0.8,
  },
  demoLinkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  inputCapsuleError: {
    borderColor: '#EF4444',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    marginRight: 10,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    letterSpacing: 0.8,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
  },
  errorText: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginLeft: 2,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 2,
    marginBottom: 16,
  },
  keypadToggleBtn: {
    paddingVertical: 2,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 18,
  },
  submitBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    letterSpacing: 0.4,
  },
  keypadEmbed: {
    width: '100%',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },
  socialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialIconApple: {
    width: 18,
    height: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerDot: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});
