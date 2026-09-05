import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
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
    images: ['https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80'],
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
  public async getCategories(): Promise<CraftCategory[]> {
    return CRAFT_CATEGORIES;
  }

  public async getProducts(filters?: {
    categoryCode?: string | null;
    searchQuery?: string;
  }): Promise<MarketplaceProduct[]> {
    try {
      const response = await apiClient.get<MarketplaceProduct[]>(ENDPOINTS.PRODUCTS.LIST, {
        params: filters,
      });
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      }
      return this.filterMockProducts(filters);
    } catch (_error) {
      logger.warn('MARKETPLACE_SERVICE', 'Remote products API unavailable, returning curated catalog');
      return this.filterMockProducts(filters);
    }
  }

  public async getProductById(id: string): Promise<MarketplaceProduct> {
    try {
      const response = await apiClient.get<MarketplaceProduct>(
        ENDPOINTS.PRODUCTS.DETAIL(id)
      );
      if (response && response.id) {
        return response;
      }
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      return found || MOCK_PRODUCTS[0];
    } catch (_error) {
      logger.warn('MARKETPLACE_SERVICE', `Product detail fallback for: ${id}`);
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      return found || MOCK_PRODUCTS[0];
    }
  }

  private filterMockProducts(filters?: {
    categoryCode?: string | null;
    searchQuery?: string;
  }): MarketplaceProduct[] {
    let list = [...MOCK_PRODUCTS];
    if (filters?.categoryCode) {
      list = list.filter((p) => p.categoryCode === filters.categoryCode);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.hi.toLowerCase().includes(q) ||
          p.title.en.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }
}

export const marketplaceService = new MarketplaceService();
