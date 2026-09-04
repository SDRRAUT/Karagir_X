import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  iconName?: IconName;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outlined';
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  iconName,
  icon,
  variant = 'outlined',
  style,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onPress();
  };

  const isSelectedFilled = selected && variant === 'filled';
  const isSelectedOutlined = selected && variant === 'outlined';

  let backgroundColor: string = theme.colors.surface.card;
  let borderColor: string = theme.colors.border.default;
  let textColor: string = theme.colors.text.secondary;
  let iconColor: string = theme.colors.text.secondary;

  if (isSelectedFilled) {
    backgroundColor = theme.colors.brand.primary;
    borderColor = theme.colors.brand.primary;
    textColor = theme.colors.text.inverse;
    iconColor = theme.colors.text.inverse;
  } else if (isSelectedOutlined) {
    backgroundColor = theme.colors.brand.primaryLight;
    borderColor = theme.colors.brand.primary;
    textColor = theme.colors.brand.primary;
    iconColor = theme.colors.brand.primary;
  }

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.chip,
        {
          backgroundColor,
          borderColor,
          borderRadius: theme.touch.radii.full,
          minHeight: 38,
        },
        style,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      hitSlop={4}
    >
      {icon ? (
        <View style={styles.iconWrapper}>{icon}</View>
      ) : iconName ? (
        <View style={styles.iconWrapper}>
          <Icon name={iconName} size={16} color={iconColor} />
        </View>
      ) : null}

      <Text
        variant="labelMedium"
        weight={selected ? 'semiBold' : 'regular'}
        color={textColor}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  iconWrapper: {
    marginRight: 6,
  },
});
