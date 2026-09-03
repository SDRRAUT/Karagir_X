import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { useCameraPermissions } from 'expo-camera';

type Props = NativeStackScreenProps<RootStackParamList, 'CameraPermission'>;

export const CameraPermissionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  const handleRequest = async () => {
    if (permission?.status === 'denied' && !permission.canAskAgain) {
      // Permission permanently denied by OS, open device settings
      await Linking.openSettings();
      return;
    }

    const result = await requestPermission();
    if (result.granted) {
      navigation.replace('CameraCapture');
    }
  };

  const isPermanentlyDenied = permission?.status === 'denied' && !permission.canAskAgain;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <View style={styles.container}>
        {/* Cultural Illustration Circle */}
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: theme.colors.primary.emerald100,
              borderColor: theme.colors.primary.emerald700,
            },
          ]}
        >
          <Text style={styles.iconText}>📸</Text>
        </View>

        {/* Title and Vernacular Cues */}
        <Text variant="headlineLarge" weight="bold" color={theme.colors.text.primary} style={styles.title}>
          कैमरा की अनुमति दें
        </Text>
        <Text variant="headlineMedium" color={theme.colors.primary.emerald700} style={styles.vernacularTitle}>
          Allow Camera Access
        </Text>

        <Text variant="bodyLarge" color={theme.colors.text.secondary} style={styles.description}>
          अपने हस्तशिल्प और कलाकृतियों की सुंदर फोटो खींचने के लिए कैमरा की अनुमति आवश्यक है।
        </Text>

        <View
          style={[
            styles.voiceCard,
            {
              backgroundColor: theme.colors.surface.card,
              borderColor: theme.colors.surface.border,
              ...theme.shadows.level1,
            },
          ]}
        >
          <Text style={styles.voiceSpeaker}>🔊</Text>
          <Text variant="bodyMedium" color={theme.colors.text.primary} style={styles.voiceText}>
            "प्रोडक्ट की फोटो लेने के लिए कैमरा की अनुमति देना ज़रूरी है।"
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label={isPermanentlyDenied ? 'फ़ोन सेटिंग्स खोलें (Open Settings) ⚙️' : 'अनुमति दें (Allow Camera) 📷'}
            variant="primary"
            size="decision"
            onPress={handleRequest}
            style={styles.primaryBtn}
          />
          <Button
            label="अभी नहीं (Not Now)"
            variant="outline"
            size="default"
            onPress={() => navigation.goBack()}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 56,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  vernacularTitle: {
    textAlign: 'center',
    marginBottom: 16,
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
    borderWidth: 1,
    marginBottom: 32,
    width: '100%',
  },
  voiceSpeaker: {
    fontSize: 28,
    marginRight: 12,
  },
  voiceText: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryBtn: {
    marginBottom: 12,
  },
});
