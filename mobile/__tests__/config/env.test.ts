import { getAppConfig } from '@/config/env';

describe('Environment Configuration', () => {
  it('returns default development configuration', () => {
    const config = getAppConfig('development');
    expect(config.environment).toBe('development');
    expect(config.apiBaseUrl).toContain('10.0.2.2');
    expect(config.apiTimeoutMs).toBe(15000);
    expect(config.enableVoiceAssistant).toBe(true);
  });

  it('returns production configuration with correct endpoints', () => {
    const config = getAppConfig('production');
    expect(config.environment).toBe('production');
    expect(config.apiBaseUrl).toBe('https://api.kalakarsetu.in/v1');
    expect(config.grpcVoiceUrl).toBe('grpc.api.kalakarsetu.in:443');
    expect(config.apiTimeoutMs).toBe(10000);
  });

  it('returns staging configuration', () => {
    const config = getAppConfig('staging');
    expect(config.environment).toBe('staging');
    expect(config.apiBaseUrl).toContain('staging');
  });
});
