/**
 * Realistic Device Neural Voice Engine
 *
 * Implements high-fidelity offline text-to-speech with prioritized selection
 * for Neural & Natural voices:
 *  - Microsoft Swara Online (Natural) / Microsoft Madhur Online (Natural) [Hindi]
 *  - Microsoft Aarohi / Manohar Online (Natural) [Marathi]
 *  - Microsoft Neerja / Prabhat Online (Natural) [Indian English]
 *  - Google हिन्दी / Google Marathi / Google Indian English
 *  - Apple iOS Lekha / Rishi / Veena
 *
 * Explicitly blacklists and penalizes legacy robotic synthesizers (Microsoft Ravi, eSpeak)
 * so speech sounds human, warm, and natural with realistic conversational cadence.
 */

import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

export interface RealisticVoiceOptions {
  lang?: string; // 'hi-IN', 'mr-IN', 'en-IN'
  gender?: 'female' | 'male';
  rate?: number; // 0.92 - 0.96 for natural human conversational speed
  pitch?: number; // 1.02 - 1.04 for warm non-monotone cadence
  volume?: number;
  preferOnlineStream?: boolean; // When true and online, can use Google Neural Audio stream
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export interface VoiceInfo {
  name: string;
  lang: string;
  isNeural: boolean;
  score: number;
}

class RealisticVoiceEngine {
  private currentUtterance: any = null;
  private currentAudioElement: any = null;
  private isSpeakingState: boolean = false;
  private keepAliveInterval: any = null;
  private cachedVoices: any[] = [];
  private activeEndCallback: (() => void) | null = null;

  constructor() {
    this.initVoices();
  }

