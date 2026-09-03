import { create } from 'zustand';
import { logger } from '@/utils/logger';

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

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const current = get().items;
    const existing = current.find((i) => i.productId === product.productId);

    if (existing) {
      set({
        items: current.map((i) =>
          i.productId === product.productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        items: [...current, { ...product, quantity: 1 }],
      });
    }

    logger.info('CART_STORE', `Item added to cart: ${product.productId}`);
  },

  removeItem: (productId: string) => {
    set({
      items: get().items.filter((i) => i.productId !== productId),
    });
    logger.info('CART_STORE', `Item removed from cart: ${productId}`);
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set({
      items: get().items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
    logger.info('CART_STORE', 'Cart cleared');
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
