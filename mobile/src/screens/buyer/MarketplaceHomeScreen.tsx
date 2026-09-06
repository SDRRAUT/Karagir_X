import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text } from '@/components/typography/Text';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';

interface FlashProduct {
  id: string;
  title: string;
  artisan: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  imageUrl: string;
  category: string;
}

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: 'prod_flash_1',
    title: 'Terracotta Diya (Set o...',
    artisan: 'Ramesh Kumbhar, Kolhap...',
    price: 149,
    originalPrice: 299,
    discountBadge: '50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    category: 'POTTERY',
  },
  {
    id: 'prod_flash_2',
    title: 'Handwoven Chande...',
    artisan: 'GI Tagged Chanderi',
    price: 799,
    originalPrice: 1599,
    discountBadge: '50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    category: 'TEXTILE',
  },
  {
    id: 'prod_flash_3',
    title: 'Dhokra Brass Nandi (Authentic)',
    artisan: 'Manglu Baghel, Bastar',
    price: 899,
    originalPrice: 1499,
    discountBadge: '40% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80',
    category: 'METAL',
  },
  {
    id: 'prod_flash_4',
    title: 'Madhubani Handpainted Stole',
    artisan: 'Sunita Devi, Madhubani',
    price: 1299,
    originalPrice: 2500,
    discountBadge: '48% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    category: 'PAINTING',
  },
  {
    id: 'prod_flash_5',
    title: 'Jaipur Blue Pottery Vase',
    artisan: 'Kripal Studio, Jaipur',
    price: 549,
    originalPrice: 999,
    discountBadge: '45% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    category: 'POTTERY',
  },
  {
    id: 'prod_flash_6',
    title: 'Kashmiri Carved Walnut Box',
    artisan: 'Ghulam Rasool, Srinagar',
    price: 1150,
    originalPrice: 2100,
    discountBadge: '45% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    category: 'WOOD',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Top Deals', icon: '🔥', activeColor: '#EA580C', bgColor: '#FFF7ED' },
  { id: 'POTTERY', label: 'Terracotta', icon: '🏺', activeColor: '#7C2D12', bgColor: '#F8FAFC' },
  { id: 'TEXTILE', label: 'Handloom Silk', icon: '🧵', activeColor: '#0369A1', bgColor: '#F8FAFC' },
  { id: 'METAL', label: 'Brass & Metal', icon: '🔔', activeColor: '#B45309', bgColor: '#F8FAFC' },
  { id: 'WOOD', label: 'Wood', icon: '🪵', activeColor: '#4D7C0F', bgColor: '#F8FAFC' },
];

