import { create } from 'zustand';
import { logger } from '@/utils/logger';

export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  imageUri: string;
  craftCategoryName: string;
  artisanName: string;
  artisanState: string;
}

export interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  toggleWishlist: (item) => {
    const current = get().items;
    const exists = current.some((i) => i.productId === item.productId);

    if (exists) {
      set({ items: current.filter((i) => i.productId !== item.productId) });
      logger.info('WISHLIST_STORE', `Removed from wishlist: ${item.productId}`);
      return false;
    } else {
      set({ items: [...current, item] });
      logger.info('WISHLIST_STORE', `Added to wishlist: ${item.productId}`);
      return true;
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.productId === productId);
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.productId !== productId) });
    logger.info('WISHLIST_STORE', `Removed from wishlist: ${productId}`);
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
