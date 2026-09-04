import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
      setRecordedVoiceNote('वॉयस संदेश संलग्न: "नमस्ते, हम 15 तारीख तक 50 पीस तैयार कर देंगे।"');
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setRecordedVoiceNote('वॉयस संदेश संलग्न: "नमस्ते, हम 15 तारीख तक 50 पीस तैयार कर देंगे।"');
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="कोटा व कोटेशन तय करें"
        subtitle="Fair Quota & Delivery Terms"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Notice */}
        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.subHeading}>
          अपनी सुविधा और घर की क्षमता अनुसार कोटा चुनें। कोई ज़बरदस्ती नहीं है।
        </Text>

        {/* Quota Selection Stepper Card */}
        <Card style={styles.quotaCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            आप कितने पीस बनाना चाहती हैं?
          </Text>

          {/* Quick Preset Buttons */}
          <View style={styles.presetsRow}>
            {[25, 50, 75, 100].map((num) => {
              const isSelected = quota === num;
              return (
                <TouchableOpacity
                  key={num}
                  onPress={() => setQuota(num)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: isSelected ? theme.colors.terracotta.primary : theme.colors.surface.card,
                      borderColor: isSelected ? theme.colors.terracotta.primary : theme.colors.border.subtle,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    variant="labelMedium"
                    weight={isSelected ? 'bold' : 'normal'}
                    color={isSelected ? '#FFFFFF' : theme.colors.text.primary}
                  >
                    {num} पीस
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Stepper */}
          <View style={[styles.stepperBox, { backgroundColor: theme.colors.surface.sand }]}>
            <TouchableOpacity
              onPress={() => setQuota(Math.max(10, quota - 5))}
              style={[styles.stepperBtn, { backgroundColor: '#FFFFFF' }]}
              testID="quota-decrease-btn"
              activeOpacity={0.7}
            >
              <Text style={styles.stepperSymbol}>−</Text>
            </TouchableOpacity>

            <View style={styles.stepperDisplay}>
              <Text variant="headlineLarge" weight="bold" color={theme.colors.terracotta.primary}>
                {quota}
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary}>
                पीस (Units)
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setQuota(quota + 5)}
              style={[styles.stepperBtn, { backgroundColor: '#FFFFFF' }]}
              testID="quota-increase-btn"
              activeOpacity={0.7}
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Dynamic Recalculated Payout Card */}
        <Card style={styles.summaryCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 12 }}>
            पुनरीक्षित कमाई सारांश (Recalculated):
          </Text>

          <View style={styles.calcRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              कुल उत्पाद मूल्य ({quota} × ₹{unitRate}):
            </Text>
            <Text variant="labelLarge" weight="bold" color={theme.colors.text.primary}>
              ₹{totalValue.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              30% कच्चा माल अग्रिम (तुरंत):
            </Text>
            <Text variant="headlineSmall" weight="bold" color="#1B5E38">
              ₹{advanceAmount.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.calcRow}>
            <Text variant="labelMedium" color={theme.colors.text.secondary}>
              तय समय सीमा:
            </Text>
            <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
              {deliveryDays} दिन
            </Text>
          </View>
        </Card>

        {/* Timeline Selector */}
        <Card style={styles.timelineCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 10 }}>
            काम पूरा करने के लिए समय (Days):
          </Text>
          <View style={styles.presetsRow}>
            {[15, 21, 30].map((days) => {
              const isSelected = deliveryDays === days;
              return (
                <TouchableOpacity
                  key={days}
                  onPress={() => setDeliveryDays(days)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: isSelected ? theme.colors.terracotta.primary : theme.colors.surface.card,
                      borderColor: isSelected ? theme.colors.terracotta.primary : theme.colors.border.subtle,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    variant="labelMedium"
                    weight={isSelected ? 'bold' : 'normal'}
                    color={isSelected ? '#FFFFFF' : theme.colors.text.primary}
                  >
                    {days} दिन
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Voice Note / Question to Cluster Lead */}
        <Card style={styles.voiceCard}>
          <View style={styles.voiceRow}>
            <TouchableOpacity
              onPress={handleToggleVoiceNote}
              style={[
                styles.micCircle,
                { backgroundColor: isRecordingVoice ? '#BA1A1A' : theme.colors.terracotta.primary },
              ]}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Record voice enquiry"
            >
              <Text style={{ fontSize: 22, color: '#FFFFFF' }}>{isRecordingVoice ? '⏹️' : '🎙️'}</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="labelMedium" weight="bold" color={theme.colors.text.primary}>
                {isRecordingVoice ? 'बोल रहे हैं (Recording)...' : 'वॉयस नोट / विशेष अनुरोध जोड़ें'}
              </Text>
              <Text variant="labelSmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                {recordedVoiceNote || 'क्लस्टर लीड को कुछ पूछना या बताना हो तो बोलें'}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom Sticky Submit Button */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF' }]}>
        <Button
          label={isSubmitting ? 'अनुबंध बन रहा है...' : 'कोटेशन जमा करें व अनुबंध बनाएं 🔒'}
          variant="primary"
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
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  subHeading: {
    marginBottom: 14,
  },
  quotaCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  stepperSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#141815',
  },
  stepperDisplay: {
    alignItems: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  voiceCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
});
