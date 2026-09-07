import { realisticVoiceService } from '@/services/realisticVoiceService';

describe('RealisticVoiceEngine (Device Neural Voice)', () => {
  describe('scoreVoice', () => {
    it('prioritizes Microsoft Swara Natural over legacy Microsoft Ravi for Hindi', () => {
      const swaraVoice = {
        name: 'Microsoft Swara Online (Natural) - Hindi (India)',
        lang: 'hi-IN',
      };
      const raviVoice = {
        name: 'Microsoft Ravi - Hindi (India)',
        lang: 'hi-IN',
      };

      const swaraScore = realisticVoiceService.scoreVoice(swaraVoice, 'hi-IN', 'female');
      const raviScore = realisticVoiceService.scoreVoice(raviVoice, 'hi-IN', 'female');

      expect(swaraScore).toBeGreaterThan(raviScore);
      expect(swaraScore).toBeGreaterThan(250);
      expect(raviScore).toBeLessThan(0);
    });

    it('prioritizes Google Hindi over robotic eSpeak', () => {
      const googleHindi = {
        name: 'Google हिन्दी',
        lang: 'hi-IN',
      };
      const eSpeakHindi = {
        name: 'eSpeak Hindi',
        lang: 'hi-IN',
      };

      const googleScore = realisticVoiceService.scoreVoice(googleHindi, 'hi-IN');
      const eSpeakScore = realisticVoiceService.scoreVoice(eSpeakHindi, 'hi-IN');

      expect(googleScore).toBeGreaterThan(eSpeakScore);
      expect(googleScore).toBeGreaterThan(100);
      expect(eSpeakScore).toBeLessThan(0);
    });

    it('properly scores Marathi neural voice Aarohi', () => {
      const aarohiVoice = {
        name: 'Microsoft Aarohi Online (Natural) - Marathi (India)',
        lang: 'mr-IN',
      };
      const score = realisticVoiceService.scoreVoice(aarohiVoice, 'mr-IN');
      expect(score).toBeGreaterThan(250);
    });

    it('heavily penalizes incompatible languages', () => {
      const frenchVoice = {
        name: 'Microsoft Julie - French',
        lang: 'fr-FR',
      };
      const score = realisticVoiceService.scoreVoice(frenchVoice, 'hi-IN');
      expect(score).toBeLessThan(-100);
    });
  });

  describe('cleanTextForSpeech', () => {
    it('cleans markdown symbols, emojis, and converts ₹ into natural Hindi speech', () => {
      const dirtyText = '**कारीगर जी!** यह दीया ₹250 का है 🎨✨ [देखें](https://kalakar.in)';
      const cleaned = realisticVoiceService.cleanTextForSpeech(dirtyText, 'hi-IN');

      expect(cleaned).not.toContain('**');
      expect(cleaned).not.toContain('🎨');
      expect(cleaned).not.toContain('https://kalakar.in');
      expect(cleaned).toContain('250 रुपये');
    });

    it('converts ₹ into rupees when speaking English', () => {
      const dirtyText = 'Total price is ₹500 today!';
      const cleaned = realisticVoiceService.cleanTextForSpeech(dirtyText, 'en-IN');
      expect(cleaned).toContain('500 rupees');
    });
  });

  describe('safe lifecycle', () => {
    it('stops and checks isSpeaking safely in non-browser/test environment', () => {
      expect(realisticVoiceService.isSpeaking()).toBe(false);
      expect(() => realisticVoiceService.stop()).not.toThrow();
    });

    it('handles speak without crashing in Node test environment', () => {
      const onEnd = jest.fn();
      realisticVoiceService.speak('परीक्षण संदेश', { onEnd });
      expect(onEnd).toHaveBeenCalled();
    });
  });
});