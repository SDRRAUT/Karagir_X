import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text, Button, Card, TactileKeypad, Badge } from '@/components';
import { useAppStore, SupportedLocale } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { locale, setLocale, isOnline, setOnlineStatus } = useAppStore();
  const { user, logout } = useAuthStore();
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinDigits, setPinDigits] = useState('');

  const languages: { code: SupportedLocale; name: string }[] = [
    { code: 'hi_IN', name: '🇮🇳 हिन्दी' },
    { code: 'en_IN', name: 'English' },
    { code: 'bn_IN', name: 'বাংলা' },
    { code: 'ta_IN', name: 'தமிழ்' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          कारीगर प्रोफाइल (Profile & Settings)
        </Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Text variant="headlineMedium" weight="bold">
            {user?.fullName || 'सुनीता देवी (Sunita Devi)'}
          </Text>
          <Text variant="bodyMedium" color={theme.colors.text.secondary}>
            फोन: {user?.phoneNumber || '+91 98765 43210'}
          </Text>
          <View style={styles.badgeRow}>
            <Badge label="आधार सत्यापित (Aadhaar Verified)" variant="success" icon="✓" />
          </View>
        </Card>

        {/* Language Selection */}
        <Text variant="headlineMedium" weight="bold" style={styles.sectionTitle}>
          भाषा चुनें (App Language)
        </Text>
        <View style={styles.langGrid}>
          {languages.map((lang) => (
            <Button
              key={lang.code}
              label={lang.name}
              variant={locale === lang.code ? 'primary' : 'outline'}
              onPress={() => setLocale(lang.code)}
              style={styles.langBtn}
            />
          ))}
        </View>

        {/* Offline Toggle Simulation */}
        <Text variant="headlineMedium" weight="bold" style={styles.sectionTitle}>
          नेटवर्क टेस्ट (Network Mode Simulation)
        </Text>
        <Button
          label={isOnline ? 'Simulate Offline Mode (नेटवर्क बंद करें)' : 'Restore Online Mode (इंटरनेट चालू करें)'}
          variant={isOnline ? 'outline' : 'primary'}
          onPress={() => setOnlineStatus(!isOnline)}
          style={styles.actionBtn}
        />

        {/* Shared Device PIN Pad Demo */}
        <Text variant="headlineMedium" weight="bold" style={styles.sectionTitle}>
          शेयर्ड फोन स्विच (Multi-Profile PIN Switcher)
        </Text>
        <Button
          label={showPinPad ? 'Hide Keypad' : 'प्रदर्शित करें (Show Tactile Keypad)'}
          variant="outline"
          onPress={() => setShowPinPad(!showPinPad)}
          style={styles.actionBtn}
        />

        {showPinPad && (
          <View style={styles.keypadWrapper}>
            <Text variant="headlineMedium" weight="bold" align="center" style={styles.pinDisplay}>
              PIN: {pinDigits ? pinDigits.split('').map(() => '●').join(' ') : 'चार अंक दबाएं'}
            </Text>
            <TactileKeypad
              onPressDigit={(d) => setPinDigits((prev) => (prev.length < 4 ? prev + d : prev))}
              onPressBackspace={() => setPinDigits((prev) => prev.slice(0, -1))}
              onPressConfirm={() => setPinDigits('')}
            />
          </View>
        )}

        {/* Logout */}
        <Button
          label="लॉग आउट करें (Logout)"
          variant="danger"
          onPress={async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'LanguageSelection' }],
            });
          }}
          style={styles.logoutBtn}
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
  title: {
    marginBottom: 16,
  },
  profileCard: {
    marginBottom: 20,
  },
  badgeRow: {
    marginTop: 10,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  langBtn: {
    width: '48%',
    marginBottom: 10,
  },
  actionBtn: {
    marginVertical: 6,
  },
  keypadWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
  pinDisplay: {
    marginBottom: 12,
  },
  logoutBtn: {
    marginTop: 32,
  },
});
