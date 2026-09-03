import { create } from 'zustand';
import { logger } from '@/utils/logger';
import { MultilingualText, CatalogSynthesisResult } from '@/api/catalogSynthesisService';
import { PricingResult } from '@/api/pricingService';
import { ProductListing } from '@/api/productService';

export type PhotoAngle = 'FRONT' | 'TEXTURE' | 'SIDE_BACK' | 'SCALE';
export type QualityScore = 'GOOD' | 'BLURRY' | 'DARK';
export type StudioBackgroundPreset = 'STUDIO_WHITE' | 'WARM_PARCHMENT' | 'STUDIO_GREY';

export interface QualityMetrics {
  sharpnessScore: number;
  colorAccuracyScore: number;
  segmentationConfidence: number;
}

export interface ProductPhoto {
  id: string;
  uri: string;
  angle: PhotoAngle;
  quality: QualityScore;
  isEnhanced: boolean;
  enhancedUri: string | null;
  qualityMetrics?: QualityMetrics;
  timestamp: number;
}

export interface ProductDraftState {
  photos: ProductPhoto[];
  primaryPhotoId: string | null;
  backgroundPreset: StudioBackgroundPreset;
  isCapturing: boolean;

  // Voice Description & Interview State
  voiceRecordingUri: string | null;
  voiceTranscript: string | null;
  extractedEntities: Record<string, any>;
  interviewAnswers: Record<string, any>;

  // AI Catalog Synthesis State
  titles: MultilingualText;
  descriptions: MultilingualText;
  careInstructions: { en: string; hi: string };
  tags: string[];
  craftCategoryCode: string;
  craftCategoryName: string;

  // Dynamic Fair Pricing State
  pricing: PricingResult | null;
  finalSellingPrice: number;

  // Final Published Product Result
  publishedProduct: ProductListing | null;

  // Actions
  addPhoto: (photo: Omit<ProductPhoto, 'id' | 'timestamp' | 'isEnhanced' | 'enhancedUri'>) => string;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, patch: Partial<ProductPhoto>) => void;
  setPrimaryPhoto: (id: string) => void;
  setBackgroundPreset: (preset: StudioBackgroundPreset) => void;
  setEnhancedPhoto: (id: string, enhancedUri: string, metrics?: QualityMetrics) => void;
  setVoiceStory: (uri: string, transcript: string, entities: Record<string, any>) => void;
  recordInterviewAnswer: (questionId: string, answer: any) => void;

  setCatalogSynthesis: (result: CatalogSynthesisResult) => void;
  updateTitle: (lang: keyof MultilingualText, text: string) => void;
  updateDescription: (lang: keyof MultilingualText, text: string) => void;
  setPricingResult: (pricing: PricingResult) => void;
  setFinalSellingPrice: (price: number) => void;
  setPublishedProduct: (product: ProductListing) => void;
  resetDraft: () => void;
}

