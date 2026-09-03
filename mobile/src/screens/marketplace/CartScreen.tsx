import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
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
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="headlineMedium" color={theme.colors.text.primary}>
              ← वापस
            </Text>
          </TouchableOpacity>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
            आपकी टोकरी (Cart)
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 56, marginBottom: 12 }}>🛒</Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
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
          आपकी टोकरी ({items.length})
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nodal Escrow Safety Guarantee Banner */}
        <View style={[styles.escrowBanner, { backgroundColor: theme.colors.primary.emerald100 }]}>
          <Text style={{ fontSize: 24, marginRight: 10 }}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
              RBI-अनुमोदित नोडल एस्क्रो सुरक्षा
            </Text>
            <Text variant="bodySmall" color={theme.colors.primary.emerald900}>
              पार्सल डिलीवरी की पुष्टि होने तक आपका भुगतान सुरक्षित तिजोरी में रहेगा।
            </Text>
          </View>
        </View>

        {/* Cart Items List */}
        {items.map((item) => (
          <Card key={item.productId} style={styles.itemCard}>
            <Image source={{ uri: item.imageUri }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.terracotta.primary}>
                {item.artisanCluster}
              </Text>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} numberOfLines={2}>
                {item.title}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                शिल्पी: {item.artisanName}
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700} style={{ marginVertical: 4 }}>
                ₹{item.price.toLocaleString('en-IN')}
              </Text>

              {/* Quantity Stepper Row */}
              <View style={styles.stepperRow}>
                <View style={styles.stepperBox}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={styles.stepBtn}
                  >
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.qtyText}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={styles.stepBtn}
                  >
                    <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.deleteBtn}>
                  <Text style={{ fontSize: 18 }}>🗑️ हटाएँ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {/* Price Breakdown Ledger Card */}
        <Card style={styles.priceSummaryCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            मूल्य सारांश (Price Summary)
          </Text>

          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              शिल्प सामग्री उप-योग (Items Total):
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              ₹{subtotal.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              इको-फ्रेंडली सुरक्षित पैकेजिंग:
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              ₹{packagingFee}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              इंडिया पोस्ट स्पीड पोस्ट डिलीवरी:
            </Text>
            <Text
              variant="bodyMedium"
              weight="bold"
              color={deliveryFee === 0 ? theme.colors.primary.emerald700 : theme.colors.text.primary}
            >
              {deliveryFee === 0 ? 'निःशुल्क (FREE)' : `₹${deliveryFee}`}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              कुल देय राशि (Total Amount):
            </Text>
            <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{total.toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Checkout Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <View style={styles.bottomPriceInfo}>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            कुल भुगतान (Total Payable):
          </Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <Button
          label="चेकआउट करें (Proceed to Checkout) →"
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
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
    marginTop: 8,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
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
  priceSummaryCard: {
    padding: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0D7C9',
    marginVertical: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
  bottomPriceInfo: {
    flex: 1,
  },
  checkoutBtn: {
    flex: 1.5,
  },
  emptyBox: {
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
