import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Icon, IconName } from '@/components/icons/Icon';

export interface EmptyStateProps {
  icon?: string | React.ReactNode;
  iconName?: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onPressAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconName = 'bagOutline',
  title,
  description,
  actionLabel,
  onPressAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.surface.subtle,
            borderColor: theme.colors.border.subtle,
          },
        ]}
      >
        {React.isValidElement(icon) ? (
          icon
        ) : typeof icon === 'string' && icon.length > 2 ? (
          <Text style={styles.textIcon}>{icon}</Text>
        ) : (
          <Icon
            name={iconName}
            size={40}
            color={theme.colors.brand.primary}
          />
        )}
      </View>

      <Text
        variant="headlineSmall"
        weight="bold"
        color={theme.colors.text.primary}
        style={styles.title}
      >
        {title}
      </Text>

      <Text
        variant="bodyMedium"
        color={theme.colors.text.secondary}
        style={styles.description}
      >
        {description}
      </Text>

      {actionLabel && onPressAction && (
        <Button
          label={actionLabel}
          onPress={onPressAction}
          variant="tonal"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  textIcon: {
    fontSize: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
    lineHeight: 20,
  },
  actionButton: {
    minWidth: 180,
  },
});
