import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { AppHeader } from '@/components/navigation/AppHeader';
import { StatusBanner } from '@/components/feedback/StatusBanner';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSelection'>;

interface LanguageOption {
  code: SupportedLocale;
  nativeLabel: string;
  englishLabel: string;
  sampleGreeting: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi_IN', nativeLabel: 'हिन्दी', englishLabel: 'Hindi', sampleGreeting: 'नमस्ते' },
  { code: 'en_IN', nativeLabel: 'English', englishLabel: 'English', sampleGreeting: 'Welcome' },
  { code: 'bn_IN', nativeLabel: 'বাংলা', englishLabel: 'Bengali', sampleGreeting: 'নমস্কার' },
  { code: 'ta_IN', nativeLabel: 'தமிழ்', englishLabel: 'Tamil', sampleGreeting: 'வணக்கம்' },
  { code: 'mr_IN', nativeLabel: 'मराठी', englishLabel: 'Marathi', sampleGreeting: 'नमस्कार' },
  { code: 'gu_IN', nativeLabel: 'ગુજરાતી', englishLabel: 'Gujarati', sampleGreeting: 'નમસ્તે' },
  { code: 'od_IN', nativeLabel: 'ଓଡ଼ିଆ', englishLabel: 'Odia', sampleGreeting: 'ନମସ୍କାର' },
];

export const LanguageSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { locale, setLocale } = useAppStore();
  const { isSessionExpired, sessionExpiryReason, clearSessionExpiry } = useAuthStore();
  const [selected, setSelected] = useState<SupportedLocale>(locale || 'hi_IN');

  const handleSelectLanguage = (code: SupportedLocale) => {
    setSelected(code);
  };

  const handleContinue = async () => {
    await setLocale(selected);
    if (isSessionExpired) {
      clearSessionExpiry();
    }
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      {isSessionExpired && (
        <StatusBanner
          type="warning"
          message={sessionExpiryReason || 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें। (Session Expired)'}
        />
      )}

      {/* Top Navigation Bar with Help */}
      <AppHeader
        showBack={false}
        showBrand={true}
        rightAction={
          <View style={[styles.helpPill, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[300] }]}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              मदद (Help)
            </Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome & Instruction Header */}
        <View style={styles.header}>
          <View style={[styles.voiceBubble, { backgroundColor: theme.colors.brand.light, borderColor: theme.colors.brand.container }]}>
            <Text style={styles.voiceIcon}>🔊</Text>
          </View>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
            अपनी भाषा चुनें
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary} style={styles.subtitle}>
            Please select your preferred language
          </Text>
          <Text variant="caption" color={theme.colors.text.muted} style={{ marginTop: 2 }}>
            कारीगर और खरीदार दोनों के लिए आसान अनुभव
          </Text>

          {/* Voice Helper Tooltip Badge */}
          <View style={styles.helperBadge}>
            <Text style={{ fontSize: 13 }}>🔊</Text>
            <Text variant="caption" weight="bold" color={theme.colors.primary.emerald700}>
              भाषा सुनने के लिए स्पीकर दबाएं (Tap icon to listen)
            </Text>
          </View>
        </View>

        {/* Bolie Saathi Voice Assistant Trigger Card */}
        <View style={[styles.voiceAssistantCard, { backgroundColor: '#FFF9EE', borderColor: '#ECD9C5' }]}>
          <View style={styles.voiceAssistantLeft}>
            <View style={[styles.voiceMicCircle, { backgroundColor: theme.colors.brand.primary }]}>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>🎙️</Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
                  बोलिए साथी • बोलकर चुनें
                </Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              </View>
              <Text variant="caption" color={theme.colors.text.secondary}>
                बोलकर कहें: "हिन्दी", "বাংলা", "English"
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: theme.colors.text.muted }}>›</Text>
        </View>

        {/* Language Cards List matching Stitch layout */}
        <View style={styles.grid}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.8}
                onPress={() => handleSelectLanguage(lang.code)}
                testID={`lang-card-${lang.code}`}
                accessibilityRole="radio"
                accessibilityLabel={`${lang.nativeLabel}, ${lang.englishLabel}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected ? theme.colors.brand.light : theme.colors.surface.card,
                    borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                    borderRadius: theme.borderRadius.xl,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {/* Audio pronunciation button */}
                    <View style={[styles.listenBtn, { backgroundColor: isSelected ? 'rgba(232, 93, 42, 0.15)' : theme.colors.sand[100] }]}>
                      <Text style={{ fontSize: 13 }}>🔊</Text>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text
                          variant="headlineMedium"
                          weight="bold"
                          color={isSelected ? theme.colors.brand.primary : theme.colors.charcoal[900]}
                        >
                          {lang.nativeLabel}
                        </Text>
                        <View style={[styles.langBadge, { backgroundColor: isSelected ? theme.colors.brand.container : theme.colors.sand[100] }]}>
                          <Text variant="caption" weight="bold" color={isSelected ? theme.colors.brand.dark : theme.colors.text.secondary}>
                            {lang.englishLabel}
                          </Text>
                        </View>
                      </View>
                      <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
                        {lang.sampleGreeting} • स्वागत है
                      </Text>
                    </View>
                  </View>

                  {/* Selection Radio / Checkmark */}
                  {isSelected ? (
                    <View style={[styles.checkPill, { backgroundColor: theme.colors.brand.primary }]}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  ) : (
                    <View style={[styles.radioInactive, { borderColor: theme.colors.sand[300] }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface.card,
            borderTopColor: theme.colors.sand[200],
            ...theme.shadows.level4,
          },
        ]}
      >
        <Button
          label="आगे बढ़ें (Continue) →"
          variant="primary"
          size="decision"
          onPress={handleContinue}
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
  header: {
    alignItems: 'center',
    marginVertical: 14,
  },
  voiceBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  voiceIcon: {
    fontSize: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    textAlign: 'center',
  },
  grid: {
    marginTop: 10,
  },
  card: {
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
    minHeight: 76,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  helpPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  helperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#EBF6EE',
    borderColor: '#D0EADB',
    borderWidth: 1,
    marginTop: 10,
  },
  voiceAssistantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  voiceAssistantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceMicCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#FFE8DE',
  },
  newBadgeText: {
    color: '#E85D2A',
    fontSize: 9,
    fontWeight: '800',
  },
  listenBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  radioInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 22,
    borderTopWidth: 1,
  },
});
