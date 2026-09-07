import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { useTranslation } from '@/hooks/useTranslation';
import { realisticVoiceService } from '@/services/realisticVoiceService';

interface B2BBulkModalProps {
  visible: boolean;
  onClose: () => void;
}

export const B2BBulkModal: React.FC<B2BBulkModalProps> = ({ visible, onClose }) => {
  const { isHindi } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'rfq' | 'cluster'>('rfq');

  const handleAcceptCluster = () => {
    setAccepted(true);
    setActiveTab('cluster');
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'टाटा को 500 दीये चाहिए। एक कारीगर सिर्फ 100 बना सकता है — आमतौर पर ऑर्डर कैंसिल हो जाता। हमारा एआई 15 किलोमीटर के अंदर समान हुनर वाले 5 से 10 कारीगरों को जोड़ता है। ऑर्डर बांटता है, क्वालिटी चेक करता है और पेमेंट स्प्लिट करता है। एक अकेला कारीगर नहीं — पूरा गांव मिलकर बी2बी ऑर्डर पूरा करता है। बिचौलिया हटा, क्लस्टर बना।'
        : 'Tata Capital needs 500 terracotta diya sets. An individual artisan can only craft 100 units — typically resulting in order cancellation. Our AI pools 5 to 10 verified artisans within a 15 km radius into a Virtual Factory. It auto-splits production, manages QC, and distributes escrow payments. Eliminating middlemen through collaborative clusters.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
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
              <View style={styles.hotPill}>
                <Text style={styles.hotText}>{isHindi ? '🤝 मुख्य स्तंभ #8' : '🤝 CORE PILLAR #8'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'कारीगर क्लस्टर व वर्चुअल फैक्ट्री' : 'Artisan Clusters & Virtual Factory'}</Text>
              <Text style={styles.subtitle}>
                {isHindi ? '15 किमी दायरे में क्लस्टर निर्माण • 500+ थोक ऑर्डर पूर्ति' : '15 km skill pooling • 500+ bulk order fulfillment'}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioButton} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>{isSpeaking ? '⏹️' : '🔊'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>{isHindi ? '✕ बंद करें' : '✕ Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Punchline Hero Banner */}
            <View style={styles.punchlineBanner}>
              <Text style={styles.punchlineQuote}>
                💡 {isHindi
                  ? '“एक अकेला कारीगर नहीं — पूरा गांव मिलकर B2B ऑर्डर पूरा करता है। बिचौलिया हटा, क्लस्टर बना।”'
                  : '“Not an isolated craftsman — an entire village unites as an enterprise Virtual Factory.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi
                  ? 'समस्या: व्यक्तिगत क्षमता छोटी है। समाधान: वर्चुअल फैक्ट्री, बिना फैक्ट्री बनाए।' : 'Problem: Individual capacity is limited. Solution: Virtual factory without building brick-and-mortar.'}
              </Text>
            </View>

            {/* Top Navigation Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'rfq' && styles.tabBtnActive]}
                onPress={() => setActiveTab('rfq')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'rfq' && styles.tabBtnTextActive]}>
                  {isHindi ? '🏢 TATA बल्क RFQ' : '🏢 TATA Enterprise RFQ'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'cluster' && styles.tabBtnActive]}
                onPress={() => setActiveTab('cluster')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'cluster' && styles.tabBtnTextActive]}>
                  {isHindi ? '🏭 15 किमी वर्चुअल फैक्ट्री' : '🏭 15km Virtual Factory'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'rfq' && (
              <View>
                {/* Primary Opportunity Card */}
                <View style={styles.rfqCard}>
                  <View style={styles.companyRow}>
                    <View style={styles.companyLogoBadge}>
                      <Text style={styles.companyLogoText}>🏢</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.companyName}>TATA Capital</Text>
                      <Text style={styles.campaignName}>
                        {isHindi ? 'दीपावली कॉर्पोरेट उपहार अभियान' : 'Diwali Corporate Gifting Campaign'}
                      </Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>
                        {isHindi ? 'सत्यापित खरीदार ✓' : 'Verified Buyer ✓'}
                      </Text>
                    </View>
                  </View>

                  {/* Order Specs */}
                  <View style={styles.specsGrid}>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? '📦 कुल मात्रा' : '📦 Total Quantity'}</Text>
                      <Text style={styles.specValue}>500 Sets</Text>
                    </View>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? '💰 कुल बजट' : '💰 Total Budget'}</Text>
                      <Text style={[styles.specValue, { color: '#059669' }]}>₹1,25,000</Text>
                    </View>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? '📅 डिलीवरी अंतिम तिथि' : '📅 Delivery Deadline'}</Text>
                      <Text style={styles.specValue}>15 Oct 2026</Text>
                    </View>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? '⭐ जीआई प्रमाणीकरण' : '⭐ GI Required'}</Text>
                      <Text style={styles.specValue}>GI Mandatory</Text>
                    </View>
                  </View>
                </View>

                {/* Accept Cluster CTA */}
                <TouchableOpacity
                  onPress={handleAcceptCluster}
                  style={[styles.acceptButton, accepted && styles.acceptButtonDone]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptButtonText}>
                    {accepted
                      ? isHindi ? '✓ वर्चुअल फैक्ट्री सक्रिय! (क्लस्टर मैप देखें)' : '✓ Virtual Factory Active! View Map' : isHindi ? '🤝 15 किमी क्लस्टर जोड़ें व वर्चुअल फैक्ट्री बनाएं' : '🤝 Pool 15km Cluster & Form Virtual Factory'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'cluster' && (
              <View>
                {/* Virtual Factory Map Summary */}
                <View style={styles.factorySummaryCard}>
                  <Text style={styles.factorySummaryTitle}>
                    {isHindi ? '🏭 कोल्हापुर 15 किमी टेराकोटा क्लस्टर (500 दीये)' : '🏭 Kolhapur 15km Terracotta Cluster (500 Sets)'}
                  </Text>
                  <Text style={styles.factorySummarySub}>
                    {isHindi
                      ? 'AI ने आपके नजदीकी 5 कारीगरों को जोड़ा। प्रत्येक को 100 दीये बांटे गए:'
                      : 'AI pooled 5 nearby craftspeople. Exactly 100 sets assigned to each:'}
                  </Text>

                  {[
                    { name: isHindi ? 'रमेश कुंभार (आप - क्लस्टर हेड)' : 'Ramesh Kumbhar (You - Cluster Lead)', dist: '0 km', qty: '100 Sets', pay: '₹25,000', status: 'स्वीकृत' },
                    { name: isHindi ? 'सुरेश कुंभार' : 'Suresh Kumbhar', dist: '3.2 km', qty: '100 Sets', pay: '₹25,000', status: 'स्वीकृत' },
                    { name: isHindi ? 'अनीता प्रजापति' : 'Anita Prajapati', dist: '5.8 km', qty: '100 Sets', pay: '₹25,000', status: 'स्वीकृत' },
                    { name: isHindi ? 'गणेश पोद्दार' : 'Ganesh Poddar', dist: '8.4 km', qty: '100 Sets', pay: '₹25,000', status: 'स्वीकृत' },
                    { name: isHindi ? 'मीना बाई' : 'Meena Bai', dist: '12.1 km', qty: '100 Sets', pay: '₹25,000', status: 'स्वीकृत' },
                  ].map((artisan, idx) => (
                    <View key={idx} style={styles.artisanRow}>
                      <View style={styles.artisanIcon}><Text style={{ fontSize: 16 }}>🏺</Text></View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.artisanName}>{artisan.name}</Text>
                        <Text style={styles.artisanDist}>{artisan.dist} • {artisan.qty}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.artisanPay}>{artisan.pay}</Text>
                        <Text style={styles.artisanStatus}>{artisan.status}</Text>
                      </View>
                    </View>
                  ))}

                  {/* Total Split Ledger */}
                  <View style={styles.splitFooter}>
                    <Text style={styles.splitTotalLabel}>{isHindi ? 'कुल क्लस्टर भुगतान (एस्क्रो सुरक्षित):' : 'Total Escrow Allocation:'}</Text>
                    <Text style={styles.splitTotalVal}>₹1,25,000</Text>
                  </View>
                </View>
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
  hotPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  hotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
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
    backgroundColor: '#451A03',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FDE68A',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#FEF3C7',
    marginTop: 6,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
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
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  tabBtnTextActive: {
    color: '#92400E',
    fontWeight: '800',
  },
  rfqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  companyLogoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyLogoText: {
    fontSize: 22,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  campaignName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specBox: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  acceptButton: {
    backgroundColor: '#D97706',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptButtonDone: {
    backgroundColor: '#059669',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  factorySummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  factorySummaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  factorySummarySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  artisanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  artisanIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  artisanDist: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  artisanPay: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  artisanStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#059669',
  },
  splitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  splitTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  splitTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D97706',
  },
});