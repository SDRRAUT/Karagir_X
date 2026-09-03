import { useMarketLinkageStore } from '@/store/useMarketLinkageStore';
import { MOCK_OPPORTUNITIES } from '@/api/marketLinkageService';

describe('useMarketLinkageStore', () => {
  it('sets opportunities, updates status, and sets active contract', () => {
    const store = useMarketLinkageStore.getState();

    store.setOpportunities(MOCK_OPPORTUNITIES);
    expect(useMarketLinkageStore.getState().opportunities.length).toBe(3);

    store.setActiveOpportunity(MOCK_OPPORTUNITIES[0]);
    expect(useMarketLinkageStore.getState().activeOpportunity?.id).toBe(MOCK_OPPORTUNITIES[0].id);

    store.updateOpportunityStatus(MOCK_OPPORTUNITIES[0].id, 'ASSIGNED');
    expect(
      useMarketLinkageStore.getState().opportunities.find((o) => o.id === MOCK_OPPORTUNITIES[0].id)
        ?.status
    ).toBe('ASSIGNED');

    store.setActiveContract({
      contractId: 'CLUST-2026-9012',
      opportunityId: 'opp_tcs_diwali_01',
      buyerName: 'TCS',
      productTitle: 'Khadi Sleeves',
      agreedQuota: 50,
      unitPrice: 500,
      totalContractValue: 25000,
      advancePaidAmount: 7500,
      clusterCode: 'CLUST-MHB-01',
      clusterLeadName: 'Rajendra Paswan',
      clusterLeadPhone: '+91 94310 88219',
      milestones: [],
      deliveryDeadline: '21 Days',
      createdAt: new Date().toISOString(),
    });

    expect(useMarketLinkageStore.getState().activeContract?.contractId).toBe('CLUST-2026-9012');
  });
});
