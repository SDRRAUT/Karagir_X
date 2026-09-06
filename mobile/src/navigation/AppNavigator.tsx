import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { ArtisanHomeScreen, KhataScreen, OrdersScreen } from '@/screens/artisan';
import { BuyerHomeScreen, CategoriesScreen, CartScreen } from '@/screens/buyer';
import {
  AdminDashboardScreen,
  AdminKycScreen,
  AdminModerationScreen,
  AdminEscrowScreen,
} from '@/screens/admin';
import { ProfileScreen } from '@/screens/shared';
import { OpportunitiesScreen } from '@/screens/linkage/OpportunitiesScreen';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Outline Icons matching reference mockup exactly
const TabIcons = {
  Home: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'home' : 'homeOutline'} size={22} color={color} />
    </View>
  ),
  Governance: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name="shieldCheck" size={22} color={color} />
    </View>
  ),
  KycQueue: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name="users" size={22} color={color} />
    </View>
  ),
  Moderation: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name="alertCircle" size={22} color={color} />
    </View>
  ),
  Escrow: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'wallet' : 'walletOutline'} size={22} color={color} />
    </View>
  ),
  Studio: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'shop' : 'shopOutline'} size={22} color={color} />
    </View>
  ),
  Explore: ({ color }: { color: string }) => (
    <View style={styles.iconBox}>
      <Icon name="search" size={22} color={color} />
    </View>
  ),
  BulkDeals: ({ color }: { color: string }) => (
    <View style={styles.iconBox}>
      <Icon name="sparkles" size={22} color={color} />
    </View>
  ),
  Orders: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'orders' : 'ordersOutline'} size={22} color={color} />
    </View>
  ),
  Khata: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'wallet' : 'walletOutline'} size={22} color={color} />
    </View>
  ),
  Cart: ({ color, count }: { color: string; count: number }) => (
    <View style={styles.iconBox}>
      <Icon name="bagOutline" size={22} color={color} />
      {count > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  ),
  Account: ({ focused, color }: { focused?: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Icon name={focused ? 'profile' : 'profileOutline'} size={22} color={color} />
    </View>
  ),
};

const ExploreTabScreen = (props: any) => <CategoriesScreen {...props} />;
const BulkDealsTabScreen = (props: any) => <OpportunitiesScreen {...props} />;
const CartTabScreen = (props: any) => <CartScreen {...props} />;
const OrdersTabScreen = (props: any) => <OrdersScreen {...props} />;
const KhataTabScreen = (props: any) => <KhataScreen {...props} />;
const AccountTabScreen = (props: any) => <ProfileScreen {...props} />;
const ArtisanHomeTabScreen = (props: any) => <ArtisanHomeScreen {...props} />;
const AdminDashboardTabScreen = (props: any) => <AdminDashboardScreen {...props} />;
const AdminKycTabScreen = (props: any) => <AdminKycScreen {...props} />;
const AdminModerationTabScreen = (props: any) => <AdminModerationScreen {...props} />;
const AdminEscrowTabScreen = (props: any) => <AdminEscrowScreen {...props} />;
import { UserRole } from '@/api/types';
import { useTranslation } from '@/hooks/useTranslation';

import { FloatingTabBar } from './FloatingTabBar';

const BuyerHomeTabScreen = (props: any) => <BuyerHomeScreen {...props} />;
const PlaceholderScreen = () => null;

export const AppNavigator: React.FC<any> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const activeRole = useAuthStore((s) => s.activeRole);
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const routeRole = route?.params?.role as UserRole | undefined;
  const role: UserRole = routeRole || activeRole || user?.role || 'ARTISAN';

  const bottomInset = Math.max(insets.bottom, 10);
  const tabHeight = 60 + bottomInset;

  const activeTintColor =
    role === 'BUYER' ? '#4338CA' : role === 'ADMIN' ? '#6366F1' : '#EA580C';

  const roleLabel =
    role === 'ARTISAN' ? 'Artisans' :
    role === 'BUYER' ? 'Buyer' :
    role === 'ADMIN' ? 'Command Center' : '';

  const appTitle = roleLabel ? `Kalakar Setu ~ ${roleLabel}` : 'Kalakar Setu';

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = appTitle;
    }
  }, [appTitle]);

  return (
    <Tab.Navigator
      key={`tabs_${role}`}
      initialRouteName="HomeTab"
      tabBar={(props) => (
        <FloatingTabBar
          {...props}
          role={role}
          activeTintColor={activeTintColor}
        />
      )}
      screenOptions={{
        headerShown: false,
        title: appTitle,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      {/* 1. ARTISAN TABS (Studio, Orders, [Create +], Khata, Profile) */}
      {role === 'ARTISAN' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={ArtisanHomeTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: t.nav.studio,
              tabBarIcon: ({ color, focused }) => <TabIcons.Studio focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="OrdersTab"
            component={OrdersTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: t.nav.orders,
              tabBarIcon: ({ color, focused }) => <TabIcons.Orders focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="CreateTab"
            component={PlaceholderScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: t.nav.create,
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                (navigation as any)?.navigate('CameraPermission');
              },
            })}
          />
          <Tab.Screen
            name="KhataTab"
            component={KhataTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: t.nav.khata,
              tabBarIcon: ({ color, focused }) => <TabIcons.Khata focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: t.nav.account,
              tabBarIcon: ({ color, focused }) => <TabIcons.Account color={color} focused={focused} />,
            }}
          />
        </>
      )}

      {/* 2. ADMIN & OPERATIONS TABS (Dashboard, KYC Queue, [Moderation 🛡️], Escrow, Profile) */}
      {role === 'ADMIN' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={AdminDashboardTabScreen}
            options={{
              title: 'Kalakar Setu ~ Command Center',
              tabBarLabel: 'Command',
              tabBarIcon: ({ color, focused }) => <TabIcons.Governance focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="KycTab"
            component={AdminKycTabScreen}
            options={{
              title: 'Kalakar Setu ~ KYC Queue',
              tabBarLabel: 'KYC Queue',
              tabBarIcon: ({ color, focused }) => <TabIcons.KycQueue focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ModerationTab"
            component={AdminModerationTabScreen}
            options={{
              title: 'Kalakar Setu ~ AI Moderation',
              tabBarLabel: 'AI Mod 🛡️',
            }}
          />
          <Tab.Screen
            name="EscrowTab"
            component={AdminEscrowTabScreen}
            options={{
              title: 'Kalakar Setu ~ Escrow Reconciliation',
              tabBarLabel: 'Escrow',
              tabBarIcon: ({ color, focused }) => <TabIcons.Escrow focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Admin Settings',
              tabBarLabel: t.nav.account,
              tabBarIcon: ({ color, focused }) => <TabIcons.Account color={color} focused={focused} />,
            }}
          />
        </>
      )}

      {/* 3. BUYER TABS (Discover, Explore, [Bulk Deals ✨], Cart, Profile) */}
      {role === 'BUYER' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={BuyerHomeTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: t.nav.discover,
              tabBarIcon: ({ color, focused }) => <TabIcons.Home focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ExploreTab"
            component={ExploreTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: t.nav.explore,
              tabBarIcon: ({ color }) => <TabIcons.Explore color={color} />,
            }}
          />
          <Tab.Screen
            name="BulkDealsTab"
            component={BulkDealsTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: t.nav.bulkDeals,
              tabBarIcon: ({ color }) => <TabIcons.BulkDeals color={color} />,
            }}
          />
          <Tab.Screen
            name="CartTab"
            component={CartTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: t.nav.cart,
              tabBarIcon: ({ color }) => <TabIcons.Cart color={color} count={totalCartCount} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: t.nav.account,
              tabBarIcon: ({ color, focused }) => <TabIcons.Account color={color} focused={focused} />,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    position: 'relative',
  },
  tabEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  badgeContainer: {
    position: 'absolute',
    top: -3,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
