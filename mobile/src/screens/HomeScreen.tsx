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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {!isOnline && (
        <StatusBanner message="इंटरनेट नहीं है — आपका काम फोन में सुरक्षित है। (Offline Mode)" />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]}>
                नमस्ते, {user?.fullName || 'सुनीता जी'}!
              </Text>
              <Text style={styles.namasteIcon}>🙏</Text>
            </View>
            <Text variant="caption" color={theme.colors.text.secondary} style={styles.clusterSubtext}>
              मधुबनी क्लस्टर, बिहार • <Text variant="caption" color={theme.colors.brand.primary}>{locale}</Text>
            </Text>
          </View>
          <VerifiedArtisanBadge />
        </View>

        {/* Hero Monthly Earnings Card */}
        <StatCard
          title="इस महीने की कमाई (This Month)"
          amountFormatted="₹8,400"
          trendText="↑ 20% ज्यादा"
          subtitle="State Bank of India (...4921)"
          onPressAudio={() => {}}
        />

        {/* Quick Actions Header */}
        <View style={styles.sectionHeaderRow}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
            त्वरित कार्य (Quick Actions)
          </Text>
          <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
            सभी देखें
          </Text>
        </View>

        {/* Primary Action Button */}
        <Button
          label="📸 नया प्रोडक्ट जोड़ें (Add Product)"
          variant="primary"
          size="decision"
          onPress={() => navigation.navigate('CameraCapture')}
          style={styles.actionBtn}
        />

        {/* Secondary Action Button */}
        <Button
          label="🛍️ शिल्प बाज़ार देखें (Explore Marketplace)"
          variant="secondary"
          size="default"
          onPress={() => navigation.navigate('MarketplaceHome')}
          style={styles.secondaryBtn}
        />

        {/* Metrics Grid */}
        <View style={styles.twoCol}>
          <Card style={styles.smallActionCard}>
            <View style={[styles.cardIconCircle, { backgroundColor: theme.colors.brand.light }]}>
              <Text style={styles.cardEmoji}>📦</Text>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              1 नया ऑर्डर
            </Text>
            <View style={[styles.pendingPill, { backgroundColor: theme.colors.brand.light }]}>
              <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                जवाब देना बाकी
              </Text>
            </View>
          </Card>

          <TouchableOpacity
            style={{ flex: 1, marginLeft: 8 }}
            onPress={() => navigation.navigate('Opportunities')}
            accessibilityRole="button"
            accessibilityLabel="Bada Bazaar Opportunities"
          >
            <Card style={styles.smallActionCard}>
              <View style={[styles.cardIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.cardEmoji}>🤝</Text>
              </View>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                बड़ा बाज़ार
              </Text>
              <Text variant="caption" weight="bold" color={theme.colors.primary.emerald700} style={styles.rfqText}>
                2 बल्क RFQ उपलब्ध →
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Stitch GI Tagged Heritage Card */}
        <View style={[styles.heritageCard, { backgroundColor: '#1F2421', borderColor: '#2F3631' }]}>
          <View style={styles.heritageLeft}>
            <View style={styles.heritageIconCircle}>
              <Text style={styles.heritageIcon}>🏛️</Text>
            </View>
            <View>
              <View style={styles.giTagBadge}>
                <Text style={styles.giTagText}>GI TAGGED HERITAGE</Text>
              </View>
              <Text variant="bodySmall" color="#D6D3D1" style={styles.heritageName}>
                मधुबनी चित्रकला क्लस्टर (Mithila Art)
              </Text>
            </View>
          </View>
          <Text style={styles.heritageCheck}>✓</Text>
        </View>

        {/* Stitch Bolie Saathi Voice Assistant Hint */}
        <View style={[styles.voiceHintCard, { backgroundColor: theme.colors.ochre.light, borderColor: theme.colors.ochre.border }]}>
          <View style={styles.voiceHintLeft}>
            <Text style={styles.voiceHintIcon}>🎙️</Text>
            <View>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
                बोलिए साथी (Voice Assistant)
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                माइक दबाकर बोलें: "मेरा ऑर्डर दिखाओ"
              </Text>
            </View>
          </View>
          <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
            सुने →
          </Text>
        </View>
      </ScrollView>

      {/* Floating Voice Assistant Button */}
      <FloatingMicButton onPress={() => navigation.navigate('VoiceDescription')} />
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
    marginBottom: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  namasteIcon: {
    fontSize: 20,
  },
  clusterSubtext: {
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  actionBtn: {
    marginVertical: 4,
  },
  secondaryBtn: {
    marginTop: 6,
    marginBottom: 14,
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  smallActionCard: {
    alignItems: 'center',
    padding: 14,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 22,
  },
  pendingPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  rfqText: {
    marginTop: 4,
  },
  heritageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  heritageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heritageIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#3D2C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heritageIcon: {
    fontSize: 20,
  },
  giTagBadge: {
    backgroundColor: '#422006',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#854D0E',
  },
  giTagText: {
    color: '#FACC15',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heritageName: {
    marginTop: 2,
  },
  heritageCheck: {
    color: '#A8A29E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceHintCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  voiceHintLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceHintIcon: {
    fontSize: 24,
  },
});
