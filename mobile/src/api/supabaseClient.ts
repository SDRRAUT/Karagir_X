import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { envConfig } from '@/config/env';
import { logger } from '@/utils/logger';

if (!envConfig.supabaseUrl || !envConfig.supabaseAnonKey) {
  logger.error('SUPABASE_CLIENT', 'Missing Supabase environment configuration');
}

/**
 * Production Supabase Client instance with persistent session management via AsyncStorage.
 * Uses client-safe anonymous credentials.
 */
export const supabase = createClient(envConfig.supabaseUrl, envConfig.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
