import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';
import { LocationCascadeSelector } from '@/components';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { UserRole, LocationHierarchyValue } from '@/api/types';
import { voiceGuidance } from '@/utils/voiceGuidance';

const ARTISAN_AVATAR = require('../../../assets/artisan_3d_avatar.jpg');
const BUYER_AVATAR = require('../../../assets/buyer_3d_avatar.jpg');
const SAHYOGI_AVATAR = require('../../../assets/sahyogi_3d_avatar.jpg');

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

interface CraftCategory {
  code: string;
  nameHi: string;
  nameEn: string;
  iconName: IconName;
}

const CRAFTS: CraftCategory[] = [
  { code: 'POTTERY_TERRACOTTA', nameHi: 'मिट्टी एवं टेराकोटा', nameEn: 'Clay & Terracotta', iconName: 'palette' },
  { code: 'TEXTILE_HANDLOOM', nameHi: 'हथकरघा एवं बुनाई', nameEn: 'Handloom & Weaving', iconName: 'tag' },
  { code: 'PAINTING_FOLK', nameHi: 'पारंपरिक चित्रकला', nameEn: 'Folk Art (Madhubani)', iconName: 'palette' },
  { code: 'WOODCRAFT', nameHi: 'काष्ठ शिल्प', nameEn: 'Woodcraft & Carving', iconName: 'tool' },
  { code: 'METALLURGY_DHOKRA', nameHi: 'धातु शिल्प (ढोकरा)', nameEn: 'Metalcraft & Dhokra', iconName: 'sparkles' },
  { code: 'BAMBOO_CANE', nameHi: 'बांस एवं जूट', nameEn: 'Bamboo & Cane', iconName: 'bagOutline' },
];

const LANGUAGES: { code: SupportedLocale; name: string; nativeName: string }[] = [
  { code: 'hi_IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en_IN', name: 'English', nativeName: 'English' },
  { code: 'mr_IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn_IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu_IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta_IN', name: 'Tamil', nativeName: 'தமிழ்' },
];

interface OptionItem {
  code: string;
  nameEn: string;
  nameHi: string;
  iconName: IconName;
  desc?: string;
}

const BUYER_TYPES: OptionItem[] = [
  { code: 'COLLECTOR', nameEn: 'Individual Collector', nameHi: 'व्यक्तिगत खरीदार', iconName: 'bagOutline', desc: 'Handcrafted authentic home & lifestyle' },
  { code: 'CORPORATE', nameEn: 'Corporate Gifting', nameHi: 'कॉर्पोरेट उपहार', iconName: 'gift', desc: 'Custom festive hampers & client gifts' },
  { code: 'RETAIL', nameEn: 'Boutique / Store', nameHi: 'बुटीक व स्टोर', iconName: 'building', desc: 'Curated artisanal inventory for sale' },
  { code: 'INSTITUTIONAL', nameEn: 'Institutional / Export', nameHi: 'संस्थागत व निर्यात', iconName: 'briefcase', desc: 'Bulk procurement & heritage orders' },
];

const BUYER_CATEGORIES: OptionItem[] = [
  { code: 'POTTERY', nameEn: 'Pottery & Ceramics', nameHi: 'मिट्टी के बर्तन', iconName: 'palette' },
  { code: 'HANDLOOM', nameEn: 'Handloom Sarees & Shawls', nameHi: 'हथकरघा वस्त्र', iconName: 'tag' },
  { code: 'PAINTINGS', nameEn: 'Traditional Paintings', nameHi: 'पारंपरिक चित्रकला', iconName: 'palette' },
  { code: 'WOODWORK', nameEn: 'Wood & Stone Carving', nameHi: 'काष्ठ कला', iconName: 'tool' },
  { code: 'JEWELRY', nameEn: 'Ethnic Jewelry & Brass', nameHi: 'पारंपरिक आभूषण', iconName: 'sparkles' },
  { code: 'DECOR', nameEn: 'Home Decor & Rugs', nameHi: 'गृह सज्जा', iconName: 'home' },
];

const ADMIN_DEPARTMENTS: OptionItem[] = [
  { code: 'OPERATIONS', nameEn: 'Operations Command', nameHi: 'संचालन नियंत्रण', iconName: 'shieldCheck', desc: 'Platform supervision & governance' },
  { code: 'KYC_VETTING', nameEn: 'Artisan KYC & Trust', nameHi: 'शिल्पकार सत्यापन', iconName: 'checkCircle', desc: 'LGD identity & artisan onboarding' },
  { code: 'CATALOG_MODERATION', nameEn: 'AI Catalog Review', nameHi: 'कैटलॉग मॉडरेशन', iconName: 'sparkles', desc: 'Listing quality, pricing & vision guard' },
  { code: 'ESCROW_DISPUTES', nameEn: 'Escrow & Reconciliation', nameHi: 'एस्क्रो व विवाद', iconName: 'wallet', desc: 'India Post cod & 48h settlement' },
];

