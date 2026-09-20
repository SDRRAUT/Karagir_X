import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

const ORDER_STORAGE_KEY = '@kalakar_buyer_orders_v1';

export type OrderStatus =
  | 'ORDER_CONFIRMED'
  | 'ARTISAN_ACCEPTED'
  | 'IN_CRAFTING'
  | 'DISPATCHED_POSTAL'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface TrackingMilestone {
  step: number;
  status: OrderStatus;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
}

export interface BuyerOrder {
  orderId: string;
  orderNumber: string;
  consignmentBarcode: string;
  status: OrderStatus;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUri: string;
    artisanName: string;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  totalAmount: number;
  escrowStatus: 'HELD_IN_VAULT' | 'RELEASED_TO_ARTISAN' | 'REFUNDED';
  paymentMethod: 'UPI' | 'CARDS' | 'NETBANKING' | 'COD';
  estimatedDeliveryDate: string;
  trackingMilestones: TrackingMilestone[];
  createdAt: string;
}

export interface OrderState {
  orders: BuyerOrder[];
  currentOrder: BuyerOrder | null;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addOrder: (order: BuyerOrder) => void;
  setCurrentOrder: (order: BuyerOrder) => void;
  getOrderById: (orderId: string) => BuyerOrder | undefined;
}

const saveOrdersToStorage = async (orders: BuyerOrder[]) => {
  try {
    await AsyncStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    logger.error('ORDER_STORE', 'Failed to save orders to AsyncStorage', err);
  }
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isInitialized: false,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(ORDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({
            orders: parsed,
            currentOrder: parsed[0] || null,
            isInitialized: true,
          });
          logger.info('ORDER_STORE', `Rehydrated ${parsed.length} orders from storage`);
          return;
        }
      }
    } catch (err) {
      logger.error('ORDER_STORE', 'Failed to load orders from storage', err);
    }
    set({ isInitialized: true });
  },

  addOrder: (order) => {
    const updated = [order, ...get().orders];
    set({
      orders: updated,
      currentOrder: order,
    });
    saveOrdersToStorage(updated);
    logger.info('ORDER_STORE', `New order created & persisted: ${order.orderNumber}`);
  },

  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.orderId === orderId);
  },
}));

// Automatically trigger rehydration on import
useOrderStore.getState().initialize().catch(() => {});

