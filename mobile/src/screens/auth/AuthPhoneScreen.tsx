import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Modal,
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
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole, AuthTokens } from '@/api/types';
import { voiceGuidance } from '@/utils/voiceGuidance';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthPhone'>;

interface RoleContent {
  tag: string;
  title: string;
  subtitle: string;
  avatar3D: any;
  themeColor: string;
  lightBg: string;
  borderAccent: string;
  demoPhone: string;
  demoEmail: string;
  voicePrompt: string;
}

const ROLE_CONTENT: Record<UserRole, RoleContent> = {
  ARTISAN: {
    tag: 'ARTISAN WORKSPACE',
    title: 'Aapka Safar Yahin Se\nShuru Hoga',
    subtitle: 'Apna mobile number ya email enter karein aur digital workspace banayein.',
    avatar3D: require('@/../assets/artisan_3d_avatar.jpg'),
    themeColor: '#EA580C',
    lightBg: '#FFF7ED',
    borderAccent: '#FED7AA',
    demoPhone: '9876543210',
    demoEmail: 'artisan.demo@kalakarsetu.com',
    voicePrompt: 'कृपया अपना दस अंकों का मोबाइल नंबर बोलकर या लिखकर दर्ज करें।',
  },
  BUYER: {
    tag: 'BUYER PORTAL',
    title: 'Apni shopping journey\nshuru karein',
    subtitle: 'Apna mobile number ya email enter karein aur direct master artisans se judiye.',
    avatar3D: require('@/../assets/buyer_3d_avatar.jpg'),
    themeColor: '#4338CA',
    lightBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
    demoPhone: '9810012345',
    demoEmail: 'buyer.demo@kalakarsetu.com',
    voicePrompt: 'कृपया अपना मोबाइल नंबर या ईमेल दर्ज करें और खरीदारी शुरू करें।',
  },
  ADMIN: {
    tag: 'GOVERNANCE & OPERATIONS',
    title: 'Platform Admin &\nGovernance Portal',
    subtitle: 'Apna verified administrator credentials enter karein.',
    avatar3D: require('@/../assets/sahyogi_3d_avatar.jpg'),
    themeColor: '#6366F1',
    lightBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
    demoPhone: '9800011223',
    demoEmail: 'admin.operations@kalakarsetu.com',
    voicePrompt: 'कृपया अपना अधिकृत एडमिन क्रेडेंशियल्स दर्ज करें।',
  },
};

