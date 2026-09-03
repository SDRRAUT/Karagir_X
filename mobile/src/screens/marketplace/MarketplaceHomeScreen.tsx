import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useMarketplaceStore } from '@/store/useMarketplaceStore';
import { marketplaceService, MarketplaceProduct, CRAFT_CATEGORIES } from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceHome'>;

export const MarketplaceHomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const { filters, setCategoryFilter } = useMarketplaceStore();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);

  useEffect(() => {
    marketplaceService.getProducts({ categoryCode: filters.categoryCode }).then(setProducts);
  }, [filters.categoryCode]);

  const renderProductItem = ({ item }: { item: MarketplaceProduct }) => {
    const isSaved = isInWishlist(item.id);

    return (
      <TouchableOpacity
        style={styles.productCardTouch}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        accessibilityRole="button"
        accessibilityLabel={item.title.hi}
      >
        <Card style={styles.productCard}>
          <Image source={{ uri: item.images[0] }} style={styles.productImage} resizeMode="cover" />

          {/* Wishlist Heart Button */}
          <TouchableOpacity
            style={styles.wishlistBtn}
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
            <Text style={{ fontSize: 16 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          <View style={styles.cardDetails}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
              {item.artisan.state} • {item.categoryName.split(' ')[0]}
            </Text>
            <Text
              variant="bodyMedium"
              weight="bold"
              color={theme.colors.text.primary}
              numberOfLines={2}
              style={styles.productTitle}
            >
              {item.title.hi}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary} numberOfLines={1}>
              द्वारा: {item.artisan.name}
            </Text>
            <View style={styles.priceRow}>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                ⭐ {item.rating}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
            कलाकार सेतु
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            📍 डिलीवरी: भारत भर में (1,55,000+ डाकघर)
          </Text>
        </View>

        <View style={styles.headerIcons}>
          {/* Wishlist Header Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Wishlist')}
            accessibilityLabel="Wishlist"
          >
            <Text style={{ fontSize: 22 }}>❤️</Text>
            {wishlistItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.terracotta.primary }]}>
                <Text style={styles.badgeCount}>{wishlistItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Header Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel="Cart"
          >
            <Text style={{ fontSize: 22 }}>🛒</Text>
            {totalCartCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.primary.emerald700 }]}>
                <Text style={styles.badgeCount}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Input Bar */}
        <TouchableOpacity
          style={[styles.searchBar, { borderColor: theme.colors.surface.border }]}
          onPress={() => navigation.navigate('Search')}
          accessibilityRole="button"
          accessibilityLabel="Search craft products"
        >
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={{ flex: 1 }}>
            शिल्प, साड़ी या कारीगर खोजें...
          </Text>
          <Text style={{ fontSize: 18 }}>🎙️</Text>
        </TouchableOpacity>

        {/* Hero Craft Banner */}
        <Card
          style={[
            styles.heroBanner,
            { backgroundColor: theme.colors.primary.emerald800, borderRadius: 20 },
          ]}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text variant="bodySmall" weight="bold" color="#D4AF37">
              100% प्रामाणिक व सत्यापित
            </Text>
            <Text variant="headlineMedium" weight="bold" color="#FFFFFF" style={{ marginVertical: 4 }}>
              सीधे ग्रामीण कारीगरों से खरीदें
            </Text>
            <Text variant="bodySmall" color="#E0D7C9">
              बिना किसी बिचौलिये के। हर खरीद पर डिजिटल शिल्प पासपोर्ट।
            </Text>
          </View>
          <Text style={{ fontSize: 48 }}>🏺</Text>
        </Card>

        {/* Categories Strip */}
        <View style={styles.sectionHeader}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
            पारंपरिक शिल्प श्रेणियां (Categories)
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
              सभी देखें →
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity
            onPress={() => setCategoryFilter(null)}
            style={[
              styles.catChip,
              !filters.categoryCode && {
                backgroundColor: theme.colors.primary.emerald700,
                borderColor: theme.colors.primary.emerald700,
              },
            ]}
          >
            <Text
              variant="bodySmall"
              weight="bold"
              color={!filters.categoryCode ? '#FFFFFF' : theme.colors.text.primary}
            >
              ✨ सभी शिल्प
            </Text>
          </TouchableOpacity>

          {CRAFT_CATEGORIES.map((cat) => {
            const isSelected = filters.categoryCode === cat.code;
            return (
              <TouchableOpacity
                key={cat.code}
                onPress={() => setCategoryFilter(isSelected ? null : cat.code)}
                style={[
                  styles.catChip,
                  isSelected && {
                    backgroundColor: theme.colors.primary.emerald700,
                    borderColor: theme.colors.primary.emerald700,
                  },
                ]}
              >
                <Text style={{ marginRight: 4 }}>{cat.icon}</Text>
                <Text
                  variant="bodySmall"
                  weight="bold"
                  color={isSelected ? '#FFFFFF' : theme.colors.text.primary}
                >
                  {cat.nameHi}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Master Artisan Spotlight */}
        <Card style={styles.artisanSpotlight}>
          <View style={styles.artisanRow}>
            <View style={styles.artisanAvatar}>
              <Text style={{ fontSize: 32 }}>👨‍🎨</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                माह के मास्टर शिल्पकार (Artisan of the Month)
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                सुखराम बघेल • बस्तर, छत्तीसगढ़
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                27 वर्षों से 4000 साल पुरानी ढोकरा लॉस्ट-वैक्स धातु कला के संरक्षक।
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

        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.productsGrid}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 6,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 10,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  artisanSpotlight: {
    padding: 14,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#C85A32',
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productCardTouch: {
    flex: 0.5,
    margin: 6,
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    padding: 10,
  },
  productTitle: {
    marginTop: 4,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});
