import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';

export interface GITagBadgeProps {
  tagTitle?: string;
  isCompact?: boolean;
  style?: ViewStyle;
}

export const GITagBadge: React.FC<GITagBadgeProps> = ({
  tagTitle = 'GI TAGGED HERITAGE',
  isCompact = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.brand.accentLight,
          borderColor: 'rgba(212, 165, 54, 0.4)',
          borderRadius: theme.touch.radii.full,
          paddingHorizontal: isCompact ? 6 : 10,
          paddingVertical: isCompact ? 2 : 4,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel="Geographical Indication Heritage Certified"
    >
      <View style={styles.iconWrap}>
        <Icon name="shieldCheck" size={isCompact ? 12 : 14} color="#7A5B0B" />
      </View>
      <Text
        variant="labelMedium"
        weight="semiBold"
        color="#7A5B0B"
        numberOfLines={1}
        style={{ fontSize: isCompact ? 10 : 11, lineHeight: isCompact ? 13 : 15 }}
      >
        {tagTitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconWrap: {
    marginRight: 4,
  },
});
