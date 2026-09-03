import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CartScreen } from '@/screens/marketplace/CartScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('CartScreen', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem({
      productId: 'prod_mhb_01',
      title: 'मधुबनी पेंटिंग',
      price: 2150,
      imageUri: 'file:///mhb.jpg',
      craftCategoryName: 'पेंटिंग',
      artisanName: 'सुनीता देवी',
      artisanCluster: 'रंती, बिहार',
      stockType: 'READY_STOCK',
    });
  });

  it('renders cart items, price breakdown, and navigates to checkout', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <CartScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/मधुबनी पेंटिंग/)).toBeTruthy();
    expect(getByText(/नोडल एस्क्रो/)).toBeTruthy();
    expect(getByText(/मूल्य सारांश/)).toBeTruthy();

    const checkoutBtn = getByText(/चेकआउट करें/);
    await act(async () => {
      fireEvent.press(checkoutBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Checkout');
  });
});
