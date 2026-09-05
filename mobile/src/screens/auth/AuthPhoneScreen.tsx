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
    desc: string;
    badge: string;
    phone: string;
    name: string;
    location: string;
    idCode: string;
    demoLabel: string;
    submitLabel: string;
    placeholder: string;
    features: string[];
  }

  const ROLE_DATA: Record<UserRole, RoleMeta> = {
    BUYER: {
      title: 'Buyer & Corporate Portal',
      tagline: 'Authentic GI Crafts & Bulk Gifting',
      desc: 'Browse certified GI heritage crafts, Diwali festive deals, artisan provenance passports, and place corporate wholesale RFQs.',
      badge: 'Retail & Corporate Wholesale',
      phone: '9810012345',
      name: 'Priya Sharma',
      location: 'Delhi NCR • Verified Buyer',
      idCode: 'BUY-DEL-9021',
      demoLabel: '🛍️ 1-Tap Login as Buyer (98100 12345) →',
      submitLabel: 'Sign In to Buyer Portal 🛍️',
      placeholder: 'Buyer Mobile (e.g. 98100 12345)',
      features: ['✨ Diwali Craft Utsav Deals', '🏷️ GI Provenance Passports', '🏢 Corporate Bulk RFQ'],
    },
    ARTISAN: {
      title: 'Master Artisan & Seller Studio',
      tagline: 'Craft Production Cockpit & AI Tools',
      desc: 'Manage your workshop, create listings with 📸 AI Smart Catalogue (photo + voice), and get 95% fair price payouts.',
      badge: 'Master Artisan • 0% Commission',
      phone: '9876543210',
      name: 'Ramesh Kumbhar',
      location: 'Kolhapur, MH • Master Potter',
      idCode: 'GI-MH-2024-402',
      demoLabel: '🎨 1-Tap Login as Master Artisan (98765 43210) →',
      submitLabel: 'Sign In to Artisan Studio 🎨',
      placeholder: 'Artisan Mobile (e.g. 98765 43210)',
      features: ['📸 AI Smart Catalogue', '🤖 Voice Saathi AI Interview', '💰 95% Direct Fair Share'],
    },
    FACILITATOR: {
      title: 'Helper / Sahyogi Field Desk',
      tagline: 'Village Cluster Operations Desk',
      desc: 'Field desk for cluster facilitators: monitor 5,000-unit cluster quotas, perform SOS quota reallocation, and inspect QC specs.',
      badge: 'Cluster Facilitator Lead',
      phone: '9822399887',
      name: 'Pooja Verma',
      location: 'Pune Cluster, MH • Field Lead',
      idCode: 'CLUST-PUN-08',
      demoLabel: '🤝 1-Tap Login as Cluster Sahyogi (98223 99887) →',
      submitLabel: 'Sign In to Sahyogi Field Desk 🤝',
      placeholder: 'Sahyogi Mobile (e.g. 98223 99887)',
      features: ['📦 5,000-Unit Cluster Quota', '🚨 SOS Quota Reallocation', '🔍 QC Spec Audit'],
    },
    ADMIN_STAFF: {
      title: 'Platform Operations Desk',
      tagline: 'Compliance & Escrow Oversight',
      desc: 'Cluster verification, escrow settlement ledger, and GI compliance oversight.',
      badge: 'Platform Admin',
      phone: '9800011223',
      name: 'Vikram Mehta',
      location: 'National Hub • Operations Admin',
      idCode: 'ADM-NAT-01',
      demoLabel: '🛡️ 1-Tap Login as Admin (98000 11223) →',
      submitLabel: 'Sign In to Operations Desk 🛡️',
      placeholder: 'Admin Mobile (e.g. 98000 11223)',
      features: ['Escrow Ledger', 'Artisan Verification', 'Dispute Resolution'],
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
        {/* Centered Modern Artisan Card */}
        <View style={styles.cardContainer}>
          {/* Top Emblem Card */}
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
            <Text variant="headlineLarge" weight="bold" color="#0F172A" style={styles.titleText}>
              Kalakar Setu
            </Text>
            <View style={styles.festivePill}>
              <Text style={{ fontSize: 11, marginRight: 4 }}>✨</Text>
              <Text variant="caption" weight="bold" color="#EA580C">
                100% DIRECT FROM MASTER ARTISANS
              </Text>
            </View>
            <Text variant="bodyMedium" weight="medium" color="#EA580C" style={styles.taglineText}>
              CRAFT • CONNECT • GROW
            </Text>
            <Text variant="bodySmall" color="#64748B" style={styles.subtitleText}>
              Rural Artisans to Global Markets — Zero Commission Markup
            </Text>
          </View>

          {/* Role Segmented Pill Selector (English: Buyer, Seller, Helper/Sahyogi) */}
          <View style={styles.roleSegmentContainer}>
            {(['BUYER', 'ARTISAN', 'FACILITATOR'] as UserRole[]).map((r) => {
              const isSelected = role === r;
              const label =
                r === 'BUYER'
                  ? '🛍️ Buyer Login'
                  : r === 'ARTISAN'
                  ? '🎨 Seller Login'
                  : '🤝 Sahyogi Login';
              return (
                <TouchableOpacity
                  key={r}
                  testID={`role-tab-${r}`}
                  style={[
                    styles.roleSegmentItem,
                    isSelected && (
                      r === 'BUYER'
                        ? styles.roleSegmentItemActiveBuyer
                        : r === 'FACILITATOR'
                        ? styles.roleSegmentItemActiveSahyogi
                        : styles.roleSegmentItemActive
                    ),
                  ]}
                  onPress={() => {
                    setSelectedRole(r);
                    setErrorMessage(null);
                  }}
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

          {/* Selected Role Overview Feature Banner */}
          <View style={[
            styles.roleFeatureCard,
            role === 'BUYER' && styles.roleFeatureCardBuyer,
            role === 'FACILITATOR' && styles.roleFeatureCardSahyogi,
          ]}>
            <View style={styles.roleFeatureHeader}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {roleInfo.title}
              </Text>
              <View style={[
                styles.roleFeatureBadge,
                role === 'BUYER' && { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
                role === 'FACILITATOR' && { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
              ]}>
                <Text
                  variant="caption"
                  weight="bold"
                  color={role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C'}
                >
                  {roleInfo.badge}
                </Text>
              </View>
            </View>
            <Text variant="caption" color="#64748B" style={{ marginTop: 2, lineHeight: 16 }}>
              {roleInfo.desc}
            </Text>
            {/* Feature Pills */}
            <View style={styles.roleFeatureChipsRow}>
              {roleInfo.features.map((feat, i) => (
                <View key={i} style={styles.roleFeatureChip}>
                  <Text variant="caption" weight="medium" color="#334155">
                    {feat}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* 1-Tap Quick Demo Login for Current Role */}
          <TouchableOpacity
            testID="quick-demo-btn"
            style={[
              styles.quickDemoChip,
              role === 'BUYER' && { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
              role === 'FACILITATOR' && { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
            ]}
            onPress={() => {
              setPhoneNumber(roleInfo.phone);
              handleLogin(roleInfo.phone, role);
            }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 13, marginRight: 6 }}>⚡</Text>
            <Text
              variant="caption"
              weight="bold"
              color={role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C'}
            >
              {roleInfo.demoLabel}
            </Text>
          </TouchableOpacity>

          {/* 3 Distinct Verified Persona Accounts (Each with its Own Identity & Credentials) */}
          <View style={styles.personaAccountsContainer}>
            <Text variant="caption" weight="bold" color="#64748B" style={styles.personaAccountsHeader}>
              OR CHOOSE A DEDICATED ACCOUNT TO LOG IN:
            </Text>

            {/* Buyer Dedicated Account */}
            <TouchableOpacity
              style={[
                styles.accountOptionCard,
                role === 'BUYER' && styles.accountOptionCardActiveBuyer,
              ]}
              onPress={() => {
                setSelectedRole('BUYER');
                setPhoneNumber(ROLE_DATA.BUYER.phone);
                handleLogin(ROLE_DATA.BUYER.phone, 'BUYER');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.accountAvatarCircle, { backgroundColor: '#EEF2FF' }]}>
                <Text style={{ fontSize: 20 }}>🛍️</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="bodySmall" weight="bold" color="#1E1B4B">
                    {ROLE_DATA.BUYER.name}
                  </Text>
                  <Text variant="caption" weight="bold" color="#4338CA" style={styles.cardRolePill}>
                    BUYER PORTAL
                  </Text>
                </View>
                <Text variant="caption" color="#64748B">
                  {ROLE_DATA.BUYER.location}
                </Text>
                <Text variant="caption" weight="bold" color="#4338CA" style={{ marginTop: 2 }}>
                  📱 +91 98100 12345 • Log In as Buyer →
                </Text>
              </View>
            </TouchableOpacity>

            {/* Seller / Artisan Dedicated Account */}
            <TouchableOpacity
              style={[
                styles.accountOptionCard,
                role === 'ARTISAN' && styles.accountOptionCardActiveSeller,
              ]}
              onPress={() => {
                setSelectedRole('ARTISAN');
                setPhoneNumber(ROLE_DATA.ARTISAN.phone);
                handleLogin(ROLE_DATA.ARTISAN.phone, 'ARTISAN');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.accountAvatarCircle, { backgroundColor: '#FFF7ED' }]}>
                <Text style={{ fontSize: 20 }}>🎨</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="bodySmall" weight="bold" color="#7C2D12">
                    {ROLE_DATA.ARTISAN.name}
                  </Text>
                  <Text variant="caption" weight="bold" color="#EA580C" style={styles.cardRolePill}>
                    ARTISAN STUDIO
                  </Text>
                </View>
                <Text variant="caption" color="#64748B">
                  {ROLE_DATA.ARTISAN.location}
                </Text>
                <Text variant="caption" weight="bold" color="#EA580C" style={{ marginTop: 2 }}>
                  📱 +91 98765 43210 • Log In as Seller →
                </Text>
              </View>
            </TouchableOpacity>

            {/* Helper / Sahyogi Dedicated Account */}
            <TouchableOpacity
              style={[
                styles.accountOptionCard,
                role === 'FACILITATOR' && styles.accountOptionCardActiveSahyogi,
              ]}
              onPress={() => {
                setSelectedRole('FACILITATOR');
                setPhoneNumber(ROLE_DATA.FACILITATOR.phone);
                handleLogin(ROLE_DATA.FACILITATOR.phone, 'FACILITATOR');
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.accountAvatarCircle, { backgroundColor: '#F0FDF4' }]}>
                <Text style={{ fontSize: 20 }}>🤝</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="bodySmall" weight="bold" color="#14532D">
                    {ROLE_DATA.FACILITATOR.name}
                  </Text>
                  <Text variant="caption" weight="bold" color="#16A34A" style={styles.cardRolePill}>
                    SAHYOGI DESK
                  </Text>
                </View>
                <Text variant="caption" color="#64748B">
                  {ROLE_DATA.FACILITATOR.location}
                </Text>
                <Text variant="caption" weight="bold" color="#16A34A" style={{ marginTop: 2 }}>
                  📱 +91 98223 99887 • Log In as Sahyogi →
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Input Label & Capsule */}
          <Text variant="caption" weight="bold" color="#64748B" style={{ alignSelf: 'flex-start', marginBottom: 6 }}>
            OR ENTER ANY MOBILE NUMBER FOR {roleInfo.title.toUpperCase()}:
          </Text>

          <View
            style={[
              styles.inputCapsule,
              errorMessage ? styles.inputCapsuleError : null,
              phoneNumber.length === 10 && (
                role === 'BUYER'
                  ? styles.inputCapsuleValidBuyer
                  : role === 'FACILITATOR'
                  ? styles.inputCapsuleValidSahyogi
                  : styles.inputCapsuleValid
              ),
            ]}
          >
            <View style={styles.inputPrefix}>
              <Text style={{ fontSize: 15, marginRight: 6 }}>📱</Text>
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

          {/* Keypad / Help Helper Row */}
          <View style={styles.helperRow}>
            <TouchableOpacity
              onPress={() => setShowKeypad(!showKeypad)}
              style={styles.keypadToggleBtn}
            >
              {showKeypad ? (
                <Text variant="caption" weight="semiBold" color={role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C'}>
                  ⌨️ Hide Keypad
                </Text>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text variant="caption" weight="semiBold" color={role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C'}>
                    🔢 Keypad •{' '}
                  </Text>
                  <Text variant="caption" weight="semiBold" color={role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C'}>
                    🔢 कीपैड खोलें
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPhoneNumber(roleInfo.phone);
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
              styles.gradientButton,
              role === 'BUYER' && styles.gradientButtonBuyer,
              role === 'FACILITATOR' && styles.gradientButtonSahyogi,
              (phoneNumber.length !== 10 || isLoading) && styles.gradientButtonDisabled,
            ]}
            onPress={() => handleLogin()}
            disabled={phoneNumber.length !== 10 || isLoading}
            activeOpacity={0.88}
          >
            <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.buttonLabel}>
              {isLoading ? 'Signing In...' : `${roleInfo.submitLabel} →`}
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
              <Text variant="caption" weight="bold" color="#EA580C">
                🌐 Change Language
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity
              testID="login-intro-tour-btn"
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text variant="caption" weight="bold" color="#EA580C">
                ℹ️ App Tour
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
    backgroundColor: '#FFFDF7',
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
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 22,
    alignItems: 'center',
    // Soft elegant shadow matching mockup
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  emblemShadowWrapper: {
    marginBottom: 12,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  emblemCard: {
    width: 92,
    height: 92,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
    overflow: 'hidden',
    padding: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  titleText: {
    letterSpacing: 0.5,
    marginBottom: 4,
    fontSize: 26,
    color: '#0F172A',
  },
  festivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 6,
  },
  taglineText: {
    letterSpacing: 1.5,
    fontSize: 10.5,
    marginBottom: 3,
    color: '#EA580C',
    fontWeight: '700',
  },
  subtitleText: {
    letterSpacing: 0.1,
    fontSize: 12,
    textAlign: 'center',
  },
  roleSegmentContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 3,
    marginBottom: 12,
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
    backgroundColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  roleSegmentItemActiveBuyer: {
    backgroundColor: '#4338CA',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  roleSegmentItemActiveSahyogi: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  roleFeatureCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 10,
  },
  roleFeatureCardBuyer: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C7D2FE',
  },
  roleFeatureCardSahyogi: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  roleFeatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleFeatureBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  roleFeatureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  roleFeatureChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickDemoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  personaAccountsContainer: {
    width: '100%',
    marginBottom: 14,
  },
  personaAccountsHeader: {
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
    fontSize: 10.5,
  },
  accountOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 8,
  },
  accountOptionCardActiveBuyer: {
    borderColor: '#4338CA',
    backgroundColor: '#EEF2FF',
  },
  accountOptionCardActiveSeller: {
    borderColor: '#EA580C',
    backgroundColor: '#FFF7ED',
  },
  accountOptionCardActiveSahyogi: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  accountAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardRolePill: {
    fontSize: 9.5,
    letterSpacing: 0.5,
  },
  inputCapsuleValidBuyer: {
    borderColor: '#4338CA',
    backgroundColor: '#F5F3FF',
  },
  inputCapsuleValidSahyogi: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  gradientButtonBuyer: {
    backgroundColor: '#4338CA',
    shadowColor: '#4338CA',
  },
  gradientButtonSahyogi: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
  },
  inputCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 54,
    backgroundColor: '#F8FAFC',
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  inputCapsuleValid: {
    borderColor: '#EA580C',
    backgroundColor: '#FFFDF7',
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
    color: '#0F172A',
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
    marginBottom: 14,
    marginTop: 4,
  },
  keypadToggleBtn: {
    paddingVertical: 2,
  },
  gradientButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 16,
  },
  gradientButtonDisabled: {
    backgroundColor: '#FDBA74',
    shadowOpacity: 0.1,
  },
  buttonLabel: {
    letterSpacing: 0.5,
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
    paddingHorizontal: 12,
    fontSize: 11,
    letterSpacing: 1,
    color: '#94A3B8',
  },
  socialButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  socialCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  socialLogoImg: {
    width: 22,
    height: 22,
  },
  socialLogoImgApple: {
    width: 20,
    height: 22,
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
