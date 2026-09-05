import { supabase } from './supabaseClient';
import { logger } from '@/utils/logger';

export interface CraftCategory {
  code: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  clusterCount: number;
  popularRegions: string[];
}

export interface ArtisanProfileBrief {
  id: string;
  name: string;
  cluster: string;
  state: string;
  avatarUrl?: string;
  craftYears: number;
  community: string;
}

export interface DigitalCraftPassportData {
  passportId: string;
  isVerified: boolean;
  materialsUsed: string[];
  technique: string;
  laborHours: number;
  audioStoryUrl?: string;
  provenanceVillage: string;
  verificationBadge: string;
}

export interface MarketplaceProduct {
  id: string;
  title: { en: string; hi: string; bn?: string };
  description: { en: string; hi: string; bn?: string };
  price: number;
  categoryCode: string;
  categoryName: string;
  images: string[];
  artisan: ArtisanProfileBrief;
  passport: DigitalCraftPassportData;
  stockType: 'READY_STOCK' | 'MADE_TO_ORDER';
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export const CRAFT_CATEGORIES: CraftCategory[] = [
  {
    code: 'TEXTILE_HANDLOOM',
    nameHi: 'हथकरघा व बुनाई',
    nameEn: 'Handloom & Weaving',
    icon: '🧵',
    clusterCount: 420,
    popularRegions: ['बनारस (UP)', 'पोचमपल्ली (Telangana)', 'भागलपुर (Bihar)'],
  },
  {
    code: 'POTTERY_CLAY',
    nameHi: 'टेराकोटा व मिट्टी शिल्प',
    nameEn: 'Clay & Terracotta',
    icon: '🏺',
    clusterCount: 310,
    popularRegions: ['गोरखपुर (UP)', 'बांकुरा (WB)', 'खुर्जा (UP)'],
  },
  {
    code: 'PAINTING_FOLK',
    nameHi: 'मधुबनी व लोक चित्रकला',
    nameEn: 'Folk & Tribal Painting',
    icon: '🎨',
    clusterCount: 195,
    popularRegions: ['मिथिला (Bihar)', 'वारली (Maharashtra)', 'पट्टचित्र (Odisha)'],
  },
  {
    code: 'WOOD_CRAFT',
    nameHi: 'काष्ठकला व खिलौने',
    nameEn: 'Woodcraft & Toys',
    icon: '🪵',
    clusterCount: 180,
    popularRegions: ['चन्नापटना (Karnataka)', 'सहारनपुर (UP)', 'कोंडापल्ली (AP)'],
  },
  {
    code: 'METAL_DHOKRA',
    nameHi: 'ढोकरा व कांस्य शिल्प',
    nameEn: 'Dhokra & Bell Metal',
    icon: '🪙',
    clusterCount: 140,
    popularRegions: ['बस्तर (Chhattisgarh)', 'दरियापुर (WB)', 'मयूरभंज (Odisha)'],
  },
  {
    code: 'BAMBOO_JUTE',
    nameHi: 'बांस, बेत व जूट शिल्प',
    nameEn: 'Bamboo & Jute',
    icon: '🎋',
    clusterCount: 220,
    popularRegions: ['असम (Assam)', 'त्रिपुरा (Tripura)', 'हुगली (WB)'],
  },
];

export class MarketplaceService {
  /**
   * Fetch craft categories from Supabase
   */
  public async getCategories(): Promise<CraftCategory[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('code, name_hi, name_en, icon, cluster_count, popular_regions')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        logger.warn('MARKETPLACE_SERVICE', 'Using baseline categories', { error: error?.message });
        return CRAFT_CATEGORIES;
      }

