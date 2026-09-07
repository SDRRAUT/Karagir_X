import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from '@/components/icons/Icon';
import { VoiceInputModal } from '@/components/modals/VoiceInputModal';

export interface SearchInputProps extends TextInputProps {
  onVoicePress?: () => void;
  showVoiceButton?: boolean;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onVoicePress,
  showVoiceButton = true,
  onClear,
  placeholder = 'खोजें / Search craft...',
  containerStyle,
  style,
  ...props
}) => {
  const theme = useTheme();
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);

  const handleMicPress = () => {
    if (onVoicePress) {
      onVoicePress();
    } else {
      setIsVoiceModalVisible(true);
    }
  };

  const handleVoiceApply = (spokenText: string) => {
    onChangeText?.(spokenText);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface.card,
            borderColor: theme.colors.border.default,
            borderRadius: theme.touch.radii.full,
            ...theme.shadows.low,
          },
          containerStyle,
        ]}
      >
        <View style={styles.iconWrapper}>
          <Icon name="search" size={20} color={theme.colors.text.tertiary} />
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.bodyMedium,
              fontFamily: theme.typography.fonts.regular,
            },
            style,
          ]}
          {...props}
        />

        {value && value.length > 0 && (
          <Pressable
            onPress={() => {
              onChangeText?.('');
              onClear?.();
            }}
            style={styles.actionBtn}
            accessibilityLabel="Clear search"
            hitSlop={8}
          >
            <Icon name="close" size={18} color={theme.colors.text.tertiary} />
          </Pressable>
        )}

        {showVoiceButton && (
          <Pressable
            onPress={handleMicPress}
            style={[styles.voiceBtn, { backgroundColor: theme.colors.brand.primaryLight }]}
            accessibilityLabel="Voice search"
            hitSlop={8}
          >
            <Icon name="microphone" size={18} color={theme.colors.brand.primary} />
          </Pressable>
        )}
      </View>

      <VoiceInputModal
        visible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onApplyText={handleVoiceApply}
        title="Voice Search (बोलकर खोजें)"
        context="search"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  iconWrapper: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
  },
  voiceBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
