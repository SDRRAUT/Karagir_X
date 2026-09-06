import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { voiceGuidance } from '@/utils/voiceGuidance';
import { UserRole } from '@/api/types';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { INDIC_DISPLAY_FONT } from '@/theme/typography';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

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
  cardGradientSelected: readonly [string, string, ...string[]];
  cardGradientUnselected: readonly [string, string, ...string[]];
  iconGradient: readonly [string, string, ...string[]];
  tagGradient: readonly [string, string, ...string[]];
  tagTextColor: string;
  borderSelected: string;
  borderUnselected: string;
  perkEn: string;
  perkHi: string;
  perkMr: string;
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
    cardGradientSelected: ['#FFFFFF', '#FFF7ED', '#FFEDD5'] as const,
    cardGradientUnselected: ['#FFFFFF', '#FAF9F8'] as const,
    iconGradient: ['#FF7A1A', '#EA580C', '#C2410C'] as const,
    tagGradient: ['#FFF7ED', '#FED7AA'] as const,
    tagTextColor: '#C2410C',
    borderSelected: '#EA580C',
    borderUnselected: '#E2E8F0',
    perkEn: '⚡ 0% Cut • GI Verified • Direct UPI',
    perkHi: '⚡ ०% कमीशन • जीआई प्रमाणित • सीधा UPI भुगतान',
    perkMr: '⚡ ०% कमिशन • जीआय प्रमाणित • थेट UPI पेमेंट',
    lightBg: '#FFF7ED',
    borderColor: '#FED7AA',
    ctaEn: 'Start as Artisan 🎨',
    ctaHi: 'कारीगर शुरू करें 🎨',
    ctaMr: 'कारागीर सुरू करा 🎨',
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
    themeColor: '#2563EB',
    cardGradientSelected: ['#FFFFFF', '#EFF6FF', '#DBEAFE'] as const,
    cardGradientUnselected: ['#FFFFFF', '#F8FAFC'] as const,
    iconGradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const,
    tagGradient: ['#EFF6FF', '#BFDBFE'] as const,
    tagTextColor: '#1D4ED8',
    borderSelected: '#2563EB',
    borderUnselected: '#E2E8F0',
    perkEn: '🏷️ 100% Authentic • Workshop Rates • India Post',
    perkHi: '🏷️ १००% असली • वर्कशॉप रेट • डाकघर डिलीवरी',
    perkMr: '🏷️ १००% अस्सल • स्टुडिओ दर • डाकघर डिलिव्हरी',
    lightBg: '#EEF2FF',
    borderColor: '#C7D2FE',
    ctaEn: 'Start as Buyer 🛍️',
    ctaHi: 'खरीदार शुरू करें 🛍️',
    ctaMr: 'खरेदीदार सुरू करा 🛍️',
  },
  {
    role: 'ADMIN',
    titleEn: 'Platform Admin & Ops',
    titleHi: 'एडमिन एवं संचालन',
    titleMr: 'अॅडमिन व ऑपरेशन्स',
    subtitleEn: 'Platform command center, artisan KYC, AI listing review & escrow settlement',
    subtitleHi: 'कमांड सेंटर, कारीगर सत्यापन, कैटलॉग मॉडरेशन एवं एस्क्रो निपटान',
    subtitleMr: 'कमांड सेंटर, कारागीर पडताळणी, कॅटलॉग पुनरावलोकन व एस्क्रो सेटलमेंट',
    tagEn: '🛡️ Operations Hub',
    tagHi: '🛡️ संचालन केंद्र',
    tagMr: '🛡️ ऑपरेशन्स हब',
    icon: '🛡️',
    themeColor: '#6366F1',
    cardGradientSelected: ['#FFFFFF', '#EEF2FF', '#E0E7FF'] as const,
    cardGradientUnselected: ['#FFFFFF', '#F8FAFC'] as const,
    iconGradient: ['#6366F1', '#4F46E5', '#4338CA'] as const,
    tagGradient: ['#EEF2FF', '#C7D2FE'] as const,
    tagTextColor: '#4338CA',
    borderSelected: '#6366F1',
    borderUnselected: '#E2E8F0',
    perkEn: '🛡️ Live Command • KYC Vetting • AI Moderation • Escrow',
    perkHi: '🛡️ लाइव कमांड • सत्यापन • कैटलॉग मॉडरेशन • एस्क्रो',
    perkMr: '🛡️ लाइव कमांड • पडताळणी • कॅटलॉग मॉडरेशन • एस्क्रो',
    lightBg: '#EEF2FF',
    borderColor: '#C7D2FE',
    ctaEn: 'Enter as Admin 🛡️',
    ctaHi: 'एडमिन शुरू करें 🛡️',
    ctaMr: 'अॅडमिन सुरू करा 🛡️',
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
  ],
  en_IN: [
    {
      title: 'Aapka Hunar, Ab Digital',
      description:
        'Just snap a photo of your craft and speak in your language. AI transforms it into a professional digital catalog.',
      microLine: '📸 Take Photo  •  🎙️ Speak  •  ✨ Catalog Ready',
      costChip: '₹650 Cost',
      fairPriceChip: '₹850 Fair Price',
      marginChip: '📈 Better Profit',
      productChip: 'Your Product',
      matchChip: '🤖 AI Match',
      buyerTags: ['🏨 Hotels', '🎁 Corporate', '🛍️ Retail', '🏛️ Govt. Buyers'],
      buttonLabel: 'Next →',
    },
    {
      title: 'Apne Hunar Ki Sahi Keemat Paaiye',
      description:
        'AI calculates fair pricing based on raw materials, hours worked and market demand — so you never sell at a loss.',
      powerLine: '“Not just selling, but selling at the right price.”',
      costChip: '₹650 Cost',
      fairPriceChip: '₹850 Fair Price',
      marginChip: '📈 Better Profit',
      buttonLabel: 'Next →',
    },
    {
      title: 'Ab Buyer Khud Aap Tak Pahunchega',
      description:
        'AI matches your crafts directly with genuine buyers who value authentic handmade art — from individuals to corporate gifters.',
      powerLine: '“You focus on creating. We handle the market reach.”',
      productChip: 'Your Craft',
      matchChip: '🤖 AI Match',
      buyerTags: ['🏨 Hotels', '🎁 Corporate', '🛍️ Retail', '🏛️ Govt. Buyers'],
      buttonLabel: 'Next →',
    },
  ],
  bn_IN: [
    {
      title: 'আপনার শিল্প, এবার ডিজিটাল',
      description:
        'শুধু পণ্যের ছবি তুলুন এবং নিজের ভাষায় বলুন। AI তৈরি করবে পেশাদার ডিজিটাল ক্যাটালগ।',
      microLine: '📸 ছবি তুলুন  •  🎙️ বলুন  •  ✨ ক্যাটালগ প্রস্তুত',
      buttonLabel: 'পরবর্তী →',
    },
    {
      title: 'আপনার শিল্পের সঠিক মূল্য পান',
      description:
        'AI কাঁচামাল এবং পরিশ্রমের সঠিক মূল্যায়ন করে ন্যায্য দাম নির্ধারণ করে যাতে কোনো ক্ষতি না হয়।',
      powerLine: '“শুধু বিক্রি নয়, উপযুক্ত মূল্যে বিক্রি।”',
      costChip: '₹650 খরচ',
      fairPriceChip: '₹850 ন্যায্য দাম',
      marginChip: '📈 বেশি লাভ',
      buttonLabel: 'পরবর্তী →',
    },
    {
      title: 'ক্রেতারা এবার সরাসরি আপনার কাছে আসবে',
      description:
        'AI আপনার পণ্যগুলোকে সরাসরি বড় হোটেল, কর্পোরেট এবং সংগ্রাহকদের সাথে সংযুক্ত করবে।',
      powerLine: '“আপনি তৈরি করুন। ক্রেতা পৌঁছে দেওয়ার দায়িত্ব আমাদের।”',
      productChip: 'আপনার পণ্য',
      matchChip: '🤖 AI সংযোগ',
      buyerTags: ['🏨 হোটেল', '🎁 কর্পোরেট', '🛍️ খুচরা', '🏛️ সরকারি ক্রেতা'],
      buttonLabel: 'পরবর্তী →',
    },
  ],
  ta_IN: [
    {
      title: 'உங்கள் கலை, இப்போது டிஜிட்டல்',
      description:
        'பொருளைப் புகைப்படம் எடுத்து உங்கள் மொழியில் பேசுங்கள். AI அழகான தொழில்முறை பட்டியலை உருவாக்கும்.',
      microLine: '📸 படம் எடு  •  🎙️ பேசு  •  ✨ பட்டியல் தயார்',
      buttonLabel: 'அடுத்து →',
    },
    {
      title: 'உங்கள் கலைக்கு நியாயமான விலை பெறுங்கள்',
      description:
        'AI மூலப்பொருள் மற்றும் உங்கள் உழைப்பைக் கணக்கிட்டு நியாயமான விலையைப் பெற்றுத் தரும்.',
      powerLine: '“விற்பது மட்டும் அல்ல, சரியான விலைக்கு விற்பது.”',
      costChip: '₹650 செலவு',
      fairPriceChip: '₹850 நியாய விலை',
      marginChip: '📈 அதிக லாபம்',
      buttonLabel: 'அடுத்து →',
    },
    {
      title: 'வாங்குபவர்கள் நேரடியாக உங்களை அடைவார்கள்',
      description:
        'AI உங்கள் கைவினைப்பொருட்களை நேரடியாக பெரிய வாடிக்கையாளர்களுடன் இணைக்கிறது.',
      powerLine: '“நீங்கள் உருவாக்குங்கள். சந்தையை நாங்கள் பார்த்துக் கொள்கிறோம்.”',
      productChip: 'உங்கள் பொருள்',
      matchChip: '🤖 AI பொருத்தம்',
      buyerTags: ['🏨 ஹோட்டல்', '🎁 கார்ப்பரேட்', '🛍️ சில்லறை', '🏛️ அரசு வாங்குபவர்'],
      buttonLabel: 'அடுத்து →',
    },
  ],
  te_IN: [
    {
      title: 'మీ కళ, ఇప్పుడు డిజిటల్',
      description:
        'వస్తువు ఫోటో తీసి మీ భాషలో మాట్లాడండి. AI అందమైన డిజిటల్ కేటలాగ్ తయారు చేస్తుంది.',
      microLine: '📸 ఫోటో తీయండి  •  🎙️ చెప్పండి  •  ✨ కేటలాగ్ సిద్ధం',
      buttonLabel: 'తరువాత →',
    },
    {
      title: 'మీ కళకు సరైన ధరను పొందండి',
      description:
        'AI ముడిసరుకు ఖర్చు మరియు మీ కష్టాన్ని బట్టి న్యాయమైన ధరను నిర్ణయిస్తుంది.',
      powerLine: '“అమ్మడమే కాదు, సరైన ధరకు అమ్మడం.”',
      costChip: '₹650 ఖర్చు',
      fairPriceChip: '₹850 సరైన ధర',
      marginChip: '📈 మంచి లాభం',
      buttonLabel: 'తరువాత →',
    },
    {
      title: 'కొనుగోలుదారులు నేరుగా మిమ్మల్ని చేరుకుంటారు',
      description:
        'AI మీ వస్తువులను పెద్ద కొనుగోలుదారులు, హోటళ్ళు మరియు కార్పొరేట్లతో కలుపుతుంది.',
      powerLine: '“మీరు తయారు చేయండి. మార్కెట్ బాధ్యత మాది.”',
      productChip: 'మీ వస్తువు',
      matchChip: '🤖 AI అనుసంధానం',
      buyerTags: ['🏨 హోటళ్ళు', '🎁 కార్పొరేట్', '🛍️ రిటైల్', '🏛️ ప్రభుత్వ కొనుగోలుదారులు'],
      buttonLabel: 'తరువాత →',
    },
  ],
  gu_IN: [
    {
      title: 'તમારી કલા, હવે ડિજિટલ',
      description:
        'બસ પ્રોડક્ટનો ફોટો લો અને તમારી ભાષામાં જણાવો. AI સરસ પ્રોફેશનલ કેટલોગ બનાવી આપશે.',
      microLine: '📸 ફોટો લો  •  🎙️ બોલો  •  ✨ કેટલોગ તૈયાર',
      buttonLabel: 'આગળ →',
    },
    {
      title: 'તમારી કળાની સાચી કિંમત મેળવો',
      description:
        'AI કાચા માલ અને મહેનતના આધારે વાજબી ભાવ નક્કી કરશે — જેથી તમારું નુકસાન ન થાય.',
      powerLine: '“માત્ર વેચવું નહીં, સાચા ભાવે વેચવું.”',
      costChip: '₹650 ખર્ચ',
      fairPriceChip: '₹850 વાજબી ભાવ',
      marginChip: '📈 સારો નફો',
      buttonLabel: 'આગળ →',
    },
    {
      title: 'ગ્રાહકો હવે સીધા તમારી પાસે આવશે',
      description:
        'AI તમારા ઉત્પાદનોને હોટેલ્સ અને મોટા કોર્પોરેટ ગ્રાહકો સાથે સીધા જોડશે.',
      powerLine: '“તમે માત્ર ઉત્પાદન બનાવો. માર્કેટ સુધી પહોંચ અમે સંભાળીશું.”',
      productChip: 'તમારું ઉત્પાદન',
      matchChip: '🤖 AI મેચ',
      buyerTags: ['🏨 હોટેલ', '🎁 કોર્પોરેટ', '🛍️ રિટેલ', '🏛️ સરકારી ગ્રાહક'],
      buttonLabel: 'આગળ →',
    },
  ],
  od_IN: [
    {
      title: 'ଆପଣଙ୍କ କଳା, ଏବେ ଡିଜିଟାଲ୍',
      description:
        'କେବଳ ଫଟୋ ଉଠାନ୍ତୁ ଏବଂ ନିଜ ଭାଷାରେ କୁହନ୍ତୁ। AI ବ୍ୟବସାୟିକ କାଟାଲଗ୍ ପ୍ରସ୍ତୁତ କରିବ।',
      microLine: '📸 ଫଟୋ ନିଅନ୍ତୁ  •  🎙️ କୁହନ୍ତୁ  •  ✨ କାଟାଲଗ୍ ପ୍ରସ୍ତୁତ',
      buttonLabel: 'ଆଗକୁ →',
    },
    {
      title: 'ଆପଣଙ୍କ କଳାର ଉଚିତ୍ ମୂଲ୍ୟ ପାଆନ୍ତୁ',
      description:
        'AI କଞ୍ଚାମାଲ ଓ ଆପଣଙ୍କ ପରିଶ୍ରମ ଅନୁସାରେ ଉଚିତ୍ ମୂଲ୍ୟ ସ୍ଥିର କରିବ ଯାହାଦ୍ୱାରା କ୍ଷତି ହେବ ନାହିଁ।',
      powerLine: '“କେବଳ ବିକ୍ରି ନୁହେଁ, ସଠିକ୍ ମୂଲ୍ୟରେ ବିକ୍ରି।”',
      costChip: '₹650 ଖର୍ଚ୍ଚ',
      fairPriceChip: '₹850 ଉଚିତ୍ ମୂଲ୍ୟ',
      marginChip: '📈 ଅଧିକ ଲାଭ',
      buttonLabel: 'ଆଗକୁ →',
    },
    {
      title: 'ଗ୍ରାହକମାନେ ଏବେ ସିଧା ଆପଣଙ୍କ ପାଖରେ ପହଞ୍ଚିବେ',
      description:
        'AI ଆପଣଙ୍କ ସାମଗ୍ରୀକୁ ବଡ଼ କ୍ରେତା, ହୋଟେଲ ଓ କର୍ପୋରେଟ୍ ଗ୍ରାହକଙ୍କ ସହ ସିଧାସଳଖ ଯୋଡ଼ିବ।',
      powerLine: '“ଆପଣ କେବଳ ତିଆରି କରନ୍ତୁ। ବଜାର ଆମେ ସମ୍ଭାଳିବୁ।”',
      productChip: 'ଆପଣଙ୍କ ସାମଗ୍ରୀ',
      matchChip: '🤖 AI ସଂଯୋଗ',
      buyerTags: ['🏨 ହୋଟେଲ', '🎁 କର୍ପୋରେଟ୍', '🛍️ ଖୁଚୁରା', '🏛️ ସରକାରୀ କ୍ରେତା'],
      buttonLabel: 'ଆଗକୁ →',
    },
  ],
};

