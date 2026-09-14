import { Platform } from 'react-native';
import { logger } from './logger';

export interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  durationMillis?: number;
  positionMillis?: number;
  didJustFinish?: boolean;
  error?: string | null;
}

export class Sound {
  private _onStatus: ((status: PlaybackStatus) => void) | null = null;
  private _webAudio: any = null;
  private _nativePlayer: any = null;
  private _subscription: any = null;
  private _durationMs: number = 0;
  private _positionMs: number = 0;
  private _isPlaying: boolean = false;
  private _isLoaded: boolean = false;

  constructor() {}

  setOnPlaybackStatusUpdate(cb: (status: PlaybackStatus) => void): void {
    this._onStatus = cb;
  }

  async loadAsync(_source: any, _initialStatus?: any): Promise<{ isLoaded: boolean }> {
    this._isLoaded = true;
    return { isLoaded: true };
  }

  async playAsync(): Promise<PlaybackStatus> {
    this._isPlaying = true;

    if (Platform.OS === 'web') {
      if (this._webAudio) {
        try {
          await this._webAudio.play();
        } catch (err: any) {
          logger.warn('AUDIO_PLAYER', 'Web audio play error', { err: err?.message });
        }
      }
    } else {
      if (this._nativePlayer) {
        try {
          this._nativePlayer.play();
        } catch (err: any) {
          logger.error('AUDIO_PLAYER', 'Native audio play error', { err: err?.message });
        }
      }
    }

    const status: PlaybackStatus = {
      isLoaded: this._isLoaded,
      isPlaying: this._isPlaying,
      durationMillis: this._durationMs,
      positionMillis: this._positionMs,
      didJustFinish: false,
    };

    if (this._onStatus) {
      this._onStatus(status);
    }

    return status;
  }

  async pauseAsync(): Promise<PlaybackStatus> {
    this._isPlaying = false;

    if (Platform.OS === 'web') {
      if (this._webAudio) {
        try {
          this._webAudio.pause();
        } catch (_) {}
      }
    } else {
      if (this._nativePlayer) {
        try {
          this._nativePlayer.pause();
        } catch (_) {}
      }
    }

    const status: PlaybackStatus = {
      isLoaded: this._isLoaded,
      isPlaying: false,
      durationMillis: this._durationMs,
      positionMillis: this._positionMs,
      didJustFinish: false,
    };

    if (this._onStatus) {
      this._onStatus(status);
    }

    return status;
  }

  async stopAsync(): Promise<PlaybackStatus> {
    this._isPlaying = false;
    this._positionMs = 0;

    if (Platform.OS === 'web') {
      if (this._webAudio) {
        try {
          this._webAudio.pause();
          this._webAudio.currentTime = 0;
        } catch (_) {}
      }
    } else {
      if (this._nativePlayer) {
        try {
          this._nativePlayer.pause();
          this._nativePlayer.seekTo(0);
        } catch (_) {}
      }
    }

    const status: PlaybackStatus = {
      isLoaded: this._isLoaded,
      isPlaying: false,
      durationMillis: this._durationMs,
      positionMillis: 0,
      didJustFinish: false,
    };

    if (this._onStatus) {
      this._onStatus(status);
    }

    return status;
  }

  async unloadAsync(): Promise<PlaybackStatus> {
    this._isPlaying = false;
    this._isLoaded = false;

    if (Platform.OS === 'web') {
      if (this._webAudio) {
        try {
          this._webAudio.pause();
        } catch (_) {}
        this._webAudio = null;
      }
    } else {
      if (this._subscription) {
        try {
          this._subscription.remove();
        } catch (_) {}
        this._subscription = null;
      }
      if (this._nativePlayer) {
        try {
          this._nativePlayer.remove();
        } catch (_) {}
        this._nativePlayer = null;
      }
    }

    return { isLoaded: false, isPlaying: false };
  }

  static async createAsync(
    source: any,
    initialStatus?: { shouldPlay?: boolean; volume?: number; isLooping?: boolean }
  ): Promise<{ sound: Sound; status: PlaybackStatus }> {
    const sound = new Sound();

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && typeof window.Audio !== 'undefined') {
        try {
          const audio = new window.Audio(source);
          audio.volume = initialStatus?.volume ?? 1.0;
          if (initialStatus?.isLooping) {
            audio.loop = true;
          }
          sound._webAudio = audio;
          sound._isLoaded = true;

          audio.onloadedmetadata = () => {
            if (audio.duration && !isNaN(audio.duration)) {
              sound._durationMs = Math.round(audio.duration * 1000);
            }
          };

          audio.ontimeupdate = () => {
            sound._positionMs = Math.round((audio.currentTime || 0) * 1000);
            if (sound._onStatus) {
              sound._onStatus({
                isLoaded: true,
                isPlaying: !audio.paused,
                durationMillis: sound._durationMs,
                positionMillis: sound._positionMs,
                didJustFinish: false,
              });
            }
          };

          audio.onended = () => {
            sound._isPlaying = false;
            if (sound._onStatus) {
              sound._onStatus({
                isLoaded: true,
                isPlaying: false,
                durationMillis: sound._durationMs,
                positionMillis: sound._durationMs,
                didJustFinish: true,
              });
            }
          };
        } catch (err: any) {
          logger.warn('AUDIO_PLAYER', 'Failed to initialize Web Audio', { err: err?.message });
        }
      }
    } else {
      // Native Android / iOS using real expo-audio module
      try {
        const { createAudioPlayer, setAudioModeAsync } = require('expo-audio');

        // Ensure audio plays through speaker even in silent mode
        setAudioModeAsync({
          playsInSilentMode: true,
        }).catch(() => {});

        const player = createAudioPlayer(source);
        if (initialStatus?.volume !== undefined) {
          player.volume = initialStatus.volume;
        }
        if (initialStatus?.isLooping !== undefined) {
          player.loop = initialStatus.isLooping;
        }

        sound._nativePlayer = player;
        sound._isLoaded = true;

        sound._subscription = player.addListener('playbackStatusUpdate', (status: any) => {
          const isPlaying = Boolean(status.playing);
          sound._isPlaying = isPlaying;
          if (status.duration !== undefined && status.duration > 0) {
            sound._durationMs = Math.round(status.duration * 1000);
          }
          if (status.currentTime !== undefined) {
            sound._positionMs = Math.round(status.currentTime * 1000);
          }

          if (sound._onStatus) {
            sound._onStatus({
              isLoaded: Boolean(status.isLoaded ?? true),
              isPlaying,
              durationMillis: sound._durationMs,
              positionMillis: sound._positionMs,
              didJustFinish: Boolean(status.didJustFinish),
              error: status.error || null,
            });
          }
        });
      } catch (err: any) {
        logger.error('AUDIO_PLAYER', 'Failed to initialize native expo-audio player', { err: err?.message });
      }
    }

    if (initialStatus?.shouldPlay) {
      await sound.playAsync();
    }

    return {
      sound,
      status: {
        isLoaded: sound._isLoaded,
        isPlaying: sound._isPlaying,
        durationMillis: sound._durationMs,
        positionMillis: sound._positionMs,
        didJustFinish: false,
      },
    };
  }
}

export namespace Audio {
  export type Sound = import('./audioPlayer').Sound;
}

export const Audio = {
  Sound,
  setAudioModeAsync: async (options?: any): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      try {
        const { setAudioModeAsync: setNativeMode } = require('expo-audio');
        await setNativeMode({
          playsInSilentMode: options?.playsInSilentMode ?? true,
        });
        return true;
      } catch {
        return false;
      }
    }
    return true;
  },
};
