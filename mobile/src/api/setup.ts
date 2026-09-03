import { apiClient } from './client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export function setupApiClient(): void {
  apiClient.setTokenProvider(async () => {
    return useAuthStore.getState().tokens?.accessToken || null;
  });

  apiClient.setLocaleProvider(() => {
    return useAppStore.getState().locale;
  });

  apiClient.setSessionExpiredHandler((reason) => {
    useAuthStore.getState().handleSessionExpired(reason);
  });
}
