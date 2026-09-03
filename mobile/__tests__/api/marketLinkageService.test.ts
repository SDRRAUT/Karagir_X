import { marketLinkageService } from '@/api/marketLinkageService';

describe('MarketLinkageService', () => {
  it('returns AI matched institutional opportunities with sub-quotas', async () => {
    const opportunities = await marketLinkageService.getMatchedOpportunities();
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0].matchConfidencePercentage).toBeGreaterThanOrEqual(90);
    expect(opportunities[0].upfrontMaterialAdvance).toBe(7500);
  });

  it('submits negotiated quote and locks 3-tier milestone contract', async () => {
    const contract = await marketLinkageService.submitQuote({
      opportunityId: 'opp_tcs_diwali_01',
      agreedQuota: 50,
      unitPrice: 500,
      deliveryDays: 21,
    });

    expect(contract.contractId).toMatch(/^CLUST-2026-/);
    expect(contract.totalContractValue).toBe(25000);
    expect(contract.advancePaidAmount).toBe(7500); // 30% advance
    expect(contract.milestones.length).toBe(3);
    expect(contract.milestones[0].status).toBe('RELEASED');
  });

  it('allows institutional buyers to broadcast bulk RFQ', async () => {
    const rfq = await marketLinkageService.createBulkRfq({
      companyName: 'Infosys Foundation',
      contactPerson: 'Ananya Roy',
      email: 'ananya@infosys.com',
      phone: '9810012345',
      craftCategoryCode: 'PAINTING_FOLK',
      requiredQuantity: 200,
      targetBudgetPerUnit: 1200,
      deliveryDeadlineDays: 25,
      specifications: 'Authentic Madhubani paintings for annual conference',
    });

    expect(rfq.rfqId).toMatch(/^RFQ-B2B-/);
    expect(rfq.status).toBe('AI_CLUSTERING_MATCHED');
  });
});
