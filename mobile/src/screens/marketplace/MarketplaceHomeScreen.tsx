import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { marketplaceService, MarketplaceProduct } from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceHome'>;

export const MarketplaceHomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const { filters, setCategoryFilter } = useMarketplaceStore();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);

  useEffect(() => {
    marketplaceService.getProducts({ categoryCode: filters.categoryCode }).then(setProducts);
  }, [filters.categoryCode]);

  const CATEGORY_ITEMS = [
    { code: undefined, label: '🔥 Top Deals', emoji: '🔥' },
    { code: 'POTTERY', label: '🏺 Terracotta', emoji: '🏺' },
    { code: 'TEXTILE', label: '🧵 Handloom', emoji: '🧵' },
    { code: 'METAL', label: '✨ Brass Art', emoji: '✨' },
    { code: 'WOOD', label: '🪵 Woodcraft', emoji: '🪵' },
    { code: 'PAINTING', label: '🎨 Folk Art', emoji: '🎨' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Stitch Fixed Header Bar */}
      <View style={[styles.headerContainer, { backgroundColor: theme.colors.sand[50], borderBottomColor: theme.colors.sand[200] }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.brandGroup}
            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
            accessibilityRole="button"
          >
            <View style={[styles.brandEmblem, { backgroundColor: theme.colors.brand.primary }]}>
              <Text style={styles.brandIcon}>क</Text>
            </View>
            <View>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.brand.primary}>
                Kalakar Setu
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                Direct Artisan Marketplace
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200] }]}
              onPress={() => navigation.navigate('Wishlist')}
              accessibilityLabel="Wishlist"
            >
              <Text style={{ fontSize: 16 }}>🤍</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200] }]}
              onPress={() => navigation.navigate('Cart')}
              accessibilityLabel="Cart"
            >
              <Text style={{ fontSize: 16 }}>🛍️</Text>
              {totalCartCount > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: theme.colors.brand.primary }]}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stitch Search Bar with Mic & Visual Search triggers */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Search')}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200], ...theme.shadows.level1 }]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text variant="bodySmall" color={theme.colors.text.muted} style={styles.searchPlaceholder}>
            Search handmade diyas, Chanderi sarees, brass art...
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.searchActionIcon}>🎙️</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Horizontal Category Squircle Strip (Stitch style) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesStrip}
        >
          {CATEGORY_ITEMS.map((cat, idx) => {
            const isSelected = filters.categoryCode === cat.code;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setCategoryFilter(cat.code || null)}
                style={styles.categoryItem}
                accessibilityRole="button"
                accessibilityLabel={cat.label}
              >
                <View
                  style={[
                    styles.categorySquircle,
                    {
                      backgroundColor: isSelected ? theme.colors.brand.light : theme.colors.surface.card,
                      borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                      ...theme.shadows.level1,
                    },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                </View>
                <Text
                  variant="caption"
                  weight={isSelected ? 'bold' : 'medium'}
                  color={isSelected ? theme.colors.brand.primary : theme.colors.charcoal[900]}
                  style={styles.categoryLabel}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Hero Festive Banner (Craft Utsav) */}
        <View style={styles.bannerContainer}>
          <View style={[styles.heroBanner, { backgroundColor: '#4B44CC', borderColor: '#6C63FF', ...theme.shadows.level2 }]}>
            <View style={styles.bannerContent}>
              <View style={[styles.bannerPill, { backgroundColor: '#FACC15' }]}>
                <Text style={styles.bannerPillText}>GREAT INDIAN CRAFT UTSAV</Text>
              </View>
              <Text variant="headlineMedium" weight="bold" color="#FFFFFF" style={styles.bannerTitle}>
                सीधा कारीगर से, शुद्ध हस्तशिल्प
              </Text>
              <Text variant="caption" color="#D6D3FF" style={styles.bannerSubtitle}>
                100% Fair Price Guaranteed • No Middleman Cut
              </Text>
            </View>
            <Text style={styles.bannerDecorEmoji}>🏺</Text>
          </View>
        </View>

        {/* Meet the Maker Row */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
              कारीगर से मिलें (Meet the Maker)
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              Stories and heritage craft from across India
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              सभी देखें →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Curated Products Grid */}
        <View style={styles.productsGrid}>
          {products.map((item) => {
            const isSaved = isInWishlist(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.productCardTouch}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                accessibilityRole="button"
                accessibilityLabel={item.title.hi}
              >
                <Card style={styles.productCard}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.images[0] }} style={styles.productImage} resizeMode="cover" />
                    <TouchableOpacity
                      style={[styles.wishlistBtn, { backgroundColor: 'rgba(255,255,255,0.85)' }]}
                      onPress={() =>
                        toggleWishlist({
                          productId: item.id,
                          title: item.title.hi,
                          price: item.price,
                          imageUri: item.images[0],
                          craftCategoryName: item.categoryName,
                          artisanName: item.artisan.name,
                          artisanState: item.artisan.state,
                        })
                      }
                    >
                      <Text style={{ fontSize: 14 }}>{isSaved ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardDetails}>
                    <View style={styles.originRow}>
                      <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                        {item.artisan.state} • {item.categoryName.split(' ')[0]}
                      </Text>
                      <Text variant="caption" color={theme.colors.text.secondary}>
                        ⭐ {item.rating}
                      </Text>
                    </View>

                    <Text
                      variant="bodyMedium"
                      weight="bold"
                      color={theme.colors.charcoal[900]}
                      numberOfLines={1}
                      style={styles.productTitle}
                    >
                      {item.title.hi}
                    </Text>

                    <Text variant="caption" color={theme.colors.text.secondary} numberOfLines={1}>
                      द्वारा: {item.artisan.name}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text variant="headlineSmall" weight="bold" color={theme.colors.brand.primary}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </Text>
                      <View style={[styles.fairTag, { backgroundColor: theme.colors.ochre.light }]}>
                        <Text style={styles.fairTagText}>Fair Share ✓</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandEmblem: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
  },
  searchActionIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  categoriesStrip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    width: 68,
  },
  categorySquircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    textAlign: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heroBanner: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bannerPillText: {
    color: '#1A1A2E',
    fontSize: 9,
    fontWeight: 'bold',
  },
  bannerTitle: {
    marginBottom: 2,
  },
  bannerSubtitle: {
    marginTop: 2,
  },
  bannerDecorEmoji: {
    fontSize: 48,
    opacity: 0.9,
    marginLeft: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  productCardTouch: {
    width: '48%',
    marginBottom: 14,
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 130,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    padding: 10,
  },
  originRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productTitle: {
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  fairTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fairTagText: {
    color: '#7C5D00',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
