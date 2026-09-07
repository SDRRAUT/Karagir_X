import { speechRecognitionService } from '@/services/speechRecognitionService';

describe('SpeechRecognitionService', () => {
  it('initializes with default Hindi language', () => {
    expect(speechRecognitionService.getCurrentLanguage()).toBe('hi-IN');
    expect(speechRecognitionService.getIsListening()).toBe(false);
  });

  it('safely checks support without throwing', () => {
    const supported = speechRecognitionService.isSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('handles stop and abort safely even when not listening', () => {
    expect(() => speechRecognitionService.stopListening()).not.toThrow();
    expect(() => speechRecognitionService.abortListening()).not.toThrow();
  });

  it('calls onError callback when speech recognition is not available', () => {
    const errorFn = jest.fn();
    speechRecognitionService.startListening({
      onError: errorFn,
    });

    expect(errorFn).toHaveBeenCalled();
  });
});
