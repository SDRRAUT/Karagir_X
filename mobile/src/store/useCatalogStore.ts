import { create } from 'zustand';
import { CRAFT_IMAGES } from '@/assets/craftImages';
import { logger } from '@/utils/logger';

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

export const useCatalogStore = create<CatalogStoreState>((set, get) => ({
  catalogProducts: INITIAL_CATALOG_PRODUCTS,
  artisanProducts: INITIAL_ARTISAN_PRODUCTS,
  totalListingsCount: INITIAL_CATALOG_PRODUCTS.length,

  addProductToCatalog: (item) => {
    const id = item.id || `prod_${Date.now()}`;
    const newProduct: CatalogProductItem = {
      id,
      title: item.title,
      artisan: item.artisan || 'Ramesh Kumbhar, Kolhapur',
      price: item.price,
      originalPrice: item.originalPrice || Math.round(item.price * 1.4),
      discountBadge: 'NEW LISTING',
      imageSource: item.imageSource || (item.imageUri ? { uri: item.imageUri } : CRAFT_IMAGES.terracottaDiya),
      imageUrl: item.imageUri,
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
      imageUrl: item.imageUri,
      isNewlyListed: true,
    };

    set((state) => ({
      catalogProducts: [newProduct, ...state.catalogProducts],
      artisanProducts: [newArtisanTile, ...state.artisanProducts],
      totalListingsCount: state.totalListingsCount + 1,
    }));

    logger.info('CATALOG_STORE', `Product successfully added to catalog: ${id} - ${item.title}`);
    return newProduct;
  },

  removeProductFromCatalog: (id: string) => {
    set((state) => ({
      catalogProducts: state.catalogProducts.filter((p) => p.id !== id),
      artisanProducts: state.artisanProducts.filter((p) => p.id !== id),
      totalListingsCount: Math.max(0, state.totalListingsCount - 1),
    }));
  },
}));
