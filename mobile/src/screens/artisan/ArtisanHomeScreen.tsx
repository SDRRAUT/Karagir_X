import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { MelaModeModal } from './components/MelaModeModal';
import { B2BBulkModal } from './components/B2BBulkModal';
import { FairPriceCalculatorModal } from './components/FairPriceCalculatorModal';
import { CraftPassportModal } from './components/CraftPassportModal';

const { width } = Dimensions.get('window');

export const ArtisanHomeScreen: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [showMelaModal, setShowMelaModal] = useState(false);
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [showFairPriceModal, setShowFairPriceModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  const handleSpeak = (text: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const CORE_PILLARS = [
    {
      id: 'p1',
      title: 'Voice-First Listing',
      hindi: 'आवाज़ से लिस्टिंग',
      desc: '12 dialects regional speech intake',
      emoji: '🎙️',
      color: '#EA580C',
      bg: '#FFF7ED',
      action: () => navigation?.navigate?.('SaathiTab'),
    },
    {
      id: 'p2',
      title: 'Auto Product Catalog',
      hindi: 'स्वचालित कैटलॉग',
      desc: 'AI synthesizes story & specs in 30s',
      emoji: '📝',
      color: '#7C3AED',
      bg: '#F5F3FF',
      action: () => navigation?.navigate?.('CreateTab'),
    },
    {
      id: 'p3',
      title: 'Photo Enhancement',
      hindi: 'फोटो स्टूडियो AI',
      desc: '4K studio lighting & background removal',
      emoji: '✨',
      color: '#0284C7',
      bg: '#F0F9FF',
      action: () => navigation?.navigate?.('CreateTab'),
    },
    {
      id: 'p4',
      title: 'Fair Price Calculator',
      hindi: 'पारदर्शी मूल्य कैलकुलेटर',
      desc: 'Material + labor hours + GI skill',
      emoji: '💰',
      color: '#059669',
      bg: '#ECFDF5',
      action: () => setShowFairPriceModal(true),
    },
    {
      id: 'p5',
      title: 'QR Craft Passport',
      hindi: 'डिजिटल शिल्प पासपोर्ट',
      desc: 'Cryptographic GI provenance & story',
      emoji: '🏛️',
      color: '#4F46E5',
      bg: '#EEF2FF',
      action: () => setShowPassportModal(true),
    },
    {
      id: 'p6',
      title: 'Artisan Clusters (B2B)',
      hindi: 'कारीगर क्लस्टर समूह',
      desc: 'Virtual cooperative for bulk orders',
      emoji: '🏢',
      color: '#D97706',
      bg: '#FEF3C7',
      action: () => setShowB2BModal(true),
    },
    {
      id: 'p7',
      title: 'Buyer–Artisan Matching',
      hindi: 'खरीदार-कारीगर मिलान',
      desc: 'Direct GI discovery & Mela digital bridge',
      emoji: '🤝',
      color: '#E11D48',
      bg: '#FFF1F2',
      action: () => setShowMelaModal(true),
    },
    {
      id: 'p8',
      title: 'Order & Live Tracking',
      hindi: 'लाइव डिलीवरी ट्रैकिंग',
      desc: '5-stage progress + India Post pickup',
      emoji: '🚚',
      color: '#16A34A',
      bg: '#F0FDF4',
      action: () => navigation?.navigate?.('OrdersTab'),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 1. Header (Compact, Left-Aligned Brand, Right Avatar & Notification) */}
      <View style={styles.header}>
        <View style={styles.headerBrandRow}>
          <View style={styles.headerLogoBadge}>
            <Text style={styles.headerLogoEmoji}>🎨</Text>
          </View>
          <Text style={styles.brandTitle}>Kalakar Setu</Text>
        </View>

        <View style={styles.headerRightCluster}>
          {/* Notifications Bell with Badge */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => handleSpeak('Aapke 3 naye notification hain: 2 naye orders aur 1 mela alert.')}
            activeOpacity={0.7}
          >
            <Icon name="bell" size={20} color="#334155" />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Profile Avatar Button (Ramesh Ji) */}
          <TouchableOpacity
            onPress={() => navigation?.navigate?.('ProfileTab')}
            style={styles.avatarButton}
            activeOpacity={0.75}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <Text style={styles.avatarName}>Ramesh</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* 2. Personalized Greeting Row */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>🌞 Namaste Ramesh Ji</Text>
            <Text style={styles.greetingSub}>आज सोमवार है, दिन शुभ है</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              handleSpeak(
                'Namaste Ramesh Ji! Aaj somwar hai, din shubh hai. Aaj aapki kamai do hazaar char sau rupaye hui hai. Do naye order accept karne ke liye pending hain.'
              )
            }
            style={styles.voiceGreetButton}
            activeOpacity={0.75}
          >
            <Text style={styles.voiceGreetIcon}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* 3. BIG EARNINGS CARD (Emotional Hook - P1) */}
        <View style={styles.bigEarningsCard}>
          <View style={styles.earningsHeaderRow}>
            <Text style={styles.earningsCardLabel}>💰 आज की कमाई (Today's Earnings)</Text>
            <TouchableOpacity
              onPress={() => handleSpeak('Aaj aapne do hazaar char sau rupaye kamaye hain, kal se tees pratishat zyada.')}
              style={styles.audioPill}
            >
              <Text style={styles.audioPillText}>🔊 Suno</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.earningsAmount}>₹ 2,400</Text>

          <View style={styles.earningsGrowthRow}>
            <View style={styles.growthBadge}>
              <Text style={styles.growthBadgeText}>📈 कल से 30% ज़्यादा</Text>
            </View>
            <Text style={styles.escrowSubText}>🔒 ₹2,892 Escrow mein safe hai</Text>
          </View>
        </View>

        {/* 4. URGENT ACTIONS (⚡ ज़रूरी काम - Priority Alerts - P2) */}
        <View style={styles.urgentSection}>
          <Text style={styles.sectionHeaderTitle}>⚡ ज़रूरी काम (URGENT ACTIONS)</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate?.('OrdersTab')}
            style={styles.urgentAlertCard}
            activeOpacity={0.8}
          >
            <View style={styles.urgentRedBadge}>
              <View style={styles.urgentRedDot} />
              <Text style={styles.urgentRedText}>🔴 2 नए ORDER AAYE — ACCEPT KARO</Text>
            </View>
            <View style={styles.urgentTimerRow}>
              <Text style={styles.urgentTimerText}>⏰ 18 ghante bache hain accept karne ke liye</Text>
              <Text style={styles.urgentArrow}>Orders Dekhein →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. TODAY'S SMART TIP ("Kya Banayein" AI - P3) */}
        <View style={styles.tipSection}>
          <Text style={styles.sectionHeaderTitle}>🎁 आज का सुझाव (Today's Smart Tip)</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipHeaderRow}>
              <Text style={styles.tipBulb}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipFestival}>Diwali 45 din mein hai</Text>
                <Text style={styles.tipAction}>Terracotta Diya banana shuru karo</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleSpeak(
                    'Diwali festival 45 din mein hai. Terracotta diya banana shuru karein. 250 units par atharah hazaar saat sau pachas rupaye profit estimated hai.'
                  )
                }
                style={styles.tipAudioBtn}
              >
                <Text style={styles.tipAudioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipProfitBox}>
              <Text style={styles.tipProfitLabel}>Estimated Batch Profit:</Text>
              <Text style={styles.tipProfitValue}>₹18,750 (250 Units)</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation?.navigate?.('CreateTab')}
              style={styles.startBatchButton}
              activeOpacity={0.85}
            >
              <Text style={styles.startBatchButtonText}>शुरू करें (Start Crafting Batch) →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. MY SHOP SNAPSHOT (4 Mini KPIs - P4) */}
        <View style={styles.snapshotSection}>
          <Text style={styles.sectionHeaderTitle}>📊 मेरी दुकान (My Shop Snapshot)</Text>
          <View style={styles.snapshotGrid}>
            <View style={styles.snapshotTile}>
              <Text style={styles.snapshotVal}>12</Text>
              <Text style={styles.snapshotLbl}>Products</Text>
            </View>
            <View style={styles.snapshotTile}>
              <Text style={[styles.snapshotVal, { color: '#059669' }]}>3</Text>
              <Text style={styles.snapshotLbl}>Live Active</Text>
            </View>
            <View style={styles.snapshotTile}>
              <Text style={[styles.snapshotVal, { color: '#7C3AED' }]}>₹8k</Text>
              <Text style={styles.snapshotLbl}>This Week</Text>
            </View>
            <View style={styles.snapshotTile}>
              <Text style={[styles.snapshotVal, { color: '#D97706' }]}>⭐ 4.9</Text>
              <Text style={styles.snapshotLbl}>Rating</Text>
            </View>
          </View>
        </View>

        {/* 7. SPECIAL MODES (Mela Mode & B2B Bulk - P5) */}
        <View style={styles.specialModesSection}>
          <Text style={styles.sectionHeaderTitle}>🎪 विशेष मोड (Special Modes)</Text>
          <View style={styles.specialModesGrid}>
            {/* Mela Mode Trigger */}
            <TouchableOpacity
              onPress={() => setShowMelaModal(true)}
              style={styles.modeCardMela}
              activeOpacity={0.8}
            >
              <Text style={styles.modeCardEmoji}>🎪</Text>
              <Text style={styles.modeCardTitle}>Mela Mode</Text>
              <Text style={styles.modeCardSub}>Fast Exhibition POS & UPI QR</Text>
              <View style={styles.modeBadgeMela}>
                <Text style={styles.modeBadgeTextMela}>Live POS →</Text>
              </View>
            </TouchableOpacity>

            {/* B2B Bulk Trigger */}
            <TouchableOpacity
              onPress={() => setShowB2BModal(true)}
              style={styles.modeCardB2b}
              activeOpacity={0.8}
            >
              <Text style={styles.modeCardEmoji}>🏢</Text>
              <Text style={styles.modeCardTitle}>B2B Bulk</Text>
              <Text style={styles.modeCardSub}>Smart Cluster Cooperative</Text>
              <View style={styles.modeBadgeB2b}>
                <Text style={styles.modeBadgeTextB2b}>2 RFQs →</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 8. THE 8 CORE PILLARS INNOVATION HUB */}
        <View style={styles.pillarsSection}>
          <View style={styles.pillarsHeaderRow}>
            <View>
              <Text style={styles.sectionHeaderTitle}>✨ 8 CORE PILLARS (मुख्य विशेषताएं)</Text>
              <Text style={styles.pillarsSubTitle}>Tap any pillar to test live workflow</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleSpeak(
                  'Kalakar Setu ke aath mukhya stambh: Voice listing, automatic catalog, photo enhancement, fair price calculator, QR craft passport, artisan cluster, buyer matching, aur live delivery tracking.'
                )
              }
              style={styles.pillarsAudioBtn}
            >
              <Text style={styles.pillarsAudioIcon}>🔊</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pillarsGrid}>
            {CORE_PILLARS.map((pillar) => (
              <TouchableOpacity
                key={pillar.id}
                onPress={pillar.action}
                style={[styles.pillarCard, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}
                activeOpacity={0.8}
              >
                <View style={[styles.pillarIconBox, { backgroundColor: pillar.bg }]}>
                  <Text style={styles.pillarEmoji}>{pillar.emoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.pillarTitle}>{pillar.title}</Text>
                  <Text style={[styles.pillarHindi, { color: pillar.color }]}>{pillar.hindi}</Text>
                  <Text style={styles.pillarDesc} numberOfLines={1}>
                    {pillar.desc}
                  </Text>
                </View>
                <View style={[styles.pillarLaunchBadge, { backgroundColor: pillar.bg }]}>
                  <Text style={[styles.pillarLaunchText, { color: pillar.color }]}>Launch →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Mela Mode Interactive Modal */}
      <MelaModeModal visible={showMelaModal} onClose={() => setShowMelaModal(false)} />

      {/* B2B Bulk Interactive Modal */}
      <B2BBulkModal visible={showB2BModal} onClose={() => setShowB2BModal(false)} />

      {/* Fair Price Calculator Modal */}
      <FairPriceCalculatorModal
        visible={showFairPriceModal}
        onClose={() => setShowFairPriceModal(false)}
      />

      {/* QR Craft Passport Modal */}
      <CraftPassportModal
        visible={showPassportModal}
        onClose={() => setShowPassportModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBrandCol: {
    flex: 1,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoEmoji: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: -0.5,
  },
  headerRightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    gap: 6,
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 14,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 95,
    gap: 14,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  greetingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  greetingSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  voiceGreetButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceGreetIcon: {
    fontSize: 18,
  },
  bigEarningsCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(124, 58, 237, 0.28)',
      },
    }),
  },
  earningsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsCardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DDD6FE',
  },
  audioPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  audioPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  earningsAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  earningsGrowthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  growthBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  growthBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  escrowSubText: {
    fontSize: 11,
    color: '#EDE9FE',
    fontWeight: '600',
  },
  urgentSection: {},
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  urgentAlertCard: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  urgentRedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  urgentRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  urgentRedText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  urgentTimerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  urgentTimerText: {
    fontSize: 11.5,
    color: '#9F1239',
    fontWeight: '500',
  },
  urgentArrow: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  tipSection: {},
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipBulb: {
    fontSize: 26,
  },
  tipFestival: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tipAction: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  tipAudioBtn: {
    backgroundColor: '#FEF3C7',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipAudioIcon: {
    fontSize: 16,
  },
  tipProfitBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  tipProfitLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  tipProfitValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  startBatchButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startBatchButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  snapshotSection: {},
  snapshotGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  snapshotTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  snapshotVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  snapshotLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  specialModesSection: {},
  specialModesGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  modeCardMela: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  modeCardB2b: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
  },
  modeCardEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  modeCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modeCardSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginVertical: 4,
  },
  modeBadgeMela: {
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  modeBadgeTextMela: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  modeBadgeB2b: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  modeBadgeTextB2b: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  pillarsSection: {
    marginTop: 8,
  },
  pillarsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pillarsSubTitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  pillarsAudioBtn: {
    backgroundColor: '#EDE9FE',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarsAudioIcon: {
    fontSize: 16,
  },
  pillarsGrid: {
    gap: 8,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  pillarIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarEmoji: {
    fontSize: 22,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  pillarHindi: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  pillarDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  pillarLaunchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  pillarLaunchText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
