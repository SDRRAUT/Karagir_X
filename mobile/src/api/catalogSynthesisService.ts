import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { logger } from '@/utils/logger';
import { geminiCatalogService, GeminiStructuredCatalog, VisualAttributes } from './geminiCatalogService';

export interface MultilingualText {
  en: string;
  hi: string;
  bn?: string;
  mr?: string;
  ta?: string;
}

export interface CatalogSynthesisResult {
  titles: MultilingualText;
  descriptions: MultilingualText;
  careInstructions: {
    en: string;
    hi: string;
  };
  tags: string[];
  craftCategoryCode: string;
  craftCategoryName: string;
  visionStatus?: 'VISION_SUCCESS' | 'VISION_UNAVAILABLE';
  visionStatusMessage?: string;
  visualAttributes?: VisualAttributes;
  categoryConfidence?: number;
  giTagCertified?: boolean;
  giRegion?: string;
  fairPricing?: {
    materialCost: number;
    laborHours: number;
    hourlyRate: number;
    giHeritageMultiplier: number;
    suggestedMin: number;
    suggestedRecommended: number;
    suggestedPremium: number;
    breakdownExplanation: string;
  };
  dimensions?: {
    heightCm?: number;
    widthCm?: number;
    depthCm?: number;
    weightGrams?: number;
    formatted: string;
  };
}

export interface SynthesizeCatalogPayload {
  craftCategoryCode?: string;
  imageBase64?: string;
  entities?: {
    material?: string;
    technique?: string;
    motif?: string;
    laborHours?: number;
    [key: string]: any;
  };
  artisanStoryTranscript?: string;
  artisanName?: string;
  artisanLocation?: string;
  productTitleHint?: string;
  apiKey?: string;
}

export class CatalogSynthesisService {
  /**
   * Synthesizes trilingual SEO-optimized titles, cultural storytelling descriptions, and tags
   * using Google Gemini Multimodal Vision API with truthful fallback when unconfigured.
   */
  public async synthesizeCatalog(
    payload: SynthesizeCatalogPayload
  ): Promise<CatalogSynthesisResult> {
    try {
      const geminiResult = await geminiCatalogService.generateCatalog({
        imageBase64: payload.imageBase64,
        voiceTranscript: payload.artisanStoryTranscript,
        artisanName: payload.artisanName,
        artisanLocation: payload.artisanLocation,
        craftCategoryHint: payload.craftCategoryCode,
        productTitleHint: payload.productTitleHint,
        apiKey: payload.apiKey,
      });

      return {
        titles: geminiResult.titles,
        descriptions: geminiResult.descriptions,
        careInstructions: geminiResult.careInstructions,
        tags: geminiResult.tags,
        craftCategoryCode: geminiResult.craftCategoryCode,
        craftCategoryName: geminiResult.craftCategoryName,
        visionStatus: geminiResult.visionStatus,
        visionStatusMessage: geminiResult.visionStatusMessage,
        visualAttributes: geminiResult.visualAttributes,
        categoryConfidence: geminiResult.categoryConfidence,
        giTagCertified: geminiResult.giTagCertified,
        giRegion: geminiResult.giRegion,
        fairPricing: geminiResult.fairPricing,
        dimensions: geminiResult.dimensions,
      };
    } catch (_error) {
      logger.warn('CATALOG_SYNTHESIS', 'Gemini synthesis error, using truthful unavailable response');

      const unavailable = geminiCatalogService.generateTruthfulUnavailableResponse({
        voiceTranscript: payload.artisanStoryTranscript,
        artisanName: payload.artisanName,
        artisanLocation: payload.artisanLocation,
        craftCategoryHint: payload.craftCategoryCode,
        productTitleHint: payload.productTitleHint,
      });

      return {
        titles: unavailable.titles,
        descriptions: unavailable.descriptions,
        careInstructions: unavailable.careInstructions,
        tags: unavailable.tags,
        craftCategoryCode: unavailable.craftCategoryCode,
        craftCategoryName: unavailable.craftCategoryName,
        visionStatus: 'VISION_UNAVAILABLE',
        visionStatusMessage:
          'AI image analysis is currently unavailable. Please enter the description manually or configure the AI vision service.',
        categoryConfidence: 0.0,
        giTagCertified: false,
        giRegion: unavailable.giRegion,
      };
    }
  }
}

export const catalogSynthesisService = new CatalogSynthesisService();
