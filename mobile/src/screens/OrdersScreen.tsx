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
    { key: 'NEW', label: 'नये (New)', count: 2 },
    { key: 'IN_PROGRESS', label: 'बन रहे (Making)', count: 1 },
    { key: 'DELIVERED', label: 'भेजे गए (Delivered)', count: 12 },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="कारीगर ऑर्डर्स"
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
                    दिल्ली (Delhi) से ऑर्डर
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84920 • 25 मिनट पहले
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(232, 93, 42, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.terracotta.primary}>
                    ⏰ 18 घन्टे बाकी
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
                    हाथ से बनी टेराकोटा दीप माला
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    मात्रा: 4 पीस • प्राकृतिक मिट्टी
                  </Text>
                  <Text
                    variant="labelSmall"
                    weight="bold"
                    color={theme.colors.secondary.teal}
                    style={{ marginTop: 4 }}
                  >
                    सत्यापित खरीदार: प्रिया शर्मा ✓
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(27, 94, 56, 0.08)' }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    आपको सीधे बैंक में मिलेंगे:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#1B5E38">
                    0% कमीशन कटौती (100% कारीगर को)
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#1B5E38">
                  ₹2,042
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  label="ऑर्डर स्वीकारें (Accept)"
                  variant="primary"
                  onPress={() => {}}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  label="अस्वीकारें"
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
                    पुणे (Pune) से ऑर्डर
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84915 • 2 घन्टे पहले
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(244, 185, 66, 0.2)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#795600">
                    ⏰ 22 घन्टे बाकी
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
                    पारंपरिक मिट्टी की हांडी (2.5 L)
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    मात्रा: 1 पीस • शीशा-मुक्त
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(27, 94, 56, 0.08)' }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    कारीगर कुल भुगतान:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#1B5E38">
                    एस्क्रो में सुरक्षित
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#1B5E38">
                  ₹850
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Button
                  label="ऑर्डर स्वीकारें (Accept)"
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
                    मुंबई (Mumbai) — निर्माण प्रगति पर
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-84102 • डिलीवरी तिथि: 12 सितंबर
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(0, 104, 116, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color={theme.colors.secondary.teal}>
                    🔨 बन रहा है
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
                    हैंडक्राफ्टेड टेराकोटा विंड चाइम्स
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                    मात्रा: 2 सेट • कोल्हापुर जीआई
                  </Text>
                  <Text variant="labelMedium" weight="bold" color={theme.colors.terracotta.primary} style={{ marginTop: 4 }}>
                    भुगतान: ₹1,420
                  </Text>
                </View>
              </View>

              <Button
                label="पैकिंग पूर्ण व पिकअप तैयार करें"
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
                    बेंगलुरु (Bengaluru) — सफल डिलीवरी
                  </Text>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    Order #KS-83901 • UTR981240129
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: 'rgba(27, 94, 56, 0.12)' }]}>
                  <Text variant="labelSmall" weight="bold" color="#1B5E38">
                    ✅ डिलीवर्ड
                  </Text>
                </View>
              </View>

              <View style={[styles.payoutContainer, { backgroundColor: 'rgba(27, 94, 56, 0.08)', marginTop: 8 }]}>
                <View>
                  <Text variant="labelSmall" color={theme.colors.text.secondary}>
                    बैंक में क्रेडिट हो चुका है:
                  </Text>
                  <Text variant="labelSmall" weight="bold" color="#1B5E38">
                    State Bank of India •••• 4021
                  </Text>
                </View>
                <Text variant="headlineMedium" weight="bold" color="#1B5E38">
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
    paddingBottom: 48,
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
    backgroundColor: '#F0EDED',
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
