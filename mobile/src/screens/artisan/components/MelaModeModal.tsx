import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { useTranslation } from '@/hooks/useTranslation';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import Svg, { Rect } from 'react-native-svg';

interface MelaModeModalProps {
  visible: boolean;
  onClose: () => void;
}

interface QuickProduct {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  emoji: string;
}

const QUICK_PRODUCTS: QuickProduct[] = [
  { id: '1', name: 'Terracotta Diya', hindiName: 'दीया', price: 150, emoji: '🪔' },
  { id: '2', name: 'Handmade Pot', hindiName: 'मिट्टी का घड़ा', price: 450, emoji: '🏺' },
  { id: '3', name: 'Artisan Vase', hindiName: 'सजावटी फूलदान', price: 800, emoji: '🏺' },
  { id: '4', name: 'Clay Plate Set', hindiName: 'थाली सेट', price: 350, emoji: '🍽️' },
];

export const MelaModeModal: React.FC<MelaModeModalProps> = ({ visible, onClose }) => {
  const { isHindi } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<{ [id: string]: number }>({
    '1': 1,
    '2': 1,
    '3': 1,
  });
  const [followersCount, setFollowersCount] = useState(12);
  const [todaySales, setTodaySales] = useState(4200);
  const [salesCount, setSalesCount] = useState(8);
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateTotal = () => {
    return QUICK_PRODUCTS.reduce((sum, item) => {
      const qty = selectedProducts[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  };

  const totalAmount = calculateTotal() || 1400;

  const handleToggleProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const current = prev[id] || 0;
      return {
        ...prev,
        [id]: current > 0 ? 0 : 1,
      };
    });
  };

  const handleCompleteSale = () => {
    setShowSuccess(true);
    setTodaySales((prev) => prev + totalAmount);
    setSalesCount((prev) => prev + 1);
    setFollowersCount((prev) => prev + 1);

    const speechText = isHindi
      ? `${totalAmount} रुपये का भुगतान प्राप्त हुआ। बिल सफलतापूर्वक सहेजा गया।`
      : `Payment of ${totalAmount} rupees received. Bill saved successfully.`;
    realisticVoiceService.speak(speechText, {
      language: isHindi ? 'hi-IN' : 'en-IN',
      rate: 0.95,
    });

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProducts({});
    }, 2200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.modalBackButton} activeOpacity={0.7} accessibilityLabel="Back">
              <Text style={styles.modalBackIcon}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerLeft}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>{isHindi ? '🔴 लाइव मेला' : '🔴 LIVE MELA'}</Text>
              </View>
              <Text style={styles.melaTitle}>{isHindi ? '🎪 मेला मोड - लाइव' : '🎪 Mela Mode - Live!'}</Text>
              <Text style={styles.locationSubText}>
                {isHindi ? '📍 सूरजकुंड मेला, फरीदाबाद' : '📍 Surajkund Mela, Faridabad'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Text style={styles.closeButtonText}>{isHindi ? '✕ बंद करें' : '✕ Exit'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Live Stats Bar */}
            <View style={styles.statsStrip}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{isHindi ? '💰 आज की बिक्री' : "💰 Today's Sales"}</Text>
                <Text style={styles.statValue}>₹{todaySales.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{isHindi ? '🛒 कुल ऑर्डर' : '🛒 Total Orders'}</Text>
                <Text style={styles.statValue}>{salesCount} {isHindi ? 'ऑर्डर' : 'orders'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>{isHindi ? '📱 नए फॉलोअर्स' : '📱 New Followers'}</Text>
                <Text style={[styles.statValue, { color: '#059669' }]}>+{followersCount}</Text>
              </View>
            </View>

            {/* Quick Bill Product Selector */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  {isHindi ? '💳 त्वरित बिलिंग (फास्ट चेकआउट)' : '💳 QUICK BILL (Fast Checkout)'}
                </Text>
                <Text style={styles.sectionHelper}>
                  {isHindi ? 'जोड़ने / हटाने के लिए टैप करें' : 'Tap to add/remove'}
                </Text>
              </View>

              <View style={styles.productGrid}>
                {QUICK_PRODUCTS.map((prod) => {
                  const isSelected = (selectedProducts[prod.id] || 0) > 0;
                  return (
                    <TouchableOpacity
                      key={prod.id}
                      onPress={() => handleToggleProduct(prod.id)}
                      style={[styles.productChip, isSelected && styles.productChipActive]}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.productEmoji}>{prod.emoji}</Text>
                      <Text style={[styles.productChipName, isSelected && styles.productChipNameActive]}>
                        {isHindi ? prod.hindiName : prod.name}
                      </Text>
                      <Text style={[styles.productChipPrice, isSelected && styles.productChipPriceActive]}>
                        ₹{prod.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {isHindi ? 'कुल राशि:' : 'Total Amount:'}
                </Text>
                <Text style={styles.totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>
                {isHindi ? '⚡ यूपीआई क्यूआर कोड (भुगतान करें)' : '⚡ UPI QR Code (Scan to Pay)'}
              </Text>
              <Text style={styles.qrSubtitle}>GPay, PhonePe, Paytm, BHIM</Text>

              {/* Dynamic Simulated UPI QR */}
              <View style={styles.qrCodeFrame}>
                <View style={styles.qrInner}>
                  {/* Visual QR Pattern Simulation */}
                  <Svg width={180} height={180} viewBox="0 0 180 180">
                    <Rect x="10" y="10" width="40" height="40" fill="#1E293B" rx={4} />
                    <Rect x="16" y="16" width="28" height="28" fill="#FFFFFF" rx={2} />
                    <Rect x="22" y="22" width="16" height="16" fill="#1E293B" rx={1} />

                    <Rect x="130" y="10" width="40" height="40" fill="#1E293B" rx={4} />
                    <Rect x="136" y="16" width="28" height="28" fill="#FFFFFF" rx={2} />
                    <Rect x="142" y="22" width="16" height="16" fill="#1E293B" rx={1} />

                    <Rect x="10" y="130" width="40" height="40" fill="#1E293B" rx={4} />
                    <Rect x="16" y="136" width="28" height="28" fill="#FFFFFF" rx={2} />
                    <Rect x="22" y="142" width="16" height="16" fill="#1E293B" rx={1} />

                    {/* QR Matrix Blocks */}
                    <Rect x="60" y="20" width="15" height="15" fill="#1E293B" />
                    <Rect x="85" y="20" width="25" height="15" fill="#1E293B" />
                    <Rect x="60" y="45" width="20" height="20" fill="#7C3AED" />
                    <Rect x="90" y="45" width="25" height="20" fill="#1E293B" />

                    <Rect x="20" y="65" width="30" height="20" fill="#1E293B" />
                    <Rect x="60" y="75" width="60" height="30" fill="#1E293B" />
                    <Rect x="130" y="65" width="35" height="25" fill="#7C3AED" />

                    <Rect x="65" y="115" width="25" height="45" fill="#1E293B" />
                    <Rect x="100" y="115" width="25" height="20" fill="#1E293B" />
                    <Rect x="135" y="100" width="35" height="35" fill="#1E293B" />
                    <Rect x="100" y="145" width="65" height="25" fill="#7C3AED" />
                  </Svg>
                </View>
                <View style={styles.qrAmountBadge}>
                  <Text style={styles.qrAmountBadgeText}>₹{totalAmount}</Text>
                </View>
              </View>

              <Text style={styles.upiHandle}>UPI ID: ramesh.kumbhar@sbi</Text>

              {/* Instant Mark as Paid Button */}
              <TouchableOpacity
                onPress={handleCompleteSale}
                style={[styles.payDoneButton, showSuccess && styles.payDoneButtonSuccess]}
                activeOpacity={0.8}
              >
                <Text style={styles.payDoneButtonText}>
                  {showSuccess
                    ? (isHindi ? '✓ भुगतान प्राप्त और सुरक्षित!' : '✓ Payment Received & Saved!')
                    : (isHindi ? '✓ भुगतान मिला — बिल सहेजें' : '✓ Mark Paid & Save Bill')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* MELA-TO-DIGITAL BRIDGE (USP) */}
            <View style={styles.bridgeCard}>
              <View style={styles.bridgeHeaderRow}>
                <Text style={styles.bridgeEmoji}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bridgeTitle}>
                    {isHindi ? 'मेला से डिजिटल सेतु (विशेष सुविधा)' : 'MELA-TO-DIGITAL BRIDGE (USP)'}
                  </Text>
                  <Text style={styles.bridgeSubTitle}>
                    {isHindi ? 'मेले के आगंतुकों को ऑनलाइन स्थायी खरीदार बनाएं' : 'Turn physical fair visitors into lifelong online buyers'}
                  </Text>
                </View>
              </View>

              <View style={styles.bridgeContentBox}>
                <Text style={styles.bridgeDesc}>
                  📱 <Text style={{ fontWeight: '700' }}>
                    {isHindi
                      ? 'खरीदार क्यूआर स्कैन करके आपको फॉलो कर सकते हैं।'
                      : 'Buyers scan your QR code to follow your studio.'}
                  </Text>{' '}
                  {isHindi
                    ? 'मेला समाप्त होने के बाद भी वे आपसे ऑनलाइन प्रामाणिक उत्पाद खरीद सकेंगे!'
                    : 'They can continue ordering your authentic handmade crafts online year-round!'}
                </Text>
                <View style={styles.bridgeFollowersRow}>
                  <Text style={styles.bridgeFollowersBadge}>
                    {isHindi ? `📊 आज के नए फॉलोअर्स: +${followersCount}` : `📊 Today's Fair Followers: +${followersCount}`}
                  </Text>
                  <Text style={styles.bridgeRepeatBadge}>
                    {isHindi ? '🔁 3 दोहराए गए ऑर्डर' : '🔁 3 Repeat Orders received'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    minHeight: '80%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalBackIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: -2,
  },
  headerLeft: {
    flex: 1,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 5,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  melaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  scrollBody: {
    padding: 16,
    gap: 14,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.2,
  },
  sectionHelper: {
    fontSize: 11,
    color: '#94A3B8',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productChip: {
    flexBasis: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  productChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  productEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  productChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  productChipNameActive: {
    color: '#1D4ED8',
  },
  productChipPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  productChipPriceActive: {
    color: '#2563EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  qrCodeFrame: {
    position: 'relative',
    marginVertical: 14,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrAmountBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  qrAmountBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  upiHandle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 14,
  },
  payDoneButton: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payDoneButtonSuccess: {
    backgroundColor: '#047857',
  },
  payDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  bridgeCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  bridgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  bridgeEmoji: {
    fontSize: 22,
  },
  bridgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B21A8',
    letterSpacing: 0.3,
  },
  bridgeSubTitle: {
    fontSize: 11,
    color: '#9333EA',
  },
  bridgeContentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  bridgeDesc: {
    fontSize: 12.5,
    color: '#374151',
    lineHeight: 18,
  },
  bridgeFollowersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  bridgeFollowersBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bridgeRepeatBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
