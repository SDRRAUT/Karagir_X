import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CRAFT_IMAGES } from '@/assets/craftImages';
import { logger } from '@/utils/logger';

const CATALOG_STORAGE_KEY = '@kalakar_catalog_products_v1';

export interface CatalogProductItem {
  id: string;
  title: string;
  artisan: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  imageSource?: any;
  imageUrl?: string;
  category: string;
  state: string;
  giCertified: boolean;
  giNumber: string;
  cluster: string;
  craftTag: string;
  craftInfo: string;
  isNewlyListed?: boolean;
  createdAt?: string;
}

export interface ArtisanProductTile {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
  imageSource?: any;
  isNewlyListed?: boolean;
}

interface CatalogStoreState {
  catalogProducts: CatalogProductItem[];
  artisanProducts: ArtisanProductTile[];
  totalListingsCount: number;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addProductToCatalog: (product: {
    id?: string;
    title: string;
    artisan?: string;
    price: number;
    originalPrice?: number;
    imageUri?: string;
    imageSource?: any;
    category?: string;
    state?: string;
    giCertified?: boolean;
    giNumber?: string;
    cluster?: string;
    craftTag?: string;
    craftInfo?: string;
  }) => CatalogProductItem;
  removeProductFromCatalog: (id: string) => void;
}

const INITIAL_CATALOG_PRODUCTS: CatalogProductItem[] = [
  {
    id: 'prod_flash_1',
    title: 'Terracotta Diya & Urli (Set of 4)',
    artisan: 'Ramesh Kumbhar, Kolhapur',
    price: 149,
    originalPrice: 299,
    discountBadge: '50% OFF',
    imageSource: CRAFT_IMAGES.terracottaDiya,
    category: 'POTTERY',
    state: 'WEST_BENGAL',
    giCertified: true,
    giNumber: 'GI-IN-0412',
    cluster: 'Bishnupur Clay Cluster',
    craftTag: '🏺 Hand-Thrown River Clay',
    craftInfo: 'Hand-shaped on traditional wooden potter wheels using river alluvial clay & fired in earthen open kilns.',
  },
  {
    id: 'prod_flash_2',
    title: 'Handwoven Chanderi Silk Saree',
    artisan: 'Radha Devi, Chanderi',
    price: 799,
    originalPrice: 1599,
    discountBadge: '50% OFF',
    imageSource: CRAFT_IMAGES.chanderiSaree,
    category: 'TEXTILE',
    state: 'GUJARAT',
    giCertified: true,
    giNumber: 'GI-IN-0078',
    cluster: 'Chanderi Weaver Co-op',
    craftTag: '🧶 Pure Pit Loom Silk',
    craftInfo: 'Woven over 18 days on traditional wooden pit looms with pure mulberry silk & genuine gold zari brocade.',
  },
  {
    id: 'prod_flash_3',
    title: 'Dhokra Brass Nandi (Indus Cast)',
    artisan: 'Manglu Baghel, Bastar',
    price: 899,
    originalPrice: 1499,
    discountBadge: '40% OFF',
    imageSource: CRAFT_IMAGES.dhokraNandi,
    category: 'METAL',
    state: 'CHHATTISGARH',
    giCertified: true,
    giNumber: 'GI-IN-0105',
    cluster: 'Bastar Lost-Wax Guild',
    craftTag: '🔔 4,000-Yr Lost-Wax Cast',
    craftInfo: 'Ancient tribal lost-wax metallurgy using wild honey beeswax. Each single mold is destroyed & unique.',
  },
  {
    id: 'prod_flash_4',
    title: 'Madhubani Mithila Folk Painting',
    artisan: 'Sunita Devi, Madhubani',
    price: 1299,
    originalPrice: 2500,
    discountBadge: '48% OFF',
    imageSource: CRAFT_IMAGES.madhubaniArt,
    category: 'PAINTING',
    state: 'BIHAR',
    giCertified: true,
    giNumber: 'GI-IN-0091',
    cluster: 'Ranti Craft Village',
    craftTag: '🎨 Natural Herbal Dyes',
    craftInfo: 'Hand-painted with bamboo nibs on handmade rag paper using organic dyes of turmeric, indigo & soot.',
  },
  {
    id: 'prod_flash_5',
    title: 'Jaipur Blue Pottery Floral Urn',
    artisan: 'Kripal Studio, Jaipur',
    price: 549,
    originalPrice: 999,
    discountBadge: '45% OFF',
    imageSource: CRAFT_IMAGES.bluePottery,
    category: 'POTTERY',
    state: 'GUJARAT',
    giCertified: true,
    giNumber: 'GI-IN-0054',
    cluster: 'Jaipur Heritage Guild',
    craftTag: '🏺 Glazed Quartz Ceramic',
    craftInfo: 'Crafted from crushed quartz stone & Multani mitti—never clay—fired with natural cobalt blue glaze.',
  },
  {
    id: 'prod_flash_6',
    title: 'Kashmiri Hand-Carved Walnut Box',
    artisan: 'Ghulam Rasool, Srinagar',
    price: 1150,
    originalPrice: 2100,
    discountBadge: '45% OFF',
    imageSource: CRAFT_IMAGES.walnutBox,
    category: 'WOOD',
    state: 'KASHMIR',
    giCertified: true,
    giNumber: 'GI-IN-0182',
    cluster: 'Downtown Srinagar Guild',
    craftTag: '🪵 Solid Walnut Carving',
    craftInfo: 'Hewn from 100-year seasoned Himalayan walnut wood with deep chinar leaf relief carved with fine chisels.',
  },
];

