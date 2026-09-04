import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
 import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
      await paymentService.verifyPayment('intent_demo', selectedMethod);

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

  const methods: { id: PaymentMethodType; icon: string; title: string; desc: string; badge?: string }[] = [
    {
      id: 'UPI',
      icon: '⚡',
      title: 'UPI (GPay, PhonePe, Paytm, BHIM)',
      desc: 'शून्य अतिरिक्त शुल्क • तुरंत एस्क्रो लॉकिंग',
      badge: 'सर्वाधिक लोकप्रिय',
    },
    {
      id: 'CARDS',
      icon: '💳',
      title: 'क्रेडिट / डेबिट कार्ड (Cards)',
      desc: 'Visa, MasterCard, RuPay सुरक्षित 3D Secure OTP',
    },
    {
      id: 'NETBANKING',
      icon: '🏦',
      title: 'नेट बैंकिंग (NetBanking)',
      desc: 'SBI, HDFC, ICICI, PNB सहित 50+ भारतीय बैंक',
    },
    {
      id: 'COD',
      icon: '📦',
      title: 'कैश ऑन डिलीवरी (Cash on Delivery)',
      desc: 'पार्सल डाकिए से मिलने पर नकद भुगतान करें',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="सुरक्षित भुगतान (Escrow Vault)"
        subtitle="RBI Nodal Escrow Protection"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Nodal Escrow Safety Guarantee Box */}
        <View style={styles.escrowBanner}>
          <View style={styles.escrowIconBox}>
            <Text style={{ fontSize: 24 }}>🛡️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.escrowBadge}>
              <Text style={styles.escrowBadgeText}>100% ESCROW PROTECTED</Text>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.forest[800]}>
              RBI नोडल एस्क्रो सुरक्षित प्रणाली
            </Text>
            <Text variant="bodySmall" color={theme.colors.forest[700]} style={{ marginTop: 2, lineHeight: 18 }}>
              शून्य-शोषण गारंटी: आपकी राशि सुरक्षित रहेगी और पार्सल मिलने व संतुष्ट होने पर ही कारीगर को जारी होगी।
            </Text>
          </View>
        </View>

        {/* Amount to Pay Banner */}
        <Card style={styles.amountCard} variant="elevated">
          <View style={styles.amountContentRow}>
            <View>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]} weight="medium">
                कुल भुगतान राशि (Amount to Pay)
              </Text>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={{ marginTop: 2 }}>
                ₹{total.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>✓ ऑल टैक्स शामिल</Text>
            </View>
          </View>
        </Card>

        {/* Payment Methods */}
        <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionTitle}>
          भुगतान का तरीका चुनें:
        </Text>

        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.85}
              onPress={() => setSelectedMethod(method.id)}
              style={[
                styles.methodCard,
                isSelected ? styles.methodCardSelected : styles.methodCardNormal,
              ]}
            >
              <View style={styles.methodRow}>
                <View style={[styles.methodIconBox, isSelected && styles.methodIconBoxSelected]}>
                  <Text style={{ fontSize: 22 }}>{method.icon}</Text>
                </View>

                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
                      {method.title}
                    </Text>
                    {Boolean(method.badge) && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>{method.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="bodySmall" color={theme.colors.charcoal[500]} style={{ marginTop: 2 }}>
                    {method.desc}
                  </Text>
                </View>

                <View style={[styles.radioCircle, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky Bottom Pay Button */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <Button
          label={isProcessing ? 'सुरक्षित भुगतान हो रहा है...' : `₹${total.toLocaleString('en-IN')} का भुगतान करें 🔒`}
          variant="primary"
          size="default"
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#E8F5EE',
    borderWidth: 1,
    borderColor: '#C3E6D0',
    marginBottom: 16,
  },
  escrowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  escrowBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1B5E38',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  escrowBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  amountCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE3',
    marginBottom: 20,
  },
  amountContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#59413A',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  methodCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  methodCardNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEAE3',
  },
  methodCardSelected: {
    backgroundColor: '#FFF8F5',
    borderColor: '#E85D2A',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F7F4F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconBoxSelected: {
    backgroundColor: '#FFE9DE',
  },
  popularBadge: {
    marginLeft: 8,
    backgroundColor: '#FFF2EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E85D2A',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D8D1C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#E85D2A',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E85D2A',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    shadowColor: '#141815',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
});

