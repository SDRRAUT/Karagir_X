import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';

export interface TactileKeypadProps {
  onPressDigit: (digit: string) => void;
  onPressBackspace: () => void;
  onPressConfirm?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface KeyConfig {
  key: string;
  labelEn: string;
  labelHi: string;
  isAction?: boolean;
}

const KEYS: KeyConfig[][] = [
  [
    { key: '1', labelEn: '1', labelHi: 'एक' },
    { key: '2', labelEn: '2', labelHi: 'दो' },
    { key: '3', labelEn: '3', labelHi: 'तीन' },
  ],
  [
    { key: '4', labelEn: '4', labelHi: 'चार' },
    { key: '5', labelEn: '5', labelHi: 'पांच' },
    { key: '6', labelEn: '6', labelHi: 'छह' },
  ],
  [
    { key: '7', labelEn: '7', labelHi: 'सात' },
    { key: '8', labelEn: '8', labelHi: 'आठ' },
    { key: '9', labelEn: '9', labelHi: 'नौ' },
  ],
  [
    { key: 'BACKSPACE', labelEn: '⌫', labelHi: 'हटाएं', isAction: true },
    { key: '0', labelEn: '0', labelHi: 'शून्य' },
    { key: 'CONFIRM', labelEn: '✓', labelHi: 'हो गया', isAction: true },
  ],
];

export const TactileKeypad: React.FC<TactileKeypadProps> = ({
  onPressDigit,
  onPressBackspace,
  onPressConfirm,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const handlePress = (keyConfig: KeyConfig) => {
    if (disabled) return;

    if (keyConfig.key === 'BACKSPACE') {
      onPressBackspace();
    } else if (keyConfig.key === 'CONFIRM') {
      onPressConfirm?.();
    } else {
      onPressDigit(keyConfig.key);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {KEYS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((item) => {
            const isConfirm = item.key === 'CONFIRM';
            const isBackspace = item.key === 'BACKSPACE';

            let bgColor: string = theme.colors.surface.card;
            let textColor: string = theme.colors.text.primary;

            if (isConfirm) {
              bgColor = theme.colors.primary.emerald700;
              textColor = theme.colors.text.inverse;
            } else if (isBackspace) {
              bgColor = theme.colors.surface.subtle;
            }

            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                disabled={disabled}
                onPress={() => handlePress(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.labelEn}, ${item.labelHi}`}
                style={[
                  styles.key,
                  {
                    backgroundColor: bgColor,
                    borderColor: theme.colors.surface.border,
                    borderRadius: theme.touch.radii.md,
                    ...theme.shadows.level1,
                  },
                ]}
              >
                <Text
                  variant="headlineLarge"
                  weight="bold"
                  color={textColor}
                  style={styles.keyText}
                >
                  {item.labelEn}
                </Text>
                <Text
                  variant="bodySmall"
                  color={isConfirm ? theme.colors.text.inverse : theme.colors.text.secondary}
                  style={styles.subText}
                >
                  {item.labelHi}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  key: {
    flex: 1,
    height: 64, // 64dp key height per Design System spec
    minHeight: 56, // >=56dp touch boundary
    marginHorizontal: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 24,
    lineHeight: 28,
  },
  subText: {
    fontSize: 11,
    lineHeight: 14,
  },
});
