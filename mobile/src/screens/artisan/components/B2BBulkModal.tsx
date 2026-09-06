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

interface B2BBulkModalProps {
  visible: boolean;
  onClose: () => void;
}

export const B2BBulkModal: React.FC<B2BBulkModalProps> = ({ visible, onClose }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAcceptCluster = () => {
    setAccepted(true);
  };

  const handleSpeak = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Tata Capital se paanch sau terracotta diya ka bulk order aaya hai. Budget ek lakh pachhees hazaar rupaye hai. Aapke cluster ke paanch karigar milkar yeh order poora karenge. Aapko pachhees hazaar rupaye milenge.'
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.hotPill}>
                <Text style={styles.hotText}>🔥 2 NEW RFQ MATCH</Text>
              </View>
              <Text style={styles.modalTitle}>🏢 B2B Bulk Opportunities</Text>
              <Text style={styles.subtitle}>Direct enterprise corporate gifting orders</Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioButton} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <Text style={styles.closeButtonText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Primary Opportunity Card */}
            <View style={styles.rfqCard}>
              <View style={styles.companyRow}>
                <View style={styles.companyLogoBadge}>
                  <Text style={styles.companyLogoText}>🏢</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.companyName}>TATA Capital</Text>
                  <Text style={styles.campaignName}>Diwali Corporate Gifting Campaign</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified Buyer ✓</Text>
                </View>
              </View>

              {/* Order Specs */}
              <View style={styles.specsGrid}>
                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>📦 कुल मात्रा (Quantity)</Text>
                  <Text style={styles.specValue}>500 Sets</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>💰 कुल बजट (Budget)</Text>
                  <Text style={[styles.specValue, { color: '#059669' }]}>₹1,25,000</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specLabel}>📅 डिलीवरी अंतिम तिथि</Text>
                  <Text style={styles.specValue}>15 Oct 2026</Text>
                </View>
              </View>

              {/* Warning/Opportunity Notice */}
              <View style={styles.capacityNotice}>
                <Text style={styles.capacityNoticeText}>
                  ⚠️ <Text style={{ fontWeight: '700' }}>अकेले कारीगर की क्षमता:</Text> 500 सेट बनाना 15 दिन में कठिन है।
                </Text>
              </View>

              {/* SMART CLUSTER SUGGESTION (USP) */}
              <View style={styles.clusterBox}>
                <View style={styles.clusterHeaderRow}>
                  <Text style={styles.clusterSparkle}>✨</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clusterTitle}>SMART CLUSTER FULFILLMENT (USP)</Text>
                    <Text style={styles.clusterSub}>AI Virtual Cooperative ने 5 पास के कारीगरों को जोड़ा है:</Text>
                  </View>
                </View>

                <View style={styles.artisanList}>
                  <View style={[styles.artisanRow, styles.artisanRowYou]}>
                    <Text style={styles.artisanName}>• रमेश कुंभार (आप - Ramesh / You)</Text>
                    <Text style={styles.artisanShare}>100 units → <Text style={styles.greenText}>₹25,000</Text></Text>
                  </View>
                  <View style={styles.artisanRow}>
                    <Text style={styles.artisanName}>• सुरेश पाटिल (Kolhapur Cluster)</Text>
                    <Text style={styles.artisanShare}>100 units → ₹25,000</Text>
                  </View>
                  <View style={styles.artisanRow}>
                    <Text style={styles.artisanName}>• गणेश लोहार (Hupari Cluster)</Text>
                    <Text style={styles.artisanShare}>100 units → ₹25,000</Text>
                  </View>
                  <View style={styles.artisanRow}>
                    <Text style={styles.artisanName}>• महेश कुंभार (Gokul Shirgaon)</Text>
                    <Text style={styles.artisanShare}>100 units → ₹25,000</Text>
                  </View>
                  <View style={styles.artisanRow}>
                    <Text style={styles.artisanName}>• राकेश सुतार (Uchgaon)</Text>
                    <Text style={styles.artisanShare}>100 units → ₹25,000</Text>
                  </View>
                </View>

                {/* Direct Benefit */}
                <View style={styles.earningsSummaryBox}>
                  <Text style={styles.earningsSummaryLabel}>आपकी हिस्सेदारी की पक्की कमाई:</Text>
                  <Text style={styles.earningsSummaryValue}>₹25,000 (Advance Protected in Escrow 🔒)</Text>
                </View>
              </View>

              {/* Accept Cluster CTA */}
              {accepted ? (
                <View style={styles.acceptedSuccessBox}>
                  <Text style={styles.acceptedSuccessTitle}>🎉 Cluster Order Accepted!</Text>
                  <Text style={styles.acceptedSuccessText}>
                    5 कारीगरों का वर्चुअल समूह तैयार है। ₹5,000 एडवांस आपके खाते में क्रेडिट कर दिया गया है।
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleAcceptCluster}
                  style={styles.acceptClusterButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptClusterButtonText}>✓ Cluster Ke Saath Accept Karein (स्वीकार करें)</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Artisan B2B Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreTitle}>📊 आपका B2B Cluster Performance</Text>
                <Text style={styles.scoreValue}>⭐ 4.8 / 5.0</Text>
              </View>
              <View style={styles.scoreStatsRow}>
                <View style={styles.scoreStatItem}>
                  <Text style={styles.scoreStatNumber}>12</Text>
                  <Text style={styles.scoreStatLabel}>Bulk Orders Done</Text>
                </View>
                <View style={styles.scoreStatDivider} />
                <View style={styles.scoreStatItem}>
                  <Text style={styles.scoreStatNumber}>100%</Text>
                  <Text style={styles.scoreStatLabel}>On-Time Dispatch</Text>
                </View>
                <View style={styles.scoreStatDivider} />
                <View style={styles.scoreStatItem}>
                  <Text style={styles.scoreStatNumber}>₹3.1L</Text>
                  <Text style={styles.scoreStatLabel}>B2B Earnings</Text>
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
  headerLeft: {
    flex: 1,
  },
  hotPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  hotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioButton: {
    backgroundColor: '#EFF6FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
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
  rfqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  companyLogoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  specsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  specBox: {
    flex: 1,
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  capacityNotice: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  capacityNoticeText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  clusterBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E9D5FF',
    marginBottom: 14,
  },
  clusterHeaderRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clusterSparkle: {
    fontSize: 20,
  },
  clusterTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#6B21A8',
    letterSpacing: 0.2,
  },
  clusterSub: {
    fontSize: 11,
    color: '#9333EA',
    marginTop: 1,
  },
  artisanList: {
    gap: 6,
    marginVertical: 8,
  },
  artisanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  artisanRowYou: {
    backgroundColor: '#FDF4FF',
    borderColor: '#D946EF',
    borderWidth: 1.5,
  },
  artisanName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  artisanShare: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  greenText: {
    color: '#059669',
    fontWeight: '800',
  },
  earningsSummaryBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9D5FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsSummaryLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B21A8',
  },
  earningsSummaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  acceptClusterButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptClusterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  acceptedSuccessBox: {
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  acceptedSuccessTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  acceptedSuccessText: {
    fontSize: 12,
    color: '#065F46',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  scoreStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
  },
  scoreStatItem: {
    alignItems: 'center',
  },
  scoreStatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreStatLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  scoreStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});
