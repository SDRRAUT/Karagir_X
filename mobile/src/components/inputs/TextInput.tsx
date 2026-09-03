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
            height: theme.touch.minTargetSize, // Minimum 56dp height
            backgroundColor: theme.colors.surface.card,
            borderColor: error ? theme.colors.status.danger : theme.colors.surface.border,
            borderRadius: theme.touch.radii.card,
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.bodyLarge,
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
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  errorText: {
    marginTop: 4,
  },
});
