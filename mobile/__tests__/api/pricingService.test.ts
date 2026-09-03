import { pricingService } from '@/api/pricingService';

describe('PricingService', () => {
  it('calculates fair pricing with transparent cost breakdown', async () => {
    const result = await pricingService.calculateFairPrice({
      laborHours: 24,
      materialDeclaredCost: 350,
      artisanState: 'Bihar',
    });

    expect(result.suggested_price).toBeGreaterThan(1500);
    expect(result.breakdown.material_cost).toBe(350);
    expect(result.breakdown.labor_cost).toBeGreaterThan(1000);
    expect(result.net_take_home).toBeLessThan(result.suggested_price);
    expect(result.platform_fee).toBeGreaterThan(0);
    expect(result.minimum_legal_floor).toBeLessThan(result.suggested_price);
  });
});
