import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text, Card, EmptyState, Badge } from '@/components';

export const OrdersScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<'NEW' | 'IN_PROGRESS' | 'DELIVERED'>('NEW');

  const tabs = [
    { key: 'NEW', label: '🔔 नये [ 1 ]' },
    { key: 'IN_PROGRESS', label: '🔨 बन रहे [ 0 ]' },
    { key: 'DELIVERED', label: '✅ भेजे गए [ 12 ]' },
  ] as const;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Segmented Filter Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedTab(tab.key)}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isActive
                    ? theme.colors.primary.emerald700
                    : theme.colors.surface.subtle,
                },
              ]}
            >
              <Text
                variant="bodySmall"
                weight="bold"
                color={isActive ? theme.colors.text.inverse : theme.colors.text.secondary}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {selectedTab === 'NEW' && (
          <Card style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text variant="headlineMedium" weight="bold">
                दिल्ली (Delhi) से ऑर्डर
              </Text>
              <Badge label="18 घन्टे बाकी" variant="warning" icon="⏰" />
            </View>

            <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.orderProduct}>
              हाथ से बनी मधुबनी पेंटिंग (12x8 inch)
            </Text>

            <View style={styles.payoutRow}>
              <Text variant="bodyMedium" color={theme.colors.text.secondary}>
                आपको मिलेंगे:
              </Text>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
                ₹2,042
              </Text>
            </View>
          </Card>
        )}

        {selectedTab === 'IN_PROGRESS' && (
          <EmptyState
            icon="📦"
            title="कोई ऑर्डर पेंडिंग नहीं है"
            description="जब कोई ग्राहक नया आर्डर देगा तो वह यहाँ दिखेगा।"
          />
        )}

        {selectedTab === 'DELIVERED' && (
          <Card style={styles.orderCard}>
            <Text variant="headlineMedium" weight="bold">
              बेंगलुरु (Bengaluru) — सफल डिलीवरी
            </Text>
            <Text variant="bodyMedium" color={theme.colors.primary.emerald700} style={styles.deliveredText}>
              ✓ ₹2,090 बैंक में जमा (UTR981240129)
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  content: {
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    padding: 18,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderProduct: {
    marginBottom: 12,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0D7C9',
  },
  deliveredText: {
    marginTop: 8,
  },
});
