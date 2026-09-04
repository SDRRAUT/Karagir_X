import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

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
  showBack = false,
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
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}

        {displayEmblem ? (
          <View style={styles.brandRow}>
            <View
              style={[
                styles.brandLogo,
                {
                  backgroundColor: theme.colors.brand.primary,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Text weight="bold" color={theme.colors.text.inverse} style={styles.brandLetter}>
                क
              </Text>
            </View>
            <View style={styles.titleCol}>
              <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
                {title}
              </Text>
              <Text variant="bodySmall" weight="medium" color={theme.colors.brand.primary}>
                {subtitle || 'कलाकार सेतु'}
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
          style={[styles.voiceBtn, { backgroundColor: 'rgba(232, 93, 42, 0.12)' }]}
          onPress={onVoicePress}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 18 }}>🎙️</Text>
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
