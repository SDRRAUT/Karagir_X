import { logger } from '@/utils/logger';
import { MultilingualText } from './catalogSynthesisService';
import { resolveImagePayload, ResolvedImagePayload } from '@/utils/imagePayloadHelper';

export interface GeminiCatalogInput {
  imageBase64?: string; // base64, file:// URI, or data URL
  voiceTranscript?: string; // Spoken artisan description
  artisanName?: string;
  artisanLocation?: string;
  craftCategoryHint?: string;
  productTitleHint?: string;
  apiKey?: string;
}

export interface VisualAttributes {
  objectType: string;
  colors: string[];
  patterns: string[];
  material: string;
  style: string;
  visibleFeatures: string[];
}

export interface GeminiStructuredCatalog {
  visionStatus: 'VISION_SUCCESS' | 'VISION_UNAVAILABLE';
  visionStatusMessage?: string;
  productTitle?: string;
  titles: MultilingualText;
  descriptions: MultilingualText;
  craftCategoryCode: string;
  craftCategoryName: string;
  categoryConfidence?: number;
  visualAttributes?: VisualAttributes;
  artisanName?: string;
  giTagCertified: boolean;
  giRegion: string;
  materials: string[];
  dimensions: {
    heightCm?: number;
    widthCm?: number;
    depthCm?: number;
    weightGrams?: number;
    formatted: string;
  };
  fairPricing: {
    materialCost: number;
    laborHours: number;
    hourlyRate: number;
    giHeritageMultiplier: number;
    suggestedMin: number;
    suggestedRecommended: number;
    suggestedPremium: number;
    breakdownExplanation: string;
  };
  careInstructions: {
    en: string;
    hi: string;
  };
  tags: string[];
}

export class GeminiCatalogService {
  private defaultApiKey: string = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  /**
   * Set dynamic API key at runtime if artisan or admin provides one
   */
  public setApiKey(key: string) {
    this.defaultApiKey = key ? key.trim() : '';
  }

