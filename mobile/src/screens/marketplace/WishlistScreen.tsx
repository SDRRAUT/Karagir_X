import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useWishlistStore, WishlistItem } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

export const WishlistScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { items, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  const handleMoveToCart = (item: WishlistItem) => {
    addItemToCart({
      productId: item.productId,
      title: item.title,
      price: item.price,
      imageUri: item.imageUri,
      craftCategoryName: item.craftCategoryName,
      artisanName: item.artisanName,
      artisanCluster: item.artisanState,
      stockType: 'READY_STOCK',
    });
    removeItem(item.productId);
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <Card style={styles.itemCard} variant="elevated">
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemDetails}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.artisanState} • {item.craftCategoryName}
          </Text>
        </View>

        <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} numberOfLines={2} style={styles.itemTitle}>
          {item.title}
        </Text>

        <Text variant="bodySmall" color={theme.colors.charcoal[500]}>
          कारीगर: <Text weight="semiBold" color={theme.colors.charcoal[700]}>{item.artisanName}</Text>
        </Text>

        <View style={styles.priceActionRow}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
            ₹{item.price.toLocaleString('en-IN')}
          </Text>

          <View style={styles.actionBtns}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleMoveToCart(item)}
              style={styles.cartBtn}
            >
              <Text style={styles.cartBtnText}>कार्ट में डालें 🛒</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => removeItem(item.productId)}
              style={styles.removeBtn}
            >
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="मनपसंद शिल्प"
        subtitle={`Saved Heritage Crafts (${items.length})`}
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={{ fontSize: 40 }}>🤍</Text>
          </View>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
            आपकी विशलिस्ट खाली है
          </Text>
          <Text variant="bodyMedium" color={theme.colors.charcoal[500]} style={styles.emptySubtitle}>
            अपने पसंदीदा हस्तशिल्पों को सुरक्षित रखने के लिए दिल (❤️) आइकन पर टैप करें।
          </Text>
          <Button
            label="शिल्प खोजें (Explore Crafts)"
            variant="primary"
            size="default"
            onPress={() => navigation.navigate('MarketplaceHome')}
            style={{ marginTop: 24, minWidth: 200 }}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderWishlistItem}
          keyExtractor={(i) => i.productId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DCFF',
    marginBottom: 14,
    alignItems: 'center',
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6C63FF',
  },
  itemTitle: {
    marginBottom: 2,
  },
  priceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  cartBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  removeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F7F4F0',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 280,
  },
});

