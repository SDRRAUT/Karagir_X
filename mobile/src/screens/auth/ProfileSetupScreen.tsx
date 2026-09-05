import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { TextInput } from '@/components/inputs/TextInput';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/api/types';
import { VoiceCueButton } from '@/components/buttons/VoiceCueButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

interface CraftCategory {
  code: string;
  nameHi: string;
  nameEn: string;
  icon: string;
}

const CRAFTS: CraftCategory[] = [
  { code: 'TEXTILE_HANDLOOM', nameHi: 'हथकरघा एवं बुनाई', nameEn: 'Handloom & Weaving', icon: '🧵' },
  { code: 'POTTERY_TERRACOTTA', nameHi: 'मिट्टी एवं टेराकोटा', nameEn: 'Clay & Terracotta', icon: '🏺' },
  { code: 'PAINTING_FOLK', nameHi: 'पारंपरिक चित्रकला', nameEn: 'Folk Art (Madhubani)', icon: '🎨' },
  { code: 'WOODCRAFT', nameHi: 'काष्ठ शिल्प', nameEn: 'Woodcraft & Carving', icon: '🪵' },
  { code: 'METALLURGY_DHOKRA', nameHi: 'धातु शिल्प', nameEn: 'Metalcraft & Dhokra', icon: '💍' },
  { code: 'BAMBOO_CANE', nameHi: 'बांस एवं जूट', nameEn: 'Bamboo & Jute', icon: '🧺' },
];

interface OptionItem {
  code: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  desc?: string;
}

const BUYER_TYPES: OptionItem[] = [
  { code: 'COLLECTOR', nameEn: 'Individual Collector', nameHi: 'व्यक्तिगत खरीदार', icon: '🛍️', desc: 'Handcrafted authentic home & lifestyle' },
  { code: 'CORPORATE', nameEn: 'Corporate Gifting', nameHi: 'कॉर्पोरेट उपहार', icon: '🎁', desc: 'Custom festive hampers & client gifts' },
  { code: 'RETAIL', nameEn: 'Boutique / Store', nameHi: 'बुटीक व स्टोर', icon: '🏬', desc: 'Curated artisanal inventory for sale' },
  { code: 'INSTITUTIONAL', nameEn: 'Institutional / Export', nameHi: 'संस्थागत व निर्यात', icon: '🏛️', desc: 'Govt. & high-volume bulk orders' },
];

const SAHYOGI_TYPES: OptionItem[] = [
  { code: 'SHG', nameEn: 'Self-Help Group (SHG)', nameHi: 'महिला बचत गट', icon: '🤝', desc: 'Village micro-enterprise & women makers' },
  { code: 'NGO', nameEn: 'Craft Foundation / NGO', nameHi: 'हस्तशिल्प न्यास व एनजीओ', icon: '🏛️', desc: 'Cluster empowerment & social welfare' },
  { code: 'COOP', nameEn: 'Producer Cooperative', nameHi: 'उत्पादक सहकारी समिति', icon: '💼', desc: 'Artisan-owned collective enterprise' },
  { code: 'FIELD_LEAD', nameEn: 'Cluster Lead / Facilitator', nameHi: 'क्लस्टर लीड / मित्र', icon: '⚡', desc: 'Packaging, logistics & QC hub' },
];

interface ProfileRoleMeta {
  tag: string;
  headerTitle: string;
  headerSub: string;
  title: string;
  subtitle: string;
  voiceBanner: string;
  section1Name: string;
  section1Voice: string;
  section2Title: string;
  section2Voice: string;
  section3Title: string;
  section3Voice: string;
  locationBadge: string;
  section4Title: string;
  section4Voice: string;
  secondaryPlaceholder: string;
  btnLabel: string;
  trustBadge: string;
  themeColor: string;
  lightBg: string;
}

