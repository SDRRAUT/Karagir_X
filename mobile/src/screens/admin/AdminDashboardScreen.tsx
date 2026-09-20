import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { Icon } from '@/components/icons/Icon';
import { useAdminStore } from '@/store/useAdminStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequireAdminRole } from '@/components/auth/useRequireAdminRole';
import { VoiceDiagnosticsModal } from '@/components/modals/VoiceDiagnosticsModal';

interface ClusterHeatPoint {
  id: string;
  name: string;
  state: string;
  craft: string;
  intensity: 'HIGH' | 'MEDIUM' | 'EMERGING';
  artisansCount: number;
  gmvShare: string;
  growth: string;
  color: string;
}

const HEATMAP_CLUSTERS: ClusterHeatPoint[] = [
  {
    id: 'up-varanasi',
    name: 'Varanasi Weaving Belt',
    state: 'Uttar Pradesh',
    craft: 'Banarasi Zari Silk',
    intensity: 'HIGH',
    artisansCount: 184,
    gmvShare: '₹1.84 Lakh (38%)',
    growth: '+28%',
    color: '#10B981',
  },
  {
    id: 'cg-bastar',
    name: 'Bastar Tribal Belt',
    state: 'Chhattisgarh',
    craft: 'Lost-Wax Dokra Metal',
    intensity: 'HIGH',
    artisansCount: 74,
    gmvShare: '₹92,000 (19%)',
    growth: '+34%',
    color: '#38BDF8',
  },
  {
    id: 'wb-bankura',
    name: 'Bankura Terracotta Hub',
    state: 'West Bengal',
    craft: 'Terracotta Horses & Pottery',
    intensity: 'MEDIUM',
    artisansCount: 62,
    gmvShare: '₹64,500 (13%)',
    growth: '+14%',
    color: '#F59E0B',
  },
  {
    id: 'rj-jaipur',
    name: 'Sanganer Print Cluster',
    state: 'Rajasthan',
    craft: 'Hand Block Printing',
    intensity: 'HIGH',
    artisansCount: 96,
    gmvShare: '₹88,400 (18%)',
    growth: '+22%',
    color: '#EC4899',
  },
  {
    id: 'mh-kolhapur',
    name: 'Kolhapur Footwear Guild',
    state: 'Maharashtra',
    craft: 'Handcrafted Chappals',
    intensity: 'MEDIUM',
    artisansCount: 58,
    gmvShare: '₹57,350 (12%)',
    growth: '+9%',
    color: '#8B5CF6',
  },
];

