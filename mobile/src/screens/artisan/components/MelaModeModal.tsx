import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
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
  const [activeTab, setActiveTab] = useState<'twin' | 'pos'>('twin');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isScanningVideo, setIsScanningVideo] = useState(false);
  const [twinCreated, setTwinCreated] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // POS billing states
  const [selectedProducts, setSelectedProducts] = useState<{ [id: string]: number }>({
    '1': 1,
    '2': 1,
    '3': 1,
  });
  const [followersCount, setFollowersCount] = useState(148);
  const [todaySales, setTodaySales] = useState(8600);
  const [salesCount, setSalesCount] = useState(16);
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

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'सूरजकुंड मेले में 10 दिन बिक्री होती है, फिर 355 दिन सन्नाटा। कारीगर स्टॉल का 30-सेकंड वीडियो लेता है और AI उससे डिजिटल स्टॉल बना देता है। विजिटर क्यूआर स्कैन करता है तो दुकान सीधे व्हाट्सएप पर सेव हो जाती है। मेला खत्म, बिजनेस शुरू। 10 दिन के रिश्ते को लाइफटाइम कस्टमर बना दिया।'
        : 'In fairs like Surajkund, artisans sell for 10 days, followed by 355 days of silence. With Mela-to-365 Digital Twin, the artisan takes a 30-second stall video and AI turns it into an interactive digital twin. Visitors scan the QR to save the shop on WhatsApp. When new items are crafted later, past buyers are automatically notified.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSimulateVideoScan = () => {
    setIsScanningVideo(true);
    setTimeout(() => {
      setIsScanningVideo(false);
      setTwinCreated(true);
    }, 1500);
  };

  const handleSendBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 3000);
  };

  const handleShareWhatsAppShop = async () => {
    try {
      await Share.share({
        message: `🎪 Welcome to Ramesh Kumbhar Terracotta Surajkund Mela Digital Stall! Explore full handcrafted collection online: https://kalakarsetu.in/mela/surajkund/stall-42`,
      });
    } catch {}
  };

  const handleCompleteSale = () => {
    setShowSuccess(true);
    setTodaySales((prev) => prev + totalAmount);
    setSalesCount((prev) => prev + 1);
    setFollowersCount((prev) => prev + 1);

    realisticVoiceService.speak(
      isHindi
        ? `${totalAmount} रुपये का भुगतान प्राप्त हुआ। बिल सफलतापूर्वक सहेजा गया।`
        : `Payment of ${totalAmount} rupees received. Saved successfully.`,
      { lang: isHindi ? 'hi-IN' : 'en-IN' }
    );

    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProducts({});
    }, 2200);
  };

  const handleClose = () => {
    realisticVoiceService.stop();
    setIsSpeaking(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.modalBackButton} activeOpacity={0.7}>
              <Text style={styles.modalBackIcon}>‹</Text>
            </TouchableOpacity>
            <View style={styles.headerLeft}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>{isHindi ? '🔴 365-दिन डिजिटल मेला' : '🔴 365-DAY DIGITAL MELA'}</Text>
              </View>
              <Text style={styles.melaTitle}>{isHindi ? '🎪 मेला-टू-डिजिटल ट्विन' : '🎪 Mela-to-Digital Twin'}</Text>
              <Text style={styles.locationSubText}>
                {isHindi ? '📍 सूरजकुंड मेला • स्टॉल #42 • 365 दिन चालू' : '📍 Surajkund Mela • Stall #42 • Active 365 Days'}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>{isSpeaking ? '⏹️' : '🔊'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>{isHindi ? '✕ बंद करें' : '✕ Exit'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Punchline Hero Banner */}
            <View style={styles.punchlineBanner}>
              <Text style={styles.punchlineQuote}>
                💡 {isHindi
                  ? '“मेला खत्म, बिजनेस शुरू। 10 दिन के रिश्ते को लाइफटाइम कस्टमर बना दिया।”'
                  : '“Fair ends, continuous business begins. 10 days of footfall converted into lifetime customers.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi
                  ? 'समस्या: 10 दिन बिक्री, फिर 355 दिन सन्नाटा। समाधान: 365-दिन व्हाट्सएप डिजिटल ट्विन।'
                  : 'Problem: 10-day fair sales trap. Solution: 365-day digital twin connected via WhatsApp.'}
              </Text>
            </View>

            {/* Top Navigation Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'twin' && styles.tabBtnActive]}
                onPress={() => setActiveTab('twin')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'twin' && styles.tabBtnTextActive]}>
                  {isHindi ? '🌐 365-दिन डिजिटल ट्विन' : '🌐 365-Day Digital Twin'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'pos' && styles.tabBtnActive]}
                onPress={() => setActiveTab('pos')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'pos' && styles.tabBtnTextActive]}>
                  {isHindi ? '⚡ फास्ट पीओएस चेकआउट' : '⚡ Fast POS Checkout'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'twin' && (
              <View>
                {/* Digital Twin 3D Storefront Card */}
                <View style={styles.twinCard}>
                  <View style={styles.twinHeaderRow}>
                    <Text style={{ fontSize: 24 }}>🎥</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.twinTitle}>
                        {isHindi ? '30-सेकंड स्टॉल वीडियो $\\rightarrow$ AI डिजिटल ट्विन' : '30-Sec Stall Video $\\rightarrow$ AI Digital Twin'}
                      </Text>
                      <Text style={styles.twinSub}>
                        {isHindi ? 'स्टॉल का 360° वीडियो स्कैन करें, AI डिजिटल दुकान बना देता है' : 'Auto-synthesizes your physical stall into a 3D digital storefront'}
                      </Text>
                    </View>
                    <View style={styles.twinBadge}>
                      <Text style={styles.twinBadgeText}>{isHindi ? 'सक्रिय ✓' : 'LIVE 365'}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSimulateVideoScan}
                    style={styles.scanVideoBtn}
                    activeOpacity={0.8}
                    disabled={isScanningVideo}
                  >
                    <Text style={styles.scanVideoBtnText}>
                      {isScanningVideo
                        ? isHindi ? '⏳ 3D स्टॉल मॉडल तैयार हो रहा है...' : '⏳ Generating 3D Digital Stall...' : isHindi ? '📹 नया 30-सेकंड स्टॉल वीडियो स्कैन करें' : '📹 Re-scan 30-Sec Stall Video'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Visitor WhatsApp QR Standee Card */}
                <View style={styles.qrCard}>
                  <Text style={styles.qrTitle}>
                    {isHindi ? '📲 आगंतुक क्यूआर कोड (व्हाट्सएप पर दुकान सेव)' : '📲 Visitor QR (Save Shop on WhatsApp)'}
                  </Text>
                  <Text style={styles.qrSubtitle}>
                    {isHindi ? 'मेले में आने वाले ग्राहक स्कैन करें $\\rightarrow$ आपकी दुकान उनके व्हाट्सएप पर लाइफटाइम सेव होगी' : 'Visitors scan this QR $\\rightarrow$ Your entire catalog auto-saves to their WhatsApp'}
                  </Text>

                  <View style={styles.qrCodeFrame}>
                    <View style={styles.qrInner}>
                      <Svg width={160} height={160} viewBox="0 0 180 180">
                        <Rect x="10" y="10" width="40" height="40" fill="#1E293B" rx={4} />
                        <Rect x="16" y="16" width="28" height="28" fill="#FFFFFF" rx={2} />
                        <Rect x="22" y="22" width="16" height="16" fill="#1E293B" rx={1} />
                        <Rect x="130" y="10" width="40" height="40" fill="#1E293B" rx={4} />
                        <Rect x="136" y="16" width="28" height="28" fill="#FFFFFF" rx={2} />
                        <Rect x="142" y="22" width="16" height="16" fill="#1E293B" rx={1} />
                        <Rect x="10" y="130" width="40" height="40" fill="#1E293B" rx={4} />
                        <Rect x="16" y="136" width="28" height="28" fill="#FFFFFF" rx={2} />
                        <Rect x="22" y="142" width="16" height="16" fill="#1E293B" rx={1} />
                        <Rect x="60" y="20" width="15" height="15" fill="#25D366" />
                        <Rect x="85" y="20" width="25" height="15" fill="#1E293B" />
                        <Rect x="60" y="45" width="20" height="20" fill="#25D366" />
                        <Rect x="90" y="45" width="25" height="20" fill="#1E293B" />
                        <Rect x="20" y="65" width="30" height="20" fill="#1E293B" />
                        <Rect x="60" y="75" width="60" height="30" fill="#1E293B" />
                        <Rect x="130" y="65" width="35" height="25" fill="#25D366" />
                        <Rect x="65" y="115" width="25" height="45" fill="#1E293B" />
                        <Rect x="100" y="115" width="25" height="20" fill="#1E293B" />
                        <Rect x="100" y="145" width="65" height="25" fill="#25D366" />
                      </Svg>
                    </View>
                  </View>

                  <TouchableOpacity onPress={handleShareWhatsAppShop} style={styles.shareShopBtn} activeOpacity={0.85}>
                    <Text style={styles.shareShopBtnText}>
                      {isHindi ? '🟢 व्हाट्सएप लिंक साझा करें' : '🟢 Share WhatsApp Shop Link'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 365-Day Post-Mela Re-engagement Tool */}
                <View style={styles.broadcastCard}>
                  <Text style={styles.broadcastTitle}>
                    {isHindi ? '📢 मेला बाद 365-दिन री-एंगेजमेंट' : '📢 Post-Mela 365 Broadcast Engine'}
                  </Text>
                  <Text style={styles.broadcastSub}>
                    {isHindi ? 'जब भी नया माल बने, मेले के सभी 148 पुराने खरीदारों को 1-क्लिक में सूचित करें:' : 'Whenever you make a fresh batch, ping all 148 fair visitors directly on WhatsApp:'}
                  </Text>

                  <View style={styles.msgTemplateBox}>
                    <Text style={styles.msgTemplateText}>
                      {isHindi
                        ? '“नमस्ते! आपने सूरजकुंड मेले में हमारी मिट्टी की कला पसंद की थी। आज हमने दीपावली के लिए 50 नए हस्तनिर्मित दीये तैयार किए हैं। देखने के लिए टैप करें: kalakarsetu.in/ramesh”'
                        : '“Hello! You loved our terracotta pottery at Surajkund Mela. We just crafted 50 fresh festive pieces. Tap to view & order directly: kalakarsetu.in/ramesh”'}
                    </Text>
                  </View>

                  {broadcastSent && (
                    <View style={styles.broadcastSentBadge}>
                      <Text style={styles.broadcastSentText}>
                        {isHindi ? '✓ 148 पुराने मेला खरीदारों को व्हाट्सएप सूचना भेज दी गई!' : '✓ Broadcast delivered to 148 past fair buyers!'}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleSendBroadcast}
                    style={styles.broadcastBtn}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.broadcastBtnText}>
                      {isHindi ? '🚀 पुराने मेला खरीदारों को सूचित करें (148 ग्राहक)' : '🚀 Notify Past Mela Buyers (148 Visitors)'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeTab === 'pos' && (
              <View>
                {/* Live Stats Bar */}
                <View style={styles.statsStrip}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{isHindi ? '💰 आज की बिक्री' : "Today's Sales"}</Text>
                    <Text style={styles.statValue}>₹{todaySales.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{isHindi ? '🛒 कुल ऑर्डर' : 'Total Orders'}</Text>
                    <Text style={styles.statValue}>{salesCount} {isHindi ? 'ऑर्डर' : 'orders'}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{isHindi ? '📱 नए फॉलोअर्स' : 'New Followers'}</Text>
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

                {/* Complete Bill CTA */}
                <TouchableOpacity onPress={handleCompleteSale} style={styles.completeSaleBtn} activeOpacity={0.85}>
                  <Text style={styles.completeSaleBtnText}>
                    {showSuccess
                      ? isHindi ? '✓ भुगतान दर्ज हुआ!' : '✓ Payment Recorded!' : isHindi ? `⚡ ₹${totalAmount} प्राप्त करें और रसीद दें` : `⚡ Collect ₹${totalAmount} & Save Bill`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B91C1C',
  },
  melaTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  audioIcon: {
    fontSize: 16,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  scrollBody: {
    padding: 18,
    paddingBottom: 40,
  },
  punchlineBanner: {
    backgroundColor: '#881337',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FDA4AF',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#FFE4E6',
    marginTop: 6,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFE4E6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9F1239',
  },
  tabBtnTextActive: {
    color: '#BE123C',
    fontWeight: '800',
  },
  twinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  twinHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  twinTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  twinSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  twinBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  twinBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  scanVideoBtn: {
    marginTop: 14,
    backgroundColor: '#FFF1F2',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  scanVideoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  qrCodeFrame: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareShopBtn: {
    marginTop: 14,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  shareShopBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  broadcastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  broadcastTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  broadcastSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 10,
  },
  msgTemplateBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  msgTemplateText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  broadcastSentBadge: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  broadcastSentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    textAlign: 'center',
  },
  broadcastBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  broadcastBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
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
    color: '#0F172A',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '48%',
  },
  productChipActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FDA4AF',
  },
  productEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  productChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  productChipNameActive: {
    color: '#BE123C',
  },
  productChipPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  productChipPriceActive: {
    color: '#E11D48',
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
    color: '#64748B',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E11D48',
  },
  completeSaleBtn: {
    backgroundColor: '#E11D48',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeSaleBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});