const ROLE_METAS: Record<UserRole, ProfileRoleMeta> = {
  ARTISAN: {
    tag: 'Artisan Account',
    headerTitle: 'Artisan Profile',
    headerSub: 'KALAKAR SETU',
    title: 'Set Up Your Artisan Profile',
    subtitle: 'Empower your craft with AI cataloguing and direct market linkages',
    voiceBanner: 'Speak to fill profile details automatically',
    section1Name: '1. Your Full Name',
    section1Voice: 'यहाँ अपना पूरा नाम लिखें, जैसा आपके आधार कार्ड या बैंक खाते में दर्ज है।',
    section2Title: '2. Primary Craft Specialization',
    section2Voice: 'आप जिस हस्तशिल्प या कला में काम करते हैं, उसे यहाँ चुनें।',
    section3Title: '3. Workshop Location',
    section3Voice: 'यह आपकी कार्यशाला या गाँव का स्थान है, जहाँ शिल्प का निर्माण होता है।',
    locationBadge: '✓ Linked to Authentic GI Tagged Cluster',
    section4Title: '4. SHG / Facilitator Code (Optional)',
    section4Voice: 'यदि आप किसी स्वयं सहायता समूह से जुड़े हैं, तो उनका कोड यहाँ दर्ज करें।',
    secondaryPlaceholder: 'e.g. SHG-KOLHAPUR-402 (if applicable)',
    btnLabel: 'Save & Complete Profile →',
    trustBadge: '100% ONDC Protocol Enabled • Certified GI Authenticity Guarantee',
    themeColor: '#EA580C',
    lightBg: '#FFF7ED',
  },
  BUYER: {
    tag: 'Buyer Account',
    headerTitle: 'Buyer Profile',
    headerSub: 'CUSTOMER SETU',
    title: 'Set Up Your Buyer Account',
    subtitle: 'Curate your preferences for certified handmade GI crafts & bulk orders',
    voiceBanner: 'Speak to set preferences & delivery city',
    section1Name: '1. Contact / Buyer Name',
    section1Voice: 'यहाँ अपना नाम या कंपनी का नाम दर्ज करें।',
    section2Title: '2. Buyer & Procurement Category',
    section2Voice: 'आप किस प्रकार की हस्तकला खरीद में रुचि रखते हैं, यहाँ चुनें।',
    section3Title: '3. Primary Delivery Location',
    section3Voice: 'यहाँ अपना मुख्य डिलीवरी शहर या केंद्र दर्ज करें।',
    locationBadge: '✓ Express Heritage Delivery & India Post Network',
    section4Title: '4. Business GSTIN / Org Name (Optional)',
    section4Voice: 'यदि आप व्यवसाय के नाम पर बिलिंग चाहते हैं तो विवरण दर्ज करें।',
    secondaryPlaceholder: 'e.g. 07AAAAA0000A1Z5 or Company Name',
    btnLabel: 'Save & Enter Marketplace →',
    trustBadge: '100% Verified Artisans • Direct From Maker Guarantee • Secure UPI',
    themeColor: '#4338CA',
    lightBg: '#EEF2FF',
  },
  FACILITATOR: {
    tag: 'Sahyogi Account',
    headerTitle: 'Sahyogi Profile',
    headerSub: 'CLUSTER SAHYOGI',
    title: 'Set Up Your Sahyogi Desk',
    subtitle: 'Register your cluster, SHG group, and local artisan support hub',
    voiceBanner: 'Speak to register your SHG and cluster details',
    section1Name: '1. Field Lead / Sahyogi Name',
    section1Voice: 'यहाँ अपना नाम या स्वयं सहायता समूह प्रमुख का नाम दर्ज करें।',
    section2Title: '2. Organization / Cluster Type',
    section2Voice: 'अपने समूह या संस्था का प्रकार चुनें।',
    section3Title: '3. Operating Cluster Hub',
    section3Voice: 'यह आपका कार्यक्षेत्र और कारीगर क्लस्टर केंद्र है।',
    locationBadge: '✓ 25+ Master Artisans Covered • Active Cluster Desk',
    section4Title: '4. SHG / Facilitator Referral Code (Optional)',
    section4Voice: 'यदि आपके पास सरकारी या संस्थागत कोड है तो दर्ज करें।',
    secondaryPlaceholder: 'e.g. SAHYOGI-PUNE-8802 (if applicable)',
    btnLabel: 'Save & Enter Sahyogi Desk →',
    trustBadge: 'Cluster Supported • Packaging, QC & Digital Empowerment Desk',
    themeColor: '#16A34A',
    lightBg: '#F0FDF4',
  },
  ADMIN_STAFF: {
    tag: 'Admin Account',
    headerTitle: 'Operations Desk',
    headerSub: 'KARAGIRX OPERATIONS',
    title: 'Set Up Operations Desk',
    subtitle: 'Internal administrative and quality audit operations',
    voiceBanner: 'Speak to configure desk options',
    section1Name: '1. Staff Name',
    section1Voice: 'अपना नाम दर्ज करें।',
    section2Title: '2. Desk Assignment',
    section2Voice: 'अपना विभाग चुनें।',
    section3Title: '3. Operating Hub',
    section3Voice: 'अपना हब चुनें।',
    locationBadge: '✓ Central Verified Operations Desk',
    section4Title: '4. Staff ID',
    section4Voice: 'अपना पहचान कोड दर्ज करें।',
    secondaryPlaceholder: 'e.g. OPS-HQ-01',
    btnLabel: 'Save & Enter Operations →',
    trustBadge: 'KaragirX Internal Operations Desk',
    themeColor: '#0F172A',
    lightBg: '#F1F5F9',
  },
};

