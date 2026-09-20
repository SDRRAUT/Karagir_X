import { bhashiniService } from '@/services/bhashiniService';

describe('BhashiniService', () => {
  it('identifies unconfigured state when client has no real MeitY credentials', () => {
    expect(bhashiniService.isConfigured()).toBe(false);
  });

  it('translates Hindi craft terms using on-device Indic dictionary fallback when unconfigured', async () => {
    const result = await bhashiniService.translate('टेराकोटा दीया', 'hi', 'en');
    expect(result).toBeDefined();
    expect(result.sourceText).toBe('टेराकोटा दीया');
    expect(result.translatedText).toContain('Terracotta');
    expect(result.engine).toBe('INDIC_NLP_OFFLINE');
    expect(result.sourceLanguage).toBe('hi');
    expect(result.targetLanguage).toBe('en');
  });

  it('handles empty input gracefully', async () => {
    const result = await bhashiniService.translate('', 'hi', 'en');
    expect(result.translatedText).toBe('');
  });

  it('throws an explicit configuration error when ASR is called without valid backend credentials (no fake fallback)', async () => {
    await expect(bhashiniService.transcribeAudio('dummy_base64_audio', 'hi')).rejects.toThrow(
      /Bhashini ASR requires a secure backend proxy/i
    );
  });

  it('provides safe diagnostics without exposing secrets', () => {
    const diag = bhashiniService.getDiagnostics();
    expect(diag.isConfigured).toBe(false);
    expect(diag.endpointUrl).toBe('https://dhruva-api.bhashini.gov.in/services/inference/pipeline');
    expect((diag as any).apiKey).toBeUndefined();
    expect((diag as any).userId).toBeUndefined();
  });
});
