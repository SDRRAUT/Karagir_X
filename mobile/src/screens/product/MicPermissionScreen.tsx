import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'MicPermission'>;

export const MicPermissionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleAllowMic = () => {
    navigation.replace('VoiceDescription');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <View style={styles.topNavRow}>
        <TouchableOpacity
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : (navigation as any).navigate('HomeTab'))}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* Cultural Microphone Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🎙️</Text>
        </View>

        {/* Header Text */}
        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          Microphone Permission
        </Text>
        <Text variant="headlineSmall" color={theme.colors.terracotta[600]} style={styles.vernacularTitle}>
          Voice-First AI Listing Assistant
        </Text>

        <Text variant="bodyLarge" color={theme.colors.charcoal[600]} style={styles.description}>
          No need to type! Just speak naturally in your own language and AI will craft your entire listing for you.
        </Text>

        {/* Audio Prompt Card */}
        <View style={styles.voiceCard}>
          <Text style={styles.voiceSpeaker}>🔊</Text>
          <Text variant="bodyMedium" color={theme.colors.charcoal[800]} style={styles.voiceText}>
            "Please allow microphone access to describe your craft with voice."
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.buttonContainer}>
          <Button
            label="Allow Microphone 🎙️"
            variant="primary"
            size="default"
            onPress={handleAllowMic}
            style={styles.primaryBtn}
          />
          <Button
            label="Type with Keyboard"
            variant="secondary"
            size="default"
            onPress={() => navigation.replace('VoiceDescription')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topNavRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 26,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F0EEFF',
    borderWidth: 2,
    borderColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  vernacularTitle: {
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFBF42',
    marginBottom: 32,
    width: '100%',
  },
  voiceSpeaker: {
    fontSize: 26,
    marginRight: 12,
  },
  voiceText: {
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryBtn: {
    marginBottom: 12,
  },
});

