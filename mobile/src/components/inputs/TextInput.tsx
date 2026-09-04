import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  leftIconName?: IconName;
  rightIcon?: React.ReactNode;
  rightIconName?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  leftIconName,
  rightIcon,
  rightIconName,
  onRightIconPress,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? theme.colors.status.error
    : isFocused
    ? theme.colors.brand.primary
    : theme.colors.border.default;

  const borderWidth = isFocused || error ? 1.5 : 1;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="labelLarge"
          weight="medium"
          color={error ? theme.colors.status.error : theme.colors.text.secondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            borderWidth,
            borderRadius: theme.touch.radii.md,
            backgroundColor: theme.colors.surface.card,
            height: theme.touch.buttonHeight,
          },
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIconWrapper}>{leftIcon}</View>
        ) : leftIconName ? (
          <View style={styles.leftIconWrapper}>
            <Icon
              name={leftIconName}
              size={20}
              color={isFocused ? theme.colors.brand.primary : theme.colors.text.tertiary}
            />
          </View>
        ) : null}

        <RNTextInput
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.bodyLarge,
              fontFamily: theme.typography.fonts.regular,
            },
            style,
          ]}
          {...props}
        />

        {rightIcon ? (
          <Pressable
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.rightIconWrapper}
          >
            {rightIcon}
          </Pressable>
        ) : rightIconName ? (
          <Pressable
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.rightIconWrapper}
          >
            <Icon
              name={rightIconName}
              size={20}
              color={theme.colors.text.tertiary}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.feedbackRow}>
          <Icon name="alertCircle" size={14} color={theme.colors.status.error} />
          <Text
            variant="bodySmall"
            color={theme.colors.status.error}
            style={styles.feedbackText}
          >
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text
          variant="bodySmall"
          color={theme.colors.text.tertiary}
          style={styles.feedbackText}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  leftIconWrapper: {
    marginRight: 8,
  },
  rightIconWrapper: {
    marginLeft: 8,
    padding: 4,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  feedbackText: {
    marginTop: 4,
  },
});
