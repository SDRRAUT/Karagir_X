import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { UserRole } from '@/api/types';
import { useCartStore } from '@/store/useCartStore';

interface FloatingTabBarProps extends BottomTabBarProps {
  role: UserRole;
  activeTintColor: string;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  state,
  descriptors,
  navigation,
  role,
  activeTintColor,
}) => {
  const insets = useSafeAreaInsets();
  const totalCartCount = useCartStore((s) => s.getTotalCount());

  // Bottom clearance based on device insets
  const bottomOffset = Platform.OS === 'ios' ? Math.max(insets.bottom, 16) : 16;

  // Determine middle index for the 5-item layout
  const totalRoutes = state.routes.length;
  const middleIndex = Math.floor(totalRoutes / 2);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.containerWrapper, { bottom: bottomOffset }]}
    >
      {/* 1. Seamless Upward Center Arch Dome */}
      <View style={styles.centerArchContainer} pointerEvents="none">
        <Svg width={88} height={24} viewBox="0 0 88 24" style={styles.centerArchSvg}>
          {/* Smooth organic bell curve arch connecting to pill top */}
          <Path
            d="M 0 24 C 22 24 24 3 44 3 C 64 3 66 24 88 24 Z"
            fill="#FFFFFF"
          />
          {/* Subtle top edge border */}
          <Path
            d="M 0 24 C 22 24 24 3 44 3 C 64 3 66 24 88 24"
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>
      </View>

      {/* 2. Floating Elevated Pill Bar */}
      <View style={styles.floatingBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenterItem = index === middleIndex;

          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              if (route.name === 'OnboardTab') {
                navigation.navigate('MicPermission');
              } else if (!isFocused) {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Center Elevated Circular Action Button
          if (isCenterItem) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.85}
                style={styles.centerTabItem}
              >
                {/* Elevated Circle */}
                <View
                  style={[
                    styles.centerCircleButton,
                    {
                      backgroundColor: route.name === 'SaathiTab' ? '#EA580C' : activeTintColor,
                      shadowColor: route.name === 'SaathiTab' ? '#EA580C' : activeTintColor,
                    },
                  ]}
                >
                  {route.name === 'SaathiTab' ? (
                    <Text style={styles.centerEmojiIcon}>🎙️</Text>
                  ) : route.name === 'CreateTab' ? (
                    <Text style={styles.centerPlusIcon}>+</Text>
                  ) : route.name === 'OnboardTab' ? (
                    <Text style={styles.centerEmojiIcon}>🎙️</Text>
                  ) : route.name === 'BulkDealsTab' ? (
                    <Text style={styles.centerEmojiIcon}>✨</Text>
                  ) : route.name === 'ModerationTab' ? (
                    <Text style={styles.centerEmojiIcon}>🛡️</Text>
                  ) : (
                    <Text style={styles.centerPlusIcon}>+</Text>
                  )}
                </View>

                {/* Micro Label underneath */}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.centerLabelText,
                    {
                      color: isFocused ? activeTintColor : '#64748B',
                      fontWeight: isFocused ? '700' : '600',
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }

          // Standard Tab Item
          const iconColor = isFocused ? activeTintColor : '#94A3B8';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || String(label)}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={styles.standardTabItem}
            >
              <View style={styles.iconContainer}>
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: iconColor,
                    size: 22,
                  })}

                {/* Cart Badge */}
                {route.name === 'CartTab' && totalCartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {totalCartCount > 99 ? '99+' : totalCartCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabelText,
                  {
                    color: iconColor,
                    fontWeight: isFocused ? '700' : '500',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999,
    overflow: 'visible',
  },
  centerArchContainer: {
    position: 'absolute',
    top: -21,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Behind the floating bar and button
  },
  centerArchSvg: {
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      web: {
        filter: 'drop-shadow(0px -2px 3px rgba(0, 0, 0, 0.03))',
      },
      default: {},
    }),
  },
  floatingBar: {
    width: '100%',
    maxWidth: 480,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    zIndex: 10,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0px 10px 24px -4px rgba(0, 0, 0, 0.12), 0px 4px 8px -2px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  standardTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  centerTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginTop: -16,
    zIndex: 20,
    overflow: 'visible',
  },
  centerCircleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    zIndex: 30,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.38,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 6px 12px rgba(79, 70, 229, 0.35)',
      },
    }),
  },
  centerPlusIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 28,
    marginTop: -2,
    textAlign: 'center',
  },
  centerEmojiIcon: {
    fontSize: 20,
  },
  centerLabelText: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabelText: {
    fontSize: 10.5,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
