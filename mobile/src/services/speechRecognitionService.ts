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

export interface SpeechDiagnostics {
  platform: string;
  moduleAvailable: boolean;
  permissionGranted: boolean;
  permissionStatus: string;
  isRecognitionAvailable: boolean;
  availableServices: string[];
  defaultServicePackage: string;
  assistantServicePackage: string;
  currentLanguage: SpeechLanguage;
  lastEvent: string | null;
  lastError: string | null;
  lastErrorCode: number | string | null;
  lastTranscript: string | null;
  isListening: boolean;
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

  private nativeSubscriptions: any[] = [];

  private lastEvent: string | null = null;
  private lastError: string | null = null;
  private lastErrorCode: number | string | null = null;
  private lastTranscript: string | null = null;

  private clearNativeSubscriptions() {
    if (this.nativeSubscriptions && this.nativeSubscriptions.length > 0) {
      this.nativeSubscriptions.forEach((sub) => {
        try {
          sub?.remove?.();
        } catch {}
      });
      this.nativeSubscriptions = [];
    }
  }

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

    if (Platform.OS !== 'web') {
      try {
        const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
        return Boolean(ExpoSpeechRecognitionModule?.isRecognitionAvailable?.());
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * Safely inspect speech recognition system diagnostics
   */
  public async getDiagnostics(): Promise<SpeechDiagnostics> {
    const diag: SpeechDiagnostics = {
      platform: Platform.OS,
      moduleAvailable: false,
      permissionGranted: false,
      permissionStatus: 'unknown',
      isRecognitionAvailable: false,
      availableServices: [],
      defaultServicePackage: '',
      assistantServicePackage: '',
      currentLanguage: this.currentLanguage,
      lastEvent: this.lastEvent,
      lastError: this.lastError,
      lastErrorCode: this.lastErrorCode,
      lastTranscript: this.lastTranscript,
      isListening: this.isListening,
    };

    if (Platform.OS === 'web') {
      diag.moduleAvailable = Boolean(
        typeof window !== 'undefined' &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
      );
      diag.isRecognitionAvailable = diag.moduleAvailable;
      diag.permissionStatus = 'browser-managed';
      return diag;
    }

    try {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
      if (ExpoSpeechRecognitionModule) {
        diag.moduleAvailable = true;
        try {
          diag.isRecognitionAvailable = Boolean(ExpoSpeechRecognitionModule.isRecognitionAvailable?.());
        } catch {}

        try {
          if (typeof ExpoSpeechRecognitionModule.getPermissionsAsync === 'function') {
            const perm = await ExpoSpeechRecognitionModule.getPermissionsAsync();
            diag.permissionGranted = Boolean(perm?.granted);
            diag.permissionStatus = perm?.status || 'unknown';
          }
        } catch {}

        try {
          if (typeof ExpoSpeechRecognitionModule.getSpeechRecognitionServices === 'function') {
            diag.availableServices = ExpoSpeechRecognitionModule.getSpeechRecognitionServices() || [];
          }
        } catch {}

        try {
          if (typeof ExpoSpeechRecognitionModule.getDefaultRecognitionService === 'function') {
            diag.defaultServicePackage = ExpoSpeechRecognitionModule.getDefaultRecognitionService()?.packageName || '';
          }
        } catch {}

        try {
          if (typeof ExpoSpeechRecognitionModule.getAssistantService === 'function') {
            diag.assistantServicePackage = ExpoSpeechRecognitionModule.getAssistantService()?.packageName || '';
          }
        } catch {}
      }
    } catch (err: any) {
      diag.lastError = err?.message || 'Failed to query native speech module';
    }

    return diag;
  }

  /**
   * Request microphone permission explicitly
   */
  public async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      } catch (err) {
        logger.warn('SPEECH_SERVICE', 'Web microphone permission denied or unavailable', { err });
        return false;
      }
    }

