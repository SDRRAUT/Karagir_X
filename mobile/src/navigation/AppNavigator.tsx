import React from 'react';
import { View, StyleSheet } from 'react-native';
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
        tabBarActiveTintColor: theme.colors.brand.primary, // Purple #6C63FF
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          height: 70,
          backgroundColor: theme.colors.surface.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.sand[200],
          paddingBottom: 8,
          paddingTop: 8,
          ...theme.shadows.level4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'होम (Home)',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={{ fontSize: 20 }}>🏠</Text>
              {focused && <View style={[styles.activeDot, { backgroundColor: theme.colors.brand.primary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'ऑर्डर (Orders)',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={{ fontSize: 20 }}>📦</Text>
              {focused && <View style={[styles.activeDot, { backgroundColor: theme.colors.brand.primary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="KhataTab"
        component={KhataScreen}
        options={{
          tabBarLabel: 'खाता (Khata)',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={{ fontSize: 20 }}>💰</Text>
              {focused && <View style={[styles.activeDot, { backgroundColor: theme.colors.brand.primary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'प्रोफाइल (Profile)',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Text style={{ fontSize: 20 }}>👤</Text>
              {focused && <View style={[styles.activeDot, { backgroundColor: theme.colors.brand.primary }]} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
