import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductPreviewScreen } from '@/screens/product/ProductPreviewScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('ProductPreviewScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().setCatalogSynthesis({
      titles: { en: 'Handmade Silk Saree', hi: 'सिल्क साड़ी', bn: 'রেশম শাড়ি' },
      descriptions: { en: 'Story of silk', hi: 'सिल्क की कहानी', bn: 'রেশমের গল্প' },
      careInstructions: { en: 'Dry clean only', hi: 'केवल ड्राई क्लीन' },
      tags: ['Silk', 'Handloom'],
      craftCategoryCode: 'TEXTILE_HANDLOOM',
      craftCategoryName: 'हस्तनिर्मित साड़ी',
    });
    useProductDraftStore.getState().setFinalSellingPrice(2400);
  });

  it('renders product preview with language switching and handles publish', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <ProductPreviewScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('Handmade Silk Saree')).toBeTruthy();
    expect(getByText('₹2,400')).toBeTruthy();

    // Switch language to Hindi
    const hiTab = getByText('Hindi');
    await act(async () => {
      fireEvent.press(hiTab);
    });

    expect(getByText('सिल्क साड़ी')).toBeTruthy();

    // Tap publish button
    const publishBtn = getByText(/Publish to Store/);
    await act(async () => {
      fireEvent.press(publishBtn);
    });

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('PublishSuccess');
    });
  });
});
