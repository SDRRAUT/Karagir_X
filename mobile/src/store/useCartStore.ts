import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

const CART_STORAGE_KEY = '@kalakar_cart_items_v1';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  imageUri: string;
  craftCategoryName: string;
  artisanName: string;
  artisanCluster: string;
  quantity: number;
  stockType: 'READY_STOCK' | 'MADE_TO_ORDER';
}

export interface CartState {
  items: CartItem[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getPackagingFee: () => number;
  getDeliveryFee: () => number;
  getTotalPayable: () => number;
  getTotalCount: () => number;
}

const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    logger.error('CART_STORE', 'Failed to save cart to AsyncStorage', err);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isInitialized: false,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ items: parsed, isInitialized: true });
          logger.info('CART_STORE', `Rehydrated ${parsed.length} cart items from storage`);
          return;
        }
      }
    } catch (err) {
      logger.error('CART_STORE', 'Failed to load cart items from storage', err);
    }
    set({ isInitialized: true });
  },

  addItem: (product) => {
    const current = get().items;
    const existing = current.find((i) => i.productId === product.productId);

    let updated: CartItem[];
    if (existing) {
      updated = current.map((i) =>
        i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...current, { ...product, quantity: 1 }];
    }

    set({ items: updated });
    saveCartToStorage(updated);
    logger.info('CART_STORE', `Item added to cart: ${product.productId}`);
  },

  removeItem: (productId: string) => {
    const updated = get().items.filter((i) => i.productId !== productId);
    set({ items: updated });
    saveCartToStorage(updated);
    logger.info('CART_STORE', `Item removed from cart: ${productId}`);
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const updated = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    set({ items: updated });
    saveCartToStorage(updated);
  },

  clearCart: () => {
    set({ items: [] });
    AsyncStorage.removeItem(CART_STORAGE_KEY).catch(() => {});
    logger.info('CART_STORE', 'Cart cleared and storage reset');
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getPackagingFee: () => {
    return get().items.length > 0 ? 80 : 0;
  },

  getDeliveryFee: () => {
    const subtotal = get().getSubtotal();
    // Free delivery on orders over ₹1,999; otherwise standard India Post Speed Post ₹90
    if (subtotal === 0) return 0;
    return subtotal >= 1999 ? 0 : 90;
  },

  getTotalPayable: () => {
    return get().getSubtotal() + get().getPackagingFee() + get().getDeliveryFee();
  },

  getTotalCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

// Automatically trigger rehydration on import
useCartStore.getState().initialize().catch(() => {});

