import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';
import { voiceGuidance } from '@/utils/voiceGuidance';
import { UserRole } from '@/api/types';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { INDIC_DISPLAY_FONT } from '@/theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface SlideData {
  id: number;
  image?: any;
  bgColor: string;
  isDark: boolean;
  title: string;
  description: string;
  microLine?: string;
  powerLine?: string;
  badgeType: 'micro' | 'pricing' | 'buyer' | 'role';
  voiceHi: string;
  buttonLabel: string;
  titleColor: string;
  descColor: string;
  indicatorActive: string;
  indicatorInactive: string;
  btnBg: string;
  btnTextColor: string;
  voiceBg: string;
  voiceBorder: string;
  voiceText: string;
}

export interface OnboardingRoleOption {
  role: UserRole;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  subtitleEn: string;
  subtitleHi: string;
  subtitleMr: string;
  tagEn: string;
  tagHi: string;
  tagMr: string;
  icon: string;
  themeColor: string;
  lightBg: string;
  borderColor: string;
  ctaEn: string;
  ctaHi: string;
  ctaMr: string;
}

export const ONBOARDING_ROLES: OnboardingRoleOption[] = [
  {
    role: 'ARTISAN',
    titleEn: 'Artisan / Maker',
    titleHi: 'कारीगर / दस्तकार',
    titleMr: 'कारागीर / हस्तकलाकार',
    subtitleEn: 'Sell handmade crafts with AI catalog, fair pricing & 0% commission',
    subtitleHi: 'फोटो खींचकर AI कैटलॉग बनाएं, सही दाम और सीधे ग्राहक पाएं',
    subtitleMr: 'फोटो काढून AI कॅटलॉग बनवा, योग्य भाव आणि थेट ग्राहक मिळवा',
    tagEn: '✨ 0% Commission',
    tagHi: '✨ ०% कमीशन',
    tagMr: '✨ ०% कमिशन',
    icon: '🎨',
    themeColor: '#EA580C',
    lightBg: '#FFF7ED',
    borderColor: '#FED7AA',
    ctaEn: 'Artisan Safar Shuru Karein 🎨',
    ctaHi: 'कारीगर के रूप में जुड़ें 🎨',
    ctaMr: 'कारागीर म्हणून सुरू करा 🎨',
  },
  {
    role: 'BUYER',
    titleEn: 'Buyer / Collector',
    titleHi: 'खरीदार / ग्राहक',
    titleMr: 'खरेदीदार / ग्राहक',
    subtitleEn: 'Discover verified GI-tagged crafts, retail & bulk direct from makers',
    subtitleHi: 'असली प्रमाणित जीआई हस्तशिल्प सीधे कारीगरों से खरीदें',
    subtitleMr: 'प्रमाणित जीआय हस्तकला थेट कारागिरांकडून खरेदी करा',
    tagEn: '🛍️ Retail & Bulk',
    tagHi: '🛍️ रीटेल व थोक',
    tagMr: '🛍️ किरकोळ व घाऊक',
    icon: '🛍️',
    themeColor: '#4338CA',
    lightBg: '#EEF2FF',
    borderColor: '#C7D2FE',
    ctaEn: 'Buyer Portal Me Jaayein 🛍️',
    ctaHi: 'खरीदार के रूप में जुड़ें 🛍️',
    ctaMr: 'खरेदीदार म्हणून सुरू करा 🛍️',
  },
  {
    role: 'FACILITATOR',
    titleEn: 'Sahyogi / SHG Lead',
    titleHi: 'सहयोगी / क्लस्टर मित्र',
    titleMr: 'सहयोगी / बचत गट प्रमुख',
    subtitleEn: 'Support artisan clusters, bulk orders, QC audits & digital onboarding',
    subtitleHi: 'कारीगर समूहों, बचत गट, पैकेजिंग और बड़े ऑर्डर में सहायता करें',
    subtitleMr: 'बचत गट, पॅकेजिंग आणि मोठ्या ऑर्डर्समध्ये कारागिरांना मदत करा',
    tagEn: '🤝 Cluster Support',
    tagHi: '🤝 क्लस्टर साथी',
    tagMr: '🤝 बचत गट साथी',
    icon: '🤝',
    themeColor: '#16A34A',
    lightBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    ctaEn: 'Sahyogi Desk Shuru Karein 🤝',
    ctaHi: 'सहयोगी के रूप में जुड़ें 🤝',
    ctaMr: 'सहयोगी म्हणून सुरू करा 🤝',
  },
];

