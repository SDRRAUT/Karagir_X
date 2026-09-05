import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Icon } from '@/components/icons/Icon';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionLoading?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  actionLayout?: 'row' | 'column';
  children?: React.ReactNode;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionLoading = false,
  secondaryActionLabel,
  onSecondaryAction,
  actionLayout = 'column',
  children,
  contentStyle,
}) => {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close backdrop" />
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surface.elevated,
              borderRadius: theme.touch.radii.lg,
              ...theme.shadows.medium,
            },
            contentStyle,
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            {title ? (
              <Text
                variant="headlineSmall"
                weight="bold"
                color={theme.colors.text.primary}
                style={styles.title}
              >
                {title}
              </Text>
            ) : <View style={{ flex: 1 }} />}
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
              accessibilityLabel="Close dialog"
            >
              <Icon name="close" size={20} color={theme.colors.text.tertiary} />
            </Pressable>
          </View>

          {description ? (
            <Text
              variant="bodyMedium"
              color={theme.colors.text.secondary}
              style={styles.description}
            >
              {description}
            </Text>
          ) : null}

          {children}

          {/* Actions */}
          {(primaryActionLabel || secondaryActionLabel) && (
            <View style={actionLayout === 'row' ? styles.actionsRow : styles.actionsColumn}>
              {primaryActionLabel && onPrimaryAction && (
                <Button
                  label={primaryActionLabel}
                  variant="filled"
                  isLoading={primaryActionLoading}
                  onPress={onPrimaryAction}
                  style={actionLayout === 'row' ? styles.actionBtnFlex : styles.actionBtnFull}
                />
              )}
              {secondaryActionLabel && (
                <Button
                  label={secondaryActionLabel}
                  variant="ghost"
                  onPress={onSecondaryAction || onClose}
                  style={actionLayout === 'row' ? styles.actionBtnFlex : styles.actionBtnFull}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  actionBtnFlex: {
    flex: 1,
  },
  actionBtnFull: {
    width: '100%',
  },
});
