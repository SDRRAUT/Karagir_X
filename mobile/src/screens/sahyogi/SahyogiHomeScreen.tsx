import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';

interface ClusterArtisan {
  id: string;
  nameEn: string;
  nameHi: string;
  craftEn: string;
  craftHi: string;
  quota: number;
  completed: number;
  status: 'ON_TRACK' | 'NEEDS_HELP' | 'COMPLETED';
  phone: string;
}

const CLUSTER_ARTISANS: ClusterArtisan[] = [
  {
    id: 'art_1',
    nameEn: 'Ramesh Kumbhar (Kolhapur)',
    nameHi: 'रमेश कुंभार (कोल्हापुर)',
    craftEn: 'Terracotta Wheel Throwing',
    craftHi: 'मिट्टी का चाक शिल्प',
    quota: 600,
    completed: 540,
    status: 'ON_TRACK',
    phone: '+91 98765 43210',
  },
  {
    id: 'art_2',
    nameEn: 'Sunita Devi (Kolhapur Cluster Lead)',
    nameHi: 'सुनीता देवी (क्लस्टर लीड)',
    craftEn: 'Hand Carving & Embossing',
    craftHi: 'हस्त नक्काशी एवं उभरी कला',
    quota: 500,
    completed: 480,
    status: 'ON_TRACK',
    phone: '+91 94310 88219',
  },
  {
    id: 'art_3',
    nameEn: 'Ganesh Kumbhar (Panchganga Unit)',
    nameHi: 'गणेश कुंभार (पंचगंगा केंद्र)',
    craftEn: 'Master Wheel Craftsman',
    craftHi: 'वरिष्ठ चाक शिल्पकार',
    quota: 700,
    completed: 620,
    status: 'ON_TRACK',
    phone: '+91 98221 44556',
  },
  {
    id: 'art_4',
    nameEn: 'Savita Kumbhar (Kolhapur Guild)',
    nameHi: 'सविता कुंभार (कोल्हापुर गिल्ड)',
    craftEn: 'Specialized Floral Motifs',
    craftHi: 'पारंपरिक पुष्प रूपांकन',
    quota: 650,
    completed: 420,
    status: 'NEEDS_HELP',
    phone: '+91 97654 11223',
  },
  {
    id: 'art_5',
    nameEn: 'Tukaram Clay Potter SHG (5 Artisans)',
    nameHi: 'तुकाराम स्वयं सहायता समूह (5 कारीगर)',
    craftEn: 'Kiln Firing & Packaging Hub',
    craftHi: 'भट्टी पकाई एवं पैकेजिंग केंद्र',
    quota: 2550,
    completed: 2040,
    status: 'ON_TRACK',
    phone: '+91 98112 33445',
  },
];