  /**
   * Initializes browser voices and binds to async voiceschanged event
   */
  private initVoices(): void {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.cachedVoices = window.speechSynthesis.getVoices() || [];
        if ('onvoiceschanged' in window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => {
            this.cachedVoices = window.speechSynthesis.getVoices() || [];
          };
        }
      } catch (e) {
        logger.warn('REALISTIC_VOICE', 'Failed to prefetch voices', e);
      }
    }
  }

  /**
   * Get all currently available voices on the device
   */
  public getAvailableVoices(): any[] {
    if (this.cachedVoices.length > 0) return this.cachedVoices;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices() || [];
      return this.cachedVoices;
    }
    return [];
  }

  /**
   * Evaluates and scores an OS voice.
   * Gives top marks to Neural/Natural voices (Swara, Madhur, Google Hindi)
   * and heavily penalizes robotic legacy voices (Ravi, eSpeak).
   */
  public scoreVoice(
    voice: any,
    targetLang: string,
    preferredGender: 'female' | 'male' = 'female'
  ): number {
    if (!voice) return -999;

    const name = (voice.name || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
    const target = targetLang.toLowerCase().replace(/_/g, '-');
    const targetPrefix = target.split('-')[0];

    let score = 0;

    // 1. Language matching
    if (lang === target) {
      score += 60;
    } else if (lang.startsWith(targetPrefix)) {
      score += 40;
    } else if (targetPrefix === 'hi' && (name.includes('hindi') || lang.includes('hi'))) {
      score += 45;
    } else if (targetPrefix === 'mr' && (name.includes('marathi') || lang.includes('mr'))) {
      score += 45;
    } else if (targetPrefix === 'en' && (lang.includes('en-in') || name.includes('india'))) {
      score += 35;
    } else if (targetPrefix === 'en' && lang.startsWith('en')) {
      score += 20;
    } else {
      return -500; // Incompatible language
    }

    // 2. Neural / Natural Quality Boost
    if (name.includes('natural')) score += 120;
    if (name.includes('neural')) score += 110;
    if (name.includes('online')) score += 60;

    // 3. Indian Specific Top-tier Voice Boosts
    // Microsoft Swara (Ultra-realistic, soft Hindi female)
    if (name.includes('swara')) {
      score += preferredGender === 'female' ? 100 : 70;
    }
    // Microsoft Madhur (Warm, natural Hindi male)
    if (name.includes('madhur')) {
      score += preferredGender === 'male' ? 100 : 70;
    }
    // Microsoft Aarohi / Manohar (Marathi Natural)
    if (name.includes('aarohi') || name.includes('manohar')) {
      score += 90;
    }
    // Microsoft Neerja / Prabhat (Indian English Natural)
    if (name.includes('neerja') || name.includes('prabhat')) {
      score += 85;
    }
    // Google Natural Voices (Google हिन्दी, Google Indian English)
    if (name.includes('google')) {
      score += 75;
    }
    // Apple iOS/macOS Natural Voices (Lekha, Rishi, Veena)
    if (name.includes('lekha') || name.includes('rishi') || name.includes('veena')) {
      score += 70;
    }

    // 4. Blacklist / Penalty for robotic voices
    if (name.includes('ravi')) score -= 300;
    if (name.includes('hemant')) score -= 250;
    if (name.includes('kalpana')) score -= 250;
    if (name.includes('espeak')) score -= 400;
    if (name.includes('desktop synthesizer')) score -= 350;
    if (name.includes('david') || name.includes('zira') || name.includes('mark')) score -= 200;

    return score;
  }

  /**
   * Finds the best neural voice available on the device for the target language
   */
  public findBestVoice(
    targetLang: string = 'hi-IN',
    preferredGender: 'female' | 'male' = 'female'
  ): any | null {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    let bestVoice: any = null;
    let highestScore = -999;

    for (const v of voices) {
      const score = this.scoreVoice(v, targetLang, preferredGender);
      if (score > highestScore) {
        highestScore = score;
        bestVoice = v;
      }
    }

    return bestVoice;
  }

  /**
   * Cleans text for natural human speech (strips markdown, emojis, converts currency)
   */
  public cleanTextForSpeech(text: string, lang: string = 'hi-IN'): string {
    if (!text) return '';
    const isIndic = lang.startsWith('hi') || lang.startsWith('mr');

    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`#>•-]/g, ' ')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .replace(/₹\s*(\d+)/g, (_, amt) => (isIndic ? `${amt} रुपये` : `${amt} rupees`))
      .replace(/₹/g, isIndic ? ' रुपये ' : ' rupees ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Stops any currently playing speech (synthesis or audio stream)
   */
  public stop(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {}
      this.currentAudioElement = null;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    this.isSpeakingState = false;
    this.currentUtterance = null;
    if (this.activeEndCallback) {
      const cb = this.activeEndCallback;
      this.activeEndCallback = null;
      cb();
    }
  }

  /**
   * Speaks text using the Device Neural Voice Engine (Swara/Madhur/Google Natural)
   */
  public speak(text: string, options: RealisticVoiceOptions = {}): boolean {
    const {
      lang = 'hi-IN',
      gender = 'female',
      rate = 0.94, // Human conversational cadence
      pitch = 1.02, // Warm, natural non-monotone pitch
      volume = 1.0,
      preferOnlineStream = false,
      onStart,
      onEnd,
      onError,
    } = options;

    this.stop();

    const cleanedText = this.cleanTextForSpeech(text, lang);
    if (!cleanedText) {
      onEnd?.();
      return false;
    }

    // Optional: High-definition online neural stream when requested and online
    if (
      preferOnlineStream &&
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      navigator.onLine &&
      cleanedText.length < 180 &&
      typeof window.Audio !== 'undefined'
    ) {
      try {
        const langCode = lang.split('-')[0];
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(cleanedText)}`;
        const audio = new window.Audio(audioUrl);
        this.currentAudioElement = audio;
        this.isSpeakingState = true;

        audio.onplay = () => {
          onStart?.();
        };
        audio.onended = () => {
          this.isSpeakingState = false;
          this.currentAudioElement = null;
          this.activeEndCallback = null;
          onEnd?.();
        };
        audio.onerror = () => {
          this.speakWithDeviceNeuralEngine(cleanedText, lang, gender, rate, pitch, volume, onStart, onEnd, onError);
        };

        audio.play().catch(() => {
          this.speakWithDeviceNeuralEngine(cleanedText, lang, gender, rate, pitch, volume, onStart, onEnd, onError);
        });
        return true;
      } catch {
        // Fall back
      }
    }

    return this.speakWithDeviceNeuralEngine(
      cleanedText,
      lang,
      gender,
      rate,
      pitch,
      volume,
      onStart,
      onEnd,
      onError
    );
  }

  /**
   * Internal execution using on-device SpeechSynthesis with Neural voice priority
   */
  private speakWithDeviceNeuralEngine(
    text: string,
    lang: string,
    gender: 'female' | 'male',
    rate: number,
    pitch: number,
    volume: number,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('SpeechSynthesis not supported on this platform'));
      onEnd?.();
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Select Best Neural Voice (Swara/Madhur/Google Natural)
      const bestVoice = this.findBestVoice(lang, gender);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        onStart?.();

        // Workaround for Chrome/Edge long utterance garbage collection pause bug
        if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 12000);
      };

      utterance.onend = () => {
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        }
        this.isSpeakingState = false;
        this.currentUtterance = null;
        this.activeEndCallback = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        }
        this.isSpeakingState = false;
        this.currentUtterance = null;
        this.activeEndCallback = null;
        onError?.(e);
        onEnd?.();
      };

      this.currentUtterance = utterance;
      this.activeEndCallback = onEnd || null;

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      onError?.(err);
      onEnd?.();
      return false;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const realisticVoiceEngine = new RealisticVoiceEngine();
export const realisticVoiceService = realisticVoiceEngine;