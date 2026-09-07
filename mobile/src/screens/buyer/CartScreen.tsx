import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation } from '@/hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isHindi } = useTranslation();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getPackagingFee,
    getDeliveryFee,
    getTotalPayable,
  } = useCartStore();

  const subtotal = getSubtotal();
  const packagingFee = getPackagingFee();
  const deliveryFee = getDeliveryFee();
  const total = getTotalPayable();

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
        <AppHeader
          showBack
          showBrand
          title={isHindi ? 'आपकी टोकरी' : 'Your Shopping Cart'}
          subtitle={isHindi ? 'टोकरी खाली है' : 'Cart is Empty'}
        />

        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🛒</Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
            {isHindi ? 'आपकी टोकरी खाली है' : 'Your Cart is Empty'}
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.emptySubtitle}>
            {isHindi
              ? 'सीधे ग्रामीण कारीगरों से बने अनूठे व प्रमाणित हस्तशिल्प खोजें।'
              : 'Discover authentic, GI-certified handmade crafts directly from rural master artisans.'}
          </Text>
          <Button
            label={isHindi ? 'शिल्प बाज़ार देखें' : 'Explore Crafts'}
            variant="primary"
            size="default"
            onPress={() => navigation.navigate('MarketplaceHome')}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        showBack
        showBrand
        title={isHindi ? 'आपकी टोकरी' : 'Your Shopping Cart'}
        subtitle={isHindi ? `${items.length} हस्तशिल्प उत्पाद` : `${items.length} Handcrafted ${items.length === 1 ? 'Item' : 'Items'}`}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nodal Escrow Safety Guarantee Banner */}
        <View style={[styles.escrowBanner, { backgroundColor: '#EDEAFF', borderColor: '#D6D3FF' }]}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" color={theme.colors.primary.emerald700}>
              {isHindi ? 'RBI-अनुमोदित नोडल एस्क्रो सुरक्षा' : 'RBI-Approved Nodal Escrow Protection'}
            </Text>
            <Text variant="caption" color={theme.colors.charcoal[800]}>
              {isHindi
                ? 'पार्सल डिलीवरी की पुष्टि होने तक आपका भुगतान सुरक्षित तिजोरी में रहेगा।'
                : 'Your payment is safely held in escrow until you verify the package delivery.'}
            </Text>
          </View>
        </View>

        {/* Cart Items List */}
        {items.map((item) => (
          <Card key={item.productId} style={styles.itemCard}>
            <Image source={{ uri: item.imageUri }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                {item.artisanCluster}
              </Text>
              <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                {isHindi ? 'शिल्पी: ' : 'Artisan: '}{item.artisanName}
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.brand.primary} style={{ marginVertical: 4 }}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>

              {/* Quantity Stepper Row */}
              <View style={styles.stepperRow}>
                <View style={[styles.stepperBox, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[200] }]}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={styles.stepBtn}
                  >
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]} style={styles.qtyText}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={styles.stepBtn}
                  >
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>{isHindi ? '🗑️ हटाएँ' : '🗑️ Remove'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {/* Price Breakdown Ledger Card */}
        <Card style={styles.priceSummaryCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={{ marginBottom: 12 }}>
            {isHindi ? 'मूल्य सारांश' : 'Price Summary'}
          </Text>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isHindi ? 'शिल्प सामग्री उप-योग:' : 'Items Subtotal:'}
            </Text>
            <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{subtotal.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isHindi ? 'इको-फ्रेंडली सुरक्षित पैकेजिंग:' : 'Eco-Friendly Safe Packaging:'}
            </Text>
            <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{packagingFee}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              {isHindi ? 'इंडिया पोस्ट स्पीड पोस्ट डिलीवरी:' : 'India Post Speed Delivery:'}
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              color={deliveryFee === 0 ? theme.colors.primary.emerald700 : theme.colors.charcoal[900]}
            >
              {deliveryFee === 0 ? (isHindi ? 'निःशुल्क (FREE)' : 'FREE') : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.sand[200] }]} />

          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              {isHindi ? 'कुल देय राशि:' : 'Total Payable:'}
            </Text>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.brand.primary}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, borderTopColor: theme.colors.sand[200], ...theme.shadows.level4 }]}>
        <View style={styles.bottomPriceInfo}>
          <Text variant="caption" color={theme.colors.text.secondary}>
            {isHindi ? 'कुल भुगतान:' : 'Total:'}
          </Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.brand.primary}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <Button
          label={isHindi ? 'चेकआउट करें →' : 'Proceed to Checkout →'}
          variant="primary"
          size="default"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 22,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyText: {
    paddingHorizontal: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 13,
    color: '#EF4444',
  },
  priceSummaryCard: {
    padding: 16,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomPriceInfo: {
    flex: 1,
  },
  checkoutBtn: {
    flex: 1.2,
  },
});
