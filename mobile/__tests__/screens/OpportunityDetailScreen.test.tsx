import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OpportunityDetailScreen } from '@/screens/linkage/OpportunityDetailScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('OpportunityDetailScreen', () => {
  it('renders opportunity production brief and navigates to quote negotiation', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OpportunityDetailScreen
          navigation={mockNavigation}
          route={{ params: { opportunityId: 'opp_tcs_diwali_01' } } as any}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('ऑर्डर विवरण (Production Brief)')).toBeTruthy();
      expect(getByText(/टाटा कंसल्टेंसी सर्विसेज/)).toBeTruthy();
      expect(getByText(/₹25,000/)).toBeTruthy();
      expect(getByText(/30% अग्रिम भुगतान गारंटी/)).toBeTruthy();
    });

    const quoteBtn = getByText(/कोटेशन स्वीकार करें व 30% एडवांस लें/);
    await act(async () => {
      fireEvent.press(quoteBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'QuoteNegotiation',
      expect.objectContaining({ opportunityId: 'opp_tcs_diwali_01' })
    );
  });
});
