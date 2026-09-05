// Voice Guidance Utility using Web Speech API with native Hindi voice support

class VoiceGuidanceManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking: boolean = false;
  private activeCallback: (() => void) | null = null;

  public speakHindi(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Not supported in this environment
      return false;
    }

    try {
      // If already speaking, cancel previous
      this.stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92; // Slightly measured rate for clear comprehension
      utterance.pitch = 1.0;

      // Select high quality Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('hi') ||
          v.lang.toLowerCase().includes('hindi')
      );
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => {
        this.isCurrentlySpeaking = true;
        onStart?.();
      };

      utterance.onend = () => {
        this.isCurrentlySpeaking = false;
        this.currentUtterance = null;
        this.activeCallback = null;
        onEnd?.();
      };

      utterance.onerror = () => {
        this.isCurrentlySpeaking = false;
        this.currentUtterance = null;
        this.activeCallback = null;
        onEnd?.();
      };

      this.currentUtterance = utterance;
      this.activeCallback = onEnd || null;

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      this.isCurrentlySpeaking = false;
      onEnd?.();
      return false;
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isCurrentlySpeaking = false;
    this.currentUtterance = null;
    if (this.activeCallback) {
      const cb = this.activeCallback;
      this.activeCallback = null;
      cb();
    }
  }

  public get isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

export const voiceGuidance = new VoiceGuidanceManager();
