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
  const artisanTakeHome = subTotalArtisan - packagingCost; // ₹2,000 (93-95%)

  // Pricing Tiers
  const minPrice = Math.round(totalCustomerPrice * 0.8);
  const recPrice = totalCustomerPrice;
  const premPrice = Math.round(totalCustomerPrice * 1.4);
  const diwaliPrice = Math.round(totalCustomerPrice * 1.6);

  const handleSpeak = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        isHindi
          ? `उचित मूल्य कैलकुलेटर के अनुसार, अनुशंसित ग्राहक मूल्य ${recPrice} रुपये है। इसमें कच्चा माल ${materialCost} रुपये, आपकी मेहनत ${rawLabor} रुपये, जीआई कौशल बोनस ${giSkillBonus} रुपये शामिल हैं। आपको सीधे ${artisanTakeHome} रुपये मिलेंगे, जो लगभग पंचानवे प्रतिशत है।`
          : `According to Fair Price Calculator, the recommended customer price is ${recPrice} rupees. Raw material cost is ${materialCost}, labor is ${rawLabor}, and GI heritage bonus is ${giSkillBonus}. Your direct net payout is ${artisanTakeHome} rupees, which is 95% protected in escrow.`
      );
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleApply = () => {
    onApplyPrice?.(recPrice);
    onClose();
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
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>{isHindi ? '💰 मुख्य स्तंभ #4' : '💰 CORE PILLAR #4'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'उचित मूल्य कैलकुलेटर' : 'Fair Price Calculator'}</Text>
              <Text style={styles.modalSubtitle}>
                {isHindi ? 'पारदर्शी, शोषण-मुक्त मूल्य निर्धारण प्रणाली' : 'Transparent, anti-exploitation pricing engine'}
              </Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeBtnText}>{isHindi ? '✕ बाहर निकलें' : '✕ Exit'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Real-time Final Price Hero Banner */}
            <View style={styles.priceHeroCard}>
              <View style={styles.heroTopRow}>
                <Text style={styles.heroLabel}>
                  {isHindi ? 'अनुशंसित ग्राहक मूल्य' : 'Recommended Customer Price'}
                </Text>
                <View style={styles.artisanShareBadge}>
                  <Text style={styles.artisanShareText}>
                    {isHindi ? '95% सीधा कारीगर को ✓' : '95% Direct to Artisan ✓'}
                  </Text>
                </View>
              </View>
              <Text style={styles.heroPrice}>₹{recPrice.toLocaleString('en-IN')}</Text>
              <Text style={styles.heroSubText}>
                {isHindi ? 'कारीगर की शुद्ध आय: ' : 'Artisan Net Payout: '}
                <Text style={styles.heroGreenText}>₹{artisanTakeHome.toLocaleString('en-IN')}</Text>{' '}
                {isHindi ? '(एस्क्रो में सुरक्षित 🔒)' : '(Protected in Escrow 🔒)'}
              </Text>
            </View>

            {/* Interactive Pricing Controls */}
            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>
                {isHindi ? '⚙️ लागत घटक:' : '⚙️ Cost Factors:'}
              </Text>

              {/* 1. Raw Material Cost */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>
                    {isHindi ? '1. कच्चा माल (मिट्टी, प्राकृतिक रंग, ईंधन)' : '1. Raw Materials (Clay, Natural Color, Fuel)'}
                  </Text>
                  <Text style={styles.factorSub}>
                    {isHindi ? 'नदी की तलछट मिट्टी, लाल गेरू' : 'River sediment clay, natural ochre'}
                  </Text>
                </View>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => setMaterialCost((v) => Math.max(50, v - 50))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperVal}>₹{materialCost}</Text>
                  <TouchableOpacity
                    onPress={() => setMaterialCost((v) => v + 50)}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2. Labor Hours */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>
                    {isHindi ? '2. काम के घंटे' : '2. Labor Hours'}
                  </Text>
                  <Text style={styles.factorSub}>
                    {isHindi
                      ? `आकार देना, नक्काशी, भट्ठी पकाई (${laborHours} घंटे @ ₹${hourlyWage}/घंटा)`
                      : `Shaping, sculpting, kiln firing (${laborHours} hrs @ ₹${hourlyWage}/hr)`}
                  </Text>
                </View>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => setLaborHours((v) => Math.max(1, v - 1))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperVal}>{laborHours} {isHindi ? 'घंटे' : 'hrs'}</Text>
                  <TouchableOpacity
                    onPress={() => setLaborHours((v) => v + 1)}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. GI Skill & Heritage Premium */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>
                    {isHindi ? '3. जीआई प्रमाणित शिल्प कौशल' : '3. GI Certified Craft Skill'}
                  </Text>
                  <Text style={styles.factorSub}>
                    {isHindi ? 'कोल्हापुर 4थी पीढ़ी का विरासत कौशल बोनस (+25%)' : 'Kolhapur Heritage 4th generation skill bonus (+25%)'}
                  </Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={[styles.stepperVal, { color: '#7C3AED' }]}>+₹{giSkillBonus}</Text>
                </View>
              </View>

              {/* 4. Eco Packaging */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>
                    {isHindi ? '4. पर्यावरण अनुकूल पैकेजिंग' : '4. Eco-Friendly Packaging'}
                  </Text>
                  <Text style={styles.factorSub}>
                    {isHindi ? 'बायोडिग्रेडेबल जूट एवं पुआल सुरक्षा' : 'Biodegradable straw & jute wrapping'}
                  </Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={styles.stepperVal}>₹{packagingCost}</Text>
                </View>
              </View>

              {/* 5. Platform Fee */}
              <View style={[styles.factorRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>
                    {isHindi ? '5. प्लेटफॉर्म तकनीकी शुल्क (5%)' : '5. Platform Tech Fee (5%)'}
                  </Text>
                  <Text style={styles.factorSub}>
                    {isHindi ? 'शून्य छिपे हुए शुल्क, पारदर्शी होस्टिंग' : 'Zero hidden charges, transparent hosting'}
                  </Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={[styles.stepperVal, { color: '#64748B' }]}>₹{platformFee}</Text>
                </View>
              </View>
            </View>

            {/* 3 Suggested Market Tiers */}
            <View style={styles.tiersContainer}>
              <Text style={styles.tiersTitle}>
                {isHindi ? '📊 अनुशंसित मूल्य स्तर:' : '📊 Recommended Price Tiers:'}
              </Text>
              <View style={styles.tiersGrid}>
                <View style={styles.tierBox}>
                  <Text style={styles.tierName}>{isHindi ? 'न्यूनतम' : 'Minimum'}</Text>
                  <Text style={styles.tierVal}>₹{minPrice}</Text>
                  <Text style={styles.tierSub}>{isHindi ? 'त्वरित बिक्री' : 'Quick Liquidity'}</Text>
                </View>
                <View style={[styles.tierBox, styles.tierBoxRec]}>
                  <View style={styles.recStarBadge}>
                    <Text style={styles.recStarText}>{isHindi ? '⭐ उचित मूल्य' : '⭐ Fair Price'}</Text>
                  </View>
                  <Text style={[styles.tierName, { color: '#7C3AED' }]}>
                    {isHindi ? 'अनुशंसित' : 'Recommended'}
                  </Text>
                  <Text style={[styles.tierVal, { color: '#7C3AED' }]}>₹{recPrice}</Text>
                  <Text style={styles.tierSub}>
                    {isHindi ? 'अधिकतम मूल्य' : 'Max Artisan Value'}
                  </Text>
                </View>
                <View style={styles.tierBox}>
                  <Text style={styles.tierName}>{isHindi ? 'प्रीमियम' : 'Premium'}</Text>
                  <Text style={styles.tierVal}>₹{premPrice}</Text>
                  <Text style={styles.tierSub}>{isHindi ? 'विशेष संग्रह' : 'Collector Guild'}</Text>
                </View>
              </View>

              {/* Diwali Surge Intel */}
              <View style={styles.surgeNoticeBox}>
                <Text style={styles.surgeNoticeText}>
                  💡 <Text style={{ fontWeight: '800' }}>
                    {isHindi ? 'दीपावली मांग वृद्धि:' : 'Diwali Demand Surge:'}
                  </Text>{' '}
                  {isHindi
                    ? `त्योहारी मांग के कारण यह उत्पाद आसानी से `
                    : `Festive season pricing can comfortably reach `}
                  <Text style={{ fontWeight: '800', color: '#047857' }}>₹{diwaliPrice}</Text>
                  {isHindi ? ' तक बिक सकता है।' : ' due to high buyer demand.'}
                </Text>
              </View>
            </View>

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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
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
    gap: 14,
  },
  priceHeroCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 22,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 6px 20px rgba(124, 58, 237, 0.3)',
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DDD6FE',
  },
  artisanShareBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  artisanShareText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heroPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  heroSubText: {
    fontSize: 12,
    color: '#EDE9FE',
  },
  heroGreenText: {
    color: '#34D399',
    fontWeight: '800',
  },
  controlsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  controlsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  factorLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  factorSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  stepperVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 50,
    textAlign: 'center',
  },
  tiersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tiersTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },
  tiersGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tierBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  tierBoxRec: {
    backgroundColor: '#FAF5FF',
    borderColor: '#7C3AED',
    borderWidth: 2,
    position: 'relative',
  },
  recStarBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  recStarText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  tierName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tierVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  tierSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  surgeNoticeBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  surgeNoticeText: {
    fontSize: 11.5,
    color: '#92400E',
    lineHeight: 16,
  },
  applyBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
