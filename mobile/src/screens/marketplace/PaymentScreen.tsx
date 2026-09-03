import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { orderService } from '@/api/orderService';
import { paymentService } from '@/api/paymentService';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

type PaymentMethodType = 'UPI' | 'CARDS' | 'NETBANKING' | 'COD';

export const PaymentScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { items, getTotalPayable, clearCart } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotalPayable();

  const handlePayNow = async () => {
    setIsProcessing(true);

    try {
      // 1. Verify Payment Intent in Escrow Vault
      const paymentResult = await paymentService.verifyPayment('intent_demo', selectedMethod);

      // 2. Create Order in Escrow Locked State
      const newOrder = await orderService.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          imageUri: i.imageUri,
          artisanName: i.artisanName,
        })),
        shippingAddress: {
          fullName: 'रोहन शर्मा (Rohan Sharma)',
          addressLine: 'मकान नं. 42, बाराखंभा रोड, कनाट प्लेस',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          phone: '9876543210',
        },
        paymentMethod: selectedMethod,
        totalAmount: total,
      });

      addOrder(newOrder);
      clearCart();
      setIsProcessing(false);

      navigation.replace('OrderConfirmation', { orderId: newOrder.orderId });
    } catch (_err) {
      setIsProcessing(false);
      Alert.alert('भुगतान त्रुटि', 'कृपया पुनः प्रयास करें।');
    }
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
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          सुरक्षित भुगतान (Escrow Vault)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nodal Escrow Safety Guarantee Box */}
        <Card style={[styles.escrowCard, { backgroundColor: theme.colors.primary.emerald100, borderColor: theme.colors.primary.emerald700 }]}>
          <View style={styles.escrowHeader}>
            <Text style={{ fontSize: 32, marginRight: 10 }}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald900}>
                RBI नोडल एस्क्रो सुरक्षित भुगतान
              </Text>
              <Text variant="bodySmall" color={theme.colors.primary.emerald900} style={{ marginTop: 2 }}>
                100% शून्य-शोषण गारंटी: आपका पैसा सुरक्षित रहता है और पार्सल मिलने पर ही कारीगर को जारी किया जाता है।
              </Text>
            </View>
          </View>
        </Card>

        {/* Amount to Pay Banner */}
        <View style={styles.amountCard}>
          <Text variant="bodyMedium" color={theme.colors.text.secondary}>
            कुल भुगतान राशि (Amount to Pay):
          </Text>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Payment Methods */}
        <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={styles.sectionTitle}>
          भुगतान का तरीका चुनें:
        </Text>

        {/* UPI Option */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('UPI')}
          style={[
            styles.methodCard,
            selectedMethod === 'UPI' && {
              borderColor: theme.colors.primary.emerald700,
              backgroundColor: theme.colors.primary.emerald50 || '#F0F9F0',
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.methodRow}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                UPI (Google Pay, PhonePe, Paytm, BHIM)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                शून्य अतिरिक्त शुल्क • तुरंत एस्क्रो लॉकिंग
              </Text>
            </View>
            <View style={[styles.radioCircle, selectedMethod === 'UPI' && styles.radioSelected]} />
          </View>
        </TouchableOpacity>

        {/* Cards Option */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('CARDS')}
          style={[
            styles.methodCard,
            selectedMethod === 'CARDS' && {
              borderColor: theme.colors.primary.emerald700,
              backgroundColor: theme.colors.primary.emerald50 || '#F0F9F0',
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.methodRow}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>💳</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                क्रेडिट / डेबिट कार्ड (Cards)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                Visa, MasterCard, RuPay सुरक्षित 3D Secure OTP
              </Text>
            </View>
            <View style={[styles.radioCircle, selectedMethod === 'CARDS' && styles.radioSelected]} />
          </View>
        </TouchableOpacity>

        {/* NetBanking Option */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('NETBANKING')}
          style={[
            styles.methodCard,
            selectedMethod === 'NETBANKING' && {
              borderColor: theme.colors.primary.emerald700,
              backgroundColor: theme.colors.primary.emerald50 || '#F0F9F0',
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.methodRow}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>🏦</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                नेट बैंकिंग (NetBanking)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                SBI, HDFC, ICICI, PNB सहित 50+ भारतीय बैंक
              </Text>
            </View>
            <View style={[styles.radioCircle, selectedMethod === 'NETBANKING' && styles.radioSelected]} />
          </View>
        </TouchableOpacity>

        {/* COD Option */}
        <TouchableOpacity
          onPress={() => setSelectedMethod('COD')}
          style={[
            styles.methodCard,
            selectedMethod === 'COD' && {
              borderColor: theme.colors.primary.emerald700,
              backgroundColor: theme.colors.primary.emerald50 || '#F0F9F0',
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.methodRow}>
            <Text style={{ fontSize: 26, marginRight: 12 }}>📦</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                कैश ऑन डिलीवरी (Cash on Delivery)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                पार्सल डाकिए से मिलने पर नकद भुगतान करें
              </Text>
            </View>
            <View style={[styles.radioCircle, selectedMethod === 'COD' && styles.radioSelected]} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Sticky Bottom Pay Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label={isProcessing ? 'सुरक्षित भुगतान हो रहा है...' : `₹${total.toLocaleString('en-IN')} का भुगतान करें 🔒`}
          variant="primary"
          size="decision"
          isLoading={isProcessing}
          onPress={handlePayNow}
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
  escrowCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D7C9',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  methodCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0D7C9',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C0B6A3',
  },
  radioSelected: {
    borderColor: '#1E5631',
    backgroundColor: '#1E5631',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});
