import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

const APP_PREFERENCES_KEY = '@kalakar_app_preferences';

export type SupportedLocale = 'hi_IN' | 'en_IN' | 'bn_IN' | 'ta_IN' | 'te_IN' | 'gu_IN' | 'od_IN' | 'mr_IN';

export interface AppState {
  locale: SupportedLocale;
  isOnline: boolean;
  voiceAutoPlay: boolean;
  quietHoursEnabled: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  setOnlineStatus: (isOnline: boolean) => void;
  setVoiceAutoPlay: (enabled: boolean) => Promise<void>;
  setQuietHoursEnabled: (enabled: boolean) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  locale: 'en_IN',
  isOnline: true,
  voiceAutoPlay: true,
  quietHoursEnabled: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(APP_PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          locale: parsed.locale || 'en_IN',
          voiceAutoPlay: parsed.voiceAutoPlay ?? true,
          quietHoursEnabled: parsed.quietHoursEnabled ?? true,
          isInitialized: true,
        });
        return;
      }
    } catch (error) {
      logger.error('APP_STORE', 'Failed to load app preferences', error);
    }
    set({ isInitialized: true });
  },

  setLocale: async (locale: SupportedLocale) => {
    set({ locale });
    try {
      await AsyncStorage.setItem(
        APP_PREFERENCES_KEY,
        JSON.stringify({
          locale,
          voiceAutoPlay: get().voiceAutoPlay,
          quietHoursEnabled: get().quietHoursEnabled,
        })
      );
    } catch (error) {
      logger.error('APP_STORE', 'Failed to persist locale', error);
    }
    logger.info('APP_STORE', `Locale updated to ${locale}`);
  },

  setOnlineStatus: (isOnline: boolean) => {
    set({ isOnline });
    logger.info('APP_STORE', `Network connectivity status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
  },

  setVoiceAutoPlay: async (voiceAutoPlay: boolean) => {
    set({ voiceAutoPlay });
    try {
      await AsyncStorage.setItem(
        APP_PREFERENCES_KEY,
        JSON.stringify({
          locale: get().locale,
          voiceAutoPlay,
          quietHoursEnabled: get().quietHoursEnabled,
        })
      );
    } catch (error) {
      logger.error('APP_STORE', 'Failed to persist voiceAutoPlay preference', error);
    }
  },

  setQuietHoursEnabled: async (quietHoursEnabled: boolean) => {
    set({ quietHoursEnabled });
    try {
      await AsyncStorage.setItem(
        APP_PREFERENCES_KEY,
        JSON.stringify({
          locale: get().locale,
          voiceAutoPlay: get().voiceAutoPlay,
          quietHoursEnabled,
        })
      );
    } catch (error) {
      logger.error('APP_STORE', 'Failed to persist quietHours preference', error);
    }
  },
}));
