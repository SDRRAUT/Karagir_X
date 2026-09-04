import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  rightIconName?: IconName;
  onRightIconPress?: () => void;
  rightActionLabel?: string;
  transparent?: boolean;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightAction,
  rightIconName,
  onRightIconPress,
  rightActionLabel,
  transparent = false,
  style,
}) => {
  const theme = useTheme();
  const navigation = useContext(NavigationContext);

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleRightPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onRightIconPress?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : theme.colors.surface.primary,
          borderBottomColor: theme.colors.border.subtle,
          borderBottomWidth: transparent ? 0 : 0.5,
        },
        style,
      ]}
    >
      <View style={styles.leftArea}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={[
              styles.backButton,
              { backgroundColor: transparent ? 'rgba(255,255,255,0.85)' : theme.colors.surface.card },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Icon name="arrowLeft" size={22} color={theme.colors.text.primary} />
          </Pressable>
        )}
      </View>

      <View style={styles.centerArea}>
        {title ? (
          <Text
            variant="headlineSmall"
            weight="semiBold"
            color={theme.colors.text.primary}
            numberOfLines={1}
            align="center"
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            variant="bodySmall"
            color={theme.colors.text.tertiary}
            numberOfLines={1}
            align="center"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightArea}>
        {rightAction ? (
          rightAction
        ) : rightIconName ? (
          <Pressable
            onPress={handleRightPress}
            style={[
              styles.rightButton,
              { backgroundColor: transparent ? 'rgba(255,255,255,0.85)' : theme.colors.surface.card },
            ]}
            accessibilityRole="button"
            accessibilityLabel={rightActionLabel || 'Header action'}
            hitSlop={8}
          >
            <Icon name={rightIconName} size={20} color={theme.colors.text.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  leftArea: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightArea: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
