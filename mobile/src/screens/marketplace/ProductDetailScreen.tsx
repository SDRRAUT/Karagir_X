import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Text,
  Button,
  Card,
  ScreenHeader,
  Icon,
  Badge,
  GITagBadge,
  Modal,
  LoadingScreen,
} from '@/components';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import {
  marketplaceService,
  MarketplaceProduct,
} from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { productId } = route.params;

  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => {
    marketplaceService.getProductById(productId).then(setProduct);
  }, [productId]);

  const isSaved = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = useCallback(() => {
    if (!product) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics optional
    }
    toggleWishlist({
      productId: product.id,
      title: product.title.hi,
      price: product.price,
      imageUri: product.images[0],
      craftCategoryName: product.categoryName,
      artisanName: product.artisan.name,
      artisanState: product.artisan.state,
    });
  }, [product, toggleWishlist]);

  const handleShare = async () => {
    if (!product) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `${product.title.hi} - प्रामाणिक भारतीय हस्तशिल्प | ₹${product.price} | कलाकार सेतु`,
      });
    } catch {
      // Share cancelled or unavailable
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics optional
    }

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

    setShowCartModal(true);
  };

  const handleBuyNow = () => {
    if (!product) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics optional
    }

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
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics optional
    }
    setIsPlayingAudio((prev) => !prev);
  };

  if (!product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.primary }]}>
        <LoadingScreen message="शिल्प विवरण लोड हो रहा है..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.primary }]}>
      {/* Header */}
      <ScreenHeader
        title="शिल्प विवरण"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <View style={styles.headerActionRow}>
            <Pressable
              onPress={handleShare}
              style={styles.headerBtn}
              accessibilityLabel="Share product"
              hitSlop={8}
            >
              <Icon name="share" size={20} color={theme.colors.text.primary} />
            </Pressable>
            <Pressable
              onPress={handleToggleWishlist}
              style={styles.headerBtn}
              accessibilityLabel={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
              hitSlop={8}
            >
              <Icon
                name={isSaved ? 'heartFilled' : 'heart'}
                size={22}
                color={isSaved ? theme.colors.status.error : theme.colors.text.primary}
              />
            </Pressable>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Product Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.imageBadgeRow}>
            <Badge
              label={product.categoryName}
              variant="neutral"
              style={styles.categoryBadge}
            />
            {product.passport?.isVerified && (
              <GITagBadge tagTitle="GI TAGGED" isCompact />
            )}
          </View>
        </View>

        {/* Title, Region, & Price Header */}
        <Card variant="surface" style={styles.sectionCard}>
          <Text
            variant="headlineMedium"
            weight="bold"
            color={theme.colors.text.primary}
            style={styles.title}
          >
            {product.title.hi}
          </Text>

          <Text
            variant="bodySmall"
            color={theme.colors.text.secondary}
            style={styles.enTitle}
          >
            {product.title.en}
          </Text>

          <View style={styles.priceRow}>
            <View>
              <Text
                variant="display"
                weight="bold"
                color={theme.colors.brand.primary}
                style={styles.priceText}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.tertiary}>
                (सभी कर व डाक पैकेजिंग शामिल • No Extra Charges)
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Icon name="starFilled" size={16} color="#D4A536" />
              <Text variant="labelLarge" weight="bold" color="#7A5B0B" style={styles.ratingText}>
                {product.rating}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.tertiary}>
                ({product.reviewsCount})
              </Text>
            </View>
          </View>
        </Card>

        {/* Digital Craft Passport */}
        <Card variant="elevated" style={styles.passportCard}>
          <View style={styles.passportHeader}>
            <View style={styles.passportIconWrap}>
              <Icon name="shieldCheck" size={24} color={theme.colors.brand.accent} />
            </View>
            <View style={styles.passportHeaderTexts}>
              <Text
                variant="bodyLarge"
                weight="bold"
                color={theme.colors.text.primary}
              >
                डिजिटल शिल्प पासपोर्ट (Craft Passport)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.tertiary}>
                आईडी: {product.passport.passportId} • {product.passport.verificationBadge}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />

          <View style={styles.specGrid}>
            <View style={styles.specRow}>
              <Icon name="tag" size={16} color={theme.colors.brand.primary} />
              <Text variant="bodyMedium" weight="medium" color={theme.colors.text.secondary} style={styles.specLabel}>
                उत्पत्ति स्थल:
              </Text>
              <Text variant="bodyMedium" weight="semiBold" color={theme.colors.text.primary} style={styles.specVal}>
                {product.passport.provenanceVillage}
              </Text>
            </View>

            <View style={styles.specRow}>
              <Icon name="sparkles" size={16} color={theme.colors.brand.primary} />
              <Text variant="bodyMedium" weight="medium" color={theme.colors.text.secondary} style={styles.specLabel}>
                सामग्री:
              </Text>
              <Text variant="bodyMedium" weight="semiBold" color={theme.colors.text.primary} style={styles.specVal}>
                {product.passport.materialsUsed.join(', ')}
              </Text>
            </View>

            <View style={styles.specRow}>
              <Icon name="clock" size={16} color={theme.colors.brand.primary} />
              <Text variant="bodyMedium" weight="medium" color={theme.colors.text.secondary} style={styles.specLabel}>
                श्रम अवधि:
              </Text>
              <Text variant="bodyMedium" weight="semiBold" color={theme.colors.text.primary} style={styles.specVal}>
                {product.passport.laborHours} घंटे का हस्तशिल्प
              </Text>
            </View>
          </View>
        </Card>

        {/* Artisan Audio Voice Story */}
        <Pressable
          onPress={handleToggleVoice}
          style={[
            styles.voiceStoryCard,
            {
              backgroundColor: isPlayingAudio
                ? theme.colors.brand.primaryLight
                : theme.colors.surface.card,
              borderColor: isPlayingAudio
                ? theme.colors.brand.primary
                : theme.colors.border.default,
              ...theme.shadows.low,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Play artisan story audio"
        >
          <View
            style={[
              styles.audioIconCircle,
              {
                backgroundColor: isPlayingAudio
                  ? theme.colors.brand.primary
                  : theme.colors.surface.subtle,
              },
            ]}
          >
            <Icon
              name={isPlayingAudio ? 'speaker' : 'microphone'}
              size={22}
              color={isPlayingAudio ? theme.colors.text.inverse : theme.colors.brand.primary}
            />
          </View>

          <View style={styles.audioTextCol}>
            <Text
              variant="bodyLarge"
              weight="bold"
              color={isPlayingAudio ? theme.colors.brand.primary : theme.colors.text.primary}
            >
              {isPlayingAudio ? 'आवाज़ बज रही है • Playing' : 'कारीगर की जुबानी सुनें (Voice Story)'}
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isPlayingAudio
                ? 'रोकने के लिए टैप करें'
                : 'सुनिए कारीगर ने इस शिल्प को कैसे और क्यों बनाया'}
            </Text>
          </View>
        </Pressable>

        {/* Artisan Profile Card */}
        <Card variant="surface" style={styles.sectionCard}>
          <View style={styles.artisanRow}>
            <View
              style={[
                styles.artisanAvatar,
                { backgroundColor: theme.colors.brand.secondaryLight },
              ]}
            >
              <Icon name="profile" size={28} color={theme.colors.brand.secondary} />
            </View>

            <View style={styles.artisanInfo}>
              <View style={styles.artisanNameRow}>
                <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                  {product.artisan.name}
                </Text>
                <Icon name="checkCircle" size={16} color={theme.colors.brand.secondary} />
              </View>
              <Text variant="bodySmall" color={theme.colors.brand.primary} style={styles.clusterText}>
                {product.artisan.cluster}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                अनुभव: {product.artisan.craftYears} वर्ष • {product.artisan.community}
              </Text>
            </View>
          </View>
        </Card>

        {/* Cultural Description Section */}
        <Card variant="surface" style={styles.sectionCard}>
          <Text
            variant="headlineSmall"
            weight="bold"
            color={theme.colors.text.primary}
            style={styles.descTitle}
          >
            शिल्प का सांस्कृतिक विवरण
          </Text>
          <Text
            variant="bodyMedium"
            color={theme.colors.text.secondary}
            style={styles.descBody}
          >
            {product.description.hi}
          </Text>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Actions Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface.card,
            borderTopColor: theme.colors.border.subtle,
            ...theme.shadows.medium,
          },
        ]}
      >
        <Button
          label="कार्ट में जोड़ें"
          variant="tonal"
          leftIcon={<Icon name="bag" size={18} color={theme.colors.brand.primary} />}
          onPress={handleAddToCart}
          style={styles.cartBtn}
        />
        <Button
          label="अभी खरीदें"
          variant="filled"
          leftIcon={<Icon name="truck" size={18} color={theme.colors.text.inverse} />}
          onPress={handleBuyNow}
          style={styles.buyBtn}
        />
      </View>

      {/* Add To Cart Confirmation Modal */}
      <Modal
        visible={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="कार्ट में जोड़ा गया! (Added to Cart)"
        description="यह प्रामाणिक हस्तशिल्प आपकी टोकरी में सुरक्षित है।"
        primaryActionLabel="कार्ट देखें (View Cart)"
        onPrimaryAction={() => {
          setShowCartModal(false);
          navigation.navigate('Cart');
        }}
        secondaryActionLabel="शॉपिंग जारी रखें"
        onSecondaryAction={() => setShowCartModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#F3F1EC',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  enTitle: {
    marginTop: 4,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  priceText: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
  },
  passportCard: {
    padding: 16,
    marginBottom: 16,
  },
  passportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passportHeaderTexts: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  specGrid: {
    gap: 10,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specLabel: {
    marginLeft: 8,
    marginRight: 6,
  },
  specVal: {
    flex: 1,
  },
  voiceStoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  audioIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  audioTextCol: {
    flex: 1,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artisanAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clusterText: {
    marginTop: 2,
    marginBottom: 2,
  },
  descTitle: {
    marginBottom: 10,
  },
  descBody: {
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 12,
    zIndex: 100,
    elevation: 10,
  },
  cartBtn: {
    flex: 1,
  },
  buyBtn: {
    flex: 1,
  },
});
