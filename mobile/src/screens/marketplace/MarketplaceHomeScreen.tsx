import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Text,
  Card,
  ProductCard,
  SearchInput,
  Chip,
  Icon,
  ProductCardSkeleton,
  EmptyState,
} from '@/components';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import {
  marketplaceService,
  MarketplaceProduct,
  CRAFT_CATEGORIES,
} from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceHome'>;

export const MarketplaceHomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const { filters, setCategoryFilter } = useMarketplaceStore();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getProducts({
        categoryCode: filters.categoryCode,
      });
      setProducts(data);
    } catch (e) {
      console.warn('Failed to load products', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters.categoryCode]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics optional
    }
    loadProducts();
  }, [loadProducts]);

  const handleWishlistToggle = (item: MarketplaceProduct) => {
    toggleWishlist({
      productId: item.id,
      title: item.title.hi,
      price: item.price,
      imageUri: item.images[0],
      craftCategoryName: item.categoryName,
      artisanName: item.artisan.name,
      artisanState: item.artisan.state,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.primary }]}>
      {/* Top Header Bar */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border.subtle }]}>
        <View style={styles.headerLeft}>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.brand.primary}>
            कलाकार सेतु
          </Text>
          <View style={styles.locationRow}>
            <Icon name="truck" size={14} color={theme.colors.text.tertiary} />
            <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.locationText}>
              डिलीवरी: भारत भर में (1.55L+ डाकघर)
            </Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          {/* Wishlist Icon */}
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {
                // Haptics optional
              }
              navigation.navigate('Wishlist');
            }}
            accessibilityRole="button"
            accessibilityLabel="Wishlist"
            hitSlop={8}
          >
            <Icon name="heart" size={24} color={theme.colors.text.primary} />
            {wishlistItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.brand.primary }]}>
                <Text
                  variant="labelMedium"
                  weight="bold"
                  color={theme.colors.text.inverse}
                  style={styles.badgeCount}
                >
                  {wishlistItems.length}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Cart Icon */}
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {
                // Haptics optional
              }
              navigation.navigate('Cart');
            }}
            accessibilityRole="button"
            accessibilityLabel="Cart"
            hitSlop={8}
          >
            <Icon name="bag" size={24} color={theme.colors.text.primary} />
            {totalCartCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.brand.secondary }]}>
                <Text
                  variant="labelMedium"
                  weight="bold"
                  color={theme.colors.text.inverse}
                  style={styles.badgeCount}
                >
                  {totalCartCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
      >
        {/* Search Bar Input */}
        <Pressable
          onPress={() => navigation.navigate('Search')}
          accessibilityRole="search"
          accessibilityLabel="Search craft products"
          style={styles.searchWrapper}
        >
          <SearchInput
            editable={false}
            pointerEvents="none"
            placeholder="शिल्प, साड़ी या कारीगर खोजें..."
            onVoicePress={() => navigation.navigate('Search')}
          />
        </Pressable>

        {/* Hero Craft Banner */}
        <Card
          variant="elevated"
          style={[
            styles.heroBanner,
            { backgroundColor: '#133520' }, // Deep organic forest green
          ]}
        >
          <View style={styles.heroTextCol}>
            <View style={styles.verifiedRow}>
              <Icon name="shieldCheck" size={16} color="#D4AF37" />
              <Text variant="labelMedium" weight="bold" color="#D4AF37" style={styles.verifiedTagText}>
                100% प्रामाणिक व सत्यापित
              </Text>
            </View>
            <Text variant="headlineMedium" weight="bold" color="#FFFFFF" style={styles.heroTitle}>
              सीधे ग्रामीण कारीगरों से खरीदें
            </Text>
            <Text variant="bodySmall" color="rgba(255, 255, 255, 0.85)" style={styles.heroSub}>
              बिना किसी बिचौलिये के। हर खरीद पर डिजिटल शिल्प पासपोर्ट।
            </Text>
          </View>
          <View style={styles.heroIconBadge}>
            <Icon name="sparkles" size={32} color="#D4AF37" />
          </View>
        </Card>

        {/* Categories Strip */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            पारंपरिक शिल्प श्रेणियां
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Categories')}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text variant="bodySmall" weight="semiBold" color={theme.colors.brand.primary}>
              सभी देखें →
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <Chip
            label="सभी शिल्प"
            iconName="sparkles"
            selected={!filters.categoryCode}
            variant="filled"
            onPress={() => setCategoryFilter(null)}
          />

          {CRAFT_CATEGORIES.map((cat) => {
            const isSelected = filters.categoryCode === cat.code;
            return (
              <Chip
                key={cat.code}
                label={cat.nameHi}
                selected={isSelected}
                variant="filled"
                onPress={() => setCategoryFilter(isSelected ? null : cat.code)}
              />
            );
          })}
        </ScrollView>

        {/* Master Artisan Spotlight */}
        <Card variant="surface" style={styles.artisanSpotlight}>
          <View style={styles.artisanRow}>
            <View
              style={[
                styles.artisanAvatar,
                { backgroundColor: theme.colors.brand.primaryLight },
              ]}
            >
              <Icon name="profile" size={28} color={theme.colors.brand.primary} />
            </View>
            <View style={styles.artisanInfo}>
              <View style={styles.spotlightTagRow}>
                <Text
                  variant="labelMedium"
                  weight="bold"
                  color={theme.colors.brand.primary}
                >
                  माह के मास्टर शिल्पकार
                </Text>
              </View>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                सुखराम बघेल • बस्तर, छत्तीसगढ़
              </Text>
              <Text
                variant="bodySmall"
                color={theme.colors.text.secondary}
                style={styles.spotlightBio}
              >
                27 वर्षों से 4000 साल पुरानी ढोकरा लॉस्ट-वैक्स धातु कला के निष्ठावान संरक्षक।
              </Text>
            </View>
          </View>
        </Card>

        {/* Curated Products Section */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            सत्यापित हस्तशिल्प (Verified Crafts)
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            {products.length} उत्पाद
          </Text>
        </View>

        {/* Loading Skeletons */}
        {loading ? (
          <View style={styles.skeletonGrid}>
            <View style={styles.skeletonCol}>
              <ProductCardSkeleton />
            </View>
            <View style={styles.skeletonCol}>
              <ProductCardSkeleton />
            </View>
          </View>
        ) : products.length === 0 ? (
          <EmptyState
            iconName="search"
            title="कोई उत्पाद नहीं मिला"
            description="इस श्रेणी में अभी कोई हस्तशिल्प उपलब्ध नहीं है।"
            actionLabel="सभी शिल्प देखें"
            onPressAction={() => setCategoryFilter(null)}
          />
        ) : (
          <View style={styles.productsGrid}>
            {products.map((item) => (
              <View key={item.id} style={styles.productCardWrapper}>
                <ProductCard
                  id={item.id}
                  title={item.title.hi}
                  price={item.price}
                  imageUrl={item.images[0]}
                  artisanName={item.artisan.name}
                  artisanRegion={item.artisan.state}
                  hasGiTag={!!item.passport?.isVerified}
                  giTagName="GI TAG"
                  isWishlisted={isInWishlist(item.id)}
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                  onWishlistToggle={() => handleWishlistToggle(item)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    fontSize: 10,
    lineHeight: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchWrapper: {
    marginBottom: 20,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 11,
  },
  heroTitle: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSub: {
    lineHeight: 18,
  },
  heroIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryScroll: {
    paddingBottom: 20,
    gap: 6,
  },
  artisanSpotlight: {
    padding: 16,
    marginBottom: 24,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanInfo: {
    flex: 1,
    marginLeft: 14,
  },
  spotlightTagRow: {
    marginBottom: 2,
  },
  spotlightBio: {
    marginTop: 4,
    lineHeight: 18,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  skeletonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  skeletonCol: {
    width: '48%',
  },
});
