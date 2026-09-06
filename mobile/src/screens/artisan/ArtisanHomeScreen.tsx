import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text } from '@/components/typography/Text';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductTile {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isOnline } = useAppStore();
  const { user } = useAuthStore();
  const { t, isHindi } = useTranslation();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const artisanProducts: ProductTile[] = [
    {
      id: 'prod_1',
      name: t.artisan.terracottaDiya,
      price: `₹145 ${t.artisan.perPiece}`,
      imageUrl:
        'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'prod_2',
      name: t.artisan.handmadePot,
      price: `₹350 ${t.artisan.perPiece}`,
      imageUrl:
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    },
  ];

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = isHindi ? 'कलाकार सेतु ~ कारीगर' : 'Kalakar Setu ~ Artisans';
    }
  }, [isHindi]);

  const artisanName = user?.fullName || (isHindi ? 'रमेश कुंभार' : 'Ramesh Kumbhar');

  const handleVoiceGreeting = () => {
    setIsPlayingAudio(true);
    Alert.alert(
      '🗣️ Voice Saathi',
      t.artisan.voiceGreetingText,
      [{ text: 'OK', onPress: () => setIsPlayingAudio(false) }]
    );
  };

  const handleSpeakText = (text: string) => {
    Alert.alert('🔊 Voice Readback', text);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>☁️</Text>
          <Text variant="caption" weight="bold" color="#FFFFFF">
            {t.profile.offlineMode}
          </Text>
        </View>
      )}

      {/* Fixed Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/kalakar_setu_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.headerTitle}>
              {t.common.appName}
            </Text>
            <View style={styles.roleBadgePill}>
              <Text style={styles.roleBadgeText}>🏺 {t.artisan.badge}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileAvatarButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          accessibilityLabel="Profile"
        >
          <Image
            source={require('../../../assets/artisan_3d_avatar.jpg')}
            style={styles.profileAvatarImg}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Welcome Greeting & Audio Button */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextContainer}>
            <Text variant="headlineMedium" weight="bold" color="#2b2b2b" style={styles.namasteTitle}>
              {t.artisan.namaste}, {artisanName}!
            </Text>
            <Text variant="bodySmall" color="#737373" style={styles.workshopSubtitle}>
              {t.artisan.welcomeBack}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.voiceGreetingBtn, isPlayingAudio && styles.voiceGreetingBtnActive]}
            onPress={handleVoiceGreeting}
            accessibilityLabel="Play welcome greeting"
          >
            <Text style={{ fontSize: 22 }}>🗣️</Text>
          </TouchableOpacity>
        </View>

        {/* 3 KPI Metric Tiles (Stitch Exact Layout) */}
        <View style={styles.kpiGrid}>
          {/* Earnings Tile */}
          <View style={styles.kpiCard}>
            <Text variant="caption" weight="bold" color="#737373" style={styles.kpiLabel}>
              {t.artisan.earningsLabel}
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#e85d2a" style={styles.kpiValue}>
              ₹1,114k
            </Text>
          </View>

          {/* Orders Tile */}
          <View style={styles.kpiCard}>
            <Text variant="caption" weight="bold" color="#737373" style={styles.kpiLabel}>
              {t.artisan.ordersLabel}
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#1b9aaa" style={styles.kpiValue}>
              3
            </Text>
          </View>

          {/* Opps Tile */}
          <View style={styles.kpiCard}>
            <Text variant="caption" weight="bold" color="#737373" style={styles.kpiLabel}>
              {t.artisan.oppsLabel}
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#f4b942" style={styles.kpiValue}>
              2
            </Text>
          </View>
        </View>

        {/* Stitch "Create New Product" Hero Action Card */}
        <TouchableOpacity
          style={styles.createProductHeroCard}
          onPress={() => navigation.navigate('CameraPermission')}
          activeOpacity={0.92}
        >
          <View style={styles.heroButtonIconsRow}>
            <View style={styles.heroIconCircle}>
              <Text style={{ fontSize: 20 }}>📷</Text>
            </View>
            <View style={styles.heroIconCircle}>
              <Text style={{ fontSize: 20 }}>🎙️</Text>
            </View>
          </View>
          <Text variant="headlineSmall" weight="bold" color="#FFFFFF" style={styles.createProductTitle}>
            {t.artisan.createProductHero}
          </Text>
          <Text variant="caption" color="rgba(255, 255, 255, 0.85)">
            {t.artisan.createProductHeroSub}
          </Text>
        </TouchableOpacity>

        {/* 6 Core Killer Features Interactive Showcase */}
        <View style={styles.killerFeaturesSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
                ⚡ {t.artisan.coreFeaturesTitle}
              </Text>
              <Text variant="caption" color="#737373">
                {t.artisan.coreFeaturesSub}
              </Text>
            </View>
            <View style={styles.liveBadgePill}>
              <Text style={styles.liveBadgeDot}>●</Text>
              <Text variant="caption" weight="bold" color="#16A34A">
                {t.artisan.liveDemo}
              </Text>
            </View>
          </View>

          <View style={styles.killerGrid}>
            {/* 1. AI Smart Catalogue */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('AiEnhancement')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#FFEDD5' }]}>
                <Text style={{ fontSize: 22 }}>📸</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#EA580C', backgroundColor: '#FFF7ED' }]}>
                    {isHindi ? 'विशेष सुविधा #1' : 'KILLER #1'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.aiCatalogue}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.aiCatalogueDesc}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* 2. Voice Saathi Interview */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('VoiceFollowUp')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Text style={{ fontSize: 22 }}>🤖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#D97706', backgroundColor: '#FFFBEB' }]}>
                    {isHindi ? 'विशेष सुविधा #2' : 'KILLER #2'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.voiceSaathiInterview}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.voiceSaathiInterviewDesc}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* 3. Explainable Fair Price Advisor */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('PricingRecommendation')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Text style={{ fontSize: 22 }}>💰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#16A34A', backgroundColor: '#F0FDF4' }]}>
                    {isHindi ? 'विशेष सुविधा #3' : 'KILLER #3'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.fairPriceAdvisor}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.fairPriceAdvisorDesc}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* 4. Digital Craft Passport */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('PublishSuccess')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#E0E7FF' }]}>
                <Text style={{ fontSize: 22 }}>🏛️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#4F46E5', backgroundColor: '#EEF2FF' }]}>
                    {isHindi ? 'विशेष सुविधा #4' : 'KILLER #4'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.qrPassport}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.qrPassportDesc}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* 5. AI Bulk Order & Smart Cluster */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() =>
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' })
              }
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#FCE7F3' }]}>
                <Text style={{ fontSize: 22 }}>🏢</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#DB2777', backgroundColor: '#FDF2F8' }]}>
                    {isHindi ? 'विशेष सुविधा #5' : 'KILLER #5'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {isHindi ? 'एआई थोक ऑर्डर एवं क्लस्टर' : 'AI Bulk Order → Smart Cluster'}
                </Text>
                <Text variant="caption" color="#64748B">
                  {isHindi ? '5,000 दीयों का ऑर्डर 5 स्थानीय कारीगरों में स्वचालित रूप से विभाजित' : '5,000 Diya order pooled across 5 local artisans automatically'}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>

            {/* 6. Production Brief + Collective Tracking */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() =>
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' })
              }
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconCircle, { backgroundColor: '#E0F2FE' }]}>
                <Text style={{ fontSize: 22 }}>📋</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.killerBadgeRow}>
                  <Text style={[styles.killerPill, { color: '#0284C7', backgroundColor: '#F0F9FF' }]}>
                    {isHindi ? 'विशेष सुविधा #6' : 'KILLER #6'}
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {isHindi ? 'डिजिटल उत्पादन विवरण पत्र' : 'Digital Production Brief & Tracking'}
                </Text>
                <Text variant="caption" color="#64748B">
                  {isHindi ? 'मानकीकृत विनिर्देश एवं सामूहिक लाइव प्रगति' : 'Standardized specs (dimensions, clay) + live collective progress'}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Triple Dot Divider Motif */}
        <View style={styles.motifDivider}>
          <View style={styles.motifDot} />
          <View style={styles.motifDot} />
          <View style={styles.motifDot} />
        </View>

        {/* My Products Reel Section */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
            {t.artisan.myProducts}
          </Text>
          <TouchableOpacity
            style={styles.audioSpeakerBtn}
            onPress={() =>
              handleSpeakText(
                isHindi
                  ? 'आपके उत्पाद। टेराकोटा दीया 145 रुपये प्रति नग, और हस्तनिर्मित मिट्टी का पात्र 350 रुपये प्रति नग।'
                  : 'Your Products. Terracotta Diya selling at 145 rupees per piece, and Handmade Pot at 350 rupees per piece.'
              )
            }
            accessibilityLabel="Read products section aloud"
          >
            <Text style={{ fontSize: 18 }}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Snap Scroll Reel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsReel}
        >
          {artisanProducts.map((item) => (
            <View key={item.id} style={styles.productTileCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.tileImg} resizeMode="cover" />
              <View style={styles.tileInfo}>
                <Text variant="caption" weight="bold" color="#2b2b2b" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" weight="bold" color="#e85d2a">
                  {item.price}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.viewAllCard}
            onPress={() => navigation.navigate('CameraPermission')}
          >
            <Text style={{ fontSize: 28, color: '#737373', marginBottom: 4 }}>⊕</Text>
            <Text variant="caption" weight="bold" color="#737373">
              {t.artisan.viewAllProducts}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Triple Dot Divider Motif */}
        <View style={styles.motifDivider}>
          <View style={styles.motifDot} />
          <View style={styles.motifDot} />
          <View style={styles.motifDot} />
        </View>

        {/* New Opportunities Section (Stitch Exact Card) */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
            {t.artisan.newOpportunities}
          </Text>
          <TouchableOpacity
            style={styles.audioSpeakerBtn}
            onPress={() =>
              handleSpeakText(
                isHindi
                  ? 'नए अवसर। 500 हस्तनिर्मित मिट्टी के उत्पादों के लिए कॉर्पोरेट उपहार का थोक ऑर्डर अनुरोध। अनुमानित मूल्य 25 हजार रुपये।'
                  : 'New Opportunities. Bulk order request from corporate gifting client for 500 hand-painted clay items. Estimated value 25 thousand rupees.'
              )
            }
            accessibilityLabel="Read opportunities section aloud"
          >
            <Text style={{ fontSize: 18 }}>🔊</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.opportunityCard}>
          <View style={styles.oppTopRow}>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color="#0E535C">
                {t.artisan.bulkOrderRequest}
              </Text>
              <Text variant="bodySmall" color="#147582" style={{ marginTop: 2 }}>
                {t.artisan.bulkOrderDesc}
              </Text>
            </View>
          </View>

          <View style={styles.oppTagsRow}>
            <View style={styles.matchTag}>
              <Text style={{ fontSize: 11, marginRight: 4, color: '#FFFFFF' }}>✓</Text>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                {t.artisan.matchPottery}
              </Text>
            </View>
            <View style={styles.estTag}>
              <Text variant="caption" weight="bold" color="#0E535C">
                {t.artisan.estValue}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reviewDetailsBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'BulkDealsTab' })}
          >
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              {t.artisan.reviewDetails}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Schemes & Support Section (Stitch Exact Card) */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
            {t.artisan.schemesAndSupport}
          </Text>
          <TouchableOpacity
            style={styles.audioSpeakerBtn}
            onPress={() =>
              handleSpeakText(
                isHindi
                  ? 'सरकारी योजनाएं एवं सहायता। कारीगर क्रेडिट कार्ड। शिल्पकारों के लिए विशेष रियायती ब्याज दर पर ऋण सुविधा।'
                  : 'Schemes and Support. Artisan Credit Card. Apply for low interest loans designed specifically for craftspeople.'
              )
            }
            accessibilityLabel="Read schemes section aloud"
          >
            <Text style={{ fontSize: 18 }}>🔊</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.schemeCard}
          onPress={() =>
            Alert.alert(
              isHindi ? '💳 कारीगर क्रेडिट कार्ड योजना' : '💳 Artisan Credit Card Scheme',
              isHindi
                ? 'सत्यापित पारंपरिक शिल्पकारों के लिए मुद्रा / पीएम विश्वकर्मा 5% रियायती ऋण के लिए आवेदन करें।'
                : 'Apply for Mudra / PM Vishwakarma low-interest loans (5% subsidised) designed specifically for verified traditional artisans.'
            )
          }
          activeOpacity={0.88}
        >
          <View style={styles.schemeIconCircle}>
            <Text style={{ fontSize: 22 }}>🏛️</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="bodyMedium" weight="bold" color="#2b2b2b">
              {t.artisan.artisanCreditCard}
            </Text>
            <Text variant="bodySmall" color="#737373" numberOfLines={2} style={{ marginTop: 2 }}>
              {t.artisan.artisanCreditCardDesc}
            </Text>
          </View>
          <Text style={{ fontSize: 18, color: '#A3A3A3' }}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Saffron Mic Button (Stitch Exact Floating Action Button) */}
      <TouchableOpacity
        style={styles.floatingMicBtn}
        onPress={() => navigation.navigate('MicPermission')}
        accessibilityLabel="Voice Assistant Mic"
        activeOpacity={0.88}
      >
        <Text style={{ fontSize: 26 }}>🎙️</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF7', // Stitch exact canvas
  },
  offlineBanner: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 253, 247, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8DC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  roleBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginTop: 1,
  },
  roleBadgeText: {
    color: '#EA580C',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileAvatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e85d2a',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 90, // Space for floating mic and bottom bar
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greetingTextContainer: {
    flex: 1,
  },
  namasteTitle: {
    fontSize: 24,
    letterSpacing: -0.3,
  },
  workshopSubtitle: {
    marginTop: 2,
  },
  voiceGreetingBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD7C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e85d2a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  voiceGreetingBtnActive: {
    backgroundColor: '#e85d2a',
  },
  kpiGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 6,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F5F3EB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  kpiLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 18,
  },
  createProductHeroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#e85d2a', // Stitch Terracotta #e85d2a
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e85d2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  heroButtonIconsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  heroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createProductTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  motifDivider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    opacity: 0.25,
  },
  motifDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2b2b2b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  audioSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F3EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsReel: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  productTileCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tileImg: {
    width: '100%',
    height: 100,
  },
  tileInfo: {
    padding: 8,
  },
  viewAllCard: {
    width: 140,
    height: 146,
    backgroundColor: '#F5F3EB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opportunityCard: {
    marginHorizontal: 16,
    backgroundColor: '#C8EEF3', // Stitch secondary container
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B0E2EA',
    marginBottom: 8,
  },
  oppTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  oppTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  killerFeaturesSection: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECE8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  liveBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  liveBadgeDot: {
    color: '#16A34A',
    fontSize: 10,
    marginRight: 4,
  },
  killerGrid: {
    gap: 10,
  },
  killerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  killerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  killerBadgeRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  killerPill: {
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  arrowIcon: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 4,
  },
  matchTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b9aaa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  estTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reviewDetailsBtn: {
    backgroundColor: '#1b9aaa',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECE8DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 16,
  },
  schemeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE4A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingMicBtn: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e85d2a', // Stitch Saffron #e85d2a
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e85d2a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
});
