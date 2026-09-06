import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import Svg, { Rect } from 'react-native-svg';

interface CraftPassportModalProps {
  visible: boolean;
  onClose: () => void;
  craftName?: string;
  artisanName?: string;
}

export const CraftPassportModal: React.FC<CraftPassportModalProps> = ({
  visible,
  onClose,
  craftName = 'Kolhapuri Terracotta Diya Set',
  artisanName = 'Master Ramesh Kumbhar',
}) => {
  const passportId = 'GI-MH-KLP-2026-8942';

  const handleSpeak = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Yeh Kolhapuri Terracotta Diya Set ka digital craft passport hai. Master Ramesh Kumbhar dwara Kolhapur mein Panchganga nadi ki shuddh mitti se banaya gaya hai. Yeh GI Registry dwara pramanit aur 100% authentic hai.`
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏛️ Check out the verified Digital Craft Passport for "${craftName}" crafted by ${artisanName} on Kalakar Setu: https://kalakarsetu.in/passport/${passportId}`,
      });
    } catch (e) {
      // Ignored
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>🏛️ CORE PILLAR #5</Text>
              </View>
              <Text style={styles.modalTitle}>Digital Craft Passport</Text>
              <Text style={styles.modalSubtitle}>Cryptographic GI Provenance & Authenticity</Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeBtnText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Passport Certificate Card */}
            <View style={styles.certificateCard}>
              {/* National Emblem & Header */}
              <View style={styles.certHeaderRow}>
                <View style={styles.emblemBox}>
                  <Text style={{ fontSize: 24 }}>🏛️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.certAuthority}>GOVERNMENT OF INDIA • GI REGISTRY</Text>
                  <Text style={styles.certTitle}>Authentic Heritage Craft Passport</Text>
                </View>
                <View style={styles.verifiedStamp}>
                  <Text style={styles.verifiedStampText}>VERIFIED ✓</Text>
                </View>
              </View>

              {/* Passport ID Barcode Strip */}
              <View style={styles.passportIdStrip}>
                <Text style={styles.passportIdLabel}>Passport No:</Text>
                <Text style={styles.passportIdVal}>{passportId}</Text>
              </View>

              {/* QR Code Container */}
              <View style={styles.qrContainer}>
                <View style={styles.qrFrame}>
                  <Svg width={140} height={140} viewBox="0 0 140 140">
                    <Rect x="10" y="10" width="30" height="30" fill="#1E293B" rx={3} />
                    <Rect x="15" y="15" width="20" height="20" fill="#FFFFFF" rx={2} />
                    <Rect x="20" y="20" width="10" height="10" fill="#1E293B" />

                    <Rect x="100" y="10" width="30" height="30" fill="#1E293B" rx={3} />
                    <Rect x="105" y="15" width="20" height="20" fill="#FFFFFF" rx={2} />
                    <Rect x="110" y="20" width="10" height="10" fill="#1E293B" />

                    <Rect x="10" y="100" width="30" height="30" fill="#1E293B" rx={3} />
                    <Rect x="15" y="105" width="20" height="20" fill="#FFFFFF" rx={2} />
                    <Rect x="20" y="110" width="10" height="10" fill="#1E293B" />

                    <Rect x="50" y="15" width="40" height="15" fill="#7C3AED" />
                    <Rect x="50" y="45" width="40" height="40" fill="#1E293B" />
                    <Rect x="100" y="55" width="25" height="35" fill="#7C3AED" />
                    <Rect x="20" y="55" width="20" height="35" fill="#1E293B" />
                    <Rect x="50" y="95" width="40" height="30" fill="#1E293B" />
                    <Rect x="100" y="100" width="30" height="25" fill="#7C3AED" />
                  </Svg>
                </View>
                <Text style={styles.qrScanPrompt}>Scan to verify origin & maker history</Text>
              </View>

              {/* Product & Master Artisan Meta */}
              <View style={styles.metaSection}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Craft Item:</Text>
                  <Text style={styles.metaVal}>{craftName}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Master Artisan:</Text>
                  <Text style={styles.metaVal}>{artisanName} (4th Gen)</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>GI Cluster Origin:</Text>
                  <Text style={styles.metaVal}>Kolhapur Terracotta Cluster, Maharashtra</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Raw Materials:</Text>
                  <Text style={styles.metaVal}>100% Panchganga Riverbed Clay, Natural Ochre</Text>
                </View>
              </View>

              {/* PROVENANCE TIMELINE */}
              <View style={styles.provenanceBox}>
                <Text style={styles.provenanceTitle}>🧬 Provenance & Crafting Lifecycle:</Text>

                <View style={styles.timelineList}>
                  {/* Stage 1 */}
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStageTitle}>1. Riverbed Clay Extraction</Text>
                      <Text style={styles.timelineStageSub}>Panchganga riverbanks • Natural sedimentation testing</Text>
                    </View>
                  </View>

                  {/* Stage 2 */}
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStageTitle}>2. Manual Potter's Wheel Shaping</Text>
                      <Text style={styles.timelineStageSub}>Hand-turned by Master Ramesh Kumbhar</Text>
                    </View>
                  </View>

                  {/* Stage 3 */}
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStageTitle}>3. Traditional Wood Kiln Firing</Text>
                      <Text style={styles.timelineStageSub}>850°C wood firing for natural thermal strength</Text>
                    </View>
                  </View>

                  {/* Stage 4 */}
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: '#7C3AED' }]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineStageTitle}>4. GI Registry Stamp & QR Affixed</Text>
                      <Text style={styles.timelineStageSub}>Tamper-proof digital seal recorded on ledger</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Share Certificate Button */}
              <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.85}>
                <Text style={styles.shareBtnText}>📤 Share Public QR Passport</Text>
              </TouchableOpacity>
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
  badgePill: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B21A8',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  scrollBody: {
    padding: 16,
  },
  certificateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  certHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  emblemBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certAuthority: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  verifiedStamp: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedStampText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#047857',
  },
  passportIdStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passportIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  passportIdVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  qrFrame: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  qrScanPrompt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  metaSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    gap: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B',
    maxWidth: '65%',
    textAlign: 'right',
  },
  provenanceBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  provenanceTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },
  timelineList: {
    gap: 10,
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginTop: 3,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStageTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  timelineStageSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  shareBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
