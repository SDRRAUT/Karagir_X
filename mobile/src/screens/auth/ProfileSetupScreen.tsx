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
  { code: 'PAINTING_FOLK', nameHi: 'पारंपरिक चित्रकला', nameEn: 'Folk Art (Madhubani/Warli)', icon: '🎨' },
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
    // Cultural convenience: fills sample artisan voice transcription if empty
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
            कारीगर प्रोफाइल तैयार करें
          </Text>
          <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.subtitle}>
            Let's set up your artisan profile (Flow A3)
          </Text>
        </View>

        {/* 1. Name Input with Voice Cue */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
              1. आपका पूरा नाम (Full Name)
            </Text>
            <TouchableOpacity
              onPress={handleVoiceDictateName}
              style={[styles.micBtn, { backgroundColor: theme.colors.primary.emerald100 }]}
              accessibilityRole="button"
              accessibilityLabel="Voice dictate name"
            >
              <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
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
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.sectionLabel}>
            2. आपका मुख्य शिल्प क्या है? (Craft Category)
          </Text>

          <View style={styles.craftGrid}>
            {CRAFTS.map((craft) => {
              const isSelected = selectedCraft === craft.code;
              return (
                <TouchableOpacity
                  key={craft.code}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCraft(craft.code)}
                  style={[
                    styles.craftTile,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary.emerald100
                        : theme.colors.surface.card,
                      borderColor: isSelected
                        ? theme.colors.primary.emerald700
                        : theme.colors.surface.border,
                      ...theme.shadows.level1,
                    },
                  ]}
                >
                  <Text style={styles.craftIcon}>{craft.icon}</Text>
                  <Text variant="bodySmall" weight="bold" align="center" color={theme.colors.text.primary}>
                    {craft.nameHi}
                  </Text>
                  <Text variant="bodySmall" align="center" color={theme.colors.text.secondary} style={styles.craftEn}>
                    {craft.nameEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Location Display */}
        <View style={styles.section}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.sectionLabel}>
            3. आपका स्थान (Location)
          </Text>
          <Card style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <View>
                <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary}>
                  {district}, {state}
                </Text>
                <Text variant="bodySmall" color={theme.colors.primary.emerald700}>
                  ✓ जीआई-टैग क्लस्टर मैप से लिंक
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 4. Facilitator / SHG Code (Optional) */}
        <View style={styles.section}>
          <Text variant="bodyLarge" weight="bold" color={theme.colors.text.primary} style={styles.sectionLabel}>
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
          variant="terracotta"
          size="decision"
          isLoading={isLoading}
          onPress={handleSubmit}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 64,
  },
  header: {
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
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
    borderRadius: 999,
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
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 104,
    justifyContent: 'center',
  },
  craftIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  craftEn: {
    fontSize: 10,
    marginTop: 2,
  },
  locationCard: {
    padding: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPin: {
    fontSize: 28,
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

