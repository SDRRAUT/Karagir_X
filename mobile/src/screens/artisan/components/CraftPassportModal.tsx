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
  const { isHindi } = useTranslation();
  const [activeTab, setActiveTab] = useState<'work' | 'schemes' | 'gi'>('work');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [appliedScheme, setAppliedScheme] = useState<string | null>(null);

  const passportId = 'GI-MH-KLP-2026-8942';

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'मान लीजिए एक कारीगर बहुत अच्छा काम करता है, लेकिन उसके पास रेगुलर सैलरी स्लिप, बैंक हिस्ट्री या सिबिल स्कोर नहीं है। कलाकार सेतु पर उसका काम, बिक्री और ऑर्डर का डिजिटल रिकॉर्ड बनता रहता है। ऐप उसकी प्रोफाइल के आधार पर पीएम विश्वकर्मा और मुद्रा लोन जैसी सरकारी योजनाएं पहचानकर सीधे लिंक करता है। कारीगर का डिजिटल वर्क हिस्ट्री प्लस स्कीम डिस्कवरी एक ही जगह।'
        : 'When an artisan lacks salary slips, tax returns, or traditional CIBIL scores, Kalakar Setu creates an immutable digital work and sales history. Our system auto-links their profile to verified government initiatives like PM Vishwakarma and Mudra collateral-free credit.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleApplyScheme = (schemeName: string) => {
    setAppliedScheme(schemeName);
    setTimeout(() => {
      setAppliedScheme(null);
    }, 3000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏛️ Verified Digital Kaarigar Passport & Scheme Portfolio for "${artisanName}": https://kalakarsetu.in/passport/${passportId}`,
      });
    } catch {}
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
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>{isHindi ? '🏛️ मुख्य स्तंभ #7' : '🏛️ CORE PILLAR #7'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'कारीगर पासपोर्ट व योजना लिंकर' : 'Kaarigar Passport & Scheme Linker'}</Text>
              <Text style={styles.modalSubtitle}>
                {isHindi ? 'डिजिटल कार्य इतिहास + सरकारी योजना डिस्कवरी' : 'Digital work history + scheme auto-linker'}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>{isSpeaking ? '⏹️' : '🔊'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeBtnText}>{isHindi ? '✕ बंद करें' : '✕ Close'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Punchline Hero Banner */}
            <View style={styles.punchlineBanner}>
              <Text style={styles.punchlineQuote}>
                💡 {isHindi
                  ? '“सैलरी स्लिप और सिबिल नहीं? कोई बात नहीं — कारीगर का डिजिटल काम और बिक्री ही उसका सबसे मजबूत पासपोर्ट है।”'
                  : '“No salary slip or CIBIL? No barrier — the artisan’s verified digital work ledger is their ultimate credit passport.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi
                  ? 'समस्या: सरकारी सहायता उपलब्ध है, पर कारीगर तक पहुंचना मुश्किल। समाधान: डिजिटल कार्य इतिहास + ऑटो-लिंकर।' : 'Problem: Schemes exist, but eligibility verification fails. Solution: Verified ledger + auto scheme discovery.'}
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'work' && styles.tabBtnActive]}
                onPress={() => setActiveTab('work')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'work' && styles.tabBtnTextActive]}>
                  {isHindi ? '💳 क्रेडिट पासपोर्ट' : '💳 Credit Ledger'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'schemes' && styles.tabBtnActive]}
                onPress={() => setActiveTab('schemes')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'schemes' && styles.tabBtnTextActive]}>
                  {isHindi ? '🏛️ सरकारी योजनाएं' : '🏛️ Govt Schemes'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'gi' && styles.tabBtnActive]}
                onPress={() => setActiveTab('gi')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'gi' && styles.tabBtnTextActive]}>
                  {isHindi ? '📜 जीआई सर्टिफिकेट' : '📜 GI Certificate'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'work' && (
              <View>
                {/* Alternative Credit Score Banner */}
                <View style={styles.scoreHeroCard}>
                  <View style={styles.scoreTopRow}>
                    <Text style={styles.scoreHeroLabel}>
                      {isHindi ? 'कलाकार वैकल्पिक क्रेडिट स्कोर (बिना सिबिल)' : 'Kalakar Alternative Credit Score'}
                    </Text>
                    <View style={styles.gradePill}><Text style={styles.gradePillText}>GRADE A (PRE-APPROVED)</Text></View>
                  </View>
                  <Text style={styles.scoreVal}>785 <Text style={{ fontSize: 16, color: '#94A3B8' }}>/ 900</Text></Text>
                  <Text style={styles.scoreSub}>
                    {isHindi ? 'मुद्रा योजना व बैंक क्रेडिट के लिए 100% मान्य वित्तीय रिकॉर्ड' : '100% Valid financial record accepted for Mudra collateral-free credit'}
                  </Text>
                </View>

                {/* Production & Sales Ledger */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>{isHindi ? 'सत्यापित वार्षिक बिक्री' : 'Verified Annual Sales'}</Text>
                    <Text style={styles.statCardVal}>₹1,42,800</Text>
                    <Text style={styles.statCardSub}>{isHindi ? '100% एस्क्रो प्रमाणित' : '100% Escrow verified'}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statCardLabel}>{isHindi ? 'समय पर डिलीवरी' : 'On-Time Fulfillment'}</Text>
                    <Text style={[styles.statCardVal, { color: '#059669' }]}>98.4%</Text>
                    <Text style={styles.statCardSub}>{isHindi ? '128 पूर्ण ऑर्डर' : '128 Orders complete'}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'schemes' && (
              <View>
                <View style={styles.schemesContainer}>
                  <Text style={styles.schemesHeaderTitle}>
                    {isHindi ? '🏛️ ऑटो-आइडेंटिफाइड सरकारी योजनाएं:' : '🏛️ Auto-Identified Government Schemes:'}
                  </Text>

                  {appliedScheme && (
                    <View style={styles.appliedBanner}>
                      <Text style={styles.appliedBannerText}>
                        ✓ {appliedScheme} {isHindi ? 'के लिए आपका आवेदन दर्ज कर दिया गया है!' : 'application submitted successfully!'}
                      </Text>
                    </View>
                  )}

                  {/* Scheme 1: PM Vishwakarma */}
                  <View style={styles.schemeCard}>
                    <View style={styles.schemeTopRow}>
                      <View style={styles.schemeIconBox}><Text style={{ fontSize: 20 }}>🛠️</Text></View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.schemeName}>{isHindi ? 'पीएम विश्वकर्मा योजना' : 'PM Vishwakarma Yojana'}</Text>
                        <Text style={styles.schemeBenefit}>{isHindi ? '₹15,000 टूलकिट ग्रांट + 5% ब्याज पर लोन' : '₹15,000 Toolkit Grant + Collateral-free Credit'}</Text>
                      </View>
                      <View style={styles.eligibleBadge}><Text style={styles.eligibleBadgeText}>पात्र ✓</Text></View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleApplyScheme('PM Vishwakarma')}
                      style={styles.schemeApplyBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.schemeApplyBtnText}>{isHindi ? '1-क्लिक में आवेदन करें' : '1-Tap Auto Apply'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Scheme 2: PMEGP / Mudra */}
                  <View style={styles.schemeCard}>
                    <View style={styles.schemeTopRow}>
                      <View style={styles.schemeIconBox}><Text style={{ fontSize: 20 }}>💰</Text></View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.schemeName}>{isHindi ? 'मुद्रा शिशु / किशोर ऋण' : 'Mudra Shishu / Kishor Credit'}</Text>
                        <Text style={styles.schemeBenefit}>{isHindi ? '₹50,000 से ₹5 लाख तक बिना गारंटी ऋण' : '₹50,000 to ₹5 Lakhs collateral-free credit'}</Text>
                      </View>
                      <View style={styles.eligibleBadge}><Text style={styles.eligibleBadgeText}>पात्र ✓</Text></View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleApplyScheme('Mudra Loan')}
                      style={styles.schemeApplyBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.schemeApplyBtnText}>{isHindi ? '1-क्लिक में आवेदन करें' : '1-Tap Auto Apply'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Scheme 3: SFURTI */}
                  <View style={[styles.schemeCard, { borderBottomWidth: 0 }]}>
                    <View style={styles.schemeTopRow}>
                      <View style={styles.schemeIconBox}><Text style={{ fontSize: 20 }}>🏭</Text></View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.schemeName}>{isHindi ? 'स्फूर्ति (SFURTI) क्लस्टर विकास' : 'SFURTI Cluster Development'}</Text>
                        <Text style={styles.schemeBenefit}>{isHindi ? '₹2.5 करोड़ सामूहिक सुविधा केंद्र व आधुनिक भट्टी' : '₹2.5 Cr Common Facility Center & Modern Kiln'}</Text>
                      </View>
                      <View style={[styles.eligibleBadge, { backgroundColor: '#EDE9FE', borderColor: '#C4B5FD' }]}>
                        <Text style={[styles.eligibleBadgeText, { color: '#6D28D9' }]}>क्लस्टर मैच्ड</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleApplyScheme('SFURTI Cluster')}
                      style={styles.schemeApplyBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.schemeApplyBtnText}>{isHindi ? 'क्लस्टर समूह में शामिल हों' : 'Join Cluster Pool'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'gi' && (
              <View>
                <View style={styles.certificateCard}>
                  <View style={styles.certHeaderRow}>
                    <View style={styles.emblemBox}><Text style={{ fontSize: 24 }}>🏛️</Text></View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.certAuthority}>{isHindi ? 'भारत सरकार • जीआई रजिस्ट्री' : 'GOVERNMENT OF INDIA • GI REGISTRY'}</Text>
                      <Text style={styles.certTitle}>{isHindi ? 'प्रामाणिक विरासत शिल्प पासपोर्ट' : 'Authentic Heritage Craft Passport'}</Text>
                    </View>
                    <View style={styles.verifiedStamp}><Text style={styles.verifiedStampText}>सत्यापित ✓</Text></View>
                  </View>
                  <View style={styles.certBodyRow}>
                    <Text style={styles.certFieldLabel}>{isHindi ? 'शिल्प का नाम:' : 'Craft:'}</Text>
                    <Text style={styles.certFieldVal}>{craftName}</Text>
                  </View>
                  <View style={styles.certBodyRow}>
                    <Text style={styles.certFieldLabel}>{isHindi ? 'कारीगर:' : 'Artisan:'}</Text>
                    <Text style={styles.certFieldVal}>{artisanName}</Text>
                  </View>
                  <View style={styles.certBodyRow}>
                    <Text style={styles.certFieldLabel}>{isHindi ? 'पासपोर्ट आईडी:' : 'Passport ID:'}</Text>
                    <Text style={[styles.certFieldVal, { fontFamily: 'monospace' }]}>{passportId}</Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.85}>
              <Text style={styles.shareBtnText}>
                {isHindi ? '📤 सार्वजनिक पासपोर्ट व कार्य इतिहास साझा करें' : '📤 Share Public Work Passport'}
              </Text>
            </TouchableOpacity>
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
  badgePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
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
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  audioIcon: {
    fontSize: 16,
  },
  closeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  scrollBody: {
    padding: 18,
    paddingBottom: 40,
  },
  punchlineBanner: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#A5B4FC',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 6,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
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
    color: '#4338CA',
  },
  tabBtnTextActive: {
    color: '#3730A3',
    fontWeight: '800',
  },
  scoreHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  scoreTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreHeroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  gradePill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#34D399',
  },
  scoreVal: {
    fontSize: 36,
    fontWeight: '900',
    color: '#38BDF8',
    marginVertical: 4,
  },
  scoreSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCardLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  statCardVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statCardSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  schemesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  schemesHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  appliedBanner: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  appliedBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    textAlign: 'center',
  },
  schemeCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  schemeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schemeIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  schemeBenefit: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  eligibleBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  eligibleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  schemeApplyBtn: {
    marginTop: 10,
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  schemeApplyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
  },
  certificateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  certHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emblemBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certAuthority: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  certTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedStamp: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedStampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  certBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  certFieldLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  certFieldVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  shareBtn: {
    backgroundColor: '#4338CA',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});