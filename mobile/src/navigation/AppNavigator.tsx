import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme/ThemeProvider';
import { MainTabParamList } from './types';
import { HomeScreen } from '@/screens/HomeScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { KhataScreen } from '@/screens/KhataScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { Icon } from '@/components/icons/Icon';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const AppNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 64,
          backgroundColor: theme.colors.surface.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.subtle,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...theme.shadows.medium,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: theme.typography.fonts.medium,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'होम',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Icon
                name={focused ? 'home' : 'homeOutline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'ऑर्डर',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Icon
                name={focused ? 'orders' : 'ordersOutline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="KhataTab"
        component={KhataScreen}
        options={{
          tabBarLabel: 'खाता',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Icon
                name={focused ? 'wallet' : 'walletOutline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'प्रोफ़ाइल',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Icon
                name={focused ? 'profile' : 'profileOutline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeIconWrap: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
