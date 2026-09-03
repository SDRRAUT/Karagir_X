import { useCartStore } from '@/store/useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds items, calculates subtotal, packaging, delivery and total payable', () => {
    const store = useCartStore.getState();

    store.addItem({
      productId: 'prod_1',
      title: 'Madhubani Painting',
      price: 1500,
      imageUri: 'file:///p1.jpg',
      craftCategoryName: 'Painting',
      artisanName: 'Sunita Devi',
      artisanCluster: 'Ranti, Bihar',
      stockType: 'READY_STOCK',
    });

    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().getSubtotal()).toBe(1500);
    expect(useCartStore.getState().getPackagingFee()).toBe(80);
    expect(useCartStore.getState().getDeliveryFee()).toBe(90);
    expect(useCartStore.getState().getTotalPayable()).toBe(1500 + 80 + 90);
  });

  it('provides free delivery for orders >= ₹1,999', () => {
    const store = useCartStore.getState();

    store.addItem({
      productId: 'prod_2',
      title: 'Silk Saree',
      price: 2500,
      imageUri: 'file:///p2.jpg',
      craftCategoryName: 'Handloom',
      artisanName: 'Arif Ansari',
      artisanCluster: 'Varanasi, UP',
      stockType: 'READY_STOCK',
    });

    expect(useCartStore.getState().getDeliveryFee()).toBe(0);
    expect(useCartStore.getState().getTotalPayable()).toBe(2500 + 80);
  });

  it('updates quantity and removes item when quantity reaches 0', () => {
    const store = useCartStore.getState();

    store.addItem({
      productId: 'prod_1',
      title: 'Madhubani Painting',
      price: 1000,
      imageUri: 'file:///p1.jpg',
      craftCategoryName: 'Painting',
      artisanName: 'Sunita Devi',
      artisanCluster: 'Ranti, Bihar',
      stockType: 'READY_STOCK',
    });

    store.updateQuantity('prod_1', 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
    expect(useCartStore.getState().getSubtotal()).toBe(3000);

    store.updateQuantity('prod_1', 0);
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
