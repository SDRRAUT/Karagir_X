import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { AppHeader } from '@/components/navigation/AppHeader';

type OrderTab = 'NEW' | 'IN_PROGRESS' | 'DELIVERED';

export const OrdersScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<OrderTab>('NEW');

  const tabs: { key: OrderTab; label: string; count: number }[] = [
    { key: 'NEW', label: 'New Orders', count: 2 },
    { key: 'IN_PROGRESS', label: 'In Production', count: 1 },
    { key: 'DELIVERED', label: 'Delivered', count: 12 },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="Artisan Orders"
        subtitle="Orders & Direct Fulfillment"
        showDevanagariLogo={true}
        onVoicePress={() => {}}
      />

      {/* Segmented Filter Tab Pills */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedTab(tab.key)}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isActive ? theme.colors.terracotta.primary : theme.colors.surface.card,
                  borderColor: isActive ? theme.colors.terracotta.primary : theme.colors.border.subtle,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                variant="labelSmall"
                weight={isActive ? 'bold' : 'normal'}
                color={isActive ? '#FFFFFF' : theme.colors.text.secondary}
              >
                {tab.label} [{tab.count}]
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* NEW ORDERS */}
        {selectedTab === 'NEW' && (
          <View style={styles.listContainer}>
            {/* Order 1 */}
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                    Order from New Delhi
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84920 • 25 mins ago
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.terracotta.primary}>
                    ⏰ 18h Left
                  </Text>
                </View>
              </View>

              <View style={styles.productRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.productThumb}
                />
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>
                    Handmade Terracotta Diya Garland
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    Quantity: 4 pcs • Natural Clay
                  </Text>
                  <Text
                    variant="labelSmall"
                    weight="bold"
                    color={theme.colors.secondary.teal}
                    style={{ marginTop: 4 }}
                  >
                    Verified Buyer: Priya Sharma ✓
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(108, 99, 255, 0.08)' }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Direct Bank Settlement:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#6C63FF">
                    0% Commission (100% to Artisan)
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#6C63FF">
                  ₹2,042
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  label="Accept Order"
                  variant="primary"
                  onPress={() => {}}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  label="Decline"
                  variant="outline"
                  onPress={() => {}}
                  style={{ width: 100 }}
                />
              </View>
            </Card>

            {/* Order 2 */}
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                    Order from Pune
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84915 • 2 hours ago
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(244, 185, 66, 0.2)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#795600">
                    ⏰ 22h Left
                  </Text>
                </View>
              </View>

              <View style={styles.productRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.productThumb}
                />
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary} numberOfLines={1}>
                    Traditional Clay Handi (2.5 L)
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    Quantity: 1 pc • Lead-Free
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(108, 99, 255, 0.08)' }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Artisan Net Payout:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#6C63FF">
                    Escrow Protected
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#6C63FF">
                  ₹850
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  label="Accept Order"
                  variant="primary"
                  onPress={() => {}}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          </View>
        )}

        {/* IN PROGRESS */}
        {selectedTab === 'IN_PROGRESS' && (
          <View style={styles.listContainer}>
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                    Mumbai — In Production
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84102 • Delivery: 12 Sept
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                    🔨 In Production
                  </Text>
                </View>
              </View>

              <View style={styles.productRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80',
                  }}
                  style={styles.productThumb}
                />
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
                    Handcrafted Terracotta Wind Chimes
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    Quantity: 2 sets • Kolhapur GI
                  </Text>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary} style={{ marginTop: 4 }}>
                    Payout: ₹1,420
                  </Text>
                </View>
              </View>

              <Button
                label="Ready for Pickup & Packing Complete"
                variant="primary"
                onPress={() => {}}
                style={{ marginTop: 8 }}
              />
            </Card>
          </View>
        )}

        {/* DELIVERED */}
        {selectedTab === 'DELIVERED' && (
          <View style={styles.listContainer}>
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
                    Bengaluru — Delivery Complete
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-83901 • UTR981240129
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#6C63FF">
                    ✅ Delivered
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(108, 99, 255, 0.08)', marginTop: 8 }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Credited to Bank Account:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#6C63FF">
                    State Bank of India •••• 4021
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#6C63FF">
                  ₹2,090
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 130,
  },
  listContainer: {
    gap: 14,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E0DCFF',
  },
  payoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
