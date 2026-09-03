import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { logger } from '@/utils/logger';

export interface PricingBreakdown {
  material_cost: number;
  labor_cost: number;
  complexity_fee: number;
  packaging_cost: number;
  market_demand_adjustment: number;
}

export interface PricingResult {
  suggested_price: number;
  breakdown: PricingBreakdown;
  net_take_home: number;
  platform_fee: number;
  minimum_legal_floor: number;
}

export interface CalculatePricePayload {
  craftCategoryCode?: string;
  laborHours?: number;
  materialDeclaredCost?: number;
  artisanState?: string;
}

export class PricingService {
  /**
   * Computes fair pricing suggestion and transparent cost breakdown
   */
  public async calculateFairPrice(
    payload: CalculatePricePayload
  ): Promise<PricingResult> {
    try {
      const response = await apiClient.post<PricingResult>(
        ENDPOINTS.PRICING.CALCULATE_FAIR_PRICE,
        payload
      );
      return response;
    } catch (_error) {
      logger.warn('PRICING_SERVICE', 'Remote pricing API unavailable, using local dynamic fair pricing engine');

      const hours = payload.laborHours || 24;
      const materialCost = payload.materialDeclaredCost || 350;
      // Fair living wage: ₹65/hour base labor
      const laborCost = Math.round(hours * 65);
      const complexityFee = Math.round(laborCost * 0.25);
      const packagingCost = 80;
      const marketDemand = 120;

      const subtotal = materialCost + laborCost + complexityFee + packagingCost + marketDemand;
      // Round to nearest ₹50
      const suggestedPrice = Math.round(subtotal / 50) * 50;
      const platformFee = Math.round(suggestedPrice * 0.05); // 5% sustainable platform fee
      const netTakeHome = suggestedPrice - platformFee;
      const minimumFloor = Math.round((materialCost + laborCost) * 1.05);

      return {
        suggested_price: suggestedPrice,
        breakdown: {
          material_cost: materialCost,
          labor_cost: laborCost,
          complexity_fee: complexityFee,
          packaging_cost: packagingCost,
          market_demand_adjustment: marketDemand,
        },
        net_take_home: netTakeHome,
        platform_fee: platformFee,
        minimum_legal_floor: minimumFloor,
      };
    }
  }
}

export const pricingService = new PricingService();
