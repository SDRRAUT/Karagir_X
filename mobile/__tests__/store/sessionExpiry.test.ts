import { useAuthStore } from '@/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Session Persistence & Expiry Handling', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({
      user: {
        id: 'artisan_1',
        phoneNumber: '9876543210',
        fullName: 'Sunita Devi',
        role: 'ARTISAN',
        preferredLanguage: 'hi_IN',
        isProfileComplete: true,
      },
      tokens: {
        accessToken: 'valid_token',
        refreshToken: 'valid_refresh',
        expiresInSeconds: 3600,
      },
      isAuthenticated: true,
      isSessionExpired: false,
      sessionExpiryReason: null,
    });
  });

  it('handles 401 session expiry by clearing tokens and setting isSessionExpired flag', async () => {
    await useAuthStore.getState().handleSessionExpired('Token signature invalid');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.tokens).toBeNull();
    expect(state.isSessionExpired).toBe(true);
    expect(state.sessionExpiryReason).toBe('Token signature invalid');
  });

  it('clears session expiry flag on dismissal', () => {
    useAuthStore.setState({ isSessionExpired: true, sessionExpiryReason: 'Expired' });
    useAuthStore.getState().clearSessionExpiry();

    const state = useAuthStore.getState();
    expect(state.isSessionExpired).toBe(false);
    expect(state.sessionExpiryReason).toBeNull();
  });
});