export const ProfileSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { user, updateProfile } = useAuthStore();
  const role: UserRole = route?.params?.role || user?.role || 'ARTISAN';

  const defaultName =
    user?.fullName ||
    (role === 'BUYER'
      ? 'Priya Sharma'
      : role === 'FACILITATOR'
      ? 'Pooja Verma'
      : 'Ramesh Kumbhar');

  const defaultDistrict =
    role === 'BUYER' ? 'Delhi NCR' : role === 'FACILITATOR' ? 'Kolhapur Cluster' : 'Madhubani';
  const defaultState =
    role === 'BUYER' ? 'New Delhi' : role === 'FACILITATOR' ? 'Maharashtra' : 'Bihar';

  const [fullName, setFullName] = useState(defaultName);
  const [selectedCraft, setSelectedCraft] = useState<string>('PAINTING_FOLK');
  const [selectedType, setSelectedType] = useState<string>(
    role === 'BUYER' ? 'COLLECTOR' : 'SHG'
  );
  const [district] = useState(defaultDistrict);
  const [state] = useState(defaultState);
  const [secondaryCode, setSecondaryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleMeta = ROLE_METAS[role] || ROLE_METAS.ARTISAN;

  const handleVoiceDictateName = () => {
    if (!fullName) {
      setFullName(role === 'BUYER' ? 'Priya Sharma' : role === 'FACILITATOR' ? 'Pooja Verma' : 'Sunita Devi');
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const updatedUser = await authService.setupProfile(user?.id || 'temp_id', {
        full_name: fullName.trim(),
        craft_category_code: role === 'ARTISAN' ? selectedCraft : selectedType,
        district,
        state,
        shg_or_facilitator_code: secondaryCode.trim() || undefined,
      });

      await updateProfile({
        ...updatedUser,
        fullName: fullName.trim(),
        role,
        district,
        state,
        isProfileComplete: true,
      });

      setIsLoading(false);
      navigation.replace('MainTabs', { screen: 'HomeTab' });
    } catch {
      setIsLoading(false);
      setErrorMessage('Error saving profile — please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        showBack
        showBrand
        title={roleMeta.headerTitle}
        subtitle={roleMeta.headerSub}
        rightAction={
          <View style={[styles.helpPill, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[300] }]}>
            <Text variant="caption" weight="bold" color={roleMeta.themeColor}>
              Help
            </Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Indicator & Tag */}
        <View style={styles.stepMetaRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text variant="caption" weight="bold" color={roleMeta.themeColor}>
              Step 3/3
            </Text>
            <Text variant="caption" color={theme.colors.text.muted}>•</Text>
            <View style={[styles.roleTagPill, { backgroundColor: roleMeta.lightBg }]}>
              <Text style={[styles.roleTagText, { color: roleMeta.themeColor }]}>{roleMeta.tag}</Text>
            </View>
          </View>
          <Text variant="caption" color={theme.colors.text.muted}>Final Step</Text>
        </View>

        {/* Stepper Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { backgroundColor: roleMeta.themeColor }]} />
        </View>

        {/* Screen Header */}
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]}>
            {roleMeta.title}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
            {roleMeta.subtitle}
          </Text>
        </View>

        {/* Voice Saathi Companion Hint Banner */}
        <View style={[styles.voiceBanner, { backgroundColor: '#FFFFFF', borderColor: theme.colors.brand.container }]}>
          <View style={styles.voiceBannerLeft}>
            <View style={[styles.voiceBannerIcon, { backgroundColor: roleMeta.lightBg }]}>
              <Text style={{ fontSize: 16 }}>🎙️</Text>
            </View>
            <View>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
                Voice Saathi • AI Assistant
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                {roleMeta.voiceBanner}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleVoiceDictateName}
            style={[styles.voiceActionBtn, { backgroundColor: roleMeta.lightBg, borderColor: roleMeta.themeColor }]}
          >
            <Text variant="caption" weight="bold" color={roleMeta.themeColor}>
              🎙 Speak
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Name Input with Voice Cue */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                {roleMeta.section1Name}
              </Text>
              <VoiceCueButton
                textHi={roleMeta.section1Voice}
                size="small"
                testID="voice-cue-name"
              />
            </View>
            <TouchableOpacity
              onPress={handleVoiceDictateName}
              style={[styles.micBtn, { backgroundColor: roleMeta.lightBg, borderColor: roleMeta.themeColor }]}
              accessibilityRole="button"
              accessibilityLabel="Voice dictate name"
            >
              <Text variant="caption" weight="bold" color={roleMeta.themeColor}>
                🎙️ Speak Name
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrorMessage(null);
            }}
            placeholder={
              role === 'BUYER'
                ? 'e.g. Priya Sharma / FabCraft India'
                : role === 'FACILITATOR'
                ? 'e.g. Pooja Verma / Mahila Vikas SHG'
                : 'e.g. Ramesh Kumbhar / Sunita Devi'
            }
          />
        </View>

        {/* 2. Category / Specialization Selection */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              {roleMeta.section2Title}
            </Text>
            <VoiceCueButton
              textHi={roleMeta.section2Voice}
              size="small"
              testID="voice-cue-craft"
            />
          </View>

          {role === 'ARTISAN' ? (
            <View style={styles.craftGrid}>
              {CRAFTS.map((craft) => {
                const isSelected = selectedCraft === craft.code;
                return (
                  <TouchableOpacity
                    key={craft.code}
                    activeOpacity={0.8}
                    onPress={() => setSelectedCraft(craft.code)}
                    style={[
                      styles.craftTile,
                      {
                        backgroundColor: isSelected ? theme.colors.brand.light : theme.colors.surface.card,
                        borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                        ...theme.shadows.level1,
                      },
                    ]}
                  >
                    <Text style={styles.craftIcon}>{craft.icon}</Text>
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      align="center"
                      color={isSelected ? theme.colors.brand.primary : theme.colors.charcoal[900]}
                    >
                      {craft.nameEn}
                    </Text>
                    <Text variant="caption" align="center" color={theme.colors.text.secondary} style={styles.craftEn}>
                      {craft.nameHi}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.craftGrid}>
              {(role === 'BUYER' ? BUYER_TYPES : SAHYOGI_TYPES).map((opt) => {
                const isSelected = selectedType === opt.code;
                return (
                  <TouchableOpacity
                    key={opt.code}
                    activeOpacity={0.8}
                    onPress={() => setSelectedType(opt.code)}
                    style={[
                      styles.craftTile,
                      {
                        backgroundColor: isSelected ? roleMeta.lightBg : theme.colors.surface.card,
                        borderColor: isSelected ? roleMeta.themeColor : theme.colors.sand[200],
                        ...theme.shadows.level1,
                      },
                    ]}
                  >
                    <Text style={styles.craftIcon}>{opt.icon}</Text>
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      align="center"
                      color={isSelected ? roleMeta.themeColor : theme.colors.charcoal[900]}
                    >
                      {opt.nameEn}
                    </Text>
                    <Text variant="caption" align="center" color={theme.colors.text.secondary} style={styles.craftEn}>
                      {opt.nameHi}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* 3. Location Display */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              {roleMeta.section3Title}
            </Text>
            <VoiceCueButton
              textHi={roleMeta.section3Voice}
              size="small"
              testID="voice-cue-location"
            />
          </View>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <View>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                  {district}, {state}
                </Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                  {roleMeta.locationBadge}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 4. Secondary Code / Registration */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              {roleMeta.section4Title}
            </Text>
            <VoiceCueButton
              textHi={roleMeta.section4Voice}
              size="small"
              testID="voice-cue-shg"
            />
          </View>
          <TextInput
            value={secondaryCode}
            onChangeText={setSecondaryCode}
            placeholder={roleMeta.secondaryPlaceholder}
          />
        </View>

        {errorMessage && (
          <Text variant="bodySmall" weight="bold" color={theme.colors.status.danger} style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        )}

        <Button
          label={roleMeta.btnLabel}
          variant="primary"
          size="decision"
          isLoading={isLoading}
          onPress={handleSubmit}
          style={[styles.submitBtn, { backgroundColor: roleMeta.themeColor }]}
        />

        {/* Trust Badge */}
        <View style={styles.ondcBadge}>
          <Text style={{ fontSize: 13 }}>🛡️</Text>
          <Text variant="caption" color={theme.colors.text.secondary}>
            {roleMeta.trustBadge}
          </Text>
        </View>
      </ScrollView>
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
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 4,
  },
  roleTagPill: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleTagText: {
    color: '#4B44CC',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  voiceBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  ondcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 64,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 42,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 14,
  },
  avatarLabel: {
    marginTop: 6,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  micBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  craftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  craftTile: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  craftIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  craftEn: {
    marginTop: 2,
  },
  locationCard: {
    padding: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    fontSize: 26,
    marginRight: 12,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  submitBtn: {
    marginTop: 16,
  },
});
