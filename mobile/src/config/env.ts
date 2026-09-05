export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  readonly environment: Environment;
  readonly apiBaseUrl: string;
  readonly grpcVoiceUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableVoiceAssistant: boolean;
  readonly enableAnalytics: boolean;
  readonly appVersion: string;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
}

const DEFAULT_SUPABASE_URL = 'https://epnfavpqweeybzoyoexq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbmZhdnBxd2VleWJ6b3lvZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTcxOTMsImV4cCI6MjEwMzk5MzE5M30.PIvlGuiavqRRnb1zTFIwdmizMh9AeSLxc5nW8YdhYHQ';

const DEFAULT_CONFIG: Record<Environment, AppConfig> = {
  development: {
    environment: 'development',
    apiBaseUrl: 'http://10.0.2.2:8000/v1', // Android emulator localhost alias
    grpcVoiceUrl: 'grpc.dev.kalakarsetu.in:443',
    apiTimeoutMs: 15000,
    enableVoiceAssistant: true,
    enableAnalytics: false,
    appVersion: '1.0.0-dev',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseAnonKey: DEFAULT_SUPABASE_ANON_KEY,
  },
  staging: {
    environment: 'staging',
    apiBaseUrl: 'https://staging-api.kalakarsetu.in/v1',
    grpcVoiceUrl: 'grpc.staging.kalakarsetu.in:443',
    apiTimeoutMs: 15000,
    enableVoiceAssistant: true,
    enableAnalytics: true,
    appVersion: '1.0.0-rc1',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseAnonKey: DEFAULT_SUPABASE_ANON_KEY,
  },
  production: {
    environment: 'production',
    apiBaseUrl: 'https://api.kalakarsetu.in/v1',
    grpcVoiceUrl: 'grpc.api.kalakarsetu.in:443',
    apiTimeoutMs: 10000,
    enableVoiceAssistant: true,
    enableAnalytics: true,
    appVersion: '1.0.0',
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseAnonKey: DEFAULT_SUPABASE_ANON_KEY,
  },
};

/**
 * Resolves current environment configuration with validation and overrides.
 */
export function getAppConfig(overrideEnv?: Environment): AppConfig {
  const env: Environment =
    overrideEnv ||
    (process.env.NODE_ENV === 'production'
      ? 'production'
      : (process.env.EXPO_PUBLIC_APP_ENV as Environment) || 'development');

  const baseConfig = DEFAULT_CONFIG[env] || DEFAULT_CONFIG.development;

  return {
    ...baseConfig,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || baseConfig.apiBaseUrl,
    grpcVoiceUrl: process.env.EXPO_PUBLIC_GRPC_VOICE_URL || baseConfig.grpcVoiceUrl,
    apiTimeoutMs: process.env.EXPO_PUBLIC_API_TIMEOUT_MS
      ? Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS)
      : baseConfig.apiTimeoutMs,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || baseConfig.supabaseUrl,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || baseConfig.supabaseAnonKey,
  };
}

export const envConfig = getAppConfig();
