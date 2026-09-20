import { geminiCatalogService } from '@/api/geminiCatalogService';
import { catalogSynthesisService } from '@/api/catalogSynthesisService';
import { resolveImagePayload } from '@/utils/imagePayloadHelper';

// Sample distinct 1x1 test image base64 strings representing 3 different products
const POTTERY_DIYA_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const TEXTILE_SAREE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const WOODEN_ELEPHANT_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOU+M9QDwAEfgGA99zP0QAAAABJRU5ErkJggg==';

describe('AI Multimodal Vision Image Understanding Pipeline', () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = geminiCatalogService.getApiKey();

  afterAll(() => {
    globalThis.fetch = originalFetch;
    geminiCatalogService.setApiKey(originalApiKey);
  });

  describe('1. Image Payload Resolution (URI → MIME → Bytes)', () => {
    it('should resolve base64 data without data-prefix correctly', async () => {
      const payload = await resolveImagePayload(POTTERY_DIYA_BASE64);
      expect(payload).not.toBeNull();
      expect(payload?.mimeType).toBe('image/jpeg');
      expect(payload?.base64).toBe(POTTERY_DIYA_BASE64);
      expect(payload?.byteCount).toBeGreaterThan(0);
    });

    it('should detect data:image/png URI prefix and extract clean base64', async () => {
      const dataUri = `data:image/png;base64,${TEXTILE_SAREE_BASE64}`;
      const payload = await resolveImagePayload(dataUri);
      expect(payload).not.toBeNull();
      expect(payload?.mimeType).toBe('image/png');
      expect(payload?.base64).toBe(TEXTILE_SAREE_BASE64);
    });

    it('should safely handle empty or null image URI', async () => {
      const payload = await resolveImagePayload('');
      expect(payload).toBeNull();
    });
  });

  describe('2. Three Visually Distinct Products Analysis & Disambiguation', () => {
    const interceptedRequests: any[] = [];

    beforeEach(() => {
      interceptedRequests.length = 0;
      geminiCatalogService.setApiKey('test_vision_api_key_valid_123456');

      // Intercept fetch calls to simulate Gemini Multimodal Vision API responses
      (globalThis as any).fetch = jest.fn().mockImplementation(async (url: string, options: any) => {
        const body = JSON.parse(options.body);
        interceptedRequests.push({ url, body });

        const parts = body.contents?.[0]?.parts || [];
        const inlineData = parts.find((p: any) => p.inlineData)?.inlineData;
        const base64Data = inlineData?.data;

        // Vision AI generates factual, image-specific observations based on incoming image bytes
        if (base64Data === POTTERY_DIYA_BASE64) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          productTitle: 'Handcrafted Terracotta Clay Diya Lamp',
                          titles: {
                            en: 'Handcrafted Terracotta Clay Diya Lamp',
                            hi: 'हाथ से बना टेराकोटा मिट्टी का दीया',
                            mr: 'हस्तनिर्मित मातीचा दिवा',
                          },
                          description:
                            'Traditional wheel-thrown earthen diya made from river alluvial clay, featuring a fluted rim reservoir for oil and cotton wicks.',
                          descriptions: {
                            en: 'Traditional wheel-thrown earthen diya made from river alluvial clay, featuring a fluted rim reservoir for oil and cotton wicks.',
                            hi: 'प्राकृतिक नदी की मिट्टी से चाक पर गढ़ा गया पारंपरिक दीया जिसमें गोल किनारा और तेल की बत्ती का स्थान है।',
                            mr: 'नदीच्या अस्सल मातीपासून चाकावर घडवलेला पारंपारिक दिवा.',
                          },
                          category: 'POTTERY',
                          craftCategoryCode: 'POTTERY_TERRACOTTA',
                          craftCategoryName: 'टेराकोटा मिट्टी शिल्प (Terracotta Pottery)',
                          categoryConfidence: 0.96,
                          visualAttributes: {
                            objectType: 'Terracotta Diya Lamp',
                            colors: ['Terracotta Red', 'Natural Earthen Brown'],
                            patterns: ['Fluted circular rim', 'Smooth inner bowl'],
                            material: 'Alluvial River Clay',
                            style: 'Traditional Folk Kiln-fired',
                            visibleFeatures: ['Conical oil basin', 'Pointed wick spout', 'Flat stable base'],
                          },
                          materials: ['Terracotta Clay'],
                          giTagCertified: false,
                          giRegion: 'Maharashtra',
                          dimensions: { formatted: '10cm x 10cm x 4cm' },
                          fairPricing: {
                            materialCost: 80,
                            laborHours: 4,
                            hourlyRate: 85,
                            giHeritageMultiplier: 1.1,
                            suggestedMin: 250,
                            suggestedRecommended: 420,
                            suggestedPremium: 650,
                            breakdownExplanation: 'Based on wheel-throwing and open-air kiln firing labor',
                          },
                          careInstructions: {
                            en: 'Wipe with dry cloth. Do not soak in cold water when heated.',
                            hi: 'सूखे कपड़े से साफ करें।',
                          },
                          tags: ['Terracotta', 'Diya', 'Handmade', 'Earthen'],
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (base64Data === TEXTILE_SAREE_BASE64) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          productTitle: 'Chanderi Handloom Silk Saree with Gold Zari',
                          titles: {
                            en: 'Chanderi Handloom Silk Saree with Gold Zari',
                            hi: 'चंदेरी हैंडलूम सिल्क साड़ी ज़री बॉर्डर सहित',
                            mr: 'चंदेरी हातमाग सिल्क साडी',
                          },
                          description:
                            'Pure mulberry silk saree intricately woven on pit looms with sheer texture, contrasting pallu, and metallic gold zari border motifs.',
                          descriptions: {
                            en: 'Pure mulberry silk saree intricately woven on pit looms with sheer texture, contrasting pallu, and metallic gold zari border motifs.',
                            hi: 'पारंपरिक करघे पर बुनी गई महीन चंदेरी रेशमी साड़ी जिसमें सुनहरा ज़री बॉर्डर और पारंपरिक बूटियां हैं।',
                            mr: 'हातमागावर विणलेली अस्सल चंदेरी रेशमी साडी सोनेरी जरीच्या काठासह.',
                          },
                          category: 'TEXTILE',
                          craftCategoryCode: 'TEXTILE_HANDLOOM',
                          craftCategoryName: 'हथकरघा वस्त्र शिल्प (Handloom Textiles)',
                          categoryConfidence: 0.98,
                          visualAttributes: {
                            objectType: 'Handloom Silk Saree',
                            colors: ['Emerald Green', 'Metallic Gold', 'Crimson Red'],
                            patterns: ['Floral Ashavali booti', 'Zari geometric patti border'],
                            material: 'Mulberry Silk and Metallic Zari Thread',
                            style: 'Chanderi Pit-loom Weaving',
                            visibleFeatures: ['Semi-sheer gossamer drape', 'Woven gold selvedge', 'Ornate pallu end'],
                          },
                          materials: ['Pure Silk', 'Zari Thread'],
                          giTagCertified: true,
                          giRegion: 'Madhya Pradesh',
                          dimensions: { formatted: '6.2 meters with blouse piece' },
                          fairPricing: {
                            materialCost: 950,
                            laborHours: 42,
                            hourlyRate: 95,
                            giHeritageMultiplier: 1.35,
                            suggestedMin: 3800,
                            suggestedRecommended: 5400,
                            suggestedPremium: 7200,
                            breakdownExplanation: 'Reflects 42 hours of fine warp-weft alignment on pit loom',
                          },
                          careInstructions: {
                            en: 'Dry clean only. Store wrapped in pure muslin cloth.',
                            hi: 'केवल ड्राई क्लीन करें। मलमल के कपड़े में रखें।',
                          },
                          tags: ['Chanderi', 'Handloom', 'SilkSaree', 'Zari'],
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        } else if (base64Data === WOODEN_ELEPHANT_BASE64) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          productTitle: 'Hand-Carved Wooden Royal Elephant Figurine',
                          titles: {
                            en: 'Hand-Carved Wooden Royal Elephant Figurine',
                            hi: 'हाथ से तराशी गई लकड़ी की हाथी मूर्ति',
                            mr: 'लाकडी कोरीव हत्ती मूर्ती',
                          },
                          description:
                            'Solid wood statuette hand-chiseled from seasoned timber, showing prominent raised trunk, decorative howdah blanket engraving, and visible natural woodgrain.',
                          descriptions: {
                            en: 'Solid wood statuette hand-chiseled from seasoned timber, showing prominent raised trunk, decorative howdah blanket engraving, and visible natural woodgrain.',
                            hi: 'मजबूत शीशम की लकड़ी से छेनी द्वारा तराशी गई शाही हाथी की मूर्ति, जिसमें उभरी हुई सूंड और सुंदर नक्काशीदार पीठ का आसन है।',
                            mr: 'नैसर्गिक लाकडापासून हाताने कोरलेली देखणी हत्तीची मूर्ती.',
                          },
                          category: 'WOOD',
                          craftCategoryCode: 'WOOD_CHANNAPATNA',
                          craftCategoryName: 'काष्ठ नक्काशी शिल्प (Wood Carving)',
                          categoryConfidence: 0.94,
                          visualAttributes: {
                            objectType: 'Carved Wood Elephant Figurine',
                            colors: ['Natural Walnut Brown', 'Amber Woodgrain'],
                            patterns: ['Geometric saddle carving', 'Incised ear contours'],
                            material: 'Seasoned Hardwood / Rosewood',
                            style: 'Traditional Indian Relief Chiseling',
                            visibleFeatures: ['Upraised trunk blessing posture', 'Polished matte finish', 'Carved tusks'],
                          },
                          materials: ['Hardwood', 'Natural Beeswax Polish'],
                          giTagCertified: false,
                          giRegion: 'Karnataka',
                          dimensions: { formatted: '15cm x 18cm x 8cm' },
                          fairPricing: {
                            materialCost: 280,
                            laborHours: 18,
                            hourlyRate: 90,
                            giHeritageMultiplier: 1.2,
                            suggestedMin: 1400,
                            suggestedRecommended: 1950,
                            suggestedPremium: 2600,
                            breakdownExplanation: 'Computed from wood seasoning and multi-stage manual relief carving',
                          },
                          careInstructions: {
                            en: 'Keep away from moisture and direct sunlight. Polish occasionally with beeswax.',
                            hi: 'नमी और सीधी धूप से दूर रखें।',
                          },
                          tags: ['WoodCarving', 'Elephant', 'HandcraftedWood', 'Figurine'],
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
          };
        }

        throw new Error('Unknown test image');
      });
    });

    it('should send actual image bytes and MIME type to Gemini Vision API', async () => {
      await geminiCatalogService.generateCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Kolhapur',
      });

      expect(interceptedRequests.length).toBe(1);
      const req = interceptedRequests[0];
      const inlineData = req.body.contents[0].parts.find((p: any) => p.inlineData)?.inlineData;

      // Prove that actual image bytes reach the vision layer
      expect(inlineData).toBeDefined();
      expect(inlineData.mimeType).toBe('image/jpeg');
      expect(inlineData.data).toBe(POTTERY_DIYA_BASE64);
    });

    it('should generate completely distinct, image-specific descriptions for 3 different images', async () => {
      // 1. Analyze Pottery Diya
      const resultDiya = await geminiCatalogService.generateCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Kolhapur',
      });

      // 2. Analyze Textile Saree
      const resultSaree = await geminiCatalogService.generateCatalog({
        imageBase64: TEXTILE_SAREE_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Chanderi',
      });

      // 3. Analyze Wooden Elephant
      const resultWood = await geminiCatalogService.generateCatalog({
        imageBase64: WOODEN_ELEPHANT_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Karnataka',
      });

      // Verify all succeeded
      expect(resultDiya.visionStatus).toBe('VISION_SUCCESS');
      expect(resultSaree.visionStatus).toBe('VISION_SUCCESS');
      expect(resultWood.visionStatus).toBe('VISION_SUCCESS');

      // CRITICAL ASSERTION: Detected object differs appropriately
      expect(resultDiya.visualAttributes?.objectType).toBe('Terracotta Diya Lamp');
      expect(resultSaree.visualAttributes?.objectType).toBe('Handloom Silk Saree');
      expect(resultWood.visualAttributes?.objectType).toBe('Carved Wood Elephant Figurine');

      // CRITICAL ASSERTION: Categories map to the actual visual craft
      expect(resultDiya.craftCategoryCode).toBe('POTTERY_TERRACOTTA');
      expect(resultSaree.craftCategoryCode).toBe('TEXTILE_HANDLOOM');
      expect(resultWood.craftCategoryCode).toBe('WOOD_CHANNAPATNA');

      // CRITICAL ASSERTION: Descriptions are strictly image-specific and DIFFERENT
      expect(resultDiya.descriptions.en).not.toEqual(resultSaree.descriptions.en);
      expect(resultSaree.descriptions.en).not.toEqual(resultWood.descriptions.en);
      expect(resultDiya.descriptions.en).not.toEqual(resultWood.descriptions.en);

      // Verify each description describes visible characteristics
      expect(resultDiya.descriptions.en.toLowerCase()).toContain('diya');
      expect(resultDiya.descriptions.en.toLowerCase()).toContain('clay');

      expect(resultSaree.descriptions.en.toLowerCase()).toContain('saree');
      expect(resultSaree.descriptions.en.toLowerCase()).toContain('silk');

      expect(resultWood.descriptions.en.toLowerCase()).toContain('wood');
      expect(resultWood.descriptions.en.toLowerCase()).toContain('trunk');

      // CRITICAL ASSERTION: Specifically detects the failure where different images produce same description
      const allDescriptions = [
        resultDiya.descriptions.en,
        resultSaree.descriptions.en,
        resultWood.descriptions.en,
      ];
      const uniqueDescriptions = new Set(allDescriptions);
      expect(uniqueDescriptions.size).toBe(3); // All 3 MUST be completely unique!
    });

    it('should strictly preserve seller-provided name verbatim across all generations', async () => {
      const SELLER_NAME = 'Sunita Devi';

      const resDiya = await geminiCatalogService.generateCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: SELLER_NAME,
      });

      const resSaree = await geminiCatalogService.generateCatalog({
        imageBase64: TEXTILE_SAREE_BASE64,
        artisanName: SELLER_NAME,
      });

      // Seller identity MUST NOT be modified, replaced, or guessed
      expect(resDiya.artisanName).toBe(SELLER_NAME);
      expect(resSaree.artisanName).toBe(SELLER_NAME);
    });

    it('should preserve seller-provided title if supplied', async () => {
      const CUSTOM_TITLE = 'Handcrafted Peacock Diya';

      const result = await geminiCatalogService.generateCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: 'Sunita Devi',
        productTitleHint: CUSTOM_TITLE,
      });

      expect(result.titles.en).toBe(CUSTOM_TITLE);
      expect(result.titles.hi).toBe(CUSTOM_TITLE);
    });
  });

  describe('3. Truthful Behavior When Vision Service is Unavailable (No Fake Fallback)', () => {
    beforeEach(() => {
      geminiCatalogService.setApiKey(''); // Unconfigure API key
    });

    it('should return VISION_UNAVAILABLE and NEVER generate canned/generic descriptions', async () => {
      const result = await geminiCatalogService.generateCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Kolhapur',
      });

      // Must return explicit truth state
      expect(result.visionStatus).toBe('VISION_UNAVAILABLE');
      expect(result.visionStatusMessage).toContain('AI image analysis is currently unavailable');
      expect(result.categoryConfidence).toBe(0.0);
      expect(result.visualAttributes).toBeUndefined();

      // Must NOT contain canned or fake paragraph
      expect(result.descriptions.en).not.toContain('Authentic traditional hand-painted artwork');
      expect(result.descriptions.en).not.toContain('This is a beautiful traditional handicraft');
      expect(result.descriptions.en).not.toContain('preserves centuries-old indigenous artisan techniques');
      expect(result.descriptions.en).toBe('');
    });

    it('should propagate truthful VISION_UNAVAILABLE through catalogSynthesisService', async () => {
      const synthResult = await catalogSynthesisService.synthesizeCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanName: 'Sunita Devi',
        artisanLocation: 'Kolhapur',
      });

      expect(synthResult.visionStatus).toBe('VISION_UNAVAILABLE');
      expect(synthResult.categoryConfidence).toBe(0.0);
      expect(synthResult.descriptions.en).toBe('');
      expect(synthResult.descriptions.en).not.toContain('Handcrafted Traditional Folk Art Painting');
    });

    it('should preserve spoken artisan transcript into description when vision is unavailable', async () => {
      const spokenStory = 'Main yeh diya apne haathon se bana rahi hoon, 5 ghante lage.';
      const synthResult = await catalogSynthesisService.synthesizeCatalog({
        imageBase64: POTTERY_DIYA_BASE64,
        artisanStoryTranscript: spokenStory,
        artisanName: 'Sunita Devi',
      });

      expect(synthResult.visionStatus).toBe('VISION_UNAVAILABLE');
      // When vision is unavailable, artisan's own spoken words and seller name are preserved without fake claims
      expect(synthResult.descriptions.en).toContain(spokenStory);
      expect(synthResult.descriptions.en).toContain('Sunita Devi');
    });
  });
});