const LANGUAGES: { code: SupportedLocale; label: string; subLabel: string }[] = [
  { code: 'hi_IN', label: 'हिंदी', subLabel: 'Hindi' },
  { code: 'mr_IN', label: 'मराठी', subLabel: 'Marathi' },
  { code: 'en_IN', label: 'English', subLabel: 'English' },
  { code: 'ta_IN', label: 'தமிழ்', subLabel: 'Tamil' },
  { code: 'bn_IN', label: 'বাংলা', subLabel: 'Bengali' },
  { code: 'gu_IN', label: 'ગુજરાતી', subLabel: 'Gujarati' },
  { code: 'te_IN', label: 'తెలుగు', subLabel: 'Telugu' },
  { code: 'od_IN', label: 'ଓଡ଼ିଆ', subLabel: 'Odia' },
];

const ONBOARDING_SLIDES: SlideData[] = [
  {
    id: 0,
    image: require('../../../assets/onboarding_camera.jpg'),
    bgColor: '#FCE7DF', // Warm Peach / Soft Terracotta
    isDark: false,
    title: 'Aapka Hunar, Ab Digital',
    description:
      'Bas product ki photo kheecho aur apni bhasha mein batao. AI usse professional catalogue mein badal dega.',
    microLine: '📸 Photo lo  •  🎙️ Bolo  •  ✨ Catalogue taiyaar',
    badgeType: 'micro',
    voiceHi:
      'बस अपने उत्पाद की फोटो खींचें और बोलकर बताएं। ऐप तुरंत प्रोफेशनल कैटलॉग तैयार कर देगा।',
    buttonLabel: 'Next →',
    titleColor: '#1F1A1C',
    descColor: '#5C504C',
    indicatorActive: '#1F1A1C',
    indicatorInactive: '#E8C7BD',
    btnBg: '#FFFFFF',
    btnTextColor: '#1F1A1C',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#E5C4B9',
    voiceText: '#7A321E',
  },
  {
    id: 1,
    image: require('../../../assets/onboarding_voice.jpg'),
    bgColor: '#E6F6ED', // Fresh Soft Mint / Sage Light
    isDark: false,
    title: 'Apne Hunar Ki Sahi Keemat Paaiye',
    description:
      'AI market demand, material cost aur aapki mehnat ko samajhkar fair price suggest karega — taaki aap apna product kam daam mein na bechein.',
    powerLine: '“Sirf bikna nahi, sahi daam par bikna.”',
    badgeType: 'pricing',
    voiceHi:
      'अपनी मेहनत और लागत का सही दाम पाएं, ताकि कोई बिचौलिया आपको कम दाम न दे सके।',
    buttonLabel: 'Next →',
    titleColor: '#0E2E1D',
    descColor: '#3B5746',
    indicatorActive: '#0E2E1D',
    indicatorInactive: '#BDDFCD',
    btnBg: '#FFFFFF',
    btnTextColor: '#0E2E1D',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#BDE2CE',
    voiceText: '#0D5432',
  },
  {
    id: 2,
    image: require('../../../assets/onboarding_escrow.jpg'),
    bgColor: '#FFF3DB', // Warm Golden Ivory / Sunshine Cream
    isDark: false,
    title: 'Ab Buyer Khud Aap Tak Pahunchega',
    description:
      'AI aapke products ko un buyers se match karega jo waqai aapka samaan kharidna chahte hain — chahe customer ho, business ho ya bulk buyer.',
    powerLine: '“Aap sirf product banaiye. Market tak pahunch hum sambhalenge.”',
    badgeType: 'buyer',
    voiceHi:
      'आप सिर्फ अपना हुनर दिखाइए, बड़े बायर्स और कॉर्पोरेट ग्राहकों तक पहुंच हम संभालेंगे।',
    buttonLabel: 'Next →',
    titleColor: '#2B1E0A',
    descColor: '#5E4B30',
    indicatorActive: '#2B1E0A',
    indicatorInactive: '#EED9B3',
    btnBg: '#FFFFFF',
    btnTextColor: '#2B1E0A',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#ECD2A4',
    voiceText: '#6D4408',
  },
  {
    id: 3,
    image: require('../../../assets/logo.png'),
    bgColor: '#FAF8F5', // Warm Clean Artisan Eggshell
    isDark: false,
    title: 'Apna Role Chunein',
    description:
      'Aapke chune hue role ke anusaar aapka profile aur specialized features set kiye jayenge.',
    badgeType: 'role',
    voiceHi:
      'आप खरीदार, कारीगर या सहयोगी में से अपनी भूमिका चुनें ताकि आपको सही सुविधाएं मिल सकें।',
    buttonLabel: 'Next →',
    titleColor: '#1A1817',
    descColor: '#544E49',
    indicatorActive: '#EA580C',
    indicatorInactive: '#E5DFD7',
    btnBg: '#FFFFFF',
    btnTextColor: '#1A1817',
    voiceBg: 'rgba(255, 255, 255, 0.85)',
    voiceBorder: '#E5DFD7',
    voiceText: '#C2410C',
  },
];

