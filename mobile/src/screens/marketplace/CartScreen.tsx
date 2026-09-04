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

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
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
          title="आपकी टोकरी"
          subtitle="Cart is Empty"
        />

        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🛒</Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
            आपकी टोकरी खाली है
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.emptySubtitle}>
            सीधे ग्रामीण कारीगरों से बने अनूठे व प्रमाणित हस्तशिल्प खोजें।
          </Text>
          <Button
            label="शिल्प बाज़ार देखें (Explore Crafts)"
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
        title="आपकी टोकरी"
        subtitle={`${items.length} हस्तशिल्प उत्पाद`}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nodal Escrow Safety Guarantee Banner */}
        <View style={[styles.escrowBanner, { backgroundColor: '#E8F5E9', borderColor: '#A7F3D0' }]}>
          <Text style={{ fontSize: 22, marginRight: 10 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text variant="caption" weight="bold" color={theme.colors.primary.emerald700}>
              RBI-अनुमोदित नोडल एस्क्रो सुरक्षा (Escrow Protected)
            </Text>
            <Text variant="caption" color={theme.colors.charcoal[800]}>
              पार्सल डिलीवरी की पुष्टि होने तक आपका भुगतान सुरक्षित तिजोरी में रहेगा।
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
                शिल्पी: {item.artisanName}
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
                  <Text style={styles.deleteText}>🗑️ हटाएँ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {/* Price Breakdown Ledger Card */}
        <Card style={styles.priceSummaryCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={{ marginBottom: 12 }}>
            मूल्य सारांश (Price Summary)
          </Text>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              शिल्प सामग्री उप-योग (Items Total):
            </Text>
            <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{subtotal.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              इको-फ्रेंडली सुरक्षित पैकेजिंग:
            </Text>
            <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{packagingFee}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              इंडिया पोस्ट स्पीड पोस्ट डिलीवरी:
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              color={deliveryFee === 0 ? theme.colors.primary.emerald700 : theme.colors.charcoal[900]}
            >
              {deliveryFee === 0 ? 'निःशुल्क (FREE)' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.colors.sand[200] }]} />

          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              कुल देय राशि (Total Amount):
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
            कुल भुगतान (Total):
          </Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.brand.primary}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <Button
          label="चेकआउट करें →"
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
    color: '#BA1A1A',
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
