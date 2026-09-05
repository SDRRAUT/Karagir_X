import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { GITagBadge } from '@/components/badges/GITagBadge';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  artisanName?: string;
  artisanRegion?: string;
  hasGiTag?: boolean;
  giTagName?: string;
  isWishlisted?: boolean;
  onPress: () => void;
  onWishlistToggle?: () => void;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  originalPrice,
  imageUrl,
  artisanName,
  artisanRegion,
  hasGiTag,
  giTagName,
  isWishlisted = false,
  onPress,
  onWishlistToggle,
  style,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: theme.motion.scale.cardPress,
      duration: theme.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, theme]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: theme.motion.duration.fast,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, theme]);

  const handleWishlistPress = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onWishlistToggle?.();
  }, [onWishlistToggle]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface.card,
            borderRadius: theme.touch.radii.lg,
            ...theme.shadows.low,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ₹${price}`}
      >
        {/* Image Container with 3:4 Aspect Ratio */}
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: theme.colors.surface.subtle,
              borderTopLeftRadius: theme.touch.radii.lg,
              borderTopRightRadius: theme.touch.radii.lg,
            },
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Badges Overlay */}
          <View style={styles.badgeOverlay}>
            {hasGiTag && (
              <View style={styles.giBadgeWrap}>
                <GITagBadge tagTitle={giTagName || 'GI Tag'} isCompact />
              </View>
            )}
          </View>

          {/* Wishlist Button (40x40 Touch Target) */}
          {onWishlistToggle && (
            <Pressable
              onPress={handleWishlistPress}
              style={[
                styles.wishlistButton,
                {
                  backgroundColor: theme.colors.surface.card,
                  ...theme.shadows.low,
                },
              ]}
              hitSlop={8}
              accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Icon
                name={isWishlisted ? 'heartFilled' : 'heart'}
                size={20}
                color={isWishlisted ? theme.colors.status.error : theme.colors.text.secondary}
              />
            </Pressable>
          )}
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {artisanName && (
            <Text
              variant="bodySmall"
              color={theme.colors.text.tertiary}
              numberOfLines={1}
              style={styles.artisanText}
            >
              {artisanName} {artisanRegion ? `• ${artisanRegion}` : ''}
            </Text>
          )}

          <Text
            variant="bodyMedium"
            weight="medium"
            color={theme.colors.text.primary}
            numberOfLines={2}
            style={styles.title}
          >
            {title}
          </Text>

          <View style={styles.priceRow}>
            <Text
              variant="numeral"
              weight="bold"
              color={theme.colors.brand.primary}
              style={styles.price}
            >
              ₹{price.toLocaleString('en-IN')}
            </Text>
            {originalPrice && originalPrice > price && (
              <Text
                variant="bodySmall"
                color={theme.colors.text.tertiary}
                style={styles.originalPrice}
              >
                ₹{originalPrice.toLocaleString('en-IN')}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 2,
  },
  giBadgeWrap: {
    maxWidth: 120,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  content: {
    padding: 12,
  },
  artisanText: {
    marginBottom: 4,
    fontSize: 12,
  },
  title: {
    minHeight: 38,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    gap: 6,
  },
  price: {
    fontSize: 18,
    lineHeight: 22,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
});
