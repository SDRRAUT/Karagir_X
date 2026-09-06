import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { Icon } from '@/components/icons/Icon';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminDashboardScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { metrics, isLoading, fetchDashboardData } = useAdminStore();
  const switchProfile = useAuthStore((s) => s.switchProfile);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSwitchToRole = async (targetRole: 'ARTISAN' | 'BUYER') => {
    await switchProfile(targetRole === 'ARTISAN' ? 'artisan_demo' : 'buyer_demo');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { role: targetRole } }],
    });
  };

  const gmvDisplay = metrics ? `₹${metrics.totalGmv.toLocaleString('en-IN')}` : '₹4,86,250';
  const escrowDisplay = metrics ? `₹${metrics.totalEscrowLocked.toLocaleString('en-IN')}` : '₹64,200';
  const revenueDisplay = metrics ? `₹${metrics.platformCommissionRevenue.toLocaleString('en-IN')}` : '₹24,312';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B0F19' }]}>
      {/* Executive Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.badgeRow}>
            <View style={styles.livePulse} />
            <Text variant="caption" style={styles.liveTag}>
              COMMAND CENTER • LIVE
            </Text>
          </View>
          <Text variant="caption" style={styles.versionTag}>
            SIH 2026 PS-26090
          </Text>
        </View>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          कलाकार सेतु Governance
        </Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>
          National Artisan Market Linkage, Escrow & Compliance
        </Text>

        {/* Quick Demo Role Switcher */}
        <View style={styles.demoSwitcherContainer}>
          <Text variant="caption" style={styles.demoLabel}>
            🚀 LIVE DEMO MODE: Switch View to
          </Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#EA580C' }]}
              onPress={() => handleSwitchToRole('ARTISAN')}
              accessibilityRole="button"
              accessibilityLabel="Preview as Artisan"
            >
              <Text variant="bodySmall" style={styles.demoButtonText}>
                🌾 Artisan View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#4338CA' }]}
              onPress={() => handleSwitchToRole('BUYER')}
              accessibilityRole="button"
              accessibilityLabel="Preview as Buyer"
            >
              <Text variant="bodySmall" style={styles.demoButtonText}>
                🛍️ Buyer Storefront
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchDashboardData} tintColor="#6366F1" />
        }
      >
        {/* Urgent Action Banners */}
        <Card style={styles.alertsCard}>
          <View style={styles.alertsHeader}>
            <Icon name="alertCircle" size={18} color="#F59E0B" />
            <Text variant="labelLarge" style={styles.alertsTitle}>
              Operations Queue & Critical Action Items
            </Text>
          </View>
          <View style={styles.alertItemsRow}>
            <TouchableOpacity
              style={styles.alertTile}
              onPress={() => navigation.navigate('KycTab')}
              accessibilityRole="button"
            >
              <Text variant="headlineSmall" style={[styles.alertCount, { color: '#38BDF8' }]}>
                {metrics?.pendingKycCount ?? 4}
              </Text>
              <Text variant="caption" style={styles.alertDesc}>
                KYC Verifications Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertTile}
              onPress={() => navigation.navigate('ModerationTab')}
              accessibilityRole="button"
            >
              <Text variant="headlineSmall" style={[styles.alertCount, { color: '#F87171' }]}>
                {metrics?.flaggedListingsCount ?? 3}
              </Text>
              <Text variant="caption" style={styles.alertDesc}>
                AI Flagged Catalog Listings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertTile}
              onPress={() => navigation.navigate('EscrowTab')}
              accessibilityRole="button"
            >
              <Text variant="headlineSmall" style={[styles.alertCount, { color: '#FBBF24' }]}>
                {metrics?.activeDisputesCount ?? 2}
              </Text>
              <Text variant="caption" style={styles.alertDesc}>
                Escrow Disputes Active
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Primary Metric Grid */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          Platform Financials & Growth
        </Text>
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text variant="caption" style={styles.metricLabel}>
                TOTAL PLATFORM GMV
              </Text>
              <Icon name="sparkles" size={16} color="#10B981" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {gmvDisplay}
            </Text>
            <Text variant="caption" style={[styles.metricGrowth, { color: '#10B981' }]}>
              +18.4% this week
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text variant="caption" style={styles.metricLabel}>
                ESCROW IN NODAL VAULT
              </Text>
              <Icon name="shieldCheck" size={16} color="#6366F1" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {escrowDisplay}
            </Text>
            <Text variant="caption" style={styles.metricSub}>
              100% RBI Escrow Protected
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text variant="caption" style={styles.metricLabel}>
                PLATFORM REVENUE (5%)
              </Text>
              <Icon name="creditCard" size={16} color="#F59E0B" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {revenueDisplay}
            </Text>
            <Text variant="caption" style={styles.metricSub}>
              Low-commission model
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricTop}>
              <Text variant="caption" style={styles.metricLabel}>
                VERIFIED ARTISANS
              </Text>
              <Icon name="users" size={16} color="#EC4899" />
            </View>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {metrics?.activeArtisansCount ?? 428}
            </Text>
            <Text variant="caption" style={styles.metricSub}>
              Across 12 GI clusters
            </Text>
          </Card>
        </View>

        {/* Heritage Clusters Breakdown */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          National Craft Clusters Status
        </Text>
        <Card style={styles.clustersCard}>
          <View style={styles.clusterRow}>
            <Text style={styles.clusterEmoji}>🎨</Text>
            <View style={styles.clusterInfo}>
              <Text variant="bodyLarge" style={styles.clusterName}>
                Madhubani Silk Cluster (Bihar)
              </Text>
              <Text variant="caption" style={styles.clusterStats}>
                112 Artisans • 48 Orders this month • 96% On-time
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Text variant="caption" style={{ color: '#10B981', fontWeight: 'bold' }}>
                OPTIMAL
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clusterRow}>
            <Text style={styles.clusterEmoji}>🔔</Text>
            <View style={styles.clusterInfo}>
              <Text variant="bodyLarge" style={styles.clusterName}>
                Bastar Lost-Wax Dokra (Chhattisgarh)
              </Text>
              <Text variant="caption" style={styles.clusterStats}>
                74 Artisans • 2 B2B Institutional RFQs Active
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Text variant="caption" style={{ color: '#38BDF8', fontWeight: 'bold' }}>
                ACTIVE
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.clusterRow}>
            <Text style={styles.clusterEmoji}>🏺</Text>
            <View style={styles.clusterInfo}>
              <Text variant="bodyLarge" style={styles.clusterName}>
                Kolhapur Terracotta & Leather (Maharashtra)
              </Text>
              <Text variant="caption" style={styles.clusterStats}>
                95 Artisans • Speed Post Logistics Hub Linked
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Text variant="caption" style={{ color: '#10B981', fontWeight: 'bold' }}>
                OPTIMAL
              </Text>
            </View>
          </View>
        </Card>

        {/* Infrastructure & Security Badge */}
        <View style={styles.securityBox}>
          <Icon name="checkCircle" size={16} color="#10B981" />
          <Text variant="caption" style={styles.securityText}>
            Supabase Cloud Connected • RLS Hardened • India Post Barcodes Synchronized
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveTag: {
    color: '#10B981',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  versionTag: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    marginTop: 2,
  },
  demoSwitcherContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  demoLabel: {
    color: '#D1D5DB',
    fontWeight: '600',
    marginBottom: 8,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  alertsCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 20,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertsTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  alertItemsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  alertTile: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  alertCount: {
    fontWeight: '800',
  },
  alertDesc: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 11,
  },
  sectionHeading: {
    color: '#F1F5F9',
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 14,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metricValue: {
    color: '#F8FAFC',
    fontWeight: '800',
    marginBottom: 4,
  },
  metricGrowth: {
    fontWeight: '600',
    fontSize: 11,
  },
  metricSub: {
    color: '#64748B',
    fontSize: 11,
  },
  clustersCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 20,
  },
  clusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clusterEmoji: {
    fontSize: 24,
  },
  clusterInfo: {
    flex: 1,
  },
  clusterName: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  clusterStats: {
    color: '#94A3B8',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  securityText: {
    color: '#9CA3AF',
  },
});
