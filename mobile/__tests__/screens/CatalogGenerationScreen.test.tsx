import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { CatalogGenerationScreen } from '@/screens/product/CatalogGenerationScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('CatalogGenerationScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
  });

  it('renders catalog generation progress steps and transitions to pricing', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <CatalogGenerationScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('AI कैटलॉग तैयार हो रहा है')).toBeTruthy();
    expect(getByText(/फोटो स्टूडियो फिनिश/)).toBeTruthy();

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('PricingRecommendation');
    }, { timeout: 3000 });
  });
});
