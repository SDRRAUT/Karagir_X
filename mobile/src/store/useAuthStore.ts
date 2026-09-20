import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AuthTokens, UserRole } from '@/api/types';
import { supabase } from '@/api/supabaseClient';
import { authService } from '@/api/authService';
import { logger } from '@/utils/logger';
import { useCartStore } from './useCartStore';
import { useProductDraftStore } from './useProductDraftStore';

import { Platform } from 'react-native';

const getEffectiveRole = (fallback?: UserRole | null): UserRole => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // 1. URL search query parameter (e.g. ?role=buyer or ?role=artisan)
    try {
      const search = (window.location.search || '').toLowerCase();
      if (search.includes('role=buyer') || search.includes('buyer')) return 'BUYER';
      if (
        search.includes('role=artisan') ||
        search.includes('role=seller') ||
        search.includes('artisan') ||
        search.includes('seller')
      ) {
        return 'ARTISAN';
      }
      // Note: Only standard non-privileged roles can be selected via URL. ADMIN role cannot be set via URL.
    } catch {}

    // 2. Tab-isolated role in sessionStorage (persists across refresh in this specific tab)
    try {
      const tabRole = window.sessionStorage.getItem('@kalakar_tab_role') as UserRole;
      if (tabRole === 'BUYER' || tabRole === 'ARTISAN' || tabRole === 'ADMIN') {
        return tabRole;
      }
    } catch {}

    // 3. Tab-isolated session in sessionStorage
    try {
      const rawTabSession = window.sessionStorage.getItem('@kalakar_tab_session');
      if (rawTabSession) {
        const parsed = JSON.parse(rawTabSession);
        const r = parsed.activeRole || parsed.user?.role;
        if (r === 'BUYER' || r === 'ARTISAN' || r === 'ADMIN') return r;
      }
    } catch {}

    // 4. Role-specific localStorage fallback
    try {
      const savedRole = window.localStorage.getItem('@kalakar_active_role') as UserRole;
      if (savedRole === 'BUYER' || savedRole === 'ARTISAN' || savedRole === 'ADMIN') {
        return savedRole;
      }
    } catch {}

    // 5. Port-based fallback only for separate dedicated ports
    try {
      const port = window.location.port;
      if (port === '2883') return 'BUYER';
      if (port === '3000') return 'ADMIN';
    } catch {}
  }
  return fallback || 'ARTISAN';
};

const getRoleScopedStorageKey = (role?: UserRole | null) => {
  const effectiveRole = role || getEffectiveRole();
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `@kalakar_auth_session_${effectiveRole.toLowerCase()}`;
  }
  return '@kalakar_auth_session';
};

