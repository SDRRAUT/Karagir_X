import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Text,
  Button,
  StatCard,
  VerifiedArtisanBadge,
  GITagBadge,
  StatusBanner,
  FloatingMicButton,
  Card,
} from '@/components';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isOnline, locale } = useAppStore();
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {!isOnline && (
        <StatusBanner message="इंटरनेट नहीं है — आपका काम फोन में सुरक्षित है। (Offline Mode)" />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary}>
              नमस्ते, {user?.fullName || 'सुनीता जी'}!
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              मधुबनी क्लस्टर, बिहार • {locale}
            </Text>
          </View>
          <VerifiedArtisanBadge />
        </View>

        {/* Hero Earnings Card */}
        <StatCard
          title="इस महीने की कमाई (This Month)"
          amountFormatted="₹8,400"
          trendText="↑ 20% ज्यादा"
          subtitle="State Bank of India (...4921)"
          onPressAudio={() => {}}
        />

        {/* Quick Action Matrix */}
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary} style={styles.sectionTitle}>
          त्वरित कार्य (Quick Actions)
        </Text>

        <Button
          label="📸 नया प्रोडक्ट जोड़ें (Add Product)"
          variant="terracotta"
          size="decision"
          onPress={() => navigation.navigate('CameraCapture')}
          style={styles.actionBtn}
        />

        <Button
          label="🛍️ शिल्प बाज़ार देखें (Explore Marketplace)"
          variant="secondary"
          size="default"
          onPress={() => navigation.navigate('MarketplaceHome')}
          style={{ marginBottom: 16 }}
        />

        <View style={styles.twoCol}>
          <Card style={styles.smallActionCard}>
            <Text style={styles.cardEmoji}>📦</Text>
            <Text variant="bodyLarge" weight="bold">
              1 नया ऑर्डर
            </Text>
            <Text variant="bodySmall" color={theme.colors.status.warning}>
              जवाब देना बाकी
            </Text>
          </Card>

          <TouchableOpacity
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate('Opportunities')}
            accessibilityRole="button"
            accessibilityLabel="Bada Bazaar Opportunities"
          >
            <Card style={styles.smallActionCard}>
              <Text style={styles.cardEmoji}>🤝</Text>
              <Text variant="bodyLarge" weight="bold">
                बड़ा बाज़ार
              </Text>
              <Text variant="bodySmall" color={theme.colors.primary.emerald700}>
                2 बल्क RFQ उपलब्ध →
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Heritage Trust Section */}
        <View style={styles.badgeRow}>
          <GITagBadge />
        </View>
      </ScrollView>

      {/* Floating Voice Assistant */}
      <FloatingMicButton onPress={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  actionBtn: {
    marginVertical: 6,
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  smallActionCard: {
    flex: 0.48,
    alignItems: 'center',
    padding: 16,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  badgeRow: {
    marginTop: 20,
  },
});
