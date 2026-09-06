import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { ArtisanHomeScreen, KhataScreen, OrdersScreen } from '@/screens/artisan';
import { BuyerHomeScreen, CategoriesScreen, CartScreen } from '@/screens/buyer';
import { SahyogiHomeScreen } from '@/screens/sahyogi';
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
const SahyogiHomeTabScreen = (props: any) => <SahyogiHomeScreen {...props} />;
const BuyerHomeTabScreen = (props: any) => <BuyerHomeScreen {...props} />;

export const AppNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const totalCartCount = useCartStore((s) => s.getTotalCount());
  const role = useAuthStore((s) => s.user?.role) || 'ARTISAN';

  const bottomInset = Math.max(insets.bottom, 10);
  const tabHeight = 60 + bottomInset;

  const activeTintColor =
    role === 'BUYER' ? '#4338CA' : role === 'FACILITATOR' ? '#16A34A' : '#EA580C';

  const roleLabel =
    role === 'ARTISAN' ? 'Artisans' :
    role === 'BUYER' ? 'Buyer' :
    role === 'FACILITATOR' ? 'Sahyogi' : '';

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
      screenOptions={{
        headerShown: false,
        title: appTitle,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: tabHeight,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          paddingBottom: bottomInset,
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
      }}
    >
      {/* 1. ARTISAN TABS (Studio, Orders, Khata, Profile) */}
      {role === 'ARTISAN' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={ArtisanHomeTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: 'Studio',
              tabBarIcon: ({ color, focused }) => <TabIcons.Studio focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="OrdersTab"
            component={OrdersTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: 'Orders',
              tabBarIcon: ({ color, focused }) => <TabIcons.Orders focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="KhataTab"
            component={KhataTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: 'Khata',
              tabBarIcon: ({ color, focused }) => <TabIcons.Khata focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Artisans',
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, focused }) => <TabIcons.Account color={color} focused={focused} />,
            }}
          />
        </>
      )}

      {/* 2. FACILITATOR / SAHYOGI TABS (Desk, B2B Deals, Fulfillment, Profile) */}
      {role === 'FACILITATOR' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={SahyogiHomeTabScreen}
            options={{
              title: 'Kalakar Setu ~ Sahyogi',
              tabBarLabel: 'Sahyogi Desk',
              tabBarIcon: ({ color, focused }) => <TabIcons.Home focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="BulkDealsTab"
            component={BulkDealsTabScreen}
            options={{
              title: 'Kalakar Setu ~ Sahyogi',
              tabBarLabel: 'B2B Deals',
              tabBarIcon: ({ color }) => <TabIcons.BulkDeals color={color} />,
            }}
          />
          <Tab.Screen
            name="OrdersTab"
            component={OrdersTabScreen}
            options={{
              title: 'Kalakar Setu ~ Sahyogi',
              tabBarLabel: 'Fulfillment',
              tabBarIcon: ({ color, focused }) => <TabIcons.Orders focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Sahyogi',
              tabBarLabel: 'Account',
              tabBarIcon: ({ color, focused }) => <TabIcons.Account color={color} focused={focused} />,
            }}
          />
        </>
      )}

      {/* 3. BUYER TABS (Discover, Explore, Bulk Deals, Cart, Profile) */}
      {role === 'BUYER' && (
        <>
          <Tab.Screen
            name="HomeTab"
            component={BuyerHomeTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: 'Discover',
              tabBarIcon: ({ color, focused }) => <TabIcons.Home focused={focused} color={color} />,
            }}
          />
          <Tab.Screen
            name="ExploreTab"
            component={ExploreTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: 'Explore',
              tabBarIcon: ({ color }) => <TabIcons.Explore color={color} />,
            }}
          />
          <Tab.Screen
            name="BulkDealsTab"
            component={BulkDealsTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: 'Bulk Deals',
              tabBarIcon: ({ color }) => <TabIcons.BulkDeals color={color} />,
            }}
          />
          <Tab.Screen
            name="CartTab"
            component={CartTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: 'Cart',
              tabBarIcon: ({ color }) => <TabIcons.Cart color={color} count={totalCartCount} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={AccountTabScreen}
            options={{
              title: 'Kalakar Setu ~ Buyer',
              tabBarLabel: 'Account',
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
