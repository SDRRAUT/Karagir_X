import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="bodyMedium" weight="medium" color={theme.colors.text.secondary} style={styles.label}>
          {label}
        </Text>
      )}
      <RNTextInput
        placeholderTextColor={theme.colors.text.muted}
        style={[
          styles.input,
          {
            height: theme.touch.minTargetSize,
            backgroundColor: theme.colors.sand[50], // Lavender neumorphic bg
            borderColor: error ? theme.colors.status.danger : theme.colors.sand[200],
            borderRadius: theme.borderRadius['2xl'], // Pill-shaped neumorphic
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.bodyLarge,
            ...theme.shadows.neumorphicInset,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text variant="bodySmall" color={theme.colors.status.danger} style={styles.errorText}>
          {error}
        </Text>
      )}
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
  input: {
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 4,
  },
});
