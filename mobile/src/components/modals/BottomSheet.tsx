import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}) => {
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.motion.duration.medium,
        easing: theme.motion.easing.decelerate,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible, slideAnim, theme]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: theme.motion.duration.fast,
      easing: theme.motion.easing.accelerate,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface.card,
              borderTopLeftRadius: theme.touch.radii.lg,
              borderTopRightRadius: theme.touch.radii.lg,
              transform: [{ translateY: slideAnim }],
              ...theme.shadows.medium,
            },
            contentStyle,
          ]}
        >
          <TouchableWithoutFeedback>
            <View>
              {/* Drag handle */}
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: theme.colors.border.default },
                  ]}
                />
              </View>

              {title && (
                <View style={styles.header}>
                  <Text
                    variant="headlineSmall"
                    weight="bold"
                    color={theme.colors.text.primary}
                    style={styles.title}
                  >
                    {title}
                  </Text>
                  <Pressable onPress={handleClose} hitSlop={8} style={styles.closeBtn}>
                    <Icon name="close" size={20} color={theme.colors.text.tertiary} />
                  </Pressable>
                </View>
              )}

              <View style={styles.body}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    width: '100%',
    maxHeight: '85%',
    paddingBottom: 28,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
  },
});
