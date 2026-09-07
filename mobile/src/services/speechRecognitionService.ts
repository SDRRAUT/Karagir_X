import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

export type SpeechLanguage = 'hi-IN' | 'mr-IN' | 'en-IN' | 'bn-IN' | 'ta-IN';

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: SpeechLanguage = 'hi-IN';

  /**
   * Check if Speech Recognition is supported in the current environment
   */
  public isSupported(): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return Boolean(
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      );
    }
    return false;
  }

  /**
   * Start speech recognition with given language and event callbacks
   */
  public startListening(
    callbacks: SpeechRecognitionCallbacks,
    language: SpeechLanguage = 'hi-IN'
  ): boolean {
    this.currentLanguage = language;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognitionClass) {
        logger.warn('SPEECH_SERVICE', 'Web Speech API not supported in this browser');
        callbacks.onError?.('Speech recognition is not supported in this browser.');
        return false;
      }

      try {
        if (this.recognition) {
          try {
            this.recognition.abort();
          } catch {}
        }

        const recognition = new SpeechRecognitionClass();
        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          this.isListening = true;
          logger.info('SPEECH_SERVICE', `Listening started [${language}]`);
          callbacks.onStart?.();
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            const transcript = result[0]?.transcript || '';
            if (result.isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const combined = (finalTranscript || interimTranscript).trim();
          if (combined) {
            callbacks.onResult?.(combined, Boolean(finalTranscript));
          }
        };

        recognition.onerror = (event: any) => {
          const errorMsg = event.error || 'Speech recognition error';
          logger.warn('SPEECH_SERVICE', `Speech error: ${errorMsg}`);
          this.isListening = false;
          callbacks.onError?.(errorMsg);
        };

        recognition.onend = () => {
          this.isListening = false;
          logger.info('SPEECH_SERVICE', 'Listening stopped');
          callbacks.onEnd?.();
        };

        this.recognition = recognition;
        recognition.start();
        return true;
      } catch (err: any) {
        logger.error('SPEECH_SERVICE', 'Failed to start speech recognition', err);
        callbacks.onError?.(err?.message || 'Could not start microphone');
        this.isListening = false;
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
}

export const speechRecognitionService = new SpeechRecognitionService();
