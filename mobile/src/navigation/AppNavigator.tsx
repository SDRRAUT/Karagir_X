import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { MarketplaceHomeScreen } from '@/screens/marketplace/MarketplaceHomeScreen';
import { CategoriesScreen } from '@/screens/marketplace/CategoriesScreen';
import { OpportunitiesScreen } from '@/screens/linkage/OpportunitiesScreen';
import { CartScreen } from '@/screens/marketplace/CartScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { Text } from '@/components/typography/Text';
import { useCartStore } from '@/store/useCartStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Outline Icons matching reference mockup exactly
const TabIcons = {
  Discover: ({ focused, color }: { focused: boolean; color: string }) => (
    <View style={styles.iconBox}>
      <Text style={[styles.tabEmoji, { color }]}>{focused ? '🏠' : '⌂'}</Text>
    </View>
  ),
  Explore: ({ color }: { color: string }) => (
    <View style={styles.iconBox}>
      <Text style={[styles.tabEmoji, { color }]}>🧭</Text>
    </View>
  ),
  BulkDeals: ({ color }: { color: string }) => (
    <View style={styles.iconBox}>
      <Text style={[styles.tabEmoji, { color }]}>👥</Text>
    </View>
  ),
  Cart: ({ color, count }: { color: string; count: number }) => (
    <View style={styles.iconBox}>
      <Text style={[styles.tabEmoji, { color }]}>🛍️</Text>
      {count > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  ),
  Account: ({ color }: { color: string }) => (
    <View style={styles.iconBox}>
      <Text style={[styles.tabEmoji, { color }]}>👤</Text>
    </View>
  ),
};

// Screen wrappers to cleanly bridge NativeStack and Tab types
const DiscoverTabScreen = (props: any) => <MarketplaceHomeScreen {...props} />;
const ExploreTabScreen = (props: any) => <CategoriesScreen {...props} />;
const BulkDealsTabScreen = (props: any) => <OpportunitiesScreen {...props} />;
const CartTabScreen = (props: any) => <CartScreen {...props} />;
const AccountTabScreen = (props: any) => <ProfileScreen {...props} />;

export const AppNavigator: React.FC = () => {
  const totalCartCount = useCartStore((s) => s.getTotalCount());

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EA580C', // Vibrant burnt terracotta from user mockup
        tabBarInactiveTintColor: '#94A3B8', // Neutral slate gray
        tabBarStyle: {
          height: 64,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          paddingBottom: 6,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Discover Tab (Main Kalakar Setu Marketplace Matching Mockup) */}
      <Tab.Screen
        name="HomeTab"
        component={DiscoverTabScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ focused, color }) => (
            <TabIcons.Discover focused={focused} color={color} />
          ),
        }}
      />

      {/* 2. Explore Tab (Categories & Regional GI Heritage) */}
      <Tab.Screen
        name="ExploreTab"
        component={ExploreTabScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => <TabIcons.Explore color={color} />,
        }}
      />

      {/* 3. Bulk Deals Tab (B2B Cluster RFQs & Wholesale Linkages) */}
      <Tab.Screen
        name="BulkDealsTab"
        component={BulkDealsTabScreen}
        options={{
          tabBarLabel: 'Bulk Deals',
          tabBarIcon: ({ color }) => <TabIcons.BulkDeals color={color} />,
        }}
      />

      {/* 4. Cart Tab (Shopping Cart with live count badge) */}
      <Tab.Screen
        name="CartTab"
        component={CartTabScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <TabIcons.Cart color={color} count={totalCartCount} />,
        }}
      />

      {/* 5. Account Tab (User Profile, Switcher & Settings) */}
      <Tab.Screen
        name="ProfileTab"
        component={AccountTabScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <TabIcons.Account color={color} />,
        }}
      />
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
