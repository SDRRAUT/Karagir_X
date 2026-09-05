import React from 'react';
import { View, StyleSheet } from 'react-native';
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
      <View style={styles.container}>
        {/* Cultural Microphone Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🎙️</Text>
        </View>

        {/* Header Text */}
        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          माइक की अनुमति दें
        </Text>
        <Text variant="headlineSmall" color={theme.colors.terracotta[600]} style={styles.vernacularTitle}>
          Allow Microphone Access
        </Text>

        <Text variant="bodyLarge" color={theme.colors.charcoal[600]} style={styles.description}>
          आपको कोई फॉर्म भरने की ज़रूरत नहीं है! बस अपनी भाषा में बोलें और AI आपकी पूरी दुकान खुद बना देगा।
        </Text>

        {/* Vernacular Audio Prompt Card */}
        <View style={styles.voiceCard}>
          <Text style={styles.voiceSpeaker}>🔊</Text>
          <Text variant="bodyMedium" color={theme.colors.charcoal[800]} style={styles.voiceText}>
            "प्रोडक्ट के बारे में बोलकर बताने के लिए माइक की अनुमति दें।"
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.buttonContainer}>
          <Button
            label="माइक की अनुमति दें (Allow Mic) 🎙️"
            variant="primary"
            size="default"
            onPress={handleAllowMic}
            style={styles.primaryBtn}
          />
          <Button
            label="मैं टाइप करूंगा (Keyboard Mode)"
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

