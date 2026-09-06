import React, { useEffect } from 'react';
import { LogBox, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, YatraOne_400Regular } from '@expo-google-fonts/yatra-one';
import { RozhaOne_400Regular } from '@expo-google-fonts/rozha-one';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { RootNavigator } from '@/navigation/RootNavigator';
import { setupApiClient } from '@/api/setup';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

LogBox.ignoreAllLogs(true);

export default function App() {
  useFonts({
    YatraOne_400Regular,
    RozhaOne_400Regular,
  });

  useEffect(() => {
    // Inject Google Fonts stylesheet for immediate web support (Yatra One / Rozha One)
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Kalakar Setu';
      const fontId = 'google-font-indic-yatra';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Rozha+One&family=Yatra+One&display=swap';
        document.head.appendChild(link);
      }

      // Remove web browser input focus outline square boxes
      const outlineStyleId = 'disable-browser-input-focus-outline';
      if (!document.getElementById(outlineStyleId)) {
        const style = document.createElement('style');
        style.id = outlineStyleId;
        style.textContent = `
          input, textarea, select {
            outline: none !important;
            box-shadow: none !important;
          }
          input:focus, textarea:focus, select:focus {
            outline: none !important;
            box-shadow: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Initialize API Client Interceptors with Auth & Locale providers
    setupApiClient();

    // Rehydrate local storage states
    useAuthStore.getState().initialize();
    useAppStore.getState().initialize();
  }, []);

  return (
    <SafeAreaProvider style={styles.provider}>
      <ErrorBoundary>
        <ThemeProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  provider: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
