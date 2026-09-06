import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale, setLocale, isOnline, setOnlineStatus } = useAppStore();
  const { user, activeRole, setActiveRole, updateProfile, logout } = useAuthStore();
  const { t, isHindi } = useTranslation();
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinDigits, setPinDigits] = useState('');
  const [joinedClub, setJoinedClub] = useState(false);

  const languages: { code: SupportedLocale; name: string; native: string }[] = [
    { code: 'hi_IN', name: 'हिन्दी', native: '🇮🇳 हिन्दी' },
    { code: 'en_IN', name: 'English', native: '🇬🇧 English' },
  ];

  const showcaseCrafts = [
    {
      id: 'sc-1',
      title: isHindi ? 'टेराकोटा दीया' : 'Terracotta Diyas',
      price: '₹45',
      pack: isHindi ? '4 का सेट' : 'pack of 4',
      badge: isHindi ? 'सक्रिय' : 'Active',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-2',
      title: isHindi ? 'पारंपरिक मिट्टी की हांडी' : 'Traditional Clay Handi',
      price: '₹350',
      pack: '2.5 L',
      badge: isHindi ? 'सर्वश्रेष्ठ बिक्री' : 'Bestseller',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-3',
      title: isHindi ? 'नक्काशीदार गमले' : 'Sculpted Planters',
      price: '₹280',
      pack: isHindi ? 'मध्यम आकार' : 'Medium',
      badge: isHindi ? 'लोकप्रिय' : 'Popular',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-4',
      title: isHindi ? 'टेराकोटा घंटियां' : 'Terracotta Bells',
      price: '₹210',
      pack: isHindi ? '3 का सेट' : 'Trio set',
      badge: isHindi ? 'त्योहारी' : 'Festive',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const role = activeRole || user?.role || 'ARTISAN';
  const isBuyer = role === 'BUYER';
  const isFacilitator = role === 'FACILITATOR';
  const isArtisan = role === 'ARTISAN';

  const roleName = user?.fullName || (isBuyer ? 'Priya Sharma' : isFacilitator ? 'Pooja Verma' : 'Ramesh Kumbhar');
  const roleThemeColor = isBuyer ? '#4338CA' : isFacilitator ? '#16A34A' : theme.colors.terracotta.primary;
  const roleLightBg = isBuyer ? '#EEF2FF' : isFacilitator ? '#F0FDF4' : 'rgba(234, 88, 12, 0.1)';

  const locationParts = [
    user?.villageName,
    user?.subDistrict,
    user?.district,
    user?.state,
  ].filter(Boolean);
  const roleLocation = locationParts.length > 0
    ? locationParts.join(', ')
    : (isBuyer ? 'Delhi NCR, New Delhi' : isFacilitator ? 'Kolhapur Cluster, Maharashtra' : 'Kolhapur, Maharashtra');

  const roleTagline = isBuyer
    ? t.profile.buyerSubtitle
    : isFacilitator
    ? t.profile.sahyogiSubtitle
    : t.profile.artisanSubtitle;

  const avatarSource = isBuyer
    ? require('../../../assets/buyer_3d_avatar.jpg')
    : isFacilitator
    ? require('../../../assets/sahyogi_3d_avatar.jpg')
    : require('../../../assets/artisan_3d_avatar.jpg');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title={isBuyer ? t.profile.buyerTitle : isFacilitator ? t.profile.sahyogiTitle : t.profile.artisanTitle}
        subtitle={isBuyer ? t.profile.buyerSubtitle : isFacilitator ? t.profile.sahyogiSubtitle : t.profile.artisanSubtitle}
        showDevanagariLogo={true}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Master Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarContainer}>
              <Image source={avatarSource} style={styles.avatar} />
              <View style={[styles.verifiedBadge, { backgroundColor: roleThemeColor }]}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>
                  {roleName}
                </Text>
                <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
                  <Text style={{ fontSize: 14 }}>✏️</Text>
                </TouchableOpacity>
              </View>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                {roleLocation}
              </Text>
              <Text
                variant="labelSmall"
                weight="bold"
                color={roleThemeColor}
                style={{ marginTop: 2 }}
              >
                {roleTagline}
              </Text>
            </View>
          </View>

          {/* Trust Badges */}
          <View style={styles.trustBadgesRow}>
            <View style={[styles.trustBadge, { backgroundColor: roleLightBg }]}>
              <Text style={{ fontSize: 13, marginRight: 4 }}>⭐</Text>
              <Text variant="labelSmall" weight="bold" color={roleThemeColor}>
                {isBuyer ? t.profile.verifiedBuyer : isFacilitator ? t.profile.clusterLead : t.profile.verifiedArtisan}
              </Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
              <Text style={{ fontSize: 13, marginRight: 4 }}>📍</Text>
              <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                {isBuyer ? t.profile.giPatron : isFacilitator ? t.profile.shgCovered : t.profile.giArtisan}
              </Text>
            </View>
          </View>

          {/* Club / Hub Banner */}
          <View style={[styles.clubBanner, { backgroundColor: roleThemeColor }]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={styles.clubTitleRow}>
                <Text style={{ fontSize: 16, marginRight: 4 }}>✨</Text>
                <Text variant="labelMedium" weight="bold" color="#FFFFFF">
                  {isBuyer ? t.profile.buyerClubTitle : isFacilitator ? t.profile.sahyogiClubTitle : t.profile.artisanClubTitle}
                </Text>
              </View>
              <Text variant="labelSmall" color="#E0DCFF" style={{ marginTop: 2 }}>
                {isBuyer ? t.profile.buyerClubDesc : isFacilitator ? t.profile.sahyogiClubDesc : t.profile.artisanClubDesc}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.clubJoinBtn, { backgroundColor: joinedClub ? '#4338CA' : '#FFFFFF' }]}
              onPress={() => setJoinedClub(!joinedClub)}
              activeOpacity={0.85}
            >
              <Text
                variant="labelSmall"
                weight="bold"
                color={joinedClub ? '#FFFFFF' : roleThemeColor}
              >
                {joinedClub ? t.profile.joined : t.profile.join}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ROLE SPECIFIC BODY: BUYER VIEW */}
        {isBuyer && (
          <>
            {/* Buyer Quick Utility Grid (2x2) */}
            <View style={styles.utilityGrid}>
              {/* Orders */}
              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('Orders' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(67, 56, 202, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>🚚</Text>
                  </View>
                  <View style={[styles.tilePill, { backgroundColor: '#4338CA' }]}>
                    <Text variant="labelSmall" weight="bold" color="#FFFFFF">
                      3 {t.common.active}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.myOrders}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? '1 प्रेषण मार्ग में' : '1 in transit'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Wishlist */}
              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('Wishlist')}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>❤️</Text>
                  </View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? '14 शिल्प वस्तुएं' : '14 Items'}
                  </Text>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.wishlist}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? 'पसंदीदा शिल्प' : 'Curated crafts'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Delivery Addresses */}
              <TouchableOpacity style={styles.utilityTile} activeOpacity={0.8}>
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>📍</Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.savedAddresses}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {t.profile.savedAddressesSub}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Payment Methods */}
              <TouchableOpacity style={styles.utilityTile} activeOpacity={0.8}>
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>💳</Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.paymentMethods}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {t.profile.paymentUpiSub}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Buyer Patronage Impact Card */}
            <Card style={styles.financeCard}>
              <View style={styles.financeItem}>
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(67, 56, 202, 0.12)' }]}>
                  <Text style={{ fontSize: 20 }}>🤝</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.artisanImpact}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {t.profile.artisanImpactSub}
                  </Text>
                </View>
                <View style={[styles.inlineBadge, { backgroundColor: '#EEF2FF' }]}>
                  <Text variant="labelSmall" weight="bold" color="#4338CA">
                    {isHindi ? 'संरक्षक' : 'Patron'}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

              <TouchableOpacity
                style={styles.financeItem}
                onPress={() => navigation.navigate('BulkInquiry' as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(244, 185, 66, 0.15)' }]}>
                  <Text style={{ fontSize: 20 }}>📦</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.activeRfq}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {t.profile.activeRfqSub}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* ROLE SPECIFIC BODY: ARTISAN VIEW */}
        {isArtisan && (
          <>
            {/* Quick Utility Grid */}
            <View style={styles.utilityGrid}>
              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('Orders' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(234, 88, 12, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>🚚</Text>
                  </View>
                  <View style={[styles.tilePill, { backgroundColor: theme.colors.terracotta.primary }]}>
                    <Text variant="labelSmall" weight="bold" color="#FFFFFF">
                      3 {t.common.active}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.myOrders}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? '1 उत्पादन प्रगति पर' : '1 in production'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('Khata' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>📒</Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.nav.khata}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {t.artisan.todayEarnings}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Workshop Studio Tile */}
              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => Alert.alert(t.profile.workshopAddress, isHindi ? 'कुंभार गली, पंचगंगा नदी के पास, कोल्हापुर, महाराष्ट्र - 416012' : 'Kumbhar Galli, Near Panchganga, Kolhapur, Maharashtra - 416012')}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(234, 88, 12, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>🏺</Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.workshopAddress}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? 'कोल्हापुर कार्यशाला' : 'Kolhapur Studio'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* PM Vishwakarma Govt Grant */}
              <View style={styles.utilityTile}>
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(244, 185, 66, 0.2)' }]}>
                    <Text style={{ fontSize: 18 }}>🏛️</Text>
                  </View>
                  <View style={[styles.tilePill, { backgroundColor: '#FFBF42' }]}>
                    <Text variant="labelSmall" weight="bold" color="#3B2600">
                      {isHindi ? 'सक्रिय' : 'Active'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {isHindi ? 'पीएम विश्वकर्मा' : 'PM Vishwakarma'}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? 'सरकारी अनुदान' : 'Govt Grant'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Artisan Finance & Growth */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderTitle}>
                <Text style={{ fontSize: 18, marginRight: 6 }}>💰</Text>
                <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                  {t.profile.artisanFinanceTitle}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Khata' as any)}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary}>
                  {t.common.viewAll} ›
                </Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.financeCard}>
              <View style={styles.financeItem}>
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(234, 88, 12, 0.12)' }]}>
                  <Text style={{ fontSize: 20 }}>💳</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.mudraCredit}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {t.profile.mudraCreditSub}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

              <View style={styles.financeItem}>
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                  <Text style={{ fontSize: 20 }}>🛠️</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.pmVishwakarma}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {t.profile.pmVishwakarmaSub}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

              <TouchableOpacity
                style={styles.financeItem}
                onPress={() => navigation.navigate('MainTabs', { screen: 'BulkDealsTab' })}
                activeOpacity={0.8}
              >
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(244, 185, 66, 0.15)' }]}>
                  <Text style={{ fontSize: 20 }}>🤝</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.clusterAdvance}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {t.profile.clusterAdvanceSub}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
              </TouchableOpacity>
            </Card>

            {/* Showcase & Catalog Carousel */}
            <View style={styles.sectionHeader}>
              <View>
                <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                  {t.profile.showcaseTitle}
                </Text>
                <Text variant="labelSmall" color={theme.colors.text.secondary}>
                  {t.profile.showcaseSub}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary}>
                  {t.common.manage} ›
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.showcaseScroll}>
              {showcaseCrafts.map((craft) => (
                <Card key={craft.id} style={styles.craftCard}>
                  <View style={styles.craftImgContainer}>
                    <Image source={{ uri: craft.image }} style={styles.craftImg} />
                    <View style={styles.craftBadge}>
                      <Text variant="labelSmall" weight="bold" color={theme.colors.text.primary}>
                        {craft.badge}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.craftBody}>
                    <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>
                      {craft.title}
                    </Text>
                    <View style={styles.craftPriceRow}>
                      <Text variant="labelLarge" weight="bold" color={theme.colors.terracotta.primary}>
                        {craft.price}
                      </Text>
                      <Text variant="labelSmall" color={theme.colors.text.secondary}>
                        {craft.pack}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>

            <Button
              label={t.profile.addNewCraft}
              variant="primary"
              onPress={() => navigation.navigate('CameraCapture')}
              style={styles.addCraftBtn}
            />
          </>
        )}

        {/* ROLE SPECIFIC BODY: SAHYOGI VIEW */}
        {isFacilitator && (
          <>
            <View style={styles.utilityGrid}>
              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(22, 163, 74, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>📋</Text>
                  </View>
                  <View style={[styles.tilePill, { backgroundColor: '#16A34A' }]}>
                    <Text variant="labelSmall" weight="bold" color="#FFFFFF">
                      {isHindi ? '5 इकाइयां' : '5 Units'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.sahyogi.artisanListTitle}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? 'कोल्हापुर क्लस्टर' : 'Kolhapur Cluster'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.utilityTile}
                onPress={() => navigation.navigate('Fulfillment' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.tileTop}>
                  <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(67, 56, 202, 0.15)' }]}>
                    <Text style={{ fontSize: 18 }}>📦</Text>
                  </View>
                </View>
                <View>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.sahyogi.dispatchBatch}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    {isHindi ? '5,000 इकाइयां' : '5,000 Units'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Sahyogi Lead Desk Operations Card */}
            <Card style={styles.financeCard}>
              <TouchableOpacity
                style={styles.financeItem}
                onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
                activeOpacity={0.8}
              >
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(22, 163, 74, 0.15)' }]}>
                  <Text style={{ fontSize: 20 }}>📋</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {isHindi ? 'सहयोगी लीड डेस्क एवं क्लस्टर नियंत्रण' : 'Sahyogi Lead Desk & Operations'}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {isHindi ? 'डिजिटल ऑनबोर्डिंग, क्यूसी ऑडिट और प्रेषण प्रबंधन' : 'Digital onboarding, QC audits & dispatch coordination'}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

              <View style={styles.financeItem}>
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(22, 163, 74, 0.12)' }]}>
                  <Text style={{ fontSize: 20 }}>🏛️</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.clusterHub}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    {isHindi ? 'पंचगंगा पॉटरी क्लस्टर #CLUST-MHB-01' : 'Panchganga Pottery Cluster #CLUST-MHB-01'}
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

              <View style={styles.financeItem}>
                <View style={[styles.financeIconBox, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
                  <Text style={{ fontSize: 20 }}>🆔</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                    {t.profile.staffId}
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    SHG-MHB-KOL-88421
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Preferences & Settings Section */}
        <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.settingsTitle}>
          {t.profile.preferencesTitle}
        </Text>

        <Card style={styles.settingsCard}>
          {/* Active Role Switcher */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            {t.profile.switchRoleTitle}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
            {[
              { role: 'BUYER', label: `🛍️ ${t.profile.buyerRole}`, title: t.profile.buyerTitle },
              { role: 'ARTISAN', label: `🎨 ${t.profile.artisanRole}`, title: t.profile.artisanTitle },
              { role: 'FACILITATOR', label: `🤝 ${t.profile.sahyogiRole}`, title: t.profile.sahyogiTitle },
            ].map((r) => {
              const isCurrent = role === r.role;
              return (
                <TouchableOpacity
                  key={r.role}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: isCurrent ? theme.colors.terracotta.primary : '#E2E8F0',
                    backgroundColor: isCurrent ? 'rgba(234, 88, 12, 0.08)' : '#FFFFFF',
                  }}
                  onPress={async () => {
                    setActiveRole(r.role as any);
                    await updateProfile({ role: r.role as any });
                    navigation.navigate('MainTabs', { screen: 'HomeTab' });
                  }}
                >
                  <Text
                    variant="labelMedium"
                    weight={isCurrent ? 'bold' : 'medium'}
                    color={isCurrent ? theme.colors.terracotta.primary : '#475569'}
                  >
                    {r.label}
                  </Text>
                  <Text variant="caption" color={isCurrent ? theme.colors.terracotta.primary : '#94A3B8'} style={{ fontSize: 9 }}>
                    {isCurrent ? (isHindi ? '● सक्रिय' : '● Active') : r.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 10 }]} />

          {/* App Language Switcher */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            {t.profile.appLanguage}
          </Text>
          <View style={styles.langGrid}>
            {languages.map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langChip,
                    {
                      borderColor: isSelected ? theme.colors.terracotta.primary : theme.colors.border.subtle,
                      backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.1)' : theme.colors.surface.card,
                    },
                  ]}
                  onPress={() => setLocale(lang.code)}
                  activeOpacity={0.8}
                >
                  <Text
                    variant="labelMedium"
                    weight={isSelected ? 'bold' : 'normal'}
                    color={isSelected ? theme.colors.terracotta.primary : theme.colors.text.primary}
                  >
                    {lang.native}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 14 }]} />

          {/* Network Mode Simulation */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            {t.profile.networkMode}
          </Text>
          <Button
            label={isOnline ? `🟢 ${t.profile.onlineMode}` : `🔴 ${t.profile.offlineMode}`}
            variant={isOnline ? 'outline' : 'secondary'}
            onPress={() => setOnlineStatus(!isOnline)}
            style={{ marginBottom: 12 }}
          />

          {/* Shared Device PIN Switcher */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            {t.profile.multiProfilePin}
          </Text>
          <Button
            label={showPinPad ? t.profile.hideKeypad : t.profile.showKeypad}
            variant="outline"
            onPress={() => setShowPinPad(!showPinPad)}
            style={{ marginBottom: 8 }}
          />

          {showPinPad && (
            <View style={styles.keypadWrapper}>
              <Text variant="labelLarge" weight="bold" align="center" style={{ marginBottom: 12 }}>
                PIN: {pinDigits ? pinDigits.split('').map(() => '●').join(' ') : t.profile.enterPin}
              </Text>
              <TactileKeypad
                onPressDigit={(d) => setPinDigits((prev) => (prev.length < 4 ? prev + d : prev))}
                onPressBackspace={() => setPinDigits((prev) => prev.slice(0, -1))}
                onPressConfirm={() => setPinDigits('')}
              />
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 14 }]} />

          {/* Logout Button */}
          <Button
            label={t.profile.signOut}
            variant="danger"
            onPress={async () => {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthPhone', params: { role } }],
              });
            }}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D6D3FF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  clubBanner: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubJoinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  utilityTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financeCard: {
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  financeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  financeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  showcaseScroll: {
    paddingRight: 16,
    gap: 12,
    paddingBottom: 4,
  },
  craftCard: {
    width: 156,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
  },
  craftImgContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
  },
  craftImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  craftBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  craftBody: {
    padding: 10,
  },
  craftPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  addCraftBtn: {
    marginTop: 16,
    marginBottom: 24,
  },
  settingsTitle: {
    marginTop: 8,
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 16,
    padding: 16,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    width: '48%',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
});

