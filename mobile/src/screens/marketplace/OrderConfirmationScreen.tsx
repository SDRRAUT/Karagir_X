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
  const order = useOrderStore((s) => s.getOrderById(orderId)) || useOrderStore((s) => s.currentOrder);

  const orderNumber = order?.orderNumber || 'KS-OD-849201';
  const totalAmount = order?.totalAmount || 2320;
  const deliveryEstimate = order?.estimatedDeliveryDate || '3-5 कार्य दिवस';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Celebration Emblem */}
        <View style={styles.celebrationBox}>
          <View style={[styles.checkCircle, { backgroundColor: theme.colors.primary.emerald100, borderColor: theme.colors.primary.emerald700 }]}>
            <Text style={{ fontSize: 44 }}>✅</Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700} style={styles.title}>
            ऑर्डर सफलतापूर्वक दर्ज हुआ!
          </Text>
          <Text variant="headlineSmall" color={theme.colors.terracotta.primary} style={styles.subtitle}>
            Order Confirmed & Escrow Vault Locked
          </Text>
        </View>

        {/* Order Details Card */}
        <Card style={styles.orderCard}>
          <View style={styles.orderHeaderRow}>
            <View>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                ऑर्डर संख्या (Order No.):
              </Text>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                {orderNumber}
              </Text>
            </View>
            <View style={[styles.escrowBadge, { backgroundColor: theme.colors.primary.emerald100 }]}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald900}>
                🛡️ एस्क्रो सुरक्षित
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              कुल भुगतान:
            </Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              अनुमानित डिलीवरी:
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              {deliveryEstimate}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              डिलीवरी पार्टनर:
            </Text>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              इंडिया पोस्ट स्पीड पोस्ट 📮
            </Text>
          </View>
        </Card>

        {/* Cultural Reassurance Card */}
        <Card style={styles.reassuranceCard}>
          <Text style={{ fontSize: 24, marginRight: 10 }}>🤝</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
              सीधा शिल्पी को सहयोग
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
              आपकी इस खरीद से ग्रामीण कारीगर परिवार को बिना किसी बिचौलिए के पारदर्शी जीविका मिली है।
            </Text>
          </View>
        </Card>

        {/* Navigation Action Buttons */}
        <View style={styles.actionsBox}>
          <Button
            label="ऑर्डर ट्रैक करें (Track Order) 📍"
            variant="primary"
            size="decision"
            onPress={() => navigation.navigate('OrderTracking', { orderId })}
            style={styles.trackBtn}
          />
          <Button
            label="शॉपिंग जारी रखें (Continue Shopping) 🏠"
            variant="outline"
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
    padding: 24,
    alignItems: 'center',
  },
  celebrationBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  orderCard: {
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escrowBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0D7C9',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reassuranceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 24,
  },
  actionsBox: {
    width: '100%',
  },
  trackBtn: {
    marginBottom: 12,
  },
});
