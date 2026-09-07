// Voice Guidance Utility powered by Device Neural Voice Engine (Microsoft Swara/Madhur Natural + Google Natural)
import { realisticVoiceService } from '@/services/realisticVoiceService';

class VoiceGuidanceManager {
  public speakHindi(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    return realisticVoiceService.speak(text, {
      lang: 'hi-IN',
      gender: 'female',
      rate: 0.94,
      pitch: 1.02,
      preferOnlineStream: false,
      onStart,
      onEnd,
      onError: () => onEnd?.(),
    });
  }

  public speak(
    text: string,
    lang: string = 'hi-IN',
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    return realisticVoiceService.speak(text, {
      lang,
      gender: 'female',
      rate: 0.94,
      pitch: 1.02,
      preferOnlineStream: false,
      onStart,
      onEnd,
      onError: () => onEnd?.(),
    });
  }

  public stopSpeaking(): void {
    realisticVoiceService.stop();
  }

  public get isSpeaking(): boolean {
    return realisticVoiceService.isSpeaking();
  }
}

export const voiceGuidance = new VoiceGuidanceManager();

