import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/useAuthStore';
import { logger } from '@/utils/logger';

/**
 * Security Authorization Guard Hook:
 * Guarantees that only users with an authenticated role of 'ADMIN' can access Admin screens.
 * If a Buyer, Seller/Artisan, or unauthenticated user attempts to view this screen,
 * access is immediately denied, an alert is displayed, and the user is redirected to
 * their legitimate home screen.
 */
export const useRequireAdminRole = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const isAuthorizedAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAuthorizedAdmin) {
      logger.warn('ADMIN_GUARD', 'Unauthorized attempt to access Admin screen blocked', {
        userId: user?.id,
        userRole: user?.role,
      });

      Alert.alert(
        'Access Denied',
        'You do not have administrative privileges to access the Admin Panel.'
      );

      const destinationRole = user?.role === 'BUYER' ? 'BUYER' : 'ARTISAN';
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { role: destinationRole } }],
      });
    }
  }, [isAuthorizedAdmin, navigation, user?.id, user?.role]);

  return { isAuthorizedAdmin };
};