export const useProductDraftStore = create<ProductDraftState>((set, get) => ({
  photos: [],
  primaryPhotoId: null,
  backgroundPreset: 'STUDIO_WHITE',
  isCapturing: false,

  voiceRecordingUri: null,
  voiceTranscript: null,
  extractedEntities: {},
  interviewAnswers: {},

  titles: { en: '', hi: '' },
  descriptions: { en: '', hi: '' },
  careInstructions: { en: '', hi: '' },
  tags: [],
  craftCategoryCode: 'TEXTILE_HANDLOOM',
  craftCategoryName: 'हस्तनिर्मित शिल्प',

  pricing: null,
  finalSellingPrice: 0,
  publishedProduct: null,

  addPhoto: (data) => {
    const id = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPhoto: ProductPhoto = {
      ...data,
      id,
      timestamp: Date.now(),
      isEnhanced: false,
      enhancedUri: null,
    };

    const currentPhotos = get().photos;
    const isFirst = currentPhotos.length === 0;

    set({
      photos: [...currentPhotos, newPhoto],
      primaryPhotoId: isFirst ? id : get().primaryPhotoId,
    });

    logger.info('PRODUCT_DRAFT', `Photo added: ${id} (${data.angle})`);
    return id;
  },

  removePhoto: (id: string) => {
    const filtered = get().photos.filter((p) => p.id !== id);
    const primaryId = get().primaryPhotoId === id ? (filtered[0]?.id ?? null) : get().primaryPhotoId;

    set({
      photos: filtered,
      primaryPhotoId: primaryId,
    });

    logger.info('PRODUCT_DRAFT', `Photo removed: ${id}`);
  },

  updatePhoto: (id: string, patch: Partial<ProductPhoto>) => {
    set({
      photos: get().photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  },

  setPrimaryPhoto: (id: string) => {
    set({ primaryPhotoId: id });
  },

  setBackgroundPreset: (preset: StudioBackgroundPreset) => {
    set({ backgroundPreset: preset });
    logger.info('PRODUCT_DRAFT', `Background preset changed to: ${preset}`);
  },

  setEnhancedPhoto: (id: string, enhancedUri: string, metrics?: QualityMetrics) => {
    set({
      photos: get().photos.map((p) =>
        p.id === id
          ? {
              ...p,
              isEnhanced: true,
              enhancedUri,
              qualityMetrics: metrics || {
                sharpnessScore: 0.94,
                colorAccuracyScore: 0.96,
                segmentationConfidence: 0.95,
              },
            }
          : p
      ),
    });
    logger.info('PRODUCT_DRAFT', `Photo enhanced: ${id}`);
  },

  setVoiceStory: (uri: string, transcript: string, entities: Record<string, any>) => {
    set({
      voiceRecordingUri: uri,
      voiceTranscript: transcript,
      extractedEntities: entities,
    });
    logger.info('PRODUCT_DRAFT', `Voice story saved. Transcript length: ${transcript.length}`);
  },

  recordInterviewAnswer: (questionId: string, answer: any) => {
    set({
      interviewAnswers: {
        ...get().interviewAnswers,
        [questionId]: answer,
      },
    });
    logger.info('PRODUCT_DRAFT', `Interview answer recorded for ${questionId}`);
  },

  setCatalogSynthesis: (result: CatalogSynthesisResult) => {
    set({
      titles: result.titles,
      descriptions: result.descriptions,
      careInstructions: result.careInstructions,
      tags: result.tags,
      craftCategoryCode: result.craftCategoryCode,
      craftCategoryName: result.craftCategoryName,
    });
    logger.info('PRODUCT_DRAFT', 'AI Catalog synthesis applied to draft');
  },

  updateTitle: (lang: keyof MultilingualText, text: string) => {
    set({
      titles: {
        ...get().titles,
        [lang]: text,
      },
    });
  },

  updateDescription: (lang: keyof MultilingualText, text: string) => {
    set({
      descriptions: {
        ...get().descriptions,
        [lang]: text,
      },
    });
  },

  setPricingResult: (pricing: PricingResult) => {
    set({
      pricing,
      finalSellingPrice: pricing.suggested_price,
    });
    logger.info('PRODUCT_DRAFT', `Fair pricing recorded: ₹${pricing.suggested_price}`);
  },

  setFinalSellingPrice: (price: number) => {
    set({ finalSellingPrice: price });
    logger.info('PRODUCT_DRAFT', `Artisan final price set: ₹${price}`);
  },

  setPublishedProduct: (product: ProductListing) => {
    set({ publishedProduct: product });
    logger.info('PRODUCT_DRAFT', `Product published: ${product.id}`);
  },

  resetDraft: () => {
    set({
      photos: [],
      primaryPhotoId: null,
      backgroundPreset: 'STUDIO_WHITE',
      isCapturing: false,
      voiceRecordingUri: null,
      voiceTranscript: null,
      extractedEntities: {},
      interviewAnswers: {},
      titles: { en: '', hi: '' },
      descriptions: { en: '', hi: '' },
      careInstructions: { en: '', hi: '' },
      tags: [],
      craftCategoryCode: 'TEXTILE_HANDLOOM',
      craftCategoryName: 'हस्तनिर्मित शिल्प',
      pricing: null,
      finalSellingPrice: 0,
      publishedProduct: null,
    });
    logger.info('PRODUCT_DRAFT', 'Product draft reset');
  },
}));
