import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QuoteNegotiationScreen } from '@/screens/linkage/QuoteNegotiationScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useMarketLinkageStore } from '@/store/useMarketLinkageStore';
import { MOCK_OPPORTUNITIES } from '@/api/marketLinkageService';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('QuoteNegotiationScreen', () => {
  beforeEach(() => {
    useMarketLinkageStore.getState().setActiveOpportunity(MOCK_OPPORTUNITIES[0]);
  });

  it('allows quota adjustment and submits quote contract', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <QuoteNegotiationScreen
          navigation={mockNavigation}
          route={{ params: { opportunityId: 'opp_tcs_diwali_01' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByText('कोटा व कोटेशन तय करें')).toBeTruthy();

    const increaseBtn = getByTestId('quota-increase-btn');
    await act(async () => {
      fireEvent.press(increaseBtn);
    });

    const submitBtn = getByText(/कोटेशन जमा करें व अनुबंध बनाएं/);
    await act(async () => {
      fireEvent.press(submitBtn);
    });

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith(
        'B2BContract',
        expect.objectContaining({ contractId: expect.any(String) })
      );
    });

    expect(useMarketLinkageStore.getState().activeContract?.contractId).toBeDefined();
  });
});
