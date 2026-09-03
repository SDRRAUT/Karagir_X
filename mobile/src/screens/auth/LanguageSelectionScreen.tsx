import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {isSessionExpired && (
        <StatusBanner
          type="warning"
          message={sessionExpiryReason || 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें। (Session Expired)'}
        />
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.voiceIcon}>🔊</Text>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
            अपनी भाषा चुनें
          </Text>
          <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
            Please select your preferred language
          </Text>
        </View>

        {/* Language Grid */}
        <View style={styles.grid}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.7}
                onPress={() => handleSelectLanguage(lang.code)}
                testID={`lang-card-${lang.code}`}
                accessibilityRole="radio"
                accessibilityLabel={`${lang.nativeLabel}, ${lang.englishLabel}`}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary.emerald100
                      : theme.colors.surface.card,
                    borderColor: isSelected
                      ? theme.colors.primary.emerald700
                      : theme.colors.surface.border,
                    borderRadius: theme.touch.radii.card,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary}>
                    {lang.nativeLabel}
                  </Text>
                  {isSelected && (
                    <Text variant="headlineMedium" color={theme.colors.primary.emerald700}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text variant="bodyMedium" color={theme.colors.text.secondary}>
                  {lang.englishLabel} • {lang.sampleGreeting}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
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
    marginVertical: 16,
  },
  voiceIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
  },
  grid: {
    marginTop: 12,
  },
  card: {
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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