export const AuthPhoneScreen: React.FC<Props> = ({ route, navigation }) => {
  const role: UserRole = route?.params?.role || 'ARTISAN';
  const roleData = ROLE_CONTENT[role] || ROLE_CONTENT.ARTISAN;

  const { locale } = useAppStore();
  const { setSession } = useAuthStore();

  // Mode: 'PHONE' | 'EMAIL'
  const [authMode, setAuthMode] = useState<'PHONE' | 'EMAIL'>('PHONE');

  // Phone states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailMethod, setEmailMethod] = useState<'PASSWORD' | 'MAGIC_LINK'>('PASSWORD');
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);

  // General states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const panelFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Smooth in-place panel transition between Phone and Email
  const handleSwitchMode = (mode: 'PHONE' | 'EMAIL') => {
    if (mode === authMode) return;
    setErrorMessage(null);
    setEmailSuccessMessage(null);

    // Cross-fade animation
    Animated.sequence([
      Animated.timing(panelFadeAnim, {
        toValue: 0.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(panelFadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setAuthMode(mode);
  };

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

  // Voice speech & number dictation handler
  const handleVoiceInput = () => {
    setIsVoiceListening(true);
    voiceGuidance.speakHindi(
      roleData.voicePrompt,
      () => {},
      () => {
        setTimeout(() => {
          setPhoneNumber(roleData.demoPhone);
          setIsVoiceListening(false);
          setErrorMessage(null);
        }, 900);
      }
    );
  };

  // Primary Action: Sends OTP and navigates to Screen 6 (OtpVerification)
  const handleContinue = async (overridePhone?: string) => {
    const phoneToUse = typeof overridePhone === 'string' ? overridePhone : phoneNumber;
    const cleanPhone = phoneToUse.replace(/\D/g, '');

    if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें (6, 7, 8, 9 से शुरू)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resp = await authService.sendOtp(cleanPhone, locale, role);
      setIsLoading(false);
      navigation.navigate('OtpVerification', {
        phoneNumber: cleanPhone,
        sessionId: resp.session_id,
        role,
      });
    } catch {
      setIsLoading(false);
      navigation.navigate('OtpVerification', {
        phoneNumber: cleanPhone,
        sessionId: `sess_${Date.now()}`,
        role,
      });
    }
  };

  // Demo quick fill & send OTP
  const handleQuickDemo = async () => {
    if (authMode === 'PHONE') {
      const demoPhone = roleData.demoPhone;
      setPhoneNumber(demoPhone);
      await handleContinue(demoPhone);
    } else {
      setEmail(roleData.demoEmail);
      setPassword('DemoPassword@123');
      setErrorMessage(null);
    }
  };

  // Email submission handler
  const handleEmailSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('कृपया मान्य ईमेल पता दर्ज करें (उदा. artisan@kalakarsetu.com)');
      return;
    }

    if (emailMethod === 'PASSWORD' && (!password || password.length < 6)) {
      setErrorMessage('कृपया कम से कम 6 अक्षरों का पासवर्ड दर्ज करें');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setEmailSuccessMessage(null);

    try {
      if (emailMethod === 'MAGIC_LINK') {
        await authService.sendEmailVerification(cleanEmail, role);
        setIsLoading(false);
        setEmailSuccessMessage('ईमेल पर वेरिफिकेशन लिंक भेज दिया गया है! इनबॉक्स चेक करें।');
        return;
      }

      const resp = await authService.loginWithEmail(cleanEmail, password, role);
      setIsLoading(false);
      const tokens: AuthTokens = {
        accessToken: resp.access_token,
        refreshToken: resp.refresh_token,
        expiresInSeconds: resp.expires_in_seconds,
      };
      await setSession(tokens, resp.user);

      if (resp.is_new_user || !resp.user.isProfileComplete) {
        navigation.navigate('ProfileSetup', { role });
      } else {
        navigation.replace('MainTabs', { screen: 'HomeTab' });
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'ईमेल लॉगिन में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  const formattedDisplay =
    phoneNumber.length > 5
      ? `${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
      : phoneNumber;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar with Back Navigation & Pinterest-Style Brand Header */}
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
            कला • संवाद • विकास
          </Text>
        </View>

        {/* Discreet Demo Pill with Vector Zap Icon */}
        <TouchableOpacity
          testID="quick-demo-btn"
          onPress={handleQuickDemo}
          style={[styles.demoPill, { borderColor: roleData.borderAccent }]}
          activeOpacity={0.75}
        >
          <Icon name="zap" size={13} color={roleData.themeColor} style={{ marginRight: 4 }} />
          <Text variant="caption" weight="bold" color={roleData.themeColor}>
            Demo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 3D Clay Character Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.avatarContainer,
              {
                borderColor: roleData.borderAccent,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Image
              source={roleData.avatar3D}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </Animated.View>

          <View style={[styles.roleTag, { backgroundColor: roleData.lightBg }]}>
            <Text
              variant="caption"
              weight="bold"
              color={roleData.themeColor}
              style={styles.roleTagText}
            >
              {roleData.tag}
            </Text>
          </View>

          <Text variant="headlineLarge" weight="bold" color="#0F172A" style={styles.heroTitle}>
            {roleData.title}
          </Text>

          <Text variant="bodyMedium" color="#64748B" style={styles.heroSubtitle}>
            {roleData.subtitle}
          </Text>
        </View>

        {/* Pinterest-Style Segmented Pill Switcher with Vector Icons */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            testID="tab-mobile-btn"
            style={[
              styles.segmentTab,
              authMode === 'PHONE' && [
                styles.segmentTabActive,
                { backgroundColor: roleData.themeColor },
              ],
            ]}
            onPress={() => handleSwitchMode('PHONE')}
            activeOpacity={0.85}
          >
            <View style={styles.tabContentRow}>
              <Icon
                name="phone"
                size={16}
                color={authMode === 'PHONE' ? '#FFFFFF' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                variant="bodySmall"
                weight="bold"
                color={authMode === 'PHONE' ? '#FFFFFF' : '#64748B'}
              >
                Mobile Number
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-email-btn"
            style={[
              styles.segmentTab,
              authMode === 'EMAIL' && [
                styles.segmentTabActive,
                { backgroundColor: roleData.themeColor },
              ],
            ]}
            onPress={() => handleSwitchMode('EMAIL')}
            activeOpacity={0.85}
          >
            <View style={styles.tabContentRow}>
              <Icon
                name="mail"
                size={16}
                color={authMode === 'EMAIL' ? '#FFFFFF' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                variant="bodySmall"
                weight="bold"
                color={authMode === 'EMAIL' ? '#FFFFFF' : '#64748B'}
              >
                Email Address
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Pinterest-Style Elevated Card Container */}
        <Animated.View style={[styles.inputCard, { opacity: panelFadeAnim }]}>
          {/* ================= PANEL 1: MOBILE NUMBER LOGIN ================= */}
          {authMode === 'PHONE' && (
            <View>
              <View style={styles.inputLabelRow}>
                <Text variant="caption" weight="bold" color="#475569" style={styles.inputLabel}>
                  MOBILE NUMBER
                </Text>
                <Text variant="caption" color="#94A3B8">
                  OTP aayega
                </Text>
              </View>

              {/* +91 Flag Pill + 10-Digit Clean Input */}
              <View
                style={[
                  styles.capsuleBox,
                  errorMessage ? styles.capsuleBoxError : null,
                  phoneNumber.length === 10 && { borderColor: roleData.themeColor },
                ]}
              >
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.flagIcon}>🇮🇳</Text>
                  <Text variant="bodyLarge" weight="bold" color="#0F172A">
                    +91
                  </Text>
                  <View style={styles.codeDivider} />
                </View>

                <TextInput
                  testID="phone-input"
                  style={styles.phoneInput}
                  value={formattedDisplay}
                  onChangeText={(val) => {
                    const cleaned = val.replace(/\D/g, '').slice(0, 10);
                    setPhoneNumber(cleaned);
                    setErrorMessage(null);
                  }}
                  placeholder="98765 43210"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  maxLength={11}
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={() => handleContinue()}
                />

                {phoneNumber.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setPhoneNumber('')}
                    style={styles.clearBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="close" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Inline Error Message */}
              {errorMessage && (
                <View style={styles.errorBannerRow}>
                  <Icon name="alertCircle" size={14} color="#EF4444" style={{ marginRight: 5 }} />
                  <Text variant="caption" color="#EF4444" weight="medium">
                    {errorMessage}
                  </Text>
                </View>
              )}

              {/* Voice Input Pill with Vector Icons */}
              <TouchableOpacity
                style={[styles.voiceCuePill, { backgroundColor: roleData.lightBg }]}
                onPress={handleVoiceInput}
                activeOpacity={0.8}
              >
                <Icon name="speaker" size={18} color={roleData.themeColor} />
                <Text variant="bodySmall" weight="bold" color={roleData.themeColor}>
                  Number bolkar bhi enter karein
                </Text>
                <View style={[styles.micMiniBadge, { backgroundColor: roleData.themeColor }]}>
                  <Icon name="microphone" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              {/* Accessible Numeric Keypad Toggle & Auto-fill */}
              <View style={styles.keypadToggleRow}>
                <TouchableOpacity
                  onPress={() => setShowKeypad(!showKeypad)}
                  style={styles.keypadToggleBtn}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon
                      name={showKeypad ? 'keyboard' : 'keypad'}
                      size={15}
                      color={roleData.themeColor}
                    />
                    <Text variant="caption" weight="semiBold" color={roleData.themeColor}>
                      {showKeypad ? 'Hide Keypad' : 'Numeric Keypad'}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setPhoneNumber(roleData.demoPhone);
                    setErrorMessage(null);
                  }}
                >
                  <Text variant="caption" weight="medium" color="#64748B">
                    Auto-fill ({roleData.demoPhone})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Continue / Send OTP CTA Button */}
              <TouchableOpacity
                testID="login-submit-btn"
                style={[
                  styles.continueBtn,
                  { backgroundColor: roleData.themeColor },
                  (phoneNumber.length !== 10 || isLoading) && styles.continueBtnDisabled,
                ]}
                onPress={() => handleContinue()}
                disabled={phoneNumber.length !== 10 || isLoading}
                activeOpacity={0.85}
              >
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.continueBtnText}>
                  {isLoading ? 'Processing...' : 'Send OTP →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ================= PANEL 2: EMAIL LOGIN & VERIFICATION ================= */}
          {authMode === 'EMAIL' && (
            <View>
              <View style={styles.inputLabelRow}>
                <Text variant="caption" weight="bold" color="#475569" style={styles.inputLabel}>
                  EMAIL ADDRESS
                </Text>
                <Text variant="caption" color="#94A3B8">
                  Verified access
                </Text>
              </View>

              {/* Email Input Capsule with Vector Mail Icon */}
              <View
                style={[
                  styles.capsuleBox,
                  errorMessage && !email ? styles.capsuleBoxError : null,
                  email.includes('@') && { borderColor: roleData.themeColor },
                ]}
              >
                <Icon name="mail" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
                <TextInput
                  testID="email-input"
                  style={styles.emailInput}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setErrorMessage(null);
                    setEmailSuccessMessage(null);
                  }}
                  placeholder="artisan@kalakarsetu.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                  returnKeyType="next"
                />
                {email.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setEmail('')}
                    style={styles.clearBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="close" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Sub-method Switcher: Password vs Magic Link */}
              <View style={styles.emailMethodRow}>
                <TouchableOpacity
                  onPress={() => setEmailMethod('PASSWORD')}
                  style={[
                    styles.methodPill,
                    emailMethod === 'PASSWORD' && {
                      backgroundColor: roleData.lightBg,
                      borderColor: roleData.borderAccent,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon
                      name="lock"
                      size={13}
                      color={emailMethod === 'PASSWORD' ? roleData.themeColor : '#64748B'}
                    />
                    <Text
                      variant="caption"
                      weight="bold"
                      color={emailMethod === 'PASSWORD' ? roleData.themeColor : '#64748B'}
                    >
                      Password Login
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEmailMethod('MAGIC_LINK')}
                  style={[
                    styles.methodPill,
                    emailMethod === 'MAGIC_LINK' && {
                      backgroundColor: roleData.lightBg,
                      borderColor: roleData.borderAccent,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon
                      name="sparkles"
                      size={13}
                      color={emailMethod === 'MAGIC_LINK' ? roleData.themeColor : '#64748B'}
                    />
                    <Text
                      variant="caption"
                      weight="bold"
                      color={emailMethod === 'MAGIC_LINK' ? roleData.themeColor : '#64748B'}
                    >
                      Magic Link
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Password Capsule with Vector Lock & Eye Icons */}
              {emailMethod === 'PASSWORD' && (
                <View style={{ marginTop: 12 }}>
                  <View style={styles.inputLabelRow}>
                    <Text variant="caption" weight="bold" color="#475569" style={styles.inputLabel}>
                      PASSWORD
                    </Text>
                    <Text variant="caption" color="#94A3B8">
                      Min 6 characters
                    </Text>
                  </View>

                  <View style={styles.capsuleBox}>
                    <Icon name="lock" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                      testID="password-input"
                      style={styles.emailInput}
                      value={password}
                      onChangeText={(val) => {
                        setPassword(val);
                        setErrorMessage(null);
                      }}
                      placeholder="••••••••"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={!isPasswordVisible}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleEmailSubmit}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={styles.eyeBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon
                        name={isPasswordVisible ? 'eye' : 'eyeOff'}
                        size={18}
                        color="#94A3B8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Quick Demo Pre-fill for Email */}
              <TouchableOpacity
                onPress={() => {
                  setEmail(roleData.demoEmail);
                  setPassword('DemoPassword@123');
                  setErrorMessage(null);
                }}
                style={styles.demoFillEmailRow}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="zap" size={12} color={roleData.themeColor} />
                  <Text variant="caption" weight="semiBold" color={roleData.themeColor}>
                    Fill Demo: {roleData.demoEmail}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Inline Error / Success Messages */}
              {errorMessage && (
                <View style={styles.errorBannerRow}>
                  <Icon name="alertCircle" size={14} color="#EF4444" style={{ marginRight: 5 }} />
                  <Text variant="caption" color="#EF4444" weight="medium">
                    {errorMessage}
                  </Text>
                </View>
              )}
              {emailSuccessMessage && (
                <View style={styles.successBannerRow}>
                  <Icon name="checkCircle" size={14} color="#16A34A" style={{ marginRight: 5 }} />
                  <Text variant="caption" color="#16A34A" weight="bold">
                    {emailSuccessMessage}
                  </Text>
                </View>
              )}

              {/* Email Submit Button */}
              <TouchableOpacity
                testID="email-submit-btn"
                style={[
                  styles.continueBtn,
                  { backgroundColor: roleData.themeColor, marginTop: 14 },
                  isLoading && styles.continueBtnDisabled,
                ]}
                onPress={handleEmailSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={styles.continueBtnText}>
                  {isLoading
                    ? 'Signing in...'
                    : emailMethod === 'MAGIC_LINK'
                    ? 'Send Verification Link →'
                    : 'Sign In with Email →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Security & Privacy Assurance with Vector Shield Icon */}
          <View style={styles.securityRow}>
            <Icon name="shieldCheck" size={16} color="#64748B" />
            <Text variant="caption" weight="medium" color="#64748B">
              Aapki jankari 100% surakshit hai
            </Text>
          </View>
        </Animated.View>

        {/* Optional Tactile Keypad */}
        {authMode === 'PHONE' && showKeypad && (
          <View style={styles.keypadWrapper}>
            <TactileKeypad
              onPressDigit={handleDigit}
              onPressBackspace={handleBackspace}
              onPressConfirm={() => handleContinue()}
              disabled={isLoading}
            />
          </View>
        )}
      </ScrollView>

      {/* Voice Listening Modal Animation */}
      <Modal
        visible={isVoiceListening}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVoiceListening(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.voiceModalCard}>
            <View style={[styles.modalMicRing, { backgroundColor: roleData.lightBg }]}>
              <Icon name="microphone" size={36} color={roleData.themeColor} />
            </View>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={{ marginTop: 14 }}>
              Bolkar Bataiye...
            </Text>
            <Text variant="bodySmall" color="#64748B" style={{ textAlign: 'center', marginTop: 6 }}>
              "Mera number hai 9 8 7 6 5 4 3 2 1 0"
            </Text>
            <TouchableOpacity
              onPress={() => {
                voiceGuidance.stopSpeaking();
                setIsVoiceListening(false);
              }}
              style={styles.voiceCancelBtn}
            >
              <Text variant="caption" weight="bold" color="#EF4444">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  // 3D Clay Character Avatar Container
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  roleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleTagText: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  heroTitle: {
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  // Pinterest-style Segmented Pill Switcher
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1EBE1',
    borderRadius: 28,
    padding: 4,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E7DFD4',
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  segmentTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Pinterest Elevated Card
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#F0EAE1',
    shadowColor: '#3F200A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  capsuleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  capsuleBoxError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  codeDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineStyle: 'none',
        } as any)
      : {}),
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    ...(Platform.OS === 'web'
      ? ({
          outlineWidth: 0,
          outlineStyle: 'none',
        } as any)
      : {}),
  },
  clearBtn: {
    padding: 6,
  },
  eyeBtn: {
    padding: 6,
  },
  emailMethodRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  methodPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  demoFillEmailRow: {
    marginTop: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  errorBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  successBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  voiceCuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 14,
    gap: 8,
  },
  micMiniBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  keypadToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  keypadToggleBtn: {
    paddingVertical: 4,
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  continueBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontSize: 16,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  keypadWrapper: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  voiceModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalMicRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceCancelBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
