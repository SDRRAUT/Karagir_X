import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PricingRecommendationScreen } from '@/screens/product/PricingRecommendationScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('PricingRecommendationScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().setPricingResult({
      suggested_price: 2150,
      breakdown: {
        material_cost: 350,
        labor_cost: 1400,
        complexity_fee: 350,
        packaging_cost: 80,
        market_demand_adjustment: 120,
      },
      net_take_home: 2042,
      platform_fee: 108,
      minimum_legal_floor: 1650,
    });
  });

  it('renders fair pricing ledger and allows price adjustment', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <PricingRecommendationScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/उचित दाम सुझाव/)).toBeTruthy();
    expect(getByText(/कच्चा माल/)).toBeTruthy();

    const increaseBtn = getByTestId('increase-price-btn');
    await act(async () => {
      fireEvent.press(increaseBtn);
    });

    expect(useProductDraftStore.getState().finalSellingPrice).toBe(2200);

    const proceedBtn = getByText(/कैटलॉग समीक्षा करें/);
    await act(async () => {
      fireEvent.press(proceedBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProductPreview');
  });
});
