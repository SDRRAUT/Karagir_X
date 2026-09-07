import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

export type SpeechLanguage =
  | 'hi-IN'
  | 'mr-IN'
  | 'en-IN'
  | 'bn-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'gu-IN'
  | 'od-IN';

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean, interimSegment?: string) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: SpeechLanguage = 'hi-IN';
  private activeCallbacks: SpeechRecognitionCallbacks | null = null;
  private shouldStayActive: boolean = false;
  private audioContext: any = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  /**
   * Check if Speech Recognition is supported in the current environment
   */
  public isSupported(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return Boolean(
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition
      );
    }
    return false;
  }

  /**
   * Request microphone permission explicitly in web browsers
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (err) {
        logger.warn('SPEECH_SERVICE', 'Microphone permission denied or unavailable', { err });
        return false;
      }
    }
    return true;
  }

  /**
   * Starts Web Audio Analyser to calculate real-time live volume level (0 to 1)
   */
  private async startVolumeMeter(onVolumeChange?: (volume: number) => void) {
    if (!onVolumeChange || Platform.OS !== 'web' || typeof window === 'undefined') return;
    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      this.audioContext = audioCtx;
      this.mediaStream = stream;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!this.isListening) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, Math.max(0, avg / 100)); // 0.0 to 1.0
        onVolumeChange(normalized);

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      logger.warn('SPEECH_SERVICE', 'Audio level metering unavailable', { err });
    }
  }

  /**
   * Stop audio analyzer
   */
  private stopVolumeMeter() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }
  }

  /**
   * Start speech recognition with real-time streaming tokens and interim results
   */
  public startListening(
    callbacks: SpeechRecognitionCallbacks,
    language: SpeechLanguage = 'hi-IN'
  ): boolean {
    this.currentLanguage = language;
    this.activeCallbacks = callbacks;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      if (!SpeechRecognitionClass) {
        logger.warn('SPEECH_SERVICE', 'Web Speech API not supported in this browser');
        callbacks.onError?.('Speech recognition is not supported in this browser.');
        return false;
      }

      try {
        if (this.recognition) {
          try {
            this.shouldStayActive = false;
            this.recognition.abort();
          } catch {}
        }

        const recognition = new SpeechRecognitionClass();
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        this.shouldStayActive = true;

        recognition.onstart = () => {
          this.isListening = true;
          logger.info('SPEECH_SERVICE', `Listening started in real-time [${language}]`);
          callbacks.onStart?.();
          this.startVolumeMeter(callbacks.onVolumeChange);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          let isFinal = false;

          for (let i = 0; i < event.results.length; ++i) {
            const res = event.results[i];
            if (res && res[0]) {
              if (res.isFinal) {
                finalTranscript += res[0].transcript + ' ';
                isFinal = true;
              } else {
                interimTranscript += res[0].transcript;
              }
            }
          }

          const combined = (finalTranscript + interimTranscript).trim();
          if (combined) {
            callbacks.onResult?.(combined, isFinal, interimTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          const errorMsg = event.error || 'Speech recognition error';
          logger.warn('SPEECH_SERVICE', `Speech error: ${errorMsg}`);

          // Non-fatal errors in Chrome Web Speech API that should NOT terminate user speaking
          if (errorMsg === 'no-speech') {
            return;
          }
          if (errorMsg === 'aborted') {
            return;
          }

          this.isListening = false;
          this.shouldStayActive = false;
          this.stopVolumeMeter();

          let userFriendly = errorMsg;
          if (errorMsg === 'not-allowed' || errorMsg === 'service-not-allowed') {
            userFriendly = 'Microphone permission denied. Please allow microphone access in browser.';
          } else if (errorMsg === 'network') {
            userFriendly = 'Voice network error. Please check connection or type below.';
          }

          callbacks.onError?.(userFriendly);
        };

        recognition.onend = () => {
          logger.info('SPEECH_SERVICE', 'Listening ended');
          if (this.shouldStayActive && this.isListening) {
            try {
              recognition.start();
              return;
            } catch {}
          }
          this.isListening = false;
          this.stopVolumeMeter();
          callbacks.onEnd?.();
        };

        this.recognition = recognition;
        recognition.start();
        return true;
      } catch (err: any) {
        logger.error('SPEECH_SERVICE', 'Failed to start speech recognition', err);
        this.isListening = false;
        this.shouldStayActive = false;
        this.stopVolumeMeter();
        callbacks.onError?.(err?.message || 'Could not start microphone');
        return false;
      }
    }

    callbacks.onError?.('Native speech recognition requires device microphone service.');
    return false;
  }

  /**
   * Stop active speech recognition
   */
  public stopListening(): void {
    this.shouldStayActive = false;
    this.stopVolumeMeter();
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        logger.warn('SPEECH_SERVICE', 'Error stopping recognition', { err });
      }
    }
    this.isListening = false;
  }

  /**
   * Abort active speech recognition immediately
   */
  public abortListening(): void {
    this.shouldStayActive = false;
    this.stopVolumeMeter();
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getCurrentLanguage(): SpeechLanguage {
    return this.currentLanguage;
  }

  /**
   * Converts spoken number words (Hindi / English / Marathi) into numeric digits.
   * e.g. "नौ आठ सात छः पाँच चार तीन दो एक शून्य" -> "9876543210"
   */
  public parseSpokenPhoneNumber(spoken: string): string {
    if (!spoken) return '';
    const wordMap: Record<string, string> = {
      // English
      zero: '0',
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
      six: '6',
      seven: '7',
      eight: '8',
      nine: '9',
      // Hindi words
      शून्य: '0',
      सिफर: '0',
      एक: '1',
      दो: '2',
      तीन: '3',
      चार: '4',
      पांच: '5',
      पाँच: '5',
      छह: '6',
      छः: '6',
      सात: '7',
      आठ: '8',
      नौ: '9',
      नऊ: '9',
      // Marathi words
      दोन: '2',
      पाच: '5',
      सहा: '6',
      // Hindi compound numbers
      दस: '10',
      ग्यारह: '11',
      बारह: '12',
      तेरह: '13',
      चौदह: '14',
      पंद्रह: '15',
      सोलह: '16',
      सत्रह: '17',
      अठारह: '18',
      उन्नीस: '19',
      बीस: '20',
      तीस: '30',
      चालीस: '40',
      पचास: '50',
      साठ: '60',
      सत्तर: '70',
      अस्सी: '80',
      नब्बे: '90',
    };

    let result = '';
    const tokens = spoken.toLowerCase().replace(/[,.-]/g, ' ').split(/\s+/);
    for (const token of tokens) {
      if (/^\d+$/.test(token)) {
        result += token;
      } else if (wordMap[token]) {
        result += wordMap[token];
      }
    }
    return result.replace(/\D/g, '').slice(0, 10);
  }

  /**
   * Extracts structured craft parameters from free-flowing voice speech in Hindi/Marathi/English
   */
  public parseCraftVoiceInput(spoken: string): {
    craftName?: string;
    laborHours?: number;
    materialCost?: number;
  } {
    if (!spoken) return {};
    const text = spoken.toLowerCase();
    const result: { craftName?: string; laborHours?: number; materialCost?: number } = {};

    // 1. Cost extraction (₹ or rupees or रुपये or खर्च)
    const costMatch = text.match(/(?:₹|rupees?|rs\.?|रुपये|रुपया|खर्च|लागत)\s*[:=]?\s*(\d+)/i) ||
                      text.match(/(\d+)\s*(?:₹|rupees?|rs\.?|रुपये|रुपया)/i);
    if (costMatch && costMatch[1]) {
      result.materialCost = parseInt(costMatch[1], 10);
    }

    // 2. Days or Hours extraction
    const daysMatch = text.match(/(\d+)\s*(?:दिन|दिवस|days?)/i);
    if (daysMatch && daysMatch[1]) {
      result.laborHours = parseInt(daysMatch[1], 10) * 8; // convert days to 8 hrs/day
    } else {
      const hoursMatch = text.match(/(\d+)\s*(?:घंटे|तास|hours?|hrs?)/i);
      if (hoursMatch && hoursMatch[1]) {
        result.laborHours = parseInt(hoursMatch[1], 10);
      }
    }

    // 3. Craft name fallback if clean keywords exist
    const cleaned = spoken
      .replace(/(?:₹|rupees?|rs\.?|रुपये|रुपया|खर्च|लागत)\s*[:=]?\s*\d+/gi, '')
      .replace(/\d+\s*(?:दिन|दिवस|days?|घंटे|तास|hours?|hrs?)/gi, '')
      .replace(/^(this is|ye hai|he ahe|handmade|हस्तनिर्मित)/gi, '')
      .trim();

    if (cleaned.length >= 3) {
      result.craftName = cleaned;
    }

    return result;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();

