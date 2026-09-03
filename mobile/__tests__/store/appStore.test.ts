import { useAppStore } from '@/store/useAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App Preferences Store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAppStore.setState({
      locale: 'hi_IN',
      isOnline: true,
      voiceAutoPlay: true,
      quietHoursEnabled: true,
    });
  });

  it('updates and persists preferred locale', async () => {
    await useAppStore.getState().setLocale('bn_IN');
    expect(useAppStore.getState().locale).toBe('bn_IN');
  });

  it('updates network connectivity status', () => {
    useAppStore.getState().setOnlineStatus(false);
    expect(useAppStore.getState().isOnline).toBe(false);

    useAppStore.getState().setOnlineStatus(true);
    expect(useAppStore.getState().isOnline).toBe(true);
  });
});
