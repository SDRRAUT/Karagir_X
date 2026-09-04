import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useOrderStore } from '@/store/useOrderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmation'>;

export const OrderConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { orderId } = route.params;
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const currentOrder = useOrderStore((s) => s.currentOrder);
  const order = getOrderById(orderId) || currentOrder;

  const orderNumber = order?.orderNumber || 'KS-OD-849201';
  const totalAmount = order?.totalAmount || 2320;
  const deliveryEstimate = order?.estimatedDeliveryDate || '3-5 कार्य दिवस';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Emblem */}
        <View style={styles.celebrationBox}>
          <View style={styles.checkCircle}>
            <Text style={{ fontSize: 36 }}>✓</Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            ऑर्डर सफलतापूर्वक दर्ज हुआ!
          </Text>
          <Text variant="bodyMedium" color={theme.colors.terracotta[600]} style={styles.subtitle}>
            Order Confirmed & Escrow Vault Locked
          </Text>
        </View>

        {/* Order Details Card */}
        <Card style={styles.orderCard} variant="elevated">
          <View style={styles.orderHeaderRow}>
            <View>
              <Text variant="bodySmall" color={theme.colors.charcoal[500]} weight="medium">
                ऑर्डर संख्या (Order No.)
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]} style={{ marginTop: 2 }}>
                {orderNumber}
              </Text>
            </View>
            <View style={styles.escrowBadge}>
              <Text style={styles.escrowBadgeText}>🛡️ एस्क्रो सुरक्षित</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.charcoal[600]}>
              कुल भुगतान (Total Paid):
            </Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.charcoal[600]}>
              अनुमानित डिलीवरी (Estimate):
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              {deliveryEstimate}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.charcoal[600]}>
              डिलीवरी पार्टनर (Partner):
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              इंडिया पोस्ट स्पीड पोस्ट 📮
            </Text>
          </View>
        </Card>

        {/* Cultural Reassurance Card */}
        <View style={styles.reassuranceCard}>
          <View style={styles.reassuranceIconBox}>
            <Text style={{ fontSize: 24 }}>🤝</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              सीधा शिल्पी को सहयोग
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={{ marginTop: 2, lineHeight: 18 }}>
              आपकी इस खरीद से ग्रामीण कारीगर परिवार को बिना किसी बिचौलिए के 100% पारदर्शी जीविका मिली है।
            </Text>
          </View>
        </View>

        {/* Navigation Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            label="ऑर्डर ट्रैक करें (Track Order) 📍"
            variant="primary"
            size="default"
            onPress={() => navigation.navigate('OrderTracking', { orderId })}
            style={styles.trackBtn}
          />
          <Button
            label="शॉपिंग जारी रखें (Continue Shopping) 🏠"
            variant="secondary"
            size="default"
            onPress={() => navigation.navigate('MarketplaceHome')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  celebrationBox: {
    alignItems: 'center',
    marginVertical: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5EE',
    borderWidth: 2,
    borderColor: '#1B5E38',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  orderCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE3',
    marginBottom: 16,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escrowBadge: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  escrowBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E38',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEAE3',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reassuranceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#FFE9DE',
    marginBottom: 28,
  },
  reassuranceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionsBox: {
    width: '100%',
  },
  trackBtn: {
    marginBottom: 12,
  },
});

