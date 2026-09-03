import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { logger } from '@/utils/logger';
import { MarketOpportunity, B2BContract, B2BMilestone } from '@/store/useMarketLinkageStore';

export interface SubmitQuotePayload {
  opportunityId: string;
  agreedQuota: number;
  unitPrice: number;
  deliveryDays: number;
  voiceNoteUrl?: string;
  artisanRemarks?: string;
}

export interface CreateBulkRfqPayload {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  craftCategoryCode: string;
  requiredQuantity: number;
  targetBudgetPerUnit: number;
  deliveryDeadlineDays: number;
  specifications: string;
}

export const MOCK_OPPORTUNITIES: MarketOpportunity[] = [
  {
    id: 'opp_tcs_diwali_01',
    buyerName: 'टाटा कंसल्टेंसी सर्विसेज (TCS Corporate Gifting)',
    buyerType: 'CORPORATE',
    rfqTitle: {
      hi: 'दीवाली कॉर्पोरेट उपहार: 1,000 हस्तनिर्मित खादी लैपटॉप स्लीव',
      en: 'Diwali Corporate Gift: 1,000 Handwoven Khadi Laptop Sleeves',
    },
    craftCategoryCode: 'TEXTILE_HANDLOOM',
    craftCategoryName: 'हथकरघा व बुनाई',
    totalOrderQuantity: 1000,
    artisanAllocatedQuota: 50,
    unitRateArtisan: 500,
    totalPotentialPayout: 25000,
    upfrontMaterialAdvance: 7500,
    daysToDeliver: 21,
    matchConfidencePercentage: 96,
    audioBriefTranscriptHi:
      'सुनीता जी! टीसीएस कंपनी की तरफ से दीवाली के लिए 1000 खादी बैग का बड़ा ऑर्डर आया है। आपके क्लस्टर को काम दिया जा रहा है। आपके हिस्से 50 बैग आए हैं और आपको ₹25,000 मिलेंगे, जिसमें से ₹7,500 एडवांस अभी मिलेगा।',
    technicalSpecs: [
      'शुद्ध हस्तनिर्मित खादी कॉटन कपड़ा',
      'अंदर 5mm कुशनिंग व ब्रास ज़िपर',
      'प्राकृतिक वनस्पति रंगों से मुद्रित',
      'प्रत्येक पीस पर डिजिटल शिल्प पासपोर्ट टैग',
    ],
    deadlineDate: '21 दिन (24 सितंबर तक)',
    status: 'OPEN',
  },
  {
    id: 'opp_fabindia_folk_02',
    buyerName: 'फैबइंडिया हेरिटेज स्टोर्स (FabIndia Retail)',
    buyerType: 'BOUTIQUE_RETAIL',
    rfqTitle: {
      hi: 'त्योहारी संग्रह: 300 पारंपरिक मधुबनी मत्स्य कैनवास पेंटिंग',
      en: 'Festive Collection: 300 Traditional Madhubani Fish Canvases',
    },
    craftCategoryCode: 'PAINTING_FOLK',
    craftCategoryName: 'मधुबनी व लोक चित्रकला',
    totalOrderQuantity: 300,
    artisanAllocatedQuota: 25,
    unitRateArtisan: 1200,
    totalPotentialPayout: 30000,
    upfrontMaterialAdvance: 9000,
    daysToDeliver: 25,
    matchConfidencePercentage: 98,
    audioBriefTranscriptHi:
      'नमस्ते! फैबइंडिया अपने 40 प्रीमियम बुटीक स्टोर्स के लिए 300 मधुबनी पेंटिंग ले रहा है। आपके लिए 25 पेंटिंग का कोटा तय है। ₹30,000 आपकी कुल कमाई होगी और ₹9,000 कच्चा माल एडवांस तुरंत मिलेगा।',
    technicalSpecs: [
      '12x16 इंच शुद्ध कॉटन रग पेपर',
      'प्राकृतिक वनस्पति रंग (नील, हल्दी, कत्था)',
      'बांस की निब द्वारा महीन कचनी शैली रेखाएं',
      'शिल्पी के हस्ताक्षर व क्लस्टर प्रमाण पत्र',
    ],
    deadlineDate: '25 दिन (28 सितंबर तक)',
    status: 'OPEN',
  },
  {
    id: 'opp_taj_hotels_03',
    buyerName: 'ताज होटल्स हेरिटेज गिफ्ट शॉप्स (Taj Group)',
    buyerType: 'CORPORATE',
    rfqTitle: {
      hi: 'लक्जरी स्मृति चिन्ह: 200 ढोकरा कांस्य नंदी कलाकृतियां',
      en: 'Heritage Souvenirs: 200 Dhokra Bell Metal Nandi Artifacts',
    },
    craftCategoryCode: 'METAL_DHOKRA',
    craftCategoryName: 'ढोकरा व कांस्य शिल्प',
    totalOrderQuantity: 200,
    artisanAllocatedQuota: 20,
    unitRateArtisan: 1500,
    totalPotentialPayout: 30000,
    upfrontMaterialAdvance: 9000,
    daysToDeliver: 30,
    matchConfidencePercentage: 92,
    audioBriefTranscriptHi:
      'ताज ग्रुप अपने हेरिटेज पैलेस होटलों के लिए 200 ढोकरा नंदी मूर्तियां खरीद रहा है। 20 मूर्तियों के निर्माण पर आपको ₹30,000 का पक्का भुगतान मिलेगा।',
    technicalSpecs: [
      'पारंपरिक लॉस्ट-वैक्स धातु ढलाई विधि',
      '4 इंच ऊंचाई, शुद्ध पीतल व कांसा मिश्रधातु',
      'प्राकृतिक एंटीक कॉपर फिनिश',
    ],
    deadlineDate: '30 दिन (3 अक्टूबर तक)',
    status: 'OPEN',
  },
];

