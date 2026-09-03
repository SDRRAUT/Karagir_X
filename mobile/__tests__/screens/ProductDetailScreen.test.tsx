import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductDetailScreen } from '@/screens/marketplace/ProductDetailScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
  });

  it('renders product details with craft passport and adds to cart', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <ProductDetailScreen
          navigation={mockNavigation}
          route={{ params: { productId: 'prod_mhb_01' } } as any}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText(/हाथ से बनी मधुबनी/)).toBeTruthy();
      expect(getByText(/डिजिटल शिल्प पासपोर्ट/)).toBeTruthy();
      expect(getByText(/सुनीता देवी/)).toBeTruthy();
    });

    const addToCartBtn = getByText(/कार्ट में जोड़ें/);
    await act(async () => {
      fireEvent.press(addToCartBtn);
    });

    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].productId).toBe('prod_mhb_01');
  });
});