const persistTabSession = (
  tokens: AuthTokens | null,
  user: UserProfile | null,
  activeRole: UserRole,
  profilesOnDevice?: UserProfile[]
) => {
  const sessionData = {
    tokens,
    user,
    activeRole,
    profilesOnDevice: profilesOnDevice || (user ? [user] : []),
  };
  const jsonStr = JSON.stringify(sessionData);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      // Tab-isolated storage (never collides with other tabs in same browser)
      window.sessionStorage.setItem('@kalakar_tab_session', jsonStr);
      window.sessionStorage.setItem('@kalakar_tab_role', activeRole);

      // Keep URL search param synchronized without triggering page reload
      const url = new URL(window.location.href);
      if (url.searchParams.get('role') !== activeRole.toLowerCase()) {
        url.searchParams.set('role', activeRole.toLowerCase());
        window.history.replaceState(null, '', url.toString());
      }
    } catch {}

    // Also persist to role-specific key in localStorage
    try {
      window.localStorage.setItem(`@kalakar_auth_session_${activeRole.toLowerCase()}`, jsonStr);
      window.localStorage.setItem('@kalakar_active_role', activeRole);
    } catch {}
  }

  // AsyncStorage for React Native / mobile fallback
  AsyncStorage.setItem(getRoleScopedStorageKey(activeRole), jsonStr).catch(() => {});
};

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
  activeRole: getEffectiveRole(),
  activeProfileId: null,
  profilesOnDevice: [],
  isLoading: true,
  isSessionExpired: false,
  sessionExpiryReason: null,

  setActiveRole: (role: UserRole) => {
    const currentUser = get().user;
    // Security Guard: Prevent unauthorized role escalation to ADMIN
    if (role === 'ADMIN' && currentUser && currentUser.role !== 'ADMIN') {
      logger.warn('AUTH_STORE', 'Blocked unauthorized switch to ADMIN role', {
        userId: currentUser.id,
        currentRole: currentUser.role,
      });
      return;
    }

    const currentRole = role;
    const updatedUser = currentUser
      ? { ...currentUser, role: currentRole }
      : {
          id: `user_${role.toLowerCase()}_demo`,
          phoneNumber: '9876543210',
          fullName: role === 'BUYER' ? 'प्रिया शर्मा' : 'रामेश्वर शर्मा',
          role: currentRole,
          preferredLanguage: 'hi_IN',
          isProfileComplete: true,
        };

    persistTabSession(get().tokens, updatedUser, currentRole, get().profilesOnDevice);

    set({
      activeRole: currentRole,
      user: updatedUser,
    });
  },

  initialize: async () => {
    const effectiveRole = getEffectiveRole(get().activeRole);

    try {
      // 1. Set up Supabase auth listener once
      if (!authSubscriptionSetup) {
        authSubscriptionSetup = true;
        supabase.auth.onAuthStateChange(async (event, session) => {
          logger.info('AUTH_STORE', `Supabase auth event: ${event}`);
          if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
            const currentTabRole = getEffectiveRole(get().activeRole || get().user?.role);
            const profile = await authService.getProfile(session.user.id, currentTabRole);
            // Strict role lock: NEVER let Supabase DB or background token refresh overwrite the tab's active role
            profile.role = currentTabRole;

            const tokens: AuthTokens = {
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
              expiresInSeconds: session.expires_in || 3600,
            };

            persistTabSession(tokens, profile, currentTabRole, [profile]);

            set({
              tokens,
              user: profile,
              activeRole: currentTabRole,
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

      // 2. Check tab-isolated sessionStorage first on Web
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const rawTabSession = window.sessionStorage.getItem('@kalakar_tab_session');
          if (rawTabSession) {
            const parsed = JSON.parse(rawTabSession);
            if (parsed && (parsed.user || parsed.tokens)) {
              const storedRole = parsed.user?.role || parsed.activeRole;
              let tabRole = storedRole || effectiveRole || 'ARTISAN';
              if (tabRole === 'ADMIN' && parsed.user?.role && parsed.user.role !== 'ADMIN') {
                tabRole = parsed.user.role;
              }
              const restoredUser = parsed.user ? { ...parsed.user, role: parsed.user.role || tabRole } : null;
              const isAuth = !!restoredUser?.isProfileComplete || !!parsed.tokens?.accessToken;

              set({
                user: restoredUser,
                activeRole: tabRole,
                tokens: parsed.tokens || null,
                isAuthenticated: isAuth,
                activeProfileId: restoredUser?.id || null,
                profilesOnDevice: parsed.profilesOnDevice || (restoredUser ? [restoredUser] : []),
                isLoading: false,
              });
              logger.info('AUTH_STORE', `Restored tab-isolated session for role ${tabRole}`);
              return;
            }
          }
        } catch {}
      }

      // 3. Check role-scoped AsyncStorage / localStorage
      const storageKey = getRoleScopedStorageKey(effectiveRole);
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedRole = parsed.user?.role || parsed.activeRole;
        let tabRole = storedRole || effectiveRole || 'ARTISAN';
        if (tabRole === 'ADMIN' && parsed.user?.role && parsed.user.role !== 'ADMIN') {
          tabRole = parsed.user.role;
        }
        const restoredUser = parsed.user ? { ...parsed.user, role: parsed.user.role || tabRole } : null;
        const isAuth =
          !!parsed.tokens?.accessToken ||
          !!restoredUser?.isProfileComplete ||
          !!restoredUser?.fullName;

        // Sync to tab sessionStorage
        persistTabSession(parsed.tokens || null, restoredUser, tabRole, parsed.profilesOnDevice);

        set({
          user: restoredUser,
          activeRole: tabRole,
          tokens: parsed.tokens || null,
          isAuthenticated: isAuth,
          activeProfileId: restoredUser?.id || null,
          profilesOnDevice: parsed.profilesOnDevice || (restoredUser ? [restoredUser] : []),
          isLoading: false,
        });
        logger.info('AUTH_STORE', `Cached session restored for user ${restoredUser?.id} on ${storageKey}`);
        return;
      }

      // 4. Check Supabase active session
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (!sessionErr && sessionData.session) {
        const session = sessionData.session;
        const profile = await authService.getProfile(session.user.id, effectiveRole);
        profile.role = effectiveRole;
        const tokens: AuthTokens = {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresInSeconds: session.expires_in || 3600,
        };

        persistTabSession(tokens, profile, effectiveRole, [profile]);

        set({
          user: profile,
          activeRole: effectiveRole,
          tokens,
          isAuthenticated: true,
          activeProfileId: profile.id,
          profilesOnDevice: [profile],
          isLoading: false,
        });
        logger.info('AUTH_STORE', `Supabase session active for user ${profile.id} with role ${effectiveRole}`);
        return;
      }
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to restore auth session', error);
    }

    // Default fallback state
    set({
      activeRole: effectiveRole,
      isLoading: false,
    });
  },

  setSession: async (tokens: AuthTokens, user: UserProfile) => {
    let tabRole = user.role || getEffectiveRole(get().activeRole);
    if (tabRole === 'ADMIN' && user.role !== 'ADMIN') {
      tabRole = user.role;
    }
    const enforcedUser = { ...user, role: user.role || tabRole };
    const currentProfiles = get().profilesOnDevice;
    const exists = currentProfiles.some((p) => p.id === enforcedUser.id);
    const updatedProfiles = exists
      ? currentProfiles.map((p) => (p.id === enforcedUser.id ? { ...p, ...enforcedUser } : p))
      : [...currentProfiles, enforcedUser];

    persistTabSession(tokens, enforcedUser, tabRole, updatedProfiles);

    set({
      tokens,
      user: enforcedUser,
      activeRole: tabRole,
      isAuthenticated: true,
      activeProfileId: enforcedUser.id,
      profilesOnDevice: updatedProfiles,
      isSessionExpired: false,
      sessionExpiryReason: null,
    });
    logger.info('AUTH_STORE', `Session initialized for user ${enforcedUser.id} with role ${tabRole}`);
  },
  updateProfile: async (patch: Partial<UserProfile>) => {
    const existingUser = get().user;
    // Security Guard: Prevent non-admin users from escalating to ADMIN role via profile patch
    if (patch.role === 'ADMIN' && existingUser && existingUser.role !== 'ADMIN') {
      logger.warn('AUTH_STORE', 'Blocked unauthorized profile patch to ADMIN role', {
        userId: existingUser.id,
        currentRole: existingUser.role,
      });
      patch.role = existingUser.role;
    }

    const targetRole = patch.role || get().activeRole || getEffectiveRole();
    const currentUser = existingUser || {
      id: get().activeProfileId || `user_${targetRole.toLowerCase()}_demo`,
      phoneNumber: '9876543210',
      fullName: targetRole === 'BUYER' ? 'प्रिया शर्मा' : 'रामेश्वर शर्मा',
      role: targetRole,
      preferredLanguage: 'hi_IN',
      isProfileComplete: true,
    };

    const updatedUser: UserProfile = { ...currentUser, ...patch, role: targetRole };
    const updatedProfiles = get().profilesOnDevice.map((p) =>
      p.id === updatedUser.id ? updatedUser : p
    );

    const sessionTokens: AuthTokens = get().tokens || {
      accessToken: `token_${updatedUser.id}`,
      refreshToken: `refresh_${updatedUser.id}`,
      expiresInSeconds: 86400 * 365,
    };

    persistTabSession(sessionTokens, updatedUser, targetRole, updatedProfiles);

    set({
      user: updatedUser,
      tokens: sessionTokens,
      isAuthenticated: true,
      activeRole: targetRole,
      profilesOnDevice: updatedProfiles,
    });
    logger.info('AUTH_STORE', `Profile updated for user ${updatedUser.id} with role ${targetRole}`);
  },

  switchProfile: async (profileId: string) => {
    const target = get().profilesOnDevice.find((p) => p.id === profileId);
    if (!target) {
      logger.warn('AUTH_STORE', `Target profile not found on device: ${profileId}`);
      return;
    }

    persistTabSession(get().tokens, target, target.role, get().profilesOnDevice);

    set({
      user: target,
      activeRole: target.role,
      activeProfileId: target.id,
    });
    logger.info('AUTH_STORE', `Switched active profile to ${target.id}`);
  },

  handleSessionExpired: async (reason: string = 'Session expired. Please log in again.') => {
    const activeRole = get().activeRole;
    try {
      await authService.logout();
      if (activeRole) {
        await AsyncStorage.removeItem(getRoleScopedStorageKey(activeRole));
      }
      await AsyncStorage.removeItem('@kalakar_auth_session');
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          window.sessionStorage.removeItem('@kalakar_tab_session');
          window.sessionStorage.removeItem('@kalakar_tab_role');
        } catch {}
      }
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
      useCartStore.getState().clearCart();
      useProductDraftStore.getState().resetDraft();
      await AsyncStorage.multiRemove([
        '@kalakar_auth_session_admin',
        '@kalakar_auth_session_buyer',
        '@kalakar_auth_session_artisan',
        '@kalakar_auth_session',
        '@kalakar_active_role',
      ]);

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          window.sessionStorage.removeItem('@kalakar_tab_session');
          window.sessionStorage.removeItem('@kalakar_tab_role');
          window.localStorage.removeItem('@kalakar_active_role');
          window.localStorage.removeItem('@kalakar_auth_session_admin');
          window.localStorage.removeItem('@kalakar_auth_session_buyer');
          window.localStorage.removeItem('@kalakar_auth_session_artisan');
          const url = new URL(window.location.href);
          if (url.searchParams.has('role')) {
            url.searchParams.delete('role');
            window.history.replaceState(null, '', url.toString());
          }
        } catch {}
      }
    } catch (error) {
      logger.error('AUTH_STORE', 'Failed to clear session storage', error);
    }

    set({
      user: null,
      tokens: null,
      activeRole: null,
      isAuthenticated: false,
      activeProfileId: null,
      profilesOnDevice: [],
      isSessionExpired: false,
      sessionExpiryReason: null,
    });
    logger.info('AUTH_STORE', 'User session terminated cleanly');
  },
}));