const ADMIN_CLEARANCE_LEVELS = [
  { code: 'L1', label: 'Operations Lead', desc: 'Cluster supervisor' },
  { code: 'L2', label: 'Senior Moderator', desc: 'State catalog officer' },
  { code: 'L3', label: 'Platform Admin', desc: 'National command center' },
];

export const ProfileSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { user, updateProfile } = useAuthStore();
  const { locale, setLocale } = useAppStore();
  const role: UserRole = route?.params?.role || user?.role || 'ARTISAN';

  // Form states - completely empty by default; only low-opacity placeholders are shown so user enters / chooses everything
  const [fullName, setFullName] = useState('');
  const [selectedCraft, setSelectedCraft] = useState<string>('');
  const [district, setDistrict] = useState(user?.district || '');
  const [state, setState] = useState(user?.state || '');
  const [locationValue, setLocationValue] = useState<Partial<LocationHierarchyValue>>({
    countryId: user?.countryId || 1,
    countryName: 'India',
    stateId: user?.stateId,
    stateName: user?.state || '',
    districtId: user?.districtId,
    districtName: user?.district || '',
    subDistrictId: user?.subDistrictId,
    subDistrictName: user?.subDistrict || '',
    villageId: user?.villageId,
    villageName: user?.villageName || '',
  });
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>(locale || 'hi_IN');

  // Buyer specific - nothing pre-selected
  const [buyerType, setBuyerType] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [purchasePreference, setPurchasePreference] = useState<'INDIVIDUAL' | 'BULK' | ''>('');

  // Admin specific - defaults for demo readiness
  const [adminDept, setAdminDept] = useState<string>('OPERATIONS');
  const [clearanceLevel, setClearanceLevel] = useState<string>('L3');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleColor = role === 'BUYER' ? '#4338CA' : role === 'ADMIN' ? '#6366F1' : '#EA580C';
  const roleLightBg = role === 'BUYER' ? '#EEF2FF' : role === 'ADMIN' ? '#EEF2FF' : '#FFF7ED';

  const roleAvatar =
    role === 'BUYER' ? BUYER_AVATAR : role === 'ADMIN' ? SAHYOGI_AVATAR : ARTISAN_AVATAR;
  const roleTitle =
    role === 'BUYER' ? 'Buyer' : role === 'ADMIN' ? 'Admin' : 'Artisan';

  const handleVoiceDictateName = () => {
    voiceGuidance.speakHindi(
      'कृपया अपना पूरा नाम बोलिए।',
      undefined,
      () => {
        if (!fullName) {
          setFullName(role === 'BUYER' ? 'Priya Sharma' : role === 'ADMIN' ? 'Rajesh Sharma (Admin)' : 'Ramesh Kumbhar');
        }
      }
    );
  };

  const handleComplete = async (destination?: 'STUDIO' | 'HOME') => {
    if (!fullName.trim()) {
      setErrorMessage('कृपया अपना नाम दर्ज करें (Please enter your name)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const finalDistrict = locationValue.districtName || district || '';
      const finalState = locationValue.stateName || state || '';
      const finalSubDistrict = locationValue.subDistrictName || '';
      const finalVillage = locationValue.villageName || '';

      const updatedUser = await authService.setupProfile(user?.id || 'temp_user_id', {
        full_name: fullName.trim(),
        craft_category_code: role === 'ARTISAN' ? selectedCraft : buyerType,
        country_id: locationValue.countryId || 1,
        state_id: locationValue.stateId,
        district_id: locationValue.districtId,
        sub_district_id: locationValue.subDistrictId,
        village_id: locationValue.villageId,
        district: finalDistrict,
        state: finalState,
        sub_district: finalSubDistrict,
        village_name: finalVillage,
      });

      await updateProfile({
        ...updatedUser,
        fullName: fullName.trim(),
        role,
        countryId: locationValue.countryId || 1,
        stateId: locationValue.stateId,
        districtId: locationValue.districtId,
        subDistrictId: locationValue.subDistrictId,
        villageId: locationValue.villageId,
        district: finalDistrict,
        state: finalState,
        subDistrict: finalSubDistrict,
        villageName: finalVillage,
        isProfileComplete: true,
      });

      await setLocale(selectedLanguage);
      setIsLoading(false);

      useAuthStore.getState().setActiveRole(role);

      if (role === 'ARTISAN') {
        if (destination === 'STUDIO') {
          navigation.replace('CameraCapture');
        } else {
          navigation.replace('MainTabs', { screen: 'HomeTab', params: { role: 'ARTISAN' } });
        }
      } else if (role === 'BUYER') {
        navigation.replace('MainTabs', { screen: 'HomeTab', params: { role: 'BUYER' } });
      } else {
        navigation.replace('MainTabs', { screen: 'HomeTab', params: { role: 'ADMIN' } });
      }
    } catch {
      setIsLoading(false);
      useAuthStore.getState().setActiveRole(role);
      if (role === 'ARTISAN' && destination === 'STUDIO') {
        navigation.replace('CameraCapture');
      } else {
        navigation.replace('MainTabs', { screen: 'HomeTab', params: { role } });
      }
    }
  };

  const toggleCategory = (code: string) => {
    setSelectedCategories((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top App Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrowLeft" size={18} color="#0F172A" />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <Text variant="bodyLarge" weight="bold" color="#0F172A">
              Profile Setup
            </Text>
            <Text variant="caption" color="#64748B">
              एक ही स्क्रीन पर पूरा सेटअप
            </Text>
          </View>

          <View style={[styles.roleTagPill, { backgroundColor: roleLightBg }]}>
            <Image source={roleAvatar} style={styles.miniRoleAvatar} />
            <Text variant="caption" weight="bold" color={roleColor}>
              {roleTitle}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Welcome Card */}
          <View style={styles.heroCard}>
            <View style={[styles.avatarRing, { borderColor: roleColor }]}>
              <Image source={roleAvatar} style={styles.heroAvatarImg} resizeMode="cover" />
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text variant="headlineMedium" weight="bold" color="#0F172A" style={{ letterSpacing: -0.3 }}>
                {role === 'ARTISAN'
                  ? 'Apna Shilp Workspace Banayein'
                  : role === 'BUYER'
                  ? 'Buyer Account Setup'
                  : 'Sahyogi Desk Setup'}
              </Text>
              <Text variant="bodySmall" color="#64748B" style={{ marginTop: 2 }}>
                Neeche di gayi jankari bharein aur Kalakar Setu par kaam shuru karein.
              </Text>
            </View>
          </View>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <Icon name="alertCircle" size={18} color="#DC2626" />
              <Text variant="bodySmall" weight="bold" color="#DC2626" style={{ flex: 1 }}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Section 1: Full Name */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                <Text variant="caption" weight="bold" color={roleColor}>
                  1
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyLarge" weight="bold" color="#0F172A">
                  Aapka Naam (Full Name)
                </Text>
                <Text variant="caption" color="#64748B">
                  Apna poora naam likhein ya bolkar batayein
                </Text>
              </View>
            </View>

            <View style={styles.inputWithAction}>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={(val) => {
                  setFullName(val);
                  setErrorMessage(null);
                }}
                placeholder={
                  role === 'BUYER'
                    ? 'अपना पूरा नाम लिखें (e.g. Priya Sharma)'
                    : role === 'ADMIN'
                    ? 'अपना पूरा नाम लिखें (e.g. Rajesh Sharma)'
                    : 'अपना पूरा नाम लिखें (e.g. Sunita Devi / Ramesh Kumbhar)'
                }
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={handleVoiceDictateName}
                style={[styles.voiceInlineBtn, { backgroundColor: roleLightBg }]}
                activeOpacity={0.8}
              >
                <Icon name="microphone" size={18} color={roleColor} />
                <Text variant="caption" weight="bold" color={roleColor}>
                  Bolkar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 2: Craft / Skill (Role Specific) */}
          {role === 'ARTISAN' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                  <Text variant="caption" weight="bold" color={roleColor}>
                    2
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" weight="bold" color="#0F172A">
                    Aapki Kala / Hastashilp (Craft & Skill)
                  </Text>
                  <Text variant="caption" color="#64748B">
                    Aap mukhya roop se kis kala mein utpaad banate hain?
                  </Text>
                </View>
              </View>

              <View style={styles.craftGrid}>
                {CRAFTS.map((craft) => {
                  const isSelected = selectedCraft === craft.code;
                  return (
                    <TouchableOpacity
                      key={craft.code}
                      onPress={() => setSelectedCraft(craft.code)}
                      style={[
                        styles.craftTile,
                        isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.craftTileIconWrap,
                          { backgroundColor: isSelected ? roleColor : '#F1F5F9' },
                        ]}
                      >
                        <Icon
                          name={craft.iconName}
                          size={20}
                          color={isSelected ? '#FFFFFF' : '#475569'}
                        />
                      </View>
                      <Text
                        variant="bodySmall"
                        weight="bold"
                        color="#0F172A"
                        style={{ textAlign: 'center' }}
                      >
                        {craft.nameEn}
                      </Text>
                      <Text
                        variant="caption"
                        color="#64748B"
                        style={{ textAlign: 'center', marginTop: 2, fontSize: 11 }}
                      >
                        {craft.nameHi}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Buyer Specific Section 2 */}
          {role === 'BUYER' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                  <Text variant="caption" weight="bold" color={roleColor}>
                    2
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" weight="bold" color="#0F172A">
                    Buyer Type & Categories
                  </Text>
                  <Text variant="caption" color="#64748B">
                    How do you curate or purchase craft collections?
                  </Text>
                </View>
              </View>

              {/* Buyer Types */}
              <View style={styles.buyerTypeRow}>
                {BUYER_TYPES.map((bt) => {
                  const isSelected = buyerType === bt.code;
                  return (
                    <TouchableOpacity
                      key={bt.code}
                      onPress={() => setBuyerType(bt.code)}
                      style={[
                        styles.buyerTypeChip,
                        isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                      ]}
                    >
                      <Icon
                        name={bt.iconName}
                        size={16}
                        color={isSelected ? roleColor : '#64748B'}
                      />
                      <Text
                        variant="caption"
                        weight="bold"
                        color={isSelected ? roleColor : '#334155'}
                        style={{ marginLeft: 6, flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {bt.nameEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Multi-select Craft Categories */}
              <Text variant="caption" weight="bold" color="#475569" style={{ marginTop: 12, marginBottom: 8 }}>
                INTERESTED CRAFTS
              </Text>
              <View style={styles.buyerCategoryGrid}>
                {BUYER_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat.code);
                  return (
                    <TouchableOpacity
                      key={cat.code}
                      onPress={() => toggleCategory(cat.code)}
                      style={[
                        styles.buyerCategoryChip,
                        isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                      ]}
                    >
                      <Icon
                        name={cat.iconName}
                        size={16}
                        color={isSelected ? roleColor : '#64748B'}
                      />
                      <Text
                        variant="caption"
                        weight={isSelected ? 'bold' : 'normal'}
                        color={isSelected ? roleColor : '#334155'}
                        style={{ marginLeft: 6, flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {cat.nameEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Purchase Preference */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  onPress={() => setPurchasePreference('INDIVIDUAL')}
                  style={[
                    styles.purchasePrefBtn,
                    purchasePreference === 'INDIVIDUAL' && {
                      borderColor: roleColor,
                      backgroundColor: roleLightBg,
                    },
                  ]}
                >
                  <Icon
                    name="bagOutline"
                    size={18}
                    color={purchasePreference === 'INDIVIDUAL' ? roleColor : '#64748B'}
                  />
                  <Text
                    variant="caption"
                    weight="bold"
                    color={purchasePreference === 'INDIVIDUAL' ? roleColor : '#334155'}
                    style={{ marginLeft: 6 }}
                  >
                    Individual (Retail)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPurchasePreference('BULK')}
                  style={[
                    styles.purchasePrefBtn,
                    purchasePreference === 'BULK' && {
                      borderColor: roleColor,
                      backgroundColor: roleLightBg,
                    },
                  ]}
                >
                  <Icon
                    name="building"
                    size={18}
                    color={purchasePreference === 'BULK' ? roleColor : '#64748B'}
                  />
                  <Text
                    variant="caption"
                    weight="bold"
                    color={purchasePreference === 'BULK' ? roleColor : '#334155'}
                    style={{ marginLeft: 6 }}
                  >
                    Bulk & Custom (B2B)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Admin Specific Section 2 */}
          {role === 'ADMIN' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                  <Text variant="caption" weight="bold" color={roleColor}>
                    2
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" weight="bold" color="#0F172A">
                    Admin Operations Department
                  </Text>
                  <Text variant="caption" color="#64748B">
                    Select your operational focus and supervisory role
                  </Text>
                </View>
              </View>

              <View style={styles.sahyogiTypeGrid}>
                {ADMIN_DEPARTMENTS.map((dept) => {
                  const isSelected = adminDept === dept.code;
                  return (
                    <TouchableOpacity
                      key={dept.code}
                      onPress={() => setAdminDept(dept.code)}
                      style={[
                        styles.sahyogiTypeTile,
                        isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                      ]}
                    >
                      <Icon
                        name={dept.iconName}
                        size={20}
                        color={isSelected ? roleColor : '#64748B'}
                      />
                      <Text
                        variant="bodySmall"
                        weight="bold"
                        color="#0F172A"
                        style={{ marginTop: 4 }}
                      >
                        {dept.nameEn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {ADMIN_CLEARANCE_LEVELS.map((cl) => {
                  const isSelected = clearanceLevel === cl.code;
                  return (
                    <TouchableOpacity
                      key={cl.code}
                      onPress={() => setClearanceLevel(cl.code)}
                      style={[
                        styles.networkSizePill,
                        isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                      ]}
                    >
                      <Text
                        variant="caption"
                        weight="bold"
                        color={isSelected ? roleColor : '#475569'}
                      >
                        {cl.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Section 3: Workshop / Operating Location */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                <Text variant="caption" weight="bold" color={roleColor}>
                  3
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyLarge" weight="bold" color="#0F172A">
                  {role === 'BUYER'
                    ? 'Operating / Sourcing Location (स्थान)'
                    : role === 'ADMIN'
                    ? 'Operations HQ Location (मुख्यालय स्थान)'
                    : 'Workshop Location (स्थान)'}
                </Text>
                <Text variant="caption" color="#64748B">
                  {role === 'BUYER'
                    ? 'Primary delivery city & sourcing state'
                    : role === 'ADMIN'
                    ? 'National operations and compliance center'
                    : 'Aapki karyashala ya cluster ka pata (LGD Official)'}
                </Text>
              </View>
            </View>

            <LocationCascadeSelector
              value={locationValue}
              onChange={(val) => {
                setLocationValue(val);
                setDistrict(val.districtName);
                setState(val.stateName);
              }}
              accentColor={roleColor}
              lightBgColor={roleLightBg}
              showVillage={role !== 'BUYER'}
              showSubDistrict={true}
              helperText={
                role === 'ARTISAN'
                  ? 'Government of India LGD verified artisan cluster linkage'
                  : undefined
              }
            />

            <View style={styles.giTagBadge}>
              <Icon name="shieldCheck" size={16} color="#047857" />
              <Text variant="caption" weight="bold" color="#047857" style={{ marginLeft: 6 }}>
                Certified Authentic GI Craft Hub Linked
              </Text>
            </View>
          </View>

          {/* Section 4: Language Preference */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumberBadge, { backgroundColor: roleLightBg }]}>
                <Text variant="caption" weight="bold" color={roleColor}>
                  4
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyLarge" weight="bold" color="#0F172A">
                  Language Preference (भाषा चुनें)
                </Text>
                <Text variant="caption" color="#64748B">
                  App aur Voice Assistant kis bhasha mein baat karein?
                </Text>
              </View>
            </View>

            <View style={styles.langGrid}>
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => setSelectedLanguage(lang.code)}
                    style={[
                      styles.langTile,
                      isSelected && { borderColor: roleColor, backgroundColor: roleLightBg },
                    ]}
                  >
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      color={isSelected ? roleColor : '#0F172A'}
                    >
                      {lang.nativeName}
                    </Text>
                    <Text variant="caption" color="#64748B" style={{ fontSize: 11 }}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.actionContainer}>
            {role === 'ARTISAN' ? (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: roleColor }]}
                onPress={() => handleComplete('HOME')}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Icon name="home" size={20} color="#FFFFFF" />
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
                  {isLoading ? 'Saving...' : 'Enter Dashboard →'}
                </Text>
              </TouchableOpacity>
            ) : role === 'BUYER' ? (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: roleColor }]}
                onPress={() => handleComplete()}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Icon name="bagOutline" size={20} color="#FFFFFF" />
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
                  {isLoading ? 'Saving...' : 'Enter Marketplace →'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: roleColor }]}
                onPress={() => handleComplete()}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <Icon name="users" size={20} color="#FFFFFF" />
                <Text variant="bodyLarge" weight="bold" color="#FFFFFF" style={{ marginLeft: 8 }}>
                  {isLoading ? 'Saving...' : 'Open Sahyogi Desk →'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  miniRoleAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2.5,
    padding: 2,
    backgroundColor: '#FFFFFF',
  },
  heroAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWithAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    outlineStyle: 'none' as any,
  },
  voiceInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.2)',
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  craftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  craftTile: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  craftTileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  buyerTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  buyerTypeChip: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  buyerCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  buyerCategoryChip: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  purchasePrefBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  sahyogiTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  sahyogiTypeTile: {
    width: '48.5%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  networkSizePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  langTile: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  studioHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    marginBottom: 16,
  },
  studioCameraImg: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  actionContainer: {
    marginTop: 6,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
