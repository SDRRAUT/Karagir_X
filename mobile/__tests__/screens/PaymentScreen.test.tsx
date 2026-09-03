import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaymentScreen } from '@/screens/marketplace/PaymentScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('PaymentScreen', () => {
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

  it('renders payment options with escrow guarantee and processes pay now', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <PaymentScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('सुरक्षित भुगतान (Escrow Vault)')).toBeTruthy();
    expect(getByText(/RBI नोडल एस्क्रो/)).toBeTruthy();
    expect(getByText(/UPI/)).toBeTruthy();

    const payBtn = getByText(/का भुगतान करें/);
    await act(async () => {
      fireEvent.press(payBtn);
    });

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith(
        'OrderConfirmation',
        expect.objectContaining({ orderId: expect.any(String) })
      );
    });

    expect(useOrderStore.getState().orders.length).toBeGreaterThan(0);
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
