import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme/ThemeProvider';
import { MainTabParamList } from './types';
import { HomeScreen } from '@/screens/HomeScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { KhataScreen } from '@/screens/KhataScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { Text } from '@/components/typography/Text';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const AppNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.emerald700,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          height: 72, // 72dp clearance per Design System Section 12.1
          backgroundColor: theme.colors.surface.card,
          borderTopWidth: 1.5,
          borderTopColor: theme.colors.surface.border,
          paddingBottom: 10,
          paddingTop: 8,
          ...theme.shadows.level4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'होम (Home)',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'ऑर्डर (Orders)',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📦</Text>,
        }}
      />
      <Tab.Screen
        name="KhataTab"
        component={KhataScreen}
        options={{
          tabBarLabel: 'खाता (Khata)',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'प्रोफाइल (Profile)',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
