export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  readonly environment: Environment;
  readonly apiBaseUrl: string;
  readonly grpcVoiceUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableVoiceAssistant: boolean;
  readonly enableAnalytics: boolean;
  readonly appVersion: string;
}

const DEFAULT_CONFIG: Record<Environment, AppConfig> = {
  development: {
    environment: 'development',
    apiBaseUrl: 'http://10.0.2.2:8000/v1', // Android emulator localhost alias
    grpcVoiceUrl: 'grpc.dev.kalakarsetu.in:443',
    apiTimeoutMs: 15000,
    enableVoiceAssistant: true,
    enableAnalytics: false,
    appVersion: '1.0.0-dev',
  },
  staging: {
    environment: 'staging',
    apiBaseUrl: 'https://staging-api.kalakarsetu.in/v1',
    grpcVoiceUrl: 'grpc.staging.kalakarsetu.in:443',
    apiTimeoutMs: 15000,
    enableVoiceAssistant: true,
    enableAnalytics: true,
    appVersion: '1.0.0-rc1',
  },
  production: {
    environment: 'production',
    apiBaseUrl: 'https://api.kalakarsetu.in/v1',
    grpcVoiceUrl: 'grpc.api.kalakarsetu.in:443',
    apiTimeoutMs: 10000,
    enableVoiceAssistant: true,
    enableAnalytics: true,
    appVersion: '1.0.0',
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
  };
}

export const envConfig = getAppConfig();
