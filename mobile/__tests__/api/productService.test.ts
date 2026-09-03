import { productService } from '@/api/productService';

describe('ProductService', () => {
  it('publishes product listing and returns digital craft passport URL', async () => {
    const result = await productService.createProduct({
      title: { en: 'Handmade Silk Saree', hi: 'सिल्क साड़ी' },
      description: { en: 'Authentic handloom', hi: 'प्रामाणिक हथकरघा' },
      craftCategoryCode: 'TEXTILE_HANDLOOM',
      sellingPrice: 3200,
      aiSuggestedPrice: 3200,
      stockQuantity: 1,
      stockType: 'READY_STOCK',
      images: [{ url: 'file:///photo.jpg', isPrimary: true }],
      tags: ['Silk', 'Handloom'],
    });

    expect(result.id).toMatch(/^prod_/);
    expect(result.status).toBe('ACTIVE');
    expect(result.passportQrUrl).toContain('passport');
    expect(result.sellingPrice).toBe(3200);
  });
});
