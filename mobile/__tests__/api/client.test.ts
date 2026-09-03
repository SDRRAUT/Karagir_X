import { ApiClient, generateIdempotencyKey } from '@/api/client';

describe('API Client & Interceptors', () => {
  it('generates valid UUID v4 format for idempotency keys', () => {
    const key1 = generateIdempotencyKey();
    const key2 = generateIdempotencyKey();

    expect(key1).not.toBe(key2);
    expect(key1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('can be initialized with custom baseUrl and timeout', () => {
    const customClient = new ApiClient('https://custom.api.test', 5000);
    expect(customClient).toBeInstanceOf(ApiClient);
  });

  it('allows registering token and locale providers', () => {
    const client = new ApiClient();
    client.setTokenProvider(async () => 'mock-jwt-token');
    client.setLocaleProvider(() => 'hi_IN');
    expect(client).toBeDefined();
  });
});
