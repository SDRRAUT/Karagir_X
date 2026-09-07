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
import { Icon } from '@/components/icons/Icon';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCatalogStore } from '@/store/useCatalogStore';

interface ProductTile {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  imageSource?: any;
}

const ARTISAN_PRODUCTS: ProductTile[] = [
  {
    id: 'prod_1',
    name: 'Terracotta Diya',
    price: '₹145 / piece',
    imageSource: require('../assets/crafts/terracotta_diya.jpg'),
  },
  {
    id: 'prod_2',
    name: 'Handmade Pot',
    price: '₹350 / piece',
    imageSource: require('../assets/crafts/blue_pottery.jpg'),
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isOnline } = useAppStore();
  const { user } = useAuthStore();
  const artisanProducts = useCatalogStore((s) => s.artisanProducts);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Kalakar Setu ~ Artisans';
    }
  }, []);

  const artisanName = user?.fullName || 'Ramesh';

  const handleVoiceGreeting = () => {
    setIsPlayingAudio(true);
    Alert.alert(
      '🗣️ Voice Saathi Greeting',
      `"Namaste, ${artisanName}! Welcome back to your workshop. You have 1,114k rupees in earnings, 3 active orders, and 2 new bulk opportunities."`,
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
            No internet connection
          </Text>
        </View>
      )}

      {/* Sleek Minimalist Brand Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerTopRow}>
          {/* Left: App Logo & Brand Title */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/kalakar_setu_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitleMain}>
              Kalakar Setu
            </Text>
          </View>

          {/* Right: Actions */}
          <View style={styles.headerRight}>
            {/* Help Button */}
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => Alert.alert('Help & Support', 'Welcome to Kalakar Setu Artisan Studio. Support Helpline: 1800-120-KALA')}
              activeOpacity={0.7}
              accessibilityLabel="Help"
            >
              <Icon name="helpCircle" size={17} color="#64748B" />
            </TouchableOpacity>

            {/* Notifications Bell */}
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => Alert.alert('Notifications', '1. ₹1,200 payout processed\n2. 5-star review received')}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <Icon name="bellOutline" size={17} color="#64748B" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Profile Avatar with Online Indicator */}
            <TouchableOpacity
              style={styles.profileAvatarContainer}
              onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
              activeOpacity={0.8}
              accessibilityLabel="Profile"
            >
              <Image
                source={require('../../assets/artisan_3d_avatar.jpg')}
                style={styles.profileAvatarImg}
              />
              <View style={styles.avatarOnlineBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtle Horizontal Divider */}
        <View style={styles.headerDivider} />

        {/* Sub-Header Date Row */}
        <View style={styles.headerDateRow}>
          <Text style={styles.headerDateText}>
            {(() => {
              const now = new Date();
              const daysEn = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
              const monthsEn = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
              return `${daysEn[now.getDay()]}, ${now.getDate()} ${monthsEn[now.getMonth()]}`;
            })()}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Welcome Greeting & Audio Button */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextContainer}>
            <Text variant="headlineMedium" weight="bold" color="#2b2b2b" style={styles.namasteTitle}>
              Namaste, {artisanName}!
            </Text>
            <Text variant="bodySmall" color="#737373" style={styles.workshopSubtitle}>
              Welcome back to your workshop.
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
              EARNINGS
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#e85d2a" style={styles.kpiValue}>
              ₹1,114k
            </Text>
          </View>

          {/* Orders Tile */}
          <View style={styles.kpiCard}>
            <Text variant="caption" weight="bold" color="#737373" style={styles.kpiLabel}>
              ORDERS
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#1b9aaa" style={styles.kpiValue}>
              3
            </Text>
          </View>

          {/* Opps Tile */}
          <View style={styles.kpiCard}>
            <Text variant="caption" weight="bold" color="#737373" style={styles.kpiLabel}>
              OPPS
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
            Create New Product
          </Text>
          <Text variant="caption" color="rgba(255, 255, 255, 0.85)">
            Tap to start with a photo or voice
          </Text>
        </TouchableOpacity>

        {/* 6 Core Killer Features Interactive Showcase */}
        <View style={styles.killerFeaturesSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
                ⚡ 6 Core Killer Features
              </Text>
              <Text variant="caption" color="#737373">
                Tap any feature to experience the live working flow
              </Text>
            </View>
            <View style={styles.liveBadgePill}>
              <Text style={styles.liveBadgeDot}>●</Text>
              <Text variant="caption" weight="bold" color="#16A34A">
                LIVE DEMO
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
                    KILLER #1
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  AI Smart Catalogue
                </Text>
                <Text variant="caption" color="#64748B">
                  Photo + Voice → Auto-clean background & craft recognition
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
                    KILLER #2
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Voice Saathi Interview
                </Text>
                <Text variant="caption" color="#64748B">
                  Conversational AI Q&A in vernacular language (Zero typing)
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
                    KILLER #3
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Explainable Fair Price Advisor
                </Text>
                <Text variant="caption" color="#64748B">
                  Shows WHY: Materials + Labour + Complexity = Suggested Price
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
                    KILLER #4
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Digital Craft Passport
                </Text>
                <Text variant="caption" color="#64748B">
                  QR-linked provenance, artisan audio story & batch traceability
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
                    KILLER #5
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  AI Bulk Order → Smart Cluster
                </Text>
                <Text variant="caption" color="#64748B">
                  5,000 Diya order pooled across 5 local artisans automatically
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
                    KILLER #6
                  </Text>
                </View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Digital Production Brief & Tracking
                </Text>
                <Text variant="caption" color="#64748B">
                  Standardized specs (dimensions, clay) + live collective progress
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
            My Products
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity
              style={styles.viewCatalogBtn}
              onPress={() => navigation.navigate('MarketplaceHome')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewCatalogBtnText}>👀 View in Live Catalog →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.audioSpeakerBtn}
              onPress={() =>
                handleSpeakText(
                  'Your Products. Terracotta Diya selling at 45 rupees per piece, and Handmade Pot at 350 rupees per piece.'
                )
              }
              accessibilityLabel="Read products section aloud"
            >
              <Text style={{ fontSize: 18 }}>🔊</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Snap Scroll Reel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsReel}
        >
          {artisanProducts.map((item) => (
            <View key={item.id} style={styles.productTileCard}>
              <Image
                source={item.imageSource || { uri: item.imageUrl }}
                style={styles.tileImg}
                resizeMode="cover"
              />
              {item.isNewlyListed && (
                <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: '#16A34A', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: 'bold' }}>🟢 LIVE IN CATALOG</Text>
                </View>
              )}
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
            onPress={() => navigation.navigate('MarketplaceHome')}
          >
            <Text style={{ fontSize: 24, color: '#737373', marginBottom: 4 }}>🛍️</Text>
            <Text variant="caption" weight="bold" color="#737373">
              Full Catalog
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
            New Opportunities
          </Text>
          <TouchableOpacity
            style={styles.audioSpeakerBtn}
            onPress={() =>
              handleSpeakText(
                'New Opportunities. Bulk order request from corporate gifting client for 500 hand-painted clay items. Estimated value 25 thousand rupees.'
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
                Bulk Order Request
              </Text>
              <Text variant="bodySmall" color="#147582" style={{ marginTop: 2 }}>
                Corporate gifting client seeking 500 hand-painted clay items.
              </Text>
            </View>
          </View>

          <View style={styles.oppTagsRow}>
            <View style={styles.matchTag}>
              <Text style={{ fontSize: 11, marginRight: 4, color: '#FFFFFF' }}>✓</Text>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                Match: Pottery
              </Text>
            </View>
            <View style={styles.estTag}>
              <Text variant="caption" weight="bold" color="#0E535C">
                Est: ₹25k
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reviewDetailsBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'BulkDealsTab' })}
          >
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              Review Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Schemes & Support Section (Stitch Exact Card) */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color="#2b2b2b">
            Schemes & Support
          </Text>
          <TouchableOpacity
            style={styles.audioSpeakerBtn}
            onPress={() =>
              handleSpeakText(
                'Schemes and Support. Artisan Credit Card. Apply for low interest loans designed specifically for craftspeople.'
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
              '💳 Artisan Credit Card Scheme',
              'Apply for Mudra / PM Vishwakarma low-interest loans (5% subsidised) designed specifically for verified traditional artisans.'
            )
          }
          activeOpacity={0.88}
        >
          <View style={styles.schemeIconCircle}>
            <Text style={{ fontSize: 22 }}>🏛️</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="bodyMedium" weight="bold" color="#2b2b2b">
              Artisan Credit Card
            </Text>
            <Text variant="bodySmall" color="#737373" numberOfLines={2} style={{ marginTop: 2 }}>
              Apply for low-interest loans designed specifically for craftspeople.
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FAF8F5',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8E1',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandTitleMain: {
    fontSize: 23,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerActionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8E1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#ECE8E1',
    marginTop: 8,
    marginBottom: 5,
  },
  headerDateRow: {
    paddingVertical: 1,
  },
  headerDateText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  profileAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'relative',
  },
  profileAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e85d2a',
  },
  avatarOnlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
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
  viewCatalogBtn: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  viewCatalogBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
});
