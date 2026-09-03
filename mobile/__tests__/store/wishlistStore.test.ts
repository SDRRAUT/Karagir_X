import { useWishlistStore } from '@/store/useWishlistStore';

describe('useWishlistStore', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
  });

  it('toggles items in wishlist and checks presence', () => {
    const item = {
      productId: 'prod_1',
      title: 'Wooden Toy',
      price: 850,
      imageUri: 'file:///toy.jpg',
      craftCategoryName: 'Woodcraft',
      artisanName: 'Ramesh Kumar',
      artisanState: 'Karnataka',
    };

    const added = useWishlistStore.getState().toggleWishlist(item);
    expect(added).toBe(true);
    expect(useWishlistStore.getState().isInWishlist('prod_1')).toBe(true);
    expect(useWishlistStore.getState().items.length).toBe(1);

    // Toggle again removes it
    const removed = useWishlistStore.getState().toggleWishlist(item);
    expect(removed).toBe(false);
    expect(useWishlistStore.getState().isInWishlist('prod_1')).toBe(false);
    expect(useWishlistStore.getState().items.length).toBe(0);
  });
});
