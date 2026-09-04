import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Icon } from '@/components/icons/Icon';

export interface SuccessScreenProps {
  title: string;
  subtitle?: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  subtitle,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  children,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary },
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Animated Checkmark Circle */}
        <View
          style={[
            styles.checkCircle,
            {
              backgroundColor: theme.colors.brand.secondaryLight,
              borderColor: theme.colors.brand.secondary,
            },
          ]}
        >
          <Icon name="check" size={44} color={theme.colors.brand.secondary} />
        </View>

        <Text
          variant="headlineMedium"
          weight="bold"
          color={theme.colors.text.primary}
          style={styles.title}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            variant="bodyLarge"
            color={theme.colors.text.secondary}
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}

        {children && <View style={styles.childrenArea}>{children}</View>}
      </View>

      <View style={styles.actions}>
        <Button
          label={primaryActionLabel}
          variant="filled"
          onPress={onPrimaryAction}
          style={styles.btn}
        />
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            label={secondaryActionLabel}
            variant="ghost"
            onPress={onSecondaryAction}
            style={[styles.btn, styles.secondaryBtn]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  childrenArea: {
    width: '100%',
    marginTop: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  btn: {
    width: '100%',
  },
  secondaryBtn: {
    marginTop: -4,
  },
});