    if (Platform.OS !== 'web') {
      try {
        const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
        const res = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        return Boolean(res?.granted);
      } catch (err) {
        logger.warn('SPEECH_SERVICE', 'Native microphone permission request failed', { err });
        return false;
      }
    }

    return true;
  }

  /**
   * Starts Web Audio Analyser to calculate real-time live volume level (0 to 1).
   * Falls back to synthetic animated wave if getUserMedia is denied/insecure.
   */
  private async startVolumeMeter(onVolumeChange?: (volume: number) => void) {
    if (!onVolumeChange || Platform.OS !== 'web' || typeof window === 'undefined') return;

    let hasRealAudio = false;

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
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
          hasRealAudio = true;
        }
      } catch (_err) {
        // Fall back to synthetic audio level below
      }
    }

    if (!hasRealAudio) {
      // Synthetic volume wave simulation so UI equalizer remains alive
      const simulateLevel = () => {
        if (!this.isListening) return;
        const fakeVol = Math.min(1, Math.max(0.15, Math.random() * 0.7 + 0.1));
        onVolumeChange(fakeVol);
        this.animFrameId = requestAnimationFrame(() => {
          setTimeout(simulateLevel, 80);
        });
      };
      simulateLevel();
    }
  }

  /**
   * Simulates real-time voice recognition streaming with animated volume meter
   * Used as bulletproof fallback whenever browser blocks microphone permission
   */
  public simulateVoiceInput(
    sampleText: string,
    callbacks: SpeechRecognitionCallbacks,
    wordDelayMs: number = 90
  ): () => void {
    this.isListening = true;
    callbacks.onStart?.();

    let currentIndex = 0;
    const words = sampleText.trim().split(/\s+/);
    let currentTranscript = '';
    let stopped = false;

    const interval = setInterval(() => {
      if (stopped) {
        clearInterval(interval);
        return;
      }

      if (currentIndex < words.length) {
        currentTranscript += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
        currentIndex++;
        const isFinal = currentIndex === words.length;
        callbacks.onVolumeChange?.(Math.min(1, Math.random() * 0.6 + 0.3));
        callbacks.onResult?.(currentTranscript, isFinal, words[currentIndex - 1]);

        if (isFinal) {
          clearInterval(interval);
          this.isListening = false;
          callbacks.onVolumeChange?.(0);
          callbacks.onEnd?.();
        }
      } else {
        clearInterval(interval);
        this.isListening = false;
        callbacks.onVolumeChange?.(0);
        callbacks.onEnd?.();
      }
    }, wordDelayMs);

    return () => {
      stopped = true;
      clearInterval(interval);
      this.isListening = false;
      callbacks.onVolumeChange?.(0);
    };
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

    // Native Android & iOS Speech Recognition via expo-speech-recognition
    try {
      const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');

      if (!ExpoSpeechRecognitionModule) {
        this.isListening = false;
        this.lastError = 'ExpoSpeechRecognitionModule not bundled';
        logger.error('SPEECH_SERVICE', '[VOICE DEBUG] ExpoSpeechRecognitionModule not available in runtime');
        callbacks.onError?.('Android speech recognition module is unavailable.');
        return false;
      }

      const available = Boolean(ExpoSpeechRecognitionModule.isRecognitionAvailable?.());
      logger.info(
        'SPEECH_SERVICE',
        `[VOICE DEBUG] platform: ${Platform.OS}, isRecognitionAvailable: ${available}, lang: ${language}`
      );

      if (!available) {
        this.isListening = false;
        this.lastError = 'Android speech recognition service not available on device';
        logger.warn('SPEECH_SERVICE', '[VOICE DEBUG] DEVICE SPEECH ENGINE UNAVAILABLE');
        callbacks.onError?.(
          'Android speech recognition is not available on this device. Please check Google Speech Services in Android Settings.'
        );
        return false;
      }

      this.clearNativeSubscriptions();
      this.isListening = true;
      this.lastEvent = 'start-pending';
      callbacks.onStart?.();

      const subResult = ExpoSpeechRecognitionModule.addListener('result', (event: any) => {
        this.lastEvent = 'result';
        const transcript = event?.results?.[0]?.transcript || '';
        const isFinal = Boolean(event?.isFinal);
        this.lastTranscript = transcript;
        logger.info(
          'SPEECH_SERVICE',
          `[VOICE DEBUG] event: result, isFinal: ${isFinal}, len: ${transcript.length}`
        );
        if (transcript) {
          callbacks.onResult?.(transcript, isFinal);
        }
      });

      const subError = ExpoSpeechRecognitionModule.addListener('error', (event: any) => {
        const errType = event?.error || 'speech_error';
        const errCode = event?.code ?? -1;
        const errMsg = event?.message || '';
        this.lastEvent = 'error';
        this.lastError = `${errType} (${errCode}): ${errMsg}`;
        this.lastErrorCode = errCode;
        logger.warn(
          'SPEECH_SERVICE',
          `[VOICE DEBUG] event: error, code: ${errCode}, error: ${errType}, msg: ${errMsg}`
        );

        // Non-fatal silence events on Android:
        if (errType === 'no-speech' || errType === 'speech-timeout') {
          logger.info('SPEECH_SERVICE', `[VOICE DEBUG] silence event ignored: ${errType}`);
          return;
        }

        this.isListening = false;
        this.clearNativeSubscriptions();

        let userMessage = 'Voice recognition encountered an issue. Please try speaking again.';
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          userMessage = 'Microphone permission denied. Please allow microphone access in app settings.';
        } else if (errType === 'network') {
          userMessage = 'Network connection needed for vernacular speech recognition.';
        } else if (errType === 'language-not-supported') {
          userMessage = `Language ${language} is not supported by the device speech engine.`;
        }
        callbacks.onError?.(userMessage);
      });

      const subEnd = ExpoSpeechRecognitionModule.addListener('end', () => {
        this.lastEvent = 'end';
        logger.info('SPEECH_SERVICE', '[VOICE DEBUG] event: end (Native speech recognition ended)');
        this.isListening = false;
        this.clearNativeSubscriptions();
        callbacks.onEnd?.();
      });

      const subVolume = ExpoSpeechRecognitionModule.addListener('volumechange', (event: any) => {
        const rms = event?.value ?? 0;
        const normalized = Math.min(1, Math.max(0, (rms + 2) / 12));
        callbacks.onVolumeChange?.(normalized);
      });

      this.nativeSubscriptions = [subResult, subError, subEnd, subVolume];

      ExpoSpeechRecognitionModule.requestPermissionsAsync()
        .then((perm: any) => {
          const granted = Boolean(perm?.granted);
          logger.info('SPEECH_SERVICE', `[VOICE DEBUG] permission: ${granted ? 'GRANTED' : 'DENIED'}`);

          if (!granted) {
            this.isListening = false;
            this.clearNativeSubscriptions();
            this.lastError = 'Microphone permission denied by user';
            callbacks.onError?.('Microphone permission denied. Please allow microphone permission in settings.');
            return;
          }

          // Options configuration:
          // Crucial: On Android, continuous: true forces EXTRA_AUDIO_SOURCE on Android 13+
          // which is rejected by standard Google SpeechRecognizer. We do NOT pass continuous on Android.
          const startOptions: any = {
            lang: language,
            interimResults: true,
          };
          if (Platform.OS === 'ios') {
            startOptions.continuous = true;
          }

          try {
            ExpoSpeechRecognitionModule.start(startOptions);
            this.lastEvent = 'recognizing';
            logger.info('SPEECH_SERVICE', `[VOICE DEBUG] start() invoked successfully for lang: ${language}`);
          } catch (startErr: any) {
            logger.error('SPEECH_SERVICE', '[VOICE DEBUG] start() threw synchronous exception', startErr);
            this.isListening = false;
            this.clearNativeSubscriptions();
            this.lastError = startErr?.message || 'Could not start speech engine';
            callbacks.onError?.(startErr?.message || 'Could not start microphone');
          }
        })
        .catch((permErr: any) => {
          logger.error('SPEECH_SERVICE', '[VOICE DEBUG] requestPermissionsAsync failed', permErr);
          this.isListening = false;
          this.clearNativeSubscriptions();
          this.lastError = permErr?.message || 'Permission check failed';
          callbacks.onError?.(permErr?.message || 'Microphone permission check failed');
        });

      return true;
    } catch (err: any) {
      logger.error('SPEECH_SERVICE', '[VOICE DEBUG] Native speech recognition unavailable', err);
      this.isListening = false;
      this.clearNativeSubscriptions();
      this.lastError = err?.message || 'Native speech recognition unavailable';
      callbacks.onError?.('Android speech recognition is unavailable on this device.');
      return false;
    }
  }

  /**
   * Stop active speech recognition
   */
  public stopListening(): void {
    this.shouldStayActive = false;
    this.stopVolumeMeter();
    this.clearNativeSubscriptions();

    if (Platform.OS !== 'web') {
      try {
        const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
        ExpoSpeechRecognitionModule.stop();
      } catch {}
    }

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
    this.clearNativeSubscriptions();

    if (Platform.OS !== 'web') {
      try {
        const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');
        ExpoSpeechRecognitionModule.abort();
      } catch {}
    }

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
    artisanName?: string;
  } {
    if (!spoken) return {};
    const text = spoken.toLowerCase();
    const result: { craftName?: string; laborHours?: number; materialCost?: number; artisanName?: string } = {};

    // 1. Artisan Name extraction (e.g. "मेरा नाम सुनीता देवी है", "Name: Sunita Devi", "Artisan: Sunita Devi", "by Sunita Devi")
    const nameMatch =
      spoken.match(/(?:मेरा\s*नाम|माझे\s*नाव|my\s*name\s*is|name\s*is|artisan\s*is|i\s*am)\s*[:=]?\s*([a-zA-Z\u0900-\u097F\s]{2,30})/i) ||
      spoken.match(/(?:name|artisan|शिल्पी|कारीगर)\s*[:=]\s*([a-zA-Z\u0900-\u097F\s]{2,30})/i);
    if (nameMatch && nameMatch[1]) {
      const parsedName = nameMatch[1].replace(/(?:hai|ahe|and|aur|\.|,).*$/i, '').trim();
      if (parsedName.length >= 2 && !parsedName.toLowerCase().includes('handmade') && !parsedName.toLowerCase().includes('craft')) {
        result.artisanName = parsedName;
      }
    }

    // 2. Cost extraction (₹ or rupees or रुपये or खर्च)
    const costMatch = text.match(/(?:₹|rupees?|rs\.?|रुपये|रुपया|खर्च|लागत)\s*[:=]?\s*(\d+)/i) ||
                      text.match(/(\d+)\s*(?:₹|rupees?|rs\.?|रुपये|रुपया)/i);
    if (costMatch && costMatch[1]) {
      result.materialCost = parseInt(costMatch[1], 10);
    }

    // 3. Days or Hours extraction
    const daysMatch = text.match(/(\d+)\s*(?:दिन|दिवस|days?)/i);
    if (daysMatch && daysMatch[1]) {
      result.laborHours = parseInt(daysMatch[1], 10) * 8; // convert days to 8 hrs/day
    } else {
      const hoursMatch = text.match(/(\d+)\s*(?:घंटे|तास|hours?|hrs?)/i);
      if (hoursMatch && hoursMatch[1]) {
        result.laborHours = parseInt(hoursMatch[1], 10);
      }
    }

    // 4. Craft name fallback if clean keywords exist
    const cleaned = spoken
      .replace(/(?:मेरा\s*नाम|माझे\s*नाव|my\s*name\s*is|name\s*is|artisan\s*is|i\s*am)\s*[:=]?\s*([a-zA-Z\u0900-\u097F\s]{2,30})/gi, '')
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