export const MarketplaceHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const addItemToCart = useCartStore((s) => s.addItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Home');

  // Live Flash Deals Countdown Timer (04h 18m 14s)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 14 });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Kalakar Setu ~ Buyer';
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const filteredProducts = FLASH_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Header Bar matching UI Mockup */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Image
              source={require('../../../assets/kalakar_setu_logo.png')}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.appTitle}>
              Kalakar Setu
            </Text>
            <View style={styles.buyerBadgePill}>
              <Text style={styles.buyerBadgeText}>🛍️ BUYER</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => setShowLocationModal(true)}
            activeOpacity={0.7}
          >
            <Text variant="bodySmall" weight="medium" color="#64748B">
              📍 {selectedAddress}
            </Text>
            <Text style={styles.chevronIcon}> ⌵</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowNotificationModal(true)}
            accessibilityLabel="Notifications"
          >
            <Text style={styles.bellEmoji}>🔔</Text>
          </TouchableOpacity>

          {/* Cart Icon with Red Counter Badge */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel="Shopping Cart"
          >
            <Text style={styles.cartEmoji}>🛒</Text>
            <View style={styles.cartBadgeCircle}>
              <Text style={styles.cartBadgeNumber}>{totalCartCount}</Text>
            </View>
          </TouchableOpacity>

          {/* Buyer Avatar */}
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
            accessibilityLabel="Profile Account"
          >
            <Image
              source={require('../../../assets/buyer_3d_avatar.jpg')}
              style={{ width: '100%', height: '100%', borderRadius: 18 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 2. Modern Rounded Search Bar with Voice & Visual Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchMagnifier}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search artisan sarees, blue po..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Voice Search (Mic) */}
          <TouchableOpacity
            style={styles.searchActionButton}
            onPress={() => navigation.navigate('Search')}
            accessibilityLabel="Voice Search"
          >
            <Text style={styles.searchActionEmoji}>🎙️</Text>
          </TouchableOpacity>

          {/* Visual Search (Camera) */}
          <TouchableOpacity
            style={styles.searchActionButton}
            onPress={() => navigation.navigate('CameraPermission')}
            accessibilityLabel="Visual Camera Search"
          >
            <Text style={styles.searchActionEmoji}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Horizontal Category Circular Story Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    {
                      backgroundColor: isSelected ? '#FFF7ED' : '#F8FAFC',
                      borderColor: isSelected ? '#EA580C' : '#E2E8F0',
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                </View>
                <Text
                  variant="caption"
                  weight={isSelected ? 'bold' : 'normal'}
                  color={isSelected ? '#0F172A' : '#475569'}
                  style={styles.categoryLabel}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Diwali Craft Utsav Hero Feature Card */}
        <View style={styles.heroCard}>
          {/* Subtle Craft Star Watermark in Background */}
          <View style={styles.watermarkStarContainer}>
            <Text style={styles.watermarkStar}>★</Text>
          </View>

          {/* Top Pill Badges */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.diwaliPill}>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                DIWALI CRAFT UTSAV
              </Text>
            </View>
            <View style={styles.festiveHubPill}>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                ✨ Festive Hub
              </Text>
            </View>
          </View>

          {/* Headline */}
          <Text variant="headlineMedium" weight="bold" color="#FFFFFF" style={styles.heroTitle}>
            100% Direct from Rural Master Artisans
          </Text>

          {/* Subtitle */}
          <Text variant="bodySmall" color="#FDE68A" style={styles.heroSubtitle}>
            Zero commission markup. Pure handloom & handcraft with authentic GI pedigree.
          </Text>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.shopDirectBtn}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.88}
          >
            <Text variant="bodyMedium" weight="bold" color="#7C2D12">
              Shop Direct →
            </Text>
          </TouchableOpacity>
        </View>

        {/* ⚡ 6 Core Killer Features Interactive Showcase Hub */}
        <View style={styles.killerHubContainer}>
          <View style={styles.killerHubHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color="#0F172A">
                ⚡ 6 Core Killer Features
              </Text>
              <Text variant="caption" color="#64748B">
                Tap any feature to launch the live working experience
              </Text>
            </View>
            <View style={styles.livePill}>
              <Text style={styles.liveDot}>●</Text>
              <Text variant="caption" weight="bold" color="#16A34A">
                INTERACTIVE
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
              <View style={[styles.killerIconBox, { backgroundColor: '#FFEDD5' }]}>
                <Text style={{ fontSize: 20 }}>📸</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#EA580C', backgroundColor: '#FFF7ED' }]}>
                  KILLER #1 • CATALOGUE
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  AI Smart Catalogue
                </Text>
                <Text variant="caption" color="#64748B">
                  Photo + Voice → Auto-clean background & craft categorization
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>

            {/* 2. Voice Saathi Interview */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('VoiceFollowUp')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Text style={{ fontSize: 20 }}>🤖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#D97706', backgroundColor: '#FFFBEB' }]}>
                  KILLER #2 • VOICE SAATHI
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  AI Interview / Voice Saathi
                </Text>
                <Text variant="caption" color="#64748B">
                  Conversational Q&A in artisan's language (Zero typing)
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>

            {/* 3. Explainable Fair Price Advisor */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('PricingRecommendation')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Text style={{ fontSize: 20 }}>💰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#16A34A', backgroundColor: '#F0FDF4' }]}>
                  KILLER #3 • FAIR PRICING
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Explainable Fair Price Advisor
                </Text>
                <Text variant="caption" color="#64748B">
                  Shows WHY: Material + Time + Complexity = Suggested Price
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>

            {/* 4. Digital Craft Passport */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() => navigation.navigate('PublishSuccess')}
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconBox, { backgroundColor: '#E0E7FF' }]}>
                <Text style={{ fontSize: 20 }}>🏛️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#4F46E5', backgroundColor: '#EEF2FF' }]}>
                  KILLER #4 • CRAFT PASSPORT
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  GI & Digital Craft Passport
                </Text>
                <Text variant="caption" color="#64748B">
                  QR-linked provenance, audio story, and batch verification
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>

            {/* 5. AI Bulk Order & Smart Cluster */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() =>
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' })
              }
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconBox, { backgroundColor: '#FCE7F3' }]}>
                <Text style={{ fontSize: 20 }}>🏢</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#DB2777', backgroundColor: '#FDF2F8' }]}>
                  KILLER #5 • SMART CLUSTER
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  AI Bulk Order → Smart Cluster
                </Text>
                <Text variant="caption" color="#64748B">
                  5,000 Units order pooled across 5 local artisans automatically
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>

            {/* 6. Production Brief + Collective Tracking */}
            <TouchableOpacity
              style={styles.killerCard}
              onPress={() =>
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' })
              }
              activeOpacity={0.88}
            >
              <View style={[styles.killerIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Text style={{ fontSize: 20 }}>📋</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.killerTag, { color: '#0284C7', backgroundColor: '#F0F9FF' }]}>
                  KILLER #6 • BRIEF & TRACKING
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Production Brief & Collective Tracking
                </Text>
                <Text variant="caption" color="#64748B">
                  Shared specs (dimensions, clay) + unified live progress view
                </Text>
              </View>
              <Text style={styles.killerArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Artisan Flash Deals Section Header with Timer */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.flashTitleRow}>
              <Text style={styles.lightningIcon}>⚡</Text>
              <Text variant="bodyLarge" weight="bold" color="#0F172A" style={styles.sectionTitle}>
                Artisan Flash Deals
              </Text>
            </View>
            <Text variant="caption" color="#64748B" style={styles.sectionSubtitle}>
              Limited batch studio clearances
            </Text>
          </View>

          {/* Live Timer Pill */}
          <View style={styles.timerPill}>
            <Text style={styles.clockIcon}>🕒</Text>
            <Text variant="caption" weight="bold" color="#334155" style={styles.timerText}>
              {formatTimer()}
            </Text>
          </View>
        </View>

        {/* 6. Product Deal Cards Grid (2-Columns) */}
        <View style={styles.productGrid}>
          {filteredProducts.map((prod) => {
            const wishlisted = isInWishlist(prod.id);
            return (
              <TouchableOpacity
                key={prod.id}
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetail', { productId: prod.id })}
              >
                {/* Product Image Container */}
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: prod.imageUrl }} style={styles.cardImage} resizeMode="cover" />

                  {/* Top-Left Discount Badge */}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{prod.discountBadge}</Text>
                  </View>

                  {/* Wishlist Heart Overlay */}
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() =>
                      toggleWishlist({
                        productId: prod.id,
                        title: prod.title,
                        price: prod.price,
                        craftCategoryName: prod.category,
                        artisanName: prod.artisan,
                        artisanState: 'India',
                        imageUri: prod.imageUrl,
                      })
                    }
                  >
                    <Text style={{ fontSize: 13 }}>{wishlisted ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Card Information */}
                <View style={styles.cardInfo}>
                  <Text variant="caption" color="#64748B" numberOfLines={1} style={styles.cardArtisan}>
                    {prod.artisan}
                  </Text>
                  <Text variant="bodyMedium" weight="bold" color="#0F172A" numberOfLines={1} style={styles.cardTitle}>
                    {prod.title}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text variant="bodyLarge" weight="bold" color="#0F172A">
                      ₹{prod.price}
                    </Text>
                    <Text variant="bodySmall" color="#94A3B8" style={styles.originalPrice}>
                      ₹{prod.originalPrice}
                    </Text>
                  </View>

                  {/* Quick Add Button */}
                  <TouchableOpacity
                    style={styles.quickAddBtn}
                    onPress={() => {
                      addItemToCart({
                        productId: prod.id,
                        title: prod.title,
                        price: prod.price,
                        imageUri: prod.imageUrl,
                        craftCategoryName: prod.category,
                        artisanName: prod.artisan,
                        artisanCluster: prod.artisan,
                        stockType: 'READY_STOCK',
                      });
                    }}
                  >
                    <Text variant="caption" weight="bold" color="#EA580C">
                      + Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 7. Artisan Portal & Direct Guarantee Banner */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeRow}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                Kalakar Setu Direct Escrow Guarantee
              </Text>
              <Text variant="caption" color="#64748B">
                0% Middleman Commission • 100% Direct Payout to Rural SHG Artisans • Authentic GI Certified
              </Text>
            </View>
          </View>

          {/* Quick Switch to Artisan Studio */}
          <TouchableOpacity
            style={styles.artisanStudioBtn}
            onPress={() => {
              useAuthStore.getState().updateProfile({ role: 'ARTISAN' });
            }}
          >
            <Text variant="caption" weight="bold" color="#4338CA">
              🎨 Are you an Artisan? Switch to Seller Studio & Ledger →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location / Mode Selector Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.modalTitle}>
              Select Location & Role
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedAddress('Home');
                setShowLocationModal(false);
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>🏠</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Home (Primary Delivery)
                </Text>
                <Text variant="caption" color="#64748B">
                  Sector 14, New Delhi - 110001
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setSelectedAddress('Studio (Madhubani)');
                setShowLocationModal(false);
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>🎨</Text>
              <View>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Artisan Studio (Sunita Devi)
                </Text>
                <Text variant="caption" color="#64748B">
                  Ranti Village, Madhubani, Bihar - 847211
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowLocationModal(false)}
            >
              <Text variant="bodyMedium" weight="bold" color="#64748B">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notification Modal */}
      <Modal visible={showNotificationModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotificationModal(false)}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.modalTitle}>
              🔔 Notifications
            </Text>
            <View style={styles.notificationItem}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  Diwali Flash Deals Live
                </Text>
                <Text variant="caption" color="#64748B">
                  50% off on handloom silk & authentic terracotta diyas direct from artisans.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowNotificationModal(false)}
            >
              <Text variant="bodyMedium" weight="bold" color="#64748B">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 22,
    letterSpacing: -0.3,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  chevronIcon: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellEmoji: {
    fontSize: 20,
  },
  cartEmoji: {
    fontSize: 20,
  },
  cartBadgeCircle: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeNumber: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4338CA',
  },
  buyerBadgePill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginLeft: 4,
  },
  buyerBadgeText: {
    color: '#4338CA',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchMagnifier: {
    fontSize: 16,
    marginRight: 8,
    color: '#94A3B8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  searchActionButton: {
    padding: 6,
    marginLeft: 4,
  },
  searchActionEmoji: {
    fontSize: 16,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 62,
  },
  categoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#9A3412', // Deep rust/terracotta
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#9A3412',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  watermarkStarContainer: {
    position: 'absolute',
    right: -20,
    bottom: -40,
    opacity: 0.12,
  },
  watermarkStar: {
    fontSize: 220,
    color: '#FFFFFF',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  diwaliPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  festiveHubPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: 23,
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: '90%',
  },
  shopDirectBtn: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flex: 1,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightningIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 17,
  },
  sectionSubtitle: {
    marginTop: 2,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  timerText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 6,
  },
  cardImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0284C7', // Vibrant blue matching mockup
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    padding: 10,
  },
  cardArtisan: {
    fontSize: 11,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  quickAddBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  artisanStudioBtn: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalCloseBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  killerHubContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
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
  killerHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  liveDot: {
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
  killerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  killerTag: {
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  killerArrow: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 4,
  },
});
