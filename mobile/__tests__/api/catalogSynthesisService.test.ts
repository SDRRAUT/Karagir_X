import { catalogSynthesisService } from '@/api/catalogSynthesisService';

describe('CatalogSynthesisService', () => {
  it('synthesizes trilingual titles, descriptions, and tags from craft entities', async () => {
    const result = await catalogSynthesisService.synthesizeCatalog({
      entities: {
        material: 'Handmade Mulberry Silk',
        motif: 'Tree of Life',
        laborHours: 32,
      },
      artisanStoryTranscript: 'यह सिल्क पर बनाई गई पारंपरिक पेंटिंग है।',
    });

    expect(result.titles.en).toContain('Handcrafted');
    expect(result.titles.hi).toBeDefined();
    expect(result.descriptions.en).toBeDefined();
    expect(result.descriptions.hi).toBeDefined();
    expect(result.tags.length).toBeGreaterThan(3);
    expect(result.careInstructions.en).toBeDefined();
  });
});
