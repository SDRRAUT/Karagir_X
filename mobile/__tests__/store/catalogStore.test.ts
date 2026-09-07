import { useCatalogStore } from '@/store/useCatalogStore';

describe('useCatalogStore', () => {
  it('should initialize with default authentic crafts in catalog', () => {
    const state = useCatalogStore.getState();
    expect(state.catalogProducts.length).toBeGreaterThanOrEqual(6);
    expect(state.artisanProducts.length).toBeGreaterThanOrEqual(2);
    expect(state.totalListingsCount).toBeGreaterThanOrEqual(6);
  });

  it('should add a newly uploaded product to both catalogProducts and artisanProducts', () => {
    const initialCount = useCatalogStore.getState().catalogProducts.length;

    const newProduct = useCatalogStore.getState().addProductToCatalog({
      id: 'test_product_999',
      title: 'Handcrafted Terracotta Urli with Floral Carving',
      artisan: 'Master Ramesh Kumbhar',
      price: 650,
      category: 'POTTERY',
      craftTag: '🏺 Hand-Thrown River Clay',
      craftInfo: 'Handmade terracotta urli crafted from fine riverbed clay.',
      cluster: 'Kolhapur Heritage Cluster',
    });

    const updatedState = useCatalogStore.getState();

    // Must be prepended at position 0
    expect(updatedState.catalogProducts[0].id).toBe('test_product_999');
    expect(updatedState.catalogProducts[0].title).toBe('Handcrafted Terracotta Urli with Floral Carving');
    expect(updatedState.catalogProducts[0].price).toBe(650);
    expect(updatedState.catalogProducts[0].isNewlyListed).toBe(true);
    expect(updatedState.catalogProducts.length).toBe(initialCount + 1);

    // Must also be added to artisan products
    expect(updatedState.artisanProducts[0].id).toBe('test_product_999');
    expect(updatedState.artisanProducts[0].name).toBe('Handcrafted Terracotta Urli with Floral Carving');
    expect(updatedState.artisanProducts[0].isNewlyListed).toBe(true);

    // Clean up
    useCatalogStore.getState().removeProductFromCatalog('test_product_999');
    expect(useCatalogStore.getState().catalogProducts.find((p) => p.id === 'test_product_999')).toBeUndefined();
  });
});
