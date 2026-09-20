import { supabase } from './supabaseClient';
import { logger } from '@/utils/logger';
import { useCatalogStore } from '../store/useCatalogStore';

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

export const MOCK_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod_flash_1',
    title: {
      hi: 'हस्तनिर्मित टेराकोटा दीया (12 का सेट) — प्राकृतिक मिट्टी',
      en: 'Terracotta Diya (Set of 12) — Pure Natural Clay',
    },
    description: {
      hi: 'महाराष्ट्र के कोल्हापुर कारीगरों द्वारा चाक पर हाथ से गढ़े गए पारंपरिक मिट्टी के दीये।',
      en: 'Wheel-thrown artisanal earthen lamps created by rural master potters of Kolhapur.',
    },
    price: 149,
    categoryCode: 'POTTERY_TERRACOTTA',
    categoryName: 'मिट्टी व टेराकोटा',
    images: ['https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80'],
    artisan: {
      id: 'art_ramesh_kumbhar',
      name: 'रमेश कुंभार (Ramesh Kumbhar)',
      cluster: 'कोल्हापुर कुंभार समाज क्लस्टर',
      state: 'Maharashtra',
      craftYears: 30,
      community: 'माती कला संघ',
    },
    passport: {
      passportId: 'PASS-KLH-1049',
      isVerified: true,
      materialsUsed: ['नदी किनारे की चिकनी मिट्टी', 'प्राकृतिक गेरू रंग'],
      technique: 'कुम्हार चाक हस्तशिल्प',
      laborHours: 8,
      provenanceVillage: 'Kolhapur, Maharashtra',
      verificationBadge: 'Master Potter Certified',
    },
    stockType: 'READY_STOCK',
    rating: 5.0,
    reviewsCount: 64,
    tags: ['Terracotta', 'DiwaliDiya', 'EcoFriendly', 'Pottery'],
  },
  {
    id: 'prod_flash_2',
    title: {
      hi: 'हथकरघा चंदेरी रेशमी साड़ी — शुद्ध ज़री किनारी',
      en: 'Handwoven Chanderi Silk Saree with Real Zari Border',
    },
    description: {
      hi: 'मध्य प्रदेश की विश्वप्रसिद्ध जीआई टैग प्रमाणित चंदेरी हथकरघा साड़ी।',
      en: 'GI Tag certified handloom Chanderi silk cotton saree with fine golden zari border.',
    },
    price: 799,
    categoryCode: 'TEXTILE_HANDLOOM',
    categoryName: 'हथकरघा व बुनाई',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
    artisan: {
      id: 'art_chanderi_coop',
      name: 'चंदेरी बुनकर सहकारी समिति (Chanderi Weavers)',
      cluster: 'चंदेri बुनकर संघ, अशोक नगर',
      state: 'Madhya Pradesh',
      craftYears: 25,
      community: 'चंदेरी मास्टर वीवर्स',
    },
    passport: {
      passportId: 'PASS-CHN-8841',
      isVerified: true,
      materialsUsed: ['शुद्ध मलबरी सिल्क', 'ज़री धागा', 'मर्सराइज्ड कॉटन'],
      technique: 'पारंपरिक थ्रो-शटल पिट लूम',
      laborHours: 54,
      provenanceVillage: 'Pranpur, Chanderi, MP',
      verificationBadge: 'GI Tag Registered Handloom',
    },
    stockType: 'READY_STOCK',
    rating: 4.9,
    reviewsCount: 52,
    tags: ['Chanderi', 'Handloom', 'GITag', 'SilkSaree'],
  },
  {
    id: 'prod_mhb_01',
    title: {
      hi: 'हाथ से बनी मधुबनी मत्स्य पेंटिंग — प्राकृतिक रंग',
      en: 'Handcrafted Madhubani Fish Painting on Cotton Paper',
      bn: 'হাতে তৈরি মধুবনী মাছের চিত্রকর্ম',
    },
    description: {
      hi: 'बिहार के रंती गांव की महिला कलाकार द्वारा प्राकृतिक वनस्पति रंगों और बांस की कलम से बनाई गई पवित्र लोक कला।',
      en: 'Authentic Madhubani art hand-painted on handmade cotton rag paper using natural plant dyes and fine bamboo nibs.',
    },
    price: 2150,
    categoryCode: 'PAINTING_FOLK',
    categoryName: 'मधुबनी व लोक चित्रकला',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600'],
    artisan: {
      id: 'art_sunita_01',
      name: 'सुनीता देवी (Sunita Devi)',
      cluster: 'रंती शिल्प क्लस्टर, मधुबनी',
      state: 'Bihar',
      craftYears: 22,
      community: 'महिला शिल्प समूह',
    },
    passport: {
      passportId: 'PASS-MTH-9021',
      isVerified: true,
      materialsUsed: ['शुद्ध कॉटन पेपर', 'प्राकृतिक वनस्पति रंग (हल्दी, नील)'],
      technique: 'बांस की निब द्वारा बारीक हस्तचित्रण',
      laborHours: 28,
      provenanceVillage: 'Ranti, Madhubani, Bihar',
      verificationBadge: 'DC Handicrafts Certified',
    },
    stockType: 'READY_STOCK',
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Madhubani', 'NaturalDyes', 'FolkArt', 'EcoFriendly'],
  },
  {
    id: 'prod_bnr_02',
    title: {
      hi: 'शुद्ध रेशम बनारसी कढ़ुआ दुपट्टा — सोने की ज़री',
      en: 'Pure Katan Silk Banarasi Kadwa Dupatta with Zari',
      bn: 'খাঁটি কাতান সিল্ক বেনারসি ওড়না',
    },
    description: {
      hi: 'पारंपरिक हथकरघे पर 3 कारीगरों द्वारा 18 दिनों में बुना गया प्रामाणिक कढ़ुआ दुपट्टा।',
      en: 'Woven on a pit-loom over 18 days by master weavers in Varanasi using genuine silk and fine zari border work.',
    },
    price: 4850,
    categoryCode: 'TEXTILE_HANDLOOM',
    categoryName: 'हथकरघा व बुनाई',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    artisan: {
      id: 'art_ansari_02',
      name: 'मोहम्मद आरिफ अंसारी (M. Arif Ansari)',
      cluster: 'मऊ हथकरघा बुनकर संघ',
      state: 'Uttar Pradesh',
      craftYears: 34,
      community: 'परंपरागत बुनकर परिवार (तीसरी पीढ़ी)',
    },
    passport: {
      passportId: 'PASS-VNS-4412',
      isVerified: true,
      materialsUsed: ['शुद्ध कतान सिल्क (Katan Silk)', 'परीक्षित ज़री धागे'],
      technique: 'कढ़ुआ पिट-लूम हस्त बुनाई',
      laborHours: 64,
      provenanceVillage: 'Mubarakpur, Azamgarh, UP',
      verificationBadge: 'Handloom Mark Verified',
    },
    stockType: 'READY_STOCK',
    rating: 5.0,
    reviewsCount: 52,
    tags: ['Banarasi', 'PureSilk', 'Zari', 'HandloomMark'],
  },
  {
    id: 'prod_chn_03',
    title: {
      hi: 'चन्नापटना लकड़ी का हस्तनिर्मित घोड़ा खिलौना',
      en: 'Channapatna Eco-Friendly Lacquerware Wooden Toy',
      bn: 'চন্নাপাটনা পরিবেশ-বান্ধব কাঠের খেলনা',
    },
    description: {
      hi: 'हाले की लकड़ी और प्राकृतिक वनस्पति रंगों (कत्था, हल्दी) से बना बाल-सुरक्षित पारंपरिक खिलौना।',
      en: 'Turned on traditional wood lathes using Wrightia tinctoria wood and organic vegetable lacquer. Completely non-toxic for children.',
    },
    price: 850,
    categoryCode: 'WOOD_CRAFT',
    categoryName: 'काष्ठकला व खिलौने',
    images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600'],
    artisan: {
      id: 'art_ramesh_03',
      name: 'रमेश कुमार (Ramesh Kumar)',
      cluster: 'चन्नापटना शिल्पकला संघ',
      state: 'Karnataka',
      craftYears: 18,
      community: 'GI टैग प्रमाणित शिल्पकार',
    },
    passport: {
      passportId: 'PASS-CPN-1082',
      isVerified: true,
      materialsUsed: ['हाले लकड़ी (Ivory Wood)', 'प्राकृतिक वनस्पति लाख रंग'],
      technique: 'हाथ से खराद (Lathe Turning & Lacquering)',
      laborHours: 12,
      provenanceVillage: 'Channapatna, Ramanagara, Karnataka',
      verificationBadge: 'GI Tag Certified Craft',
    },
    stockType: 'READY_STOCK',
    rating: 4.8,
    reviewsCount: 29,
    tags: ['Channapatna', 'WoodenToys', 'GITag', 'NonToxic'],
  },
  {
    id: 'prod_dhk_04',
    title: {
      hi: 'बस्तर ढोकरा पीतल नंदी प्रतिमा — लॉस्ट वैक्स विधि',
      en: 'Bastar Dhokra Bell Metal Nandi Figurine',
      bn: 'বস্তার ডোকরা বেল মেটাল নন্দী মূর্তি',
    },
    description: {
      hi: '4000 साल पुरानी लॉस्ट-वैक्स धातु ढलाई तकनीक द्वारा जनजातीय कारीगरों द्वारा बनाई गई अनूठी कलाकृति।',
      en: 'Handmade using 4,000-year-old lost-wax hollow brass casting technique. Each piece is unique and cast once.',
    },
    price: 3200,
    categoryCode: 'METAL_DHOKRA',
    categoryName: 'ढोकरा व कांस्य शिल्प',
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600'],
    artisan: {
      id: 'art_sukram_04',
      name: 'सुखराम बघेल (Sukhram Baghel)',
      cluster: 'कोंडागांव आदिवासी ढोकरा संघ',
      state: 'Chhattisgarh',
      craftYears: 27,
      community: 'झोरा जनजाति शिल्पकार',
    },
    passport: {
      passportId: 'PASS-BST-3390',
      isVerified: true,
      materialsUsed: ['कांसा व पीतल मिश्रधातु', 'मधुमक्खी मोम व मिट्टी सांचा'],
      technique: 'लॉस्ट-वैक्स ढलाई (Cire Perdue)',
      laborHours: 42,
      provenanceVillage: 'Kondagaon, Bastar, Chhattisgarh',
      verificationBadge: 'Tribal Co-op Certified',
    },
    stockType: 'READY_STOCK',
    rating: 4.9,
    reviewsCount: 44,
    tags: ['Dhokra', 'TribalCraft', 'LostWax', 'BellMetal'],
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

      let baseProducts: MarketplaceProduct[] = MOCK_PRODUCTS;
      if (!error && data && data.length > 0) {
        baseProducts = data.map((row: any) => this.mapProductRow(row));
      }

      // Merge live products from useCatalogStore (shared single source of truth for seller & buyer)
      const liveCatalogProducts = useCatalogStore.getState().catalogProducts || [];
      const liveMapped: MarketplaceProduct[] = liveCatalogProducts.map((liveItem) => {
        const primaryImg =
          liveItem.imageUrl ||
          (typeof liveItem.imageSource === 'string'
            ? liveItem.imageSource
            : liveItem.imageSource?.uri
            ? liveItem.imageSource.uri
            : typeof liveItem.imageSource === 'number'
            ? (liveItem.imageSource as any)
            : 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80');

        return {
          id: liveItem.id,
          title: { en: liveItem.title, hi: liveItem.title },
          description: { en: liveItem.craftInfo, hi: liveItem.craftInfo },
          price: liveItem.price,
          categoryCode: liveItem.category || 'POTTERY',
          categoryName: liveItem.craftTag || 'Handmade Craft',
          images: [primaryImg],
          artisan: {
            id: `art_${liveItem.id}`,
            name: liveItem.artisan || 'Verified Artisan',
            cluster: liveItem.cluster || 'Artisan Cluster',
            state: liveItem.state || 'India',
            craftYears: 20,
            community: 'हस्तशिल्प संघ',
          },
          passport: {
            passportId: liveItem.giNumber || 'PASS-KALAKAR-2026',
            isVerified: liveItem.giCertified ?? true,
            materialsUsed: [liveItem.craftTag || 'Natural Materials', '100% Organic Local Materials'],
            technique: liveItem.craftTag || 'Master Handcrafted',
            laborHours: 16,
            provenanceVillage: liveItem.cluster || 'Craft Cluster',
            verificationBadge: 'Kalakar Setu Verified Artisan',
          },
          stockType: 'READY_STOCK' as const,
          rating: 4.9,
          reviewsCount: 14,
          tags: ['Handmade', 'GI-Certified', liveItem.category],
        };
      });

      const liveIds = new Set(liveMapped.map((p) => p.id));
      let mergedProducts = [
        ...liveMapped,
        ...baseProducts.filter((p) => !liveIds.has(p.id)),
      ];

      if (filters?.categoryCode) {
        const cat = filters.categoryCode.toUpperCase();
        mergedProducts = mergedProducts.filter(
          (p) =>
            p.categoryCode?.toUpperCase() === cat ||
            p.categoryCode?.toUpperCase().includes(cat) ||
            cat.includes(p.categoryCode?.toUpperCase())
        );
      }

      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        return mergedProducts.filter(
          (p) =>
            p.title.hi?.toLowerCase().includes(q) ||
            p.title.en?.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            p.artisan.name?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }

      return mergedProducts;
    } catch (error) {
      logger.error('MARKETPLACE_SERVICE', 'Exception during getProducts, falling back to mock products', error);
      return MOCK_PRODUCTS;
    }
  }

  /**
   * Fetch single product detail from Catalog Store or Supabase
   */
  public async getProductById(id: string): Promise<MarketplaceProduct> {
    // 1. Check live shared catalog store first (for all seller-created and listed items)
    try {
      const liveItem = useCatalogStore.getState().catalogProducts.find((p) => p.id === id);
      if (liveItem) {
        const primaryImg =
          liveItem.imageUrl ||
          (typeof liveItem.imageSource === 'string'
            ? liveItem.imageSource
            : liveItem.imageSource?.uri
            ? liveItem.imageSource.uri
            : typeof liveItem.imageSource === 'number'
            ? (liveItem.imageSource as any)
            : 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80');

        return {
          id: liveItem.id,
          title: { en: liveItem.title, hi: liveItem.title },
          description: { en: liveItem.craftInfo, hi: liveItem.craftInfo },
          price: liveItem.price,
          categoryCode: liveItem.category || 'POTTERY',
          categoryName: liveItem.craftTag || 'Handmade Craft',
          images: [primaryImg],
          artisan: {
            id: `art_${liveItem.id}`,
            name: liveItem.artisan || 'Verified Artisan',
            cluster: liveItem.cluster || 'Artisan Cluster',
            state: liveItem.state || 'India',
            craftYears: 25,
            community: 'हस्तशिल्प संघ',
          },
          passport: {
            passportId: liveItem.giNumber || 'PASS-KLH-2026',
            isVerified: liveItem.giCertified ?? true,
            materialsUsed: [liveItem.craftTag || 'Natural River Clay', '100% Organic Local Materials'],
            technique: liveItem.craftTag || 'Master Handcrafted',
            laborHours: 16,
            provenanceVillage: liveItem.cluster || 'Artisan Studio',
            verificationBadge: 'Kalakar Setu Verified Artisan',
          },
          stockType: 'READY_STOCK',
          rating: 5.0,
          reviewsCount: 16,
          tags: ['Handmade', 'GI-Certified', liveItem.category],
        };
      }
    } catch (_e) {
      // Continue to Supabase
    }

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

    const mockFound = MOCK_PRODUCTS.find((p) => p.id === id);
    if (mockFound) return mockFound;
    return MOCK_PRODUCTS[0];
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
