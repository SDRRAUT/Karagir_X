import React, { useState, useEffect } from 'react';
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
import { useTranslation } from '@/hooks/useTranslation';
import { KhataScreen } from './KhataScreen';

import { realisticVoiceService } from '@/services/realisticVoiceService';

const { width } = Dimensions.get('window');

type OrderTabType = 'new' | 'making' | 'done';

export const OrdersScreen: React.FC<any> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isHindi } = useTranslation();
  const initialSection = route?.params?.section === 'khata' ? 'khata' : 'orders';
  const [activeSection, setActiveSection] = useState<'orders' | 'khata'>(initialSection);
  const [activeTab, setActiveTab] = useState<OrderTabType>('new');
  const [acceptedOrders, setAcceptedOrders] = useState<string[]>([]);
  const [rejectedOrders, setRejectedOrders] = useState<string[]>([]);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(false);

  useEffect(() => {
    if (route?.params?.section) {
      setActiveSection(route.params.section);
    }
  }, [route?.params?.section]);

  const handleSpeak = (text: string) => {
    realisticVoiceService.speak(text, {
      language: 'hi-IN',
      rate: 0.95,
    });
  };

  const handleAcceptOrder = (id: string) => {
    setAcceptedOrders((prev) => [...prev, id]);
    handleSpeak('Order accept ho gaya hai. Paisa escrow mein surakshit hai. Production shuru karein.');
  };

  const handleRejectOrder = (id: string) => {
    setRejectedOrders((prev) => [...prev, id]);
    handleSpeak('Order reject kar diya gaya hai.');
  };

  const handleRequestPickup = () => {
    setPickupRequested(true);
    handleSpeak('India Post Speed Post pickup book ho gaya hai. Postman kal subah parcel lene aayega.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation?.canGoBack?.() ? navigation.goBack() : navigation?.navigate?.('HomeTab'))}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {activeSection === 'orders' ? '📦 मेरे Orders' : '💰 मेरा खाता (Khata)'}
          </Text>
          <Text style={styles.headerSub}>
            {activeSection === 'orders' ? 'Fulfillment, Escrow & Dispatch' : '100% Transparent Fair Price Ledger'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            handleSpeak(
              activeSection === 'orders'
                ? 'Aapke 2 naye orders hain, 1 order production mein hai aur 12 orders deliver ho chuke hain.'
                : 'Aapki kul kamai chaubees hazaar aath sau rupaye hai. Escrow mein do hazaar aath sau baanve rupaye surakshit hain.'
            )
          }
          style={styles.headerAudioBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.headerAudioIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Section Switch: Orders vs Khata Ledger */}
      <View style={styles.mainSegmentContainer}>
        <TouchableOpacity
          onPress={() => setActiveSection('orders')}
          style={[styles.mainSegmentPill, activeSection === 'orders' && styles.mainSegmentPillActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainSegmentText, activeSection === 'orders' && styles.mainSegmentTextActive]}>
            📦 {isHindi ? 'ऑर्डर्स' : 'Orders'} (15)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSection('khata')}
          style={[styles.mainSegmentPill, activeSection === 'khata' && styles.mainSegmentPillActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainSegmentText, activeSection === 'khata' && styles.mainSegmentTextActive]}>
            💰 {isHindi ? 'बही-खाता' : 'Khata Ledger'} (₹24,800)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Khata Ledger Mode */}
      {activeSection === 'khata' && (
        <View style={{ flex: 1 }}>
          <KhataScreen navigation={navigation} embedded={true} />
        </View>
      )}

      {/* Orders Fulfillment Mode */}
      {activeSection === 'orders' && (
        <>
          {/* Segmented Tab Filter Pills */}
          <View style={styles.tabsFilterContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('new')}
          style={[styles.tabFilterPill, activeTab === 'new' && styles.tabFilterPillActiveNew]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabFilterText, activeTab === 'new' && styles.tabFilterTextActiveNew]}>
            🔴 New (2)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('making')}
          style={[styles.tabFilterPill, activeTab === 'making' && styles.tabFilterPillActiveMaking]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabFilterText, activeTab === 'making' && styles.tabFilterTextActiveMaking]}>
            🟡 Making (1)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('done')}
          style={[styles.tabFilterPill, activeTab === 'done' && styles.tabFilterPillActiveDone]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabFilterText, activeTab === 'done' && styles.tabFilterTextActiveDone]}>
            🟢 Done (12)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* ------------------------------------------------------------- */}
        {/* TAB 1: NEW ORDERS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'new' && (
          <View style={styles.tabContentBlock}>
            <View style={styles.noticeBar}>
              <Text style={styles.noticeBarText}>⚠️ 2 orders accept karne ke liye bache hain</Text>
            </View>

            {/* Order Card 1 */}
            {!rejectedOrders.includes('ord_1') && (
              <View style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderBadgeNew}>
                    <Text style={styles.orderBadgeNewText}>🔴 NEW ORDER</Text>
                  </View>
                  <View style={styles.timerBadge}>
                    <Text style={styles.timerBadgeText}>⏰ 18 ghante bache</Text>
                  </View>
                </View>

                {/* Buyer & Product Info */}
                <View style={styles.buyerRow}>
                  <View style={styles.buyerAvatar}>
                    <Text style={{ fontSize: 16 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.buyerName}>Priya Sharma ✓</Text>
                    <Text style={styles.buyerCity}>Kothrud, Pune, Maharashtra</Text>
                  </View>
                  <Text style={styles.orderPrice}>₹1,250</Text>
                </View>

                <View style={styles.productSpecRow}>
                  <Text style={{ fontSize: 24 }}>🪔</Text>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.productSpecName}>Terracotta Diya Set × 2</Text>
                    <Text style={styles.productSpecSub}>5-piece traditional festive finish</Text>
                  </View>
                </View>

                {/* Escrow Trust Guarantee Box */}
                <View style={styles.escrowTrustBox}>
                  <Text style={styles.escrowTrustText}>
                    🔒 <Text style={{ fontWeight: '700' }}>Escrow: Paisa Safe hai</Text> — Delivery ke baad direct bank account mein transfer hoga.
                  </Text>
                </View>

                {/* Action Buttons Row */}
                {acceptedOrders.includes('ord_1') ? (
                  <View style={styles.acceptedOrderBanner}>
                    <Text style={styles.acceptedOrderText}>✓ Order Accepted! Moved to Making tab.</Text>
                  </View>
                ) : (
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      onPress={() =>
                        handleSpeak(
                          'Priya Sharma Ji Pune se Terracotta Diya Set ke 2 piece ka order de rahi hain. Total price ek hazaar do sau pachaas rupaye hai.'
                        )
                      }
                      style={styles.listenButton}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.listenButtonText}>🔊 Suno</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleRejectOrder('ord_1')}
                      style={styles.rejectButton}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.rejectButtonText}>✗ Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleAcceptOrder('ord_1')}
                      style={styles.acceptButton}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.acceptButtonText}>✓ ACCEPT</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Order Card 2 */}
            <View style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderBadgeNew}>
                  <Text style={styles.orderBadgeNewText}>🔴 NEW ORDER</Text>
                </View>
                <View style={styles.timerBadge}>
                  <Text style={styles.timerBadgeText}>⏰ 22 ghante bache</Text>
                </View>
              </View>

              <View style={styles.buyerRow}>
                <View style={styles.buyerAvatar}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>Rahul Mehta ✓</Text>
                  <Text style={styles.buyerCity}>Andheri West, Mumbai</Text>
                </View>
                <Text style={styles.orderPrice}>₹850</Text>
              </View>

              <View style={styles.productSpecRow}>
                <Text style={{ fontSize: 24 }}>🏺</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.productSpecName}>Clay Water Pot (Matka) × 1</Text>
                  <Text style={styles.productSpecSub}>Natural cooling Kolhapur clay</Text>
                </View>
              </View>

              <View style={styles.escrowTrustBox}>
                <Text style={styles.escrowTrustText}>
                  🔒 <Text style={{ fontWeight: '700' }}>Escrow: ₹850 Locked</Text> — Direct Auto-Credit ready.
                </Text>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  onPress={() =>
                    handleSpeak('Rahul Mehta Ji Mumbai se Clay Water Pot ka order de rahe hain. Price aath sau pachaas rupaye.')
                  }
                  style={styles.listenButton}
                  activeOpacity={0.75}
                >
                  <Text style={styles.listenButtonText}>🔊 Suno</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRejectOrder('ord_2')}
                  style={styles.rejectButton}
                  activeOpacity={0.75}
                >
                  <Text style={styles.rejectButtonText}>✗ Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAcceptOrder('ord_2')}
                  style={styles.acceptButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptButtonText}>✓ ACCEPT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: IN PRODUCTION (MAKING) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'making' && (
          <View style={styles.tabContentBlock}>
            <View style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderBadgeMaking}>
                  <Text style={styles.orderBadgeMakingText}>🟡 IN PRODUCTION</Text>
                </View>
                <View style={styles.timerBadgeMaking}>
                  <Text style={styles.timerBadgeMakingText}>⏰ 5 din bache hain</Text>
                </View>
              </View>

              <View style={styles.buyerRow}>
                <View style={styles.buyerAvatar}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>Anita Desai (Mumbai)</Text>
                  <Text style={styles.buyerCity}>📅 Deliver by: 12 Sept 2026</Text>
                </View>
                <Text style={styles.orderPrice}>₹2,250</Text>
              </View>

              <View style={styles.productSpecRow}>
                <Text style={{ fontSize: 24 }}>🏺</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.productSpecName}>Handcrafted Clay Pot × 5</Text>
                  <Text style={styles.productSpecSub}>GI Certified Kolhapur Terracotta</Text>
                </View>
              </View>

              {/* 5-STAGE VISUAL PROGRESS BAR */}
              <View style={styles.progressStagesBox}>
                <Text style={styles.progressStagesTitle}>Crafting Lifecycle Progress:</Text>
                <View style={styles.stageTrackRow}>
                  {/* Stage 1 */}
                  <View style={styles.stageNode}>
                    <View style={[styles.stageCircle, styles.stageCircleDone]}>
                      <Text style={styles.stageCheck}>✓</Text>
                    </View>
                    <Text style={styles.stageLabel}>Clay</Text>
                  </View>
                  <View style={[styles.stageConnector, styles.stageConnectorDone]} />

                  {/* Stage 2 */}
                  <View style={styles.stageNode}>
                    <View style={[styles.stageCircle, styles.stageCircleDone]}>
                      <Text style={styles.stageCheck}>✓</Text>
                    </View>
                    <Text style={styles.stageLabel}>Shape</Text>
                  </View>
                  <View style={[styles.stageConnector, styles.stageConnectorDone]} />

                  {/* Stage 3 */}
                  <View style={styles.stageNode}>
                    <View style={[styles.stageCircle, styles.stageCircleDone]}>
                      <Text style={styles.stageCheck}>✓</Text>
                    </View>
                    <Text style={styles.stageLabel}>Fire</Text>
                  </View>
                  <View style={styles.stageConnector} />

                  {/* Stage 4 */}
                  <View style={styles.stageNode}>
                    <View style={styles.stageCircle}>
                      <Text style={styles.stagePendingText}>4</Text>
                    </View>
                    <Text style={styles.stageLabel}>Paint</Text>
                  </View>
                  <View style={styles.stageConnector} />

                  {/* Stage 5 */}
                  <View style={styles.stageNode}>
                    <View style={styles.stageCircle}>
                      <Text style={styles.stagePendingText}>5</Text>
                    </View>
                    <Text style={styles.stageLabel}>Pack</Text>
                  </View>
                </View>
              </View>

              {/* Upload Production Photo Button (Trust Builder) */}
              <TouchableOpacity
                onPress={() => {
                  setUploadedPhoto(true);
                  handleSpeak('Crafting photo upload ho gayi hai. Buyer ko update bhej diya gaya hai.');
                }}
                style={styles.photoUploadButton}
                activeOpacity={0.8}
              >
                <Text style={styles.photoUploadText}>
                  {uploadedPhoto ? '✓ Progress Photo Sent to Buyer!' : '🎥 [Progress photo upload] (Buyer trust)'}
                </Text>
              </TouchableOpacity>

              {/* India Post Pickup Trigger CTA */}
              {pickupRequested ? (
                <View style={styles.pickupDoneBanner}>
                  <Text style={styles.pickupDoneTitle}>📮 India Post Pickup Booked!</Text>
                  <Text style={styles.pickupDoneSub}>
                    Tracking ID: <Text style={{ fontWeight: '800' }}>EK928371948IN</Text> • Pickup tomorrow morning.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRequestPickup}
                  style={styles.requestPickupButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.requestPickupText}>📮 Pickup Bulao (Ready to Ship)</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DELIVERED (DONE) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'done' && (
          <View style={styles.tabContentBlock}>
            {/* Completed Order 1 */}
            <View style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderBadgeDone}>
                  <Text style={styles.orderBadgeDoneText}>🟢 DELIVERED & PAID</Text>
                </View>
                <Text style={styles.deliveryDateText}>6 Sept 2026</Text>
              </View>

              <View style={styles.buyerRow}>
                <View style={styles.buyerAvatar}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>Sunil Shinde ✓</Text>
                  <Text style={styles.buyerCity}>Satara, Maharashtra</Text>
                </View>
                <Text style={[styles.orderPrice, { color: '#059669' }]}>+₹2,400</Text>
              </View>

              <View style={styles.settledInfoBox}>
                <Text style={styles.settledText}>
                  💰 ₹2,400 credited to SBI A/C ••••4021 (UTR: 902837482910)
                </Text>
                <Text style={styles.trackingSub}>📮 India Post Speed Post: EK928371948IN</Text>
              </View>
            </View>

            {/* Completed Order 2 */}
            <View style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={styles.orderBadgeDone}>
                  <Text style={styles.orderBadgeDoneText}>🟢 DELIVERED & PAID</Text>
                </View>
                <Text style={styles.deliveryDateText}>4 Sept 2026</Text>
              </View>

              <View style={styles.buyerRow}>
                <View style={styles.buyerAvatar}>
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>Meera Joshi ✓</Text>
                  <Text style={styles.buyerCity}>Bengaluru, Karnataka</Text>
                </View>
                <Text style={[styles.orderPrice, { color: '#059669' }]}>+₹1,800</Text>
              </View>

              <View style={styles.settledInfoBox}>
                <Text style={styles.settledText}>
                  💰 ₹1,800 credited to SBI A/C ••••4021 (UTR: 894729103829)
                </Text>
                <Text style={styles.trackingSub}>📮 India Post Speed Post: EK829104829IN</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  )}
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
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 26,
  },
  headerLeft: {
    flex: 1,
  },
  mainSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    padding: 3,
    borderRadius: 14,
    gap: 6,
  },
  mainSegmentPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: 'transparent',
  },
  mainSegmentPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  mainSegmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  mainSegmentTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  headerAudioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAudioIcon: {
    fontSize: 16,
  },
  tabsFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  tabFilterPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabFilterPillActiveNew: {
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  tabFilterPillActiveMaking: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tabFilterPillActiveDone: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  tabFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabFilterTextActiveNew: {
    color: '#E11D48',
  },
  tabFilterTextActiveMaking: {
    color: '#D97706',
  },
  tabFilterTextActiveDone: {
    color: '#15803D',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 95,
  },
  tabContentBlock: {
    gap: 12,
  },
  noticeBar: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noticeBarText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#92400E',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderBadgeNew: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBadgeNewText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  orderBadgeMaking: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBadgeMakingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  orderBadgeDone: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBadgeDoneText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  timerBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timerBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#BE123C',
  },
  timerBadgeMaking: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  timerBadgeMakingText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B45309',
  },
  deliveryDateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  buyerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  buyerCity: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  productSpecRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  productSpecName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  productSpecSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  escrowTrustBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 12,
  },
  escrowTrustText: {
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listenButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  listenButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  rejectButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  acceptedOrderBanner: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptedOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  progressStagesBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  progressStagesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  stageTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stageNode: {
    alignItems: 'center',
  },
  stageCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageCircleDone: {
    backgroundColor: '#059669',
  },
  stageCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  stagePendingText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  stageLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  stageConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  stageConnectorDone: {
    backgroundColor: '#059669',
  },
  photoUploadButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  photoUploadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  requestPickupButton: {
    backgroundColor: '#EA580C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestPickupText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pickupDoneBanner: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  pickupDoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  pickupDoneSub: {
    fontSize: 11,
    color: '#065F46',
    marginTop: 2,
  },
  settledInfoBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginTop: 6,
  },
  settledText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#166534',
  },
  trackingSub: {
    fontSize: 10.5,
    color: '#15803D',
    marginTop: 2,
  },
});
