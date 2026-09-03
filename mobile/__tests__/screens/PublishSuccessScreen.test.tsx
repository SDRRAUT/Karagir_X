import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PublishSuccessScreen } from '@/screens/product/PublishSuccessScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('PublishSuccessScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().setPublishedProduct({
      id: 'prod_test_123',
      status: 'ACTIVE',
      title: { en: 'Handmade Silk Saree', hi: 'सिल्क साड़ी' },
      description: { en: 'Authentic', hi: 'प्रामाणिक' },
      sellingPrice: 2400,
      passportQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kalakarsetu.in/passport/prod_test_123',
      createdAt: new Date().toISOString(),
    });
  });

  it('renders celebration screen with Digital Craft Passport and resets on go home', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <PublishSuccessScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('बधाई हो! आपका प्रोडक्ट लाइव है')).toBeTruthy();
    expect(getByText(/डिजिटल शिल्प पासपोर्ट/)).toBeTruthy();
    expect(getByText('सिल्क साड़ी')).toBeTruthy();

    const homeBtn = getByText(/होम डैशबोर्ड पर जाएं/);
    await act(async () => {
      fireEvent.press(homeBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('MainTabs', { screen: 'HomeTab' });
  });
});
