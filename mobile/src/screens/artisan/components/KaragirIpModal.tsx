import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { useTranslation } from '@/hooks/useTranslation';
import { realisticVoiceService } from '@/services/realisticVoiceService';

interface KaragirIpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const KaragirIpModal: React.FC<KaragirIpModalProps> = ({ visible, onClose }) => {
  const { isHindi } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'ip' | 'royalty' | 'license'>('ip');
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [antiCopyStatus, setAntiCopyStatus] = useState<string | null>(null);

  const ipRecord = {
    ipTagId: 'KALAKAR-IP-MH-2026-WARLI-8492-X9',
    designTitle: isHindi ? 'वारली मत्स्य एवं जीवन चक्र रूपांकन' : 'Warli Matsya & Life Cycle Motif',
    creatorName: 'Ramesh Kumbhar & Sunita Warli',
    cluster: 'Dahanu Warli Tribal Heritage Guild, Maharashtra',
    registeredDate: '02 March 2026',
    hash: '0x8f4d92a1c7e305b6f890124a91b2c4e',
    royaltyEarned: 18450,
    activeLicenseCount: 2,
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'मान लीजिए एक वारली कारीगर ने एक यूनिक डिजाइन बनाया। कारीगर उस डिजाइन को कलाकार सेतु पर अपलोड करता है, और हम उसका कारीगर आईपी बना देते हैं — उस डिजाइन का डिजिटल रिकॉर्ड, क्रिएटर और क्रिएशन हिस्ट्री के साथ। अब ऐप में कोई दूसरा कारीगर उसी डिजाइन को कॉपी करके अपने नाम से रजिस्टर नहीं कर सकता। और जब फैबइंडिया या कोई ब्रांड इसे कॉमर्शियल रूप से इस्तेमाल करता है, तो कारीगर को रॉयल्टी मिलती है।'
        : 'Imagine a Warli artisan creates a unique tribal motif. When uploaded to Kalakar Setu, we generate a Karagir IP — a cryptographic digital record containing design provenance, creator identity, and timestamp. No other user can plagiarize or re-register it. Furthermore, when commercial brands like FabIndia license it, the artisan earns recurring royalties.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleRunAntiCopyScan = () => {
    setIsCheckingDuplicates(true);
    setAntiCopyStatus(null);
    setTimeout(() => {
      setIsCheckingDuplicates(false);
      setAntiCopyStatus(
        isHindi
          ? '✓ प्रामाणिकता सत्यापित: 10,000+ पंजीकृत डिज़ाइनों में 0 डुप्लीकेट मिले। 100% मूल डिज़ाइन।' : '✓ Authenticity Verified: 0 duplicates found across 10,000+ GI designs. 100% Original Heritage IP.'
      );
    }, 1500);
  };