const LOCALIZED_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    microLine?: string;
    powerLine?: string;
    costChip?: string;
    fairPriceChip?: string;
    marginChip?: string;
    productChip?: string;
    matchChip?: string;
    buyerTags?: string[];
    buttonLabel?: string;
  }[]
> = {
  hi_IN: [
    {
      title: 'आपका हुनर, अब डिजिटल',
      description:
        'बस प्रोडक्ट की फोटो खींचो और अपनी भाषा में बताओ। AI उसे प्रोफेशनल कैटलॉग में बदल देगा।',
      microLine: '📸 फोटो लो  •  🎙️ बोलो  •  ✨ कैटलॉग तैयार',
      buttonLabel: 'आगे बढ़ें →',
    },
    {
      title: 'अपने हुनर की सही कीमत पाइए',
      description:
        'AI बाज़ार की मांग, लागत और आपकी मेहनत को समझकर सही दाम तय करेगा — ताकि आप कम दाम में न बेचें।',
      powerLine: '“सिर्फ बिकना नहीं, सही दाम पर बिकना।”',
      costChip: '₹650 लागत',
      fairPriceChip: '₹850 सही दाम',
      marginChip: '📈 बेहतर मुनाफा',
      buttonLabel: 'आगे बढ़ें →',
    },
    {
      title: 'अब खरीदार खुद आप तक पहुंचेगा',
      description:
        'AI आपके उत्पादों को उन खरीदारों से मिलाएगा जो वाकई आपका सामान खरीदना चाहते हैं — चाहे ग्राहक हो या बड़ा व्यापारी।',
      powerLine: '“आप सिर्फ प्रोडक्ट बनाइए। बाज़ार तक पहुंच हम संभालेंगे।”',
      productChip: 'आपका उत्पाद',
      matchChip: '🤖 AI मैच',
      buyerTags: ['🏨 होटल', '🎁 कॉर्पोरेट', '🛍️ रीटेल', '🏛️ सरकारी खरीदार'],
      buttonLabel: 'आगे बढ़ें →',
    },
    {
      title: 'आप किस रूप में जुड़ना चाहते हैं?',
      description:
        'अपनी भूमिका चुनें — हर किसी के लिए अलग डैशबोर्ड, प्रोफाइल और सुविधाएं हैं।',
      buttonLabel: 'आगे बढ़ें →',
    },
  ],
  mr_IN: [
    {
      title: 'तुमची कला, आता डिजिटल',
      description:
        'फक्त उत्पादनाचा फोटो काढा आणि आपल्या भाषेत सांगा. AI त्याचे व्यावसायिक कॅटलॉगमध्ये रूपांतर करेल.',
      microLine: '📸 फोटो काढा  •  🎙️ बोला  •  ✨ कॅटलॉग तयार',
      buttonLabel: 'पुढे →',
    },
    {
      title: 'आपल्या कलेची योग्य किंमत मिळवा',
      description:
        'AI बाजारातील मागणी, साहित्याचा खर्च आणि तुमची मेहनत लक्षात घेऊन योग्य किंमत सुचवेल — जेणेकरून तुमचे नुकसान होणार नाही.',
      powerLine: '“फक्त विकणे नाही, योग्य भावात विकणे.”',
      costChip: '₹650 खर्च',
      fairPriceChip: '₹850 योग्य भाव',
      marginChip: '📈 जास्त नफा',
      buttonLabel: 'पुढे →',
    },
    {
      title: 'आता ग्राहक थेट तुमच्यापर्यंत पोहोचेल',
      description:
        'AI तुमची उत्पादने अशा ग्राहकांशी जोडेल ज्यांना खरोखर तुमचे काम आवडते — मग तो वैयक्तिक ग्राहक असो किंवा मोठा व्यापारी.',
      powerLine: '“तुम्ही फक्त उत्पादन बनवा. बाजारपेठ आम्ही सांभाळू.”',
      productChip: 'तुमचे उत्पादन',
      matchChip: '🤖 AI मॅच',
      buyerTags: ['🏨 हॉटेल्स', '🎁 कॉर्पोरेट', '🛍️ रिटेल', '🏛️ सरकारी खरेदीदार'],
      buttonLabel: 'पुढे →',
    },
    {
      title: 'तुम्ही कोणत्या भूमिकेत सामील होऊ इच्छिता?',
      description:
        'आपली भूमिका निवडा — प्रत्येकासाठी स्वतंत्र प्रोफाइल, डॅशबोर्ड आणि विशेष सुविधा आहेत.',
      buttonLabel: 'पुढे →',
    },
  ],
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const { locale, setLocale } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ARTISAN');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;

  // Responsive artwork sizing adapted to screen height & width
  const isCompact = height < 740;
  const isTall = height >= 840;
  const imageSize = Math.min(
    Math.max(width * 0.65, 190),
    isCompact ? 200 : isTall ? 270 : 230
  );

  const changeSlide = (nextIndex: number) => {
    if (nextIndex === currentSlide) return;
    voiceGuidance.stopSpeaking();
    const isGoingBack = nextIndex < currentSlide;
    setCurrentSlide(nextIndex);
    fadeAnim.setValue(0.3);
    slideTranslateY.setValue(isGoingBack ? -8 : 8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start();
  };

  const handleNext = () => {
    voiceGuidance.stopSpeaking();
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      changeSlide(currentSlide + 1);
    } else {
      navigation.replace('AuthPhone', { role: selectedRole });
    }
  };

  const handlePrev = () => {
    voiceGuidance.stopSpeaking();
    if (currentSlide > 0) {
      changeSlide(currentSlide - 1);
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const currentLangObj = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[2];
  const localized = LOCALIZED_CONTENT[locale]?.[currentSlide];

  const title = localized?.title || slide.title;
  const description = localized?.description || slide.description;
  const microLine = localized?.microLine || slide.microLine;
  const powerLine = localized?.powerLine || slide.powerLine;
  const buttonLabel = localized?.buttonLabel || slide.buttonLabel;
  const costChip = localized?.costChip || '₹650 Cost';
  const fairPriceChip = localized?.fairPriceChip || '₹850 Fair Price';
  const marginChip = localized?.marginChip || '📈 Better Margin';
  const productChip = localized?.productChip || 'Your Product';
  const matchChip = localized?.matchChip || '🤖 AI Match';
  const buyerTags = localized?.buyerTags || ['🏨 Hotel', '🎁 Corporate', '🛍️ Retail', '🏛️ Govt. Buyer'];

  const isIndicLocale = locale === 'hi_IN' || locale === 'mr_IN';

  const activeRoleOpt = ONBOARDING_ROLES.find((r) => r.role === selectedRole) || ONBOARDING_ROLES[0];
  const dynamicRoleButtonLabel =
    locale === 'hi_IN'
      ? activeRoleOpt.ctaHi
      : locale === 'mr_IN'
      ? activeRoleOpt.ctaMr
      : activeRoleOpt.ctaEn;

  const finalButtonLabel = currentSlide === 3 ? dynamicRoleButtonLabel : buttonLabel;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: slide.bgColor }]}>
      {/* Top App Header Row */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          {currentSlide > 0 && (
            <TouchableOpacity
              testID="onboarding-header-back-btn"
              onPress={handlePrev}
              style={styles.headerBackBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Previous slide"
            >
              <Text style={[styles.headerBackIcon, { color: slide.titleColor }]}>
                ‹
              </Text>
            </TouchableOpacity>
          )}

          {/* Clean Brand Typography */}
          <Text style={[styles.brandWordmark, { color: slide.titleColor }]}>
            Karagir<Text style={{ color: '#EA580C' }}>X</Text>
          </Text>
        </View>

        {/* Language Dropdown Trigger (Replaces Skip) */}
        <TouchableOpacity
          testID="language-dropdown-btn"
          onPress={() => setIsLangMenuOpen(true)}
          style={[
            styles.langDropdownTrigger,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              borderColor: slide.indicatorInactive,
            },
          ]}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Selected language: ${currentLangObj.label}. Tap to change language.`}
        >
          <Text style={styles.langGlobeIcon}>🌐</Text>
          <Text
            variant="caption"
            weight="bold"
            color={slide.titleColor}
            style={styles.langTriggerLabel}
          >
            {currentLangObj.label}
          </Text>
          <Text style={[styles.langTriggerChevron, { color: slide.titleColor }]}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal Dropdown */}
      <Modal
        visible={isLangMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLangMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsLangMenuOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.langModalCard}>
            <View style={styles.langModalHeader}>
              <View>
                <Text variant="bodyLarge" weight="bold" color="#0F172A">
                  भाषा चुनें / Select Language
                </Text>
                <Text variant="caption" color="#64748B" style={styles.langModalSub}>
                  Apni pasandeeda bhasha chunein
                </Text>
              </View>
              <TouchableOpacity
                testID="modal-close-btn"
                onPress={() => setIsLangMenuOpen(false)}
                style={styles.modalCloseBtn}
                accessibilityRole="button"
                accessibilityLabel="Close language selector"
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.langListGrid}>
              {LANGUAGES.map((lang) => {
                const isSelected = locale === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    testID={`lang-option-${lang.code}`}
                    onPress={() => {
                      setLocale(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    style={[
                      styles.langOptionItem,
                      isSelected && styles.langOptionSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.langOptionTextCol}>
                      <Text
                        variant="bodyMedium"
                        weight={isSelected ? 'bold' : 'medium'}
                        color={isSelected ? '#EA580C' : '#1E293B'}
                      >
                        {lang.label}
                      </Text>
                      <Text variant="caption" color={isSelected ? '#C2410C' : '#94A3B8'}>
                        {lang.subLabel}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Main Responsive Body (Centered in Middle) */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainWrapper}>
          {/* Animated Illustration or Role Header */}
          {slide.badgeType === 'role' ? (
            <Animated.View
              style={[
                styles.roleHeaderSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideTranslateY }],
                },
              ]}
            >
              <View style={styles.roleHeaderBadge}>
                <Image
                  source={require('../../../assets/logo.png')}
                  style={styles.roleHeaderLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.roleSubBadgePill}>
                <Text style={styles.roleSubBadgeText}>
                  {locale === 'hi_IN'
                    ? '✨ अपनी पहचान चुनें'
                    : locale === 'mr_IN'
                    ? '✨ आपली ओळख निवडा'
                    : '✨ CHOOSE YOUR JOURNEY ✨'}
                </Text>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.artworkSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideTranslateY }],
                },
              ]}
            >
              <View
                style={[
                  styles.imageShadowBox,
                  {
                    width: imageSize,
                    height: imageSize,
                  },
                ]}
              >
                <Image
                  source={slide.image}
                  style={styles.illustrationImage}
                  resizeMode="cover"
                />
              </View>
            </Animated.View>
          )}

          {/* Details & Features Section (Clean Center-Aligned) */}
          <Animated.View
            style={[
              styles.detailsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideTranslateY }],
              },
            ]}
          >
            {/* Capsule + Dots Progress Indicator */}
            <View style={styles.indicatorRow}>
              {ONBOARDING_SLIDES.map((item, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => changeSlide(idx)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Go to slide ${idx + 1}`}
                    style={styles.indicatorHit}
                  >
                    <View
                      style={[
                        isActive ? styles.capsuleIndicator : styles.dotIndicator,
                        {
                          backgroundColor: isActive
                            ? slide.indicatorActive
                            : slide.indicatorInactive,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bold Headline */}
            <Text
              variant="headlineLarge"
              weight="bold"
              color={slide.titleColor}
              style={[
                styles.headline,
                isCompact && styles.headlineCompact,
                isIndicLocale && styles.headlineIndic,
              ]}
            >
              {title}
            </Text>

            {/* Micro-line / Power Line Badge */}
            {slide.badgeType === 'micro' && (
              <View
                style={[
                  styles.featureBadge,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    borderColor: slide.indicatorInactive,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  weight="bold"
                  color={slide.titleColor}
                  style={[styles.badgeText, isIndicLocale && styles.badgeTextIndic]}
                >
                  {microLine}
                </Text>
              </View>
            )}

            {slide.badgeType === 'pricing' && (
              <View
                style={[
                  styles.powerCard,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: slide.indicatorInactive,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  weight="bold"
                  color={slide.titleColor}
                  style={[styles.powerQuoteText, isIndicLocale && styles.powerQuoteIndic]}
                >
                  {powerLine}
                </Text>
                <View style={styles.metricRow}>
                  <Text style={[styles.metricChip, { color: '#64748B' }, isIndicLocale && styles.metricChipIndic]}>{costChip}</Text>
                  <Text style={styles.metricArrow}>→</Text>
                  <Text style={[styles.metricChip, { color: '#059669', fontWeight: '700' }, isIndicLocale && styles.metricChipIndic]}>{fairPriceChip}</Text>
                  <Text style={styles.metricArrow}>→</Text>
                  <Text style={[styles.metricChip, { color: '#0284C7', fontWeight: '700' }, isIndicLocale && styles.metricChipIndic]}>{marginChip}</Text>
                </View>
              </View>
            )}

            {slide.badgeType === 'buyer' && (
              <View
                style={[
                  styles.powerCard,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: slide.indicatorInactive,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  weight="bold"
                  color={slide.titleColor}
                  style={[styles.powerQuoteText, isIndicLocale && styles.powerQuoteIndic]}
                >
                  {powerLine}
                </Text>
                <View style={styles.buyerFlowRow}>
                  <Text style={[styles.buyerFlowSource, isIndicLocale && styles.buyerFlowIndic]}>{productChip}</Text>
                  <Text style={styles.buyerFlowArrow}>→</Text>
                  <Text style={[styles.buyerFlowAi, isIndicLocale && styles.buyerFlowIndic]}>{matchChip}</Text>
                  <Text style={styles.buyerFlowArrow}>→</Text>
                </View>
                <View style={styles.buyerRow}>
                  {buyerTags.map((tag, tIdx) => (
                    <Text key={tIdx} style={[styles.buyerTag, isIndicLocale && styles.buyerTagIndic]}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {/* Slide 3: Buyer | Artisan | Sahyogi Role Selection Cards */}
            {slide.badgeType === 'role' && (
              <View style={styles.roleCardsContainer}>
                {ONBOARDING_ROLES.map((roleOpt) => {
                  const isSelected = selectedRole === roleOpt.role;
                  const roleTitle =
                    locale === 'hi_IN'
                      ? roleOpt.titleHi
                      : locale === 'mr_IN'
                      ? roleOpt.titleMr
                      : roleOpt.titleEn;
                  const roleSubtitle =
                    locale === 'hi_IN'
                      ? roleOpt.subtitleHi
                      : locale === 'mr_IN'
                      ? roleOpt.subtitleMr
                      : roleOpt.subtitleEn;
                  const roleTag =
                    locale === 'hi_IN'
                      ? roleOpt.tagHi
                      : locale === 'mr_IN'
                      ? roleOpt.tagMr
                      : roleOpt.tagEn;

                  return (
                    <TouchableOpacity
                      key={roleOpt.role}
                      testID={`role-card-${roleOpt.role}`}
                      onPress={() => setSelectedRole(roleOpt.role)}
                      activeOpacity={0.82}
                      accessibilityRole="button"
                      accessibilityLabel={`${roleTitle}, ${isSelected ? 'Selected' : 'Not selected'}`}
                      style={[
                        styles.roleCard,
                        isSelected && {
                          borderColor: roleOpt.themeColor,
                          backgroundColor: roleOpt.lightBg,
                          borderWidth: 2,
                          shadowColor: roleOpt.themeColor,
                          shadowOpacity: 0.16,
                          shadowRadius: 10,
                          elevation: 4,
                        },
                      ]}
                    >
                      {/* Icon Circle */}
                      <View
                        style={[
                          styles.roleIconCircle,
                          {
                            backgroundColor: isSelected ? roleOpt.themeColor : '#F1F5F9',
                          },
                        ]}
                      >
                        <Text style={styles.roleIconEmoji}>{roleOpt.icon}</Text>
                      </View>

                      {/* Text Column */}
                      <View style={styles.roleTextCol}>
                        <View style={styles.roleTitleRow}>
                          <Text
                            variant="bodyLarge"
                            weight="bold"
                            color={isSelected ? roleOpt.themeColor : '#1E293B'}
                            style={[styles.roleCardTitle, isIndicLocale && styles.roleTitleIndic]}
                          >
                            {roleTitle}
                          </Text>
                          <View
                            style={[
                              styles.roleTagPill,
                              {
                                backgroundColor: isSelected
                                  ? 'rgba(255, 255, 255, 0.95)'
                                  : '#F8FAFC',
                                borderColor: isSelected ? roleOpt.borderColor : '#E2E8F0',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleTagText,
                                { color: isSelected ? roleOpt.themeColor : '#64748B' },
                                isIndicLocale && styles.roleTagIndic,
                              ]}
                            >
                              {roleTag}
                            </Text>
                          </View>
                        </View>
                        <Text
                          variant="caption"
                          color={isSelected ? '#334155' : '#64748B'}
                          style={[styles.roleCardSub, isIndicLocale && styles.roleSubIndic]}
                          numberOfLines={2}
                        >
                          {roleSubtitle}
                        </Text>
                      </View>

                      {/* Radio Circle */}
                      <View
                        style={[
                          styles.roleRadioCircle,
                          isSelected && {
                            backgroundColor: roleOpt.themeColor,
                            borderColor: roleOpt.themeColor,
                          },
                        ]}
                      >
                        {isSelected && <Text style={styles.roleCheckmark}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Hindi Voice Guidance Button */}
            <View style={styles.voiceWrapper}>
              <VoiceCueButton
                textHi={slide.voiceHi}
                label="Listen in Hindi"
                size="small"
                testID={`voice-cue-slide-${currentSlide}`}
              />
            </View>

            {/* Subtext Description (1 short empathetic sentence) */}
            <Text
              variant="bodyMedium"
              color={slide.descColor}
              style={[
                styles.descriptionText,
                isCompact && styles.descriptionCompact,
                isIndicLocale && styles.descriptionIndic,
              ]}
            >
              {description}
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Action Navigation: Dedicated Back and Next Buttons */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomNavRow}>
            {currentSlide > 0 && (
              <TouchableOpacity
                testID="onboarding-prev-btn"
                onPress={handlePrev}
                style={[
                  styles.backBtn,
                  {
                    borderColor: slide.indicatorInactive,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  },
                ]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Go to previous slide"
              >
                <Text
                  variant="bodyLarge"
                  weight="bold"
                  color={slide.titleColor}
                  style={[styles.backBtnText, isIndicLocale && styles.btnTextIndic]}
                >
                  {isIndicLocale ? '← पीछे' : '← Back'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              testID="onboarding-next-btn"
              onPress={handleNext}
              style={[
                styles.nextBtn,
                currentSlide === 0 && styles.nextBtnFull,
                currentSlide === 3 && {
                  backgroundColor: activeRoleOpt.themeColor,
                  borderColor: activeRoleOpt.themeColor,
                  shadowColor: activeRoleOpt.themeColor,
                  shadowOpacity: 0.32,
                  shadowOffset: { width: 0, height: 6 },
                  shadowRadius: 14,
                  elevation: 6,
                },
              ]}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={finalButtonLabel}
            >
              <Text
                variant="bodyLarge"
                weight="bold"
                color={currentSlide === 3 ? '#FFFFFF' : slide.btnTextColor}
                style={[styles.nextBtnText, isIndicLocale && styles.btnTextIndic]}
              >
                {finalButtonLabel}
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
    width: '100%',
    height: '100%',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 14 : 8,
    paddingBottom: 4,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBackBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  headerBackIcon: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    marginTop: -2,
    marginLeft: -2,
  },
  brandWordmark: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  langDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  langGlobeIcon: {
    fontSize: 13,
  },
  langTriggerLabel: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  langTriggerChevron: {
    fontSize: 11,
    marginTop: -1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  langModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 12,
  },
  langModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  langModalSub: {
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  langListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langOptionItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langOptionSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#EA580C',
  },
  langOptionTextCol: {
    flex: 1,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 16,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  artworkSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  imageShadowBox: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 6,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 12,
  },
  indicatorHit: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  capsuleIndicator: {
    width: 30,
    height: 6.5,
    borderRadius: 3.5,
  },
  dotIndicator: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5,
  },
  headline: {
    fontSize: 25,
    lineHeight: 32,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  headlineCompact: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 6,
  },
  featureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  powerCard: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  powerQuoteText: {
    fontSize: 12,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricChip: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
  metricArrow: {
    color: '#94A3B8',
    fontSize: 10,
  },
  buyerFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 5,
  },
  buyerFlowSource: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  buyerFlowArrow: {
    fontSize: 10,
    color: '#94A3B8',
  },
  buyerFlowAi: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  buyerTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  voiceWrapper: {
    marginBottom: 10,
    alignSelf: 'center',
  },
  descriptionText: {
    fontSize: 13.5,
    lineHeight: 21,
    letterSpacing: -0.1,
    textAlign: 'center',
    paddingHorizontal: 8,
    maxWidth: 360,
  },
  descriptionCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 440,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backBtnText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  nextBtnFull: {
    flex: 1,
    width: '100%',
  },
  nextBtnText: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
  headlineIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 27,
    lineHeight: 35,
    letterSpacing: 0,
  },
  powerQuoteIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 14.5,
    lineHeight: 20,
    letterSpacing: 0,
  },
  badgeTextIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 13,
    letterSpacing: 0,
  },
  descriptionIndic: {
    lineHeight: 23,
    letterSpacing: 0,
  },
  metricChipIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 12,
  },
  buyerFlowIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 12,
  },
  buyerTagIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 11.5,
  },
  btnTextIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 17,
  },
  roleHeaderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  roleHeaderBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    marginBottom: 6,
  },
  roleHeaderLogo: {
    width: 42,
    height: 42,
  },
  roleSubBadgePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(234, 88, 12, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(234, 88, 12, 0.25)',
  },
  roleSubBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#EA580C',
  },
  roleCardsContainer: {
    width: '100%',
    maxWidth: 380,
    gap: 9,
    marginBottom: 10,
    marginTop: 2,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#334155',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  roleIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconEmoji: {
    fontSize: 20,
  },
  roleTextCol: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  roleCardTitle: {
    fontSize: 14.5,
    letterSpacing: -0.2,
  },
  roleTitleIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 16,
    lineHeight: 20,
  },
  roleTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleTagIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 11,
  },
  roleCardSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  roleSubIndic: {
    fontSize: 11,
    lineHeight: 16,
  },
  roleRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  roleCheckmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
