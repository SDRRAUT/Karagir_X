import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => {
    marketplaceService.getProductById(productId).then(setProduct);
  }, [productId]);

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
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
          style={styles.headerHeart}
          accessibilityLabel="Wishlist"
        >
          <Text style={{ fontSize: 24 }}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Studio Image */}
        <Card style={styles.imageCard}>
          <Image source={{ uri: product.images[0] }} style={styles.mainImage} resizeMode="cover" />
          <View style={[styles.categoryTag, { backgroundColor: theme.colors.primary.emerald700 }]}>
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              {product.categoryName}
            </Text>
          </View>
        </Card>

        {/* Title & Price Header */}
        <Card style={styles.infoCard}>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary} style={styles.productTitle}>
            {product.title.hi}
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.enTitle}>
            {product.title.en}
          </Text>

          <View style={styles.priceRow}>
            <View>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
                ₹{product.price.toLocaleString('en-IN')}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                (सभी कर व डाक पैकेजिंग शामिल)
              </Text>
            </View>
            <View style={[styles.ratingPill, { backgroundColor: theme.colors.primary.emerald100 }]}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                ⭐ {product.rating} ({product.reviewsCount} समीक्षाएं)
              </Text>
            </View>
          </View>
        </Card>

        {/* Digital Craft Passport Card */}
        <Card style={[styles.passportCard, { borderColor: theme.colors.primary.emerald700 }]}>
          <View style={styles.passportHeader}>
            <Text style={{ fontSize: 26, marginRight: 8 }}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                डिजिटल शिल्प पासपोर्ट (Craft Passport)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                आईडी: {product.passport.passportId} • {product.passport.verificationBadge}
              </Text>
            </View>
          </View>

          <View style={styles.passportDivider} />

          <View style={styles.passportRow}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
              📍 मूल उत्पत्ति स्थल:
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {product.passport.provenanceVillage}
            </Text>
          </View>

          <View style={styles.passportRow}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
              🧵 प्रयुक्त प्राकृतिक सामग्री:
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {product.passport.materialsUsed.join(', ')}
            </Text>
          </View>

          <View style={styles.passportRow}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.text.primary}>
              ⏳ निर्माण में लगा श्रम:
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {product.passport.laborHours} घंटे का समर्पित हस्तशिल्प
            </Text>
          </View>
        </Card>

        {/* Artisan Audio Voice Story Player */}
        <TouchableOpacity
          onPress={handleToggleVoice}
          style={[styles.audioPlayerCard, { backgroundColor: theme.colors.surface.card }]}
          accessibilityRole="button"
          accessibilityLabel="Play artisan story audio"
        >
          <Text style={{ fontSize: 32, marginRight: 12 }}>{isPlayingAudio ? '⏸️' : '🎧'}</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
              {isPlayingAudio ? 'आवाज़ बज रही है (Playing)...' : 'कारीगर की जुबानी सुनें (Artisan Voice Story)'}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isPlayingAudio
                ? 'टैप करके रोकें'
                : 'सुनिए कारीगर ने इस शिल्प को कैसे और क्यों बनाया'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Artisan Profile Card */}
        <Card style={styles.artisanCard}>
          <View style={styles.artisanHeader}>
            <View style={styles.artisanAvatar}>
              <Text style={{ fontSize: 30 }}>👩‍🎨</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                {product.artisan.name}
              </Text>
              <Text variant="bodySmall" color={theme.colors.terracotta.primary}>
                {product.artisan.cluster}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                अनुभव: {product.artisan.craftYears} वर्ष • {product.artisan.community}
              </Text>
            </View>
          </View>
        </Card>

        {/* Storytelling Description */}
        <Card style={styles.descriptionCard}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            शिल्प का सांस्कृतिक विवरण:
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={{ lineHeight: 22 }}>
            {product.description.hi}
          </Text>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Actions Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label="कार्ट में जोड़ें (Add to Cart) 🛒"
          variant="secondary"
          size="default"
          onPress={handleAddToCart}
          style={styles.cartBtn}
        />
        <Button
          label="अभी खरीदें (Buy Now) ⚡"
          variant="primary"
          size="default"
          onPress={handleBuyNow}
          style={styles.buyBtn}
        />
      </View>
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
    paddingVertical: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerHeart: {
    padding: 6,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
    position: 'relative',
    marginBottom: 14,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoCard: {
    padding: 16,
    marginBottom: 14,
  },
  productTitle: {
    lineHeight: 28,
  },
  enTitle: {
    marginTop: 4,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  passportCard: {
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 14,
    backgroundColor: '#F9FBF9',
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passportDivider: {
    height: 1,
    backgroundColor: '#E0EAE0',
    marginVertical: 10,
  },
  passportRow: {
    marginBottom: 6,
  },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    marginBottom: 14,
  },
  artisanCard: {
    padding: 14,
    marginBottom: 14,
  },
  artisanHeader: {
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
  descriptionCard: {
    padding: 16,
    marginBottom: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
  cartBtn: {
    flex: 1,
    marginRight: 8,
  },
  buyBtn: {
    flex: 1,
    marginLeft: 8,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
