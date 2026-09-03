import { useAuthStore } from '@/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Auth Store (Zustand)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      activeProfileId: null,
      profilesOnDevice: [],
    });
  });

  it('manages login session and persists to device', async () => {
    const mockUser = {
      id: 'artisan_1',
      phoneNumber: '+919876543210',
      fullName: 'Sunita Devi',
      role: 'ARTISAN' as const,
      preferredLanguage: 'hi_IN',
    };

    const mockTokens = {
      accessToken: 'token-abc',
      refreshToken: 'refresh-xyz',
      expiresInSeconds: 3600,
    };

    await useAuthStore.getState().setSession(mockTokens, mockUser);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe('artisan_1');
    expect(state.profilesOnDevice.length).toBe(1);
  });

  it('supports multi-profile switching on shared household devices', async () => {
    const user1 = {
      id: 'artisan_1',
      phoneNumber: '+919876543210',
      fullName: 'Sunita Devi',
      role: 'ARTISAN' as const,
      preferredLanguage: 'hi_IN',
    };
    const user2 = {
      id: 'artisan_2',
      phoneNumber: '+919876543211',
      fullName: 'Ramesh Kumar',
      role: 'ARTISAN' as const,
      preferredLanguage: 'hi_IN',
    };

    useAuthStore.setState({
      user: user1,
      activeProfileId: 'artisan_1',
      profilesOnDevice: [user1, user2],
    });

    await useAuthStore.getState().switchProfile('artisan_2');

    const state = useAuthStore.getState();
    expect(state.activeProfileId).toBe('artisan_2');
    expect(state.user?.fullName).toBe('Ramesh Kumar');
  });

  it('clears state on logout', async () => {
    useAuthStore.setState({
      user: {
        id: 'artisan_1',
        phoneNumber: '+919876543210',
        fullName: 'Sunita Devi',
        role: 'ARTISAN' as const,
        preferredLanguage: 'hi_IN',
      },
      tokens: { accessToken: 'xyz', refreshToken: 'abc', expiresInSeconds: 3600 },
      isAuthenticated: true,
    });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
