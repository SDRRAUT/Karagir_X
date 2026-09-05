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
    tagline: string;
    badge: string;
    phone: string;
    name: string;
    location: string;
    idCode: string;
    demoLabel: string;
    submitLabel: string;
    placeholder: string;
    themeColor: string;
    themeLightBg: string;
    icon: string;
  }

  const ROLE_DATA: Record<UserRole, RoleMeta> = {
    BUYER: {
      title: 'Buyer & Corporate Portal',
      tagline: 'Authentic GI Crafts & Bulk Gifting',
      badge: 'Certified GI Heritage',
      phone: '9810012345',
      name: 'Priya Sharma',
      location: 'Delhi NCR • Verified Buyer',
      idCode: 'BUY-DEL-9021',
      demoLabel: '1-Tap Sign In as Priya Sharma (Buyer) →',
      submitLabel: 'Sign In to Buyer Portal',
      placeholder: 'Enter buyer mobile (e.g. 98100 12345)',
      themeColor: '#4338CA',
      themeLightBg: '#EEF2FF',
      icon: '🛍️',
    },
    ARTISAN: {
      title: 'Master Artisan & Seller Studio',
      tagline: 'Craft Production & AI Studio',
      badge: '0% Platform Commission',
      phone: '9876543210',
      name: 'Ramesh Kumbhar',
      location: 'Kolhapur, MH • Master Potter',
      idCode: 'GI-MH-2024-402',
      demoLabel: '1-Tap Sign In as Master Artisan (Ramesh) →',
      submitLabel: 'Sign In to Artisan Studio',
      placeholder: 'Enter artisan mobile (e.g. 98765 43210)',
      themeColor: '#EA580C',
      themeLightBg: '#FFF7ED',
      icon: '🎨',
    },
    FACILITATOR: {
      title: 'Helper / Sahyogi Desk',
      tagline: 'Village Cluster Operations',
      badge: 'Field Ops & Cluster Lead',
      phone: '9822399887',
      name: 'Pooja Verma',
      location: 'Pune Cluster, MH • Field Lead',
      idCode: 'CLUST-PUN-08',
      demoLabel: '1-Tap Sign In as Pooja Verma (Sahyogi) →',
      submitLabel: 'Sign In to Sahyogi Desk',
      placeholder: 'Enter sahyogi mobile (e.g. 98223 99887)',
      themeColor: '#16A34A',
      themeLightBg: '#F0FDF4',
      icon: '🤝',
    },
    ADMIN_STAFF: {
      title: 'Platform Operations',
      tagline: 'Compliance & Escrow Oversight',
      badge: 'Platform Admin',
      phone: '9800011223',
      name: 'Vikram Mehta',
      location: 'National Hub • Operations',
      idCode: 'ADM-NAT-01',
      demoLabel: '1-Tap Sign In as Admin →',
      submitLabel: 'Sign In to Operations Desk',
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

      // Assign role-specific distinct credentials & profile
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
        <View style={styles.modernCard}>
          {/* Top Brand Header */}
          <View style={styles.brandSection}>
            <View style={styles.logoBadgeContainer}>
              <View style={styles.logoBadge}>
                <Image
                  source={require('../../../assets/karigarx_logo.png')}
                  style={styles.logoImg}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text variant="headlineMedium" weight="bold" color="#0F172A" style={styles.brandTitle}>
              KarigarX
            </Text>

            <View style={styles.mottoPill}>
              <Text variant="caption" weight="bold" color="#EA580C" style={styles.mottoText}>
                ✨ CRAFT • CONNECT • GROW ✨
              </Text>
            </View>

            <Text variant="bodySmall" color="#64748B" style={styles.brandSubtitle}>
              Empowering India's Heritage Master Artisans
            </Text>
          </View>

          {/* Role Segmented Pill Switcher */}
          <View style={styles.roleTabsWrapper}>
            {(['BUYER', 'ARTISAN', 'FACILITATOR'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              const meta = ROLE_DATA[r];
              return (
                <TouchableOpacity
                  key={r}
                  testID={`role-tab-${r}`}
                  style={[
                    styles.roleTabItem,
                    isSelected && {
                      backgroundColor: meta.themeColor,
                      shadowColor: meta.themeColor,
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
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

          {/* Quick Demo Login Card (Compact, Aesthetic, 1-Tap) */}
          <View
            style={[
              styles.quickDemoCard,
              {
                backgroundColor: roleInfo.themeLightBg,
                borderColor: `${roleInfo.themeColor}30`,
              },
            ]}
          >
            <View style={styles.demoCardHeader}>
              <View style={styles.demoAvatarCircle}>
                <Text style={{ fontSize: 18 }}>{roleInfo.icon}</Text>
              </View>
              <View style={styles.demoInfoBlock}>
                <View style={styles.demoRowAlign}>
                  <Text variant="bodySmall" weight="bold" color="#0F172A">
                    {roleInfo.name}
                  </Text>
                  <View
                    style={[
                      styles.demoBadge,
                      { backgroundColor: `${roleInfo.themeColor}18` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.demoBadgeText,
                        { color: roleInfo.themeColor },
                      ]}
                    >
                      {roleInfo.badge}
                    </Text>
                  </View>
                </View>
                <Text variant="caption" color="#64748B" numberOfLines={1}>
                  {roleInfo.location}
                </Text>
              </View>
            </View>

            {/* 1-Tap Button */}
            <TouchableOpacity
              testID="quick-demo-btn"
              style={[
                styles.quickDemoActionBtn,
                { backgroundColor: roleInfo.themeColor },
              ]}
              onPress={() => {
                setPhoneNumber(roleInfo.phone);
                handleLogin(roleInfo.phone, role);
              }}
              activeOpacity={0.88}
            >
              <Text variant="bodySmall" weight="bold" color="#FFFFFF">
                ⚡ {roleInfo.demoLabel}
              </Text>
            </TouchableOpacity>

            {/* Fast Demo Account Switcher Pills */}
            <View style={styles.personaSwitchRow}>
              <Text variant="caption" weight="medium" color="#64748B" style={{ fontSize: 11 }}>
                Quick switch:
              </Text>
              {(['BUYER', 'ARTISAN', 'FACILITATOR'] as UserRole[]).map((r) => {
                const isCurrent = role === r;
                const pMeta = ROLE_DATA[r];
                return (
                  <TouchableOpacity
                    key={`switch-${r}`}
                    onPress={() => {
                      setSelectedRole(r);
                      setPhoneNumber(pMeta.phone);
                      setErrorMessage(null);
                    }}
                    style={[
                      styles.personaSwitchChip,
                      isCurrent && {
                        borderColor: pMeta.themeColor,
                        backgroundColor: '#FFFFFF',
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 11, marginRight: 3 }}>{pMeta.icon}</Text>
                    <Text
                      variant="caption"
                      weight={isCurrent ? 'bold' : 'medium'}
                      color={isCurrent ? pMeta.themeColor : '#64748B'}
                      style={{ fontSize: 11 }}
                    >
                      {pMeta.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Divider: Or Sign in with Mobile */}
          <View style={styles.sectionDividerRow}>
            <View style={styles.dividerLine} />
            <Text variant="caption" weight="semiBold" color="#94A3B8" style={styles.dividerLabel}>
              OR ENTER MOBILE NUMBER
            </Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Modern Phone Input Capsule */}
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
              <Text style={{ fontSize: 16, marginRight: 5 }}>🇮🇳</Text>
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

          {/* Keypad & Helper Row */}
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
                Fill Demo ({roleInfo.phone})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            testID="login-submit-btn"
            style={[
              styles.primaryBtn,
              { backgroundColor: roleInfo.themeColor },
              (phoneNumber.length !== 10 || isLoading) && styles.primaryBtnDisabled,
            ]}
            onPress={() => handleLogin()}
            disabled={phoneNumber.length !== 10 || isLoading}
            activeOpacity={0.88}
          >
            <Text variant="bodyLarge" weight="bold" color="#FFFFFF">
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

          {/* Social Sign In */}
          <View style={styles.socialSection}>
            <View style={styles.socialDividerRow}>
              <View style={styles.dividerLine} />
              <Text variant="caption" weight="medium" color="#94A3B8" style={styles.socialDividerText}>
                or continue with
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialIconsRow}>
              <TouchableOpacity
                testID="social-login-google"
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => handleLogin(roleInfo.phone)}
              >
                <Image
                  source={require('../../../assets/google_logo.png')}
                  style={styles.socialImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                testID="social-login-apple"
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => handleLogin(roleInfo.phone)}
              >
                <Image
                  source={require('../../../assets/apple_logo.png')}
                  style={styles.socialImgApple}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                testID="social-login-facebook"
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => handleLogin(roleInfo.phone)}
              >
                <Image
                  source={require('../../../assets/facebook_logo.png')}
                  style={styles.socialImg}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Clean Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              testID="login-change-lang-btn"
              onPress={() => navigation.navigate('LanguageSelection')}
            >
              <Text variant="caption" weight="semiBold" color="#64748B">
                🌐 Change Language
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerDivider}>•</Text>
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
    backgroundColor: '#F8F6F0',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modernCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    // Soft elegant shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.07,
    shadowRadius: 32,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EDEAE2',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadgeContainer: {
    marginBottom: 8,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
    overflow: 'hidden',
    padding: 6,
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    letterSpacing: 0.5,
    fontSize: 24,
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
    letterSpacing: 1.4,
    fontSize: 9.5,
  },
  brandSubtitle: {
    letterSpacing: 0.2,
    fontSize: 12,
    textAlign: 'center',
  },
  roleTabsWrapper: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 14,
  },
  roleTabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  roleTabIcon: {
    fontSize: 14,
  },
  roleTabLabel: {
    fontSize: 12,
  },
  quickDemoCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 12,
    marginBottom: 14,
  },
  demoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginRight: 10,
  },
  demoInfoBlock: {
    flex: 1,
  },
  demoRowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  demoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quickDemoActionBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  personaSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personaSwitchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionDividerRow: {
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
  dividerLabel: {
    paddingHorizontal: 10,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  inputCapsuleError: {
    borderColor: '#EF4444',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    marginRight: 10,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    letterSpacing: 0.6,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
    marginLeft: 4,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  keypadToggleBtn: {
    paddingVertical: 2,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  primaryBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  keypadEmbed: {
    width: '100%',
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  socialSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  socialDividerText: {
    paddingHorizontal: 8,
    fontSize: 11,
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  socialBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  socialImg: {
    width: 20,
    height: 20,
  },
  socialImgApple: {
    width: 18,
    height: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerDivider: {
    color: '#CBD5E1',
    fontSize: 12,
  },
});
