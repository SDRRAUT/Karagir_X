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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';

interface FlashProduct {
  id: string;
  title: string;
  artisan: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  imageUrl: string;
  category: string;
  state: string;
  giCertified: boolean;
  giNumber: string;
  cluster: string;
}

interface KahaaniStory {
  id: string;
  artisan: string;
  craft: string;
  location: string;
  avatarUrl: string;
  videoThumb: string;
  storyQuote: string;
  duration: string;
  views: string;
}

const KAHAANI_STORIES: KahaaniStory[] = [
  {
    id: 'story_1',
    artisan: 'Radha Devi',
    craft: 'Chanderi Silk',
    location: 'Chanderi, Madhya Pradesh',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    videoThumb: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    storyQuote: 'Every single motif is handwoven on traditional pit looms over 18 days of devotion.',
    duration: '0:15',
    views: '12.4k',
  },
  {
    id: 'story_2',
    artisan: 'Master Ramesh',
    craft: 'Terracotta Molding',
    location: 'Bishnupur, West Bengal',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    videoThumb: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    storyQuote: 'River clay crafted with acoustic hollow chambers that cool water naturally by 8°C.',
    duration: '0:14',
    views: '18.9k',
  },
  {
    id: 'story_3',
    artisan: 'Manglu Baghel',
    craft: 'Lost-Wax Dhokra',
    location: 'Bastar, Chhattisgarh',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    videoThumb: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80',
    storyQuote: '4,000-year-old tribal metallurgy with wild bee honey-wax. No mold is ever reused.',
    duration: '0:16',
    views: '9.8k',
  },
  {
    id: 'story_4',
    artisan: 'Sunita Devi',
    craft: 'Kachni Madhubani',
    location: 'Madhubani, Bihar',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    videoThumb: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    storyQuote: 'Hand-painted with nib pens using herbal extracts of turmeric, indigo, and forest soot.',
    duration: '0:15',
    views: '24.1k',
  },
];

const CRAFT_MAP_STATES = [
  { id: 'ALL', nameEn: 'All India', nameHi: 'संपूर्ण भारत', craft: 'All Crafts', icon: '🇮🇳' },
  { id: 'KASHMIR', nameEn: 'Kashmir', nameHi: 'कश्मीर', craft: 'Pashmina & Walnut', icon: '🏔️' },
  { id: 'GUJARAT', nameEn: 'Kutch Gujarat', nameHi: 'कच्छ गुजरात', craft: 'Rogan Art & Ajrakh', icon: '🏜️' },
  { id: 'BIHAR', nameEn: 'Mithila Bihar', nameHi: 'मिथिला बिहार', craft: 'Madhubani Painting', icon: '🎨' },
  { id: 'WEST_BENGAL', nameEn: 'Bankura Bengal', nameHi: 'बांकुड़ा बंगाल', craft: 'Terracotta Urli', icon: '🏺' },
  { id: 'CHHATTISGARH', nameEn: 'Bastar CG', nameHi: 'बस्तर छ.ग.', craft: 'Lost-Wax Dhokra', icon: '🔔' },
];

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: 'prod_flash_1',
    title: 'Terracotta Diya (Set of 4)',
    artisan: 'Ramesh Kumbhar, Kolhapur',
    price: 149,
    originalPrice: 299,
    discountBadge: '50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    category: 'POTTERY',
    state: 'WEST_BENGAL',
    giCertified: true,
    giNumber: 'GI-IN-0412',
    cluster: 'Bishnupur Clay Cluster',
  },
  {
    id: 'prod_flash_2',
    title: 'Handwoven Chanderi Saree',
    artisan: 'Radha Devi, Chanderi',
    price: 799,
    originalPrice: 1599,
    discountBadge: '50% OFF',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    category: 'TEXTILE',
    state: 'GUJARAT',
    giCertified: true,
    giNumber: 'GI-IN-0078',
    cluster: 'Chanderi Weaver Co-op',
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
    state: 'CHHATTISGARH',
    giCertified: true,
    giNumber: 'GI-IN-0105',
    cluster: 'Bastar Lost-Wax Guild',
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
    state: 'BIHAR',
    giCertified: true,
    giNumber: 'GI-IN-0091',
    cluster: 'Ranti Craft Village',
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
    state: 'GUJARAT',
    giCertified: true,
    giNumber: 'GI-IN-0054',
    cluster: 'Jaipur Heritage Guild',
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
    state: 'KASHMIR',
    giCertified: true,
    giNumber: 'GI-IN-0182',
    cluster: 'Downtown Srinagar Guild',
  },
];

