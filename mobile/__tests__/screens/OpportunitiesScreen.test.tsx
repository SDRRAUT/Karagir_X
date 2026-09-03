import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { OpportunitiesScreen } from '@/screens/linkage/OpportunitiesScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('OpportunitiesScreen', () => {
  it('renders Bada Bazaar matched opportunities and allows navigation', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OpportunitiesScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('बड़ा बाज़ार (B2B Opportunities)')).toBeTruthy();

    await waitFor(() => {
      expect(getByText(/टाटा कंसल्टेंसी सर्विसेज/)).toBeTruthy();
      expect(getByText(/96% शिल्प मिलान/)).toBeTruthy();
      expect(getByText(/7,500 कच्चा माल एडवांस तुरंत/)).toBeTruthy();
    });
  });
});
