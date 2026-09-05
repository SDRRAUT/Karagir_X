import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AuthPhone', { role: 'ARTISAN' });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <View style={styles.container}>
        {/* Official KarigarX Logo Emblem */}
        <View
          style={[
            styles.emblemContainer,
            {
              backgroundColor: '#FAF7F2',
              borderColor: '#E8ECF4',
              ...theme.shadows.level2,
            },
          ]}
        >
          <Image
            source={require('../../../assets/karigarx_logo.png')}
            style={styles.splashLogoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title & Tagline */}
        <Text
          variant="displayLarge"
          weight="bold"
          color="#0E243F"
          style={styles.title}
        >
          KARIGARX
        </Text>
        <Text
          variant="headlineMedium"
          weight="semiBold"
          color="#5A52DD"
          style={styles.tagline}
        >
          CRAFT • CONNECT • GROW
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.subtext}>
          कलाकार सेतु — Marginalized Artisans Direct Market Linkage
        </Text>

        <View style={styles.spinnerContainer}>
          <LoadingSpinner size={36} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emblemContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    padding: 12,
  },
  splashLogoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 48,
  },
});
