import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
  Platform,
  Text as RNText,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Icon, IconName } from '@/components/icons/Icon';
import {
  speechRecognitionService,
  SpeechLanguage,
} from '@/services/speechRecognitionService';
import { VoiceInputModal } from '@/components/modals/VoiceInputModal';

export interface VoiceTextInputProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  leftIconName?: IconName;
  rightIcon?: React.ReactNode;
  rightIconName?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  enableVoice?: boolean; // default: true
  voiceLanguage?: SpeechLanguage; // default: 'hi-IN'
  onVoiceResult?: (transcript: string) => void;
  appendVoiceText?: boolean; // default: true
}

export const VoiceTextInput: React.FC<VoiceTextInputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  leftIconName,
  rightIcon,
  rightIconName,
  onRightIconPress,
  containerStyle,
  inputContainerStyle,
  enableVoice = true,
  voiceLanguage = 'hi-IN',
  onVoiceResult,
  appendVoiceText = true,
  value,
  onChangeText,
  style,
  onFocus,
  onBlur,
  multiline,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const baseTextRef = useRef<string>('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when listening
  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isListening) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.28,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      anim?.stop();
    };
  }, [isListening, pulseAnim]);

  // Handle Voice Toggle
  const handleToggleVoice = () => {
    if (isListening) {
      // Stop listening
      speechRecognitionService.stopListening();
      setIsListening(false);
      setSpeechNotice(null);
      return;
    }

    // Capture the existing text to append cleanly
    baseTextRef.current = (value || '').trim();
    setSpeechNotice('सुन रहे हैं... बोलिए (Listening...)');

    const started = speechRecognitionService.startListening(
      {
        onStart: () => {
          setIsListening(true);
        },
        onResult: (transcript) => {
          let updated = transcript;
          if (appendVoiceText && baseTextRef.current) {
            updated = `${baseTextRef.current} ${transcript}`;
          }
          onChangeText?.(updated);
          onVoiceResult?.(updated);
        },
        onError: (err) => {
          setIsListening(false);
          setSpeechNotice(`माइक सहायता उपलब्ध नहीं (${err})`);
          // If browser speech fails, open fallback modal
          setTimeout(() => {
            setSpeechNotice(null);
            setShowVoiceModal(true);
          }, 600);
        },
        onEnd: () => {
          setIsListening(false);
          setSpeechNotice(null);
        },
      },
      voiceLanguage
    );

    if (!started) {
      setIsListening(false);
      // Fallback to rich voice modal
      setShowVoiceModal(true);
    }
  };

  const handleModalApply = (spokenText: string) => {
    let updated = spokenText;
    if (appendVoiceText && value && value.trim()) {
      updated = `${value.trim()} ${spokenText}`;
    }
    onChangeText?.(updated);
    onVoiceResult?.(updated);
    setShowVoiceModal(false);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const {
    backgroundColor: styleBg,
    borderColor: styleBorderColor,
    borderWidth: styleBorderWidth,
    borderRadius: styleBorderRadius,
    margin,
    marginVertical,
    marginHorizontal,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    width: styleWidth,
    minWidth: styleMinWidth,
    maxWidth: styleMaxWidth,
    flex: styleFlex,
    ...innerInputStyle
  } = flattenedStyle as any;

  const borderColor = error
    ? theme.colors.status.error
    : isListening
    ? '#E65100'
    : isFocused
    ? theme.colors.brand.primary
    : styleBorderColor || theme.colors.border.default;

  const borderWidth = isListening ? 2 : isFocused || error ? 1.5 : (styleBorderWidth ?? 1);
  const borderRadius = styleBorderRadius ?? theme.touch.radii.md;
  const containerBg = isListening ? '#FFF8E1' : (styleBg || theme.colors.surface.card);

  return (
    <View
      style={[
        styles.container,
        {
          margin,
          marginVertical,
          marginHorizontal,
          marginTop,
          marginBottom: marginBottom ?? 14,
          marginLeft,
          marginRight,
          width: styleWidth,
          minWidth: styleMinWidth,
          maxWidth: styleMaxWidth,
          flex: styleFlex,
        },
        containerStyle,
      ]}
    >
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
            borderRadius,
            backgroundColor: containerBg,
            minHeight: multiline ? 88 : theme.touch.buttonHeight,
            alignItems: multiline ? 'flex-start' : 'center',
          },
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={[styles.leftIconWrapper, multiline && { marginTop: 10 }]}>{leftIcon}</View>
        ) : leftIconName ? (
          <View style={[styles.leftIconWrapper, multiline && { marginTop: 10 }]}>
            <Icon
              name={leftIconName}
              size={20}
              color={isFocused ? theme.colors.brand.primary : theme.colors.text.tertiary}
            />
          </View>
        ) : null}

        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.sizes.bodyLarge,
              fontFamily: theme.typography.fonts.regular,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingTop: multiline ? 10 : 0,
            },
            innerInputStyle,
          ]}
          {...props}
        />

        {/* Action icons row (RightIcon + Voice Mic) */}
        <View style={[styles.rightActionsRow, multiline && { marginTop: 8 }]}>
          {rightIcon ? (
            <TouchableOpacity
              disabled={!onRightIconPress}
              onPress={onRightIconPress}
              style={styles.rightIconWrapper}
            >
              {rightIcon}
            </TouchableOpacity>
          ) : rightIconName ? (
            <TouchableOpacity
              disabled={!onRightIconPress}
              onPress={onRightIconPress}
              style={styles.rightIconWrapper}
            >
              <Icon name={rightIconName} size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          ) : null}

          {/* Voice Input Mic Button */}
          {enableVoice && (
            <TouchableOpacity
              onPress={handleToggleVoice}
              onLongPress={() => setShowVoiceModal(true)}
              accessibilityLabel="Voice input"
              accessibilityHint="Tap to speak in your language"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.voiceMicBtn,
                isListening
                  ? { backgroundColor: '#FFEBEE', borderColor: '#D32F2F', borderWidth: 1 }
                  : { backgroundColor: '#FFF3E0' },
              ]}
            >
              <Animated.View style={{ transform: [{ scale: isListening ? pulseAnim : 1 }] }}>
                <Icon
                  name="microphone"
                  size={18}
                  color={isListening ? '#D32F2F' : '#E65100'}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Real-time Listening Banner / Feedback */}
      {isListening && (
        <View style={styles.listeningNoticeRow}>
          <View style={styles.listeningDot} />
          <RNText style={styles.listeningText}>
            🔴 सुन रहे हैं... बोलिए (Listening...) — टैप करके रोकें
          </RNText>
          <TouchableOpacity onPress={handleToggleVoice} style={styles.stopBtn}>
            <RNText style={styles.stopBtnText}>रोकें (Stop)</RNText>
          </TouchableOpacity>
        </View>
      )}

      {speechNotice && !isListening && (
        <Text variant="bodySmall" color={theme.colors.text.tertiary} style={styles.feedbackText}>
          {speechNotice}
        </Text>
      )}

      {error ? (
        <View style={styles.feedbackRow}>
          <Icon name="alertCircle" size={14} color={theme.colors.status.error} />
          <Text variant="bodySmall" color={theme.colors.status.error} style={styles.feedbackText}>
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text variant="bodySmall" color={theme.colors.text.tertiary} style={styles.feedbackText}>
          {helperText}
        </Text>
      ) : null}

      {/* Fallback & Advanced Voice Input Modal */}
      {showVoiceModal && (
        <VoiceInputModal
          visible={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onApplyText={handleModalApply}
          initialText={value || ''}
          title="बोलकर इनपुट दें (Voice to Text)"
          context="general"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 4,
  },
  leftIconWrapper: {
    marginRight: 8,
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 6,
  },
  rightIconWrapper: {
    padding: 4,
  },
  voiceMicBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
    marginRight: 6,
  },
  listeningText: {
    flex: 1,
    fontSize: 12,
    color: '#BF360C',
    fontWeight: '600',
  },
  stopBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stopBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
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
