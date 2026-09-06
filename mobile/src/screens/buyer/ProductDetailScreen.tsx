import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { marketplaceService, MarketplaceProduct } from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { productId } = route.params;

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => {
    marketplaceService.getProductById(productId).then(setProduct);
  }, [productId]);

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
        <View style={styles.centerBox}>
          <Text variant="bodyLarge" color={theme.colors.text.secondary}>
            लोड हो रहा है...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItemToCart({
      productId: product.id,
      title: product.title.hi,
      price: product.price,
      imageUri: product.images[0],
      craftCategoryName: product.categoryName,
      artisanName: product.artisan.name,
      artisanCluster: product.artisan.cluster,
      stockType: product.stockType,
    });

    Alert.alert('कार्ट में जोड़ा गया!', 'यह प्रामाणिक हस्तशिल्प आपकी टोकरी में सुरक्षित है।', [
      { text: 'शॉपिंग जारी रखें', style: 'cancel' },
      { text: 'कार्ट देखें', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleBuyNow = () => {
    addItemToCart({
      productId: product.id,
      title: product.title.hi,
      price: product.price,
      imageUri: product.images[0],
      craftCategoryName: product.categoryName,
      artisanName: product.artisan.name,
      artisanCluster: product.artisan.cluster,
      stockType: product.stockType,
    });
    navigation.navigate('Checkout');
  };

  const handleToggleVoice = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {/* Stitch Top Header */}
      <AppHeader
        showBack
        showBrand={false}
        title="Kalakar Setu"
        subtitle="Product Details"
        rightAction={
          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() =>
                toggleWishlist({
                  productId: product.id,
                  title: product.title.hi,
                  price: product.price,
                  imageUri: product.images[0],
                  craftCategoryName: product.categoryName,
                  artisanName: product.artisan.name,
                  artisanState: product.artisan.state,
                })
              }
            >
              <Text style={{ fontSize: 18 }}>{isSaved ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              <Text style={{ fontSize: 18 }}>🛍️</Text>
              {totalCartCount > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: theme.colors.brand.primary }]}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        }
      />

      {/* Origin Authenticated Bar */}
      <View style={[styles.originBar, { backgroundColor: theme.colors.surface.card, borderBottomColor: theme.colors.sand[200] }]}>
        <View style={styles.originLeft}>
          <Text style={{ fontSize: 16 }}>🛡️</Text>
          <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
            GI AUTHENTICATED ORIGIN
          </Text>
        </View>
        <Text variant="caption" color={theme.colors.text.secondary}>
          {product.artisan.cluster}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Product Image with 360 Studio Tag */}
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.sand[200] }]}>
          <Image source={{ uri: product.images[0] }} style={styles.mainImage} resizeMode="cover" />
          <View style={[styles.studioBadge, { backgroundColor: 'rgba(20,24,21,0.75)' }]}>
            <Text style={styles.studioBadgeText}>🔄 360° Studio View</Text>
          </View>
        </View>

        {/* Title & Price Card */}
        <Card style={styles.infoCard}>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]} style={styles.productTitle}>
            {product.title.hi}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.enTitle}>
            {product.title.en}
          </Text>

          <View style={styles.priceRow}>
            <View>
              <Text variant="displayLarge" weight="bold" color={theme.colors.brand.primary}>
                ₹{product.price.toLocaleString('en-IN')}
              </Text>
              <Text variant="caption" color={theme.colors.text.muted}>
                (डाक डिलीवरी व कर शामिल / Inclusive of Taxes & India Post)
              </Text>
            </View>
            <View style={[styles.ratingPill, { backgroundColor: theme.colors.sand[100] }]}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
                ⭐ {product.rating} ({product.reviewsCount} समीक्षाएं)
              </Text>
            </View>
          </View>
        </Card>

        {/* Fair Price Breakdown Card */}
        <Card style={styles.fairPriceCard}>
          <View style={styles.fairPriceHeader}>
            <Text style={{ fontSize: 18 }}>⚖️</Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.brand.primary}>
              पारदर्शी मूल्य नीति (Fair Price Breakdown)
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text variant="caption" color={theme.colors.text.secondary}>कारीगर का सीधा हिस्सा (Direct to Artisan)</Text>
            <Text variant="caption" weight="bold" color={theme.colors.primary.emerald700}>85% (₹{(product.price * 0.85).toFixed(0)})</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text variant="caption" color={theme.colors.text.secondary}>सामग्री व मिट्टी लागत (Raw Materials)</Text>
            <Text variant="caption" weight="semiBold" color={theme.colors.charcoal[800]}>₹{(product.price * 0.25).toFixed(0)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text variant="caption" color={theme.colors.text.secondary}>हस्तशिल्प श्रम (Craftsmanship Hours)</Text>
            <Text variant="caption" weight="semiBold" color={theme.colors.charcoal[800]}>{product.passport.laborHours} घंटे</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text variant="caption" color={theme.colors.text.secondary}>सुरक्षित पैकेजिंग व डाक (India Post Logistics)</Text>
            <Text variant="caption" weight="semiBold" color={theme.colors.charcoal[800]}>₹{(product.price * 0.15).toFixed(0)}</Text>
          </View>
        </Card>

        {/* Digital Craft Passport Card */}
        <Card style={[styles.passportCard, { borderColor: theme.colors.brand.primary }]}>
          <View style={styles.passportHeader}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>📜</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color={theme.colors.brand.primary}>
                डिजिटल शिल्प पासपोर्ट (Craft Passport)
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                आईडी: {product.passport.passportId} • {product.passport.verificationBadge}
              </Text>
            </View>
          </View>

          <View style={[styles.passportDivider, { backgroundColor: theme.colors.sand[200] }]} />

          <View style={styles.passportRow}>
            <Text variant="caption" weight="bold" color={theme.colors.charcoal[900]}>
              📍 मूल उत्पत्ति स्थल:
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              {product.passport.provenanceVillage}
            </Text>
          </View>

          <View style={styles.passportRow}>
            <Text variant="caption" weight="bold" color={theme.colors.charcoal[900]}>
              🧵 प्रयुक्त प्राकृतिक सामग्री:
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              {product.passport.materialsUsed.join(', ')}
            </Text>
          </View>

          <View style={styles.passportRow}>
            <Text variant="caption" weight="bold" color={theme.colors.charcoal[900]}>
              ⏳ समर्पित निर्माण समय:
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              {product.passport.laborHours} घंटे का पारंपरिक श्रम
            </Text>
          </View>
        </Card>

        {/* Artisan Audio Voice Story Player */}
        <TouchableOpacity
          onPress={handleToggleVoice}
          style={[styles.audioPlayerCard, { backgroundColor: theme.colors.brand.light, borderColor: theme.colors.brand.primary }]}
          accessibilityRole="button"
          accessibilityLabel="Play artisan story audio"
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>{isPlayingAudio ? '⏸️' : '🎧'}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.brand.primary}>
              {isPlayingAudio ? 'आवाज़ बज रही है (Playing)...' : 'कारीगर की जुबानी सुनें (Artisan Voice Story)'}
            </Text>
            <Text variant="caption" color={theme.colors.text.secondary}>
              {isPlayingAudio ? 'टैप करके रोकें' : 'सुनिए कारीगर ने इस शिल्प को कैसे और क्यों बनाया'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Artisan Profile Card */}
        <Card style={styles.artisanCard}>
          <View style={styles.artisanHeader}>
            <View style={[styles.artisanAvatar, { backgroundColor: theme.colors.brand.light }]}>
              <Text style={{ fontSize: 26 }}>👩‍🎨</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                {product.artisan.name}
              </Text>
              <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                {product.artisan.cluster}
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                अनुभव: {product.artisan.craftYears} वर्ष • {product.artisan.community}
              </Text>
            </View>
          </View>
        </Card>

        {/* Storytelling Description */}
        <Card style={styles.descriptionCard}>
          <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} style={{ marginBottom: 6 }}>
            शिल्प का सांस्कृतिक विवरण:
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.descText}>
            {product.description.hi}
          </Text>
          <Text variant="caption" color={theme.colors.text.muted} style={[styles.descText, { marginTop: 8 }]}>
            {product.description.en}
          </Text>
        </Card>
      </ScrollView>

      {/* Sticky Dual Bottom Action Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: theme.colors.surface.card, borderTopColor: theme.colors.sand[200], ...theme.shadows.level4 }]}>
        <Button
          label="कार्ट में जोड़ें"
          variant="secondary"
          size="default"
          onPress={handleAddToCart}
          style={styles.cartButton}
        />
        <Button
          label="अभी खरीदें →"
          variant="primary"
          size="default"
          onPress={handleBuyNow}
          style={styles.buyButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  originBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  originLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  studioBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studioBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoCard: {
    padding: 16,
    marginBottom: 12,
  },
  productTitle: {
    marginBottom: 2,
  },
  enTitle: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fairPriceCard: {
    padding: 14,
    marginBottom: 12,
  },
  fairPriceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  passportCard: {
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passportDivider: {
    height: 1,
    marginVertical: 10,
  },
  passportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  artisanCard: {
    padding: 14,
    marginBottom: 12,
  },
  artisanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionCard: {
    padding: 14,
    marginBottom: 12,
  },
  descText: {
    lineHeight: 20,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  cartButton: {
    flex: 0.45,
  },
  buyButton: {
    flex: 0.55,
  },
});
