import { speechRecognitionService } from '@/services/speechRecognitionService';

describe('SpeechRecognitionService', () => {
  const { ExpoSpeechRecognitionModule } = require('expo-speech-recognition');

  beforeEach(() => {
    jest.clearAllMocks();
    ExpoSpeechRecognitionModule.isRecognitionAvailable.mockReturnValue(true);
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValue({ granted: true, status: 'granted' });
  });

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
    ExpoSpeechRecognitionModule.isRecognitionAvailable.mockReturnValueOnce(false);

    const errorFn = jest.fn();
    const started = speechRecognitionService.startListening({
      onError: errorFn,
    });

    expect(started).toBe(false);
    expect(errorFn).toHaveBeenCalledWith(
      expect.stringContaining('Android speech recognition is not available')
    );
  });

  it('calls synchronous ExpoSpeechRecognitionModule.start without .catch() and delivers transcript', async () => {
    const resultFn = jest.fn();
    const startFn = jest.fn();

    const started = speechRecognitionService.startListening({
      onStart: startFn,
      onResult: resultFn,
    }, 'mr-IN');

    expect(started).toBe(true);

    // Wait for permission resolution & start invocation
    await Promise.resolve();

    expect(ExpoSpeechRecognitionModule.start).toHaveBeenCalledWith(
      expect.objectContaining({
        lang: 'mr-IN',
        interimResults: true,
      })
    );

    // Verify transcript propagation
    expect(resultFn).toHaveBeenCalledWith(
      expect.stringContaining('टेराकोटा फूलदान'),
      true
    );
  });

  it('ignores non-fatal silence speech-timeout errors without aborting', async () => {
    let capturedErrorHandler: ((e: any) => void) | null = null;
    ExpoSpeechRecognitionModule.addListener.mockImplementation((event: string, cb: any) => {
      if (event === 'error') {
        capturedErrorHandler = cb;
      }
      return { remove: jest.fn() };
    });

    const errorFn = jest.fn();
    speechRecognitionService.startListening({
      onError: errorFn,
    }, 'hi-IN');

    await Promise.resolve();

    // Trigger non-fatal speech-timeout event
    if (capturedErrorHandler) {
      (capturedErrorHandler as any)({ error: 'speech-timeout', code: 6, message: 'No speech heard' });
    }

    // errorFn should NOT be called for silence
    expect(errorFn).not.toHaveBeenCalled();
  });

  it('reports microphone permission denial clearly', async () => {
    ExpoSpeechRecognitionModule.requestPermissionsAsync.mockResolvedValueOnce({
      granted: false,
      status: 'denied',
    });

    const errorFn = jest.fn();
    speechRecognitionService.startListening({
      onError: errorFn,
    }, 'hi-IN');

    await Promise.resolve();
    await Promise.resolve();

    expect(errorFn).toHaveBeenCalledWith(
      expect.stringContaining('Microphone permission denied')
    );
  });

  it('returns valid diagnostics containing platform and speech service packages', async () => {
    const diag = await speechRecognitionService.getDiagnostics();

    expect(diag.moduleAvailable).toBe(true);
    expect(diag.isRecognitionAvailable).toBe(true);
    expect(diag.permissionGranted).toBe(true);
    expect(diag.availableServices).toContain('com.google.android.googlequicksearchbox');
    expect(diag.defaultServicePackage).toBe('com.google.android.googlequicksearchbox');
  });
});
