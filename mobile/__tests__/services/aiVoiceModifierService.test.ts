import { aiVoiceModifierService } from '@/services/aiVoiceModifierService';

describe('AiVoiceModifierService', () => {
  it('cleans fillers and extracts terracotta craft entities from spoken text', () => {
    const rawSpeech = 'umm basically ye Kolhapuri terracotta diya hai mitti se bana aur chak par ghadha 2 din me';
    const result = aiVoiceModifierService.generateIndicNlpPolish(rawSpeech, 'product_story');

    expect(result.originalText).toBe(rawSpeech);
    expect(result.modifiedText).toContain('Kolhapuri terracotta diya');
    expect(result.extractedAttributes.craftCategory).toBe('POTTERY_TERRACOTTA');
    expect(result.extractedAttributes.material).toContain('Natural Riverbed Clay');
    expect(result.extractedAttributes.technique).toContain('Wheel Technique');
    expect(result.extractedAttributes.laborHours).toBe(16);
    expect(result.explanation).toBeDefined();
  });

  it('extracts handloom silk and peacock motif entities', () => {
    const rawSpeech = 'Pure silk saree with mayur peacock motif handloom weave in 3 din';
    const result = aiVoiceModifierService.generateIndicNlpPolish(rawSpeech, 'product_story');

    expect(result.extractedAttributes.craftCategory).toBe('TEXTILE_HANDLOOM');
    expect(result.extractedAttributes.material).toContain('Mulberry Silk');
    expect(result.extractedAttributes.motif).toContain('Mayur');
    expect(result.extractedAttributes.laborHours).toBe(24);
  });

  it('optimizes search queries for marketplace catalog', () => {
    const rawSpeech = 'mujhe Banarasi silk saree dikhao please';
    const result = aiVoiceModifierService.generateIndicNlpPolish(rawSpeech, 'search');

    expect(result.modifiedText).toBe('Banarasi silk saree');
  });

  it('correctly routes earnings query in Voice Saathi assistant', () => {
    const response = aiVoiceModifierService.processSaathiQuery('Aaj kitna kamaya?');

    expect(response.actionType).toBe('earnings');
    expect(response.replyText).toContain('₹2,400');
    expect(response.audioText).toBeDefined();
  });

  it('correctly routes orders query in Voice Saathi assistant', () => {
    const response = aiVoiceModifierService.processSaathiQuery('Naya order dikhao');

    expect(response.actionType).toBe('orders');
    expect(response.replyText).toContain('orders pending');
  });

  it('correctly routes pricing query in Voice Saathi assistant', () => {
    const response = aiVoiceModifierService.processSaathiQuery('Diya ka price kya hai?');

    expect(response.actionType).toBe('price');
    expect(response.replyText).toContain('₹850');
  });

  it('correctly routes schemes query in Voice Saathi assistant', () => {
    const response = aiVoiceModifierService.processSaathiQuery('PM Vishwakarma yojana ke baare me batao');

    expect(response.actionType).toBe('schemes');
    expect(response.replyText).toContain('PM Vishwakarma');
  });

  it('correctly routes craft creation inquiry in Voice Saathi assistant', () => {
    const response = aiVoiceModifierService.processSaathiQuery('Mujhe terracotta diya ka naya product listing karna hai');

    expect(response.actionType).toBe('create');
    expect(response.replyText).toContain('AI studio photo aur GI catalog');
  });

  it('generates Marathi craft story polish with authentic phrasing', async () => {
    const rawMarathi = 'ha maatiche dive ahet, 16 taas lagle aani 150 rupaye kharch';
    const result = await aiVoiceModifierService.modifyWithAi(rawMarathi, 'product_story', 'mr-IN');

    expect(result.originalText).toBe(rawMarathi);
    expect(result.modifiedText).toContain('अस्सल हस्तकला:');
    expect(result.explanation).toContain('AI ने');
    expect(result.extractedAttributes.craftCategory).toBe('POTTERY_TERRACOTTA');
  });

  it('generates English craft story polish with e-commerce narrative', async () => {
    const rawEnglish = 'handcrafted terracotta diya set shaped on wheel with 2 days labor';
    const result = await aiVoiceModifierService.modifyWithAi(rawEnglish, 'product_story', 'en-IN');

    expect(result.originalText).toBe(rawEnglish);
    expect(result.modifiedText).toContain('Authentic Handcrafted Masterpiece:');
    expect(result.explanation).toContain('AI removed vocal fillers');
    expect(result.extractedAttributes.laborHours).toBe(16);
  });
});
