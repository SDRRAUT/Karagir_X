import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { B2BContractScreen } from '@/screens/linkage/B2BContractScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useMarketLinkageStore } from '@/store/useMarketLinkageStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('B2BContractScreen', () => {
  beforeEach(() => {
    useMarketLinkageStore.getState().setActiveContract({
      contractId: 'CLUST-2026-TEST',
      opportunityId: 'opp_tcs_diwali_01',
      buyerName: 'टाटा कंसल्टेंसी सर्विसेज (TCS)',
      productTitle: 'खादी बैग',
      agreedQuota: 50,
      unitPrice: 500,
      totalContractValue: 25000,
      advancePaidAmount: 7500,
      clusterCode: 'CLUST-MHB-01',
      clusterLeadName: 'राजेंद्र पासवान',
      clusterLeadPhone: '+91 94310 88219',
      milestones: [],
      deliveryDeadline: '21 दिन',
      createdAt: new Date().toISOString(),
    });
  });

  it('renders active B2B cluster contract and allows returning to dashboard', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <B2BContractScreen
          navigation={mockNavigation}
          route={{ params: { contractId: 'CLUST-2026-TEST' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByText(/B2B क्लस्टर अनुबंध/)).toBeTruthy();
    expect(getByText(/अनुबंध सफलतापूर्वक सक्रिय हुआ/)).toBeTruthy();
    expect(getByText(/₹25,000/)).toBeTruthy();
    expect(getByText(/राजेंद्र पासवान/)).toBeTruthy();

    const homeBtn = getByText(/होम डैशबोर्ड पर जाएं/);
    await act(async () => {
      fireEvent.press(homeBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('MainTabs', { screen: 'HomeTab' });
  });
});
