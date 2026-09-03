import { marketplaceService } from '@/api/marketplaceService';

describe('MarketplaceService', () => {
  it('returns craft categories and curated products', async () => {
    const categories = await marketplaceService.getCategories();
    expect(categories.length).toBe(6);
    expect(categories[0].code).toBe('TEXTILE_HANDLOOM');

    const products = await marketplaceService.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].passport.isVerified).toBe(true);

    const singleProduct = await marketplaceService.getProductById(products[0].id);
    expect(singleProduct.title.hi).toBeDefined();
    expect(singleProduct.artisan.name).toBeDefined();
  });
});
