import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale, setLocale, isOnline, setOnlineStatus } = useAppStore();
  const { user, logout } = useAuthStore();
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinDigits, setPinDigits] = useState('');
  const [joinedClub, setJoinedClub] = useState(false);

  const languages: { code: SupportedLocale; name: string; native: string }[] = [
    { code: 'hi_IN', name: 'Hindi', native: '🇮🇳 हिन्दी' },
    { code: 'en_IN', name: 'English', native: 'English' },
    { code: 'bn_IN', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta_IN', name: 'Tamil', native: 'தமிழ்' },
  ];

  const showcaseCrafts = [
    {
      id: 'sc-1',
      title: 'Terracotta Diyas',
      price: '₹45',
      pack: 'pack of 4',
      badge: 'Active',
      image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-2',
      title: 'Traditional Clay Handi',
      price: '₹350',
      pack: '2.5 L',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-3',
      title: 'Sculpted Planters',
      price: '₹280',
      pack: 'Medium',
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sc-4',
      title: 'Terracotta Bells',
      price: '₹210',
      pack: 'Trio set',
      badge: 'Festive',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const role = user?.role || 'ARTISAN';
  const isBuyer = role === 'BUYER';
  const isFacilitator = role === 'FACILITATOR';
  const roleName = user?.fullName || (isBuyer ? 'Priya Sharma' : isFacilitator ? 'Pooja Verma' : 'Ramesh Kumbhar');
  const roleThemeColor = isBuyer ? '#4338CA' : isFacilitator ? '#16A34A' : theme.colors.terracotta.primary;
  const roleLightBg = isBuyer ? '#EEF2FF' : isFacilitator ? '#F0FDF4' : 'rgba(108, 99, 255, 0.12)';
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
    ? 'Verified Buyer & Collector • Patron Member'
    : isFacilitator
    ? 'Cluster Field Lead • SHG Desk Head'
    : 'Terracotta & Pottery Craftsman • Level 3';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title={isBuyer ? "Buyer Hub" : isFacilitator ? "Sahyogi Desk" : "Kalakar Setu"}
        subtitle={isBuyer ? "Buyer Account & Orders" : isFacilitator ? "Cluster Lead Hub" : "Artisan Account & Hub"}
        showDevanagariLogo={true}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Master Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: isBuyer
                    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                    : isFacilitator
                    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.avatar}
              />
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
                {isBuyer ? 'Verified Buyer' : isFacilitator ? 'Cluster Lead' : 'Kalakar Setu Verified'}
              </Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
              <Text style={{ fontSize: 13, marginRight: 4 }}>📍</Text>
              <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                {isBuyer ? 'GI Certified Patron' : isFacilitator ? '25+ Artisans Covered' : 'GI Region Artisan'}
              </Text>
            </View>
          </View>

          {/* Club / Hub Banner */}
          <View style={[styles.clubBanner, { backgroundColor: roleThemeColor }]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={styles.clubTitleRow}>
                <Text style={{ fontSize: 16, marginRight: 4 }}>✨</Text>
                <Text variant="labelMedium" weight="bold" color="#FFFFFF">
                  {isBuyer ? 'Kalakar Setu Buyer Club' : isFacilitator ? 'Sahyogi Field Lead Desk' : 'Kalakar Artisan Club'}
                </Text>
              </View>
              <Text variant="labelSmall" color="#E0DCFF" style={{ marginTop: 2 }}>
                {isBuyer
                  ? 'Curated artisan drops • express courier dispatch'
                  : isFacilitator
                  ? 'Bulk RFQ facilitation • QC audit desk'
                  : '0% commission orders • 24h fast payouts'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.clubJoinBtn, { backgroundColor: joinedClub ? '#6C63FF' : '#FFFFFF' }]}
              onPress={() => setJoinedClub(!joinedClub)}
              activeOpacity={0.85}
            >
              <Text
                variant="labelSmall"
                weight="bold"
                color={joinedClub ? '#FFFFFF' : roleThemeColor}
              >
                {joinedClub ? 'Joined ✓' : 'Join >'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Utility Grid (2x2) */}
        <View style={styles.utilityGrid}>
          {/* Orders */}
          <TouchableOpacity
            style={styles.utilityTile}
            onPress={() => navigation.navigate('Orders' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.tileTop}>
              <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(108, 99, 255, 0.15)' }]}>
                <Text style={{ fontSize: 18 }}>🚚</Text>
              </View>
              <View style={[styles.tilePill, { backgroundColor: theme.colors.terracotta.primary }]}>
                <Text variant="labelSmall" weight="bold" color="#FFFFFF">
                  3 Active
                </Text>
              </View>
            </View>
            <View>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                My Orders
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                1 in production
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
              <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(0, 104, 116, 0.15)' }]}>
                <Text style={{ fontSize: 18 }}>❤️</Text>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                14 Items
              </Text>
            </View>
            <View>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                Wishlist & Saved
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                Curated ideas
              </Text>
            </View>
          </TouchableOpacity>

          {/* Schemes & Grants */}
          <View style={styles.utilityTile}>
            <View style={styles.tileTop}>
              <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(244, 185, 66, 0.2)' }]}>
                <Text style={{ fontSize: 18 }}>🏛️</Text>
              </View>
              <View style={[styles.tilePill, { backgroundColor: '#FFBF42' }]}>
                <Text variant="labelSmall" weight="bold" color="#3B2600">
                  Active
                </Text>
              </View>
            </View>
            <View>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                Schemes & Grants
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                PM Vishwakarma
              </Text>
            </View>
          </View>

          {/* Voice Saathi */}
          <View style={styles.utilityTile}>
            <View style={styles.tileTop}>
              <View style={[styles.tileIconCircle, { backgroundColor: 'rgba(108, 99, 255, 0.15)' }]}>
                <Text style={{ fontSize: 18 }}>🎙️</Text>
              </View>
              <View style={[styles.tilePill, { backgroundColor: theme.colors.surface.card }]}>
                <Text variant="labelSmall" color={theme.colors.text.secondary}>
                  24/7
                </Text>
              </View>
            </View>
            <View>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                Voice Saathi
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                Hindi & Marathi
              </Text>
            </View>
          </View>
        </View>

        {/* Artisan Finance & Growth */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderTitle}>
            <Text style={{ fontSize: 18, marginRight: 6 }}>💰</Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              Artisan Finance & Growth
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Khata' as any)}>
            <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary}>
              View All ›
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.financeCard}>
          {/* Item 1 */}
          <View style={styles.financeItem}>
            <View style={[styles.financeIconBox, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
              <Text style={{ fontSize: 20 }}>💳</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                  Artisan Mudra Credit
                </Text>
                <View style={[styles.inlineBadge, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                    Instant
                  </Text>
                </View>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                Up to ₹2,00,000 • 0 paperwork via Digital Passport
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

          {/* Item 2 */}
          <View style={styles.financeItem}>
            <View style={[styles.financeIconBox, { backgroundColor: 'rgba(244, 185, 66, 0.15)' }]}>
              <Text style={{ fontSize: 20 }}>🛠️</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                  PM Vishwakarma Toolkit
                </Text>
                <View style={[styles.inlineBadge, { backgroundColor: 'rgba(244, 185, 66, 0.25)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#795600">
                    Govt
                  </Text>
                </View>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                ₹15,000 grant + 5% subsidized interest loan
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

          {/* Item 3 */}
          <TouchableOpacity
            style={styles.financeItem}
            onPress={() => navigation.navigate('Opportunities')}
            activeOpacity={0.8}
          >
            <View style={[styles.financeIconBox, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
              <Text style={{ fontSize: 20 }}>📦</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                  Bulk Order Cluster Advance
                </Text>
                <View style={[styles.inlineBadge, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.terracotta.primary}>
                    Pre-Fund
                  </Text>
                </View>
              </View>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                40% upfront deposit on corporate & festive bulk orders
              </Text>
            </View>
            <Text style={{ fontSize: 18, color: theme.colors.text.tertiary }}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Showcase & Catalog Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              Showcase & Catalog
            </Text>
            <Text variant="labelSmall" color={theme.colors.text.secondary}>
              Your listed handcrafts receiving buyer inquiries
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('MarketplaceHome')}>
            <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary}>
              Manage ›
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

        {/* Add New Craft CTA Button */}
        <Button
          label="+ Add New Craft Listing"
          variant="primary"
          onPress={() => navigation.navigate('CameraCapture')}
          style={styles.addCraftBtn}
        />

        {/* App Settings & Language */}
        <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.settingsTitle}>
          Preferences & Diagnostics
        </Text>

        <Card style={styles.settingsCard}>
          {/* Active Persona / Role Switcher */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            Switch Active Role (Experience Different Interfaces)
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 16 }}>
            {[
              { role: 'BUYER', label: '🛍️ Buyer', title: 'Buyer Hub' },
              { role: 'ARTISAN', label: '🎨 Seller', title: 'Artisan Studio' },
              { role: 'FACILITATOR', label: '🤝 Helper', title: 'Sahyogi Desk' },
            ].map((r) => {
              const isCurrent = (user?.role || 'BUYER') === r.role;
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
                    await useAuthStore.getState().updateProfile({ role: r.role as any });
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
                    {isCurrent ? '● Active' : r.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 10 }]} />

          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            App Language
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
                      backgroundColor: isSelected ? 'rgba(108, 99, 255, 0.08)' : theme.colors.surface.card,
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
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle, marginVertical: 14 }]} />

          {/* Offline Toggle Simulation */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            Network Mode Simulation
          </Text>
          <Button
            label={isOnline ? '🟢 Online Mode (Tap to test offline)' : '🔴 Offline Cache Mode (Tap to restore)'}
            variant={isOnline ? 'outline' : 'secondary'}
            onPress={() => setOnlineStatus(!isOnline)}
            style={{ marginBottom: 12 }}
          />

          {/* Shared Device PIN Pad Switch */}
          <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            Multi-Profile PIN Switcher (Shared Device)
          </Text>
          <Button
            label={showPinPad ? 'Hide Keypad' : 'Show Tactile Keypad'}
            variant="outline"
            onPress={() => setShowPinPad(!showPinPad)}
            style={{ marginBottom: 8 }}
          />

          {showPinPad && (
            <View style={styles.keypadWrapper}>
              <Text variant="labelLarge" weight="bold" align="center" style={{ marginBottom: 12 }}>
                PIN: {pinDigits ? pinDigits.split('').map(() => '●').join(' ') : 'Enter 4 Digits'}
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
            label="Sign Out"
            variant="danger"
            onPress={async () => {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthPhone', params: { role: 'BUYER' } }],
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
    backgroundColor: '#E0DCFF',
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
    backgroundColor: '#E0DCFF',
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