export const SahyogiHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();
  const { t, isHindi } = useTranslation();
  const [artisans, setArtisans] = useState<ClusterArtisan[]>(CLUSTER_ARTISANS);
  const [qcChecked, setQcChecked] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = isHindi ? 'कलाकार सेतु ~ सहयोगी' : 'Kalakar Setu ~ Sahyogi';
    }
  }, [isHindi]);

  const sahyogiName = user?.fullName || (isHindi ? 'पूजा वर्मा' : 'Pooja Verma');

  const totalQuota = artisans.reduce((acc, a) => acc + a.quota, 0);
  const totalCompleted = artisans.reduce((acc, a) => acc + a.completed, 0);
  const progressPercent = Math.round((totalCompleted / totalQuota) * 100);

  const handleSosReallocate = (artisanId: string) => {
    Alert.alert(
      t.sahyogi.sosTitle,
      t.sahyogi.sosMessage,
      [
        { text: t.sahyogi.cancel, style: 'cancel' },
        {
          text: t.sahyogi.confirmRealloc,
          style: 'destructive',
          onPress: () => {
            setArtisans((prev) =>
              prev.map((a) => {
                if (a.id === artisanId) {
                  return { ...a, quota: a.quota - 150, status: 'ON_TRACK' };
                }
                if (a.id === 'art_5') {
                  return { ...a, quota: a.quota + 150 };
                }
                return a;
              })
            );
            Alert.alert(
              t.sahyogi.sosSuccessTitle,
              t.sahyogi.sosSuccessMsg
            );
          },
        },
      ]
    );
  };

  const handleAuditSpec = () => {
    setQcChecked(true);
    Alert.alert(
      t.sahyogi.qcLoggedTitle,
      t.sahyogi.qcLoggedMsg
    );
  };
  const handleQualityAudit = handleAuditSpec;

  const handleVoiceOnboard = () => {
    Alert.alert(
      t.sahyogi.voiceOnboardTitle,
      t.sahyogi.voiceOnboardMsg,
      [
        { text: t.sahyogi.cancel, style: 'cancel' },
        {
          text: `${t.sahyogi.voiceOnboardStart} →`,
          onPress: () => navigation.navigate('MicPermission'),
        },
      ]
    );
  };
  const handleOnboardNewArtisan = handleVoiceOnboard;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Sahyogi Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/kalakar_setu_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View>
            <Text variant="headlineSmall" weight="bold" color="#0F172A" style={styles.headerTitle}>
              {t.common.appName}
            </Text>
            <View style={styles.roleBadgePill}>
              <Text style={styles.roleBadgeText}>🤝 {t.sahyogi.badge}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileAvatarButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          accessibilityLabel="Profile"
        >
          <Image
            source={require('../../../assets/sahyogi_3d_avatar.jpg')}
            style={styles.profileAvatarImg}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cluster Lead Greeting Section */}
        <View style={styles.clusterGreetingSection}>
          <Text variant="headlineMedium" weight="bold" color="#0F172A">
            {t.artisan.namaste}, {sahyogiName}!
          </Text>
          <Text variant="caption" color="#64748B" style={{ marginTop: 2 }}>
            {isHindi ? 'कोल्हापुर कारीगर क्लस्टर #CLUST-MHB-01 • 5 सक्रिय इकाइयां' : 'Kolhapur Artisan Cluster #CLUST-MHB-01 • 5 Active Units'}
          </Text>
        </View>

        {/* Collective Batch Fulfillment Tracker */}
        <Card style={styles.summaryCard} variant="elevated">
          <View style={styles.summaryTopRow}>
            <View>
              <Text variant="caption" weight="bold" color="#EA580C">
                {t.sahyogi.activeB2bOrder}
              </Text>
              <Text variant="headlineSmall" weight="bold" color="#0F172A">
                Tata Consultancy Services (TCS)
              </Text>
              <Text variant="bodySmall" color="#64748B">
                {isHindi ? '5,000 दिवाली मिट्टी के दीये' : '5,000 Diwali Terracotta Diyas'} • {t.sahyogi.dueInDays}
              </Text>
            </View>
            <View style={styles.payoutPill}>
              <Text variant="bodyMedium" weight="bold" color="#16A34A">
                ₹1,25,000
              </Text>
              <Text style={{ fontSize: 10, color: '#16A34A', fontWeight: '600' }}>{t.sahyogi.advancePaid}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text variant="caption" weight="bold" color="#0F172A">
                {t.sahyogi.collectiveProgress}
              </Text>
              <Text variant="caption" weight="bold" color="#16A34A">
                {progressPercent}% ({totalCompleted.toLocaleString(isHindi ? 'hi-IN' : 'en-IN')} / {totalQuota.toLocaleString(isHindi ? 'hi-IN' : 'en-IN')} {t.sahyogi.pieces})
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.summaryActionRow}>
            <TouchableOpacity
              style={[styles.qcBtn, qcChecked && { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]}
              onPress={handleQualityAudit}
              activeOpacity={0.85}
            >
              <Text variant="caption" weight="bold" color={qcChecked ? '#16A34A' : '#4338CA'}>
                {qcChecked ? `✓ ${t.sahyogi.qcPassed}` : `🔍 ${t.sahyogi.qcAuditBtn}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.briefBtn}
              onPress={() =>
                navigation.navigate('OpportunityDetail', { opportunityId: 'opp_tcs_diwali_01' })
              }
              activeOpacity={0.85}
            >
              <Text variant="caption" weight="bold" color="#EA580C">
                {t.sahyogi.viewBrief} 📋
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 4 Sahyogi Field Tools Grid */}
        <View style={styles.sectionTitleRow}>
          <Text variant="headlineSmall" weight="bold" color="#0F172A">
            ⚡ {t.sahyogi.fieldToolsTitle}
          </Text>
          <Text variant="caption" color="#64748B">
            {t.sahyogi.fieldToolsSub}
          </Text>
        </View>

        <View style={styles.toolsGrid}>
          {/* Tool 1: Voice Onboarding */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={handleOnboardNewArtisan}
            activeOpacity={0.88}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Text style={{ fontSize: 20 }}>👥</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {t.sahyogi.voiceOnboarding}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.sahyogi.voiceOnboardingSub}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Tool 2: AI Smart Catalogue Help */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('AiEnhancement')}
            activeOpacity={0.88}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 20 }}>📸</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {t.sahyogi.catalogueStudio}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.sahyogi.catalogueStudioSub}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Tool 3: Fair Price Ledger Audit */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('PricingRecommendation')}
            activeOpacity={0.88}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 20 }}>💰</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {t.sahyogi.fairPriceTracker}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.sahyogi.fairPriceTrackerSub}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Tool 4: Digital Craft Passport Verifier */}
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => navigation.navigate('PublishSuccess')}
            activeOpacity={0.88}
          >
            <View style={[styles.toolIconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Text style={{ fontSize: 20 }}>🏛️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {t.sahyogi.qrPassportGen}
              </Text>
              <Text variant="caption" color="#64748B">
                {t.sahyogi.qrPassportGenSub}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Cluster Member Workload & Health Monitor */}
        <View style={styles.sectionTitleRow}>
          <Text variant="headlineSmall" weight="bold" color="#0F172A">
            👥 {t.sahyogi.clusterUnitsTitle}
          </Text>
          <Text variant="caption" color="#64748B">
            {t.sahyogi.clusterUnitsSub}
          </Text>
        </View>

        <View style={styles.artisanList}>
          {artisans.map((artisan) => (
            <Card key={artisan.id} style={styles.artisanCard}>
              <View style={styles.artisanCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyLarge" weight="bold" color="#0F172A">
                    {isHindi ? artisan.nameHi : artisan.nameEn}
                  </Text>
                  <Text variant="caption" color="#64748B">
                    {isHindi ? artisan.craftHi : artisan.craftEn} • {artisan.phone}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    artisan.status === 'NEEDS_HELP'
                      ? { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }
                      : { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      artisan.status === 'NEEDS_HELP' ? { color: '#B91C1C' } : { color: '#16A34A' },
                    ]}
                  >
                    {artisan.status === 'NEEDS_HELP' ? `⚠️ ${t.sahyogi.delayedSick}` : `✓ ${t.sahyogi.onSchedule}`}
                  </Text>
                </View>
              </View>

              {/* Individual Progress Track */}
              <View style={styles.artisanProgressTrack}>
                <View
                  style={[
                    styles.artisanProgressFill,
                    {
                      width: `${Math.round((artisan.completed / artisan.quota) * 100)}%`,
                      backgroundColor: artisan.status === 'NEEDS_HELP' ? '#EF4444' : '#EA580C',
                    },
                  ]}
                />
              </View>

              <View style={styles.artisanFooter}>
                <Text variant="caption" weight="bold" color="#475569">
                  {artisan.completed} / {artisan.quota} {t.sahyogi.pieces} ({Math.round((artisan.completed / artisan.quota) * 100)}%)
                </Text>

                {artisan.status === 'NEEDS_HELP' ? (
                  <TouchableOpacity
                    style={styles.sosReallocateBtn}
                    onPress={() => handleSosReallocate(artisan.id)}
                    activeOpacity={0.85}
                  >
                    <Text variant="caption" weight="bold" color="#FFFFFF">
                      🚨 {t.sahyogi.reallocateQuota}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => Alert.alert(t.common.call, `${t.sahyogi.callArtisan}: ${isHindi ? artisan.nameHi : artisan.nameEn} (${artisan.phone})`)}
                  >
                    <Text variant="caption" weight="bold" color="#4338CA">
                      📞 {t.sahyogi.callArtisan}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Dispatch & Logistics Box */}
        <Card style={styles.dispatchCard}>
          <Text style={{ fontSize: 24, marginBottom: 8 }}>📦</Text>
          <Text variant="headlineSmall" weight="bold" color="#0F172A">
            {t.sahyogi.batchDispatchTitle}
          </Text>
          <Text variant="bodySmall" color="#64748B" style={{ marginTop: 4, textAlign: 'center' }}>
            {t.sahyogi.batchDispatchSub}
          </Text>
          <Button
            label={t.sahyogi.generateConsignment}
            variant="primary"
            onPress={() =>
              Alert.alert(
                t.sahyogi.consignmentTitle,
                t.sahyogi.consignmentMsg
              )
            }
            style={{ marginTop: 12, width: '100%' }}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE8DC',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  roleBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginTop: 1,
  },
  roleBadgeText: {
    color: '#16A34A',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileAvatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#16A34A',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
  clusterGreetingSection: {
    marginBottom: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    marginBottom: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  payoutPill: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'flex-end',
  },
  progressSection: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 5,
  },
  summaryActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qcBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  briefBtn: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleRow: {
    marginBottom: 12,
    marginTop: 8,
  },
  toolsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
    gap: 12,
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '600',
    marginLeft: 4,
  },
  artisanList: {
    gap: 12,
    marginBottom: 20,
  },
  artisanCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
  artisanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  artisanProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 10,
  },
  artisanProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  artisanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sosReallocateBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  callBtn: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dispatchCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE8DC',
  },
});
