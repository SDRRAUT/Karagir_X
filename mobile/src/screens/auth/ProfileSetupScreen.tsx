import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { TextInput } from '@/components/inputs/TextInput';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { authService } from '@/api/authService';
import { useAuthStore } from '@/store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

interface CraftCategory {
  code: string;
  nameHi: string;
  nameEn: string;
  icon: string;
}

const CRAFTS: CraftCategory[] = [
  { code: 'TEXTILE_HANDLOOM', nameHi: 'हथकरघा एवं बुनाई', nameEn: 'Handloom & Weaving', icon: '🧵' },
  { code: 'POTTERY_TERRACOTTA', nameHi: 'मिट्टी एवं टेराकोटा', nameEn: 'Clay & Terracotta', icon: '🏺' },
  { code: 'PAINTING_FOLK', nameHi: 'पारंपरिक चित्रकला', nameEn: 'Folk Art (Madhubani)', icon: '🎨' },
  { code: 'WOODCRAFT', nameHi: 'काष्ठ शिल्प', nameEn: 'Woodcraft & Carving', icon: '🪵' },
  { code: 'METALLURGY_DHOKRA', nameHi: 'धातु शिल्प', nameEn: 'Metalcraft & Dhokra', icon: '💍' },
  { code: 'BAMBOO_CANE', nameHi: 'बांस एवं जूट', nameEn: 'Bamboo & Jute', icon: '🧺' },
];

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { user, updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [selectedCraft, setSelectedCraft] = useState<string>('PAINTING_FOLK');
  const [district] = useState('मधुबनी (Madhubani)');
  const [state] = useState('बिहार (Bihar)');
  const [shgCode, setShgCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVoiceDictateName = () => {
    if (!fullName) {
      setFullName('सुनीता देवी (Sunita Devi)');
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम दर्ज करें (Please enter your name)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const updatedUser = await authService.setupProfile(user?.id || 'temp_id', {
        full_name: fullName.trim(),
        craft_category_code: selectedCraft,
        district,
        state,
        shg_or_facilitator_code: shgCode.trim() || undefined,
      });

      await updateProfile({
        ...updatedUser,
        fullName: fullName.trim(),
        isProfileComplete: true,
      });

      setIsLoading(false);
      navigation.replace('MainTabs', { screen: 'HomeTab' });
    } catch {
      setIsLoading(false);
      setErrorMessage('प्रोफाइल सेव करने में त्रुटि — कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        showBack
        showBrand
        title="कारीगर प्रोफाइल"
        subtitle="KALAKAR SETU"
        rightAction={
          <View style={[styles.helpPill, { backgroundColor: theme.colors.sand[100], borderColor: theme.colors.sand[300] }]}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              मदद (Help)
            </Text>
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Indicator & Tag matching Stitch Screenshot */}
        <View style={styles.stepMetaRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
              चरण 3/3
            </Text>
            <Text variant="caption" color={theme.colors.text.muted}>•</Text>
            <View style={styles.roleTagPill}>
              <Text style={styles.roleTagText}>कारीगर खाता (Artisan Account)</Text>
            </View>
          </View>
          <Text variant="caption" color={theme.colors.text.muted}>अंतिम चरण</Text>
        </View>

        {/* Stepper Progress Bar (100% Complete) */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.brand.primary }]} />
        </View>

        {/* Screen Header */}
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]}>
            कारीगर प्रोफाइल तैयार करें
          </Text>
          <Text variant="bodySmall" color={theme.colors.text.secondary} style={{ marginTop: 2 }}>
            Let's set up your artisan profile (Flow A3)
          </Text>
        </View>

        {/* Bolie Saathi Voice Companion Hint Banner */}
        <View style={[styles.voiceBanner, { backgroundColor: '#FFFFFF', borderColor: theme.colors.brand.container }]}>
          <View style={styles.voiceBannerLeft}>
            <View style={[styles.voiceBannerIcon, { backgroundColor: '#F0EEFF' }]}>
              <Text style={{ fontSize: 16 }}>🎙️</Text>
            </View>
            <View>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[900]}>
                बोलिए साथी (Voice Assistant)
              </Text>
              <Text variant="caption" color={theme.colors.text.secondary}>
                बोलकर सभी जानकारी भरें
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleVoiceDictateName}
            style={[styles.voiceActionBtn, { backgroundColor: '#F0EEFF', borderColor: '#D6D3FF' }]}
          >
            <Text variant="caption" weight="bold" color="#4B44CC">
              🎙 बोलें
            </Text>
          </TouchableOpacity>
        </View>

        {/* 1. Name Input with Voice Cue */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
              1. आपका पूरा नाम (Full Name)
            </Text>
            <TouchableOpacity
              onPress={handleVoiceDictateName}
              style={[styles.micBtn, { backgroundColor: theme.colors.brand.light, borderColor: theme.colors.brand.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Voice dictate name"
            >
              <Text variant="caption" weight="bold" color={theme.colors.brand.primary}>
                🎙️ बोलकर लिखें
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrorMessage(null);
            }}
            placeholder="उदा. सुनीता देवी / Sunita Devi"
          />
        </View>

        {/* 2. Craft Discipline Selector */}
        <View style={styles.section}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionLabel}>
            2. आपका मुख्य शिल्प क्या है? (Craft Category)
          </Text>

          <View style={styles.craftGrid}>
            {CRAFTS.map((craft) => {
              const isSelected = selectedCraft === craft.code;
              return (
                <TouchableOpacity
                  key={craft.code}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCraft(craft.code)}
                  style={[
                    styles.craftTile,
                    {
                      backgroundColor: isSelected ? theme.colors.brand.light : theme.colors.surface.card,
                      borderColor: isSelected ? theme.colors.brand.primary : theme.colors.sand[200],
                      ...theme.shadows.level1,
                    },
                  ]}
                >
                  <Text style={styles.craftIcon}>{craft.icon}</Text>
                  <Text
                    variant="bodySmall"
                    weight="bold"
                    align="center"
                    color={isSelected ? theme.colors.brand.primary : theme.colors.charcoal[900]}
                  >
                    {craft.nameHi}
                  </Text>
                  <Text variant="caption" align="center" color={theme.colors.text.secondary} style={styles.craftEn}>
                    {craft.nameEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Location Display */}
        <View style={styles.section}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionLabel}>
            3. आपका स्थान (Location)
          </Text>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <View>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                  {district}, {state}
                </Text>
                <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
                  ✓ जीआई-टैग क्लस्टर मैप से लिंक (GI Tagged)
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 4. Facilitator / SHG Code */}
        <View style={styles.section}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.sectionLabel}>
            4. सहयोगी संस्था या SHG कोड (वैकल्पिक / Optional)
          </Text>
          <TextInput
            value={shgCode}
            onChangeText={setShgCode}
            placeholder="उदा. SHG-MITHILA-402 (यदि है तो)"
          />
        </View>

        {errorMessage && (
          <Text variant="bodySmall" weight="bold" color={theme.colors.status.danger} style={styles.errorText}>
            ⚠️ {errorMessage}
          </Text>
        )}

        <Button
          label="प्रोफाइल सुरक्षित करें (Save Profile) →"
          variant="primary"
          size="decision"
          isLoading={isLoading}
          onPress={handleSubmit}
          style={styles.submitBtn}
        />

        {/* 100% ONDC Supported Trust Badge from Stitch Screen */}
        <View style={styles.ondcBadge}>
          <Text style={{ fontSize: 13 }}>🛡️</Text>
          <Text variant="caption" color={theme.colors.text.secondary}>
            100% ONDC समर्थित • सुरक्षित हस्तशिल्प प्रमाणीकरण
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  helpPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 4,
  },
  roleTagPill: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleTagText: {
    color: '#4B44CC',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  voiceBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceBannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  ondcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 64,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarIcon: {
    fontSize: 42,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 14,
  },
  avatarLabel: {
    marginTop: 6,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  micBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  craftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  craftTile: {
    width: '48%',
    padding: 12,
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  craftIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  craftEn: {
    marginTop: 2,
  },
  locationCard: {
    padding: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    fontSize: 26,
    marginRight: 12,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 8,
  },
  submitBtn: {
    marginTop: 16,
  },
});
