import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AuthTokens, UserRole } from '@/api/types';
import { supabase } from '@/api/supabaseClient';
import { authService } from '@/api/authService';
import { logger } from '@/utils/logger';

const AUTH_STORAGE_KEY = '@kalakar_auth_session';

export interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;
  activeProfileId: string | null;
  profilesOnDevice: UserProfile[];
  isLoading: boolean;
  isSessionExpired: boolean;
  sessionExpiryReason: string | null;

  // Actions
  initialize: () => Promise<void>;
  setActiveRole: (role: UserRole) => void;
  setSession: (tokens: AuthTokens, user: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  handleSessionExpired: (reason?: string) => Promise<void>;
  clearSessionExpiry: () => void;
  logout: () => Promise<void>;
}

let authSubscriptionSetup = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  activeRole: null,
  activeProfileId: null,
  profilesOnDevice: [],
  isLoading: true,
  isSessionExpired: false,
  sessionExpiryReason: null,

  setActiveRole: (role: UserRole) => {
    const currentUser = get().user;
    const updatedUser = currentUser ? { ...currentUser, role } : null;
    set({
      activeRole: role,
      user: updatedUser,
    });
  },

  initialize: async () => {
    try {
      // 1. Set up Supabase auth listener once
      if (!authSubscriptionSetup) {
        authSubscriptionSetup = true;
        supabase.auth.onAuthStateChange(async (event, session) => {
          logger.info('AUTH_STORE', `Supabase auth event: ${event}`);
          if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
            const currentActiveRole = get().activeRole || get().user?.role || 'ARTISAN';
            const profile = await authService.getProfile(session.user.id, currentActiveRole);
            if (currentActiveRole) {
              profile.role = currentActiveRole;
            }
            set({
              tokens: {
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
                expiresInSeconds: session.expires_in || 3600,
              },
              user: profile,
              activeRole: profile.role,
              isAuthenticated: true,
              activeProfileId: profile.id,
              isLoading: false,
            });
          } else if (event === 'SIGNED_OUT') {
            set({
              tokens: null,
              user: null,
              activeRole: null,
              isAuthenticated: false,
              activeProfileId: null,
              isLoading: false,
            });
          }
        });
      }

      // 2. Check Supabase active session
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (!sessionErr && sessionData.session) {
        const session = sessionData.session;
        const profile = await authService.getProfile(session.user.id);
        const tokens: AuthTokens = {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresInSeconds: session.expires_in || 3600,
        };

        set({
          user: profile,
          activeRole: profile.role,
          tokens,
          isAuthenticated: true,
          activeProfileId: profile.id,
          profilesOnDevice: [profile],
          isLoading: false,
        });
        logger.info('AUTH_STORE', `Supabase session active for user ${profile.id}`);
        return;
      }

      // 3. Fallback to cached local session if offline
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const isAuth =
          !!parsed.tokens?.accessToken ||
          !!parsed.user?.isProfileComplete ||
          !!parsed.user?.fullName;

        set({
          user: parsed.user,
          activeRole: parsed.user?.role || parsed.activeRole || get().activeRole || 'ARTISAN',
          tokens: parsed.tokens,
          isAuthenticated: isAuth,
          activeProfileId: parsed.user?.id || null,
          profilesOnDevice: parsed.profilesOnDevice || (parsed.user ? [parsed.user] : []),
          isLoading: false,
        });
        logger.info('AUTH_STORE', `Cached session restored for user ${parsed.user?.id}`);
        return;
      }
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to restore auth session', error);
    }
    set({ isLoading: false });
  },

  setSession: async (tokens: AuthTokens, user: UserProfile) => {
    const currentProfiles = get().profilesOnDevice;
    const exists = currentProfiles.some((p) => p.id === user.id);
    const updatedProfiles = exists
      ? currentProfiles.map((p) => (p.id === user.id ? { ...p, ...user } : p))
      : [...currentProfiles, user];

    const sessionData = {
      tokens,
      user,
      activeRole: user.role,
      profilesOnDevice: updatedProfiles,
    };

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to persist session to storage', error);
    }

    set({
      tokens,
      user,
      activeRole: user.role,
      isAuthenticated: true,
      activeProfileId: user.id,
      profilesOnDevice: updatedProfiles,
      isSessionExpired: false,
      sessionExpiryReason: null,
    });
    logger.info('AUTH_STORE', `Session initialized for user ${user.id}`);
  },

  updateProfile: async (patch: Partial<UserProfile>) => {
    const currentUser = get().user || {
      id: get().activeProfileId || `user_${Date.now()}`,
      phoneNumber: '',
      fullName: '',
      role: patch.role || get().activeRole || 'ARTISAN',
      preferredLanguage: 'hi_IN',
      isProfileComplete: false,
    };

    const updatedUser: UserProfile = { ...currentUser, ...patch };
    const updatedProfiles = get().profilesOnDevice.map((p) =>
      p.id === updatedUser.id ? updatedUser : p
    );

    const sessionTokens: AuthTokens = get().tokens || {
      accessToken: `token_${updatedUser.id}`,
      refreshToken: `refresh_${updatedUser.id}`,
      expiresInSeconds: 86400 * 365,
    };

    const sessionData = {
      tokens: sessionTokens,
      user: updatedUser,
      activeRole: updatedUser.role,
      profilesOnDevice: updatedProfiles,
    };

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to update persisted profile', error);
    }

    set({
      user: updatedUser,
      tokens: sessionTokens,
      isAuthenticated: true,
      activeRole: updatedUser.role,
      profilesOnDevice: updatedProfiles,
    });
    logger.info('AUTH_STORE', `Profile updated for user ${updatedUser.id}`);
  },

  switchProfile: async (profileId: string) => {
    const target = get().profilesOnDevice.find((p) => p.id === profileId);
    if (!target) {
      logger.warn('AUTH_STORE', `Target profile not found on device: ${profileId}`);
      return;
    }

    set({
      user: target,
      activeRole: target.role,
      activeProfileId: target.id,
    });
    logger.info('AUTH_STORE', `Switched active profile to ${target.id}`);
  },

  handleSessionExpired: async (reason: string = 'Session expired. Please log in again.') => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to clear storage on expiry', error);
    }

    set({
      tokens: null,
      user: null,
      isAuthenticated: false,
      activeProfileId: null,
      isSessionExpired: true,
      sessionExpiryReason: reason,
    });
    logger.warn('AUTH_STORE', `Session expired: ${reason}`);
  },

  clearSessionExpiry: () => {
    set({ isSessionExpired: false, sessionExpiryReason: null });
  },

  logout: async () => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to clear session storage', error);
    }

    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      activeProfileId: null,
      isSessionExpired: false,
      sessionExpiryReason: null,
    });
    logger.info('AUTH_STORE', 'User session terminated');
  },
}));
