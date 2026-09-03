import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { RootNavigator } from '@/navigation/RootNavigator';
import { setupApiClient } from '@/api/setup';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  useEffect(() => {
    // Initialize API Client Interceptors with Auth & Locale providers
    setupApiClient();

    // Rehydrate local storage states
    useAuthStore.getState().initialize();
    useAppStore.getState().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
