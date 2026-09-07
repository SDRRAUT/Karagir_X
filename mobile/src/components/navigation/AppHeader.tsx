import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showBrand?: boolean;
  showDevanagariLogo?: boolean;
  rightAction?: React.ReactNode;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  onBackPress?: () => void;
  onVoicePress?: () => void;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Kalakar Setu',
  subtitle,
  showBack = true,
  showBrand = true,
  showDevanagariLogo,
  rightAction,
  rightElement,
  onBack,
  onBackPress,
  onVoicePress,
  style,
}) => {
  const theme = useTheme();
  let navigation: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigation = useNavigation();
  } catch (_err) {
    navigation = null;
  }
  const rightContent = rightAction || rightElement;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      try {
        navigation?.navigate('HomeTab');
      } catch {
        try {
          navigation?.navigate('MainTabs', { screen: 'HomeTab' });
        } catch {}
      }
    }
  };

  const displayEmblem = showDevanagariLogo !== undefined ? showDevanagariLogo : showBrand;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.sand[50],
          borderBottomColor: theme.colors.sand[200],
        },
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={[
              styles.backButton,
              {
                backgroundColor: theme.colors.surface.card,
                borderColor: theme.colors.sand[200],
                ...theme.shadows.level1,
              },
            ]}
          >
            <Icon name="arrowLeft" size={20} color={theme.colors.charcoal[900]} />
          </TouchableOpacity>
        )}

        {displayEmblem ? (
          <View style={styles.brandRow}>
            <Image
              source={require('../../../assets/kalakar_setu_logo.png')}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
            <View style={styles.titleCol}>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
                {title}
              </Text>
              <Text variant="bodySmall" weight="medium" color={theme.colors.brand.primary}>
                {subtitle || 'Craft • Connect • Grow'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.titleCol}>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
              {title}
            </Text>
            {subtitle && (
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      {rightContent ? (
        <View style={styles.rightContainer}>{rightContent}</View>
      ) : onVoicePress ? (
        <TouchableOpacity
          style={[styles.voiceBtn, { backgroundColor: 'rgba(108, 99, 255, 0.12)' }]}
          onPress={onVoicePress}
          activeOpacity={0.8}
        >
          <Icon name="microphone" size={18} color="#6366F1" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  voiceBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoImage: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginRight: 10,
  },
  brandLogo: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandLetter: {
    fontSize: 18,
    lineHeight: 22,
  },
  titleCol: {
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