const ROLE_TRANSLATIONS: Record<
  SupportedLocale,
  Partial<
    Record<
      UserRole,
      { title: string; subtitle: string; cta: string }
    >
  >
> = {
  hi_IN: {
    ARTISAN: {
      title: 'कारीगर / दस्तकार',
      subtitle: 'फोटो खींचकर AI कैटलॉग बनाएं, सही दाम और सीधे ग्राहक पाएं',
      cta: 'कारीगर शुरू करें 🎨',
    },
    BUYER: {
      title: 'खरीदार / ग्राहक',
      subtitle: 'असली प्रमाणित जीआई हस्तशिल्प सीधे कारीगरों से खरीदें',
      cta: 'खरीदार शुरू करें 🛍️',
    },
    ADMIN: {
      title: 'एडमिन एवं संचालन',
      subtitle: 'कमांड सेंटर, कारीगर सत्यापन, कैटलॉग मॉडरेशन एवं एस्क्रो निपटान',
      cta: 'एडमिन शुरू करें 🛡️',
    },
  },
  mr_IN: {
    ARTISAN: {
      title: 'कारागीर / हस्तकलाकार',
      subtitle: 'फोटो काढून AI कॅटलॉग बनवा, योग्य भाव आणि थेट ग्राहक मिळवा',
      cta: 'कारागीर सुरू करा 🎨',
    },
    BUYER: {
      title: 'खरेदीदार / ग्राहक',
      subtitle: 'प्रमाणित जीआय हस्तकला थेट कारागिरांकडून खरेदी करा',
      cta: 'खरेदीदार सुरू करा 🛍️',
    },
    ADMIN: {
      title: 'अॅडमिन व ऑपरेशन्स',
      subtitle: 'कमांड सेंटर, कारागीर पडताळणी, कॅटलॉग पुनरावलोकन व एस्क्रो सेटलमेंट',
      cta: 'अॅडमिन सुरू करा 🛡️',
    },
  },
  bn_IN: {
    ARTISAN: {
      title: 'কারিগর / শিল্পী',
      subtitle: 'ছবি তুলে AI ক্যাটালগ তৈরি করুন এবং সরাসরি ক্রেতা পান',
      cta: 'কারিগর শুরু করুন 🎨',
    },
    BUYER: {
      title: 'ক্রেতা / সংগ্রাহক',
      subtitle: 'আসল হস্তশিল্প সরাসরি কারিগরদের কাছ থেকে কিনুন',
      cta: 'ক্রেতা শুরু করুন 🛍️',
    },
    ADMIN: {
      title: 'অ্যাডমিন ও পরিচালনা',
      subtitle: 'প্ল্যাটফর্ম কমান্ড সেন্টার, কারিগর যাচাই ও এসক্রো নিষ্পত্তি',
      cta: 'অ্যাডমিন শুরু করুন 🛡️',
    },
  },
  ta_IN: {
    ARTISAN: {
      title: 'கைவினைஞர் / கலைஞர்',
      subtitle: 'AI பட்டியல் உருவாக்கி இடைத்தரகர் இல்லாமல் வாங்குபவர்களை அடையுங்கள்',
      cta: 'கைவினைஞர் தொடங்கு 🎨',
    },
    BUYER: {
      title: 'வாங்குபவர் / சேகரிப்பாளர்',
      subtitle: 'உண்மையான கைவினைப் பொருட்களை நேரடியாகப் பெறுங்கள்',
      cta: 'வாங்குபவர் தொடங்கு 🛍️',
    },
    ADMIN: {
      title: 'நிர்வாகம் மற்றும் செயல்பாடுகள்',
      subtitle: 'கட்டளை மையம், சரிபார்ப்பு மற்றும் எஸ்க்ரோ தீர்வு',
      cta: 'நிர்வாகம் தொடங்கு 🛡️',
    },
  },
  te_IN: {
    ARTISAN: {
      title: 'చేతివృత్తిదారుడు / కళాకారుడు',
      subtitle: 'AI కేటలాగ్‌తో నేరుగా కొనుగోలుదారులను చేరుకోండి',
      cta: 'కళాకారుడు ప్రారంభించు 🎨',
    },
    BUYER: {
      title: 'కొనుగోలుదారు / వినియోగదారు',
      subtitle: 'అసలైన కళాఖండాలను నేరుగా కొనుగోలు చేయండి',
      cta: 'కొనుగోలుదారుడు ప్రారంభించు 🛍️',
    },
    ADMIN: {
      title: 'అడ్మిన్ మరియు ఆపరేషన్స్',
      subtitle: 'కమాండ్ సెంటర్, కళాకారుల పరిశీలన మరియు ఎస్క్రో సెటిల్మెంట్',
      cta: 'అడ్మిన్ ప్రారంభించు 🛡️',
    },
  },
  gu_IN: {
    ARTISAN: {
      title: 'કારીગર / હસ્તકલાકાર',
      subtitle: 'AI કેટલોગ બનાવો અને યોગ્ય કિંમતે સીધા ગ્રાહકો મેળવો',
      cta: 'કારીગર શરૂ કરો 🎨',
    },
    BUYER: {
      title: 'ગ્રાહક / ખરીદનાર',
      subtitle: 'અસલી હસ્તકલા સીધી કારીગરો પાસેથી ખરીદો',
      cta: 'ગ્રાહક શરૂ કરો 🛍️',
    },
    ADMIN: {
      title: 'એડમિન અને સંચાલન',
      subtitle: 'કમાન્ડ સેન્ટર, કારીગર ચકાસણી અને એસ્ક્રો સેટલમેન્ટ',
      cta: 'એડમિન શરૂ કરો 🛡️',
    },
  },
  od_IN: {
    ARTISAN: {
      title: 'କାରିଗର / ଶିଳ୍ପୀ',
      subtitle: 'ଫଟୋ ଉଠାଇ AI କାଟାଲଗ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ ଏବଂ ସଠିକ୍ ମୂଲ୍ୟ ପାଆନ୍ତୁ',
      cta: 'କାରିଗର ଆରମ୍ଭ କରନ୍ତୁ 🎨',
    },
    BUYER: {
      title: 'କ୍ରେତା / ଗ୍ରାହକ',
      subtitle: 'ଅସଲି ହସ୍ତଶିଳ୍ପ ସିଧାସଳଖ କାରିଗରଙ୍କଠାରୁ କିଣନ୍ତୁ',
      cta: 'କ୍ରେତା ଆରମ୍ଭ କରନ୍ତୁ 🛍️',
    },
    ADMIN: {
      title: 'ଆଡମିନ ଓ ପରିଚାଳନା',
      subtitle: 'କମାଣ୍ଡ ସେଣ୍ଟର, କାରିଗର ଯାଞ୍ଚ ଏବଂ ଏସ୍କ୍ରୋ ସମାଧାନ',
      cta: 'ଆଡମିନ ଆରମ୍ଭ କରନ୍ତୁ 🛡️',
    },
  },
  en_IN: {
    ARTISAN: {
      title: 'Artisan / Maker',
      subtitle: 'Sell handmade crafts with AI catalog, fair pricing & 0% commission',
      cta: 'Start as Artisan 🎨',
    },
    BUYER: {
      title: 'Buyer / Collector',
      subtitle: 'Discover verified GI-tagged crafts, retail & bulk direct from makers',
      cta: 'Start as Buyer 🛍️',
    },
    ADMIN: {
      title: 'Platform Admin & Ops',
      subtitle: 'Platform command center, artisan KYC, AI listing review & escrow settlement',
      cta: 'Enter as Admin 🛡️',
    },
  },
};

