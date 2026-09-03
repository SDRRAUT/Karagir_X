import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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
    <Card style={styles.itemCard}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} resizeMode="cover" />
      <View style={styles.itemDetails}>
        <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
          {item.artisanState} • {item.craftCategoryName}
        </Text>
        <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} numberOfLines={2}>
          {item.title}
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary}>
          कारीगर: {item.artisanName}
        </Text>
        <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700} style={{ marginVertical: 4 }}>
          ₹{item.price.toLocaleString('en-IN')}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => handleMoveToCart(item)}
            style={[styles.moveBtn, { backgroundColor: theme.colors.primary.emerald700 }]}
          >
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              कार्ट में डालें 🛒
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.removeBtn}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

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
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          मनपसंद शिल्प (Wishlist) ({items.length})
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🤍</Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
            आपकी विशलिस्ट खाली है
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.emptySubtitle}>
            अपने पसंदीदा हस्तशिल्प को सुरक्षित रखने के लिए दिल (❤️) आइकन पर टैप करें।
          </Text>
          <Button
            label="शिल्प खोजें (Explore Crafts)"
            variant="primary"
            size="default"
            onPress={() => navigation.navigate('MarketplaceHome')}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderWishlistItem}
          keyExtractor={(i) => i.productId}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  backBtn: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  moveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 12,
  },
  removeBtn: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
