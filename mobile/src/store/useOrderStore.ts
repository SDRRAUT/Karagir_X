import { create } from 'zustand';
import { logger } from '@/utils/logger';

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
  addOrder: (order: BuyerOrder) => void;
  setCurrentOrder: (order: BuyerOrder) => void;
  getOrderById: (orderId: string) => BuyerOrder | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,

  addOrder: (order) => {
    set({
      orders: [order, ...get().orders],
      currentOrder: order,
    });
    logger.info('ORDER_STORE', `New order created: ${order.orderNumber}`);
  },

  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.orderId === orderId);
  },
}));
