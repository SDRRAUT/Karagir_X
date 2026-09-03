import { voiceService } from '@/api/voiceService';

describe('VoiceService', () => {
  it('transcribes voice audio and extracts craft entities', async () => {
    const result = await voiceService.transcribeDescription('file:///mock/audio.wav', 'hi');

    expect(result.transcript).toBeDefined();
    expect(result.transcript.length).toBeGreaterThan(10);
    expect(result.extractedEntities).toBeDefined();
    expect(result.extractedEntities.material).toBeDefined();
    expect(result.nextQuestion).toBeDefined();
    expect(result.isComplete).toBe(false);
  });

  it('submits follow-up answer and returns next interview question or completes', async () => {
    const turn1 = await voiceService.submitFollowUpAnswer('labor_time', 20);
    expect(turn1.nextQuestion).toBeDefined();
    expect(turn1.isComplete).toBe(false);

    const turn2 = await voiceService.submitFollowUpAnswer('materials_used', 'Pure Silk');
    expect(turn2.nextQuestion).toBeDefined();

    const turn3 = await voiceService.submitFollowUpAnswer('craft_motif', 'Matsya');
    expect(turn3.isComplete).toBe(true);
  });
});
