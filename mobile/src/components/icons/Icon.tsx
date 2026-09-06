import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

export type IconName =
  | 'home'
  | 'homeOutline'
  | 'orders'
  | 'ordersOutline'
  | 'wallet'
  | 'walletOutline'
  | 'profile'
  | 'profileOutline'
  | 'shop'
  | 'shopOutline'
  | 'search'
  | 'voice'
  | 'microphone'
  | 'camera'
  | 'heart'
  | 'heartFilled'
  | 'share'
  | 'filter'
  | 'close'
  | 'arrowLeft'
  | 'arrowRight'
  | 'chevronRight'
  | 'chevronDown'
  | 'chevronUp'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'edit'
  | 'refresh'
  | 'check'
  | 'checkCircle'
  | 'alertCircle'
  | 'infoCircle'
  | 'shieldCheck'
  | 'star'
  | 'starFilled'
  | 'clock'
  | 'bag'
  | 'bagOutline'
  | 'cart'
  | 'cartOutline'
  | 'tag'
  | 'truck'
  | 'sparkles'
  | 'speaker'
  | 'eye'
  | 'eyeOff'
  | 'phone'
  | 'mail'
  | 'mailOutline'
  | 'lock'
  | 'lockOutline'
  | 'bell'
  | 'bellOutline'
  | 'zap'
  | 'keypad'
  | 'keyboard'
  | 'palette'
  | 'compass'
  | 'users'
  | 'mapPin'
  | 'briefcase'
  | 'building'
  | 'gift'
  | 'creditCard'
  | 'tool'
  | 'package'
  | 'settings'
  | 'settingsOutline'
  | 'helpCircle';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.text.primary;

  switch (name) {
    // Navigation
    case 'home':
      return <Ionicons name="home" size={size} color={iconColor} style={style} />;
    case 'homeOutline':
      return <Ionicons name="home-outline" size={size} color={iconColor} style={style} />;
    case 'orders':
      return <MaterialCommunityIcons name="clipboard-text" size={size} color={iconColor} style={style} />;
    case 'ordersOutline':
      return <MaterialCommunityIcons name="clipboard-text-outline" size={size} color={iconColor} style={style} />;
    case 'wallet':
      return <Ionicons name="wallet" size={size} color={iconColor} style={style} />;
    case 'walletOutline':
      return <Ionicons name="wallet-outline" size={size} color={iconColor} style={style} />;
    case 'profile':
      return <Ionicons name="person" size={size} color={iconColor} style={style} />;
    case 'profileOutline':
      return <Ionicons name="person-outline" size={size} color={iconColor} style={style} />;
    case 'shop':
      return <Ionicons name="storefront" size={size} color={iconColor} style={style} />;
    case 'shopOutline':
      return <Ionicons name="storefront-outline" size={size} color={iconColor} style={style} />;

    // Actions & Media
    case 'search':
      return <Feather name="search" size={size} color={iconColor} style={style} />;
    case 'voice':
    case 'microphone':
      return <MaterialCommunityIcons name="microphone" size={size} color={iconColor} style={style} />;
    case 'camera':
      return <Feather name="camera" size={size} color={iconColor} style={style} />;
    case 'heart':
      return <Ionicons name="heart-outline" size={size} color={iconColor} style={style} />;
    case 'heartFilled':
      return <Ionicons name="heart" size={size} color={iconColor} style={style} />;
    case 'share':
      return <Feather name="share-2" size={size} color={iconColor} style={style} />;
    case 'filter':
      return <Feather name="sliders" size={size} color={iconColor} style={style} />;
    case 'close':
      return <Feather name="x" size={size} color={iconColor} style={style} />;
    case 'arrowLeft':
      return <Feather name="arrow-left" size={size} color={iconColor} style={style} />;
    case 'arrowRight':
      return <Feather name="arrow-right" size={size} color={iconColor} style={style} />;
    case 'chevronRight':
      return <Feather name="chevron-right" size={size} color={iconColor} style={style} />;
    case 'chevronDown':
      return <Feather name="chevron-down" size={size} color={iconColor} style={style} />;
    case 'chevronUp':
      return <Feather name="chevron-up" size={size} color={iconColor} style={style} />;
    case 'plus':
      return <Feather name="plus" size={size} color={iconColor} style={style} />;
    case 'minus':
      return <Feather name="minus" size={size} color={iconColor} style={style} />;
    case 'trash':
      return <Feather name="trash-2" size={size} color={iconColor} style={style} />;
    case 'edit':
      return <Feather name="edit-2" size={size} color={iconColor} style={style} />;
    case 'refresh':
      return <Feather name="rotate-cw" size={size} color={iconColor} style={style} />;
    case 'speaker':
      return <Feather name="volume-2" size={size} color={iconColor} style={style} />;
    case 'eye':
      return <Feather name="eye" size={size} color={iconColor} style={style} />;
    case 'eyeOff':
      return <Feather name="eye-off" size={size} color={iconColor} style={style} />;
    case 'phone':
      return <Feather name="phone" size={size} color={iconColor} style={style} />;
    case 'mail':
      return <Feather name="mail" size={size} color={iconColor} style={style} />;
    case 'mailOutline':
      return <Ionicons name="mail-outline" size={size} color={iconColor} style={style} />;
    case 'lock':
      return <Feather name="lock" size={size} color={iconColor} style={style} />;
    case 'lockOutline':
      return <Ionicons name="lock-closed-outline" size={size} color={iconColor} style={style} />;
    case 'zap':
      return <Feather name="zap" size={size} color={iconColor} style={style} />;
    case 'keypad':
      return <MaterialCommunityIcons name="dialpad" size={size} color={iconColor} style={style} />;
    case 'keyboard':
      return <MaterialCommunityIcons name="keyboard-outline" size={size} color={iconColor} style={style} />;
    case 'palette':
      return <Ionicons name="color-palette-outline" size={size} color={iconColor} style={style} />;
    case 'compass':
      return <Feather name="compass" size={size} color={iconColor} style={style} />;
    case 'users':
      return <Feather name="users" size={size} color={iconColor} style={style} />;
    case 'mapPin':
      return <Feather name="map-pin" size={size} color={iconColor} style={style} />;
    case 'briefcase':
      return <Feather name="briefcase" size={size} color={iconColor} style={style} />;
    case 'building':
      return <Ionicons name="business-outline" size={size} color={iconColor} style={style} />;
    case 'gift':
      return <Feather name="gift" size={size} color={iconColor} style={style} />;
    case 'creditCard':
      return <Feather name="credit-card" size={size} color={iconColor} style={style} />;
    case 'tool':
      return <Feather name="tool" size={size} color={iconColor} style={style} />;
    case 'package':
      return <Feather name="package" size={size} color={iconColor} style={style} />;

    // Status & Trust
    case 'check':
      return <Feather name="check" size={size} color={iconColor} style={style} />;
    case 'checkCircle':
      return <Ionicons name="checkmark-circle" size={size} color={iconColor} style={style} />;
    case 'alertCircle':
      return <Ionicons name="alert-circle" size={size} color={iconColor} style={style} />;
    case 'infoCircle':
      return <Ionicons name="information-circle" size={size} color={iconColor} style={style} />;
    case 'shieldCheck':
      return <MaterialCommunityIcons name="shield-check" size={size} color={iconColor} style={style} />;
    case 'star':
      return <Ionicons name="star-outline" size={size} color={iconColor} style={style} />;
    case 'starFilled':
      return <Ionicons name="star" size={size} color={iconColor} style={style} />;
    case 'clock':
      return <Feather name="clock" size={size} color={iconColor} style={style} />;
    case 'helpCircle':
      return <Feather name="help-circle" size={size} color={iconColor} style={style} />;
    case 'settings':
      return <Ionicons name="settings" size={size} color={iconColor} style={style} />;
    case 'settingsOutline':
      return <Ionicons name="settings-outline" size={size} color={iconColor} style={style} />;
    case 'bell':
      return <Ionicons name="notifications" size={size} color={iconColor} style={style} />;
    case 'bellOutline':
      return <Ionicons name="notifications-outline" size={size} color={iconColor} style={style} />;

    // Commerce
    case 'bag':
      return <Ionicons name="bag-handle" size={size} color={iconColor} style={style} />;
    case 'bagOutline':
      return <Ionicons name="bag-handle-outline" size={size} color={iconColor} style={style} />;
    case 'cart':
      return <Ionicons name="cart" size={size} color={iconColor} style={style} />;
    case 'cartOutline':
      return <Ionicons name="cart-outline" size={size} color={iconColor} style={style} />;
    case 'tag':
      return <Feather name="tag" size={size} color={iconColor} style={style} />;
    case 'truck':
      return <MaterialCommunityIcons name="truck-delivery-outline" size={size} color={iconColor} style={style} />;
    case 'sparkles':
      return <MaterialCommunityIcons name="creation-outline" size={size} color={iconColor} style={style} />;

    default:
      return <Feather name="circle" size={size} color={iconColor} style={style} />;
  }
};