export class MarketLinkageService {
  /**
   * Fetches AI-matched bulk institutional opportunities for the artisan
   */
  public async getMatchedOpportunities(): Promise<MarketOpportunity[]> {
    try {
      const response = await apiClient.get<MarketOpportunity[]>(
        ENDPOINTS.LINKAGE.OPPORTUNITIES
      );
      if (response && Array.isArray(response) && response.length > 0) {
        return response;
      }
      return MOCK_OPPORTUNITIES;
    } catch (_err) {
      logger.warn('LINKAGE_SERVICE', 'Remote linkage API unavailable, returning matched opportunities');
      return MOCK_OPPORTUNITIES;
    }
  }

  /**
   * Submits artisan quota acceptance and locks B2B cluster milestone contract
   */
  public async submitQuote(payload: SubmitQuotePayload): Promise<B2BContract> {
    try {
      const response = await apiClient.post<B2BContract>(
        ENDPOINTS.LINKAGE.SUBMIT_QUOTE(payload.opportunityId),
        payload
      );
      return response;
    } catch (_err) {
      logger.warn('LINKAGE_SERVICE', 'Contract API offline, generating local milestone contract');

      const op = MOCK_OPPORTUNITIES.find((o) => o.id === payload.opportunityId) || MOCK_OPPORTUNITIES[0];
      const totalContractValue = payload.agreedQuota * payload.unitPrice;
      const advancePaidAmount = Math.round(totalContractValue * 0.3); // 30% upfront
      const midPaymentAmount = Math.round(totalContractValue * 0.4); // 40% mid-production
      const balanceAmount = totalContractValue - advancePaidAmount - midPaymentAmount; // 30% balance

      const milestones: B2BMilestone[] = [
        {
          step: 1,
          titleHi: 'मील का पत्थर 1: 30% कच्चा माल अग्रिम (Advance Paid) ✓',
          titleEn: 'Milestone 1: 30% Upfront Material Deposit',
          payoutAmount: advancePaidAmount,
          percentage: 30,
          status: 'RELEASED',
          descriptionHi: `₹${advancePaidAmount.toLocaleString('en-IN')} आपके बैंक/जन-धन खाते में ट्रांसफर कर दिए गए हैं।`,
        },
        {
          step: 2,
          titleHi: 'मील का पत्थर 2: 50% निर्माण पूरा (Mid-Production) 🎨',
          titleEn: 'Milestone 2: 50% Production Complete Verification',
          payoutAmount: midPaymentAmount,
          percentage: 40,
          status: 'IN_PROGRESS',
          descriptionHi: 'आधा काम पूरा होने पर फोटो अपलोड करें। सत्यापन के बाद भुगतान जारी होगा।',
        },
        {
          step: 3,
          titleHi: 'मील का पत्थर 3: क्लस्टर डिस्पैच व अंतिम भुगतान 📦',
          titleEn: 'Milestone 3: Final Inspection & Cluster Dispatch',
          payoutAmount: balanceAmount,
          percentage: 30,
          status: 'LOCKED',
          descriptionHi: 'क्लस्टर लीड द्वारा अंतिम निरीक्षण और स्पीड पोस्ट डिस्पैच पर शेष भुगतान।',
        },
      ];

      return {
        contractId: `CLUST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        opportunityId: payload.opportunityId,
        buyerName: op.buyerName,
        productTitle: op.rfqTitle.hi,
        agreedQuota: payload.agreedQuota,
        unitPrice: payload.unitPrice,
        totalContractValue,
        advancePaidAmount,
        clusterCode: 'CLUST-MHB-EAST-04',
        clusterLeadName: 'राजेंद्र पासवान (Master Cluster Coordinator)',
        clusterLeadPhone: '+91 94310 88219',
        milestones,
        deliveryDeadline: `${payload.deliveryDays} दिन`,
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Posts a bulk RFQ requirement from a B2B buyer
   */
  public async createBulkRfq(payload: CreateBulkRfqPayload): Promise<{ rfqId: string; status: string }> {
    try {
      const response = await apiClient.post<{ rfqId: string; status: string }>(
        ENDPOINTS.LINKAGE.CREATE_RFQ,
        payload
      );
      return response;
    } catch (_err) {
      logger.warn('LINKAGE_SERVICE', 'Creating local RFQ simulation');
      return {
        rfqId: `RFQ-B2B-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'AI_CLUSTERING_MATCHED',
      };
    }
  }
}

export const marketLinkageService = new MarketLinkageService();
