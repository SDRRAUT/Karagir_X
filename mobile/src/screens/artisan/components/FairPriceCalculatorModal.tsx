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

interface FairPriceCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyPrice?: (price: number) => void;
}

export const FairPriceCalculatorModal: React.FC<FairPriceCalculatorModalProps> = ({
  visible,
  onClose,
  onApplyPrice,
}) => {
  const { isHindi } = useTranslation();
  const [activeTab, setActiveTab] = useState<'cost' | 'mandi'>('cost');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [materialCost, setMaterialCost] = useState(250);
  const [laborHours, setLaborHours] = useState(7);
  const [hourlyWage, setHourlyWage] = useState(200); // ₹200/hr
  const [giMultiplier, setGiMultiplier] = useState(1.25); // +25% GI premium
  const [packagingCost, setPackagingCost] = useState(60);

  // Computed Pricing
  const rawLabor = laborHours * hourlyWage; // ₹1,400
  const giSkillBonus = Math.round(rawLabor * (giMultiplier - 1)); // ₹350
  const subTotalArtisan = materialCost + rawLabor + giSkillBonus + packagingCost; // ₹2,060
  const platformFee = Math.round(subTotalArtisan * 0.05); // 5% fee = ₹103
  const totalCustomerPrice = subTotalArtisan + platformFee; // ₹2,163
  const artisanTakeHome = subTotalArtisan - packagingCost; // ₹2,000

  // Pricing Tiers & Intelligence
  const minPrice = Math.round(totalCustomerPrice * 0.8);
  const recPrice = totalCustomerPrice;
  const diwaliPrice = Math.round(totalCustomerPrice * 1.6);

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'सिर्फ लागत नहीं — बाजार भी दिखाते हैं। दीपावली आ रही है तो सिस्टम कहता है: इस दीये की मांग 3 गुना बढ़ेगी, और मूल्य 1600 रुपये तक जा सकता है। कॉस्ट फ्लोर प्लस मौसमी मांग प्लस कंपटीटर रेंज बराबर है स्मार्ट फेयर प्राइस। हम सिर्फ प्राइस सजेस्ट नहीं करते — बाजार का नशा और लागत का हिसाब दोनों देते हैं।'
        : 'We do not just calculate cost — we provide live market intelligence. With Diwali approaching, demand surges 3x and recommended pricing comfortably reaches 1600 rupees. Cost floor plus seasonal demand plus competitor benchmark equals smart fair pricing.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleApply = () => {
    realisticVoiceService.stop();
    setIsSpeaking(false);
    onApplyPrice?.(recPrice);
    onClose();
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
                <Text style={styles.badgePillText}>{isHindi ? '📊 मुख्य स्तंभ #5 व #6' : '📊 CORE PILLAR #5 & #6'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'उचित मूल्य व मंडी इंटेलिजेंस' : 'Fair-Value + Market Intelligence'}</Text>
              <Text style={styles.modalSubtitle}>
                {isHindi ? 'लागत का हिसाब + बाजार का नब्ज (मंडी इंटेलिजेंस)' : 'Cost floor + seasonal demand + competitor benchmark'}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>{isSpeaking ? '⏹️' : '🔊'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeBtnText}>{isHindi ? '✕ बाहर' : '✕ Exit'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Punchline Hero Banner */}
            <View style={styles.punchlineBanner}>
              <Text style={styles.punchlineQuote}>
                💡 {isHindi
                  ? '“हम सिर्फ प्राइस सजेस्ट नहीं करते — बाजार का नशा और कॉस्ट का हिसाब दोनों देते हैं।”'
                  : '“We do not just guess price — we calculate cost floor and decode live market demand.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi
                  ? 'समस्या: कारीगर को बाजार का पता नहीं होता। समाधान: रियल-टाइम मंडी इंटेलिजेंस उसकी भाषा में।' : 'Problem: Artisans are in the dark on true retail value. Solution: Real-time vernacular market intelligence.'}
              </Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'cost' && styles.tabBtnActive]}
                onPress={() => setActiveTab('cost')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'cost' && styles.tabBtnTextActive]}>
                  {isHindi ? '💰 लागत का हिसाब (Cost Floor)' : '💰 Cost Floor & Living Wage'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'mandi' && styles.tabBtnActive]}
                onPress={() => setActiveTab('mandi')}
              >
                <Text style={[styles.tabBtnText, activeTab === 'mandi' && styles.tabBtnTextActive]}>
                  {isHindi ? '📈 मंडी इंटेलिजेंस (Market Surge)' : '📈 Mandi & Festival Demand'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Real-time Final Price Hero Banner */}
            <View style={styles.priceHeroCard}>
              <View style={styles.heroTopRow}>
                <Text style={styles.heroLabel}>
                  {isHindi ? 'स्मार्ट अनुशंसित ग्राहक मूल्य' : 'Smart Recommended Customer Price'}
                </Text>
                <View style={styles.artisanShareBadge}>
                  <Text style={styles.artisanShareText}>
                    {isHindi ? '95% सीधा कारीगर को ✓' : '95% Direct to Artisan ✓'}
                  </Text>
                </View>
              </View>
              <Text style={styles.heroPrice}>₹{recPrice.toLocaleString('en-IN')}</Text>
              <Text style={styles.heroSubText}>
                {isHindi ? 'कारीगर की शुद्ध आय: ' : 'Artisan Direct Take-Home: '}
                <Text style={styles.heroGreenText}>₹{artisanTakeHome.toLocaleString('en-IN')}</Text>{' '}
                {isHindi ? '(एस्क्रो में सुरक्षित 🔒)' : '(Protected in Escrow 🔒)'}
              </Text>
            </View>

            {activeTab === 'cost' && (
              <View>
                {/* Interactive Pricing Controls */}
                <View style={styles.controlsCard}>
                  <Text style={styles.controlsTitle}>
                    {isHindi ? '⚙️ शोषण-मुक्त लागत घटक (Cost Floor):' : '⚙️ Transparent Cost Floor Components:'}
                  </Text>

                  {/* 1. Raw Material Cost */}
                  <View style={styles.factorRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.factorLabel}>{isHindi ? '1. कच्चा माल (मिट्टी, रंग, भट्टी ईंधन)' : '1. Raw Materials (Clay, Dyes, Kiln Fuel)'}</Text>
                      <Text style={styles.factorSub}>{isHindi ? 'प्राकृतिक नदी मिट्टी और लकड़ी की लागत' : 'Authentic natural clay & fuel expense'}</Text>
                    </View>
                    <Text style={styles.factorVal}>₹{materialCost}</Text>
                  </View>

                  {/* 2. Labor Hours & Wage */}
                  <View style={styles.factorRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.factorLabel}>{isHindi ? `2. कारीगर मजदूरी (${laborHours} घंटे @ ₹${hourlyWage}/घंटा)` : `2. Fair Artisan Wage (${laborHours} hrs @ ₹${hourlyWage}/hr)`}</Text>
                      <Text style={styles.factorSub}>{isHindi ? 'सम्मानजनक जीवन निर्वाह मजदूरी मानक' : 'Dignified fair living wage index'}</Text>
                    </View>
                    <Text style={styles.factorVal}>₹{rawLabor}</Text>
                  </View>

                  {/* 3. GI Heritage Bonus */}
                  <View style={styles.factorRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.factorLabel}>{isHindi ? '3. जीआई विरासत कौशल प्रीमियम (+25%)' : '3. GI Heritage Skill Premium (+25%)'}</Text>
                      <Text style={styles.factorSub}>{isHindi ? 'पीढ़ी-दर-पीढ़ी विरासत हुनर का मूल्य' : 'Centuries-old generational craft value'}</Text>
                    </View>
                    <Text style={[styles.factorVal, { color: '#059669' }]}>+₹{giSkillBonus}</Text>
                  </View>

                  {/* 4. Safe Craft Packaging */}
                  <View style={styles.factorRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.factorLabel}>{isHindi ? '4. इको-फ्रेंडली सुरक्षित पैकेजिंग' : '4. Eco-friendly Safe Packaging'}</Text>
                      <Text style={styles.factorSub}>{isHindi ? 'शून्य टूट-फूट कुशन बॉक्स' : 'Zero breakage shock cushion box'}</Text>
                    </View>
                    <Text style={styles.factorVal}>₹{packagingCost}</Text>
                  </View>

                  {/* 5. Platform Fee */}
                  <View style={[styles.factorRow, { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.factorLabel}>{isHindi ? '5. प्लेटफॉर्म टेक व एस्क्रो शुल्क (5%)' : '5. Platform Tech & Escrow Fee (5%)'}</Text>
                      <Text style={styles.factorSub}>{isHindi ? 'शून्य हिडन चार्ज, 100% पारदर्शी' : 'Zero hidden cuts, fully transparent'}</Text>
                    </View>
                    <Text style={[styles.factorVal, { color: '#64748B' }]}>₹{platformFee}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'mandi' && (
              <View>
                {/* Diwali Seasonal Demand Curve Card */}
                <View style={styles.surgeNoticeBox}>
                  <View style={styles.surgeHeaderRow}>
                    <Text style={{ fontSize: 22 }}>🪔</Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.surgeHeading}>{isHindi ? 'दीपावली मांग वृद्धि: 3x मांग' : 'Diwali Demand Surge: 3x Volume'}</Text>
                      <Text style={styles.surgeSub}>{isHindi ? 'त्योहारी मांग में खरीदार बिना झिझक प्रीमियम देते हैं' : 'High seasonal appetite supports elevated premium'}</Text>
                    </View>
                    <View style={styles.surgeMultiplierBadge}>
                      <Text style={styles.surgeMultiplierText}>3x Surge</Text>
                    </View>
                  </View>
                  <View style={styles.surgePriceRow}>
                    <Text style={styles.surgePriceLabel}>{isHindi ? 'त्योहारी सीजन में बिक सकता है:' : 'Seasonal Reach Price:'}</Text>
                    <Text style={styles.surgePriceVal}>₹{diwaliPrice}</Text>
                  </View>
                </View>

                {/* Mandi & Retail Benchmark Comparison */}
                <View style={styles.benchmarkCard}>
                  <Text style={styles.benchmarkTitle}>
                    {isHindi ? '📊 बाजार तुलना (Market Intelligence):' : '📊 Market Intelligence & Competitor Range:'}
                  </Text>

                  <View style={styles.benchmarkRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.benchmarkLabel}>{isHindi ? 'स्थानीय बिचौलिया खरीद (शोषण)' : 'Local Middleman Trader (Exploitation)'}</Text>
                      <Text style={styles.benchmarkSub}>{isHindi ? 'कारीगर को नाममात्र कीमत मिलती है' : 'Unfair distress price paid to artisan'}</Text>
                    </View>
                    <Text style={[styles.benchmarkVal, { color: '#EF4444' }]}>₹350</Text>
                  </View>

                  <View style={[styles.benchmarkRow, styles.benchmarkRowHighlight]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.benchmarkLabel, { color: '#059669', fontWeight: '800' }]}>
                        {isHindi ? '✓ कलाकार सेतु अनुशंसित उचित मूल्य' : '✓ Kalakar Setu Fair Recommended Price'}
                      </Text>
                      <Text style={styles.benchmarkSub}>{isHindi ? 'लागत फ्लोर + जीवन निर्वाह मजदूरी सुरक्षित' : 'Living wage + GI skill bonus + 95% payout'}</Text>
                    </View>
                    <Text style={[styles.benchmarkVal, { color: '#059669', fontSize: 18 }]}>₹{recPrice}</Text>
                  </View>

                  <View style={[styles.benchmarkRow, { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.benchmarkLabel}>{isHindi ? 'शहरी बुटीक / अमेज़न रिटेल मूल्य' : 'Urban Metro Boutique / Amazon Retail'}</Text>
                      <Text style={styles.benchmarkSub}>{isHindi ? 'अंतिम खरीदार जो खुशी से चुकाता है' : 'What city buyers happily pay'}</Text>
                    </View>
                    <Text style={[styles.benchmarkVal, { color: '#6366F1' }]}>₹2,800</Text>
                  </View>
                </View>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity onPress={handleApply} style={styles.applyBtn} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>
                {isHindi ? `✓ उचित मूल्य लागू करें (₹${recPrice})` : `✓ Apply Fair Price (₹${recPrice})`}
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
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
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
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
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
    backgroundColor: '#064E3B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6EE7B7',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 6,
    lineHeight: 18,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
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
    color: '#065F46',
  },
  tabBtnTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  priceHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: '#34D399',
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  artisanShareBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  artisanShareText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  heroPrice: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  heroSubText: {
    fontSize: 12,
    color: '#64748B',
  },
  heroGreenText: {
    color: '#059669',
    fontWeight: '800',
  },
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  controlsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  factorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  factorSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  factorVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  surgeNoticeBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  surgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surgeHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  surgeSub: {
    fontSize: 10,
    color: '#B45309',
    marginTop: 2,
  },
  surgeMultiplierBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  surgeMultiplierText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  surgePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
  },
  surgePriceLabel: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '600',
  },
  surgePriceVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D97706',
  },
  benchmarkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  benchmarkTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  benchmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  benchmarkRowHighlight: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  benchmarkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  benchmarkSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  benchmarkVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  applyBtn: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});