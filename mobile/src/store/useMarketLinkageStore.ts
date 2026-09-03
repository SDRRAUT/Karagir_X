import { create } from 'zustand';
import { logger } from '@/utils/logger';

export type BuyerType = 'CORPORATE' | 'GOVERNMENT_GEM' | 'BOUTIQUE_RETAIL' | 'EXPORT';

export interface MarketOpportunity {
  id: string;
  buyerName: string;
  buyerType: BuyerType;
  buyerLogo?: string;
  rfqTitle: { hi: string; en: string };
  craftCategoryCode: string;
  craftCategoryName: string;
  totalOrderQuantity: number;
  artisanAllocatedQuota: number;
  unitRateArtisan: number;
  totalPotentialPayout: number;
  upfrontMaterialAdvance: number;
  daysToDeliver: number;
  matchConfidencePercentage: number;
  audioBriefTranscriptHi: string;
  technicalSpecs: string[];
  deadlineDate: string;
  status: 'OPEN' | 'QUOTED' | 'ASSIGNED' | 'IN_PRODUCTION' | 'COMPLETED';
}

export interface B2BMilestone {
  step: number;
  titleHi: string;
  titleEn: string;
  payoutAmount: number;
  percentage: number;
  status: 'RELEASED' | 'IN_PROGRESS' | 'LOCKED';
  descriptionHi: string;
}

export interface B2BContract {
  contractId: string;
  opportunityId: string;
  buyerName: string;
  productTitle: string;
  agreedQuota: number;
  unitPrice: number;
  totalContractValue: number;
  advancePaidAmount: number;
  clusterCode: string;
  clusterLeadName: string;
  clusterLeadPhone: string;
  milestones: B2BMilestone[];
  deliveryDeadline: string;
  createdAt: string;
}

export interface MarketLinkageState {
  opportunities: MarketOpportunity[];
  activeOpportunity: MarketOpportunity | null;
  activeContract: B2BContract | null;
  setOpportunities: (ops: MarketOpportunity[]) => void;
  setActiveOpportunity: (op: MarketOpportunity | null) => void;
  setActiveContract: (contract: B2BContract | null) => void;
  updateOpportunityStatus: (id: string, status: MarketOpportunity['status']) => void;
}

export const useMarketLinkageStore = create<MarketLinkageState>((set, get) => ({
  opportunities: [],
  activeOpportunity: null,
  activeContract: null,

  setOpportunities: (opportunities) => set({ opportunities }),

  setActiveOpportunity: (activeOpportunity) => set({ activeOpportunity }),

  setActiveContract: (activeContract) => {
    set({ activeContract });
    if (activeContract) {
      logger.info('LINKAGE_STORE', `B2B contract active: ${activeContract.contractId}`);
    }
  },

  updateOpportunityStatus: (id, status) => {
    set({
      opportunities: get().opportunities.map((op) =>
        op.id === id ? { ...op, status } : op
      ),
    });
    logger.info('LINKAGE_STORE', `Opportunity ${id} status updated to: ${status}`);
  },
}));
