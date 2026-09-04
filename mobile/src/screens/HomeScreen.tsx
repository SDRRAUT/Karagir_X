import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
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
  PressableCard,
  Icon,
  Badge,
} from '@/components';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isOnline, locale } = useAppStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const handleAddProduct = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    navigation.navigate('CameraCapture');
  };

  const handleExploreMarketplace = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    navigation.navigate('MarketplaceHome');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.primary }]}>
      {!isOnline && (
        <StatusBanner
          type="offline"
          message="इंटरनेट नहीं है — आपका काम सुरक्षित है (Offline Mode)"
        />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
      >
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View style={styles.greetingCol}>
            <View style={styles.greetingBadgeRow}>
              <Text
                variant="headlineLarge"
                weight="bold"
                color={theme.colors.text.primary}
                style={styles.greetingTitle}
              >
                नमस्ते, {user?.fullName || 'सुनीता जी'}!
              </Text>
            </View>
            <Text
              variant="bodySmall"
              color={theme.colors.text.secondary}
              style={styles.subGreeting}
            >
              मधुबनी क्लस्टर, बिहार • {locale.replace('_', '-')}
            </Text>
          </View>

          <View style={styles.badgeWrapper}>
            <VerifiedArtisanBadge />
          </View>
        </View>

        {/* Hero Earnings Card */}
        <StatCard
          title="इस महीने की कमाई (This Month)"
          amountFormatted="₹8,400"
          trendText="↑ 20% ज्यादा"
          subtitle="State Bank of India (...4921)"
          onPressAudio={() => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch {}
          }}
        />

        {/* Main CTA: Add Product */}
        <View style={styles.primaryActionSection}>
          <Button
            label="नया उत्पाद जोड़ें (Add Product)"
            variant="filled"
            leftIcon={<Icon name="camera" size={20} color={theme.colors.text.inverse} />}
            onPress={handleAddProduct}
            style={styles.mainCtaButton}
          />
        </View>

        {/* Action Grid */}
        <View style={styles.sectionHeader}>
          <Text
            variant="headlineSmall"
            weight="bold"
            color={theme.colors.text.primary}
          >
            त्वरित कार्य (Quick Actions)
          </Text>
        </View>

        <View style={styles.actionGrid}>
          {/* Orders Card */}
          <PressableCard
            variant="elevated"
            style={styles.gridCard}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              navigation.navigate('MainTabs', { screen: 'OrdersTab' });
            }}
            accessibilityRole="button"
            accessibilityLabel="Orders: 1 new order"
          >
            <View
              style={[
                styles.cardIconWrap,
                { backgroundColor: theme.colors.status.warningLight },
              ]}
            >
              <Icon name="orders" size={24} color={theme.colors.status.warning} />
            </View>
            <Text
              variant="bodyLarge"
              weight="bold"
              color={theme.colors.text.primary}
              style={styles.cardTitle}
            >
              1 नया ऑर्डर
            </Text>
            <Badge label="जवाब देना बाकी" variant="warning" size="small" />
          </PressableCard>

          {/* Bada Bazaar (Bulk Opportunities) */}
          <PressableCard
            variant="elevated"
            style={styles.gridCard}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              navigation.navigate('Opportunities');
            }}
            accessibilityRole="button"
            accessibilityLabel="Bada Bazaar: 2 Bulk RFQs available"
          >
            <View
              style={[
                styles.cardIconWrap,
                { backgroundColor: theme.colors.brand.secondaryLight },
              ]}
            >
              <Icon name="tag" size={24} color={theme.colors.brand.secondary} />
            </View>
            <Text
              variant="bodyLarge"
              weight="bold"
              color={theme.colors.text.primary}
              style={styles.cardTitle}
            >
              बड़ा बाज़ार (B2B)
            </Text>
            <Text
              variant="bodySmall"
              weight="semiBold"
              color={theme.colors.brand.secondary}
            >
              2 बल्क RFQ उपलब्ध →
            </Text>
          </PressableCard>
        </View>

        {/* Marketplace Banner */}
        <PressableCard
          variant="elevated"
          onPress={handleExploreMarketplace}
          style={styles.marketplaceBanner}
          accessibilityRole="button"
          accessibilityLabel="Explore Craft Marketplace"
        >
          <View style={styles.bannerLeft}>
            <View
              style={[
                styles.bannerIconWrap,
                { backgroundColor: theme.colors.brand.primaryLight },
              ]}
            >
              <Icon name="bag" size={24} color={theme.colors.brand.primary} />
            </View>
            <View style={styles.bannerTexts}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                शिल्प बाज़ार देखें (Marketplace)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                ग्राहकों को अपनी कला कैसे दिखती है, देखें
              </Text>
            </View>
          </View>
          <Icon name="chevronRight" size={20} color={theme.colors.text.tertiary} />
        </PressableCard>

        {/* Heritage Trust & Certification */}
        <View style={styles.sectionHeader}>
          <Text
            variant="headlineSmall"
            weight="bold"
            color={theme.colors.text.primary}
          >
            प्रमाणन व विरासत (Heritage Trust)
          </Text>
        </View>

        <Card variant="surface" style={styles.heritageCard}>
          <View style={styles.heritageTop}>
            <GITagBadge tagTitle="GI TAGGED HERITAGE" />
            <Text variant="bodySmall" color={theme.colors.text.tertiary}>
              प्रमाणित आईडी: #GI-MAD-2024
            </Text>
          </View>
          <Text
            variant="bodyMedium"
            color={theme.colors.text.secondary}
            style={styles.heritageDesc}
          >
            आपकी मधुबनी कला भारत सरकार के भौगोलिक उपदर्शन (GI) रजिस्ट्री के तहत संरक्षित है।
          </Text>
        </Card>
      </ScrollView>

      {/* Floating Voice Assistant Button */}
      <FloatingMicButton
        onPress={() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {}
          navigation.navigate('VoiceDescription');
        }}
        accessibilityLabel="Start voice assistance"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 96,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingCol: {
    flex: 1,
    paddingRight: 12,
  },
  greetingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  subGreeting: {
    marginTop: 4,
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  primaryActionSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  mainCtaButton: {
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 6,
  },
  marketplaceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerTexts: {
    flex: 1,
  },
  heritageCard: {
    padding: 16,
  },
  heritageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  heritageDesc: {
    lineHeight: 20,
  },
});
