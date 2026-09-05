import { supabase } from './supabaseClient';
import { logger } from '@/utils/logger';
import { BuyerOrder, TrackingMilestone } from '@/store/useOrderStore';

export interface CreateOrderPayload {
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
  paymentMethod: 'UPI' | 'CARDS' | 'NETBANKING' | 'COD';
  totalAmount: number;
}

export class OrderService {
  /**
   * Places an order and records escrow entry in Supabase
   */
  public async createOrder(payload: CreateOrderPayload): Promise<BuyerOrder> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const buyerId = session?.user?.id || '00000000-0000-0000-0000-000000000002';

      const orderNumber = `KS-OD-${Math.floor(100000 + Math.random() * 900000)}`;
      const consignmentBarcode = `SP${Math.floor(10000000 + Math.random() * 90000000)}IN`;

      // 1. Insert master order into public.orders
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          buyer_id: buyerId,
          order_number: orderNumber,
          total_amount: payload.totalAmount,
          shipping_total: 0.0,
          tax_total: 0.0,
          payment_method: payload.paymentMethod,
          shipping_address: payload.shippingAddress,
        })
        .select()
        .single();

      if (orderErr || !order) {
        logger.error('ORDER_SERVICE', 'Supabase order creation error', orderErr);
        throw orderErr || new Error('Order creation failed');
      }

      // Default seed artisan for single sub-order package
      const defaultArtisanId = '00000000-0000-0000-0000-000000000001';
      const subOrderNumber = `${orderNumber}-A1`;
      const platformCommission = Number((payload.totalAmount * 0.05).toFixed(2));
      const netPayout = payload.totalAmount - platformCommission;

      // 2. Insert sub_orders row
      const { data: subOrder, error: subOrderErr } = await supabase
        .from('sub_orders')
        .insert({
          order_id: order.id,
          artisan_id: defaultArtisanId,
          sub_order_number: subOrderNumber,
          subtotal: payload.totalAmount,
          shipping_fee: 0.0,
          platform_commission: platformCommission,
          artisan_net_payout: netPayout,
          status: 'CONFIRMED',
        })
        .select()
        .single();

      if (!subOrderErr && subOrder) {
        // 3. Insert line items
        if (payload.items.length > 0) {
          const itemInserts = payload.items.map((item) => ({
            sub_order_id: subOrder.id,
            product_id: item.productId.length === 36 ? item.productId : '11111111-1111-1111-1111-111111111111',
            unit_price: item.price,
            quantity: item.quantity,
            product_snapshot: {
              title: item.title,
              artisan: item.artisanName,
              image: item.imageUri,
            },
          }));
          await supabase.from('order_items').insert(itemInserts);
        }

        // 4. Lock funds in escrow ledger
        await supabase.from('escrow_ledger').insert({
          sub_order_id: subOrder.id,
          nodal_account_ref: `NODAL_SBI_${Date.now()}`,
          held_amount: payload.totalAmount,
          commission_amount: platformCommission,
          net_payout_amount: netPayout,
          status: 'HELD_IN_ESCROW',
          lock_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      logger.info('ORDER_SERVICE', `Order established in Supabase: ${order.id}`);

      const initialMilestones: TrackingMilestone[] = [
        {
          step: 1,
          status: 'ORDER_CONFIRMED',
          titleHi: 'ऑर्डर कन्फर्म (Order Confirmed) ✓',
          titleEn: 'Order Confirmed & Escrow Vault Locked',
          descriptionHi: 'आपका भुगतान नोडल एस्क्रो में सुरक्षित है। जब तक पार्सल नहीं मिलता, पैसा सुरक्षित रहेगा।',
          descriptionEn: 'Payment secured in nodal escrow account.',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isCompleted: true,
        },
        {
          step: 2,
          status: 'ARTISAN_ACCEPTED',
          titleHi: 'कारीगर ने स्वीकार किया (Artisan Accepted) 👨‍🎨',
          titleEn: 'Artisan Preparing Craft',
          descriptionHi: 'कारीगर को सूचना भेज दी गई है। शिल्प का अंतिम निरीक्षण किया जा रहा है।',
          descriptionEn: 'Artisan is packing craft and attaching Craft Passport.',
          timestamp: 'आज, 2 घंटे में',
          isCompleted: true,
        },
        {
          step: 3,
          status: 'IN_CRAFTING',
          titleHi: 'पार्सल पैक हुआ (Packed with Care) 📦',
          titleEn: 'Eco-Friendly Packing & GI Verification',
          descriptionHi: 'सुरक्षित इको-फ्रेंडली डिब्बे में पैक किया गया और डिजिटल शिल्प पासपोर्ट सील लगाया गया।',
          descriptionEn: 'Packed securely with Craft Passport seal.',
          timestamp: 'अनुमानित: कल सुबह',
          isCompleted: false,
        },
        {
          step: 4,
          status: 'DISPATCHED_POSTAL',
          titleHi: 'इंडिया पोस्ट स्पीड पोस्ट द्वारा रवाना 📮',
          titleEn: 'Handed to India Post Speed Post',
          descriptionHi: `कंसाइनमेंट नंबर: ${consignmentBarcode}। ग्रामीण शाखा डाकघर से रवाना।`,
          descriptionEn: `Tracking consignment: ${consignmentBarcode}`,
          location: 'शाखा डाकघर (Branch Post Office)',
          timestamp: '2 दिन में',
          isCompleted: false,
        },
        {
          step: 5,
          status: 'DELIVERED',
          titleHi: 'डिलीवरी व कारीगर भुगतान 🏡',
          titleEn: 'Delivered & Escrow Released to Artisan',
          descriptionHi: 'डिलीवरी के 48 घंटे बाद कारीगर के जन-धन/बैंक खाते में पूरा भुगतान स्वतः ट्रांसफर होगा।',
          descriptionEn: 'Direct bank payout released to artisan.',
          timestamp: '3-4 कार्य दिवस',
          isCompleted: false,
        },
      ];

      return {
        orderId: order.id,
        orderNumber,
        consignmentBarcode,
        status: 'ORDER_CONFIRMED',
        items: payload.items,
        shippingAddress: payload.shippingAddress,
        totalAmount: payload.totalAmount,
        escrowStatus: 'HELD_IN_VAULT',
        paymentMethod: payload.paymentMethod,
        estimatedDeliveryDate: '3-5 कार्य दिवस (Working Days)',
        trackingMilestones: initialMilestones,
        createdAt: order.created_at || new Date().toISOString(),
      };
    } catch (error) {
      logger.error('ORDER_SERVICE', 'Order creation failure in Supabase', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