export const MarketplaceHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const addItemToCart = useCartStore((s) => s.addItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const { t, isHindi } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Home');

  // Interactive Modals for Top 8 Killer Buyer Features
  const [activeStory, setActiveStory] = useState<KahaaniStory | null>(null);
  const [showArModal, setShowArModal] = useState(false);
  const [showLiveMelaModal, setShowLiveMelaModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 'c1',
      sender: 'artisan',
      textHi: 'प्रणाम! मैं रमेश कुंभार। इस दीये की मिट्टी हमने गंगा नदी के किनारे से एकत्र की है।',
      textEn: 'Pranam! I am Ramesh Kumbhar. The clay for this lamp was collected from the river bank.',
    },
    {
      id: 'c2',
      sender: 'buyer',
      textHi: 'क्या आप इसमें पारंपरिक सरसों का तेल डालने हेतु सुरक्षित किनारा रख सकते हैं?',
      textEn: 'Can you ensure the wick groove holds traditional mustard oil without spilling?',
    },
    {
      id: 'c3',
      sender: 'artisan',
      textHi: 'बिल्कुल! हम हर दीए को 48 घंटे धूप में सुखाकर भट्ठी में पकाते हैं। रिसाव शून्य है।',
      textEn: 'Absolutely! We sun-dry every diya for 48 hours before wood-firing. Zero leakage.',
    },
  ]);

  const categories = [
    { id: 'all', label: t.buyer.topDeals, icon: '🔥', activeColor: '#EA580C', bgColor: '#FFF7ED' },
    { id: 'POTTERY', label: t.buyer.pottery, icon: '🏺', activeColor: '#7C2D12', bgColor: '#F8FAFC' },
    { id: 'TEXTILE', label: t.buyer.handloom, icon: '🧵', activeColor: '#0369A1', bgColor: '#F8FAFC' },
    { id: 'METAL', label: t.buyer.metal, icon: '🔔', activeColor: '#B45309', bgColor: '#F8FAFC' },
    { id: 'WOOD', label: t.buyer.wood, icon: '🪵', activeColor: '#4D7C0F', bgColor: '#F8FAFC' },
  ];

  // Live Flash Deals Countdown Timer (04h 18m 14s)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 14 });

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = isHindi ? 'कलाकार सेतु ~ खरीदार' : 'Kalakar Setu ~ Buyer';
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
  }, [isHindi]);

  const formatTimer = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return isHindi ? `${h}घं ${m}मि ${s}से` : `${h}h ${m}m ${s}s`;
  };

  const filteredProducts = FLASH_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesState = selectedState === 'ALL' || p.state === selectedState;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesState && matchesSearch;
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const newEntry = {
      id: `c_${Date.now()}`,
      sender: 'buyer',
      textHi: isHindi ? chatMessage : `[स्वचालित अनुवाद]: ${chatMessage}`,
      textEn: isHindi ? `[Auto-Translated]: ${chatMessage}` : chatMessage,
    };
    setChatLog((prev) => [...prev, newEntry]);
    setChatMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Minimalist Luxury Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/kalakar_setu_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.brandTitleContainer}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandTitleMain}>KALAKAR SETU</Text>
              <View style={styles.buyerRolePill}>
                <Text style={styles.buyerRolePillText}>{isHindi ? 'खरीदार' : 'BUYER'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.locationSelector}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.8}
            >
              <Icon name="mapPin" size={11} color="#64748B" />
              <Text variant="caption" color="#64748B" style={styles.deliverToText}>
                {isHindi ? '110001 • ' : '110001 • '}
              </Text>
              <Text variant="caption" weight="bold" color="#0F172A" numberOfLines={1}>
                {selectedAddress}
              </Text>
              <Icon name="chevronDown" size={11} color="#64748B" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowNotificationModal(true)}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Icon name="bellOutline" size={17} color="#64748B" />
          </TouchableOpacity>

          {/* Cart Icon with Red Counter Badge */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
            accessibilityLabel="Shopping Cart"
          >
            <Icon name="cartOutline" size={18} color="#64748B" />
            {totalCartCount > 0 && (
              <View style={styles.cartBadgeCircle}>
                <Text style={styles.cartBadgeNumber}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Buyer Avatar */}
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
            activeOpacity={0.8}
            accessibilityLabel="Profile Account"
          >
            <Image
              source={require('../../../assets/buyer_3d_avatar.jpg')}
              style={styles.avatarImage}
            />
            <View style={styles.avatarOnlineBadge} />
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
            placeholder={t.buyer.searchPlaceholder}
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

        {/* 🌟 BUYER MUST-BUILD #2: "Kahaani" Story-First Browsing (15s Craft Reels) */}
        <View style={styles.kahaaniSection}>
          <View style={styles.kahaaniHeaderRow}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#B45309', letterSpacing: 0.5 }}>
              📖 {isHindi ? 'कारीगर कहानियाँ (15 से. रील)' : 'ARTISAN KAHAANI (15s Reels)'}
            </Text>
            <View style={styles.liveWatchBadge}>
              <Text style={{ fontSize: 10, color: '#EA580C', fontWeight: 'bold' }}>
                ● {isHindi ? 'सीधा कार्यशाला से' : 'Live from Workshop'}
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kahaaniScroll}
          >
            {KAHAANI_STORIES.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.kahaaniStoryCard}
                onPress={() => setActiveStory(story)}
                activeOpacity={0.88}
              >
                <View style={styles.storyImageRing}>
                  <Image source={{ uri: story.videoThumb }} style={styles.storyThumbnail} />
                  <View style={styles.storyPlayIconBox}>
                    <Text style={{ fontSize: 12, color: '#FFFFFF' }}>▶</Text>
                  </View>
                  <View style={styles.storyDurationPill}>
                    <Text style={styles.storyDurationText}>{story.duration}</Text>
                  </View>
                </View>
                <Text style={styles.storyArtisanName} numberOfLines={1}>
                  {story.artisan}
                </Text>
                <Text style={styles.storyCraftName} numberOfLines={1}>
                  {story.craft}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Horizontal Category Circular Story Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
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
          <View style={styles.watermarkStarContainer}>
            <Text style={styles.watermarkStar}>★</Text>
          </View>
          <View style={styles.heroBadgeRow}>
            <View style={styles.diwaliPill}>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                {t.buyer.diwaliHeroBadge}
              </Text>
            </View>
            <View style={styles.festiveHubPill}>
              <Text variant="caption" weight="bold" color="#FFFFFF">
                ✨ {t.buyer.festiveHub}
              </Text>
            </View>
          </View>
          <Text variant="headlineMedium" weight="bold" color="#FFFFFF" style={styles.heroTitle}>
            {t.buyer.heroDirectTitle}
          </Text>
          <Text variant="bodySmall" color="#FDE68A" style={styles.heroSubtitle}>
            {t.buyer.heroDirectSub}
          </Text>
          <TouchableOpacity
            style={styles.shopDirectBtn}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.88}
          >
            <Text variant="bodyMedium" weight="bold" color="#7C2D12">
              {t.buyer.shopDirect}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🌟 BUYER MUST-BUILD #1: AR "Apne Ghar Mein Dekho" (3D Augmented Reality Preview) */}
        <View style={styles.arBannerCard}>
          <View style={styles.arCardContent}>
            <View style={styles.arBadgeRow}>
              <View style={styles.arTagPill}>
                <Text style={styles.arTagText}>👓 AR LIVE PREVIEW</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#1E293B', fontWeight: 'bold' }}>
                {isHindi ? 'सत्य पैमाना 1:1 3D' : 'True 1:1 Scale 3D'}
              </Text>
            </View>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.arTitle}>
              {isHindi ? 'अपने घर में रखकर देखें (AR)' : 'Apne Ghar Mein Dekho'}
            </Text>
            <Text variant="caption" color="#475569" style={styles.arDesc}>
              {isHindi
                ? 'हस्तनिर्मित मूर्तियों एवं टेराकोटा दीपों को खरीदने से पहले अपने कमरे में रखकर वास्तविक आकार देखें।'
                : 'Visualize handcrafted brass idols and terracotta lamps inside your room via phone camera before buying.'}
            </Text>
            <TouchableOpacity
              style={styles.launchArBtn}
              onPress={() => setShowArModal(true)}
              activeOpacity={0.9}
            >
              <Text style={styles.launchArBtnText}>
                ✨ {isHindi ? '3D / AR प्रीव्यू शुरू करें' : 'Launch 3D / AR Room Preview'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ar3dGraphicBox}>
            <Text style={{ fontSize: 48 }}>🏺</Text>
            <View style={styles.ar3dBadge}>
              <Text style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 'bold' }}>360° SPIN</Text>
            </View>
          </View>
        </View>

        {/* 🌟 BUYER MUST-BUILD #5: Interactive Craft Map of India (Explore by State & GI Cluster) */}
        <View style={styles.craftMapCard}>
          <View style={styles.craftMapHeader}>
            <View>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                🗺️ {isHindi ? 'भारत शिल्प मानचित्र' : 'Interactive Craft Map of India'}
              </Text>
              <Text variant="caption" color="#64748B">
                {isHindi ? 'राज्य चुनकर भौगोलिक उपदर्शन (GI) प्रमाणित शिल्प खोजें' : 'Tap states to explore GI-certified heritage clusters'}
              </Text>
            </View>
            <View style={styles.giCountPill}>
              <Text style={{ fontSize: 11, color: '#0369A1', fontWeight: 'bold' }}>
                148 {isHindi ? 'क्लस्टर' : 'Clusters'}
              </Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.craftMapScroll}>
            {CRAFT_MAP_STATES.map((st) => {
              const active = selectedState === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.craftMapStateChip, active && styles.craftMapStateChipActive]}
                  onPress={() => setSelectedState(st.id)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 18, marginBottom: 2 }}>{st.icon}</Text>
                  <Text
                    style={[styles.craftMapStateName, active && styles.craftMapStateNameActive]}
                    numberOfLines={1}
                  >
                    {isHindi ? st.nameHi : st.nameEn}
                  </Text>
                  <Text style={[styles.craftMapSub, active && styles.craftMapSubActive]} numberOfLines={1}>
                    {st.craft}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 🌟 BUYER MUST-BUILD #7: Live Virtual Mela & Real-Time Auction */}
        <TouchableOpacity
          style={styles.liveMelaBanner}
          onPress={() => setShowLiveMelaModal(true)}
          activeOpacity={0.92}
        >
          <View style={styles.liveMelaLeft}>
            <View style={styles.livePulseBadge}>
              <View style={styles.redPulseDot} />
              <Text style={styles.livePulseText}>LIVE MELA</Text>
            </View>
            <Text variant="bodyMedium" weight="bold" color="#FFFFFF" style={{ marginTop: 4 }}>
              {isHindi ? 'बस्तर बेल मेटल शिल्प लाइव मेला एवं नीलामी' : 'Bastar Bell Metal Craft Live Auction'}
            </Text>
            <Text variant="caption" color="#FDE68A">
              420 {isHindi ? 'दर्शक लाइव जुड़े हैं • चालू बोली: ₹1,850' : 'Viewers Live • Current Bid: ₹1,850'}
            </Text>
          </View>
          <View style={styles.joinAuctionBtn}>
            <Text style={styles.joinAuctionText}>{isHindi ? 'भाग लें ›' : 'Join ›'}</Text>
          </View>
        </TouchableOpacity>

        {/* 🌟 BUYER MUST-BUILD #6: AI Gift Recommender (Occasion & Budget) */}
        <View style={styles.giftRecommenderCard}>
          <View style={styles.giftHeaderRow}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>🎁</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {isHindi ? 'एआई उपहार सलाहकार' : 'AI Heritage Gift Recommender'}
              </Text>
              <Text variant="caption" color="#64748B">
                {isHindi ? 'बजट एवं अवसर अनुसार पारंपरिक प्रामाणिक उपहार खोजें' : 'Match authentic crafts by budget, wedding & corporate gifting'}
              </Text>
            </View>
          </View>
          <View style={styles.giftPillsRow}>
            <TouchableOpacity
              style={styles.giftOptionPill}
              onPress={() => {
                setSelectedCategory('POTTERY');
                Alert.alert('🎁 AI Recommendation', isHindi ? 'दीपावली उपहार हेतु: टेराकोटा दीया सेट (₹149)' : 'Recommended for Diwali: Terracotta Diya Set (₹149)');
              }}
            >
              <Text style={styles.giftOptionText}>🪔 {isHindi ? 'दीपावली (₹150-₹500)' : 'Diwali (₹150-₹500)'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.giftOptionPill}
              onPress={() => {
                setSelectedCategory('TEXTILE');
                Alert.alert('🎁 AI Recommendation', isHindi ? 'विवाह उपहार हेतु: चंदेरी सिल्क साड़ी (₹799)' : 'Recommended for Weddings: Handwoven Chanderi Saree (₹799)');
              }}
            >
              <Text style={styles.giftOptionText}>💒 {isHindi ? 'विवाह (₹800-₹2,500)' : 'Weddings (₹800-₹2,500)'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.giftOptionPill}
              onPress={() => {
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' });
              }}
            >
              <Text style={styles.giftOptionText}>🏢 {isHindi ? 'कॉर्पोरेट थोक (100+)' : 'Corporate Bulk (100+)'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ⚡ 6 Core Killer Features Interactive Showcase Hub */}
        <View style={styles.killerHubContainer}>
          <View style={styles.killerHubHeader}>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color="#0F172A">
                ⚡ {t.artisan.coreFeaturesTitle}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.artisan.coreFeaturesSub}
              </Text>
            </View>
            <View style={styles.livePill}>
              <Text style={styles.liveDot}>●</Text>
              <Text variant="caption" weight="bold" color="#16A34A">
                {t.buyer.coreFeaturesInteractive}
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
                  {isHindi ? 'विशेष #1 • कैटलॉग' : 'KILLER #1 • CATALOGUE'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.aiCatalogue}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.aiCatalogueDesc}
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
                  {isHindi ? 'विशेष #2 • आवाज़ साथी' : 'KILLER #2 • VOICE SAATHI'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.voiceSaathiInterview}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.voiceSaathiInterviewDesc}
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
                  {isHindi ? 'विशेष #3 • उचित मूल्य' : 'KILLER #3 • FAIR PRICING'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.fairPriceAdvisor}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.fairPriceAdvisorDesc}
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
                  {isHindi ? 'विशेष #4 • शिल्प पासपोर्ट' : 'KILLER #4 • CRAFT PASSPORT'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.artisan.qrPassport}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.artisan.qrPassportDesc}
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
                  {isHindi ? 'विशेष #5 • क्लस्टर ऑर्डर' : 'KILLER #5 • SMART CLUSTER'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {isHindi ? 'एआई थोक ऑर्डर एवं क्लस्टर' : 'AI Bulk Order → Smart Cluster'}
                </Text>
                <Text variant="caption" color="#64748B">
                  {isHindi ? '5,000 इकाइयों का ऑर्डर 5 स्थानीय कारीगरों में विभाजित' : '5,000 Units order pooled across 5 local artisans'}
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
                  {isHindi ? 'विशेष #6 • उत्पादन विवरण' : 'KILLER #6 • BRIEF & TRACKING'}
                </Text>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {isHindi ? 'डिजिटल उत्पादन विवरण पत्र' : 'Production Brief & Collective Tracking'}
                </Text>
                <Text variant="caption" color="#64748B">
                  {isHindi ? 'मानकीकृत विनिर्देश एवं सामूहिक लाइव प्रगति' : 'Shared specs (dimensions, clay) + unified live progress view'}
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
                {t.buyer.flashDealsTitle}
              </Text>
            </View>
            <Text variant="caption" color="#64748B" style={styles.sectionSubtitle}>
              {t.buyer.flashDealsSubtitle}
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

        {/* 6. Product Deal Cards Grid (2-Columns) with Craft DNA Badges */}
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
                  {/* Craft DNA GI Tag Badge */}
                  <View style={styles.craftDnaPill}>
                    <Text style={{ fontSize: 9.5, color: '#0369A1', fontWeight: '800' }}>
                      🛡️ {prod.giNumber} • {isHindi ? 'जीआई प्रमाणित' : 'GI Tagged'}
                    </Text>
                  </View>

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
                        artisanCluster: prod.cluster,
                        stockType: 'READY_STOCK',
                      });
                    }}
                  >
                    <Text variant="caption" weight="bold" color="#EA580C">
                      + {t.buyer.addToCart}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 7. Artisan Portal & Direct Guarantee Banner + Direct Artisan Chat */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeRow}>
            <Text style={{ fontSize: 24, marginRight: 12 }}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {t.buyer.escrowGuaranteeTitle}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.buyer.escrowGuaranteeSub}
              </Text>
            </View>
          </View>

          {/* 🌟 BUYER MUST-BUILD #8: Direct Artisan Chat with AI Real-Time Translation */}
          <TouchableOpacity
            style={styles.artisanChatActionBtn}
            onPress={() => setShowChatModal(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.artisanChatActionText}>
              💬 {isHindi ? 'कारीगर से सीधी बात करें (स्वचालित अनुवाद)' : 'Direct Artisan Chat (AI Auto-Translated)'}
            </Text>
          </TouchableOpacity>

          {/* Quick Switch to Artisan Studio */}
          <TouchableOpacity
            style={styles.artisanStudioBtn}
            onPress={async () => {
              useAuthStore.getState().setActiveRole('ARTISAN');
              await useAuthStore.getState().updateProfile({ role: 'ARTISAN' });
            }}
          >
            <Text variant="caption" weight="bold" color="#4338CA">
              🎨 {t.buyer.switchToArtisanPrompt}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL 1: Kahaani Full-Screen Story Video Player Modal */}
      <Modal visible={activeStory !== null} transparent animationType="slide">
        <View style={styles.storyModalOverlay}>
          {activeStory && (
            <View style={styles.storyPlayerContainer}>
              <Image source={{ uri: activeStory.videoThumb }} style={styles.storyPlayerBg} resizeMode="cover" />
              <View style={styles.storyTopBar}>
                <View style={styles.storyAuthorRow}>
                  <Image source={{ uri: activeStory.avatarUrl }} style={styles.storyAvatar} />
                  <View>
                    <Text variant="bodyMedium" weight="bold" color="#FFFFFF">
                      {activeStory.artisan}
                    </Text>
                    <Text variant="caption" color="rgba(255,255,255,0.85)">
                      📍 {activeStory.location}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveStory(null)} style={styles.storyCloseBtn}>
                  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.storyBottomQuoteBox}>
                <View style={styles.storyBadgeRow}>
                  <Text style={styles.storyQuoteBadge}>📜 CRAFT KAHAANI</Text>
                  <Text style={{ color: '#FDE68A', fontSize: 11, fontWeight: 'bold' }}>
                    👁️ {activeStory.views} views
                  </Text>
                </View>
                <Text variant="bodyMedium" color="#FFFFFF" style={{ fontStyle: 'italic', marginVertical: 8 }}>
                  "{activeStory.storyQuote}"
                </Text>
                <TouchableOpacity
                  style={styles.storyBuyBtn}
                  onPress={() => {
                    setActiveStory(null);
                    setSelectedCategory('all');
                  }}
                >
                  <Text variant="bodyMedium" weight="bold" color="#7C2D12">
                    🛍️ {isHindi ? 'यह हस्तशिल्प खरीदें' : 'Shop Handcrafted Collection'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* MODAL 2: AR "Apne Ghar Mein Dekho" 3D Room Visualizer Simulation Modal */}
      <Modal visible={showArModal} transparent animationType="fade">
        <View style={styles.arModalOverlay}>
          <View style={styles.arSimulatorCard}>
            <View style={styles.arSimulatorHeader}>
              <View>
                <Text variant="headlineSmall" weight="bold" color="#0F172A">
                  👓 AR Room Visualizer
                </Text>
                <Text variant="caption" color="#64748B">
                  {isHindi ? 'सतह पहचानी गई: फर्श/मेज • पैमाना 1:1' : 'Surface Detected: Floor/Tabletop • 1:1 Scale'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowArModal(false)} style={styles.modalCloseCircle}>
                <Text style={{ fontSize: 18, color: '#64748B', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 3D Room Grid View Simulator */}
            <View style={styles.arCameraCanvas}>
              <View style={styles.arTargetCircle}>
                <Text style={{ fontSize: 72 }}>🏺</Text>
                <View style={styles.arGroundShadow} />
              </View>
              <View style={styles.arDimensionsBadge}>
                <Text style={styles.arDimensionsText}>📏 Height: 24cm • Diameter: 18cm</Text>
              </View>
            </View>

            <View style={styles.arControlsRow}>
              <TouchableOpacity
                style={styles.arControlBtn}
                onPress={() => Alert.alert('💡 Lighting', isHindi ? 'प्रकाश: प्राकृतिक सूर्यप्रकाश चयनित' : 'Lighting set to Warm Sunset Kiln glow')}
              >
                <Text style={styles.arControlBtnText}>☀️ Warm Sunset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arControlBtn}
                onPress={() => Alert.alert('🔄 360 Spin', isHindi ? 'उत्पाद को 90 डिग्री घुमाया गया' : 'Rotated 90° clockwise')}
              >
                <Text style={styles.arControlBtnText}>🔄 360° Rotate</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.arPlaceOrderBtn}
              onPress={() => {
                setShowArModal(false);
                Alert.alert(
                  '✅ Perfect Fit Confirmed',
                  isHindi ? 'यह शिल्प आपके घर के लिए उपयुक्त है! कार्ट में जोड़ा गया।' : 'Item verified in your room scale! Ready for dispatch.'
                );
              }}
            >
              <Text variant="bodyMedium" weight="bold" color="#FFFFFF">
                🛒 {isHindi ? 'पुष्टि करें एवं कार्ट में डालें' : 'Looks Great, Add to Cart (₹149)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Live Virtual Mela Streaming & Auction Modal */}
      <Modal visible={showLiveMelaModal} transparent animationType="slide">
        <View style={styles.melaModalOverlay}>
          <View style={styles.melaStreamCard}>
            <View style={styles.melaStreamHeader}>
              <View style={styles.melaLivePill}>
                <Text style={styles.melaLivePillText}>🔴 LIVE AUCTION</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }}>
                Bastar Bell Metal Master Manglu
              </Text>
              <TouchableOpacity onPress={() => setShowLiveMelaModal(false)}>
                <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Video Stream Placeholder */}
            <View style={styles.melaVideoBox}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80' }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <View style={styles.melaBiddingOverlay}>
                <Text style={styles.currentBidLabel}>CURRENT HIGHEST BID</Text>
                <Text style={styles.currentBidValue}>₹1,850</Text>
                <Text style={styles.currentBidderName}>Bidder: Amit K. (Bangalore)</Text>
              </View>
            </View>

            {/* Auction Action Buttons */}
            <View style={styles.melaActionRow}>
              <TouchableOpacity
                style={styles.bidQuickBtn}
                onPress={() => Alert.alert('🔨 Bid Placed', isHindi ? 'आपकी बोली ₹1,950 दर्ज हो गई है!' : 'Your bid of ₹1,950 has been recorded!')}
              >
                <Text style={styles.bidQuickBtnText}>🔨 {isHindi ? 'बोली लगाएं: ₹1,950' : 'Bid ₹1,950'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bidQuickBtnBuy}
                onPress={() => {
                  setShowLiveMelaModal(false);
                  Alert.alert('⚡ Instant Buy', isHindi ? 'हस्तशिल्प ₹2,200 में खरीदा गया!' : 'Instant Purchase for ₹2,200 Confirmed!');
                }}
              >
                <Text style={styles.bidQuickBtnBuyText}>⚡ {isHindi ? 'तुरंत खरीदें: ₹2,200' : 'Buy Now: ₹2,200'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: Direct Artisan Chat with Real-Time AI Translation */}
      <Modal visible={showChatModal} transparent animationType="slide">
        <View style={styles.chatModalOverlay}>
          <View style={styles.chatCard}>
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }}
                  style={styles.chatAvatar}
                />
                <View>
                  <Text variant="bodyMedium" weight="bold" color="#0F172A">
                    Ramesh Kumbhar (Terracotta Master)
                  </Text>
                  <View style={styles.chatTranslateBadge}>
                    <Text style={styles.chatTranslateBadgeText}>🌐 AI Live Translation: Active</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748B', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatMessagesScroll} contentContainerStyle={{ padding: 12, gap: 10 }}>
              {chatLog.map((m) => {
                const isMe = m.sender === 'buyer';
                return (
                  <View
                    key={m.id}
                    style={[styles.chatBubble, isMe ? styles.chatBubbleBuyer : styles.chatBubbleArtisan]}
                  >
                    <Text
                      variant="bodySmall"
                      weight="bold"
                      color={isMe ? '#FFFFFF' : '#0F172A'}
                    >
                      {isHindi ? m.textHi : m.textEn}
                    </Text>
                    <Text
                      variant="caption"
                      color={isMe ? 'rgba(255,255,255,0.75)' : '#64748B'}
                      style={{ marginTop: 2, fontStyle: 'italic', fontSize: 10 }}
                    >
                      {isHindi ? m.textEn : m.textHi}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatTextInput}
                placeholder={isHindi ? 'कारीगर को संदेश लिखें...' : 'Type message to artisan...'}
                placeholderTextColor="#94A3B8"
                value={chatMessage}
                onChangeText={setChatMessage}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
                <Text style={{ fontSize: 18, color: '#FFFFFF' }}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Location / Mode Selector Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.modalTitle}>
              {t.buyer.locationModalTitle}
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
                  {t.buyer.primaryHomeAddress}
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
                  {t.buyer.artisanStudioAddress}
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
                {t.common.cancel}
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
              🔔 {t.buyer.notificationsTitle}
            </Text>
            <View style={styles.notificationItem}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {t.buyer.notificationDiwaliTitle}
                </Text>
                <Text variant="caption" color="#64748B">
                  {t.buyer.notificationDiwaliDesc}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowNotificationModal(false)}
            >
              <Text variant="bodyMedium" weight="bold" color="#64748B">
                {t.buyer.dismiss}
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
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1EFEA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoImage: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 10,
  },
  brandTitleContainer: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitleMain: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
    color: '#0F172A',
  },
  buyerRolePill: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  buyerRolePillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.4,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    gap: 3,
  },
  deliverToText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadgeCircle: {
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
  cartBadgeNumber: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'relative',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#4338CA',
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
    paddingBottom: 95,
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
  // Kahaani Story Reels Styles
  kahaaniSection: {
    marginBottom: 14,
  },
  kahaaniHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  liveWatchBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  kahaaniScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },
  kahaaniStoryCard: {
    alignItems: 'center',
    width: 74,
  },
  storyImageRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: '#EA580C',
    padding: 2,
    position: 'relative',
    marginBottom: 4,
  },
  storyThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  storyPlayIconBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyDurationPill: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  storyDurationText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  storyArtisanName: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  storyCraftName: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },
  // Categories
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
  // Hero
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#9A3412',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#9A3412',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
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
  // AR Banner
  arBannerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arCardContent: {
    flex: 1,
  },
  arBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  arTagPill: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  arTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  arTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  arDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 10,
  },
  launchArBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  launchArBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  ar3dGraphicBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ar3dBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  // Craft Map of India
  craftMapCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  craftMapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  giCountPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  craftMapScroll: {
    gap: 10,
  },
  craftMapStateChip: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 90,
  },
  craftMapStateChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  craftMapStateName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  craftMapStateNameActive: {
    color: '#1D4ED8',
  },
  craftMapSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },
  craftMapSubActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  // Live Mela Banner
  liveMelaBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  liveMelaLeft: {
    flex: 1,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  livePulseText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  joinAuctionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  joinAuctionText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Gift Recommender
  giftRecommenderCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FDF4FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0ABFC',
    padding: 14,
  },
  giftHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  giftPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  giftOptionPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E879F9',
  },
  giftOptionText: {
    fontSize: 11,
    color: '#86198F',
    fontWeight: 'bold',
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
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
  // Product Grid
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
    backgroundColor: '#0284C7',
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
  craftDnaPill: {
    backgroundColor: '#E0F2FE',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginBottom: 4,
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
  artisanChatActionBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  artisanChatActionText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: 'bold',
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
  // Killer Features Hub
  killerHubContainer: {
    marginHorizontal: 16,
    marginTop: 10,
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
  // Modals
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
  modalCloseCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Story Modal
  storyModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  storyPlayerContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    padding: 20,
  },
  storyPlayerBg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.8,
  },
  storyTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  storyAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  storyCloseBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyBottomQuoteBox: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  storyBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyQuoteBadge: {
    color: '#EA580C',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  storyBuyBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  // AR Modal
  arModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  arSimulatorCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
  },
  arSimulatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  arCameraCanvas: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
  },
  arTargetCircle: {
    alignItems: 'center',
  },
  arGroundShadow: {
    width: 70,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: -8,
  },
  arDimensionsBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  arDimensionsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arControlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  arControlBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  arControlBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  arPlaceOrderBtn: {
    backgroundColor: '#EA580C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  // Mela Modal
  melaModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  melaStreamCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  melaStreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  melaLivePill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  melaLivePillText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: 'bold',
  },
  melaVideoBox: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  melaBiddingOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 10,
    borderRadius: 10,
  },
  currentBidLabel: {
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: 'bold',
  },
  currentBidValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  currentBidderName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  melaActionRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 10,
  },
  bidQuickBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  bidQuickBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bidQuickBtnBuy: {
    flex: 1,
    backgroundColor: '#EA580C',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  bidQuickBtnBuyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Chat Modal
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  chatTranslateBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  chatTranslateBadgeText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: 'bold',
  },
  chatMessagesScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 14,
  },
  chatBubbleBuyer: {
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',
    borderBottomRightRadius: 2,
  },
  chatBubbleArtisan: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 2,
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
  },
  chatSendBtn: {
    backgroundColor: '#4338CA',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
