import { orderService } from '@/api/orderService';

describe('OrderService', () => {
  it('creates an order with escrow protection and postal milestones', async () => {
    const order = await orderService.createOrder({
      items: [
        {
          productId: 'prod_mhb_01',
          title: 'Madhubani Painting',
          price: 2150,
          quantity: 1,
          imageUri: 'file:///photo.jpg',
          artisanName: 'Sunita Devi',
        },
      ],
      shippingAddress: {
        fullName: 'Rohan Sharma',
        addressLine: 'CP',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '9876543210',
      },
      paymentMethod: 'UPI',
      totalAmount: 2230,
    });

    expect(order.orderNumber).toMatch(/^KS-OD-/);
    expect(order.consignmentBarcode).toMatch(/^SP\d+IN/);
    expect(order.escrowStatus).toBe('HELD_IN_VAULT');
    expect(order.trackingMilestones.length).toBe(5);
  });
});
