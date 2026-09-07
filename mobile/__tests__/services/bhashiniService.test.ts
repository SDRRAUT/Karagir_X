import { bhashiniService } from '@/services/bhashiniService';

describe('BhashiniService', () => {
  it('translates Hindi craft terms to English via Bhashini NMT pipeline fallback', async () => {
    const result = await bhashiniService.translate('टेराकोटा दीया', 'hi', 'en');
    expect(result).toBeDefined();
    expect(result.sourceText).toBe('टेराकोटा दीया');
    expect(result.translatedText).toContain('Terracotta');
    expect(result.sourceLanguage).toBe('hi');
    expect(result.targetLanguage).toBe('en');
  });

  it('handles empty input gracefully', async () => {
    const result = await bhashiniService.translate('', 'hi', 'en');
    expect(result.translatedText).toBe('');
  });

  it('transcribes audio via Bhashini ASR pipeline', async () => {
    const asr = await bhashiniService.transcribeAudio('dummy_base64_audio', 'hi');
    expect(asr).toBeDefined();
    expect(asr.transcript).toBeDefined();
    expect(asr.detectedLanguage).toBe('hi');
  });
});