  public getApiKey(): string {
    return this.defaultApiKey;
  }

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 10);
  }

  /**
   * Calls Google Gemini Multimodal Vision API with actual product image bytes.
   * If unconfigured, returns an honest VISION_UNAVAILABLE response without fake descriptions.
   */
  public async generateCatalog(input: GeminiCatalogInput): Promise<GeminiStructuredCatalog> {
    const key = input.apiKey || this.defaultApiKey;

    // 1. Resolve image payload to real base64 bytes and MIME type
    let resolvedImage: ResolvedImagePayload | null = null;
    if (input.imageBase64) {
      resolvedImage = await resolveImagePayload(input.imageBase64);
    }

    if (key && key.trim().length > 10) {
      try {
        logger.info('AI-VISION', 'Initiating real Gemini Multimodal Vision analysis...', {
          hasImageBytes: Boolean(resolvedImage?.base64),
          mimeType: resolvedImage?.mimeType || 'unknown',
          byteCount: resolvedImage?.byteCount || 0,
        });

        return await this.callGeminiVisionApi(input, resolvedImage, key.trim());
      } catch (error) {
        const safeMsg = (error instanceof Error ? error.message : String(error)).replace(
          /[A-Za-z0-9_-]{20,}/g,
          '[REDACTED]'
        );
        logger.warn('AI-VISION', 'Gemini Vision API request failed', { error: safeMsg });
      }
    } else {
      logger.info('AI-VISION', 'Gemini Vision API key is not configured; returning VISION_UNAVAILABLE state');
    }

    // Truthful fallback: Return explicit VISION_UNAVAILABLE state with no fake/canned descriptions
    return this.generateTruthfulUnavailableResponse(input);
  }

  private async callGeminiVisionApi(
    input: GeminiCatalogInput,
    imagePayload: ResolvedImagePayload | null,
    apiKey: string
  ): Promise<GeminiStructuredCatalog> {
    const primaryModel = 'gemini-2.5-flash';
    const fallbackModel = 'gemini-1.5-flash';

    try {
      return await this.executeGeminiRequest(primaryModel, input, imagePayload, apiKey);
    } catch (primaryError) {
      logger.warn('AI-VISION', `Primary model ${primaryModel} error, trying fallback ${fallbackModel}`);
      return await this.executeGeminiRequest(fallbackModel, input, imagePayload, apiKey);
    }
  }

  private async executeGeminiRequest(
    modelName: string,
    input: GeminiCatalogInput,
    imagePayload: ResolvedImagePayload | null,
    apiKey: string
  ): Promise<GeminiStructuredCatalog> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

    const effectiveArtisan = input.artisanName || 'Master Artisan';

    const promptText = `
You are Kalakar Setu's AI Multimodal Image Understanding Engine for Indian Handcrafted Products.

Analyze the actual attached product image and extract FACTUAL visual observations.
Artisan / Seller Name: "${effectiveArtisan}"
${input.productTitleHint ? `Seller-Provided Title: "${input.productTitleHint}"` : ''}
${input.voiceTranscript ? `Artisan Spoken Description: "${input.voiceTranscript}"` : ''}

CRITICAL MANDATORY RULES:
1. SELLER IDENTITY IS SACROSANCT:
   - The seller entered their name as: "${effectiveArtisan}".
   - You must NEVER change, invent, translate, or replace this name.
   - Seller-entered facts have strict priority over AI guesses.
2. IMAGE-SPECIFIC ANALYSIS:
   - Your description MUST describe what is visually present in the image: object type, visible shapes, colors, patterns, and visible crafting details.
   - DO NOT use generic phrases like "This is a beautiful handicraft" for every product.
   - Different product images MUST produce clearly different, factual descriptions.
3. DO NOT INVENT UNVERIFIABLE FACTS:
   - Do NOT invent exact dimensions, weight, age, or historical pedigree unless provided by the seller.
   - Keep observations strictly grounded in what is visible in the image.
4. CATEGORY NORMALIZATION:
   - Map to one of: "POTTERY", "TEXTILE", "PAINTING", "WOOD", "METAL", "OTHER".
   - Provide a category confidence score between 0.0 and 1.0.

Return ONLY a valid JSON object matching this exact schema:
{
  "productTitle": "Factual descriptive title in English",
  "titles": {
    "en": "Descriptive title in English",
    "hi": "Descriptive title in Hindi",
    "mr": "Descriptive title in Marathi"
  },
  "description": "Image-specific factual description in English",
  "descriptions": {
    "en": "Factual, visually grounded description in English describing visible object, colors, materials, and features",
    "hi": "Factual, visually grounded description in Hindi",
    "mr": "Factual, visually grounded description in Marathi"
  },
  "category": "POTTERY" | "TEXTILE" | "PAINTING" | "WOOD" | "METAL" | "OTHER",
  "craftCategoryCode": "POTTERY_TERRACOTTA" | "PAINTING_MITHILA" | "TEXTILE_HANDLOOM" | "METAL_DHOKRA" | "WOOD_CHANNAPATNA" | "OTHER",
  "craftCategoryName": "Readable Craft Category Name",
  "categoryConfidence": 0.95,
  "visualAttributes": {
    "objectType": "Specific object detected (e.g. Diya lamp, Silk Saree, Carved Elephant)",
    "colors": ["List visible colors, e.g. terracotta red, natural clay"],
    "patterns": ["List visible patterns, e.g. floral engraving, geometric border"],
    "material": "Visible material, e.g. alluvial clay, pure silk, seasoned wood, brass metal",
    "style": "Visible artistic style, e.g. traditional folk, tribal lost-wax, handloom",
    "visibleFeatures": ["List 2-4 key features clearly seen in image"]
  },
  "materials": ["List visible materials"],
  "giTagCertified": false,
  "giRegion": "${input.artisanLocation || 'India'}",
  "dimensions": {
    "formatted": "Standard artisan craft scale"
  },
  "fairPricing": {
    "materialCost": 200,
    "laborHours": 6,
    "hourlyRate": 90,
    "giHeritageMultiplier": 1.2,
    "suggestedMin": 500,
    "suggestedRecommended": 850,
    "suggestedPremium": 1200,
    "breakdownExplanation": "Calculated based on estimated labor and material floor"
  },
  "careInstructions": {
    "en": "Handle with care.",
    "hi": "सावधानी से रखें।"
  },
  "tags": ["Handmade", "VocalForLocal", "AuthenticCraft"]
}
`;

    const parts: any[] = [{ text: promptText }];

    // Attach real image bytes if available
    if (imagePayload && imagePayload.base64 && imagePayload.base64.length > 50) {
      parts.unshift({
        inlineData: {
          mimeType: imagePayload.mimeType || 'image/jpeg',
          data: imagePayload.base64,
        },
      });

      logger.info('AI-VISION', 'Attached real image bytes to vision request', {
        model: modelName,
        mimeType: imagePayload.mimeType,
        byteCount: imagePayload.byteCount,
        visionRequest: 'sent',
      });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.15,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      const safeErrText = errText.replace(/[A-Za-z0-9_-]{20,}/g, '[REDACTED]');
      throw new Error(`Gemini API error (${response.status}): ${safeErrText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No candidate content received from Gemini Vision');
    }

    const cleanJson = candidateText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleanJson);
    if (!parsed || !parsed.titles || !parsed.descriptions) {
      throw new Error('Gemini Vision response missing essential catalog fields');
    }

    // Strictly enforce seller identity priority
    parsed.artisanName = input.artisanName;
    if (input.productTitleHint && input.productTitleHint.trim()) {
      parsed.titles.en = input.productTitleHint.trim();
      parsed.titles.hi = input.productTitleHint.trim();
    }

    parsed.visionStatus = 'VISION_SUCCESS';
    parsed.visionStatusMessage = 'Image analyzed ✓';

    logger.info('AI-VISION', 'Successfully synthesized image-specific catalog with Gemini Vision', {
      detectedObject: parsed.visualAttributes?.objectType,
      category: parsed.category || parsed.craftCategoryCode,
      confidence: parsed.categoryConfidence,
    });

    return parsed as GeminiStructuredCatalog;
  }

  /**
   * Truthful fallback when no real Multimodal Vision API is configured or vision fails.
   * Strictly avoids pretending analysis occurred or inventing canned descriptions.
   */
  public generateTruthfulUnavailableResponse(input: GeminiCatalogInput): GeminiStructuredCatalog {
    const rawTranscript = (input.voiceTranscript || '').trim();
    const effectiveArtisan = input.artisanName || 'Master Artisan';
    const effectiveTitle = input.productTitleHint || 'हस्तनिर्मित शिल्प (Handcrafted Artisan Item)';

    const textToCheck = `${rawTranscript} ${input.productTitleHint || ''} ${input.craftCategoryHint || ''}`.toLowerCase();
    let derivedCategoryCode = input.craftCategoryHint || '';
    let derivedCategoryName = 'पारंपरिक शिल्प (Handicrafts)';

    if (!derivedCategoryCode) {
      if (
        textToCheck.includes('silk') ||
        textToCheck.includes('saree') ||
        textToCheck.includes('handloom') ||
        textToCheck.includes('textile') ||
        textToCheck.includes('साड़ी') ||
        textToCheck.includes('रेशम')
      ) {
        derivedCategoryCode = 'TEXTILE_HANDLOOM';
        derivedCategoryName = 'हथकरघा वस्त्र (Handloom Textiles)';
      } else if (
        textToCheck.includes('painting') ||
        textToCheck.includes('mithila') ||
        textToCheck.includes('madhubani') ||
        textToCheck.includes('पेंटिंग') ||
        textToCheck.includes('चित्र')
      ) {
        derivedCategoryCode = 'PAINTING_MITHILA';
        derivedCategoryName = 'पारंपरिक लोक चित्रकला (Mithila Folk Painting)';
      } else if (
        textToCheck.includes('metal') ||
        textToCheck.includes('dhokra') ||
        textToCheck.includes('brass') ||
        textToCheck.includes('bell metal') ||
        textToCheck.includes('धातु')
      ) {
        derivedCategoryCode = 'METAL_DHOKRA';
        derivedCategoryName = 'ढोकरा धातु शिल्प (Dhokra Bell Metal)';
      } else if (
        textToCheck.includes('wood') ||
        textToCheck.includes('carv') ||
        textToCheck.includes('elephant') ||
        textToCheck.includes('लकड़ी')
      ) {
        derivedCategoryCode = 'WOOD_CHANNAPATNA';
        derivedCategoryName = 'काष्ठ नक्काशी शिल्प (Wood Carving)';
      } else {
        derivedCategoryCode = 'POTTERY_TERRACOTTA';
        derivedCategoryName = 'टेराकोटा मिट्टी शिल्प (Terracotta Pottery)';
      }
    }

    const enDesc = rawTranscript
      ? input.artisanName
        ? `${rawTranscript} — Handcrafted by ${input.artisanName}`
        : rawTranscript
      : '';
    const hiDesc = rawTranscript
      ? input.artisanName
        ? `${rawTranscript} — कारीगर: ${input.artisanName}`
        : rawTranscript
      : '';
    const mrDesc = rawTranscript
      ? input.artisanName
        ? `${rawTranscript} — कारागीर: ${input.artisanName}`
        : rawTranscript
      : '';

    return {
      visionStatus: 'VISION_UNAVAILABLE',
      visionStatusMessage:
        'AI image analysis is currently unavailable. Please enter the description manually or configure the AI vision service.',
      productTitle: input.productTitleHint || undefined,
      titles: {
        en: input.productTitleHint || 'Handcrafted Artisan Item',
        hi: input.productTitleHint || 'हस्तनिर्मित शिल्प उत्पाद',
        mr: input.productTitleHint || 'हस्तनिर्मित कला वस्तू',
      },
      descriptions: {
        en: enDesc,
        hi: hiDesc,
        mr: mrDesc,
      },
      craftCategoryCode: derivedCategoryCode,
      craftCategoryName: derivedCategoryName,
      categoryConfidence: 0.0,
      visualAttributes: undefined,
      artisanName: input.artisanName,
      giTagCertified: false,
      giRegion: input.artisanLocation || 'India',
      materials: [],
      dimensions: {
        formatted: 'Standard scale',
      },
      fairPricing: {
        materialCost: 200,
        laborHours: 6,
        hourlyRate: 90,
        giHeritageMultiplier: 1.0,
        suggestedMin: 500,
        suggestedRecommended: 850,
        suggestedPremium: 1200,
        breakdownExplanation: 'Artisan benchmark estimate',
      },
      careInstructions: {
        en: 'Handle with care.',
        hi: 'सावधानी से रखें।',
      },
      tags: ['Handmade', 'ArtisanDirect', 'VocalForLocal', 'CraftHeritage'],
    };
  }
}

export const geminiCatalogService = new GeminiCatalogService();
