import { useOrderStore, BuyerOrder } from '@/store/useOrderStore';

describe('useOrderStore', () => {
  it('adds and retrieves orders with tracking milestones', () => {
    const mockOrder: BuyerOrder = {
      orderId: 'ord_123',
      orderNumber: 'KS-OD-123456',
      consignmentBarcode: 'SP12345678IN',
      status: 'ORDER_CONFIRMED',
      items: [
        {
          productId: 'p1',
          title: 'Craft item',
          price: 1200,
          quantity: 1,
          imageUri: 'file:///p.jpg',
          artisanName: 'Sunita Devi',
        },
      ],
      shippingAddress: {
        fullName: 'Test User',
        addressLine: 'Street 1',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '9876543210',
      },
      totalAmount: 1280,
      escrowStatus: 'HELD_IN_VAULT',
      paymentMethod: 'UPI',
      estimatedDeliveryDate: '3-5 Days',
      trackingMilestones: [],
      createdAt: new Date().toISOString(),
    };

    useOrderStore.getState().addOrder(mockOrder);

    expect(useOrderStore.getState().orders.length).toBeGreaterThan(0);
    expect(useOrderStore.getState().getOrderById('ord_123')?.orderNumber).toBe('KS-OD-123456');
    expect(useOrderStore.getState().currentOrder?.escrowStatus).toBe('HELD_IN_VAULT');
  });
});
