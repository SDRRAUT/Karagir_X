import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isAuthenticated, user, isSessionExpired } = useAuthStore();
  const { isInitialized } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSessionExpired) {
        navigation.replace('LanguageSelection');
      } else if (isAuthenticated && user) {
        if (user.isProfileComplete === false) {
          navigation.replace('ProfileSetup', { role: user.role });
        } else {
          navigation.replace('MainTabs', { screen: 'HomeTab' });
        }
      } else {
        navigation.replace('LanguageSelection');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, user, isSessionExpired, isInitialized]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      <View style={styles.container}>
        {/* Emblem */}
        <View
          style={[
            styles.emblemContainer,
            {
              backgroundColor: theme.colors.primary.emerald100,
              borderColor: theme.colors.primary.emerald700,
            },
          ]}
        >
          <Text style={styles.emblemEmoji}>🏺</Text>
        </View>

        {/* Title & Tagline */}
        <Text variant="displayLarge" weight="bold" color={theme.colors.primary.emerald700} style={styles.title}>
          कलाकार सेतु
        </Text>
        <Text variant="headlineMedium" color={theme.colors.terracotta.primary} style={styles.tagline}>
          कला से बाज़ार तक
        </Text>
        <Text variant="bodySmall" color={theme.colors.text.secondary} style={styles.subtext}>
          Marginalized Artisans Market Linkage
        </Text>

        <View style={styles.spinnerContainer}>
          <LoadingSpinner size={36} message="" />
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
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emblemEmoji: {
    fontSize: 54,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 48,
  },
});

