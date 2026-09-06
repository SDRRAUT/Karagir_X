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
        `Fair Price Calculator ke anusaar, customer price do hazaar ek sau tirasath rupaye hai. Isme se mitti aur rang do sau pachaas rupaye, aapki mehnat chaudah sau rupaye, GI skill bonus teen sau pachaas rupaye hain. Aapko milenge do hazaar rupaye, yani lagbhag pachaanve pratishat.`
      );
      utterance.lang = 'hi-IN';
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
            <View style={styles.headerLeft}>
              <View style={styles.badgePill}>
                <Text style={styles.badgePillText}>💰 CORE PILLAR #4</Text>
              </View>
              <Text style={styles.modalTitle}>Fair Price Calculator</Text>
              <Text style={styles.modalSubtitle}>Transparent, anti-exploitation pricing engine</Text>
            </View>
            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeBtnText}>✕ Exit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Real-time Final Price Hero Banner */}
            <View style={styles.priceHeroCard}>
              <View style={styles.heroTopRow}>
                <Text style={styles.heroLabel}>Recommended Customer Price</Text>
                <View style={styles.artisanShareBadge}>
                  <Text style={styles.artisanShareText}>95% Direct to Artisan ✓</Text>
                </View>
              </View>
              <Text style={styles.heroPrice}>₹{recPrice.toLocaleString('en-IN')}</Text>
              <Text style={styles.heroSubText}>
                Artisan Net Payout: <Text style={styles.heroGreenText}>₹{artisanTakeHome.toLocaleString('en-IN')}</Text> (Protected in Escrow 🔒)
              </Text>
            </View>

            {/* Interactive Pricing Controls */}
            <View style={styles.controlsCard}>
              <Text style={styles.controlsTitle}>⚙️ Cost Factors (लागत घटक):</Text>

              {/* 1. Raw Material Cost */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>1. Raw Materials (Mitti, Rang, Fuel)</Text>
                  <Text style={styles.factorSub}>Clay, river sediment, red ochre</Text>
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
                  <Text style={styles.factorLabel}>2. Labor Hours (काम के घंटे)</Text>
                  <Text style={styles.factorSub}>Shaping, molding, kiln firing ({laborHours} hrs @ ₹{hourlyWage}/hr)</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => setLaborHours((v) => Math.max(1, v - 1))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperVal}>{laborHours} hrs</Text>
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
                  <Text style={styles.factorLabel}>3. GI Certified Craft Skill</Text>
                  <Text style={styles.factorSub}>Kolhapur Heritage 4th generation skill bonus (+25%)</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={[styles.stepperVal, { color: '#7C3AED' }]}>+₹{giSkillBonus}</Text>
                </View>
              </View>

              {/* 4. Eco Packaging */}
              <View style={styles.factorRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>4. Eco-Friendly Packaging</Text>
                  <Text style={styles.factorSub}>Biodegradable straw & jute wrapping</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={styles.stepperVal}>₹{packagingCost}</Text>
                </View>
              </View>

              {/* 5. Platform Fee */}
              <View style={[styles.factorRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.factorLabel}>5. Platform Tech Fee (5%)</Text>
                  <Text style={styles.factorSub}>Zero hidden charges, transparent hosting</Text>
                </View>
                <View style={styles.stepperContainer}>
                  <Text style={[styles.stepperVal, { color: '#64748B' }]}>₹{platformFee}</Text>
                </View>
              </View>
            </View>

            {/* 3 Suggested Market Tiers */}
            <View style={styles.tiersContainer}>
              <Text style={styles.tiersTitle}>📊 Recommended Price Tiers:</Text>
              <View style={styles.tiersGrid}>
                <View style={styles.tierBox}>
                  <Text style={styles.tierName}>Minimum</Text>
                  <Text style={styles.tierVal}>₹{minPrice}</Text>
                  <Text style={styles.tierSub}>Quick Liquidity</Text>
                </View>
                <View style={[styles.tierBox, styles.tierBoxRec]}>
                  <View style={styles.recStarBadge}>
                    <Text style={styles.recStarText}>⭐ Fair Price</Text>
                  </View>
                  <Text style={[styles.tierName, { color: '#7C3AED' }]}>Recommended</Text>
                  <Text style={[styles.tierVal, { color: '#7C3AED' }]}>₹{recPrice}</Text>
                  <Text style={styles.tierSub}>Max Artisan Value</Text>
                </View>
                <View style={styles.tierBox}>
                  <Text style={styles.tierName}>Premium</Text>
                  <Text style={styles.tierVal}>₹{premPrice}</Text>
                  <Text style={styles.tierSub}>Collector Guild</Text>
                </View>
              </View>

              {/* Diwali Surge Intel */}
              <View style={styles.surgeNoticeBox}>
                <Text style={styles.surgeNoticeText}>
                  💡 <Text style={{ fontWeight: '800' }}>Diwali Demand Surge:</Text> Festive season pricing can comfortably reach <Text style={{ fontWeight: '800', color: '#047857' }}>₹{diwaliPrice}</Text> due to high buyer demand.
                </Text>
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity onPress={handleApply} style={styles.applyBtn} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>✓ Apply Fair Price (₹{recPrice})</Text>
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
