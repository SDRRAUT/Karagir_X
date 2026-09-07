import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { useTranslation } from '@/hooks/useTranslation';
import { realisticVoiceService } from '@/services/realisticVoiceService';
import { CRAFT_IMAGES } from '@/assets/craftImages';

interface CraftStudioModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const CraftStudioModal: React.FC<CraftStudioModalProps> = ({ visible, onClose }) => {
  const { isHindi } = useTranslation();
  const [activeView, setActiveView] = useState<'after' | 'before'>('after');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      realisticVoiceService.stop();
      setIsSpeaking(false);
      return;
    }

    const speechText =
      isHindi
        ? 'जजेस, हम प्रोडक्ट को एआई से नया डिजाइन नहीं करते। हमारा क्राफ्ट अवेयर एआई स्टूडियो सिर्फ असली मिट्टी की बनावट और कारीगरी की बनावट को सुरक्षित रखकर लाइटिंग, कंट्रास्ट और बैकग्राउंड को प्रोफेशनल बनाता है। एआई प्रोडक्ट को बदलता नहीं, उसकी असली गुणवत्ता को निखारता है।'
        : 'Judges, we do not redesign or hallucinate the product with AI. Our Craft-Aware AI Studio preserves the authentic clay texture, shape, and handmade grain while optimizing studio lighting, contrast, and background cleanup. AI does not alter the craft, it showcases its true quality.';

    setIsSpeaking(true);
    realisticVoiceService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSimulateEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveView('after');
    }, 1200);
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
                <Text style={styles.badgePillText}>{isHindi ? '📸 मुख्य स्तंभ #2' : '📸 CORE PILLAR #2'}</Text>
              </View>
              <Text style={styles.modalTitle}>{isHindi ? 'क्राफ्ट-अवेयर एआई स्टूडियो' : 'Craft-Aware AI Studio'}</Text>
              <Text style={styles.modalSubtitle}>
                {isHindi ? 'कारीगरी का मूल रंग व बनावट सुरक्षित, स्टूडियो क्वालिटी' : 'Authentic craft preserved • Studio photography'}
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
                💡 {isHindi ? '“AI प्रोडक्ट को बदलता नहीं, उसकी असली क्वालिटी को क्लीयरली दिखाता है।”' : '“AI does not redesign the craft — it illuminates its authentic handmade perfection.”'}
              </Text>
              <Text style={styles.punchlineSub}>
                {isHindi ? 'समस्या: ₹2,000 की वस्तु ₹200 दिखती है। समाधान: घर बैठे स्टूडियो फोटो।' : 'Problem: ₹2000 craft looks like ₹200. Solution: Studio-grade cataloging from home.'}
              </Text>
            </View>

            {/* Interactive Before / After Studio View */}
            <View style={styles.previewCard}>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, activeView === 'before' && styles.toggleBtnActive]}
                  onPress={() => setActiveView('before')}
                >
                  <Text style={[styles.toggleBtnText, activeView === 'before' && styles.toggleBtnTextActive]}>
                    {isHindi ? '📱 पहले (सामान्य कमरा)' : '📱 Before (Dim Workshop)'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, activeView === 'after' && styles.toggleBtnActive]}
                  onPress={() => setActiveView('after')}
                >
                  <Text style={[styles.toggleBtnText, activeView === 'after' && styles.toggleBtnTextActive]}>
                    {isHindi ? '✨ बाद में (एआई स्टूडियो)' : '✨ After (AI Studio)'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={CRAFT_IMAGES.terracottaDiya}
                  style={[
                    styles.craftImage,
                    activeView === 'before' && styles.craftImageBefore,
                  ]}
                  resizeMode="cover"
                />
                <View style={[styles.floatingTag, activeView === 'after' ? styles.tagAfter : styles.tagBefore]}>
                  <Text style={styles.floatingTagText}>
                    {activeView === 'after'
                      ? isHindi ? '✓ 100% कारीगरी टेक्सचर सुरक्षित' : '✓ Authentic Handmade Grain Preserved'
                      : isHindi ? '⚠️ कमजोर रोशनी व साधारण बैकग्राउंड' : '⚠️ Low lighting & clutter'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Craft Preservation Guarantee Checklist */}
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>
                {isHindi ? '🛡️ क्राफ्ट-प्रिजर्वेशन 4-पॉइंट गारंटी:' : '🛡️ Craft-Preservation 4-Point Guarantee:'}
              </Text>

              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkHeading}>{isHindi ? '1. शून्य जेनेरेटिव विकृति (Zero Hallucination)' : '1. Zero Generative Hallucination'}</Text>
                  <Text style={styles.checkDesc}>{isHindi ? 'हाथ से चाक पर गढ़ी मिट्टी की धारियां और प्राकृतिक रूप 100% वास्तविक रहता है।' : 'Wheel-thrown ridges, organic contours, and handmade fingerprint remain completely genuine.'}</Text>
                </View>
              </View>

              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkHeading}>{isHindi ? '2. प्राकृतिक खनिज रंग कैलिब्रेशन' : '2. Natural Mineral Pigment Calibration'}</Text>
                  <Text style={styles.checkDesc}>{isHindi ? 'पंचगंगा लाल मिट्टी का मूल रंग बिना किसी कृत्रिम फिल्टर के सटीक दिखता है।' : 'Authentic riverbed terracotta reddish-umber hue calibrated with high color accuracy.'}</Text>
                </View>
              </View>

              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkHeading}>{isHindi ? '3. स्टूडियो सॉफ्ट शैडो व लाइटिंग' : '3. Studio Soft Shadow & Dual-Fill Lighting'}</Text>
                  <Text style={styles.checkDesc}>{isHindi ? 'छाया और चमक को संतुलित करके गहराई और भव्यता बढ़ाई जाती है।' : 'Removes harsh glares while casting gentle studio depth shadows under the craft base.'}</Text>
                </View>
              </View>

              <View style={[styles.checkItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.checkIcon}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkHeading}>{isHindi ? '4. कार्यशाला बैकग्राउंड सफाई' : '4. Neutral Artisan Studio Backdrop'}</Text>
                  <Text style={styles.checkDesc}>{isHindi ? 'वर्कशॉप का बिखरा सामान हटाकर प्रीमियम न्यूट्रल बैकड्रॉप लगाया जाता है।' : 'Isolates the craft cleanly on museum-grade parchment, boosting buyer trust.'}</Text>
                </View>
              </View>
            </View>

            {/* Re-enhance Action */}
            <TouchableOpacity
              onPress={handleSimulateEnhance}
              style={styles.reEnhanceBtn}
              activeOpacity={0.85}
              disabled={isProcessing}
            >
              <Text style={styles.reEnhanceBtnText}>
                {isProcessing
                  ? isHindi ? '⏳ एआई स्टूडियो प्रोसेस हो रहा है...' : '⏳ AI Studio Enhancing Details...' : isHindi ? '⚡ एआई स्टूडियो जादू फिर से देखें' : '⚡ Re-run Studio Enhancement'}
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
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
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
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
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
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  punchlineQuote: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
    lineHeight: 20,
  },
  punchlineSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    lineHeight: 18,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#0284C7',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  craftImage: {
    width: '100%',
    height: '100%',
  },
  craftImageBefore: {
    opacity: 0.7,
    tintColor: 'rgba(50, 40, 30, 0.4)',
  },
  floatingTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagAfter: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  tagBefore: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
  },
  floatingTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  checkHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  checkDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  reEnhanceBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reEnhanceBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});