const BACK_BUTTON_TEXT: Record<SupportedLocale, string> = {
  hi_IN: '← पीछे',
  mr_IN: '← मागे',
  bn_IN: '← পিছনে',
  ta_IN: '← பின்',
  te_IN: '← వెనుకకు',
  gu_IN: '← પાછા',
  od_IN: '← ପଛକୁ',
  en_IN: '← Back',
};

const LISTENING_TEXT: Record<SupportedLocale, string> = {
  hi_IN: '🎧 ऑडियो चल रहा है...',
  mr_IN: '🎧 ऑडिओ सुरू आहे...',
  bn_IN: '🎧 অডিও চলছে...',
  ta_IN: '🎧 ஆடியோ ஒலிக்கிறது...',
  te_IN: '🎧 ఆడియో ప్లే అవుతోంది...',
  gu_IN: '🎧 ઑડિયો ચાલી રહ્યો છે...',
  od_IN: '🎧 ଅଡିଓ ଚାଲିଛି...',
  en_IN: '🎧 Playing audio guide...',
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const { locale, setLocale } = useAppStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioRemainingSec, setAudioRemainingSec] = useState<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;

  // Wave animation for audio indicator
  const waveAnim1 = useRef(new Animated.Value(1)).current;
  const waveAnim2 = useRef(new Animated.Value(1)).current;
  const waveAnim3 = useRef(new Animated.Value(1)).current;
  const waveLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Audio files indexed by slide number (slide 0 = screen 1, slide 1 = screen 2, slide 2 = screen 3)
  const SLIDE_AUDIO: Record<number, any> = {
    0: require('../../../assets/audio/1.mp3'),
    1: require('../../../assets/audio/2_screen2.mp3'),
    2: require('../../../assets/audio/3.mp3'),
  };

  const startWaveAnimation = useCallback(() => {
    const useNative = Platform.OS !== 'web';
    const makeWave = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.8,
            duration: 280,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useNative,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration: 280,
            easing: Easing.in(Easing.quad),
            useNativeDriver: useNative,
          }),
        ])
      );
    waveLoopRef.current = Animated.parallel([
      makeWave(waveAnim1, 0),
      makeWave(waveAnim2, 120),
      makeWave(waveAnim3, 240),
    ]);
    waveLoopRef.current.start();
  }, [waveAnim1, waveAnim2, waveAnim3]);

  const stopWaveAnimation = useCallback(() => {
    waveLoopRef.current?.stop();
    waveAnim1.setValue(1);
    waveAnim2.setValue(1);
    waveAnim3.setValue(1);
  }, [waveAnim1, waveAnim2, waveAnim3]);

  const gestureCleanupRef = useRef<(() => void) | null>(null);

  const cleanupGestureListener = useCallback(() => {
    if (gestureCleanupRef.current) {
      gestureCleanupRef.current();
      gestureCleanupRef.current = null;
    }
  }, []);

  const stopCurrentAudio = useCallback(async () => {
    cleanupGestureListener();
    setIsAudioPlaying(false);
    setAudioRemainingSec(null);
    stopWaveAnimation();
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
    }
  }, [cleanupGestureListener, stopWaveAnimation]);

  const playSlideAudio = useCallback(async (slideIndex: number) => {
    await stopCurrentAudio();
    const audioAsset = SLIDE_AUDIO[slideIndex];
    if (!audioAsset) return; // Slide 3 has no audio

    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      }
      // Load without auto-playing first so createAsync never rejects due to browser autoplay policy
      const { sound } = await Audio.Sound.createAsync(
        audioAsset,
        { shouldPlay: false, volume: 1.0 }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((s) => {
        if (!s.isLoaded) {
          setIsAudioPlaying(false);
          setAudioRemainingSec(null);
          stopWaveAnimation();
          soundRef.current = null;
          return;
        }
        if (s.durationMillis && s.positionMillis != null) {
          const remainingMs = Math.max(0, s.durationMillis - s.positionMillis);
          const remSec = Math.ceil(remainingMs / 1000);
          setAudioRemainingSec(remSec > 0 ? remSec : null);
        }
        if (s.isPlaying) {
          setIsAudioPlaying(true);
          startWaveAnimation();
        }
        if (s.didJustFinish) {
          setIsAudioPlaying(false);
          setAudioRemainingSec(null);
          stopWaveAnimation();
          sound.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
      });

      // Try playing
      try {
        const playResult = await sound.playAsync();
        if ((playResult as any)?.isPlaying) {
          setIsAudioPlaying(true);
          startWaveAnimation();
        }
      } catch (_autoplayErr) {
        // Autoplay blocked by browser policy without user gesture on web.
        // Listen for first user click / touch / key anywhere on the screen:
        setIsAudioPlaying(false);
        stopWaveAnimation();

        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const onFirstGesture = async () => {
            cleanupGestureListener();
            if (soundRef.current === sound) {
              try {
                const res = await sound.playAsync();
                if ((res as any)?.isPlaying) {
                  setIsAudioPlaying(true);
                  startWaveAnimation();
                }
              } catch (_) {}
            }
          };
          window.addEventListener('pointerdown', onFirstGesture, { once: true });
          window.addEventListener('keydown', onFirstGesture, { once: true });
          gestureCleanupRef.current = () => {
            window.removeEventListener('pointerdown', onFirstGesture);
            window.removeEventListener('keydown', onFirstGesture);
          };
        }
      }
    } catch (_err) {
      setIsAudioPlaying(false);
      stopWaveAnimation();
    }
  }, [cleanupGestureListener, startWaveAnimation, stopCurrentAudio, stopWaveAnimation]);

  const handleToggleAudio = useCallback(async () => {
    if (isAudioPlaying) {
      if (soundRef.current) {
        try {
          await soundRef.current.pauseAsync();
        } catch (_) {}
      }
      setIsAudioPlaying(false);
      stopWaveAnimation();
    } else {
      cleanupGestureListener();
      if (soundRef.current) {
        try {
          await soundRef.current.playAsync();
          setIsAudioPlaying(true);
          startWaveAnimation();
          return;
        } catch (_) {}
      }
      playSlideAudio(currentSlide);
    }
  }, [cleanupGestureListener, currentSlide, isAudioPlaying, playSlideAudio, startWaveAnimation, stopWaveAnimation]);


  // Play audio when slide mounts
  useEffect(() => {
    playSlideAudio(currentSlide);
    return () => {
      stopCurrentAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      navigation.navigate('RoleSelection');
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

  const isIndicLocale = locale !== 'en_IN';

  const finalButtonLabel = buttonLabel;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: slide.bgColor }]}>
      {/* Top App Header Row */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          {/* Clean Brand Typography */}
          <Text style={[styles.brandWordmark, { color: slide.titleColor }]}>
            Kalakar <Text style={{ color: '#EA580C' }}>Setu</Text>
          </Text>
        </View>

        {/* Right Header: Speaker Option + Language Dropdown */}
        <View style={styles.headerRight}>
          {/* Speaker Button beside language selector */}
          <TouchableOpacity
            testID="onboarding-audio-btn"
            onPress={handleToggleAudio}
            style={[
              styles.headerAudioBtn,
              isAudioPlaying ? styles.headerAudioPlaying : styles.headerAudioInactive,
              { borderColor: isAudioPlaying ? '#EA580C' : slide.indicatorInactive },
            ]}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={isAudioPlaying ? 'Pause audio guidance' : 'Play audio guidance'}
          >
            <Text style={styles.headerSpeakerEmoji}>{isAudioPlaying ? '🔊' : '🔈'}</Text>
            {isAudioPlaying && (
              <View style={styles.headerWaveMini}>
                {([waveAnim1, waveAnim2, waveAnim3] as Animated.Value[]).map((anim, i) => (
                  <Animated.View
                    key={i}
                    style={[styles.headerWaveBarMini, { transform: [{ scaleY: anim }] }]}
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* Language Dropdown Trigger */}
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
          {/* Top Artwork / Logo Section */}
          {slide.badgeType === 'role' ? (
            <Animated.View
              style={[
                styles.roleLogoHeroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideTranslateY }],
                },
              ]}
            >
              <Image
                source={require('../../../assets/kalakar_setu_logo.png')}
                style={styles.roleHeroLogo}
                resizeMode="contain"
              />
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

            {/* Subtext Description */}
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
                  {BACK_BUTTON_TEXT[locale] || '← Back'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              testID="onboarding-next-btn"
              onPress={handleNext}
              style={[
                styles.nextBtn,
                currentSlide === 0 && styles.nextBtnFull,
                { backgroundColor: slide.btnBg },
              ]}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={finalButtonLabel}
            >
              <View style={styles.nextBtnContentRow}>
                <Text
                  variant="bodyLarge"
                  weight="bold"
                  color={slide.btnTextColor}
                  style={[styles.nextBtnText, isIndicLocale && styles.btnTextIndic]}
                >
                  {finalButtonLabel}
                </Text>

                {/* Small audio ending timer badge */}
                {isAudioPlaying && audioRemainingSec != null && (
                  <View style={styles.smallAudioTimerBadge}>
                    <Text style={styles.smallAudioTimerIcon}>🎧</Text>
                    <Text style={styles.smallAudioTimerText}>{audioRemainingSec}s</Text>
                  </View>
                )}
              </View>
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: 4,
  },
  headerAudioPlaying: {
    backgroundColor: '#FFF7ED',
  },
  headerAudioInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
  },
  headerSpeakerEmoji: {
    fontSize: 14,
  },
  headerWaveMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 12,
  },
  headerWaveBarMini: {
    width: 2,
    height: 10,
    borderRadius: 1,
    backgroundColor: '#EA580C',
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
  roleLogoHeroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 8,
    width: '100%',
  },
  roleHeroLogo: {
    width: 300,
    height: 150,
    maxWidth: '92%',
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
  nextBtnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  smallAudioTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.28)',
  },
  smallAudioTimerIcon: {
    fontSize: 11,
  },
  smallAudioTimerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#EA580C',
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
  // Minimalist Role Card Styles
  minimalRoleCardsContainer: {
    width: '100%',
    maxWidth: 420,
    marginTop: 10,
    marginBottom: 6,
    gap: 10,
  },
  minimalRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 13,
  },
  minimalRoleCardSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  minimalRoleCardUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  minimalRoleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  minimalRoleIcon: {
    fontSize: 20,
  },
  minimalRoleTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  minimalRoleTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  roleTitleIndic: {
    fontFamily: INDIC_DISPLAY_FONT,
    fontSize: 16.5,
    lineHeight: 21,
  },
  minimalRoleSub: {
    fontSize: 12.5,
    lineHeight: 17,
    letterSpacing: 0,
  },
  roleSubIndic: {
    fontSize: 12,
    lineHeight: 17,
  },
  minimalRadioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minimalRadioCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  nextBtnRoleSlide: {
    paddingVertical: 0,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  nextBtnRoleGradient: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
});
