import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useMarketLinkageStore } from '@/store/useMarketLinkageStore';
import { marketLinkageService } from '@/api/marketLinkageService';

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteNegotiation'>;

export const QuoteNegotiationScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { opportunityId } = route.params;
  const activeOpportunity = useMarketLinkageStore((s) => s.activeOpportunity);
  const setActiveContract = useMarketLinkageStore((s) => s.setActiveContract);
  const updateStatus = useMarketLinkageStore((s) => s.updateOpportunityStatus);

  const unitRate = activeOpportunity?.unitRateArtisan || 500;
  const [quota, setQuota] = useState(activeOpportunity?.artisanAllocatedQuota || 50);
  const [deliveryDays, setDeliveryDays] = useState(activeOpportunity?.daysToDeliver || 21);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceNote, setRecordedVoiceNote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalValue = quota * unitRate;
  const advanceAmount = Math.round(totalValue * 0.3); // 30% upfront

  const handleToggleVoiceNote = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setRecordedVoiceNote('वॉयस संदेश संलग्न: "नमस्ते, हम 15 तारीख तक 50 बैग तैयार कर देंगे।"');
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setRecordedVoiceNote('वॉयस संदेश संलग्न: "नमस्ते, हम 15 तारीख तक 50 बैग तैयार कर देंगे।"');
      }, 1500);
    }
  };

  const handleSubmitQuote = async () => {
    setIsSubmitting(true);
    try {
      const contract = await marketLinkageService.submitQuote({
        opportunityId,
        agreedQuota: quota,
        unitPrice: unitRate,
        deliveryDays,
        voiceNoteUrl: recordedVoiceNote ? 'file:///voice_note.m4a' : undefined,
      });

      setActiveContract(contract);
      updateStatus(opportunityId, 'ASSIGNED');
      setIsSubmitting(false);

      navigation.replace('B2BContract', { contractId: contract.contractId });
    } catch (_err) {
      setIsSubmitting(false);
      Alert.alert('त्रुटि', 'कोटेशन भेजने में समस्या हुई। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          कोटा व कोटेशन तय करें
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Notice */}
        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subHeading}>
          अपनी सुविधा और घर की क्षमता अनुसार कोटा चुनें। कोई ज़बरदस्ती नहीं है।
        </Text>

        {/* Quota Selection Stepper Card */}
        <Card style={styles.quotaCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            आप कितने पीस बनाना चाहती हैं?
          </Text>

          {/* Quick Preset Buttons */}
          <View style={styles.presetsRow}>
            {[25, 50, 75, 100].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => setQuota(num)}
                style={[
                  styles.presetBtn,
                  quota === num && {
                    backgroundColor: theme.colors.primary.emerald700,
                    borderColor: theme.colors.primary.emerald700,
                  },
                ]}
              >
                <Text
                  variant="bodyMedium"
                  weight="bold"
                  color={quota === num ? '#FFFFFF' : theme.colors.text.primary}
                >
                  {num} पीस
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Stepper */}
          <View style={styles.stepperBox}>
            <TouchableOpacity
              onPress={() => setQuota(Math.max(10, quota - 5))}
              style={styles.stepperBtn}
              testID="quota-decrease-btn"
            >
              <Text style={styles.stepperSymbol}>-</Text>
            </TouchableOpacity>

            <View style={styles.stepperDisplay}>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.primary.emerald700}>
                {quota}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                पीस (Units)
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setQuota(quota + 5)}
              style={styles.stepperBtn}
              testID="quota-increase-btn"
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Dynamic Recalculated Payout Card */}
        <Card style={[styles.summaryCard, { borderColor: theme.colors.primary.emerald700, borderWidth: 1.5 }]}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 10 }}>
            पुनरीक्षित कमाई सारांश (Recalculated Payout):
          </Text>

          <View style={styles.calcRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              कुल उत्पाद मूल्य ({quota} × ₹{unitRate}):
            </Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary}>
              ₹{totalValue.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              30% कच्चा माल अग्रिम (तुरंत बैंक में):
            </Text>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.primary.emerald700}>
              ₹{advanceAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text variant="bodyMedium" color={theme.colors.text.secondary}>
              तय समय सीमा:
            </Text>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
              {deliveryDays} दिन
            </Text>
          </View>
        </Card>

        {/* Timeline Selector */}
        <Card style={styles.timelineCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 8 }}>
            काम पूरा करने के लिए समय (Days):
          </Text>
          <View style={styles.presetsRow}>
            {[15, 21, 30].map((days) => (
              <TouchableOpacity
                key={days}
                onPress={() => setDeliveryDays(days)}
                style={[
                  styles.presetBtn,
                  deliveryDays === days && {
                    backgroundColor: theme.colors.primary.emerald700,
                    borderColor: theme.colors.primary.emerald700,
                  },
                ]}
              >
                <Text
                  variant="bodyMedium"
                  weight="bold"
                  color={deliveryDays === days ? '#FFFFFF' : theme.colors.text.primary}
                >
                  {days} दिन
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Voice Note / Question to Cluster Lead */}
        <Card style={styles.voiceCard}>
          <View style={styles.voiceRow}>
            <TouchableOpacity
              onPress={handleToggleVoiceNote}
              style={[
                styles.micCircle,
                { backgroundColor: isRecordingVoice ? '#D32F2F' : theme.colors.primary.emerald700 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Record voice enquiry"
            >
              <Text style={{ fontSize: 24, color: '#FFFFFF' }}>{isRecordingVoice ? '⏹️' : '🎙️'}</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="bodyMedium" weight="bold" color={theme.colors.text.primary}>
                {isRecordingVoice ? 'बोल रहे हैं (Recording)...' : 'वॉयस नोट / विशेष अनुरोध जोड़ें'}
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                {recordedVoiceNote || 'क्लस्टर लीड को कुछ पूछना या बताना हो तो बोलें'}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Sticky Submit Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <Button
          label={isSubmitting ? 'अनुबंध बन रहा है...' : 'कोटेशन जमा करें व अनुबंध बनाएं 🔒'}
          variant="primary"
          size="decision"
          isLoading={isSubmitting}
          onPress={handleSubmitQuote}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  subHeading: {
    marginBottom: 16,
    lineHeight: 22,
  },
  quotaCard: {
    padding: 16,
    marginBottom: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },
  stepperBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D7C9',
    borderRadius: 14,
    padding: 8,
    backgroundColor: '#FAF7F2',
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  stepperSymbol: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E5631',
  },
  stepperDisplay: {
    alignItems: 'center',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#F9FBF9',
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineCard: {
    padding: 16,
    marginBottom: 14,
  },
  voiceCard: {
    padding: 14,
    marginBottom: 14,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
});