  const handleShareCertificate = async () => {
    try {
      await Share.share({
        message: `🛡️ Verified Karagir IP Certificate for "${ipRecord.designTitle}" by ${ipRecord.creatorName}. IP ID: ${ipRecord.ipTagId}. Authenticated on Kalakar Setu: https://kalakarsetu.in/ip/${ipRecord.ipTagId}`,
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
                <Text style={styles.badgePillText}>{isHindi ? '🛡️ मुख्य स्तंभ #4' : '🛡️ CORE PILLAR #4'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'कारीगर आईपी व रॉयल्टी' : 'Karagir IP & Royalty Engine'}</Text>
              <Text style={styles.modalSubtitle}>
                {isHindi ? 'अद्वितीय डिज़ाइन सुरक्षा और ब्रांड रॉयल्टी ट्रैकर' : 'Unique design copyright & brand royalties'}
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
                  ? '“कारीगर के पास सिर्फ एक प्रोडक्ट नहीं, अपने ओरिजिनल डिज़ाइन का डिजिटल मालिकाना हक भी होता है।”'
                  : '“Artisans own more than products — they hold verified cryptographic IP ownership of their designs.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi
                  ? 'समस्या: डिज़ाइन चोरी और नकल। समाधान: डिजिटल आईपी रिकॉर्ड + रॉयल्टी मॉडल।' : 'Problem: Design plagiarism without compensation. Solution: Cryptographic IP + Royalty tracking.'}
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'ip' && styles.tabBtnActive]}
                onPress={() => setActiveTab('ip')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'ip' && styles.tabBtnTextActive]}>
                  {isHindi ? '📜 आईपी सर्टिफिकेट' : '📜 IP Certificate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'royalty' && styles.tabBtnActive]}
                onPress={() => setActiveTab('royalty')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'royalty' && styles.tabBtnTextActive]}>
                  {isHindi ? '💰 रॉयल्टी लेजर' : '💰 Royalty Ledger'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'license' && styles.tabBtnActive]}
                onPress={() => setActiveTab('license')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'license' && styles.tabBtnTextActive]}>
                  {isHindi ? '🤝 ब्रांड लाइसेंस' : '🤝 Brand Licensing'}
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'ip' && (
              <View>
                {/* Digital Certificate Card */}
                <View style={styles.certificateBox}>
                  <View style={styles.certTopRow}>
                    <View style={styles.shieldEmblem}>
                      <Text style={{ fontSize: 24 }}>🛡️</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.certGovLabel}>
                        {isHindi ? 'कलाकार सेतु डिजिटल बौद्धिक संपदा' : 'KALAKAR SETU INTELLECTUAL PROPERTY'}
                      </Text>
                      <Text style={styles.certIdText}>{ipRecord.ipTagId}</Text>
                    </View>
                    <View style={styles.certStamp}>
                      <Text style={styles.certStampText}>{isHindi ? 'रजिस्टर्ड ✓' : 'REGISTERED ✓'}</Text>
                    </View>
                  </View>

                  <View style={styles.certDivider} />

                  <View style={styles.certDetailRow}>
                    <Text style={styles.certLabel}>{isHindi ? 'डिज़ाइन शीर्षक:' : 'Design Title:'}</Text>
                    <Text style={styles.certVal}>{ipRecord.designTitle}</Text>
                  </View>

                  <View style={styles.certDetailRow}>
                    <Text style={styles.certLabel}>{isHindi ? 'मूल शिल्पकार (Creator):' : 'Creator / Artisan:'}</Text>
                    <Text style={styles.certVal}>{ipRecord.creatorName}</Text>
                  </View>

                  <View style={styles.certDetailRow}>
                    <Text style={styles.certLabel}>{isHindi ? 'विरासत क्लस्टर:' : 'Heritage Cluster:'}</Text>
                    <Text style={styles.certVal}>{ipRecord.cluster}</Text>
                  </View>

                  <View style={styles.certDetailRow}>
                    <Text style={styles.certLabel}>{isHindi ? 'क्रिप्टोग्राफिक हैश:' : 'Provenance Hash:'}</Text>
                    <Text style={[styles.certVal, { fontFamily: 'monospace', fontSize: 11 }]}>{ipRecord.hash}</Text>
                  </View>
                </View>

                {/* Anti-Copy Duplicate Protection Engine */}
                <View style={styles.antiCopyCard}>
                  <View style={styles.antiCopyHeader}>
                    <Text style={{ fontSize: 20 }}>🔍</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.antiCopyTitle}>
                        {isHindi ? 'एंटी-कॉपी चोरी निवारक रडार' : 'Anti-Copy Duplicate Radar'}
                      </Text>
                      <Text style={styles.antiCopySub}>
                        {isHindi ? 'AI विज़ुअल समानता जाँच • कोई दूसरा चोरी से रजिस्टर नहीं कर सकता' : 'AI Visual perceptual check across all uploaded listings'}
                      </Text>
                    </View>
                  </View>

                  {antiCopyStatus && (
                    <View style={styles.antiCopyResult}>
                      <Text style={styles.antiCopyResultText}>{antiCopyStatus}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.scanBtn}
                    onPress={handleRunAntiCopyScan}
                    activeOpacity={0.8}
                    disabled={isCheckingDuplicates}
                  >
                    <Text style={styles.scanBtnText}>
                      {isCheckingDuplicates
                        ? isHindi ? '⏳ 10,000+ डिज़ाइनों में स्कैन हो रहा है...' : '⏳ Scanning Registry for Duplicates...' : isHindi ? '🔍 एंटी-कॉपी स्कैन चलाएं' : '🔍 Run Anti-Copy Duplicate Scan'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleShareCertificate} style={styles.shareCertBtn} activeOpacity={0.85}>
                  <Text style={styles.shareCertBtnText}>
                    {isHindi ? '📤 डिजिटल आईपी सर्टिफिकेट साझा करें' : '📤 Share Verified IP Certificate'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'royalty' && (
              <View>
                {/* Royalty Total Card */}
                <View style={styles.royaltyHero}>
                  <Text style={styles.royaltyHeroLabel}>{isHindi ? 'कुल संचित रॉयल्टी आय' : 'Total Accumulated Royalty Earnings'}</Text>
                  <Text style={styles.royaltyHeroVal}>₹{ipRecord.royaltyEarned.toLocaleString('en-IN')}</Text>
                  <Text style={styles.royaltyHeroSub}>
                    {isHindi ? 'प्रत्येक कॉमर्शियल बिक्री पर 5% सीधी रॉयल्टी' : '5% direct recurring royalty on commercial sales'}
                  </Text>
                </View>

                {/* Recent Royalty Payouts */}
                <View style={styles.royaltyListCard}>
                  <Text style={styles.royaltyListTitle}>{isHindi ? '📊 हालिया रॉयल्टी क्रेडिट्स' : '📊 Recent Royalty Credits'}</Text>
                  {[
                    { brand: 'FabIndia Craft Decor', amount: 8200, items: '164 pieces sold', date: '01 Mar 2026' },
                    { brand: 'TATA Heritage Giftware', amount: 6500, items: '130 units licensed', date: '18 Feb 2026' },
                    { brand: 'Good Earth Luxury Guild', amount: 3750, items: '75 boutique sets', date: '29 Jan 2026' },
                  ].map((r, i) => (
                    <View key={i} style={styles.royaltyRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.royaltyBrand}>{r.brand}</Text>
                        <Text style={styles.royaltyUnits}>{r.items} • {r.date}</Text>
                      </View>
                      <Text style={styles.royaltyAmount}>+₹{r.amount}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'license' && (
              <View>
                <View style={styles.licenseCard}>
                  <Text style={styles.licenseCardTitle}>{isHindi ? '🤝 सक्रिय कॉमर्शियल लाइसेंस' : '🤝 Active Commercial Licenses'}</Text>
                  <Text style={styles.licenseCardSub}>
                    {isHindi ? 'बाहरी ब्रांड्स जिन्होंने आपके डिज़ाइन के उपयोग का वैधानिक लाइसेंस लिया है:' : 'Verified global brands licensed to utilize your heritage motif:'}
                  </Text>

                  <View style={styles.licenseItem}>
                    <View style={styles.licenseBadge}><Text style={{ fontSize: 18 }}>🏢</Text></View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.licenseName}>FabIndia Festive Range 2026</Text>
                      <Text style={styles.licenseTerms}>{isHindi ? 'शर्तें: 5% रॉयल्टी • गैर-विशिष्ट लाइसेंस' : 'Terms: 5% Royalty • Non-exclusive • Fabric & Pottery'}</Text>
                    </View>
                    <View style={styles.activePill}><Text style={styles.activePillText}>{isHindi ? 'सक्रिय' : 'ACTIVE'}</Text></View>
                  </View>

                  <View style={[styles.licenseItem, { borderBottomWidth: 0 }]}>
                    <View style={styles.licenseBadge}><Text style={{ fontSize: 18 }}>☕</Text></View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.licenseName}>TATA Starbucks Heritage Cups</Text>
                      <Text style={styles.licenseTerms}>{isHindi ? 'शर्तें: ₹50 प्रति कप प्रिंट • वारली सीरीज' : 'Terms: ₹50 per printed mug • Warli Artisan Edition'}</Text>
                    </View>
                    <View style={styles.activePill}><Text style={styles.activePillText}>{isHindi ? 'सक्रिय' : 'ACTIVE'}</Text></View>
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
  badgePill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7E22CE',
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
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
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
    backgroundColor: '#3B0764',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F0ABFC',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#E9D5FF',
    marginTop: 6,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#EDE9FE',
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
    color: '#6B21A8',
  },
  tabBtnTextActive: {
    color: '#7E22CE',
    fontWeight: '800',
  },
  certificateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#C084FC',
    marginBottom: 16,
  },
  certTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldEmblem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  certGovLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9333EA',
    letterSpacing: 0.5,
  },
  certIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  certStamp: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  certStampText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  certDivider: {
    height: 1,
    backgroundColor: '#F3E8FF',
    marginVertical: 14,
  },
  certDetailRow: {
    marginBottom: 10,
  },
  certLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  certVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  antiCopyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  antiCopyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  antiCopyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  antiCopySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  antiCopyResult: {
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  antiCopyResultText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  scanBtn: {
    marginTop: 12,
    backgroundColor: '#F3E8FF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7E22CE',
  },
  shareCertBtn: {
    backgroundColor: '#7E22CE',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareCertBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  royaltyHero: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  royaltyHeroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A7F3D0',
  },
  royaltyHeroVal: {
    fontSize: 32,
    fontWeight: '900',
    color: '#34D399',
    marginVertical: 4,
  },
  royaltyHeroSub: {
    fontSize: 11,
    color: '#E2E8F0',
  },
  royaltyListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  royaltyListTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  royaltyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  royaltyBrand: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  royaltyUnits: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  royaltyAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  licenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  licenseCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  licenseCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  licenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  licenseBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  licenseTerms: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
});