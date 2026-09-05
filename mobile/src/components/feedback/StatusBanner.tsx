import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';
import { Button } from '@/components/buttons/Button';

export type BannerType = 'offline' | 'warning' | 'error' | 'success' | 'info';

export interface StatusBannerProps {
  message: string;
  type?: BannerType;
  iconName?: IconName;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  message,
  type = 'offline',
  iconName,
  onRetry,
  style,
}) => {
  const theme = useTheme();

  let backgroundColor: string = theme.colors.surface.subtle;
  let textColor: string = theme.colors.text.primary;
  let defaultIcon: IconName = 'infoCircle';

  switch (type) {
    case 'warning':
      backgroundColor = theme.colors.status.warningLight;
      textColor = theme.colors.status.warning;
      defaultIcon = 'alertCircle';
      break;
    case 'error':
      backgroundColor = theme.colors.status.errorLight;
      textColor = theme.colors.status.error;
      defaultIcon = 'alertCircle';
      break;
    case 'success':
      backgroundColor = theme.colors.brand.secondaryLight;
      textColor = theme.colors.brand.secondary;
      defaultIcon = 'checkCircle';
      break;
    case 'offline':
      backgroundColor = theme.colors.surface.subtle;
      textColor = theme.colors.text.secondary;
      defaultIcon = 'infoCircle';
      break;
    case 'info':
      backgroundColor = theme.colors.status.infoLight;
      textColor = theme.colors.status.info;
      defaultIcon = 'infoCircle';
      break;
  }

  return (
    <View style={[styles.banner, { backgroundColor }, style]}>
      <View style={styles.iconWrap}>
        <Icon name={iconName || defaultIcon} size={16} color={textColor} />
      </View>
      <Text
        variant="bodySmall"
        weight="medium"
        color={textColor}
        style={styles.text}
      >
        {message}
      </Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.retryBtn} hitSlop={6}>
          <Text variant="labelMedium" weight="bold" color={textColor}>
            फिर कोशिश करें (Retry)
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export const ErrorScreen: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}> = ({
  title = 'कुछ गलत हो गया (Something went wrong)',
  message = 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।',
  onRetry,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.errorScreen,
        { backgroundColor: theme.colors.surface.primary },
        style,
      ]}
    >
      <View
        style={[
          styles.errorIconWrap,
          { backgroundColor: theme.colors.status.errorLight },
        ]}
      >
        <Icon name="alertCircle" size={48} color={theme.colors.status.error} />
      </View>

      <Text
        variant="headlineSmall"
        weight="bold"
        color={theme.colors.text.primary}
        style={styles.errorTitle}
      >
        {title}
      </Text>

      <Text
        variant="bodyMedium"
        color={theme.colors.text.secondary}
        style={styles.errorDescription}
      >
        {message}
      </Text>

      {onRetry && (
        <Button
          label="फिर कोशिश करें (Retry)"
          variant="filled"
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
  },
  iconWrap: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    lineHeight: 18,
  },
  retryBtn: {
    marginLeft: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDescription: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
    lineHeight: 22,
  },
  retryButton: {
    minWidth: 200,
  },
});