const INITIAL_ARTISAN_PRODUCTS: ArtisanProductTile[] = [
  {
    id: 'art_p_1',
    name: 'Terracotta Diya Set',
    price: '₹145 / piece',
    imageSource: CRAFT_IMAGES.terracottaDiya,
  },
  {
    id: 'art_p_2',
    name: 'Jaipur Heritage Pot',
    price: '₹549 / piece',
    imageSource: CRAFT_IMAGES.bluePottery,
  },
];

const saveToStorage = async (products: CatalogProductItem[]) => {
  try {
    // Persist custom/newly created products or products with imageUrl to avoid duplicating static catalog
    const userProducts = products.filter(
      (p) => !INITIAL_CATALOG_PRODUCTS.some((base) => base.id === p.id) || p.isNewlyListed || p.imageUrl
    );
    await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(userProducts));
  } catch (err) {
    logger.error('CATALOG_STORE', 'Failed to persist products to AsyncStorage', err);
  }
};

export const useCatalogStore = create<CatalogStoreState>((set, get) => ({
  catalogProducts: INITIAL_CATALOG_PRODUCTS,
  artisanProducts: INITIAL_ARTISAN_PRODUCTS,
  totalListingsCount: INITIAL_CATALOG_PRODUCTS.length,
  isInitialized: false,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
      if (stored) {
        const parsed: CatalogProductItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Rehydrate imageSource for stored products
          const rehydrated = parsed.map((item) => ({
            ...item,
            imageSource: item.imageUrl
              ? { uri: item.imageUrl }
              : item.imageSource?.uri
              ? { uri: item.imageSource.uri }
              : CRAFT_IMAGES.terracottaDiya,
          }));

          // Merge: user-created products first, then standard catalog products
          const existingIds = new Set(rehydrated.map((p) => p.id));
          const merged = [
            ...rehydrated,
            ...INITIAL_CATALOG_PRODUCTS.filter((p) => !existingIds.has(p.id)),
          ];

          const artisanTiles: ArtisanProductTile[] = merged.slice(0, 15).map((p) => ({
            id: p.id,
            name: p.title,
            price: `₹${p.price} / piece`,
            imageSource: p.imageSource,
            imageUrl: p.imageUrl,
            isNewlyListed: p.isNewlyListed,
          }));

          set({
            catalogProducts: merged,
            artisanProducts: artisanTiles,
            totalListingsCount: merged.length,
            isInitialized: true,
          });
          logger.info('CATALOG_STORE', `Rehydrated ${rehydrated.length} saved products from storage. Total: ${merged.length}`);
          return;
        }
      }
    } catch (err) {
      logger.error('CATALOG_STORE', 'Failed to load catalog products from storage', err);
    }
    set({ isInitialized: true });
  },

  addProductToCatalog: (item) => {
    const id = item.id || `prod_${Date.now()}`;
    const rawImageUri = item.imageUri || (typeof item.imageSource === 'string' ? item.imageSource : item.imageSource?.uri);
    
    const newProduct: CatalogProductItem = {
      id,
      title: item.title,
      artisan: item.artisan || 'Sunita Devi',
      price: item.price,
      originalPrice: item.originalPrice || Math.round(item.price * 1.4),
      discountBadge: 'NEW LISTING',
      imageSource: item.imageSource || (rawImageUri ? { uri: rawImageUri } : CRAFT_IMAGES.terracottaDiya),
      imageUrl: rawImageUri,
      category: item.category || 'POTTERY',
      state: item.state || 'MAHARASHTRA',
      giCertified: item.giCertified ?? true,
      giNumber: item.giNumber || 'GI-IN-0412',
      cluster: item.cluster || 'Kolhapur Artisan Cluster',
      craftTag: item.craftTag || '🏺 100% Handcrafted',
      craftInfo: item.craftInfo || 'Handmade direct from rural master artisan studio. Fairly priced with verified craft pedigree.',
      isNewlyListed: true,
      createdAt: new Date().toISOString(),
    };

    const newArtisanTile: ArtisanProductTile = {
      id,
      name: item.title,
      price: `₹${item.price} / piece`,
      imageSource: newProduct.imageSource,
      imageUrl: rawImageUri,
      isNewlyListed: true,
    };

    const currentProducts = get().catalogProducts.filter((p) => p.id !== id);
    const currentTiles = get().artisanProducts.filter((p) => p.id !== id);
    const updatedProducts = [newProduct, ...currentProducts];
    const updatedTiles = [newArtisanTile, ...currentTiles];

    set({
      catalogProducts: updatedProducts,
      artisanProducts: updatedTiles,
      totalListingsCount: updatedProducts.length,
    });

    saveToStorage(updatedProducts);

    logger.info('CATALOG_STORE', `Product successfully added & persisted to catalog: ${id} - ${item.title} by ${item.artisan}`);
    return newProduct;
  },

  removeProductFromCatalog: (id: string) => {
    const updatedProducts = get().catalogProducts.filter((p) => p.id !== id);
    const updatedTiles = get().artisanProducts.filter((p) => p.id !== id);
    set({
      catalogProducts: updatedProducts,
      artisanProducts: updatedTiles,
      totalListingsCount: Math.max(0, updatedProducts.length),
    });
    saveToStorage(updatedProducts);
  },
}));

// Automatically trigger rehydration
useCatalogStore.getState().initialize().catch(() => {});

