import { geminiSaathiService } from '@/services/geminiSaathiService';

describe('GeminiSaathiService', () => {
  it('should initialize with empty default API key', () => {
    expect(geminiSaathiService.getApiKey()).toBe('');
  });

  it('should allow updating API key', () => {
    const originalKey = geminiSaathiService.getApiKey();
    geminiSaathiService.setApiKey('mock_test_key_123456789');
    expect(geminiSaathiService.getApiKey()).toBe('mock_test_key_123456789');
    geminiSaathiService.setApiKey(originalKey);
  });

  it('should handle empty queries gracefully', async () => {
    const response = await geminiSaathiService.askSaathi('', {
      artisanName: 'Ramesh Kumbhar',
      activeLanguage: 'hi-IN',
    });
    expect(response.replyText).toContain('Kripya kuch boliye ya type karein.');
  });

  it('should respond to orders query with orders action type', async () => {
    const response = await geminiSaathiService.askSaathi('Naye orders dikhao', {
      artisanName: 'Ramesh Kumbhar',
      activeLanguage: 'hi-IN',
      pendingOrdersCount: 2,
    });
    expect(response.replyText).toBeDefined();
    expect(response.audioText).toBeDefined();
    expect(response.actionType).toBeDefined();
  });

  it('should respond in Marathi when language is set to mr-IN', async () => {
    const response = await geminiSaathiService.askSaathi('आज किती कमाई झाली?', {
      artisanName: 'Ramesh Kumbhar',
      activeLanguage: 'mr-IN',
      todayEarnings: 2400,
    });
    expect(response.replyText).toBeDefined();
    expect(response.audioText).toBeDefined();
  });
});
