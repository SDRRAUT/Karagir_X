import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import { MelaModeModal } from './components/MelaModeModal';
import { B2BBulkModal } from './components/B2BBulkModal';
import { FairPriceCalculatorModal } from './components/FairPriceCalculatorModal';
import { CraftPassportModal } from './components/CraftPassportModal';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import { useCatalogStore } from '@/store/useCatalogStore';
import { useOrderStore } from '@/store/useOrderStore';

const { width } = Dimensions.get('window');

export const ArtisanHomeScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { t, isHindi, langKey } = useTranslation();
  const artisanProducts = useCatalogStore((s) => s.artisanProducts);
  const totalListingsCount = useCatalogStore((s) => s.totalListingsCount);
  const orders = useOrderStore((s) => s.orders);

  const [showMelaModal, setShowMelaModal] = useState(false);
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [showFairPriceModal, setShowFairPriceModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  const artisanName = user?.fullName || (isHindi ? 'रमेश' : 'Ramesh');

  const handleSpeak = (textEn: string, textHi: string) => {
    realisticVoiceService.speak(isHindi ? textHi : textEn, {
      language: isHindi ? 'hi-IN' : 'en-IN',
      rate: 0.95,
    });
  };

  const quickActions = [
    { id: 'create', iconName: 'camera' as const, label: t.nav.create, color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', action: () => navigation?.navigate?.('CreateTab') },
    { id: 'saathi', iconName: 'microphone' as const, label: isHindi ? 'साथी' : 'Saathi', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', action: () => navigation?.navigate?.('SaathiTab') },
    { id: 'orders', iconName: 'package' as const, label: t.nav.orders, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', action: () => navigation?.navigate?.('OrdersTab', { section: 'orders' }) },
    { id: 'khata', iconName: 'wallet' as const, label: t.nav.khata, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', action: () => navigation?.navigate?.('OrdersTab', { section: 'khata' }) },
    { id: 'mela', iconName: 'compass' as const, label: t.artisan.melaModeTitle, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', action: () => setShowMelaModal(true) },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. Top Profile Bar (Inspired by Reference Mockup) */}
      <View style={styles.topProfileBar}>
        <TouchableOpacity
          style={styles.profileInfoRow}
          onPress={() => navigation?.navigate?.('ProfileTab')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarWithRing}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>👨‍🎨</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>✓</Text>
            </View>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.greetingHeading}>
              {isHindi ? `नमस्ते, ${artisanName} जी!` : `Hello, ${artisanName}!`}
            </Text>
            <Text style={styles.greetingSubtext}>
              {user?.district ? `${user.district} Studio` : (isHindi ? 'कोल्हापुर कार्यशाला' : 'Verified Artisan Studio')} • 94%
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActionButtons}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() =>
              handleSpeak(
                `Namaste ${artisanName}! Today is a productive day. Your earnings today are 2,400 rupees. You have 2 new orders waiting for acceptance.`,
                `नमस्ते ${artisanName} जी! आज का दिन शुभ है। आज आपकी कमाई दो हज़ार चार सौ रुपये हुई है। दो नए ऑर्डर स्वीकार करने हेतु लंबित हैं।`
              )
            }
            activeOpacity={0.75}
            accessibilityLabel="Audio Listen"
          >
            <Icon name="speaker" size={17} color="#EA580C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() => navigation?.navigate?.('OrdersTab')}
            activeOpacity={0.75}
            accessibilityLabel="Notifications"
          >
            <Icon name="bellOutline" size={18} color="#0F172A" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* Search / Filter Bar (Pill style from reference) */}
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholderText}>
            {isHindi ? 'ऑर्डर्स, क्राफ्ट्स, बाज़ार भाव खोजें...' : 'Search orders, crafts, mandi rates...'}
          </Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('OrdersTab')}>
            <Icon name="filter" size={15} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* 2. Hero Earnings Card (Inspired by Reference Hero Card with dark pill button) */}
        <View style={styles.heroCard}>
          <View style={styles.heroBackgroundWave} />
          <View style={styles.watermarkStarContainer}>
            <Text style={styles.watermarkStar}>★</Text>
          </View>

          {/* Top Row: Badge + Action Icon */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroStudioBadge}>
              <View style={styles.heroStudioDot} />
              <Text style={styles.heroStudioBadgeText}>
                {t.artisan.badge}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TouchableOpacity
                style={styles.heroAudioPill}
                onPress={() =>
                  handleSpeak(
                    "Today you have earned 2,400 rupees, 30 percent higher than yesterday. 2,892 rupees is safe in escrow.",
                    'आज आपने 2,400 रुपये कमाए हैं, कल से 30% ज्यादा। 2,892 रुपये एस्क्रो में सुरक्षित हैं।'
                  )
                }
              >
                <Icon name="speaker" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.heroAudioPillText}>{t.artisan.listenAudio}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroArrowCircle}
                onPress={() => navigation?.navigate?.('OrdersTab', { section: 'khata' })}
              >
                <Icon name="arrowRight" size={14} color="#C2410C" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Middle: Amount */}
          <Text style={styles.heroEarningsLabel}>{t.artisan.todayEarningsCard}</Text>
          <Text style={styles.heroEarningsAmount}>₹ 2,400</Text>
          <Text style={styles.heroArtisanIdText}>
            {artisanName} • {isHindi ? 'आईडी' : 'Artisan ID'}: #KS-8492 • {user?.district || 'Kolhapur'}
          </Text>

          {/* Bottom Row: Escrow / Growth on Left, Signature Dark Pill on Right */}
          <View style={styles.heroBottomRow}>
            <View style={styles.heroMetricsGroup}>
              <View style={styles.growthPill}>
                <Text style={styles.growthPillText}>📈 +30%</Text>
              </View>
              <View style={styles.escrowGroup}>
                <Icon name="shieldCheck" size={13} color="#FEF3C7" style={{ marginRight: 3 }} />
                <Text style={styles.escrowGroupText}>{t.artisan.escrowProtectedSub}</Text>
              </View>
            </View>

            {/* Signature Dark Pill Button from Reference Image */}
            <TouchableOpacity
              style={styles.heroDarkPillBtn}
              onPress={() => navigation?.navigate?.('OrdersTab', { section: 'khata' })}
              activeOpacity={0.85}
            >
              <Text style={styles.heroDarkPillText}>
                {isHindi ? 'खाता देखें' : 'View Khata'} ❯
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Category / Quick Actions Row (Rounded Pastel Cards from Reference Screen 1) */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              {isHindi ? 'त्वरित सेवाएं' : 'Instant Services'}
            </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('CreateTab')}>
              <Text style={styles.seeAllText}>{isHindi ? 'सभी देखें' : 'View All'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pastelCardsRow}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.pastelCard, { backgroundColor: item.bg, borderColor: item.border }]}
                onPress={item.action}
                activeOpacity={0.8}
              >
                <View style={styles.pastelIconContainer}>
                  <Icon name={item.iconName} size={20} color={item.color} />
                </View>
                <Text numberOfLines={1} style={styles.pastelCardLabel}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pagination dots from reference */}
          <View style={styles.paginationDotsRow}>
            <View style={styles.activeDotPill} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>
        </View>

        {/* 4. Split 2-Card Innovation Row (Inspired by Reference Screen 2: "Our Agents" & "Chat with expert") */}
        <View style={styles.splitRow}>
          {/* Card 1: 🤝 Cluster Virtual Factory with Stacked Avatars */}
          <TouchableOpacity
            style={styles.splitCardLeft}
            onPress={() => setShowB2BModal(true)}
            activeOpacity={0.85}
          >
            <View style={styles.splitCardBadge}>
              <Text style={styles.splitCardBadgeText}>⭐ {isHindi ? 'कारीगर क्लस्टर' : 'Artisan Clusters'}</Text>
            </View>
            <Text style={styles.splitCardSub}>
              {isHindi ? '15 किमी के 10 कारीगर जुड़े हैं' : '15km cluster connected for bulk orders'}
            </Text>

            {/* Stacked Circular Avatars from Reference Image */}
            <View style={styles.stackedAvatarsRow}>
              <View style={[styles.stackedAvatar, { backgroundColor: '#FFEDD5', zIndex: 4 }]}>
                <Text style={styles.stackedAvatarEmoji}>👨‍🎨</Text>
              </View>
              <View style={[styles.stackedAvatar, { backgroundColor: '#FEE2E2', marginLeft: -10, zIndex: 3 }]}>
                <Text style={styles.stackedAvatarEmoji}>👩‍🎨</Text>
              </View>
              <View style={[styles.stackedAvatar, { backgroundColor: '#E0E7FF', marginLeft: -10, zIndex: 2 }]}>
                <Text style={styles.stackedAvatarEmoji}>👨‍🌾</Text>
              </View>
              <View style={[styles.stackedAvatarCount, { marginLeft: -10, zIndex: 1 }]}>
                <Text style={styles.stackedAvatarCountText}>+12</Text>
              </View>
            </View>

            <Text style={styles.splitCardActionLink}>
              {isHindi ? 'बल्क ऑर्डर देखें →' : 'View Bulk RFQ →'}
            </Text>
          </TouchableOpacity>

          {/* Card 2: 🎙️ Voice Saathi AI */}
          <TouchableOpacity
            style={styles.splitCardRight}
            onPress={() => navigation?.navigate?.('SaathiTab')}
            activeOpacity={0.85}
          >
            <View style={styles.saathiIconCircle}>
              <Icon name="microphone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.splitCardRightTitle}>
              {isHindi ? 'साथी से पूछें' : 'Chat with Saathi'}
            </Text>
            <Text style={styles.splitCardRightSub}>
              {isHindi ? 'बोलो और बिकाओ' : 'Voice AI Assistant'}
            </Text>
            <Text style={styles.splitCardActionLinkRight}>
              {isHindi ? 'शुरू करें →' : 'Start Voice →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. Quick Actions / Urgent Tasks List (Warm Amber Card Container) */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              {isHindi ? 'त्वरित कार्य' : 'Quick Actions'}
            </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('OrdersTab')}>
              <Text style={styles.seeAllText}>{isHindi ? 'सभी देखें' : 'See All'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainerCard}>
            {/* Row 1: Urgent Orders Subcard */}
            <TouchableOpacity
              style={styles.listRowCardOrange}
              onPress={() => navigation?.navigate?.('OrdersTab', { section: 'orders' })}
              activeOpacity={0.8}
            >
              <View style={[styles.listIconBox, { backgroundColor: '#FFEDD5' }]}>
                <Icon name="package" size={20} color="#EA580C" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.listRowTitle}>
                  {t.artisan.newOrdersAlert}
                </Text>
                <Text style={styles.listRowSub}>
                  ⏰ {t.artisan.hoursLeftToAccept}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.listRowMetric}>+₹1,200</Text>
                <View style={styles.darkListPillBtn}>
                  <Text style={styles.darkListPillText}>{isHindi ? 'स्वीकारें' : 'Accept'} ❯</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Row 2: Escrow Protected Balance Subcard */}
            <TouchableOpacity
              style={styles.listRowCardGreen}
              onPress={() => navigation?.navigate?.('OrdersTab', { section: 'khata' })}
              activeOpacity={0.8}
            >
              <View style={[styles.listIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Icon name="shieldCheck" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.listRowTitle}>
                  {isHindi ? 'एस्क्रो सुरक्षित फंड' : 'Escrow Protected Fund'}
                </Text>
                <Text style={styles.listRowSub}>
                  {isHindi ? 'ऑर्डर डिलीवरी पर बैंक में' : 'Auto-release on delivery'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.listRowMetric, { color: '#16A34A' }]}>₹2,892</Text>
                <Text style={styles.escrowStatusSub}>🔒 {isHindi ? 'सुरक्षित' : 'Secured'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. AI Smart Tip Card (Emerald Mint Demand Intel Card) */}
        <View style={styles.smartTipCardContainer}>
          <View style={styles.tipTagRow}>
            <View style={styles.tipTagPill}>
              <Icon name="sparkles" size={11} color="#15803D" style={{ marginRight: 3 }} />
              <Text style={styles.tipTagPillText}>AI DEMAND INTEL</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleSpeak(
                  'Diwali is in 45 days. Start crafting terracotta diyas. Estimated profit on 250 units is 18,750 rupees.',
                  'दीपावली 45 दिनों में है। टेराकोटा दीया बनाना शुरू करें। 250 इकाइयों पर 18,750 रुपये अनुमानित लाभ है।'
                )
              }
              style={styles.tipAudioIconBtn}
            >
              <Icon name="speaker" size={14} color="#16A34A" />
            </TouchableOpacity>
          </View>

          <Text style={styles.tipMainTitle}>🪔 {t.artisan.smartTipFestival}</Text>
          <Text style={styles.tipDescription}>{t.artisan.smartTipAction}</Text>

          <View style={styles.tipProfitPillRow}>
            <Text style={styles.tipProfitPillLabel}>{t.artisan.estimatedBatchProfit}:</Text>
            <Text style={styles.tipProfitPillVal}>₹18,750 (250 Units)</Text>
          </View>

          {/* Signature Dark Pill Button */}
          <TouchableOpacity
            style={styles.darkActionPillButton}
            onPress={() => navigation?.navigate?.('CreateTab')}
            activeOpacity={0.85}
          >
            <View style={styles.darkActionPillCircle}>
              <Icon name="refresh" size={14} color="#16A34A" />
            </View>
            <Text style={styles.darkActionPillButtonText}>
              {t.artisan.startCraftingBatch} ❯❯
            </Text>
          </TouchableOpacity>
        </View>

        {/* 7. Kaarigar Passport & Digital ID Card (Inspired by Reference Screen 3: "Personality Data ID Card with QR") */}
        <View style={styles.passportCardSection}>
          <TouchableOpacity
            style={styles.passportDigitalCard}
            onPress={() => setShowPassportModal(true)}
            activeOpacity={0.88}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.passportHeaderTag}>
                <Icon name="shieldCheck" size={12} color="#4338CA" style={{ marginRight: 4 }} />
                <Text style={styles.passportHeaderTagText}>KAARIGAR PASSPORT ID</Text>
              </View>
              <Text style={styles.passportNameTitle}>{artisanName}</Text>
              <Text style={styles.passportIdText}>ID: #KS-IN-8492 • Level 2 Certified</Text>
              <Text style={styles.passportSchemeText}>
                🏛️ {isHindi ? 'PM विश्वकर्मा योजना पात्र' : 'PM Vishwakarma Eligible (₹1 Lakh)'}
              </Text>
            </View>

            {/* Interactive QR Code Container like Reference Screen 3 */}
            <View style={styles.qrCodeBadgeBox}>
              <View style={styles.qrCodePattern}>
                <Text style={styles.qrSymbolText}>▦</Text>
              </View>
              <Text style={styles.qrTapToScanText}>SCAN QR</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 8. My Shop Snapshot (4 Color-Coded KPI Tiles) */}
        <View style={styles.snapshotSection}>
          <Text style={styles.sectionHeaderTitle}>📊 {t.artisan.myShopTitle}</Text>
          <View style={styles.snapshotGrid}>
            <View style={[styles.snapshotTile, styles.snapshotTileBlue]}>
              <Text style={[styles.snapshotVal, { color: '#0284C7' }]}>
                {totalListingsCount || artisanProducts.length}
              </Text>
              <Text style={styles.snapshotLbl}>{t.artisan.productsCountLabel}</Text>
            </View>
            <View style={[styles.snapshotTile, styles.snapshotTileGreen]}>
              <Text style={[styles.snapshotVal, { color: '#16A34A' }]}>
                {artisanProducts.length}
              </Text>
              <Text style={styles.snapshotLbl}>{t.artisan.liveActiveLabel}</Text>
            </View>
            <View style={[styles.snapshotTile, styles.snapshotTilePurple]}>
              <Text style={[styles.snapshotVal, { color: '#7C3AED' }]}>
                ₹{orders.length > 0 ? (orders.reduce((sum, o) => sum + o.totalAmount, 0)).toLocaleString('en-IN') : '8k'}
              </Text>
              <Text style={styles.snapshotLbl}>{t.artisan.thisWeekLabel}</Text>
            </View>
            <View style={[styles.snapshotTile, styles.snapshotTileAmber]}>
              <Text style={[styles.snapshotVal, { color: '#D97706' }]}>⭐ 4.9</Text>
              <Text style={styles.snapshotLbl}>{t.artisan.ratingLabel}</Text>
            </View>
          </View>
        </View>

        {/* 9. Seller's Own Catalog Listings */}
        <View style={styles.listingsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              🏺 {isHindi ? 'मेरी शिल्प सूचियां' : 'My Live Listings'} ({artisanProducts.length})
            </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('CreateTab')}>
              <Text style={styles.seeAllText}>+ {isHindi ? 'नया शिल्प' : 'Add New'}</Text>
            </TouchableOpacity>
          </View>

          {artisanProducts.length === 0 ? (
            <View style={styles.emptyListingsBox}>
              <Text style={{ fontSize: 32, marginBottom: 6 }}>🏺</Text>
              <Text style={styles.emptyListingsTitle}>
                {isHindi ? 'अभी कोई शिल्प सूचीबद्ध नहीं है' : 'No listings added yet'}
              </Text>
              <Text style={styles.emptyListingsSub}>
                {isHindi ? 'कैमरे से फोटो लें और AI कैटलॉग से तुरंत लाइव करें।' : 'Take photos to catalog with AI and publish live.'}
              </Text>
              <TouchableOpacity
                style={styles.createFirstBtn}
                onPress={() => navigation?.navigate?.('CreateTab')}
              >
                <Text style={styles.createFirstBtnText}>+ {isHindi ? 'पहला उत्पाद बनाएं' : 'Create First Listing'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listingsScroll}
            >
              {artisanProducts.map((prod) => (
                <View key={prod.id} style={styles.artisanProductCard}>
                  <Image
                    source={
                      prod.imageUrl
                        ? { uri: prod.imageUrl }
                        : prod.imageSource
                        ? prod.imageSource
                        : { uri: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=400' }
                    }
                    style={styles.artisanProductImg}
                    resizeMode="cover"
                  />
                  <View style={styles.artisanProductInfo}>
                    <Text numberOfLines={1} style={styles.artisanProductName}>
                      {prod.name}
                    </Text>
                    <Text style={styles.artisanProductPrice}>
                      {prod.price}
                    </Text>
                    <View style={styles.liveMarketPill}>
                      <Text style={styles.liveMarketPillText}>
                        🟢 {isHindi ? 'बाज़ार में लाइव' : 'Live on Market'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Mela Mode Interactive Modal */}
      <MelaModeModal visible={showMelaModal} onClose={() => setShowMelaModal(false)} />

      {/* B2B Bulk Interactive Modal */}
      <B2BBulkModal visible={showB2BModal} onClose={() => setShowB2BModal(false)} />

      {/* Fair Price Calculator Modal */}
      <FairPriceCalculatorModal
        visible={showFairPriceModal}
        onClose={() => setShowFairPriceModal(false)}
      />

      {/* QR Craft Passport Modal */}
      <CraftPassportModal
        visible={showPassportModal}
        onClose={() => setShowPassportModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topProfileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWithRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  greetingHeading: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  greetingSubtext: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  headerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 140,
    gap: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchPlaceholderText: {
    flex: 1,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#C2410C',
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#C2410C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 5,
  },
  heroBackgroundWave: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  watermarkStarContainer: {
    position: 'absolute',
    right: -25,
    bottom: -45,
    opacity: 0.1,
  },
  watermarkStar: {
    fontSize: 200,
    color: '#FFFFFF',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroStudioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroStudioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FEF3C7',
    marginRight: 6,
  },
  heroStudioBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroAudioPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAudioPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  heroArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEarningsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FED7AA',
    marginTop: 6,
  },
  heroEarningsAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 2,
    letterSpacing: -0.8,
  },
  heroArtisanIdText: {
    fontSize: 10.5,
    color: '#FFEDD5',
    fontWeight: '500',
    marginBottom: 12,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    paddingTop: 10,
  },
  heroMetricsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  growthPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  escrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  escrowGroupText: {
    color: '#FEF3C7',
    fontSize: 11,
    fontWeight: '700',
  },
  heroDarkPillBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  heroDarkPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  categorySection: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#EA580C',
  },
  pastelCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
  },
  pastelCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pastelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pastelCardLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  paginationDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },
  activeDotPill: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EA580C',
  },
  inactiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  splitRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  splitCardLeft: {
    flex: 1.15,
    backgroundColor: '#FEFCE8',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  splitCardBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  splitCardBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#854D0E',
  },
  splitCardSub: {
    fontSize: 10.5,
    color: '#713F12',
    lineHeight: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  stackedAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  stackedAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedAvatarEmoji: {
    fontSize: 13,
  },
  stackedAvatarCount: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedAvatarCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  splitCardActionLink: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    marginTop: 4,
  },
  splitCardRight: {
    flex: 0.85,
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  saathiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
  },
  splitCardRightTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#4C1D95',
    textAlign: 'center',
  },
  splitCardRightSub: {
    fontSize: 10,
    color: '#6B21A8',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  splitCardActionLinkRight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 6,
  },
  listSection: {
    marginTop: 2,
  },
  listContainerCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  listRowCardOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#FED7AA',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  listRowCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.2,
    borderColor: '#BBF7D0',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRowTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  listRowSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  listRowMetric: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  darkListPillBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 3,
  },
  darkListPillText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  escrowStatusSub: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 2,
  },
  smartTipCardContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tipTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tipTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tipTagPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.4,
  },
  tipAudioIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  tipMainTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#064E3B',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 11.5,
    color: '#047857',
    lineHeight: 15,
  },
  tipProfitPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  tipProfitPillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  tipProfitPillVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#047857',
  },
  darkActionPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  darkActionPillCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  darkActionPillButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  passportCardSection: {
    marginTop: 2,
  },
  passportDigitalCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  passportHeaderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 56, 202, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  passportHeaderTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.4,
  },
  passportNameTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  passportIdText: {
    fontSize: 10.5,
    color: '#4338CA',
    fontWeight: '600',
    marginTop: 1,
  },
  passportSchemeText: {
    fontSize: 10.5,
    color: '#312E81',
    fontWeight: '700',
    marginTop: 3,
  },
  qrCodeBadgeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  qrCodePattern: {
    width: 40,
    height: 40,
    backgroundColor: '#1E1B4B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  qrSymbolText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  qrTapToScanText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#4338CA',
  },
  snapshotSection: {},
  snapshotGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  snapshotTile: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  snapshotTileBlue: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOpacity: 0.08,
  },
  snapshotTileGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    shadowColor: '#16A34A',
    shadowOpacity: 0.08,
  },
  snapshotTilePurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.08,
  },
  snapshotTileAmber: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOpacity: 0.08,
  },
  snapshotVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  snapshotLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  listingsSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  emptyListingsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyListingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptyListingsSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  createFirstBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listingsScroll: {
    paddingVertical: 10,
    gap: 12,
  },
  artisanProductCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  artisanProductImg: {
    width: '100%',
    height: 110,
  },
  artisanProductInfo: {
    padding: 10,
  },
  artisanProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  artisanProductPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    marginTop: 2,
  },
  liveMarketPill: {
    marginTop: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  liveMarketPillText: {
    fontSize: 9.5,
    color: '#15803D',
    fontWeight: 'bold',
  },
});
