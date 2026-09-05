import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  style,
}) => {
  const theme = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: borderRadius ?? theme.touch.radii.sm,
          backgroundColor: theme.colors.surface.subtle,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.productCardSkeleton,
        {
          backgroundColor: theme.colors.surface.card,
          borderRadius: theme.touch.radii.lg,
          ...theme.shadows.low,
        },
        style,
      ]}
    >
      <Skeleton width="100%" height={180} borderRadius={theme.touch.radii.lg} />
      <View style={styles.cardContent}>
        <Skeleton width="60%" height={12} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={16} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={18} />
      </View>
    </View>
  );
};

export const ListItemSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.listItemSkeleton,
        {
          backgroundColor: theme.colors.surface.card,
          borderRadius: theme.touch.radii.md,
          borderColor: theme.colors.border.subtle,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <Skeleton width={52} height={52} borderRadius={theme.touch.radii.md} />
      <View style={styles.listContent}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  productCardSkeleton: {
    overflow: 'hidden',
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
});