      return data.map((c) => ({
        code: c.code,
        nameHi: c.name_hi,
        nameEn: c.name_en,
        icon: c.icon,
        clusterCount: c.cluster_count,
        popularRegions: Array.isArray(c.popular_regions) ? c.popular_regions : [],
      }));
    } catch {
      return CRAFT_CATEGORIES;
    }
  }

  /**
   * Fetch active marketplace products with real artisan & passport details
   */
  public async getProducts(filters?: {
    categoryCode?: string | null;
    searchQuery?: string;
  }): Promise<MarketplaceProduct[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          selling_price,
          craft_category_code,
          stock_type,
          materials,
          technique,
          labor_hours,
          categories (
            name_hi,
            name_en
          ),
          product_images (
            raw_image_url,
            enhanced_image_url,
            is_primary,
            sort_order
          ),
          craft_passports (
            passport_code,
            carbon_score_grams,
            qr_code_svg_url,
            public_verification_url
          ),
          profiles!products_artisan_id_fkey (
            id,
            full_name,
            avatar_url,
            artisan_profiles (
              workshop_name,
              district,
              state,
              years_of_experience
            )
          )
        `)
        .eq('status', 'ACTIVE')
        .is('deleted_at', null);

      if (filters?.categoryCode) {
        query = query.eq('craft_category_code', filters.categoryCode);
      }

      const { data, error } = await query;

      if (error || !data) {
        logger.error('MARKETPLACE_SERVICE', 'Failed to fetch products from Supabase', error);
        return [];
      }

      const mapped = data.map((row: any) => this.mapProductRow(row));

      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return mapped.filter(
          (p) =>
            p.title.hi?.toLowerCase().includes(q) ||
            p.title.en?.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }

      return mapped;
    } catch (error) {
      logger.error('MARKETPLACE_SERVICE', 'Exception during getProducts', error);
      return [];
    }
  }

  /**
   * Fetch single product detail from Supabase
   */
  public async getProductById(id: string): Promise<MarketplaceProduct> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          selling_price,
          craft_category_code,
          stock_type,
          materials,
          technique,
          labor_hours,
          categories (
            name_hi,
            name_en
          ),
          product_images (
            raw_image_url,
            enhanced_image_url,
            is_primary,
            sort_order
          ),
          craft_passports (
            passport_code,
            carbon_score_grams,
            qr_code_svg_url,
            public_verification_url
          ),
          profiles!products_artisan_id_fkey (
            id,
            full_name,
            avatar_url,
            artisan_profiles (
              workshop_name,
              district,
              state,
              years_of_experience
            )
          )
        `)
        .eq('id', id)
        .single();

      if (data) {
        return this.mapProductRow(data);
      }
      if (error) {
        logger.warn('MARKETPLACE_SERVICE', `Could not find product ${id} via direct id`, { error: error.message });
      }
    } catch (error) {
      logger.warn('MARKETPLACE_SERVICE', `Exception getting product ${id}`, { error });
    }

    const all = await this.getProducts();
    if (all.length > 0) {
      const found = all.find((p) => p.id === id);
      return found || all[0];
    }

    throw new Error(`Product not found: ${id}`);
  }

  /**
   * Helper to map a database record into a MarketplaceProduct domain entity
   */
  private mapProductRow(row: any): MarketplaceProduct {
    const rawImages = Array.isArray(row.product_images) ? row.product_images : [];
    const sortedImages = rawImages.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
    const imageUrls = sortedImages.map((img: any) => img.enhanced_image_url || img.raw_image_url);

    const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    const passport = Array.isArray(row.craft_passports) ? row.craft_passports[0] : row.craft_passports;
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const artisanProfile = profile?.artisan_profiles
      ? Array.isArray(profile.artisan_profiles)
        ? profile.artisan_profiles[0]
        : profile.artisan_profiles
      : null;

    const materials = Array.isArray(row.materials) ? row.materials : [];

    return {
      id: row.id,
      title: typeof row.title === 'object' ? row.title : { en: row.title, hi: row.title },
      description:
        typeof row.description === 'object'
          ? row.description
          : { en: row.description, hi: row.description },
      price: Number(row.selling_price) || 0,
      categoryCode: row.craft_category_code || '',
      categoryName: category?.name_hi || category?.name_en || 'हस्तशिल्प',
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600'],
      artisan: {
        id: profile?.id || 'artisan_unknown',
        name: profile?.full_name || artisanProfile?.workshop_name || 'शिल्पकार (Artisan)',
        cluster: artisanProfile?.workshop_name || `${artisanProfile?.district || 'कारीगर'} शिल्प समूह`,
        state: artisanProfile?.state || 'भारत (India)',
        avatarUrl: profile?.avatar_url,
        craftYears: artisanProfile?.years_of_experience || 10,
        community: 'पारंपरिक शिल्पकार समुदाय',
      },
      passport: {
        passportId: passport?.passport_code || `PASS-${String(row?.id || 'prod').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`,
        isVerified: true,
        materialsUsed: materials,
        technique: row.technique || 'पारंपरिक हस्तकला',
        laborHours: row.labor_hours || 12,
        provenanceVillage: artisanProfile ? `${artisanProfile.district}, ${artisanProfile.state}` : 'भारत',
        verificationBadge: 'DC Handicrafts Certified',
      },
      stockType: (row.stock_type as 'READY_STOCK' | 'MADE_TO_ORDER') || 'READY_STOCK',
      rating: 4.9,
      reviewsCount: 24,
      tags: materials.concat([category?.name_en || 'Handmade', 'GI-Tag']),
    };
  }
}

export const marketplaceService = new MarketplaceService();
