import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
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
  /** Type of icon: 'human' for speaking person with soundwaves, or 'audio' for speaker horn */
  iconType?: 'human' | 'audio';
}

const HumanSpeakerSvg: React.FC<{ size: number; color: string; isPlaying: boolean }> = ({
  size,
  color,
  isPlaying,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Human Head */}
    <Path
      d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={isPlaying ? color : 'none'}
    />
    {/* Human Torso / Shoulder */}
    <Path
      d="M2 19C2 15.6863 4.68629 13 8 13C9.4 13 10.6 13.5 11.5 14.3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Human Voice / Speech Waves */}
    <Path
      d="M15 7.5C16.2 8.5 17 10.1 17 12C17 13.9 16.2 15.5 15 16.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M18.5 5C20.3 6.8 21.5 9.2 21.5 12C21.5 14.8 20.3 17.2 18.5 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const AudioSpeakerSvg: React.FC<{ size: number; color: string; isPlaying: boolean }> = ({
  size,
  color,
  isPlaying,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={isPlaying ? color : 'none'}
    />
    <Path
      d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 5C20.9 6.9 22 9.3 22 12C22 14.7 20.9 17.1 19 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const StopSquareSvg: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="6" width="12" height="12" rx="2.5" fill={color} />
  </Svg>
);

export const VoiceCueButton: React.FC<VoiceCueButtonProps> = ({
  textHi,
  label,
  size = 'small',
  testID,
  iconType = 'human',
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
  const iconSize = isSmall ? 15 : 18;
  const iconColor = isPlaying ? '#EA580C' : '#D97706';

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
      <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
        {isPlaying ? (
          <StopSquareSvg size={iconSize} color="#EA580C" />
        ) : iconType === 'human' ? (
          <HumanSpeakerSvg size={iconSize} color={iconColor} isPlaying={isPlaying} />
        ) : (
          <AudioSpeakerSvg size={iconSize} color={iconColor} isPlaying={isPlaying} />
        )}
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
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    gap: 5,
  },
  buttonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  buttonMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
});
