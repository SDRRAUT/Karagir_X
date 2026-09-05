import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { voiceGuidance } from '@/utils/voiceGuidance';

interface VoiceCueButtonProps {
  /** The Hindi voice guidance prompt to speak */
  textHi: string;
  /** Optional label shown beside the speaker icon */
  label?: string;
  /** Button sizing variant */
  size?: 'small' | 'medium';
  /** Accessible test ID */
  testID?: string;
}

export const VoiceCueButton: React.FC<VoiceCueButtonProps> = ({
  textHi,
  label,
  size = 'small',
  testID,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying, pulseAnim]);

  const handlePress = () => {
    if (isPlaying) {
      voiceGuidance.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      voiceGuidance.speakHindi(
        textHi,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      testID={testID || 'voice-cue-button'}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.buttonBase,
        isSmall ? styles.buttonSmall : styles.buttonMedium,
        isPlaying && styles.buttonActive,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Listen to Hindi guidance: ${textHi}`}
      accessibilityState={{ busy: isPlaying }}
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Text style={[styles.speakerEmoji, isSmall && styles.speakerEmojiSmall]}>
          {isPlaying ? '🛑' : '🔊'}
        </Text>
      </Animated.View>
      {label && (
        <Text
          variant="caption"
          weight={isPlaying ? 'bold' : 'medium'}
          color={isPlaying ? '#EA580C' : '#64748B'}
          style={styles.labelText}
        >
          {isPlaying ? 'Speaking...' : label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
  },
  buttonSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  buttonMedium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  buttonActive: {
    backgroundColor: '#FFEDD5',
    borderColor: '#EA580C',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  speakerEmoji: {
    fontSize: 14,
  },
  speakerEmojiSmall: {
    fontSize: 12,
  },
  labelText: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
