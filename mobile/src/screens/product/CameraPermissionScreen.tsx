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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <View style={styles.container}>
        {/* Cultural Illustration Circle */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📸</Text>
        </View>

        {/* Title */}
        <Text variant="headlineLarge" weight="bold" color={theme.colors.charcoal[900]} style={styles.title}>
          Camera Permission
        </Text>
        <Text variant="headlineSmall" color={theme.colors.terracotta[600]} style={styles.vernacularTitle}>
          AI Smart Product Photography
        </Text>

        <Text variant="bodyLarge" color={theme.colors.charcoal[600]} style={styles.description}>
          Camera access is required to capture clear photos of your authentic handcrafted creations.
        </Text>

        <View style={styles.voiceCard}>
          <Text style={styles.voiceSpeaker}>🔊</Text>
          <Text variant="bodyMedium" color={theme.colors.charcoal[800]} style={styles.voiceText}>
            "Camera permission is needed to photograph your handcrafted products."
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label={isPermanentlyDenied ? 'Open Device Settings ⚙️' : 'Allow Camera 📷'}
            variant="primary"
            size="default"
            onPress={handleRequest}
            style={styles.primaryBtn}
          />
          <Button
            label="Not Now"
            variant="secondary"
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