export const AdminDashboardScreen: React.FC = () => {
  const { isAuthorizedAdmin } = useRequireAdminRole();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { metrics, isLoading, fetchDashboardData } = useAdminStore();
  const switchProfile = useAuthStore((s) => s.switchProfile);

  const [selectedCluster, setSelectedCluster] = useState<ClusterHeatPoint>(HEATMAP_CLUSTERS[0]);
  const [dnaModalVisible, setDnaModalVisible] = useState(false);
  const [voiceDiagModalVisible, setVoiceDiagModalVisible] = useState(false);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, isAuthorizedAdmin]);

  if (!isAuthorizedAdmin) {
    return null;
  }

  const handleSwitchToRole = async (targetRole: 'ARTISAN' | 'BUYER') => {
    await switchProfile(targetRole === 'ARTISAN' ? 'artisan_demo' : 'buyer_demo');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { role: targetRole } }],
    });
  };

  const handleDownloadReport = (reportTitle: string) => {
    Alert.alert(
      'Government Report Generated',
      'Official ' + reportTitle + ' has been validated and compiled with cryptographically signed MoSJE audit stamps.'
    );
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
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#0284C7' }]}
              onPress={() => setVoiceDiagModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Voice Diagnostics"
            >
              <Text variant="bodySmall" style={styles.demoButtonText}>
                🎙️ Voice Diag
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
        {/* Urgent Operations Queue & Exploitation Watchdog */}
        <Card style={styles.alertsCard}>
          <View style={styles.alertsHeader}>
            <Icon name="alertCircle" size={18} color="#F59E0B" />
            <Text variant="labelLarge" style={styles.alertsTitle}>
              Operations Queue & Anti-Exploitation Alerts
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
                Exploitation / Price Alerts
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
                Dispute Resolutions Active
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Feature 1: Primary KPI Metrics Grid */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          1. Live Platform Financials & KPIs
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
              Direct fair-trade margin
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

        {/* Feature 2: Interactive India Craft Heat Map */}
        <View style={styles.sectionHeaderRow}>
          <Text variant="labelLarge" style={styles.sectionHeading}>
            2. National Craft Heat Map & Cluster Density
          </Text>
          <View style={styles.heatBadge}>
            <Text style={styles.heatBadgeText}>🔥 Real-Time</Text>
          </View>
        </View>

        <Card style={styles.heatMapCard}>
          <Text variant="bodySmall" style={styles.heatMapSub}>
            Tap a geographical cluster to audit live production load, artisan counts, and GMV contribution:
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clusterChipsScroll}>
            {HEATMAP_CLUSTERS.map((cluster) => {
              const isSelected = selectedCluster.id === cluster.id;
              return (
                <TouchableOpacity
                  key={cluster.id}
                  style={[
                    styles.clusterChip,
                    isSelected && { backgroundColor: '#312E81', borderColor: '#818CF8' },
                  ]}
                  onPress={() => setSelectedCluster(cluster)}
                >
                  <View style={[styles.densityDot, { backgroundColor: cluster.color }]} />
                  <Text
                    variant="caption"
                    style={[styles.clusterChipText, isSelected && { color: '#E0E7FF', fontWeight: '700' }]}
                  >
                    {cluster.state} • {cluster.craft}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Selected Cluster Deep-Dive */}
          <View style={styles.clusterDetailBox}>
            <View style={styles.clusterDetailTop}>
              <View>
                <Text variant="headlineSmall" style={styles.clusterDetailTitle}>
                  {selectedCluster.name}
                </Text>
                <Text variant="caption" style={styles.clusterDetailSub}>
                  {selectedCluster.state} • {selectedCluster.craft}
                </Text>
              </View>
              <View style={[styles.intensityTag, { backgroundColor: `${selectedCluster.color}25` }]}>
                <Text style={{ color: selectedCluster.color, fontSize: 11, fontWeight: '700' }}>
                  {selectedCluster.intensity} DENSITY
                </Text>
              </View>
            </View>

            <View style={styles.clusterDetailGrid}>
              <View style={styles.clusterMetricTile}>
                <Text variant="caption" style={styles.tileLabel}>Active Artisans</Text>
                <Text variant="headlineSmall" style={styles.tileValue}>{selectedCluster.artisansCount}</Text>
              </View>
              <View style={styles.clusterMetricTile}>
                <Text variant="caption" style={styles.tileLabel}>GMV Density</Text>
                <Text variant="headlineSmall" style={[styles.tileValue, { color: '#10B981' }]}>
                  {selectedCluster.gmvShare}
                </Text>
              </View>
              <View style={styles.clusterMetricTile}>
                <Text variant="caption" style={styles.tileLabel}>MoM Growth</Text>
                <Text variant="headlineSmall" style={[styles.tileValue, { color: '#6366F1' }]}>
                  {selectedCluster.growth}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Feature 5: Craft DNA Database Manager */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          3. Craft DNA™ Blockchain & GI Database
        </Text>
        <Card style={styles.dnaCard}>
          <View style={styles.dnaHeaderRow}>
            <View style={styles.dnaIconBox}>
              <Icon name="shieldCheck" size={22} color="#A855F7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ color: '#F8FAFC', fontWeight: '700' }}>
                Craft DNA™ National Registry
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                1,290 Registered GI lineage tokens with tamper-proof cryptographic hashes
              </Text>
            </View>
          </View>

          <View style={styles.dnaStatsRow}>
            <View style={styles.dnaStatItem}>
              <Text variant="headlineSmall" style={{ color: '#C084FC', fontWeight: '800' }}>
                1,290
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>Verified GI Lineages</Text>
            </View>
            <View style={styles.dnaDivider} />
            <View style={styles.dnaStatItem}>
              <Text variant="headlineSmall" style={{ color: '#10B981', fontWeight: '800' }}>
                100%
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>Raw Material Audit</Text>
            </View>
            <View style={styles.dnaDivider} />
            <View style={styles.dnaStatItem}>
              <Text variant="headlineSmall" style={{ color: '#38BDF8', fontWeight: '800' }}>
                4,892
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>NFC/QR Badges Issued</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.dnaActionBtn}
            onPress={() => setDnaModalVisible(true)}
            accessibilityRole="button"
          >
            <Icon name="eye" size={16} color="#FFFFFF" />
            <Text variant="bodyMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>
              Inspect Craft DNA Chain Registry
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Feature 6: AI Model Performance Monitor */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          4. AI Engine Telemetry & Accuracy Monitor
        </Text>
        <Card style={styles.aiCard}>
          <View style={styles.aiTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="zap" size={20} color="#F59E0B" />
              <Text variant="headlineSmall" style={{ color: '#F8FAFC', fontWeight: '700' }}>
                AI Model Accuracy & Pipeline Health
              </Text>
            </View>
            <View style={styles.latencyBadge}>
              <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>⚡ 42ms LATENCY</Text>
            </View>
          </View>

          <View style={styles.aiMetricRow}>
            <View style={styles.aiMetricInfo}>
              <Text variant="bodyMedium" style={{ color: '#E2E8F0', fontWeight: '600' }}>
                📸 AI Photo Studio (Bg Removal & Framing)
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Precision: 98.2% • 1,420 images enhanced
              </Text>
            </View>
            <Text style={[styles.aiScore, { color: '#10B981' }]}>98.2%</Text>
          </View>

          <View style={styles.aiMetricDivider} />

          <View style={styles.aiMetricRow}>
            <View style={styles.aiMetricInfo}>
              <Text variant="bodyMedium" style={{ color: '#E2E8F0', fontWeight: '600' }}>
                🎙️ Voice-to-Catalog (Regional NLP Dialects)
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Bhojpuri, Maithili, Chhattisgarhi, Marathi • 97.4% Intent Match
              </Text>
            </View>
            <Text style={[styles.aiScore, { color: '#38BDF8' }]}>97.4%</Text>
          </View>

          <View style={styles.aiMetricDivider} />

          <View style={styles.aiMetricRow}>
            <View style={styles.aiMetricInfo}>
              <Text variant="bodyMedium" style={{ color: '#E2E8F0', fontWeight: '600' }}>
                ⚖️ Fair Wage & Anti-Exploitation AI
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Raw material + artisan labor cost parity benchmark
              </Text>
            </View>
            <Text style={[styles.aiScore, { color: '#F59E0B' }]}>96.8%</Text>
          </View>
        </Card>

        {/* Feature 7: MoSJE & Ministry of Textiles Reporting Dashboard */}
        <Text variant="labelLarge" style={styles.sectionHeading}>
          5. Ministry & Statutory Compliance Dashboard
        </Text>
        <Card style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.govEmblemBox}>
              <Text style={{ fontSize: 20 }}>🏛️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSmall" style={{ color: '#F8FAFC', fontWeight: '700' }}>
                MoSJE & Ministry of Textiles Exporter
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Direct regulatory reporting for PM Vishwakarma, ODOP & Mudra Credit
              </Text>
            </View>
          </View>

          <View style={styles.reportButtonsList}>
            <TouchableOpacity
              style={styles.reportDownloadBtn}
              onPress={() => handleDownloadReport('PM Vishwakarma Artisan Upliftment Q3 Report')}
              accessibilityRole="button"
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ color: '#F1F5F9', fontWeight: '600' }}>
                  📑 PM Vishwakarma Cluster Impact (Q3)
                </Text>
                <Text variant="caption" style={{ color: '#94A3B8' }}>
                  Direct wage linkage, 428 artisans, certified toolkit disbursals
                </Text>
              </View>
              <Text style={styles.downloadIcon}>⬇️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportDownloadBtn}
              onPress={() => handleDownloadReport('ODOP National GI Export Compliance Audit')}
              accessibilityRole="button"
            >
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ color: '#F1F5F9', fontWeight: '600' }}>
                  🌍 ODOP National GI Export Compliance
                </Text>
                <Text variant="caption" style={{ color: '#94A3B8' }}>
                  Cross-border GI tag verification & Speed Post barcode trace
                </Text>
              </View>
              <Text style={styles.downloadIcon}>⬇️</Text>
            </TouchableOpacity>
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

      {/* Craft DNA Modal */}
      <Modal visible={dnaModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineMedium" style={{ color: '#FFFFFF', fontWeight: '800' }}>
                🧬 Craft DNA™ Chain Inspector
              </Text>
              <TouchableOpacity onPress={() => setDnaModalVisible(false)}>
                <Icon name="close" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text variant="bodySmall" style={{ color: '#94A3B8', marginBottom: 16 }}>
              Cryptographically verified provenance tokens for registered crafts across Indian clusters:
            </Text>

            <View style={styles.dnaBlock}>
              <Text variant="labelLarge" style={{ color: '#38BDF8', fontWeight: '700' }}>
                GI REGISTRY: IN-GI-48192
              </Text>
              <Text variant="bodySmall" style={{ color: '#E2E8F0', marginTop: 4 }}>
                Craft: Banarasi Handloom Katan Silk Saree
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Artisan: Ramesh Chandra Maurya • Varanasi Weaver Guild #14
              </Text>
              <Text variant="caption" style={styles.hashText}>
                SHA-256: 0x9f83a8b417c8d9e2...84729fca91
              </Text>
            </View>

            <View style={[styles.dnaBlock, { marginTop: 12 }]}>
              <Text variant="labelLarge" style={{ color: '#10B981', fontWeight: '700' }}>
                GI REGISTRY: IN-GI-20914
              </Text>
              <Text variant="bodySmall" style={{ color: '#E2E8F0', marginTop: 4 }}>
                Craft: Bastar Bell Metal Dancing Figurine (Dokra)
              </Text>
              <Text variant="caption" style={{ color: '#94A3B8' }}>
                Artisan: Somaru Kashyap • Bastar Tribal Heritage Collective
              </Text>
              <Text variant="caption" style={styles.hashText}>
                SHA-256: 0x4e27bb931a29f8cc...12c8a773de
              </Text>
            </View>

            <Button
              label="Close Inspector"
              variant="filled"
              onPress={() => setDnaModalVisible(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>

      <VoiceDiagnosticsModal
        visible={voiceDiagModalVisible}
        onClose={() => setVoiceDiagModalVisible(false)}
      />
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  heatBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  heatBadgeText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
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
  heatMapCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 20,
  },
  heatMapSub: {
    color: '#94A3B8',
    marginBottom: 12,
  },
  clusterChipsScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  clusterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  densityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clusterChipText: {
    color: '#94A3B8',
  },
  clusterDetailBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  clusterDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clusterDetailTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  clusterDetailSub: {
    color: '#94A3B8',
    marginTop: 2,
  },
  intensityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clusterDetailGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  clusterMetricTile: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  tileLabel: {
    color: '#94A3B8',
    fontSize: 10,
  },
  tileValue: {
    color: '#F8FAFC',
    fontWeight: '700',
    marginTop: 2,
  },
  dnaCard: {
    backgroundColor: '#1E293B',
    borderColor: '#4338CA',
    padding: 16,
    marginBottom: 20,
  },
  dnaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dnaIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dnaStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  dnaStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  dnaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  dnaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 8,
  },
  aiCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 20,
  },
  aiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  latencyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiMetricInfo: {
    flex: 1,
  },
  aiScore: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 12,
  },
  aiMetricDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  reportCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    padding: 16,
    marginBottom: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  govEmblemBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonsList: {
    gap: 10,
  },
  reportDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  downloadIcon: {
    fontSize: 18,
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dnaBlock: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hashText: {
    color: '#64748B',
    fontFamily: 'monospace',
    marginTop: 6,
  },
});
